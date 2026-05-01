# 🚀 Smart Resume Analyzer

**Smart Resume Analyzer** is a high-performance, AI-powered SaaS dashboard designed to help job seekers optimize their resumes for modern Applicant Tracking Systems (ATS). Using advanced Natural Language Processing (NLP), the app provides real-time scoring, keyword gap analysis, and actionable feedback.

**Live Demo:** [smart-resume-analyzer-black.vercel.app](https://smart-resume-analyzer-black.vercel.app)

---

## ✨ Key Features

- **🎯 Intelligent ATS Scoring:** Proprietary scoring algorithm (50/25/25 weight) analyzing keyword density, section completeness, and formatting.
- **🔍 Bigram Phrase Matching:** Detects complex industry terms like "Full Stack Developer" or "Project Management" instead of just single words.
- **📜 Analysis History:** Automatically persists your past scans in the browser so you can track your resume's improvement over time.
- **📄 Professional PDF Reports:** Generate and download a sleek, black-and-white professional report of your analysis.
- **🌑 Modern SaaS UI:** A high-contrast, minimalist dashboard built with a premium Zinc/Slate aesthetic.
- **👤 Developer Profile:** Integrated "About Me" section featuring the project creator's portfolio and contact info.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** Modern Vanilla CSS (SaaS Design System)
- **Routing:** React Router v6
- **Icons/UI:** Custom SVG components & Inter Typography

### Backend
- **Engine:** Python Flask
- **NLP Library:** NLTK (Natural Language Toolkit)
- **PDF Engine:** PyPDF2
- **Report Generation:** ReportLab (PDF processing)
- **Deployment:** Render (API) & Vercel (Frontend)

---

## 📂 Project Structure

```
Smart Resume Analyzer/
├── backend/
│   ├── app.py                    # Flask server entry
│   ├── requirements.txt          # Python dependencies
│   └── services/
│       ├── pdf_parser.py         # PDF text extraction logic
│       ├── nlp_engine.py         # NLP: Tokenization, Bigrams, Section Detection
│       ├── scorer.py             # ATS Scoring & Weights
│       └── report_generator.py   # PDF PDF Generation
│
└── frontend/
    ├── vercel.json               # Vercel routing configuration
    └── src/
        ├── App.jsx               # Main Routing
        ├── api.js                # Centralized API configuration
        ├── components/           # Sidebar, AtsScore, KeywordCloud, etc.
        └── pages/                # Home, Results, History, About
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.9+
- Node.js 16+

### 2. Backend Setup
```bash
cd backend
python -m venv venv
./venv/Scripts/activate  # Windows
pip install -r requirements.txt
python app.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open **http://localhost:5173** in your browser.

---

## 📊 Scoring Methodology

| Metric | Weight | Description |
| :--- | :--- | :--- |
| **Keyword Match** | 50% | Comparison of resume terms (Unigrams/Bigrams) against Job Descriptions. |
| **Sections** | 25% | Checks for Skills, Experience, Education, Projects, and Summary. |
| **Formatting** | 25% | Analysis of bullet points, contact info, date formats, and action verbs. |

---

## 👨‍💻 Developed By

**Amlor Anuj Kumar Gupta**  
*Full Stack Developer & AI Enthusiast*

- **LinkedIn:** [linkedin.com/in/anujgupta45](https://www.linkedin.com/in/anujgupta45/)
- **Email:** guptaanuj730@gmail.com

---

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.
