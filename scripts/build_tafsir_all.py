#!/usr/bin/env python3
"""
Builds verified Warsh-aligned (Madani Akhir, 6,214 verses) Tafsir & French Translation
compressed payloads (`hizb_1.json.gz` .. `hizb_60.json.gz`) for ALL 60 Ahzab
from authentic Maliki / Awqaf-aligned open sources, enforcing strict Western numerals (0-9).

Sources:
- Al-Mukhtasar fi Tafsir al-Qur'an (Concise Arabic summary)
- Al-Muharrar al-Wajiz — Ibn 'Atiyyah al-Andalusi (Maliki, Awqaf reference #1)
- Al-Jami' li-Ahkam al-Qur'an — Imam Al-Qurtubi (Maliki, Awqaf reference #2)
- At-Tahrir wa at-Tanwir — Ibn 'Ashur (Maliki, Awqaf reference #3)
- French translation (Muhammad Hamidullah via alquran.cloud) + Mokhtasar FR (quranenc.com)
"""

import difflib
import gzip
import json
import os
import re
import time
import urllib.request

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AHZAB_DIR = os.path.join(ROOT_DIR, "src", "data", "ahzab")
TAFSIR_OUT_DIR = os.path.join(ROOT_DIR, "src", "data", "tafsir")
DEFAULT_CACHE_DIR = "/Users/fedala/.gemini/antigravity/brain/9e0a78f6-cc04-42e6-a4f0-88604e794c7a/scratch/upstream_cache"

HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"}
DIGIT_TRANS = str.maketrans("٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹", "01234567890123456789")

CANONICAL_URLS = {
    "quran_hafs": "https://api.alquran.cloud/v1/quran/quran-simple-clean",
    "fr_hamidullah": "https://api.alquran.cloud/v1/quran/fr.hamidullah",
    "mukhtasar": "https://raw.githubusercontent.com/spa5k/tafsir_api/main/tafsir/ar-tafsir-al-mukhtasar/{s}.json",
    "ibn_atiyyah": "https://raw.githubusercontent.com/spa5k/tafsir_api/main/tafsir/al-muharrar-al-wajiz-ibn-atiyyah/{s}.json",
    "qurtubi": "https://raw.githubusercontent.com/spa5k/tafsir_api/main/tafsir/ar-tafseer-al-qurtubi/{s}.json",
    "ibn_ashur": "https://raw.githubusercontent.com/spa5k/tafsir_api/main/tafsir/ar-tafseer-tahrir-al-tanwir/{s}.json",
    "fr_mokhtasar": "https://quranenc.com/api/v1/translation/sura/french_mokhtasar/{s}",
}


def load_or_fetch_json(cache_rel_path: str, url: str):
    cache_path = os.path.join(DEFAULT_CACHE_DIR, cache_rel_path)
    if os.path.exists(cache_path) and os.path.getsize(cache_path) > 10:
        with open(cache_path, "r", encoding="utf-8") as f:
            return json.load(f)
    os.makedirs(os.path.dirname(cache_path), exist_ok=True)
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=30) as resp:
                raw = resp.read().decode("utf-8")
            parsed = json.loads(raw)
            with open(cache_path, "w", encoding="utf-8") as f:
                f.write(raw)
            return parsed
        except Exception:
            if attempt == 2:
                raise
            time.sleep(0.5 * (attempt + 1))


def normalize_numerals(text: str) -> str:
    if not text:
        return ""
    return text.translate(DIGIT_TRANS)


def clean_commentary(text: str) -> str:
    if not text:
        return ""
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"<[^>]+>", "", text)
    text = normalize_numerals(text)
    # Remove scanned page stamp markers such as "(p-58)" cleanly without fusing adjacent Arabic words
    text = re.sub(r"(?:^|\n)[ \t]*\(p-\d+\)[ \t]*(?=\n|$)", "\n", text)
    text = re.sub(r"[ \t]*\(p-\d+\)[ \t]*", " ", text)
    # Remove standalone "صفحة 137" lines (Ibn 'Ashur scan stamps)
    text = re.sub(r"(?:^|\n)[ \t]*صفحة\s+\d+[ \t]*(?=\n|$)", "\n", text)
    text = re.sub(r" {2,}", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def clean_warsh_word(txt: str) -> str:
    if not txt:
        return ""
    return (
        txt.replace("\u00a0", " ")
        .replace("\u200f", "")
        .replace("\u06de", "")
        .replace("\u06e9", "")
        .replace("\u06d6", "")
        .strip()
    )


def skeleton(text: str) -> str:
    if not text:
        return ""
    t = re.sub(
        r"[\u064B-\u065F\u0670\u06D6-\u06ED\u0640\u0610-\u061A\u06E5\u06E6\s\.\,\;\:\!\?\-\(\)\[\]«»]",
        "",
        text,
    )
    t = re.sub(r"[أإآٱ]", "ا", t)
    t = t.replace("ؤ", "و").replace("ئ", "ي").replace("ء", "")
    t = t.replace("ى", "ي").replace("ة", "ه")
    return t


def sim_cost(a: str, b: str) -> float:
    if not a and not b:
        return 0.0
    if a == b:
        return 0.0
    la, lb = len(a), len(b)
    len_ratio = min(la, lb) / max(1, max(la, lb))
    if len_ratio < 0.45:
        return 0.99
    k = min(8, la, lb)
    head_match = sum(1 for x, y in zip(a[:k], b[:k]) if x == y) / max(1, k)
    tail_match = sum(1 for x, y in zip(a[-k:], b[-k:]) if x == y) / max(1, k)
    if la > 40 or lb > 40:
        if head_match < 0.5 and tail_match < 0.5:
            return 0.95
        qr = (
            difflib.SequenceMatcher(None, a[:60], b[:60]).quick_ratio() * 0.5
            + difflib.SequenceMatcher(None, a[-60:], b[-60:]).quick_ratio() * 0.5
        )
        return 1.0 - (0.3 * len_ratio + 0.7 * qr)
    r = difflib.SequenceMatcher(None, a, b).quick_ratio()
    return 1.0 - (0.3 * len_ratio + 0.7 * r)


def extract_all_warsh():
    """Returns per_hizb_orders[h] = list of keys, verses_by_surah[s][v] = entry dict, surah_titles[s]"""
    per_hizb_keys = {h: [] for h in range(1, 61)}
    verses_by_surah = {}
    surah_titles = {}

    for h in range(1, 61):
        with open(os.path.join(AHZAB_DIR, f"hizb_{h}.json"), "r", encoding="utf-8") as f:
            d = json.load(f)
        seen_in_hizb = set()
        for p in d.get("pages", []):
            ps = (p.get("page_surah_title") or "").strip()
            for l in p.get("lines", []):
                lt = (l.get("surah_title_ar") or l.get("surah_title") or ps).strip()
                for w in l.get("words", []):
                    if w.get("hizb_number") and int(w["hizb_number"]) != h:
                        continue
                    s = w.get("surah_number")
                    v = (w.get("verse") or {}).get("verse_number")
                    if not s or not v:
                        continue
                    sn, vn = int(s), int(v)
                    if lt and sn not in surah_titles:
                        surah_titles[sn] = lt
                    key = f"{sn}:{vn}"
                    if key not in seen_in_hizb:
                        seen_in_hizb.add(key)
                        per_hizb_keys[h].append(key)
                        verses_by_surah.setdefault(sn, {})[vn] = {
                            "hizb": h,
                            "surah_number": sn,
                            "verse_number": vn,
                            "words": [],
                        }
                    cw = clean_warsh_word(w.get("text", ""))
                    if cw:
                        verses_by_surah[sn][vn]["words"].append(cw)

    # Canonical names check + assemble verse_text
    surah_titles[1] = "الفاتحة"
    surah_titles[2] = "البقرة"
    for sn, vdict in verses_by_surah.items():
        for vn, info in vdict.items():
            info["surah_name"] = surah_titles.get(sn, f"سورة {sn}")
            info["verse_text"] = " ".join(info.pop("words"))

    return per_hizb_keys, verses_by_surah, surah_titles


def load_hafs_reference():
    raw = load_or_fetch_json("quran_hafs.json", CANONICAL_URLS["quran_hafs"])
    res = {}
    for s in raw["data"]["surahs"]:
        sn = int(s["number"])
        mp = {}
        for a in s["ayahs"]:
            vn = int(a["numberInSurah"])
            txt = a["text"]
            if sn not in (1, 9) and vn == 1:
                for b in (
                    "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ",
                    "بسم الله الرحمن الرحيم ",
                ):
                    if txt.startswith(b):
                        txt = txt[len(b):]
                        break
            mp[vn] = txt.strip()
        res[sn] = mp
    return res


def align_surah(sn: int, w_dict: dict, h_dict: dict):
    w_nums = sorted(w_dict.keys())
    h_nums = sorted(h_dict.keys())
    nw, nh = len(w_nums), len(h_nums)

    if sn == 1:
        return {
            0: ([1], None),
            1: ([2], None),
            2: ([3], None),
            3: ([4], None),
            4: ([5], None),
            5: ([6], None),
            6: ([7], (1, 2)),
            7: ([7], (2, 2)),
        }

    w_skels = [skeleton(w_dict[v]["verse_text"]) for v in w_nums]
    h_skels = [skeleton(h_dict[v]) for v in h_nums]

    # Exact fast shortcut only when very tight match everywhere
    if nw == nh:
        sims = [difflib.SequenceMatcher(None, w_skels[i], h_skels[i]).ratio() for i in range(nw)]
        if min(sims) >= 0.78:
            return {w_nums[i]: ([h_nums[i]], None) for i in range(nw)}

    INF = 1e9
    dp = [[INF] * (nh + 1) for _ in range(nw + 1)]
    bp = [[None] * (nh + 1) for _ in range(nw + 1)]
    dp[0][0] = 0.0
    max_delta = abs(nw - nh) + 6

    for wi in range(nw + 1):
        for hi in range(max(0, wi - max_delta), min(nh + 1, wi + max_delta + 1)):
            cur = dp[wi][hi]
            if cur >= INF:
                continue
            if wi < nw:
                ws = w_skels[wi]
                h_comb = ""
                for k in range(1, min(5, nh - hi + 1)):
                    h_comb += h_skels[hi + k - 1]
                    cost = sim_cost(ws, h_comb) + (0.0 if k == 1 else 0.02 * (k - 1))
                    if cur + cost < dp[wi + 1][hi + k]:
                        dp[wi + 1][hi + k] = cur + cost
                        bp[wi + 1][hi + k] = (wi, hi)
            if hi < nh and wi < nw:
                hs = h_skels[hi]
                w_comb = w_skels[wi]
                for k in range(2, min(5, nw - wi + 1)):
                    w_comb += w_skels[wi + k - 1]
                    cost = sim_cost(w_comb, hs) + 0.02 * (k - 1)
                    if cur + cost < dp[wi + k][hi + 1]:
                        dp[wi + k][hi + 1] = cur + cost
                        bp[wi + k][hi + 1] = (wi, hi)

    segs = []
    wi, hi = nw, nh
    while wi > 0 or hi > 0:
        pwi, phi = bp[wi][hi]
        segs.append((pwi, wi, phi, hi))
        wi, hi = pwi, phi
    segs.reverse()

    mapping = {}
    for pwi, wi, phi, hi in segs:
        ws_slice = [w_nums[i] for i in range(pwi, wi)]
        hs_slice = [h_nums[i] for i in range(phi, hi)]
        if len(ws_slice) == 1:
            mapping[ws_slice[0]] = (hs_slice, None)
        else:
            total_parts = len(ws_slice)
            for idx, wn in enumerate(ws_slice):
                mapping[wn] = (hs_slice, (idx + 1, total_parts))
    return mapping


def build_hafs_notes(sn: int, wn: int, hafs_nums: list, split_info):
    if sn == 1 and wn == 0:
        return "البسملة (العدّ الكوفي: 1:1)", "Basmala (numérotation de Koufa : 1:1)"

    if split_info is not None:
        part_idx, total_parts = split_info
        hn = hafs_nums[0]
        if part_idx == 1:
            ar_part = "الجزء الأول"
        elif part_idx == 2:
            ar_part = "الجزء الثاني"
        elif part_idx == 3:
            ar_part = "الجزء الثالث"
        else:
            ar_part = f"الجزء {part_idx}"
        return (
            f"يُوافق في العدّ الكوفي: {ar_part} من الآية {hn}",
            f"Numérotation de Koufa : verset {hn} (partie {part_idx}/{total_parts})",
        )

    if len(hafs_nums) == 1:
        hn = hafs_nums[0]
        if hn == wn:
            return f"العدّ الكوفي: الآية {hn}", ""
        return (
            f"يُوافق في العدّ الكوفي: الآية {hn}",
            f"Numérotation de Koufa : verset {hn}",
        )

    if len(hafs_nums) == 2:
        return (
            f"العدّ الكوفي: الآيتان {hafs_nums[0]} و {hafs_nums[1]} معاً",
            f"Numérotation de Koufa : versets {hafs_nums[0]} et {hafs_nums[1]} réunis",
        )

    return (
        f"العدّ الكوفي: الآيات {hafs_nums[0]} إلى {hafs_nums[-1]} معاً",
        f"Numérotation de Koufa : versets {hafs_nums[0]} à {hafs_nums[-1]} réunis",
    )


def main():
    print("Extracting all 60 Warsh Ahzab...")
    per_hizb_keys, verses_by_surah, surah_titles = extract_all_warsh()
    total_warsh = sum(len(v) for v in verses_by_surah.values())
    assert total_warsh == 6214, f"Expected 6214 Warsh verses, found {total_warsh}"
    print(f"Verified {total_warsh} Warsh verses across {len(verses_by_surah)} Surahs and 60 Ahzab.")

    hafs_ref = load_hafs_reference()
    print("Aligning all 114 Surahs (Warsh Madani Akhir -> Hafs Kufi)...")
    alignments = {sn: align_surah(sn, verses_by_surah[sn], hafs_ref[sn]) for sn in range(1, 115)}

    print("Loading French Hamidullah corpus...")
    ham_raw = load_or_fetch_json("fr_hamidullah.json", CANONICAL_URLS["fr_hamidullah"])["data"]["surahs"]
    fr_ham = {
        int(s["number"]): {
            int(a["numberInSurah"]): normalize_numerals(a["text"]).strip()
            for a in s["ayahs"]
        }
        for s in ham_raw
    }

    editions = ("mukhtasar", "ibn_atiyyah", "qurtubi", "ibn_ashur")
    tafsir_data = {ed: {} for ed in editions}
    fr_mok = {}

    print("Loading cleaned Arabic Tafsir editions & French Al-Mokhtasar across 114 Surahs...")
    for sn in range(1, 115):
        for ed in editions:
            obj = load_or_fetch_json(f"{ed}/{sn}.json", CANONICAL_URLS[ed].format(s=sn))
            items = obj if isinstance(obj, list) else obj.get("ayahs", [])
            tafsir_data[ed][sn] = {int(x["ayah"]): clean_commentary(x.get("text", "")) for x in items}

        mk_obj = load_or_fetch_json(f"fr_mokhtasar/{sn}.json", CANONICAL_URLS["fr_mokhtasar"].format(s=sn))
        fr_mok[sn] = {
            int(x["aya"]): normalize_numerals(x.get("translation", "")).strip()
            for x in mk_obj.get("result", [])
        }

    sources_meta = {
        "mukhtasar": {
            "label": "المختصر",
            "full_title": "المختصر في تفسير القرآن الكريم",
        },
        "ibn_atiyyah": {
            "label": "ابن عطية",
            "full_title": "المحرر الوجيز في تفسير الكتاب العزيز — الإمام ابن عطية الأندلسي",
        },
        "qurtubi": {
            "label": "القرطبي",
            "full_title": "الجامع لأحكام القرآن — الإمام القرطبي المالكي",
        },
        "ibn_ashur": {
            "label": "ابن عاشور",
            "full_title": "التحرير والتنوير — العلامة محمد الطاهر بن عاشور",
        },
        "french": {
            "label": "Français",
            "full_title": "Traduction Muhammad Hamidullah & Al-Mokhtasar",
        },
    }

    os.makedirs(TAFSIR_OUT_DIR, exist_ok=True)
    # Remove stale uncompressed preview file if present
    stale_h1 = os.path.join(TAFSIR_OUT_DIR, "hizb_1.json")
    if os.path.exists(stale_h1):
        os.remove(stale_h1)
        print(f"Removed legacy {stale_h1}")

    total_gz_bytes = 0
    total_raw_bytes = 0
    leftover_digits_total = 0

    for h in range(1, 61):
        ordered_keys = per_hizb_keys[h]
        targets = (["1:0"] + ordered_keys) if h == 1 else ordered_keys
        output_verses = {}

        for key in targets:
            if key == "1:0":
                sn, wn = 1, 0
                surah_name = "الفاتحة"
                verse_text = "بِسْمِ اِ۬للَّهِ اِ۬لرَّحْمَٰنِ اِ۬لرَّحِيمِ"
                warsh_ref = "البسملة"
            else:
                sn_s, wn_s = key.split(":")
                sn, wn = int(sn_s), int(wn_s)
                info = verses_by_surah[sn][wn]
                surah_name = info["surah_name"]
                verse_text = info["verse_text"]
                warsh_ref = f"{surah_name} • الآية {wn}"

            hafs_nums, split_info = alignments[sn][wn]
            hafs_note, fr_note = build_hafs_notes(sn, wn, hafs_nums, split_info)

            entry = {
                "key": key,
                "surah_number": sn,
                "verse_number": wn,
                "surah_name": surah_name,
                "warsh_ref": warsh_ref,
                "hafs_note": hafs_note,
                "verse_text": verse_text,
            }
            if fr_note:
                entry["fr_note"] = fr_note

            for field in editions:
                chunks = [tafsir_data[field][sn].get(hn, "") for hn in hafs_nums]
                chunks = [c for c in chunks if c]
                if len(chunks) >= 2 and field != "mukhtasar":
                    if sn == 2 and wn == 1 and len(chunks) == 2:
                        joined = f"【 الحروف المقطعة (الم) 】\n{chunks[0]}\n\n━━━━━━━━━━\n\n【 ذلك الكتاب لا ريب فيه 】\n{chunks[1]}"
                    else:
                        labeled = [
                            f"【 الآية {hn} في العدّ الكوفي 】\n{c}"
                            for hn, c in zip(hafs_nums, chunks)
                        ]
                        joined = "\n\n━━━━━━━━━━\n\n".join(labeled)
                else:
                    joined = "\n\n".join(chunks)
                entry[field] = joined

            if sn == 1 and split_info is not None:
                full_fr = fr_ham[1][7]
                if ", non pas " in full_fr:
                    p1, p2 = full_fr.split(", non pas ", 1)
                    entry["fr_translation"] = (p1 + ",") if split_info[0] == 1 else ("non pas " + p2)
                else:
                    entry["fr_translation"] = full_fr
            else:
                entry["fr_translation"] = " ".join(
                    fr_ham[sn].get(hn, "") for hn in hafs_nums if fr_ham[sn].get(hn)
                ).strip()

            entry["fr_mokhtasar"] = "\n\n".join(
                fr_mok[sn].get(hn, "") for hn in hafs_nums if fr_mok[sn].get(hn)
            ).strip()

            output_verses[key] = entry

        payload = {
            "hizb_number": h,
            "riwaya": "ورش عن نافع من طريق الأزرق (العدّ المدني الأخير)",
            "sources": sources_meta,
            "ordered_keys": ordered_keys,
            "verses": output_verses,
        }

        raw_str = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
        leftover_digits_total += len(re.findall(r"[٠-٩۰-۹]", raw_str))
        raw_bytes = raw_str.encode("utf-8")
        gz_bytes = gzip.compress(raw_bytes, compresslevel=9)

        out_path = os.path.join(TAFSIR_OUT_DIR, f"hizb_{h}.json.gz")
        with open(out_path, "wb") as f:
            f.write(gz_bytes)

        total_raw_bytes += len(raw_bytes)
        total_gz_bytes += len(gz_bytes)

    print(f"\nGenerated 60 compressed Hizb bundles in {TAFSIR_OUT_DIR}")
    print(f"Total uncompressed JSON: {total_raw_bytes / (1024 * 1024):.2f} MB")
    print(f"Total gzip-9 compressed: {total_gz_bytes / (1024 * 1024):.2f} MB")
    print(f"Leftover Eastern/Persian digits across ALL 60 Ahzab: {leftover_digits_total}")
    assert leftover_digits_total == 0, "Found non-Western digits!"


if __name__ == "__main__":
    main()
