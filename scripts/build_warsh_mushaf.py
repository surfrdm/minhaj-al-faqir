#!/usr/bin/env python3
"""
Générateur officiel du Mushaf Mohammadi (Warsh 'an Nafi') pour Minhaj Al-Faqir.

Principe (Option 1) :
- Lit la source brute intacte de l'extraction du Ministère des Habous :
    src/data/mushaf_mohammadi_officiel_m6.json
- Lit le texte Unicode standard authentifié KFGQPC Warsh v10 (sans chiffrement) :
    warshData_v10.json
- Aligne les 6 214 versets mot-à-mot sur la structure officielle M6 (60 Ahzab, 480 Tomons,
  11 Sajdahs malékites, 114 Sourates, pagination stricte par Hizb sans débordement).
- Préserve les 9 837 positions exactes du Waqf Al-Habti (U+06D6 rendu en 'ص' par warsh.10.woff2)
  d'après le Mushaf officiel du Ministère des Habous.
- Isole la Basmala (بِسْمِ اِ۬للَّهِ اِ۬لرَّحْمَٰنِ اِ۬لرَّحِيمِ) sur sa propre ligne dédiée sous
  la bannière de chaque sourate (sauf At-Tawbah, sourate 9), tout en conservant le marqueur
  `is_first_tomon` sur le premier mot réel du verset 1.
- Exclut les chiffres orientaux (٠١٢٣٤٥٦٧٨٩) des données finales ; l'interface les affiche
  en chiffres occidentaux/français (1, 2, 3...).
"""

import copy
import json
import os
import re
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
M6_PATH = os.path.join(ROOT, "src", "data", "mushaf_mohammadi_officiel_m6.json")
W10_PATH = "/Users/fedala/.gemini/antigravity/brain/9e0a78f6-cc04-42e6-a4f0-88604e794c7a/scratch/warshData_v10.json"
OUT_AHZAB_DIR = os.path.join(ROOT, "src", "data", "ahzab")
OUT_INDEX_PATH = os.path.join(ROOT, "src", "data", "quran_ahzab_index.json")
OUT_HIZBS_PATH = os.path.join(ROOT, "src", "data", "quran_hizbs.json")

WARSH_BASMALA = "بِسْمِ اِ۬للَّهِ اِ۬لرَّحْمَٰنِ اِ۬لرَّحِيمِ"

# 114 noms de sourates en arabe standard (extraits / vérifiés)
SURAH_CLEAN_NAMES = {}


def clean_w10_verse_words(aya_text: str, key: tuple[int, int]) -> list[str]:
    txt = aya_text.replace("\u200f", "")
    # Retirer le numéro de verset arabe-oriental final (\xa0 + ١٢٣...)
    txt = re.sub(r"[\xa0\s]+[\u0660-\u06690-9]+$", "", txt).strip()
    # Correction espace manquant dans KFGQPC v10 pour 41:50
    if key == (41, 50):
        txt = txt.replace("وَنَـ۪ٔابِجَانِبِهِۦۖ", "وَنَـ۪ٔا بِجَانِبِهِۦۖ")
    words = []
    for raw in txt.split():
        # Retirer Rub El Hizb inline (on affiche nos badges officiels M6 via is_first_tomon)
        # et Sajdah inline (on l'affiche proprement via verse.sajda === "1")
        w = raw.replace("\u06de", "").replace("\u06e9", "")
        # Retirer le Waqf KFGQPC afin d'appliquer exactement ceux de M6 Habti
        w = w.replace("\u06d6", "")
        if w:
            words.append(w)
    return words


def align_verse_tokens(key: tuple[int, int], m6_body: list[dict], w10_words: list[str]) -> list[list[str]]:
    """
    Retourne une liste de longueur len(m6_body) où chaque élément est la liste des mots
    Unicode (0, 1 ou 2 mots) assignés au slot word M6 correspondant.
    """
    n_m6 = len(m6_body)
    n_w10 = len(w10_words)
    if n_m6 == n_w10:
        return [[w] for w in w10_words]

    # Cas connus (9 décalages triviaux d'espacement entre M6 et KFGQPC)
    # Index dans m6_body -> liste de indices w10 ou [] si fusionné avec précédent
    two_w10_for_one_m6 = {
        (2, 280): 10,   # مَّاكَسَبَــتْ -> مَّا + كَسَبَتْ
        (3, 154): 17,   # غَيْرَ۰لْحَقِّ -> غَيْرَ + اَ۬لْحَقِّ
        (7, 146): 32,   # بِــَٔـايَـٰـــتِـنَـا وَكَانُواْ -> بِـَٔايَٰتِنَا + وَكَانُواْ
        (20, 70): 7,    # إِنَّهُ,لَكَبِيرُكُمُ -> إِنَّهُۥ + لَكَبِيرُكُمُ
        (37, 17): 0,    # أَوَءَابَـآؤُنَـا -> أَوَ + ءَابَآؤُنَا
        (46, 25): 28,   # مَّاكَـانُـواْ -> مَّا + كَانُواْ
    }
    two_m6_for_one_w10 = {
        (3, 49): 6,     # وَ + لُءِحِلَّ -> وَلِأُحِلَّ (token suivant 7 devient [])
        (7, 97): 0,     # أَوَ + اَمِــنَ -> أَوَاَمِنَ (token suivant 1 devient [])
        (42, 11): 34,   # وَيَـهْـدِ + ىٓ -> وَيَهْدِےٓ (token suivant 35 devient [])
    }

    if key in two_w10_for_one_m6:
        assert n_w10 == n_m6 + 1, f"Unexpected len for {key}: {n_m6} vs {n_w10}"
        split_idx = two_w10_for_one_m6[key]
        res = []
        wi = 0
        for mi in range(n_m6):
            if mi == split_idx:
                res.append([w10_words[wi], w10_words[wi + 1]])
                wi += 2
            else:
                res.append([w10_words[wi]])
                wi += 1
        assert wi == n_w10
        return res

    if key in two_m6_for_one_w10:
        assert n_m6 == n_w10 + 1, f"Unexpected len for {key}: {n_m6} vs {n_w10}"
        merge_idx = two_m6_for_one_w10[key]
        res = []
        wi = 0
        for mi in range(n_m6):
            if mi == merge_idx:
                res.append([w10_words[wi]])
                wi += 1
            elif mi == merge_idx + 1:
                res.append([])
            else:
                res.append([w10_words[wi]])
                wi += 1
        assert wi == n_w10
        return res

    raise ValueError(f"Unhandled token mismatch at {key}: M6={n_m6} vs W10={n_w10}")


def main():
    print("📖 Chargement des sources officielles...")
    with open(M6_PATH, "r", encoding="utf-8") as f:
        m6 = json.load(f)
    with open(W10_PATH, "r", encoding="utf-8") as f:
        w10_list = json.load(f)

    existing_hizbs = {}
    if os.path.exists(OUT_HIZBS_PATH):
        with open(OUT_HIZBS_PATH, "r", encoding="utf-8") as f:
            for item in json.load(f):
                existing_hizbs[item["number"]] = item["name"]

    w10_map = {(int(it["sura_no"]), int(it["aya_no"])): it for it in w10_list}

    # 1. Regrouper tous les mots M6 par verset et repérer les métadonnées exactes
    m6_verses = defaultdict(list)
    surah_max_verse = defaultdict(int)
    for page in m6["pages"]:
        for line in page["lines"]:
            if line.get("surah_title_ar") and line.get("is_surah_title") == "1":
                pass
            for w in line.get("words", []):
                s = int(w["surah_number"])
                v = int(w["verse"]["verse_number"])
                m6_verses[(s, v)].append(w)
                if v > surah_max_verse[s]:
                    surah_max_verse[s] = v
                if line.get("surah_title_ar"):
                    SURAH_CLEAN_NAMES.setdefault(s, line["surah_title_ar"].strip())

    assert set(m6_verses.keys()) == set(w10_map.keys()), "Divergence de clés de versets M6 vs W10 !"

    # Vérifier quelles Basmala (4 premiers mots des v==1, s!=9) portent le Waqf U+0610
    # (ex: sourates 75, 83, 90, 104 car elles commencent par لا أقسم / ويل)
    basmala_habti = 0
    surahs_with_basmala_habti = set()
    # Mapper chaque id de mot M6 vers sa liste de mots Unicode remplaçants + flags
    # m6_word_id -> {"action": "skip" | "basmala_skip" | "replace", "tokens": [dict, ...]}
    word_transform = {}
    total_habti_placed = 0
    total_tomon_preserved = 0
    total_last_word = 0

    for key in sorted(m6_verses.keys()):
        s, v = key
        mw_all = m6_verses[key]
        has_basmala = (v == 1 and s != 9)

        if has_basmala:
            basmala_part = mw_all[:4]
            mw_body = mw_all[4:]
            b_h = sum("\u0610" in bw["text"] for bw in basmala_part)
            basmala_habti += b_h
            if b_h:
                surahs_with_basmala_habti.add(s)
            transferred_tomon = any(bw.get("is_first_tomon") == "1" for bw in basmala_part)
            transferred_tomon_num = next(
                (bw.get("tomon_number", "1") for bw in basmala_part if bw.get("is_first_tomon") == "1"),
                None,
            )
            for bw in basmala_part:
                word_transform[bw["id"]] = {"action": "basmala_skip"}
        else:
            mw_body = mw_all
            transferred_tomon = False
            transferred_tomon_num = None

        w10_words = clean_w10_verse_words(w10_map[key]["aya_text"], key)
        aligned = align_verse_tokens(key, mw_body, w10_words)

        for idx, (orig_w, u_words) in enumerate(zip(mw_body, aligned)):
            is_first_body = idx == 0
            orig_habti = "\u0610" in orig_w["text"]

            if not u_words:
                # Cas de 2 tokens M6 fusionnés en 1 seul mot W10 : reporter is_last_word / habti au précédent !
                prev_id = mw_body[idx - 1]["id"]
                prev_rec = word_transform[prev_id]
                last_tok = prev_rec["tokens"][-1]
                if orig_w.get("is_last_word") == "1":
                    last_tok["is_last_word"] = "1"
                    total_last_word += 1
                if orig_habti and "\u06d6" not in last_tok["text"]:
                    last_tok["text"] += "\u06d6"
                    total_habti_placed += 1
                if orig_w.get("is_first_tomon") == "1" and last_tok.get("is_first_tomon") != "1":
                    last_tok["is_first_tomon"] = "1"
                    last_tok["tomon_number"] = orig_w.get("tomon_number", "1")
                    total_tomon_preserved += 1
                word_transform[orig_w["id"]] = {"action": "skip"}
                continue

            new_tokens = []
            for ti, utext in enumerate(u_words):
                tok = copy.deepcopy(orig_w)
                if len(u_words) > 1:
                    tok["id"] = f"{orig_w['id']}_{'a' if ti == 0 else 'b'}"
                tok["text"] = utext

                # Gérer flags multi-tokens
                if len(u_words) > 1:
                    if ti == 0:
                        tok["is_last_word"] = ""
                    else:
                        tok["is_first_tomon"] = ""

                # Transférer is_first_tomon depuis la Basmala supprimée si nécessaire
                if is_first_body and ti == 0 and transferred_tomon:
                    tok["is_first_tomon"] = "1"
                    if transferred_tomon_num:
                        tok["tomon_number"] = transferred_tomon_num

                # Appliquer Waqf Al-Habti M6 exactement sur le dernier token du groupe
                if orig_habti and ti == len(u_words) - 1:
                    tok["text"] = tok["text"] + "\u06d6"
                    total_habti_placed += 1

                # Normaliser is_last_verse (M6 omet parfois ce flag sur certaines sourates courtes)
                if tok.get("verse") and v == surah_max_verse[s]:
                    tok["verse"]["is_last_verse"] = "1"

                if tok.get("is_first_tomon") == "1":
                    total_tomon_preserved += 1
                if tok.get("is_last_word") == "1":
                    total_last_word += 1

                new_tokens.append(tok)

            word_transform[orig_w["id"]] = {"action": "replace", "tokens": new_tokens}

    print(f"✅ Alignement vérifié : Basmala Habti={basmala_habti}, Waqf Al-Habti placés={total_habti_placed}, "
          f"Tomons={total_tomon_preserved}, Fins de verset={total_last_word}")
    assert total_habti_placed == 9837, f"Expected 9837 Habti marks, got {total_habti_placed}"
    assert total_tomon_preserved == 480, f"Expected 480 tomon badges, got {total_tomon_preserved}"
    assert total_last_word == 6214, f"Expected 6214 verses, got {total_last_word}"

    # 2. Construire un flux ordonné global d'éléments par page afin de rattacher
    #    toute bannière de sourate isolée en bas de page au Hizb & page du verset 1 suivant
    # Collecter les bannières + leurs numéros de sourate réels d'après le premier mot qui suit
    flat_items = []
    for page in m6["pages"]:
        pno = page["page_number"]
        for line in page["lines"]:
            if line.get("is_surah_title") == "1":
                flat_items.append({
                    "kind": "banner",
                    "orig_page": pno,
                    "line": copy.deepcopy(line),
                })
            elif line.get("words"):
                flat_items.append({
                    "kind": "words_line",
                    "orig_page": pno,
                    "page_surah_title": page.get("page_surah_title", ""),
                    "page_surah_title_lt": page.get("page_surah_title_lt", ""),
                    "line": copy.deepcopy(line),
                })

    # Associer chaque bannière à son verset 1 (sourate, hizb, première page réelle de v=1)
    pending_banners_for_surah = {}
    for idx, it in enumerate(flat_items):
        if it["kind"] == "banner":
            # Trouver le premier words_line après cette bannière ayant un mot conservé
            found = None
            for nxt in flat_items[idx + 1:]:
                if nxt["kind"] == "words_line":
                    for w in nxt["line"]["words"]:
                        tr = word_transform[w["id"]]
                        if tr["action"] == "replace":
                            t0 = tr["tokens"][0]
                            found = (int(t0["surah_number"]), int(t0["hizb_number"]), nxt["orig_page"])
                            break
                if found:
                    break
            assert found is not None, f"Bannière sans verset suivant : {it}"
            surah_no, hizb_no, v1_page = found
            it["surah_number"] = surah_no
            it["target_hizb"] = hizb_no
            it["target_page"] = v1_page
            pending_banners_for_surah[surah_no] = it

    # 3. Partitionner strictement en 60 Ahzab (sans fuite de Hizb voisin !)
    ahzab_pages = {h: defaultdict(list) for h in range(1, 61)}  # h -> page_no -> list[lines]
    page_meta_ref = {p["page_number"]: p for p in m6["pages"]}

    # Suivre les bannières déjà insérées juste avant le premier mot de chaque sourate
    inserted_surah_banners = set()

    for it in flat_items:
        if it["kind"] == "banner":
            # On insérera la bannière directement au moment où débute le corps du v=1
            # (pour éviter toute bannière orpheline sur une page précédente)
            continue

        orig_pno = it["orig_page"]
        orig_line = it["line"]

        # Grouper les mots transformés de cette ligne par Hizb strict
        words_by_hizb = defaultdict(list)
        for w in orig_line["words"]:
            tr = word_transform[w["id"]]
            if tr["action"] != "replace":
                continue
            for tok in tr["tokens"]:
                words_by_hizb[int(tok["hizb_number"])].append(tok)

        if not words_by_hizb:
            continue

        for h_num, w_list in words_by_hizb.items():
            # Vérifier si ce bloc ouvre une nouvelle sourate (surah pas encore banniérée)
            first_surah = int(w_list[0]["surah_number"])
            first_verse = int(w_list[0]["verse"]["verse_number"])
            if first_verse == 1 and first_surah not in inserted_surah_banners:
                inserted_surah_banners.add(first_surah)
                b_item = pending_banners_for_surah[first_surah]
                clean_title = SURAH_CLEAN_NAMES.get(first_surah) or b_item["line"].get("surah_title_ar") or ""
                banner_line = {
                    "line_id": b_item["line"].get("line_id", 0),
                    "line_number": 1,
                    "is_surah_title": "1",
                    "surah_number": str(first_surah),
                    "surah_title": clean_title,
                    "surah_title_ar": clean_title,
                    "surah_title_lt": b_item["line"].get("surah_title_lt", ""),
                    "starts_with_verse_number": "",
                    "words": [],
                }
                ahzab_pages[h_num][orig_pno].append(banner_line)

                # Ligne Basmala dédiée et centrée pour toutes les sourates sauf At-Tawbah (9)
                if first_surah != 9:
                    b_txt = WARSH_BASMALA + ("\u06d6" if first_surah in surahs_with_basmala_habti else "")
                    basmala_line = {
                        "line_id": f"basmala-{first_surah}",
                        "line_number": 2,
                        "is_surah_title": "0",
                        "is_basmala": "1",
                        "surah_number": str(first_surah),
                        "surah_title": clean_title,
                        "surah_title_ar": clean_title,
                        "basmala_text": b_txt,
                        "words": [],
                    }
                    ahzab_pages[h_num][orig_pno].append(basmala_line)

            # Créer la ligne de mots nettoyée
            out_line = {
                "line_id": orig_line.get("line_id", 0),
                "line_number": orig_line.get("line_number", 0),
                "is_surah_title": orig_line.get("is_surah_title", "") or "",
                "surah_title": SURAH_CLEAN_NAMES.get(first_surah, orig_line.get("surah_title_ar", "")),
                "surah_title_ar": SURAH_CLEAN_NAMES.get(first_surah, orig_line.get("surah_title_ar", "")),
                "surah_title_lt": orig_line.get("surah_title_lt", ""),
                "starts_with_verse_number": orig_line.get("starts_with_verse_number", ""),
                "words": w_list,
            }
            ahzab_pages[h_num][orig_pno].append(out_line)

    assert len(inserted_surah_banners) == 114, f"Expected 114 banners inserted, got {len(inserted_surah_banners)}"

    # 4. Générer les 60 fichiers hizb_N.json, quran_ahzab_index.json et quran_hizbs.json
    os.makedirs(OUT_AHZAB_DIR, exist_ok=True)
    ahzab_index = []
    hizbs_ratib_list = []

    seen_global_verses = set()
    global_word_count = 0

    for h in range(1, 61):
        p_dict = ahzab_pages[h]
        sorted_pnos = sorted(p_dict.keys())
        assert sorted_pnos, f"Hizb {h} vide !"

        pages_out = []
        surahs_ordered = []
        seen_s_in_h = set()
        first_verse_key = None
        last_verse_key = None
        surah_verse_bounds = defaultdict(lambda: [10**9, 0])  # s -> [min_v, max_v]
        first_verse_words_text = []

        for pno in sorted_pnos:
            lines = p_dict[pno]
            ref_p = page_meta_ref[pno]

            # Sourate principale de la page d'après les mots réels du Hizb
            page_surah_num = None
            for l in lines:
                if l.get("words"):
                    page_surah_num = int(l["words"][0]["surah_number"])
                    break
                elif l.get("surah_number"):
                    page_surah_num = int(l["surah_number"])
                    break
            page_surah_name = SURAH_CLEAN_NAMES.get(page_surah_num, ref_p.get("page_surah_title", "").replace("سورة ", ""))

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
                for w in l.get("words", []):
                    global_word_count += 1
                    s = int(w["surah_number"])
                    v = int(w["verse"]["verse_number"])
                    kv = (s, v)
                    seen_global_verses.add(kv)
                    if first_verse_key is None:
                        first_verse_key = kv
                    last_verse_key = kv
                    if s not in seen_s_in_h:
                        seen_s_in_h.add(s)
                        surahs_ordered.append(SURAH_CLEAN_NAMES[s])
                    if v < surah_verse_bounds[s][0]:
                        surah_verse_bounds[s][0] = v
                    if v > surah_verse_bounds[s][1]:
                        surah_verse_bounds[s][1] = v
                    if kv == first_verse_key:
                        first_verse_words_text.append(w["text"])

        # Construire matlaa propre (1er verset du Hizb en Warsh Unicode)
        matlaa_full = " ".join(first_verse_words_text).strip()
        # Ajouter le 2e verset si le 1er est très court (ex: الم, طه, يس)
        if len(matlaa_full) < 28:
            second_key = None
            second_words = []
            for p_obj in pages_out:
                for l in p_obj["lines"]:
                    for w in l.get("words", []):
                        kv = (int(w["surah_number"]), int(w["verse"]["verse_number"]))
                        if kv != first_verse_key:
                            if second_key is None:
                                second_key = kv
                            if kv == second_key:
                                second_words.append(w["text"])
                            else:
                                break
                    if second_key and any(
                        (int(w["surah_number"]), int(w["verse"]["verse_number"])) != second_key
                        for w in l.get("words", [])
                    ):
                        break
            if second_words:
                matlaa_full = f"{matlaa_full} • {' '.join(second_words)}"

        # Résumer les sourates et plages de versets pour quran_hizbs.json en chiffres latins
        range_parts = []
        for s_name in surahs_ordered:
            s_num = next(k for k, name in SURAH_CLEAN_NAMES.items() if name == s_name)
            vmin, vmax = surah_verse_bounds[s_num]
            range_parts.append(f"{s_name} ({vmin}-{vmax})")
        if len(range_parts) == 1:
            s_label = f"سورة {surahs_ordered[0]}: {surah_verse_bounds[next(k for k, n in SURAH_CLEAN_NAMES.items() if n == surahs_ordered[0])][0]} - {surah_verse_bounds[next(k for k, n in SURAH_CLEAN_NAMES.items() if n == surahs_ordered[0])][1]}"
        elif len(range_parts) <= 3:
            s_label = " • ".join(range_parts)
        else:
            s_first = next(k for k, n in SURAH_CLEAN_NAMES.items() if n == surahs_ordered[0])
            s_last = next(k for k, n in SURAH_CLEAN_NAMES.items() if n == surahs_ordered[-1])
            s_label = f"من {surahs_ordered[0]} ({surah_verse_bounds[s_first][0]}) إلى {surahs_ordered[-1]} ({surah_verse_bounds[s_last][1]})"

        hizb_payload = {
            "hizb_number": h,
            "start_page": sorted_pnos[0],
            "end_page": sorted_pnos[-1],
            "surahs": surahs_ordered,
            "matlaa": matlaa_full,
            "pages": pages_out,
        }

        with open(os.path.join(OUT_AHZAB_DIR, f"hizb_{h}.json"), "w", encoding="utf-8") as f:
            json.dump(hizb_payload, f, ensure_ascii=False, separators=(",", ":"))

        ahzab_index.append({
            "hizb_number": h,
            "start_page": sorted_pnos[0],
            "end_page": sorted_pnos[-1],
            "surahs": surahs_ordered,
            "matlaa": matlaa_full,
            "page_count": len(sorted_pnos),
        })

        hizbs_ratib_list.append({
            "number": h,
            "name": existing_hizbs.get(h, f"الحزب {h}"),
            "opening": matlaa_full,
            "surahs": s_label,
        })

    with open(OUT_INDEX_PATH, "w", encoding="utf-8") as f:
        json.dump(ahzab_index, f, ensure_ascii=False, indent=2)

    with open(OUT_HIZBS_PATH, "w", encoding="utf-8") as f:
        json.dump(hizbs_ratib_list, f, ensure_ascii=False, indent=2)

    assert len(seen_global_verses) == 6214, f"Expected 6214 total unique verses, got {len(seen_global_verses)}"
    print(f"🎉 Succès total ! 60 Ahzab générés :")
    print(f"   • Versets uniques : {len(seen_global_verses)} / 6214")
    print(f"   • Mots totaux (hors Basmala isolées) : {global_word_count}")
    print(f"   • Bannières de sourates : {len(inserted_surah_banners)} / 114")
    print(f"   • Waqf Al-Habti (U+06D6 'ص') : {total_habti_placed}")
    print(f"   • Divisions Tomon (1/8 Hizb) : {total_tomon_preserved} / 480")


if __name__ == "__main__":
    main()
