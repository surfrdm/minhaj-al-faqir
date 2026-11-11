#!/usr/bin/env node
/**
 * Generates the compact pre-recorded Gemini TTS MP3 demo for
 * Companion #1 (Mus'ab ibn Umayr) in Rijal Hawl Al-Rasul section.
 *
 * Usage:
 *   GEMINI_API_KEY="AIza..." node tools/generate_rijal_demo.mjs
 * (Automatically reads GEMINI_API_KEY from .env.local or process.env.)
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const ENV_LOCAL = path.join(ROOT, ".env.local");
const DATA_PATH = path.join(ROOT, "src/data/rijal_hawl_rasul.json");
const OUT_DIR = path.join(ROOT, "public/audio/demo");
const OUT_WAV = path.join(OUT_DIR, "rijal-musab-demo.wav");
const OUT_MP3 = path.join(OUT_DIR, "rijal-musab-demo.mp3");

function readApiKey() {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) {
    return process.env.GEMINI_API_KEY.trim();
  }
  if (fs.existsSync(ENV_LOCAL)) {
    const raw = fs.readFileSync(ENV_LOCAL, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*GEMINI_API_KEY\s*=\s*(.+)$/);
      if (m) {
        return m[1].trim().replace(/^["']|["']$/g, "");
      }
    }
  }
  return "";
}

function createWavBufferFromPcm(pcmBuffer, sampleRate = 24000, channels = 1, bitsPerSample = 16) {
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  const blockAlign = (channels * bitsPerSample) / 8;
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);
  return Buffer.concat([header, pcmBuffer]);
}

async function main() {
  const apiKey = readApiKey();
  if (!apiKey) {
    console.error("ERROR: GEMINI_API_KEY not found in environment or .env.local.");
    console.error("Add GEMINI_API_KEY=your_key to .env.local then run: node tools/generate_rijal_demo.mjs");
    process.exit(1);
  }

  const dataset = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  const musab = dataset.companions.find((c) => c.id === "musab-ibn-umayr") || dataset.companions[0];
  const ep1 = musab.story_episodes?.[0];

  const excerpt = [
    `${musab.name_ar}، ${musab.epithet_ar}.`,
    ep1 ? `${ep1.heading}: ${ep1.text}` : musab.bio_summary,
  ]
    .filter(Boolean)
    .join(" ");

  console.log(`Synthesizing Gemini TTS excerpt for "${musab.name_ar}" (${excerpt.length} chars)...`);

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `اقرأ هذا النص من كتاب رجال حول الرسول قراءة عربية فصحى متزنة وواضحة ومؤثرة مع مراعاة مخارج الحروف والوقف:\n\n${excerpt}`,
              },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: "Charon",
              },
            },
          },
        },
      }),
    }
  );

  if (!response.ok) {
    const errTxt = await response.text();
    console.error(`Gemini API returned HTTP ${response.status}:`);
    console.error(errTxt);
    process.exit(2);
  }

  const json = await response.json();
  const part = json?.candidates?.[0]?.content?.parts?.[0]?.inlineData;
  if (!part?.data) {
    console.error("No inline audio payload returned from Gemini API.");
    process.exit(3);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const rawPcm = Buffer.from(part.data, "base64");
  const wavBuf = createWavBufferFromPcm(rawPcm, 24000, 1, 16);
  fs.writeFileSync(OUT_WAV, wavBuf);

  const ffmpegBin = fs.existsSync("/opt/homebrew/bin/ffmpeg") ? "/opt/homebrew/bin/ffmpeg" : "ffmpeg";
  execFileSync(
    ffmpegBin,
    [
      "-y",
      "-hide_banner",
      "-loglevel",
      "error",
      "-i",
      OUT_WAV,
      "-ac",
      "1",
      "-ar",
      "24000",
      "-c:a",
      "libmp3lame",
      "-b:a",
      "48k",
      "-metadata",
      `title=${musab.name_ar} - رجال حول الرسول`,
      "-metadata",
      "artist=منهاج الفقير (Gemini AI TTS)",
      OUT_MP3,
    ],
    { stdio: "inherit" }
  );

  fs.unlinkSync(OUT_WAV);
  const stat = fs.statSync(OUT_MP3);
  console.log(`SUCCESS: Generated ${OUT_MP3} (${(stat.size / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
