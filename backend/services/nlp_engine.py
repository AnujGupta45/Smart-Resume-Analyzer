"""
nlp_engine.py
NLP processing: tokenization, stopword removal, keyword extraction,
section detection, and keyword matching against job description.
"""

import re
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.probability import FreqDist
from collections import Counter

# Download required NLTK data on first run
def ensure_nltk_data():
    required = [
        ("tokenizers/punkt_tab", "punkt_tab"),
        ("corpora/stopwords", "stopwords"),
    ]
    for path, package in required:
        try:
            nltk.data.find(path)
        except (LookupError, OSError):
            nltk.download(package, quiet=True)

ensure_nltk_data()

STOP_WORDS = set(stopwords.words("english"))

# Common resume section headers
SECTION_PATTERNS = {
    "skills":     r"\b(skills?|technical\s+skills?|core\s+competencies|competencies|technologies)\b",
    "experience": r"\b(experience|work\s+experience|professional\s+experience|employment|work\s+history)\b",
    "education":  r"\b(education|academic|qualification|degree|university|college|school)\b",
    "projects":   r"\b(projects?|personal\s+projects?|academic\s+projects?|portfolio)\b",
    "summary":    r"\b(summary|profile|objective|about\s+me|professional\s+summary|career\s+objective)\b",
}

# Action verbs that boost resume quality
ACTION_VERBS = {
    "led", "managed", "developed", "designed", "implemented", "built",
    "created", "launched", "improved", "optimized", "increased", "reduced",
    "achieved", "delivered", "collaborated", "coordinated", "analyzed",
    "architected", "automated", "deployed", "engineered", "established",
    "executed", "generated", "mentored", "migrated", "resolved", "streamlined",
}


from nltk.util import ngrams

# ... (ensure_nltk_data and STOP_WORDS remain same)

def clean_and_tokenize(text: str) -> list[str]:
    """Lowercase, remove punctuation, tokenize, remove stopwords."""
    text = text.lower()
    # Keep + and # for C++, C#
    text = re.sub(r"[^a-z0-9\s\+#]", " ", text)
    tokens = word_tokenize(text)
    tokens = [t for t in tokens if t not in STOP_WORDS and len(t) > 1]
    return tokens

def get_phrases(tokens: list[str]) -> list[str]:
    """Generate bigrams (phrases of 2 words)."""
    bigrams = ngrams(tokens, 2)
    return [" ".join(gram) for gram in bigrams]

def extract_keywords(text: str, top_n: int = 50) -> list[str]:
    """Extract top-N keywords (unigrams + bigrams) from text."""
    tokens = clean_and_tokenize(text)
    phrases = get_phrases(tokens)
    
    # Combine and count
    all_terms = tokens + phrases
    freq = FreqDist(all_terms)
    return [word for word, _ in freq.most_common(top_n)]

def detect_sections(text: str) -> dict:
    """Check which standard resume sections are present."""
    text_lower = text.lower()
    results = {}
    feedback_map = {
        "skills":     {
            True:  "Good skills section detected. Ensure you include both hard and soft skills.",
            False: "CRITICAL: No skills section found. Most ATS will reject resumes without a skills list.",
        },
        "experience": {
            True:  "Experience section detected. Use 'Situation, Task, Action, Result' (STAR) method.",
            False: "CRITICAL: No experience section found. Add your professional history chronologically.",
        },
        "education":  {
            True:  "Education section is present.",
            False: "No education section found. Include your degree, institution, and graduation year.",
        },
        "projects":   {
            True:  "Projects section found. Great for showcasing practical application.",
            False: "No projects section detected. Projects can compensate for less work experience.",
        },
        "summary":    {
            True:  "Professional summary detected.",
            False: "No summary found. A 2-3 sentence 'hook' at the top helps recruiters.",
        },
    }

    for section, pattern in SECTION_PATTERNS.items():
        present = bool(re.search(pattern, text_lower, re.IGNORECASE))
        results[section] = {
            "present": present,
            "feedback": feedback_map[section][present],
        }
    return results

def match_keywords(resume_text: str, jd_text: str) -> dict:
    """Compare resume keywords against job description keywords including phrases."""
    resume_tokens = clean_and_tokenize(resume_text)
    resume_phrases = get_phrases(resume_tokens)
    resume_set = set(resume_tokens + resume_phrases)

    jd_tokens = clean_and_tokenize(jd_text)
    jd_phrases = get_phrases(jd_tokens)
    jd_set = set(jd_tokens + jd_phrases)

    # Filter JD tokens to meaningful keywords (len > 2 or is a phrase)
    jd_keywords = {t for t in jd_set if len(t) > 2 or " " in t}
    matched = resume_set & jd_keywords
    missing = jd_keywords - resume_set

    return {
        "matched": sorted(list(matched), key=len, reverse=True)[:30],
        "missing": sorted(list(missing), key=len, reverse=True)[:30],
        "total_jd_keywords": len(jd_keywords),
        "matched_count": len(matched),
    }

# Expanded action verbs for better accuracy
ACTION_VERBS = {
    "led", "managed", "developed", "designed", "implemented", "built",
    "created", "launched", "improved", "optimized", "increased", "reduced",
    "achieved", "delivered", "collaborated", "coordinated", "analyzed",
    "architected", "automated", "deployed", "engineered", "established",
    "executed", "generated", "mentored", "migrated", "resolved", "streamlined",
    "pioneered", "orchestrated", "facilitated", "authored", "spearheaded",
    "transformed", "overhauled", "mentored", "negotiated", "accelerated"
}

def count_action_verbs(text: str) -> int:
    """Count how many action verbs appear in resume text."""
    tokens = set(word_tokenize(text.lower()))
    return len(tokens & ACTION_VERBS)

def check_formatting(text: str) -> dict:
    """Basic formatting/readability checks."""
    words = text.split()
    sentences = re.split(r"[.!?]+", text)
    avg_sentence_length = len(words) / max(len(sentences), 1)
    
    # Check for dates (e.g., 2021, Jan 2022, 05/2023)
    has_dates = bool(re.search(r"\b(19|20)\d{2}\b", text)) or bool(re.search(r"\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b", text, re.I))
    
    has_bullets = bool(re.search(r"[•\-\*●▪]", text))
    has_email = bool(re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text))
    has_phone = bool(re.search(r"(\+?\d[\d\s\-]{8,}\d)", text))
    has_linkedin = bool(re.search(r"linkedin\.com/in/[\w-]+", text, re.I))
    action_verb_count = count_action_verbs(text)

    return {
        "word_count": len(words),
        "avg_sentence_length": round(avg_sentence_length, 1),
        "has_bullets": has_bullets,
        "has_email": has_email,
        "has_phone": has_phone,
        "has_linkedin": has_linkedin,
        "has_dates": has_dates,
        "action_verb_count": action_verb_count,
    }

