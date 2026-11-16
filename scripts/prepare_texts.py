# -*- coding: utf-8 -*-
import urllib.request, json, re

def get_wikisource_burdah():
    url = 'https://ar.wikisource.org/w/api.php?action=parse&pageid=85226&prop=wikitext&format=json'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        wikitext = data['parse']['wikitext']['*']
    m = re.search(r'{{أبيات\|(.*?)}}', wikitext, re.DOTALL)
    if not m:
        return []
    lines = [v.strip() for v in m.group(1).split('\n') if v.strip() and '\\\\' in v]
    verses = []
    for l in lines:
        parts = l.split('\\\\')
        if len(parts) == 2:
            sadr = re.sub(r'<ref.*?>.*?</ref>', '', parts[0]).strip()
            ajuz = re.sub(r'<ref.*?>.*?</ref>', '', parts[1]).strip()
            verses.append((sadr, ajuz))
    return verses

def get_wikipedia_munfarijah():
    url = 'https://ar.wikipedia.org/w/api.php?action=parse&page=%D8%A7%D9%84%D9%82%D8%B5%D9%8A%D8%AF%D8%A9_%D8%A7%D9%84%D9%85%D9%86%D9%81%D8%B1%D8%AC%D8%A9&prop=wikitext&format=json'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        wikitext = data['parse']['wikitext']['*']
    m = re.search(r'{{أبيات\|(.*?)}}', wikitext, re.DOTALL)
    if not m:
        return []
    lines = [v.strip() for v in m.group(1).split('\n') if v.strip() and '\\\\' in v]
    verses = []
    for l in lines:
        parts = l.split('\\\\')
        if len(parts) == 2:
            sadr = re.sub(r'<ref.*?>.*?</ref>', '', parts[0]).strip()
            sadr = re.sub(r'<.*?>', '', sadr).strip()
            ajuz = re.sub(r'<ref.*?>.*?</ref>', '', parts[1]).strip()
            ajuz = re.sub(r'<.*?>', '', ajuz).strip()
            verses.append((sadr, ajuz))
    return verses

b_verses = get_wikisource_burdah()
m_verses = get_wikipedia_munfarijah()
print(f"Burdah verses fetched: {len(b_verses)}")
print(f"Munfarijah verses fetched: {len(m_verses)}")
