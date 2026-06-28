#!/usr/bin/env python3
"""
LeetCode Problem Data Fetcher for CodeForge (Direct GraphQL Engine)
==================================================================
Fetches real problem data directly from LeetCode's public GraphQL API,
parses clean HTML descriptions, extracts real example values (inputs/outputs),
deduplicates constraints, and updates the Neon PostgreSQL database.

Run: python3 fetch_leetcode_data.py [--limit N] [--reset] [--problem-id ID]
"""

import json, re, time, random, sys, argparse
import requests
import psycopg2
from bs4 import BeautifulSoup

# ─── Config ───────────────────────────────────────────────────────────────────
DB_URL = "postgresql://neondb_owner:npg_nav3E9wLyMUH@ep-bitter-bonus-aqt125cn.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require"
LC_GRAPHQL = "https://leetcode.com/graphql"

HEADERS = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Referer": "https://leetcode.com",
    "Origin": "https://leetcode.com",
}

QUERY = """
query questionData($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    questionId
    title
    titleSlug
    content
    difficulty
    topicTags { name slug }
    hints
    exampleTestcaseList
    codeSnippets { lang langSlug code }
    metaData
  }
}
"""

def slug_from_url(url):
    if not url: return None
    m = re.search(r'leetcode\.com/problems/([^/?#]+)', url)
    return m.group(1) if m else None

def parse_html_content(html):
    """
    Bulletproof parser for LeetCode HTML content:
    1. Extracts examples (Input, Output, Explanation) with real values
    2. Extracts non-repeating constraints
    3. Returns clean continuous HTML statement without examples or constraints header
    """
    if not html:
        return "", [], ""

    soup = BeautifulSoup(html, 'html.parser')

    # 1. Parse examples from <pre> tags with full multiline regex
    examples = []
    for pre in soup.find_all('pre'):
        text = pre.get_text()
        ex = {}
        m_in = re.search(r'Input:\s*(.*?)(?=\n?\s*(?:Output:|Explanation:|$))', text, re.DOTALL | re.I)
        m_out = re.search(r'Output:\s*(.*?)(?=\n?\s*(?:Explanation:|$))', text, re.DOTALL | re.I)
        m_exp = re.search(r'Explanation:\s*(.*)', text, re.DOTALL | re.I)
        if m_in: ex['input'] = m_in.group(1).strip()
        if m_out: ex['output'] = m_out.group(1).strip()
        if m_exp: ex['explanation'] = m_exp.group(1).strip()
        if 'input' in ex and 'output' in ex:
            examples.append(ex)

    # 2. Parse constraints (non-repeating)
    constraints_list = []
    const_header = soup.find(lambda t: t.name in ['p', 'strong', 'h3', 'h4', 'div'] and 'constraints' in t.get_text().lower())
    if const_header:
        ul = const_header.find_next(['ul', 'ol'])
        if ul:
            for li in ul.find_all('li'):
                c = li.get_text().strip()
                if c and c not in constraints_list:
                    constraints_list.append(c)

    # 3. Clean problem statement HTML
    for tag in soup.find_all('pre'):
        tag.decompose()
    for tag in soup.find_all(lambda t: t.name in ['p', 'strong', 'div'] and re.search(r'Example\s*\d+', t.get_text(), re.I)):
        tag.decompose()
    if const_header:
        ul = const_header.find_next(['ul', 'ol'])
        if ul: ul.decompose()
        const_header.decompose()

    # Remove empty tags
    for p in soup.find_all(['p', 'div']):
        if not p.get_text().strip():
            p.decompose()

    statement_html = str(soup).strip()
    # Clean up whitespace between paragraph tags
    statement_html = re.sub(r'>\s+<', '><', statement_html)
    statement_html = re.sub(r'(</p>|<br/?>)', r'\1\n', statement_html).strip()

    return statement_html, examples, '\n'.join(constraints_list)

LANG_MAP = {'python3': 'python', 'python': 'python', 'java': 'java', 'cpp': 'cpp', 'c++': 'cpp'}

def build_starter_code(snippets):
    result = {}
    for s in (snippets or []):
        key = LANG_MAP.get(s.get('langSlug', '').lower())
        if key and key not in result:
            result[key] = s.get('code', '')
    for lang, fallback in {
        'python': '# Write your solution here\n',
        'java': 'public class Main {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}\n',
        'cpp': '#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n    // Write your solution here\n    return 0;\n}\n',
    }.items():
        result.setdefault(lang, fallback)
    return result

def fetch_lc(slug):
    try:
        r = requests.post(LC_GRAPHQL, headers=HEADERS,
                          json={"query": QUERY, "variables": {"titleSlug": slug}},
                          timeout=15)
        if r.status_code != 200:
            print(f"    ✗ HTTP {r.status_code}")
            return None
        d = r.json()
        if 'errors' in d:
            print(f"    ✗ GraphQL errors: {d['errors']}")
            return None
        return d.get('data', {}).get('question')
    except Exception as e:
        print(f"    ✗ Error: {e}")
        return None

def upsert_topics(cur, prob_id, topic_tags):
    for tag in topic_tags:
        cur.execute("""
            INSERT INTO topics (name)
            VALUES (%s)
            ON CONFLICT (name) DO NOTHING
        """, (tag['name'],))
        cur.execute("SELECT id FROM topics WHERE name = %s", (tag['name'],))
        row = cur.fetchone()
        if not row: continue
        topic_id = row[0]
        cur.execute("""
            INSERT INTO problem_topics (problem_id, topic_id)
            VALUES (%s, %s)
            ON CONFLICT DO NOTHING
        """, (prob_id, topic_id))

def process_row(row, cur):
    prob_id, title, lc_url = row[0], row[1], row[2]
    slug = slug_from_url(lc_url)
    if not slug: return False

    print(f"  → {title} [{slug}]", end=" ", flush=True)
    q = fetch_lc(slug)
    if not q: return False

    html       = q.get('content') or ''
    hints      = q.get('hints') or []
    topic_tags = q.get('topicTags') or []
    snippets   = q.get('codeSnippets') or []
    lc_raw_tc  = q.get('exampleTestcaseList') or []

    statement, examples, constraints = parse_html_content(html)
    starter = build_starter_code(snippets)

    sample_cases = []
    for ex in examples[:3]:
        tc = {'input': ex.get('input',''), 'output': ex.get('output','')}
        if ex.get('explanation'): tc['explanation'] = ex['explanation']
        sample_cases.append(tc)

    if not sample_cases and lc_raw_tc:
        for raw in lc_raw_tc[:3]:
            sample_cases.append({'input': raw, 'output': ''})

    hidden_cases = [{'input': ex.get('input',''), 'output': ex.get('output','')} for ex in examples[:5]]
    if not hidden_cases: hidden_cases = sample_cases

    cur.execute("""
        UPDATE problems SET
            problem_statement = %s,
            sample_test_cases = %s,
            hidden_test_cases = %s,
            constraints = %s,
            hints = %s,
            starter_code = %s
        WHERE id = %s
    """, (
        statement,
        json.dumps(sample_cases, ensure_ascii=False),
        json.dumps(hidden_cases, ensure_ascii=False),
        constraints,
        json.dumps(hints, ensure_ascii=False),
        json.dumps(starter, ensure_ascii=False),
        prob_id
    ))

    if topic_tags:
        upsert_topics(cur, prob_id, topic_tags)

    names = [t['name'] for t in topic_tags]
    print(f"✓ {len(sample_cases)} ex (val: '{sample_cases[0]['input'][:18] if sample_cases else ''}'), {len(constraints.splitlines())} constr, tags={names[:3]}")
    return True

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--limit', type=int, default=350, help='Max problems to process')
    parser.add_argument('--problem-id', type=int, default=None, help='Process only this problem ID')
    parser.add_argument('--reset', action='store_true', help='Re-fetch even if already has content')
    args = parser.parse_args()

    print("=" * 62)
    print("  CodeForge — LeetCode Direct Data Fetcher")
    print("=" * 62)

    conn = psycopg2.connect(DB_URL)
    conn.autocommit = False
    cur = conn.cursor()

    if args.problem_id:
        cur.execute("SELECT id, title, leetcode_url FROM problems WHERE id = %s", (args.problem_id,))
    elif args.reset:
        cur.execute("SELECT id, title, leetcode_url FROM problems WHERE leetcode_url IS NOT NULL AND leetcode_url != '' ORDER BY id LIMIT %s", (args.limit,))
    else:
        cur.execute("""
            SELECT id, title, leetcode_url FROM problems
            WHERE leetcode_url IS NOT NULL AND leetcode_url != ''
            AND (problem_statement IS NULL OR TRIM(problem_statement) = '' OR sample_test_cases LIKE '%%""%%')
            ORDER BY id LIMIT %s
        """, (args.limit,))

    rows = cur.fetchall()
    total = len(rows)
    print(f"📚 {total} problems to process\n")

    success = failed = 0
    for i, row in enumerate(rows):
        print(f"[{i+1}/{total}]", end="")
        try:
            ok = process_row(row, cur)
            conn.commit()
            if ok: success += 1
            else: failed += 1
        except Exception as e:
            conn.rollback()
            print(f" ✗ DB error: {e}")
            failed += 1

        if i < total - 1:
            time.sleep(random.uniform(0.5, 1.2))

    print("\n" + "=" * 62)
    print(f"  ✅ Finished! Success: {success}  ❌ Failed: {failed}  Total: {total}")
    print("=" * 62)
    cur.close()
    conn.close()

if __name__ == '__main__':
    main()
