#!/usr/bin/env python3
"""
Générateur des 60 tranches Ahzab pour le mode d'affichage « الخط المحمدي الرسمي » (M6).

Principe :
- Lit en lecture seule la source officielle brute :
    src/data/mushaf_mohammadi_officiel_m6.json
- Récupère les noms propres des 114 sourates depuis src/data/ahzab/hizb_1..60.json
- Préserve à 100 % le texte original encodé pour la police AALMAGHRIBI.woff2
  (y compris ligatures calligraphiques, kashidas, et marques Waqf Al-Habti U+0610)
- Isole proprement la Basmala M6 authentique sous chaque bannière de sourate (sauf 9)
  tout en transférant le marqueur `is_first_tomon` si nécessaire
- Exporte 60 fichiers compacts compressés :
    src/data/ahzab_m6/hizb_{1..60}.json.gz
"""

import copy
import gzip
import json
import os
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
M6_PATH = os.path.join(ROOT, "src", "data", "mushaf_mohammadi_officiel_m6.json")
W_AHZAB_DIR = os.path.join(ROOT, "src", "data", "ahzab")
OUT_M6_DIR = os.path.join(ROOT, "src", "data", "ahzab_m6")


def load_clean_surah_names() -> dict[int, str]:
    names: dict[int, str] = {}
    for h in range(1, 61):
        p = os.path.join(W_AHZAB_DIR, f"hizb_{h}.json")
        with open(p, "r", encoding="utf-8") as f:
            data = json.load(f)
        for pg in data["pages"]:
            for ln in pg["lines"]:
                s_num = ln.get("surah_number")
                s_name = ln.get("surah_title_ar") or ln.get("surah_title")
                if s_num and s_name:
                    names.setdefault(int(s_num), s_name.strip())
                for w in ln.get("words") or []:
                    ws = w.get("surah_number")
                    if ws and s_name and int(ws) == int(s_num or ws):
                        names.setdefault(int(ws), s_name.strip())
    assert len(names) == 114, f"Expected 114 clean surah names, got {len(names)}"
    return names


def main():
    print("📖 Chargement du Mushaf Mohammadi M6 (lecture seule)...")
    with open(M6_PATH, "r", encoding="utf-8") as f:
        m6 = json.load(f)

    surah_names = load_clean_surah_names()

    # 1. Regrouper les mots M6 par verset (s, v) et repérer les Basmalas M6 natives
    m6_verses = defaultdict(list)
    surah_max_verse = defaultdict(int)
    for page in m6["pages"]:
        for line in page["lines"]:
            for w in line.get("words") or []:
                s = int(w["surah_number"])
                v = int(w["verse"]["verse_number"])
                m6_verses[(s, v)].append(w)
                if v > surah_max_verse[s]:
                    surah_max_verse[s] = v

    surah_basmala_m6: dict[int, str] = {}
    word_action: dict[str, dict] = {}
    total_tomon = 0
    total_last_word = 0
    total_habti = 0

    for (s, v) in sorted(m6_verses.keys()):
        mw_all = m6_verses[(s, v)]
        has_basmala = (v == 1 and s != 9)

        if has_basmala:
            basmala_part = mw_all[:4]
            mw_body = mw_all[4:]
            surah_basmala_m6[s] = " ".join(bw["text"].replace("\u200f", "").strip() for bw in basmala_part)
            transferred_tomon = any(bw.get("is_first_tomon") == "1" for bw in basmala_part)
            transferred_tomon_num = next(
                (bw.get("tomon_number", "1") for bw in basmala_part if bw.get("is_first_tomon") == "1"),
                None,
            )
            for bw in basmala_part:
                word_action[bw["id"]] = {"skip": True}
        else:
            mw_body = mw_all
            transferred_tomon = False
            transferred_tomon_num = None

        for idx, orig_w in enumerate(mw_body):
            tok = copy.deepcopy(orig_w)
            tok["text"] = tok["text"].replace("\u200f", "").strip()

            if idx == 0 and transferred_tomon:
                tok["is_first_tomon"] = "1"
                if transferred_tomon_num:
                    tok["tomon_number"] = transferred_tomon_num

            if tok.get("verse") and v == surah_max_verse[s]:
                tok["verse"]["is_last_verse"] = "1"

            if tok.get("is_first_tomon") == "1":
                total_tomon += 1
            if tok.get("is_last_word") == "1":
                total_last_word += 1
            if "\u0610" in tok["text"]:
                total_habti += 1

            word_action[orig_w["id"]] = {"skip": False, "word": tok}

    print(f"✅ Mots M6 indexés : Tomons={total_tomon}, Fins de verset={total_last_word}, Marques Habti (U+0610)={total_habti}")
    assert total_tomon == 480, f"Expected 480 tomons, got {total_tomon}"
    assert total_last_word == 6214, f"Expected 6214 verses, got {total_last_word}"

    # 2. Flux global pour rattacher bannières de sourates + Basmala M6 directement au v=1
    flat_items = []
    for page in m6["pages"]:
        pno = page["page_number"]
        for line in page["lines"]:
            if line.get("is_surah_title") == "1":
                flat_items.append({"kind": "banner", "orig_page": pno, "line": line})
            elif line.get("words"):
                flat_items.append({"kind": "words_line", "orig_page": pno, "line": line})

    pending_banners = {}
    for idx, it in enumerate(flat_items):
        if it["kind"] == "banner":
            found_surah = None
            for nxt in flat_items[idx + 1:]:
                if nxt["kind"] == "words_line":
                    for w in nxt["line"]["words"]:
                        act = word_action.get(w["id"])
                        if act and not act["skip"]:
                            found_surah = int(act["word"]["surah_number"])
                            break
                if found_surah is not None:
                    break
            assert found_surah is not None, f"Orphan banner at page {it['orig_page']}"
            pending_banners[found_surah] = it["line"]

    # 3. Partitionnement strict en 60 Ahzab
    ahzab_pages = {h: defaultdict(list) for h in range(1, 61)}
    page_meta_ref = {p["page_number"]: p for p in m6["pages"]}
    inserted_banners = set()

    for it in flat_items:
        if it["kind"] == "banner":
            continue

        orig_pno = it["orig_page"]
        orig_line = it["line"]
        words_by_hizb = defaultdict(list)

        for w in orig_line["words"]:
            act = word_action.get(w["id"])
            if not act or act["skip"]:
                continue
            tok = act["word"]
            words_by_hizb[int(tok["hizb_number"])].append(tok)

        if not words_by_hizb:
            continue

        for h_num, w_list in words_by_hizb.items():
            first_surah = int(w_list[0]["surah_number"])
            first_verse = int(w_list[0]["verse"]["verse_number"])

            if first_verse == 1 and first_surah not in inserted_banners:
                inserted_banners.add(first_surah)
                b_orig = pending_banners[first_surah]
                clean_title = surah_names[first_surah]

                ahzab_pages[h_num][orig_pno].append({
                    "line_id": b_orig.get("line_id", 0),
                    "line_number": 1,
                    "is_surah_title": "1",
                    "surah_number": str(first_surah),
                    "surah_title": clean_title,
                    "surah_title_ar": clean_title,
                    "surah_title_lt": b_orig.get("surah_title_lt", ""),
                    "starts_with_verse_number": "",
                    "words": [],
                })

                if first_surah != 9:
                    ahzab_pages[h_num][orig_pno].append({
                        "line_id": f"basmala-m6-{first_surah}",
                        "line_number": 2,
                        "is_surah_title": "0",
                        "is_basmala": "1",
                        "surah_number": str(first_surah),
                        "surah_title": clean_title,
                        "surah_title_ar": clean_title,
                        "basmala_text": surah_basmala_m6[first_surah],
                        "words": [],
                    })

            ahzab_pages[h_num][orig_pno].append({
                "line_id": orig_line.get("line_id", 0),
                "line_number": orig_line.get("line_number", 0),
                "is_surah_title": orig_line.get("is_surah_title", "") or "",
                "surah_title": surah_names.get(first_surah, ""),
                "surah_title_ar": surah_names.get(first_surah, ""),
                "surah_title_lt": orig_line.get("surah_title_lt", ""),
                "starts_with_verse_number": orig_line.get("starts_with_verse_number", ""),
                "words": w_list,
            })

    assert len(inserted_banners) == 114, f"Expected 114 banners, got {len(inserted_banners)}"

    os.makedirs(OUT_M6_DIR, exist_ok=True)
    total_gz_bytes = 0
    total_verses_check = set()

    for h in range(1, 61):
        p_dict = ahzab_pages[h]
        sorted_pnos = sorted(p_dict.keys())
        pages_out = []
        surahs_ordered = []
        seen_s = set()

        for pno in sorted_pnos:
            lines = p_dict[pno]
            ref_p = page_meta_ref[pno]
            page_surah_num = None
            for l in lines:
                if l.get("words"):
                    page_surah_num = int(l["words"][0]["surah_number"])
                    break
                elif l.get("surah_number"):
                    page_surah_num = int(l["surah_number"])
                    break
            page_surah_name = surah_names.get(page_surah_num or 1, "")

            pages_out.append({
                "page_number": pno,
                "hizb_number": h,
                "is_intro": ref_p.get("is_intro", ""),
                "page_surah_title": page_surah_name,
                "page_surah_title_lt": ref_p.get("page_surah_title_lt", ""),
                "page_size": ref_p.get("page_size", "normal"),
                "surah_verses_count": ref_p.get("surah_verses_count", ""),
                "lines": lines,
            })

            for l in lines:
                for w in l.get("words") or []:
                    s = int(w["surah_number"])
                    v = int(w["verse"]["verse_number"])
                    total_verses_check.add((s, v))
                    if s not in seen_s:
                        seen_s.add(s)
                        surahs_ordered.append(surah_names[s])

        payload = {
            "hizb_number": h,
            "start_page": sorted_pnos[0],
            "end_page": sorted_pnos[-1],
            "surahs": surahs_ordered,
            "matlaa": "",
            "pages": pages_out,
        }

        raw_bytes = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        gz_path = os.path.join(OUT_M6_DIR, f"hizb_{h}.json.gz")
        with gzip.open(gz_path, "wb", compresslevel=9) as gf:
            gf.write(raw_bytes)
        total_gz_bytes += os.path.getsize(gz_path)

    assert len(total_verses_check) == 6214, f"Expected 6214 verses, got {len(total_verses_check)}"
    print(f"🎉 Succès ! 60 fichiers créés dans src/data/ahzab_m6/ (total compressé : {total_gz_bytes / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
