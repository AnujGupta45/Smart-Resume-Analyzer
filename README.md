# Smart Resume Analyzer

An AI-powered full-stack web app that analyzes your resume PDF and gives you:
- **ATS Score** (out of 100)
- **Keyword matching** vs job description
- **Section-wise feedback** (Skills, Experience, Education, Projects, Summary)
- **Actionable suggestions** to improve your resume
- **Downloadable PDF report**

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Vanilla CSS (dark glassmorphism) |
| Backend | Python Flask |
| PDF Parsing | PyPDF2 |
| NLP | NLTK (tokenization, stopwords, FreqDist) |
| Report | ReportLab |

---

## Project Structure

```
Smart Resume Analyzer/
├── backend/
│   ├── app.py                    # Flask server
│   ├── requirements.txt
│   └── services/
│       ├── pdf_parser.py         # PDF text extraction
│       ├── nlp_engine.py         # NLP: tokenize, keywords, sections
│       ├── scorer.py             # ATS scoring logic
│       └── report_generator.py  # PDF report via ReportLab
│
└── frontend/
    ├── index.html
    ├── package.json
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css             # Global design system
        ├── components/
        │   ├── Navbar.jsx/css
        │   ├── UploadZone.jsx/css
        │   ├── AtsScore.jsx/css
        │   ├── KeywordCloud.jsx/css
        │   ├── SectionFeedback.jsx/css
        │   ├── Suggestions.jsx/css
        │   └── LoadingScreen.jsx/css
        └── pages/
            ├── Home.jsx/css
            └── Results.jsx/css
```

---

## Run Locally

### 1. Start the Backend

```powershell
cd backend
python app.py
```
Backend runs on: **http://localhost:5000**

### 2. Start the Frontend

```powershell
cd frontend
npm run dev
```
Frontend runs on: **http://localhost:5173**

---

## API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/analyze` | Analyze resume PDF |
| POST | `/api/export-report` | Download PDF report |

### POST `/api/analyze`
**Form data:**
- `resume` – PDF file (required)
- `jobDescription` – string (optional)

**Response:**
```json
{
  "ats_score": 72,
  "score_breakdown": { "keyword_match": 28, "section_completeness": 24, "formatting": 20 },
  "matched_keywords": ["Python", "REST API", "SQL"],
  "missing_keywords": ["Docker", "Kubernetes"],
  "sections": { "skills": { "present": true, "feedback": "..." }, ... },
  "suggestions": ["Add more action verbs...", ...]
}
```

---

## Scoring Logic

| Component | Weight | How |
|-----------|--------|-----|
| Keyword Match | 40% | `(matched_keywords / total_jd_keywords) × 40` |
| Section Completeness | 30% | `(present_sections / 5) × 30` |
| Formatting | 30% | Checks: word count, bullet points, email, phone, action verbs |
