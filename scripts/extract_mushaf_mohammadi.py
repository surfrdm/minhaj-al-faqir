import urllib.request
import re
import json
import time
import os
import sys

OUTPUT_FILE = "/Users/fedala/Library/CloudStorage/GoogleDrive-vfxmotionvfx@gmail.com/Autres ordinateurs/Mon ordinateur/travail ok 2022/FR AR 2023/mushaf_mohammadi_officiel_m6.json"
LOCAL_COPY = "/Users/fedala/Documents/antigravity/site web takwine/src/data/mushaf_mohammadi_officiel_m6.json"

os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
os.makedirs(os.path.dirname(LOCAL_COPY), exist_ok=True)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def fetch_pages(page_num, retries=3):
    url = f"https://almoshaf-almohammadi.ma/mushaf/{page_num}"
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=15) as resp:
                html = resp.read().decode("utf-8")
            
            pattern = r"\{\\\"page_number\\\":[0-9]+.*?(?=\,\{\\\"page_number\\\":|\]\,\"pages_count)"
            matches = re.finditer(pattern, html)
            pages = {}
            for m in matches:
                clean = m.group(0).replace('\\"', '"').replace('\\\\', '\\')
                try:
                    p_obj = json.loads(clean)
                    p_no = p_obj.get("page_number")
                    if p_no is not None:
                        pages[p_no] = p_obj
                except Exception:
                    pass
            return pages
        except Exception as e:
            time.sleep(1)
    return {}

print("🚀 بدء استخراج المصحف المحمدي الشريف من منصة وزارة الأوقاف (almoshaf-almohammadi.ma)...")

collected_pages = {}
target_pages = set(range(2, 605))

# Step 1: Sweep in steps of 4 (covers overlaps)
step = 4
for p in range(2, 606, step):
    batch = fetch_pages(p)
    new_count = 0
    for p_no, p_data in batch.items():
        if p_no not in collected_pages:
            collected_pages[p_no] = p_data
            new_count += 1
    
    current_total = len([p for p in target_pages if p in collected_pages])
    percent = (current_total / len(target_pages)) * 100
    print(f"[{current_total}/{len(target_pages)}] ({percent:.1f}%) - تم استخراج حتى الصفحة {p} (+{new_count} صفحات جديدة)", flush=True)
    time.sleep(0.15) # Gentle rate limit

# Step 2: Check for any missing pages and fetch them individually
missing = sorted(list(target_pages - set(collected_pages.keys())))
if missing:
    print(f"\n🔍 جاري استرجاع الصفحات المتبقية ({len(missing)} صفحة)...", flush=True)
    for p in missing:
        batch = fetch_pages(p)
        for p_no, p_data in batch.items():
            if p_no not in collected_pages:
                collected_pages[p_no] = p_data
        time.sleep(0.2)

final_missing = sorted(list(target_pages - set(collected_pages.keys())))
print(f"\n✅ اكتمل الاستخراج: {len(collected_pages)} صفحة تم جمعها بنجاح.")
if final_missing:
    print(f"⚠️ الصفحات التي لم توجد: {final_missing}")

# Sort and structure
sorted_mushaf = {
    "metadata": {
        "title": "المصحف المحمدي الشريف برواية ورش عن نافع من طريق الأزرق",
        "source": "وزارة الأوقاف والشؤون الإسلامية بالمملكة المغربية • مؤسسة محمد السادس لنشر المصحف الشريف",
        "platform_url": "https://almoshaf-almohammadi.ma",
        "font_family": "AALMAGHRIBI",
        "total_pages": len(collected_pages),
        "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S"),
    },
    "pages": [collected_pages[p] for p in sorted(collected_pages.keys()) if p in target_pages]
}

# Save output
print(f"💾 حفظ البيانات في:\n1. {OUTPUT_FILE}\n2. {LOCAL_COPY}")
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(sorted_mushaf, f, ensure_ascii=False, indent=2)

with open(LOCAL_COPY, "w", encoding="utf-8") as f:
    json.dump(sorted_mushaf, f, ensure_ascii=False, indent=2)

print("🎉 تم الحفظ بنجاح تام!")
