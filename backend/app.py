"""
app.py
Main Flask server for Smart Resume Analyzer.
Exposes:
  POST /api/analyze        – analyze a resume PDF
  POST /api/export-report  – download a PDF report
"""

import json
import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import io

from services.pdf_parser import extract_text_from_pdf
from services.scorer import calculate_ats_score
from services.report_generator import generate_pdf_report

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

ALLOWED_EXTENSIONS = {"pdf"}
MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10 MB
app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_LENGTH


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "Smart Resume Analyzer API is running"}), 200


@app.route("/api/analyze", methods=["POST"])
def analyze_resume():
    """
    Accepts multipart/form-data:
      - resume: PDF file (required)
      - jobDescription: string (optional)
    Returns: JSON analysis result
    """
    if "resume" not in request.files:
        return jsonify({"error": "No resume file provided."}), 400

    file = request.files["resume"]
    if file.filename == "":
        return jsonify({"error": "No file selected."}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Only PDF files are supported."}), 400

    job_description = request.form.get("jobDescription", "").strip()

    try:
        pdf_bytes = file.read()
        resume_text = extract_text_from_pdf(pdf_bytes)
    except ValueError as e:
        return jsonify({"error": str(e)}), 422
    except Exception as e:
        return jsonify({"error": f"Unexpected error parsing PDF: {str(e)}"}), 500

    try:
        result = calculate_ats_score(resume_text, job_description)
        result["resume_preview"] = resume_text[:500] + ("..." if len(resume_text) > 500 else "")
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500


@app.route("/api/export-report", methods=["POST"])
def export_report():
    """
    Accepts JSON body with the analysis result (from /api/analyze).
    Returns a downloadable PDF report.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "No analysis data provided."}), 400

    try:
        pdf_bytes = generate_pdf_report(data)
        return send_file(
            io.BytesIO(pdf_bytes),
            mimetype="application/pdf",
            as_attachment=True,
            download_name="ats_report.pdf",
        )
    except Exception as e:
        return jsonify({"error": f"Report generation failed: {str(e)}"}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"[OK] Smart Resume Analyzer API running on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
