"""
report_generator.py
Generates a downloadable PDF report using ReportLab.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import io


def generate_pdf_report(analysis: dict) -> bytes:
    """
    Generates a PDF report from the analysis result dict.
    Returns raw PDF bytes.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2 * cm,
        leftMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
    )

    styles = getSampleStyleSheet()
    story = []

    # ── Title ────────────────────────────────────────────────────────────────
    title_style = ParagraphStyle(
        "Title", parent=styles["Title"],
        fontSize=22, textColor=colors.black,
        spaceAfter=6, alignment=TA_CENTER,
    )
    story.append(Paragraph("Smart Resume Analyzer", title_style))
    story.append(Paragraph("ATS Analysis Report", styles["Normal"]))
    story.append(Spacer(1, 0.5 * cm))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.black))
    story.append(Spacer(1, 0.5 * cm))

    # ── ATS Score ────────────────────────────────────────────────────────────
    score = analysis.get("ats_score", 0)
    breakdown = analysis.get("score_breakdown", {})

    heading_style = ParagraphStyle(
        "Heading", parent=styles["Heading2"],
        fontSize=14, textColor=colors.black, spaceBefore=12,
    )
    story.append(Paragraph("ATS Score", heading_style))

    score_color = (
        colors.HexColor("#10b981") if score >= 70
        else colors.HexColor("#f59e0b") if score >= 50
        else colors.HexColor("#ef4444")
    )

    score_data = [
        ["Overall ATS Score", f"{score} / 100"],
        ["Keyword Match (max 50)", str(breakdown.get("keyword_match", 0))],
        ["Section Completeness (max 25)", str(breakdown.get("section_completeness", 0))],
        ["Formatting & Readability (max 25)", str(breakdown.get("formatting", 0))],
    ]
    t = Table(score_data, colWidths=[11 * cm, 5 * cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.black),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 13),
        ("ALIGN", (1, 0), (1, -1), "CENTER"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#f4f4f5"), colors.white]),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e4e4e7")),
        ("PADDING", (0, 0), (-1, -1), 8),
    ]))

    story.append(t)
    story.append(Spacer(1, 0.5 * cm))

    # ── Sections ─────────────────────────────────────────────────────────────
    story.append(Paragraph("Section Analysis", heading_style))
    sections = analysis.get("sections", {})
    section_data = [["Section", "Status", "Feedback"]]
    for name, info in sections.items():
        status = "✓ Present" if info["present"] else "✗ Missing"
        section_data.append([name.capitalize(), status, info["feedback"]])

    st = Table(section_data, colWidths=[3 * cm, 3 * cm, 10 * cm])
    st.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1e1b4b")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#f8f7ff"), colors.white]),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#d1d5db")),
        ("PADDING", (0, 0), (-1, -1), 6),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(st)
    story.append(Spacer(1, 0.5 * cm))

    # ── Keywords ─────────────────────────────────────────────────────────────
    matched = analysis.get("matched_keywords", [])
    missing = analysis.get("missing_keywords", [])

    if matched:
        story.append(Paragraph("Matched Keywords", heading_style))
        story.append(Paragraph(", ".join(matched), styles["Normal"]))
        story.append(Spacer(1, 0.3 * cm))

    if missing:
        story.append(Paragraph("Missing Keywords", heading_style))
        story.append(Paragraph(", ".join(missing), styles["Normal"]))
        story.append(Spacer(1, 0.3 * cm))

    # ── Suggestions ──────────────────────────────────────────────────────────
    story.append(Paragraph("Improvement Suggestions", heading_style))
    for tip in analysis.get("suggestions", []):
        story.append(Paragraph(f"• {tip}", styles["Normal"]))
        story.append(Spacer(1, 0.15 * cm))

    # ── Footer ───────────────────────────────────────────────────────────────
    story.append(Spacer(1, 1 * cm))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.grey))
    footer_style = ParagraphStyle("Footer", parent=styles["Normal"],
                                  fontSize=8, textColor=colors.grey, alignment=TA_CENTER)
    story.append(Paragraph("Generated by Smart Resume Analyzer", footer_style))

    doc.build(story)
    return buffer.getvalue()
