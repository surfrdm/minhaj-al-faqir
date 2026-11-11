#!/usr/bin/env python3
"""
Builds compressed, chunked classical Turath book datasets for:
  1. صفة الصفوة (صفوة الصفوة) - للإمام ابن الجوزي (ت 597 هـ) [safwat]
  2. حلية الأولياء وطبقات الأصفياء - للحافظ أبي نعيم الأصبهاني (ت 430 هـ) [hilya]
  3. الإصابة في تمييز الصحابة - للحافظ ابن حجر العسقلاني (ت 852 هـ) [isaba]

Outputs:
  - src/data/turath_books/index.json
  - src/data/turath_books/{safwat,hilya,isaba}/chunk_{id}.json.gz
"""

import gzip
import json
import re
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "src" / "data" / "turath_books"
SRC_DIR = Path("/tmp/openiti_books")

PAGE_RE = re.compile(r"PageV(\d+)P(\d+)")
MS_RE = re.compile(r"\bms\d+\b")


def clean_openiti_inline(text: str, strip_pipes: bool = False) -> Tuple[str, List[Tuple[int, int]]]:
    """Extract PageVxxPxxx markers and clean OpenITI inline syntax."""
    pages: List[Tuple[int, int]] = []
    for m in PAGE_RE.finditer(text):
        pages.append((int(m.group(1)), int(m.group(2))))

    cleaned = PAGE_RE.sub("", text)
    cleaned = MS_RE.sub("", cleaned)
    cleaned = re.sub(r"@[A-Za-z0-9_]+", "", cleaned)
    cleaned = cleaned.replace("%~%", "  ❖  ")
    # Remove boundary '%' next to verse separators or line ends in OpenITI
    cleaned = re.sub(r"❖\s*%", "❖ ", cleaned)
    cleaned = re.sub(r"%\s*❖", " ❖", cleaned)
    cleaned = re.sub(r"^\s*%\s*", "", cleaned)
    cleaned = re.sub(r"\s*%\s*$", "", cleaned)
    # Any remaining '%' with spaces inside a line separates hemistichs
    cleaned = re.sub(r"\s*%\s*", "  ❖  ", cleaned)
    cleaned = re.sub(r"(?:❖\s*){2,}", "❖  ", cleaned)
    if strip_pipes:
        # OpenITI Isaba preface uses `|` for manuscript line breaks
        cleaned = re.sub(r"\s*\|\s*", " ", cleaned)
    cleaned = cleaned.replace("### |PARATEXT|", "")
    cleaned = cleaned.replace("### |EDITOR|", "")
    cleaned = re.sub(r"[ \t]+", " ", cleaned)
    return cleaned.strip(), pages


def normalize_paragraphs(raw_lines: List[str], strip_pipes: bool = False) -> Tuple[str, List[Tuple[int, int]]]:
    """Join OpenITI `# ` paragraph starters and `~~` continuations cleanly."""
    paragraphs: List[str] = []
    current_parts: List[str] = []
    all_pages: List[Tuple[int, int]] = []

    def flush():
        if current_parts:
            joined = " ".join(current_parts)
            joined = re.sub(r"\s+", " ", joined).strip()
            if joined:
                paragraphs.append(joined)
            current_parts.clear()

    for line in raw_lines:
        s = line.rstrip("\r\n")
        if not s.strip() or s.startswith("#META#") or s.startswith("######OpenITI"):
            continue
        if s.startswith("### "):
            if s.startswith("### |PARATEXT|") or s.startswith("### |EDITOR|"):
                flush()
                continue
            heading_txt = re.sub(r"^###\s*[\|$]+\s*", "", s).strip()
            heading_clean, pgs = clean_openiti_inline(heading_txt, strip_pipes=strip_pipes)
            all_pages.extend(pgs)
            flush()
            if heading_clean:
                paragraphs.append(f"◆ {heading_clean}")
            continue

        if s.startswith("~~"):
            txt, pgs = clean_openiti_inline(s[2:], strip_pipes=strip_pipes)
            all_pages.extend(pgs)
            if txt:
                current_parts.append(txt)
        elif s.startswith("# "):
            flush()
            txt, pgs = clean_openiti_inline(s[2:], strip_pipes=strip_pipes)
            all_pages.extend(pgs)
            if txt:
                current_parts.append(txt)
        else:
            txt, pgs = clean_openiti_inline(s, strip_pipes=strip_pipes)
            all_pages.extend(pgs)
            if txt:
                current_parts.append(txt)

    flush()
    return "\n\n".join(paragraphs), all_pages


def format_page_ref(pages: List[Tuple[int, int]]) -> Optional[str]:
    if not pages:
        return None
    v0, p0 = pages[0]
    v1, p1 = pages[-1]
    if v0 == v1 and p0 == p1:
        return f"ج{v0} / ص{p0}"
    if v0 == v1:
        return f"ج{v0} / ص{p0}-{p1}"
    return f"ج{v0} ص{p0} - ج{v1} ص{p1}"


def write_gz_json(path: Path, data: Any) -> int:
    path.parent.mkdir(parents=True, exist_ok=True)
    raw = json.dumps(data, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    compressed = gzip.compress(raw, compresslevel=9)
    path.write_bytes(compressed)
    return len(compressed)


# ---------------------------------------------------------------------------
# 1. صفة الصفوة (صفوة الصفوة) - ابن الجوزي
# ---------------------------------------------------------------------------
SAFAT_SECTION_DEFS = [
    (0, "المقدمة وسيرة المصطفى ﷺ وفضل الأولياء", "القسم الأول: التمهيد والسيرة النبوية", 0, 3502),
    (1, "الطبقة الأولى من الصحابة (البدريون)", "أصحاب رسول الله ﷺ", 3502, 4967),
    (2, "الطبقات 2 - 5 من الصحابة الكرام", "أصحاب رسول الله ﷺ", 4967, 8033),
    (3, "طبقات الصحابيات الجليلات", "صحابيات رسول الله ﷺ", 8033, 8986),
    (4, "المصطفون من أهل المدينة المنورة", "التابعون ومن بعدهم في البلدان", 8986, 10866),
    (5, "المصطفون من أهل مكة والطائف واليمن", "التابعون ومن بعدهم في البلدان", 10866, 12251),
    (6, "المصطفون من أهل بغداد والمدائن وواسط", "التابعون ومن بعدهم في البلدان", 12251, 15747),
    (7, "المصطفون من أهل الكوفة", "التابعون ومن بعدهم في البلدان", 15747, 18437),
    (8, "المصطفون من أهل البصرة", "التابعون ومن بعدهم في البلدان", 18437, 22265),
    (9, "عباد الأبلة وعبادان وفارس والبحرين واليمامة", "التابعون ومن بعدهم في البلدان", 22265, 22773),
    (10, "أهل الجبال والري وخراسان وما وراء النهر", "التابعون ومن بعدهم في البلدان", 22773, 24551),
    (11, "أهل الموصل والجزيرة والشام وبيت المقدس والثغور", "التابعون ومن بعدهم في البلدان", 24551, 26917),
    (12, "أهل مصر والإسكندرية وأيلة وأهل المغرب", "التابعون ومن بعدهم في البلدان", 26917, 27468),
    (13, "عباد الجبال والسواحل والبوادي ومن عُرف بحاله", "عباد السواحل والبوادي والأحوال", 27468, 9999999),
]


def parse_sifat_safwa() -> Dict[str, Any]:
    lines = (SRC_DIR / "sifat_safwa.mARkdown").read_text(encoding="utf-8").splitlines()
    start_idx = 0
    for idx, l in enumerate(lines):
        if l.startswith("#META#Header#End#"):
            start_idx = idx + 1
            break

    chunks_meta = []
    total_entries = 0
    total_bytes = 0

    for cid, label, sub_group, s_line, e_line in SAFAT_SECTION_DEFS:
        lo = max(start_idx, s_line)
        hi = min(len(lines), e_line)
        slice_lines = lines[lo:hi]

        entries: List[Dict[str, Any]] = []
        split_on_biog = cid > 0

        cur_h1 = ""
        cur_h2 = ""
        cur_title = ""
        cur_num: Optional[str] = None
        cur_lines: List[str] = []

        def flush_entry():
            nonlocal total_entries
            if not cur_lines and not cur_title:
                return
            body, pgs = normalize_paragraphs(cur_lines)
            if not body.strip():
                return
            t = (cur_title or cur_h2 or cur_h1 or label).strip()
            path_parts = [p for p in [cur_h1, cur_h2] if p and p != t]
            order = len(entries) + 1
            entry: Dict[str, Any] = {
                "id": f"safwat-{cid}-{order}",
                "chunkId": cid,
                "orderInChunk": order,
                "title_ar": t,
                "sectionPath_ar": " • ".join(path_parts) if path_parts else label,
                "text_ar": body,
            }
            if cur_num:
                entry["entryNumber"] = cur_num
            pr = format_page_ref(pgs)
            if pr:
                entry["pageRef"] = pr
            entries.append(entry)
            total_entries += 1

        for line in slice_lines:
            if line.startswith("### |PARATEXT|"):
                break
            if line.startswith("### | "):
                raw_h, _ = clean_openiti_inline(line[6:])
                if not split_on_biog:
                    flush_entry()
                    cur_lines = []
                    cur_title = raw_h
                    cur_num = None
                cur_h1 = raw_h
                cur_h2 = ""
                continue
            if line.startswith("### || "):
                raw_h, _ = clean_openiti_inline(line[7:])
                if not split_on_biog:
                    flush_entry()
                    cur_lines = []
                    cur_title = raw_h
                    cur_num = None
                cur_h2 = raw_h
                continue
            if line.startswith("### $"):
                flush_entry()
                cur_lines = []
                raw_t, _ = clean_openiti_inline(re.sub(r"^###\s*[\$\s]+", "", line))
                m_num = re.match(r"^(\d+)\s*[-–.]?\s*(.+)$", raw_t)
                if m_num:
                    cur_num = m_num.group(1)
                    cur_title = m_num.group(2).rstrip(":.").strip()
                else:
                    cur_num = None
                    cur_title = raw_t.rstrip(":.").strip()
                continue

            cur_lines.append(line)

        flush_entry()

        pages_in_chunk = [e.get("pageRef", "") for e in entries if e.get("pageRef")]
        meta = {
            "bookSlug": "safwat",
            "bookTitle_ar": "صفة الصفوة (المشتهر بصفوة الصفوة)",
            "author_ar": "جمال الدين أبو الفرج عبد الرحمن بن الجوزي (ت 597 هـ)",
            "chunkId": cid,
            "chunkLabel": label,
            "subGroup": sub_group,
            "entryCount": len(entries),
            "pageRange": f"{pages_in_chunk[0]} … {pages_in_chunk[-1]}" if len(pages_in_chunk) > 1 else (pages_in_chunk[0] if pages_in_chunk else ""),
        }
        sz = write_gz_json(OUT_DIR / "safwat" / f"chunk_{cid}.json.gz", {"meta": meta, "entries": entries})
        total_bytes += sz
        chunks_meta.append(meta)

    return {
        "slug": "safwat",
        "title_ar": "صِفَةُ الصَّفْوَةِ (صَفْوَةُ الصَّفْوَةِ)",
        "subtitle_ar": "مختصر وتهذيب حِلية الأولياء في سير المصطفى ﷺ والصحابة والتابعين والعبّاد في الأمصار",
        "author_ar": "الإمام جمال الدين أبو الفرج ابن الجوزي",
        "deathHijri": "597 هـ",
        "eraNote_ar": "مطبوع محقَّق في مجلدين (ويقع في 4 أجزاء) — النص التراثي الكامل مضبوط التراجم",
        "scholarlyNote_ar": "جمع فيه ابن الجوزي السيرة النبوية وطبقات الصحابة الأخيار ثم المصطفين من التابعين والعباد في أمصار الإسلام ومنهم أهل المغرب والأندلس، منقياً من المسانيد المطولة، ليغدو زاداً عملياً في الاقتداء بالصالحين.",
        "totalEntries": total_entries,
        "totalChunks": len(chunks_meta),
        "compressedBytes": total_bytes,
        "chunks": chunks_meta,
    }


# ---------------------------------------------------------------------------
# 2. حلية الأولياء وطبقات الأصفياء - أبو نعيم الأصبهاني
# ---------------------------------------------------------------------------
HILYA_VOL_NOTES = {
    1: "المقدمة • العشرة المبشرون وأهل الصفة وصدور الصحابة",
    2: "تتمة تراجم الصحابة ثم التابعون (سعيد بن المسيب وطبقته)",
    3: "الطبقة الأولى والثانية من التابعين بالمدينة والشام والكوفة",
    4: "أعلام التابعين بالعراق واليمن والشام",
    5: "أئمة التابعين والزهاد والعلماء العاملون",
    6: "تابعو التابعين والأئمة الفقهاء والمحدثون والزهاد",
    7: "كبار المحدثين والنساك (شعبة، الثوري، ابن عيينة، الفضيل)",
    8: "العباد والأولياء والفقهاء العارفون (معروف، بشر الحافي، أحمد بن حنبل)",
    9: "الإمام الشافعي وأقرانه وكبار الصوفية والزهاد",
    10: "أئمة التصوف السني والسلوك (البسطامي، المحاسبي، السقطي، الجنيد، الشبلي)",
}


def parse_hilyat_awliya() -> Dict[str, Any]:
    lines = (SRC_DIR / "hilyat_awliya.mARkdown").read_text(encoding="utf-8").splitlines()
    start_idx = 0
    for idx, l in enumerate(lines):
        if l.startswith("#META#Header#End#"):
            start_idx = idx + 1
            break

    raw_entries: List[Tuple[int, str, str, List[str]]] = []
    cur_vol = 1
    cur_h1 = ""
    cur_h2 = ""
    cur_title = "مقدمة الحافظ أبي نعيم الأصبهاني في حقيقة التصوف وأوصاف الأولياء"
    cur_entry_vol = 1
    cur_lines: List[str] = []
    seen_first_dollar = False

    def flush_raw():
        if cur_lines:
            raw_entries.append((cur_entry_vol, cur_title, cur_h2 or cur_h1, list(cur_lines)))

    for line in lines[start_idx:]:
        m_v = PAGE_RE.search(line)
        if m_v:
            cur_vol = int(m_v.group(1))
        if line.startswith("### | "):
            raw_h, _ = clean_openiti_inline(line[6:])
            if raw_h and raw_h != "[مقدمه]":
                cur_h1 = raw_h
            continue
        if line.startswith("### || "):
            raw_h, _ = clean_openiti_inline(line[7:])
            cur_h2 = raw_h
            continue
        if line.startswith("### $"):
            flush_raw()
            cur_lines = []
            seen_first_dollar = True
            cur_entry_vol = cur_vol
            raw_t, _ = clean_openiti_inline(re.sub(r"^###\s*[\$\s]+", "", line))
            cur_title = raw_t.rstrip(":.").strip() or "ترجمة"
            continue

        if line.strip() == "### |" and not seen_first_dollar:
            continue
        cur_lines.append(line)

    flush_raw()

    by_vol: Dict[int, List[Tuple[str, str, List[str]]]] = {v: [] for v in range(1, 11)}
    for ev, title, sec, elines in raw_entries:
        v_clamped = min(max(ev, 1), 10)
        # Only preserve early Vol 1/2 `أهل الصفة` / `الطبقة الأولى` header where relevant
        safe_sec = sec if (v_clamped <= 2 and sec) else f"المجلد {v_clamped} • {HILYA_VOL_NOTES[v_clamped]}"
        by_vol[v_clamped].append((title, safe_sec, elines))

    chunks_meta = []
    total_entries = 0
    total_bytes = 0

    for v in range(1, 11):
        cid = v - 1
        vol_items = by_vol[v]
        entries: List[Dict[str, Any]] = []
        for idx, (title, sec, elines) in enumerate(vol_items, 1):
            body, pgs = normalize_paragraphs(elines)
            if not body.strip():
                continue
            pr = format_page_ref(pgs)
            entries.append({
                "id": f"hilya-{v}-{idx}",
                "chunkId": cid,
                "orderInChunk": idx,
                "entryNumber": str(idx),
                "title_ar": title,
                "sectionPath_ar": sec or f"المجلد {v} • {HILYA_VOL_NOTES[v]}",
                **({"pageRef": pr} if pr else {}),
                "text_ar": body,
            })
            total_entries += 1

        pages_in_chunk = [e.get("pageRef", "") for e in entries if e.get("pageRef")]
        meta = {
            "bookSlug": "hilya",
            "bookTitle_ar": "حلية الأولياء وطبقات الأصفياء",
            "author_ar": "الحافظ أبو نعيم أحمد بن عبد الله الأصبهاني (ت 430 هـ)",
            "chunkId": cid,
            "chunkLabel": f"المجلد {v}: {HILYA_VOL_NOTES[v]}",
            "subGroup": f"الجزء {v} من 10",
            "entryCount": len(entries),
            "pageRange": f"{pages_in_chunk[0]} … {pages_in_chunk[-1]}" if len(pages_in_chunk) > 1 else (pages_in_chunk[0] if pages_in_chunk else f"المجلد {v}"),
        }
        sz = write_gz_json(OUT_DIR / "hilya" / f"chunk_{cid}.json.gz", {"meta": meta, "entries": entries})
        total_bytes += sz
        chunks_meta.append(meta)

    return {
        "slug": "hilya",
        "title_ar": "حِلْيَةُ الأَوْلِيَاءِ وَطَبَقَاتُ الأَصْفِيَاءِ",
        "subtitle_ar": "الموسوعة الأم في تراجم أعلام التصوف السني وأئمة الزهد والحديث عبر عشرة مجلدات",
        "author_ar": "الحافظ أبو نعيم أحمد بن عبد الله الأصبهاني",
        "deathHijri": "430 هـ",
        "eraNote_ar": "10 مجلدات كاملة مسندة • مرجع تأسيسي في براءة التصوف السني وتراجم العارفين",
        "scholarlyNote_ar": "انطلق الحافظ أبو نعيم في مقدمته بتقرير عقيدة أهل السنة والتبرؤ من الغلو والحلولية، ثم سرد تراجم كبار الصحابة والتابعين وأئمة المذاهب الأربعة وسادات الصوفية كالجنيد والمحاسبي بأسانيدهم ومواعظهم.",
        "totalEntries": total_entries,
        "totalChunks": len(chunks_meta),
        "compressedBytes": total_bytes,
        "chunks": chunks_meta,
    }


# ---------------------------------------------------------------------------
# 3. الإصابة في تمييز الصحابة - الحافظ ابن حجر العسقلاني
# ---------------------------------------------------------------------------
def extract_isaba_title(raw_first_line: str) -> Tuple[Optional[str], str, str]:
    clean_full, _ = clean_openiti_inline(raw_first_line, strip_pipes=True)
    m = re.match(r"^(\d+)\s+(.+)$", clean_full)
    num_str: Optional[str] = None
    rest = clean_full
    if m:
        num_str = m.group(1)
        rest = m.group(2).strip()

    cut_pos = len(rest)
    for marker in [
        " قال ", " روى ", " له ", " لها ", " ذكره ", " ذكرها ", " ذكر ",
        " استدرك", " كان ", " كانت ", " أخرج", " تقدمت ", " تقدم ", " تأتي ",
        " يأتي ", " مضى ", " وقع ", " قيل ", " ورد ", " بعثه ", " عداده ",
        " مختلف ", " ذكروا ", " أدرك ", " وفد ", " روت ", " صحابي ", " صحابية ",
    ]:
        idx = rest.find(marker)
        if idx >= 4 and idx < cut_pos:
            cut_pos = idx
    title = rest[:cut_pos].strip(" ،.:؛")
    words = title.split()
    if len(words) > 9:
        title = " ".join(words[:8]) + "…"
    return num_str, title or rest[:50], clean_full


def fix_isaba_h1(h1: str) -> str:
    h = h1.strip("() ").strip()
    if h == "حرف الهاء المهملة":
        return "حرف الحاء المهملة"
    return h


def parse_isaba() -> Dict[str, Any]:
    lines = (SRC_DIR / "isaba.mARkdown").read_text(encoding="utf-8").splitlines()
    start_idx = 0
    for idx, l in enumerate(lines):
        if l.startswith("#META#Header#End#"):
            start_idx = idx + 1
            break

    sections: List[Tuple[str, List[str]]] = []
    cur_h1: Optional[str] = None
    pre_h1_lines: List[str] = []
    cur_lines: List[str] = []

    for line in lines[start_idx:]:
        if line.startswith("### | "):
            if cur_h1 is None:
                cur_h1 = fix_isaba_h1(line[6:])
                cur_lines = list(pre_h1_lines)
                pre_h1_lines = []
            else:
                sections.append((cur_h1, cur_lines))
                cur_h1 = fix_isaba_h1(line[6:])
                cur_lines = []
        else:
            if cur_h1 is None:
                pre_h1_lines.append(line)
            else:
                cur_lines.append(line)
    if cur_h1 is not None and cur_lines:
        sections.append((cur_h1, cur_lines))

    # Now sections[0..3] are strictly: مقدمة, الفصل الأول, الفصل الثاني, الفصل الثالث
    intro_secs = sections[:4]
    rest_secs = sections[4:]

    grouped_sections: List[Tuple[str, str, List[Tuple[str, List[str]]]]] = [
        ("المقدمة والفصول التمهيدية في تعريف الصحابي وعدالتهم", "المقدمة الأصولية والمنهجية", intro_secs)
    ]
    for h1, sec_lines in rest_secs:
        if "النساء" in h1:
            sub = "كتاب النساء على حروف المعجم"
        elif "الكنى" in h1:
            sub = "باب الكنى"
        else:
            sub = "قسم الأسماء على حروف المعجم"
        grouped_sections.append((h1, sub, [(h1, sec_lines)]))

    chunks_meta = []
    total_entries = 0
    total_bytes = 0

    for cid, (chunk_label, sub_group, sub_secs) in enumerate(grouped_sections):
        entries: List[Dict[str, Any]] = []

        for sub_h1, sec_lines in sub_secs:
            if cid == 0:
                body, pgs = normalize_paragraphs(sec_lines, strip_pipes=True)
                if body.strip():
                    pr = format_page_ref(pgs)
                    order = len(entries) + 1
                    entries.append({
                        "id": f"isaba-{cid}-{order}",
                        "chunkId": cid,
                        "orderInChunk": order,
                        "entryNumber": str(order),
                        "title_ar": sub_h1,
                        "sectionPath_ar": "مقدمة الحافظ ابن حجر",
                        **({"pageRef": pr} if pr else {}),
                        "text_ar": body,
                    })
                    total_entries += 1
                continue

            cur_qism = ""
            cur_bab = ""
            cur_raw_header: Optional[str] = None
            cur_entry_lines: List[str] = []

            def flush_isaba_entry():
                nonlocal total_entries
                if cur_raw_header is None:
                    return
                num_str, short_title, full_first = extract_isaba_title(cur_raw_header)
                # Prepend cur_raw_header as first `# ` paragraph so trailing `~~` lines join seamlessly mid-sentence!
                merged_lines = [f"# {full_first}"] + cur_entry_lines
                combined_text, pgs = normalize_paragraphs(merged_lines, strip_pipes=True)
                if not combined_text.strip() or not short_title.strip():
                    return
                _, head_pgs = clean_openiti_inline(cur_raw_header)
                all_pgs = head_pgs + pgs
                pr = format_page_ref(all_pgs)
                order = len(entries) + 1
                path_parts = [p for p in [sub_h1, cur_qism, cur_bab] if p]
                entries.append({
                    "id": f"isaba-{cid}-{order}",
                    "chunkId": cid,
                    "orderInChunk": order,
                    **({"entryNumber": num_str} if num_str else {}),
                    "title_ar": short_title,
                    "sectionPath_ar": " • ".join(path_parts),
                    **({"pageRef": pr} if pr else {}),
                    "text_ar": combined_text,
                })
                total_entries += 1

            for line in sec_lines:
                if line.startswith("### |||| "):
                    h, _ = clean_openiti_inline(line[9:], strip_pipes=True)
                    cur_bab = h.strip("() ").strip()
                    continue
                if line.startswith("### ||| "):
                    h, _ = clean_openiti_inline(line[8:], strip_pipes=True)
                    cur_bab = h.strip("() ").strip()
                    continue
                if line.startswith("### || "):
                    h, _ = clean_openiti_inline(line[7:], strip_pipes=True)
                    cur_qism = h.strip("() ").strip()
                    cur_bab = ""
                    continue
                if line.startswith("### $$ "):
                    flush_isaba_entry()
                    cur_entry_lines = []
                    cur_raw_header = line[7:]
                    continue
                if line.startswith("### $ "):
                    flush_isaba_entry()
                    cur_entry_lines = []
                    cur_raw_header = line[6:]
                    continue
                if cur_raw_header is not None:
                    cur_entry_lines.append(line)

            flush_isaba_entry()

        pages_in_chunk = [e.get("pageRef", "") for e in entries if e.get("pageRef")]
        meta = {
            "bookSlug": "isaba",
            "bookTitle_ar": "الإصابة في تمييز الصحابة",
            "author_ar": "الحافظ شهاب الدين أحمد بن علي بن حجر العسقلاني (ت 852 هـ)",
            "chunkId": cid,
            "chunkLabel": chunk_label,
            "subGroup": sub_group,
            "entryCount": len(entries),
            "pageRange": f"{pages_in_chunk[0]} … {pages_in_chunk[-1]}" if len(pages_in_chunk) > 1 else (pages_in_chunk[0] if pages_in_chunk else ""),
        }
        sz = write_gz_json(OUT_DIR / "isaba" / f"chunk_{cid}.json.gz", {"meta": meta, "entries": entries})
        total_bytes += sz
        chunks_meta.append(meta)

    return {
        "slug": "isaba",
        "title_ar": "الإِصَابَةُ فِي تَمْيِيزِ الصَّحَابَةِ",
        "subtitle_ar": "أوسع موسوعة حديثية وتاريخية محرَّرة في تراجم صحابة رسول الله ﷺ وأقسامهم",
        "author_ar": "الحافظ أبو الفضل أحمد بن علي بن حجر العسقلاني",
        "deathHijri": "852 هـ",
        "eraNote_ar": "8 مجلدات كاملة • أربع طبقات نقدية دقيقة في إثبات الصحبة",
        "scholarlyNote_ar": "رتبه الحافظ ابن حجر على حروف المعجم ثم الكنى ثم كتاب النساء، وقسّم كل حرف إلى 4 أقسام محكمة ليميز بدقة المحدثين بين من ثبتت صحبته، ومن له رؤية، والمخضرمين، ومن وقع ذكره في كتب الصحابة وهماً.",
        "totalEntries": total_entries,
        "totalChunks": len(chunks_meta),
        "compressedBytes": total_bytes,
        "chunks": chunks_meta,
    }


def main():
    # Clean stale chunks if any
    for sub in ("safwat", "hilya", "isaba"):
        d = OUT_DIR / sub
        if d.exists():
            for p in d.glob("*.json.gz"):
                p.unlink()

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    print("Building صفة الصفوة...")
    safwat = parse_sifat_safwa()
    print(f"  -> {safwat['totalEntries']} entries across {safwat['totalChunks']} chunks ({safwat['compressedBytes']/1024:.1f} KB gz)")

    print("Building حلية الأولياء...")
    hilya = parse_hilyat_awliya()
    print(f"  -> {hilya['totalEntries']} entries across {hilya['totalChunks']} chunks ({hilya['compressedBytes']/1024:.1f} KB gz)")

    print("Building الإصابة في تمييز الصحابة...")
    isaba = parse_isaba()
    print(f"  -> {isaba['totalEntries']} entries across {isaba['totalChunks']} chunks ({isaba['compressedBytes']/1024:.1f} KB gz)")

    index_data = {
        "books": [safwat, hilya, isaba],
        "totalEntries": safwat["totalEntries"] + hilya["totalEntries"] + isaba["totalEntries"],
    }
    (OUT_DIR / "index.json").write_text(json.dumps(index_data, ensure_ascii=False, indent=2), encoding="utf-8")
    total_kb = (safwat["compressedBytes"] + hilya["compressedBytes"] + isaba["compressedBytes"]) / 1024
    print(f"DONE! Total index entries={index_data['totalEntries']}, Total gzipped data={total_kb:.1f} KB ({total_kb/1024:.2f} MB)")


if __name__ == "__main__":
    main()
