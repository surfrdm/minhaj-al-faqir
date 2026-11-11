import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import booksIndexJson from '@/data/turath_books/index.json';
import type {
  ClassicalBookSlug,
  TurathBookChunkMeta,
  TurathBookEntry,
  TurathBookSearchHit,
  TurathBooksIndexData,
} from '@/types/turath-books';

interface StoredChunkFile {
  meta: TurathBookChunkMeta;
  entries: TurathBookEntry[];
}

const VALID_BOOKS = new Set<ClassicalBookSlug>(['safwat', 'hilya', 'isaba']);
const MAX_GLOBAL_RESULTS = 50;
const MAX_SCOPED_RESULTS = 80;
const MAX_CHUNK_CACHE = 8;
const EXCERPT_THRESHOLD_CHARS = 2200;

const booksOverview = booksIndexJson as TurathBooksIndexData;
const chunkCache = new Map<string, StoredChunkFile>();

function getBookChunkCount(book: ClassicalBookSlug): number {
  const found = booksOverview.books.find((b) => b.slug === book);
  return found ? found.totalChunks : 0;
}

function normalizeForSearch(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[«»"'()\[\]{}،؛:.؟!\-\/◆❖]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function splitTokens(normalizedQuery: string): string[] {
  return normalizedQuery.split(' ').filter((tok) => tok.length > 0);
}

function matchesAllTokens(haystack: string, tokens: string[]): boolean {
  if (tokens.length === 0) return false;
  for (let i = 0; i < tokens.length; i++) {
    if (!haystack.includes(tokens[i])) return false;
  }
  return true;
}

const BOOK_DIRS: Record<ClassicalBookSlug, string> = {
  safwat: path.join(process.cwd(), 'src', 'data', 'turath_books', 'safwat'),
  hilya: path.join(process.cwd(), 'src', 'data', 'turath_books', 'hilya'),
  isaba: path.join(process.cwd(), 'src', 'data', 'turath_books', 'isaba'),
};

function readChunkFromDisk(
  book: ClassicalBookSlug,
  chunkId: number
): StoredChunkFile | null {
  const baseDir = BOOK_DIRS[book];
  if (!baseDir) return null;
  const filePath = path.join(baseDir, `chunk_${chunkId}.json.gz`);
  if (!fs.existsSync(filePath)) return null;
  const compressed = fs.readFileSync(filePath);
  const jsonText = zlib.gunzipSync(compressed).toString('utf-8');
  return JSON.parse(jsonText) as StoredChunkFile;
}

function getCachedChunk(
  book: ClassicalBookSlug,
  chunkId: number
): StoredChunkFile | null {
  const cacheKey = `${book}:${chunkId}`;
  const existing = chunkCache.get(cacheKey);
  if (existing) {
    // Refresh recency order for bounded LRU eviction
    chunkCache.delete(cacheKey);
    chunkCache.set(cacheKey, existing);
    return existing;
  }

  const loaded = readChunkFromDisk(book, chunkId);
  if (!loaded) return null;

  if (chunkCache.size >= MAX_CHUNK_CACHE) {
    const oldestKey = chunkCache.keys().next().value;
    if (oldestKey) {
      chunkCache.delete(oldestKey);
    }
  }
  chunkCache.set(cacheKey, loaded);
  return loaded;
}

function buildExcerptForSearch(
  entry: TurathBookEntry,
  tokens: string[]
): TurathBookEntry {
  if (entry.text_ar.length <= EXCERPT_THRESHOLD_CHARS) {
    return entry;
  }

  // Locate first token roughly inside original text by scanning small windows on stripped text
  let anchorPos = 0;
  if (tokens.length > 0) {
    const targetToken = tokens[0];
    // Slide 4000-char chunks or fallback quickly on plain stripped match
    const strippedFull = normalizeForSearch(entry.text_ar);
    const matchRatioIdx = strippedFull.indexOf(targetToken);
    if (matchRatioIdx > 0 && strippedFull.length > 0) {
      anchorPos = Math.floor(
        (matchRatioIdx / strippedFull.length) * entry.text_ar.length
      );
    }
  }

  const start = Math.max(0, anchorPos - 550);
  const end = Math.min(entry.text_ar.length, start + 1700);
  let excerpt = entry.text_ar.slice(start, end).trim();
  if (start > 0) excerpt = `... ${excerpt}`;
  if (end < entry.text_ar.length) excerpt = `${excerpt} ...`;

  return {
    ...entry,
    text_ar: excerpt,
    isExcerpt: true,
    fullCharCount: entry.text_ar.length,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawBook = (searchParams.get('book') || 'safwat').trim();
    if (!VALID_BOOKS.has(rawBook as ClassicalBookSlug)) {
      return NextResponse.json(
        { error: "Invalid book slug. Expected 'safwat', 'hilya', or 'isaba'." },
        { status: 400 }
      );
    }

    const book = rawBook as ClassicalBookSlug;
    const totalChunks = getBookChunkCount(book);
    const query = (searchParams.get('q') || '').trim();
    const rawChunk = (searchParams.get('chunk') || '0').trim();
    const entryId = (searchParams.get('entryId') || '').trim();

    // 1. Single full-entry lookup (allows expanding large biographies smoothly)
    if (entryId) {
      const chunkId = parseInt(rawChunk, 10);
      if (Number.isNaN(chunkId) || chunkId < 0 || chunkId >= totalChunks) {
        return NextResponse.json(
          { error: `Invalid chunk number (0-${Math.max(0, totalChunks - 1)}).` },
          { status: 400 }
        );
      }
      const chunkData = getCachedChunk(book, chunkId);
      if (!chunkData) {
        return NextResponse.json({ error: 'Chunk not found.' }, { status: 404 });
      }
      const entry = chunkData.entries.find((e) => e.id === entryId);
      if (!entry) {
        return NextResponse.json({ error: 'Entry not found.' }, { status: 404 });
      }
      return NextResponse.json(
        {
          book,
          meta: chunkData.meta,
          entry,
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
          },
        }
      );
    }

    // 2. Search across single chunk or full book (with title hits prioritized first)
    if (query.length > 0) {
      if (query.length < 2 && !/^\d+$/.test(query)) {
        return NextResponse.json(
          { error: 'Search query must be at least 2 characters.' },
          { status: 400 }
        );
      }

      let chunkFilter: number | 'all' = 'all';
      if (rawChunk !== 'all') {
        const parsedChunk = parseInt(rawChunk, 10);
        if (Number.isNaN(parsedChunk) || parsedChunk < 0 || parsedChunk >= totalChunks) {
          return NextResponse.json(
            { error: `Invalid chunk filter (0-${Math.max(0, totalChunks - 1)}).` },
            { status: 400 }
          );
        }
        chunkFilter = parsedChunk;
      }

      const normQ = normalizeForSearch(query);
      const queryTokens = splitTokens(normQ);
      const numericMatch = query.replace(/^#|رقم\s*/i, '').trim();
      const targetNumStr = /^\d+$/.test(numericMatch) ? numericMatch : null;

      const maxResults =
        chunkFilter === 'all' ? MAX_GLOBAL_RESULTS : MAX_SCOPED_RESULTS;

      const titleHits: TurathBookSearchHit[] = [];
      const bodyHits: TurathBookSearchHit[] = [];
      let totalMatches = 0;

      const startChunk = chunkFilter === 'all' ? 0 : chunkFilter;
      const endChunk = chunkFilter === 'all' ? totalChunks - 1 : chunkFilter;

      for (let cid = startChunk; cid <= endChunk; cid++) {
        // Use LRU cache for single-chunk queries; stream directly on global scans to avoid cache thrashing
        const chunkData =
          chunkFilter === 'all'
            ? readChunkFromDisk(book, cid)
            : getCachedChunk(book, cid);
        if (!chunkData) continue;

        for (const entry of chunkData.entries) {
          const isExactNumberHit =
            targetNumStr !== null &&
            (entry.entryNumber === targetNumStr ||
              String(entry.orderInChunk) === targetNumStr);

          if (isExactNumberHit) {
            totalMatches++;
            if (titleHits.length < maxResults) {
              titleHits.push({
                chunkId: cid,
                chunkLabel: chunkData.meta.chunkLabel,
                entry: buildExcerptForSearch(entry, queryTokens),
              });
            }
            continue;
          }

          if (targetNumStr !== null && query.length <= 3) {
            continue;
          }

          if (queryTokens.length === 0) continue;

          const normTitle = normalizeForSearch(
            `${entry.title_ar} ${entry.sectionPath_ar}`
          );
          if (matchesAllTokens(normTitle, queryTokens)) {
            totalMatches++;
            if (titleHits.length < maxResults) {
              titleHits.push({
                chunkId: cid,
                chunkLabel: chunkData.meta.chunkLabel,
                entry: buildExcerptForSearch(entry, queryTokens),
              });
            }
            continue;
          }

          const normFull = `${normTitle} ${normalizeForSearch(entry.text_ar)}`;
          if (matchesAllTokens(normFull, queryTokens)) {
            totalMatches++;
            if (titleHits.length + bodyHits.length < maxResults) {
              bodyHits.push({
                chunkId: cid,
                chunkLabel: chunkData.meta.chunkLabel,
                entry: buildExcerptForSearch(entry, queryTokens),
              });
            }
          }
        }
      }

      const combined = [...titleHits, ...bodyHits].slice(0, maxResults);

      return NextResponse.json(
        {
          book,
          query,
          chunkFilter,
          totalMatches,
          truncated: totalMatches > combined.length,
          results: combined,
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        }
      );
    }

    // 3. Paginated chunk browse
    const chunkId = parseInt(rawChunk, 10);
    if (Number.isNaN(chunkId) || chunkId < 0 || chunkId >= totalChunks) {
      return NextResponse.json(
        { error: `Invalid chunk number (0-${Math.max(0, totalChunks - 1)}).` },
        { status: 400 }
      );
    }

    const chunkData = getCachedChunk(book, chunkId);
    if (!chunkData) {
      return NextResponse.json({ error: 'Chunk not found.' }, { status: 404 });
    }

    const parsedLimit = parseInt(searchParams.get('limit') || '25', 10);
    const limit = Number.isNaN(parsedLimit)
      ? 25
      : Math.min(Math.max(parsedLimit, 1), 50);

    const totalEntries = chunkData.entries.length;
    const totalPages = Math.max(1, Math.ceil(totalEntries / limit));

    const parsedPage = parseInt(searchParams.get('page') || '1', 10);
    const page = Number.isNaN(parsedPage)
      ? 1
      : Math.min(Math.max(parsedPage, 1), totalPages);

    const startIdx = (page - 1) * limit;
    const entries = chunkData.entries.slice(startIdx, startIdx + limit);

    return NextResponse.json(
      {
        book,
        meta: chunkData.meta,
        page,
        limit,
        totalEntries,
        totalPages,
        entries,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', message },
      { status: 500 }
    );
  }
}
