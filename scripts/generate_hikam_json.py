import csv
import json
import os
import re

csv_path = "/Users/fedala/Documents/hikam ataiya/f4954967-31ff-4da7-93ea-c21a51835180_ExportBlock-b710d7d8-3c29-4e71-b0b2-d2f6837bc8c3/الحكم العطائية (Al-Hikam Al-'Ata'iyya) 7811db37511a4216b262d5c1739aa49c.csv"

def strip_tashkeel(text):
    return re.sub(r'[\u064B-\u065F\u0670\u0640]', '', text)

THEMES = [
    ('التوكل والتدبير', ['تدبير', 'اسباب', 'تجريد', 'قدر', 'اقدار', 'همم', 'تكفل', 'كفاية', 'قسمة', 'ضمان', 'مشيئة']),
    ('الإخلاص والنية', ['اخلاص', 'اعتماد', 'رياء', 'عمل', 'اعمال', 'نية', 'قبول', 'عجب', 'مدح']),
    ('الأدب والصحبة', ['صحبة', 'تصحب', 'صاحب', 'ادب', 'اخوان', 'شيخ', 'مريد', 'مجالسة', 'عشرة', 'اخيك']),
    ('الذكر والحضور', ['ذكر', 'غفلة', 'يقظة', 'حضور', 'لسان', 'ورد', 'اوراد', 'وارد', 'واردات']),
    ('الرجاء وحسن الظن', ['رجاء', 'خوف', 'دعاء', 'عطاء', 'منع', 'اجابة', 'ياس', 'تاخر', 'حسن الظن', 'بسط', 'قبض']),
    ('تزكية النفس والتواضع', ['نفس', 'شهوة', 'هوى', 'عجب', 'كبر', 'تواضع', 'ذنب', 'توبة', 'زلل', 'معصية', 'طاعة', 'دفن']),
    ('الافتقار والعبودية', ['فقر', 'فاقة', 'افتقار', 'عجز', 'عبودية', 'ذل', 'عزة', 'ربوبية', 'غنى']),
    ('المعرفة والشهود', ['معرفة', 'نور', 'انوار', 'شهود', 'حجاب', 'كشف', 'بصيرة', 'تجل', 'وجود', 'كون', 'اثر'])
]

def classify(text, exp):
    raw = strip_tashkeel(text + ' ' + exp).replace('أ', 'ا').replace('إ', 'ا').replace('آ', 'ا').replace('ة', 'ه')
    scores = {}
    for theme, kws in THEMES:
        score = sum(raw.count(kw) for kw in kws)
        if score > 0:
            scores[theme] = score
    if scores:
        return max(scores, key=scores.get)
    return 'حكمة وسلوك'

with open(csv_path, 'r', encoding='utf-8-sig') as f:
    rows = list(csv.DictReader(f))

# Deduplicate by number keeping the one with best/fuller text or the second one exported
by_num = {}
for r in rows:
    num_str = r.get('Numéro', '').strip()
    if num_str.isdigit():
        num = int(num_str)
        # Check image availability
        by_num[num] = r

hikam_list = []
for num in sorted(by_num.keys()):
    r = by_num[num]
    text_ar = r.get('Texte Arabe', '').strip()
    text_fr = r.get('Traduction (Français)', '').strip()
    text_en = r.get('Traduction', '').strip()
    exp_ar = r.get('Explication (Arabe)', '').strip()
    
    # Topic
    topic = classify(text_ar, exp_ar)
    
    # Title from Hikma or excerpt
    raw_title = r.get('Hikma', '').strip()
    if '.' in raw_title:
        title = raw_title.split('.', 1)[1].strip()
    else:
        title = raw_title if raw_title else text_ar[:50] + "..."
    
    padded_num = f"{num:03d}"
    img_rel_path = f"/images/hikam/Hikma_{padded_num}.jpg"
    
    # Check if image file exists
    full_img_path = os.path.join(os.getcwd(), "public", "images", "hikam", f"Hikma_{padded_num}.jpg")
    has_image = os.path.exists(full_img_path)
    
    hikam_list.append({
        "id": num,
        "number": num,
        "title": title,
        "topic": topic,
        "text_ar": text_ar,
        "text_fr": text_fr,
        "text_en": text_en,
        "explanation_ar": exp_ar,
        "explanation_fr": text_fr, # Rich commentary is infused in the translated aphorism
        "explanation_en": text_en,
        "capsule_image_url": img_rel_path,
        "has_image": has_image
    })

out_file = "src/data/hikam.json"
with open(out_file, "w", encoding="utf-8") as out:
    json.dump(hikam_list, out, ensure_ascii=False, indent=2)

print(f"Generated {len(hikam_list)} Hikam entries in {out_file}")
