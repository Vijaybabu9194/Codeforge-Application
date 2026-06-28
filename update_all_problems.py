#!/usr/bin/env python3
"""
CodeForge LeetCode Data Refresher & Fixer
==========================================
Cleanly parses real LeetCode descriptions, examples (with input/output values),
and non-repeating constraints using LeetCode GraphQL / Alfa API.
"""

import json, re, time, random, sys
import requests
import psycopg2
from bs4 import BeautifulSoup

DB_URL = "postgresql://neondb_owner:npg_nav3E9wLyMUH@ep-bitter-bonus-aqt125cn.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require"

def slug_from_url(url):
    if not url: return None
    m = re.search(r'leetcode\.com/problems/([^/?#]+)', url)
    return m.group(1) if m else None

def fetch_problem_data(slug):
    """Fetch problem data from Alfa LeetCode API or direct GraphQL."""
    try:
        url = f"https://alfa-leetcode-api.onrender.com/select?titleSlug={slug}"
        r = requests.get(url, timeout=12)
        if r.status_code == 200:
            data = r.json()
            if 'question' in data and data['question']:
                return data
    except Exception as e:
        pass
    return None

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

def parse_html_content(html):
    if not html:
        return "", [], ""

    soup = BeautifulSoup(html, 'html.parser')

    # 1. Parse examples (Input, Output, Explanation)
    examples = []
    for pre in soup.find_all('pre'):
        text = pre.get_text()
        ex = {}
        for line in text.split('\n'):
            line = line.strip()
            if not line: continue
            m_in = re.search(r'Input:\s*(.*)', line, re.I)
            m_out = re.search(r'Output:\s*(.*)', line, re.I)
            m_exp = re.search(r'Explanation:\s*(.*)', line, re.I)
            if m_in: ex['input'] = m_in.group(1).strip()
            if m_out: ex['output'] = m_out.group(1).strip()
            if m_exp: ex['explanation'] = m_exp.group(1).strip()
        if 'input' in ex and 'output' in ex:
            examples.append(ex)

    # 2. Parse constraints (non-repeating)
    constraints_list = []
    const_header = soup.find(lambda t: t.name in ['p', 'strong', 'h3', 'h4'] and 'constraints' in t.get_text().lower())
    if const_header:
        ul = const_header.find_next(['ul', 'ol'])
        if ul:
            for li in ul.find_all('li'):
                c = li.get_text().strip()
                if c and c not in constraints_list:
                    constraints_list.append(c)

    # 3. Clean problem statement HTML (remove examples and constraints section)
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

def process_all():
    conn = psycopg2.connect(DB_URL)
    conn.autocommit = False
    cur = conn.cursor()

    cur.execute("SELECT id, title, leetcode_url FROM problems WHERE leetcode_url IS NOT NULL AND leetcode_url != '' ORDER BY id")
    rows = cur.fetchall()
    print(f"Loaded {len(rows)} problems from database.")

    success = 0
    failed = 0

    for i, row in enumerate(rows):
        prob_id, title, lc_url = row[0], row[1], row[2]
        slug = slug_from_url(lc_url)
        if not slug: continue

        data = fetch_problem_data(slug)
        if not data:
            print(f"[{i+1}/{len(rows)}] ❌ Fetch failed for {title} ({slug})")
            failed += 1
            continue

        html = data.get('question', '')
        hints = data.get('hints', []) or []
        topic_tags = data.get('topicTags', []) or []

        statement, examples, constraints = parse_html_content(html)

        # Build sample test cases & hidden test cases
        sample_cases = []
        for ex in examples[:3]:
            tc = {'input': ex.get('input', ''), 'output': ex.get('output', '')}
            if ex.get('explanation'): tc['explanation'] = ex['explanation']
            sample_cases.append(tc)

        hidden_cases = [{'input': ex.get('input', ''), 'output': ex.get('output', '')} for ex in examples[:5]]
        if not hidden_cases: hidden_cases = sample_cases

        starter_code = build_starter_code(data.get('codeSnippets'))

        # Update problem
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
            json.dumps(starter_code, ensure_ascii=False),
            prob_id
        ))

        # Update topics
        for tag in topic_tags:
            tag_name = tag.get('name')
            if tag_name:
                cur.execute("INSERT INTO topics (name) VALUES (%s) ON CONFLICT (name) DO NOTHING", (tag_name,))
                cur.execute("SELECT id FROM topics WHERE name = %s", (tag_name,))
                t_row = cur.fetchone()
                if t_row:
                    cur.execute("INSERT INTO problem_topics (problem_id, topic_id) VALUES (%s, %s) ON CONFLICT DO NOTHING", (prob_id, t_row[0]))

        conn.commit()
        success += 1
        print(f"[{i+1}/{len(rows)}] ✅ {title} -> {len(sample_cases)} examples (val: '{sample_cases[0]['input'][:20] if sample_cases else ''}'), {len(constraints.splitlines())} constraints")
        time.sleep(0.3)

    cur.close()
    conn.close()
    print(f"\nFinished! Success: {success}, Failed: {failed}")

if __name__ == '__main__':
    process_all()
