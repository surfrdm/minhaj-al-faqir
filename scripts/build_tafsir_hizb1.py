#!/usr/bin/env python3
"""
Builds verified Warsh-aligned Tafsir & French Translation JSON for Hizb 1
from authentic Maliki / Awqaf-aligned open sources, enforcing Western numerals (0-9).

Sources:
- Al-Mukhtasar fi Tafsir al-Qur'an (Concise Arabic summary)
- Al-Muharrar al-Wajiz — Ibn 'Atiyyah al-Andalusi (Maliki, Awqaf reference #1)
- Al-Jami' li-Ahkam al-Qur'an — Imam Al-Qurtubi (Maliki, Awqaf reference #2)
- At-Tahrir wa at-Tanwir — Ibn 'Ashur (Maliki, Awqaf reference #3)
- French translation (Muhammad Hamidullah via alquran.cloud) + Mokhtasar FR (quranenc.com)
"""

import json
import os
import re
import urllib.request

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HIZB1_PATH = os.path.join(ROOT_DIR, "src", "data", "ahzab", "hizb_1.json")
OUT_PATH = os.path.join(ROOT_DIR, "src", "data", "tafsir", "hizb_1.json")

HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"}

DIGIT_TRANS = str.maketrans("٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹", "01234567890123456789")


def fetch_json(url: str):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


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
    # Remove scanned page stamp headers such as "(p-58)" or standalone "صفحة 137"
    text = re.sub(r"^\s*\(p-\d+\)\s*", "", text)
    text = re.sub(r"(?:^|\n)\s*صفحة\s+\d+\s*(?=\n|$)", "\n", text)
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


def extract_warsh_verses_hizb1():
    with open(HIZB1_PATH, "r", encoding="utf-8") as f:
        h1 = json.load(f)

    ordered_keys = []
    verses_map = {}

    for p in h1.get("pages", []):
        for line in p.get("lines", []):
            surah_ar = line.get("surah_title_ar") or line.get("surah_title") or p.get("page_surah_title") or ""
            for w in line.get("words", []):
                if w.get("hizb_number") and int(w["hizb_number"]) != 1:
                    continue
                s = w.get("surah_number")
                v = (w.get("verse") or {}).get("verse_number")
                if not s or not v:
                    continue
                s_num, v_num = int(s), int(v)
                key = f"{s_num}:{v_num}"
                if key not in verses_map:
                    ordered_keys.append(key)
                    verses_map[key] = {
                        "surah_number": s_num,
                        "verse_number": v_num,
                        "surah_name": surah_ar,
                        "words": [],
                    }
                cw = clean_warsh_word(w.get("text", ""))
                if cw:
                    verses_map[key]["words"].append(cw)

    # Fix surah titles cleanly
    for k, info in verses_map.items():
        if info["surah_number"] == 1:
            info["surah_name"] = "الفاتحة"
        elif info["surah_number"] == 2:
            info["surah_name"] = "البقرة"
        info["verse_text"] = " ".join(info.pop("words"))

    return ordered_keys, verses_map


def main():
    print("Reading Warsh Hizb 1 verse structure...")
    ordered_keys, verses_map = extract_warsh_verses_hizb1()
    print(f"Found {len(ordered_keys)} numbered Warsh verses in Hizb 1.")

    editions = {
        "mukhtasar": "ar-tafsir-al-mukhtasar",
        "ibn_atiyyah": "al-muharrar-al-wajiz-ibn-atiyyah",
        "qurtubi": "ar-tafseer-al-qurtubi",
        "ibn_ashur": "ar-tafseer-tahrir-al-tanwir",
    }

    tafsir_raw = {}
    for field, slug in editions.items():
        print(f"Fetching {slug} (Surahs 1 & 2)...")
        s1 = fetch_json(f"https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/{slug}/1.json")
        s2 = fetch_json(f"https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/{slug}/2.json")
        tafsir_raw[field] = {
            1: {int(a["ayah"]): clean_commentary(a.get("text", "")) for a in s1},
            2: {int(a["ayah"]): clean_commentary(a.get("text", "")) for a in s2},
        }

    print("Fetching French translations (Hamidullah & Mokhtasar FR)...")
    fr_ham = {}
    fr_mok = {}
    for s_num in (1, 2):
        hd = fetch_json(f"https://api.alquran.cloud/v1/surah/{s_num}/fr.hamidullah")
        fr_ham[s_num] = {
            int(a["numberInSurah"]): normalize_numerals(a["text"]).strip()
            for a in hd["data"]["ayahs"]
        }
        mk = fetch_json(f"https://quranenc.com/api/v1/translation/sura/french_mokhtasar/{s_num}")
        fr_mok[s_num] = {
            int(a["aya"]): normalize_numerals(a["translation"]).strip()
            for a in mk["result"]
        }

    def get_hafs_mapping(s_num: int, v_num: int):
        """
        Exact Warsh (Madani Akhir) -> Hafs (Kufi) mapping for Hizb 1.
        Returns (list_of_hafs_verses, alignment_note_ar, split_part)
        """
        if s_num == 1:
            if v_num == 0:
                return [1], "البسملة (العدّ الكوفي: 1:1)", None
            if 1 <= v_num <= 5:
                return [v_num + 1], f"العدّ الكوفي: الآية {v_num + 1}", None
            if v_num == 6:
                return [7], "يُوافق في العدّ الكوفي: الجزء الأول من الآية 7", "part1"
            if v_num == 7:
                return [7], "يُوافق في العدّ الكوفي: الجزء الثاني من الآية 7", "part2"
        elif s_num == 2:
            if v_num == 1:
                return [1, 2], "العدّ الكوفي: الآيتان 1 و 2 معاً", None
            return [v_num + 1], f"العدّ الكوفي: الآية {v_num + 1}", None
        raise ValueError(f"Unexpected coordinate {s_num}:{v_num}")

    output_verses = {}

    # Optional clickable entry for Al-Fatiha Basmala (1:0)
    all_targets = ["1:0"] + ordered_keys
    for key in all_targets:
        if key == "1:0":
            s_num, v_num = 1, 0
            surah_name = "الفاتحة"
            verse_text = "بِسْمِ اِ۬للَّهِ اِ۬لرَّحْمَٰنِ اِ۬لرَّحِيمِ"
            warsh_ref = "البسملة"
        else:
            info = verses_map[key]
            s_num = info["surah_number"]
            v_num = info["verse_number"]
            surah_name = info["surah_name"]
            verse_text = info["verse_text"]
            warsh_ref = f"{surah_name} • الآية {v_num}"

        hafs_nums, hafs_note, split_part = get_hafs_mapping(s_num, v_num)

        # Assemble commentary fields
        entry = {
            "key": key,
            "surah_number": s_num,
            "verse_number": v_num,
            "surah_name": surah_name,
            "warsh_ref": warsh_ref,
            "hafs_note": hafs_note,
            "verse_text": verse_text,
        }

        for field in ("mukhtasar", "ibn_atiyyah", "qurtubi", "ibn_ashur"):
            chunks = [tafsir_raw[field][s_num].get(hn, "") for hn in hafs_nums]
            chunks = [c for c in chunks if c]
            if len(chunks) == 2 and s_num == 2 and v_num == 1:
                if field == "mukhtasar":
                    joined = chunks[0] + "\n\n" + chunks[1]
                else:
                    joined = f"【 الحروف المقطعة (الم) 】\n{chunks[0]}\n\n━━━━━━━━━━\n\n【 ذلك الكتاب لا ريب فيه 】\n{chunks[1]}"
            else:
                joined = "\n\n".join(chunks)
            entry[field] = joined

        # French translation (exact split for Fatiha 1:6 & 1:7, joined cleanly for Baqara 2:1)
        if s_num == 1 and split_part is not None:
            full_fr = fr_ham[1][7]
            if ", non pas " in full_fr:
                p1, p2 = full_fr.split(", non pas ", 1)
                entry["fr_translation"] = (p1 + ",") if split_part == "part1" else ("non pas " + p2)
            else:
                entry["fr_translation"] = full_fr
        else:
            entry["fr_translation"] = " ".join(fr_ham[s_num].get(hn, "") for hn in hafs_nums).strip()

        # Strip Al-Fatiha Basmala prefix if Hamidullah wasn't prepended, or keep clean
        entry["fr_mokhtasar"] = "\n\n".join(
            fr_mok[s_num].get(hn, "") for hn in hafs_nums if fr_mok[s_num].get(hn)
        ).strip()

        output_verses[key] = entry

    payload = {
        "hizb_number": 1,
        "riwaya": "ورش عن نافع من طريق الأزرق (العدّ المدني الأخير)",
        "sources": {
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
        },
        "ordered_keys": ordered_keys,
        "verses": output_verses,
    }

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    raw_json = open(OUT_PATH, "r", encoding="utf-8").read()
    leftover_digits = re.findall(r"[٠-٩۰-۹]", raw_json)
    size_mb = os.path.getsize(OUT_PATH) / (1024 * 1024)
    print(f"Saved {OUT_PATH} ({size_mb:.2f} MB, {len(output_verses)} entries, leftover Eastern digits: {len(leftover_digits)})")


if __name__ == "__main__":
    main()
