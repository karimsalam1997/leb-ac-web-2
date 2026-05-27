from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "longform-essays.md"
OUT = ROOT / "voice-rebuild-2026-05-22" / "audits" / "ai-writing-instance-audit.md"


PATTERNS: list[tuple[str, str, str]] = [
    ("banned_word", r"\b(delve|underscore|pivotal|intricate|tapestry|navigate|landscape|robust|seamless|resonates|foster|vibrant|profound|journey|embark|harness|leverage|unlock|unleash|paradigm|ecosystem|testament|indelible|enduring|crucial|emphasizing|highlighting|showcasing|reflecting|encompassing|multifaceted|holistic)\b", "Banned or generic assistant diction."),
    ("banned_phrase", r"\b(it is worth noting|in today's rapidly evolving|in an era where|contributing to|at its core|in many ways|what emerges is|this is why|this matters|this is not|that does not mean|not only|not merely|it is also)\b", "Visible essay scaffolding or AI transition."),
    ("representation_verb", r"\b(stands as|serves as|represents|marks a|symbolizes)\b", "Weak substitute for plain 'is' or a concrete verb."),
    ("unlock_logic", r"\b(unlock|leverage|maximize|optimize|activate|reimagine)\b", "Strategy-speak that flattens the politics."),
    ("abstract_cluster", r"\b(identity|memory|sovereignty|infrastructure|fragmentation|resilience|belonging|continuity|authenticity|coexistence|modernity|heritage)\b(?:\W+\w+){0,6}\W+\b(identity|memory|sovereignty|infrastructure|fragmentation|resilience|belonging|continuity|authenticity|coexistence|modernity|heritage)\b", "Two or more abstractions are carrying the sentence."),
]


def split_essays(text: str) -> list[tuple[str, int, list[str]]]:
    lines = text.splitlines()
    essays: list[tuple[str, int, list[str]]] = []
    title = ""
    start = 1
    buf: list[str] = []
    for idx, line in enumerate(lines, start=1):
        if line.startswith("## "):
            if title:
                essays.append((title, start, buf))
            title = line[3:].strip()
            start = idx
            buf = [line]
        elif title:
            buf.append(line)
    if title:
        essays.append((title, start, buf))
    return essays


def sentence_count(paragraph: str) -> int:
    return len([s for s in re.split(r"(?<=[.!?])\s+", paragraph.strip()) if s])


def main() -> None:
    text = SOURCE.read_text(encoding="utf-8")
    essays = split_essays(text)
    out: list[str] = [
        "# AI-Writing Instance Audit",
        "",
        "This audit is mechanical. It does not prove a line was written by AI. It marks places where the prose uses habits that now read as assistant-shaped: tidy transitions, soft abstractions, symmetrical concessions, strategy diction, and too-even explanatory rhythm.",
        "",
    ]
    total_hits = 0
    for title, start, lines in essays:
        if title in {"Essays", "Letters"}:
            continue
        body = "\n".join(lines)
        hits: list[tuple[int, str, str, str]] = []
        for offset, line in enumerate(lines):
            line_no = start + offset
            for label, pattern, reason in PATTERNS:
                if re.search(pattern, line, flags=re.I):
                    hits.append((line_no, label, reason, line.strip()))
        paras = [p.strip() for p in re.split(r"\n\s*\n", body) if p.strip()]
        even_paras = [
            p for p in paras
            if sentence_count(p) in {3, 4} and 65 <= len(p.split()) <= 130
        ]
        total_hits += len(hits)
        out += [
            f"## {title}",
            "",
            f"- flagged lines: {len(hits)}",
            f"- paragraphs with suspiciously even explanatory shape: {len(even_paras)}",
            "",
        ]
        for line_no, label, reason, line in hits[:80]:
            out += [
                f"### line {line_no}: {label}",
                "",
                f"Reason: {reason}",
                "",
                f"> {line}",
                "",
            ]
        if len(hits) > 80:
            out.append(f"_Additional flagged lines omitted after 80 for this essay. Total: {len(hits)}._")
            out.append("")
    out.insert(4, f"Total flagged lines across parsed essays: {total_hits}")
    out.insert(5, "")
    OUT.write_text("\n".join(out), encoding="utf-8")


if __name__ == "__main__":
    main()
