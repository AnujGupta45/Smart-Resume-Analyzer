"""
scorer.py
ATS scoring logic:
  - 40%: keyword matching
  - 30%: section completeness
  - 30%: formatting/readability
"""

from services.nlp_engine import (
    detect_sections,
    match_keywords,
    check_formatting,
    extract_keywords,
)


def calculate_ats_score(resume_text: str, jd_text: str = "") -> dict:
    """
    Computes the full ATS analysis and returns a structured result dict.
    - 50%: keyword matching
    - 25%: section completeness
    - 25%: formatting/readability
    """

    # ── 1. Section completeness (25 pts) ────────────────────────────────────
    sections = detect_sections(resume_text)
    sections_present = sum(1 for s in sections.values() if s["present"])
    # Weighted sections: Skills and Experience count more
    section_score = 0
    if sections["skills"]["present"]: section_score += 7
    if sections["experience"]["present"]: section_score += 7
    if sections["education"]["present"]: section_score += 4
    if sections["projects"]["present"]: section_score += 4
    if sections["summary"]["present"]: section_score += 3
    section_score = min(section_score, 25)

    # ── 2. Keyword matching (50 pts) ────────────────────────────────────────
    if jd_text.strip():
        kw_data = match_keywords(resume_text, jd_text)
        total_jd = kw_data["total_jd_keywords"]
        matched_count = kw_data["matched_count"]
        # Logarithmic-ish scaling or just capped ratio
        keyword_score = round((matched_count / max(total_jd, 1)) * 50)
        keyword_score = min(keyword_score, 50)
        matched_keywords = kw_data["matched"]
        missing_keywords = kw_data["missing"]
    else:
        # No JD: award partial credit based on keyword richness of resume
        resume_kws = extract_keywords(resume_text, top_n=30)
        keyword_score = min(len(resume_kws) * 1.5, 50)  # max 50 pts
        matched_keywords = resume_kws[:20]
        missing_keywords = []

    # ── 3. Formatting / readability (25 pts) ────────────────────────────────
    fmt = check_formatting(resume_text)
    formatting_score = 0

    if fmt["word_count"] >= 300: formatting_score += 5
    if fmt["has_bullets"]: formatting_score += 5
    if fmt["has_email"]: formatting_score += 4
    if fmt["has_phone"]: formatting_score += 4
    if fmt["has_linkedin"]: formatting_score += 3
    if fmt["has_dates"]: formatting_score += 2
    if fmt["action_verb_count"] >= 5: formatting_score += 2

    formatting_score = min(formatting_score, 25)

    # ── 4. Total ─────────────────────────────────────────────────────────────
    total_score = round(keyword_score + section_score + formatting_score)

    # ── 5. Suggestions ────────────────────────────────────────────────────────
    suggestions = _generate_suggestions(sections, fmt, missing_keywords, matched_keywords)

    return {
        "ats_score": total_score,
        "score_breakdown": {
            "keyword_match": keyword_score,
            "section_completeness": section_score,
            "formatting": formatting_score,
        },
        "matched_keywords": matched_keywords,
        "missing_keywords": missing_keywords,
        "sections": sections,
        "suggestions": suggestions,
        "formatting_details": fmt,
    }

def _generate_suggestions(sections: dict, fmt: dict, missing: list, matched: list) -> list:
    """Produce a human-readable list of actionable suggestions."""
    tips = []

    if not sections["skills"]["present"]:
        tips.append("🚨 CRITICAL: Missing a dedicated 'Skills' section. ATS filters rely heavily on this.")
    
    if not sections["experience"]["present"]:
        tips.append("🚨 CRITICAL: Missing 'Experience' section. Add your professional history.")

    if not fmt["has_linkedin"]:
        tips.append("🔗 Add your LinkedIn profile URL to help recruiters find your full professional presence.")

    if not fmt["has_dates"]:
        tips.append("📅 Ensure your experience and education have clear dates (Month/Year).")

    if fmt["action_verb_count"] < 5:
        tips.append("💡 Use stronger action verbs like 'Spearheaded', 'Orchestrated', or 'Pioneered'.")

    if not fmt["has_bullets"]:
        tips.append("📋 Use bullet points instead of paragraphs for better readability.")

    if missing:
        top_missing = ", ".join(missing[:5])
        tips.append(f"🔑 MISSING KEY PHRASES: Consider adding {top_missing} if relevant.")

    return tips

