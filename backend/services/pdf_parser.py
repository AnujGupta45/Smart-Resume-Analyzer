"""
pdf_parser.py
Handles PDF text extraction using PyPDF2.
"""

import PyPDF2
import io


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Accepts raw PDF bytes and returns extracted plain text.
    """
    text = ""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    except Exception as e:
        raise ValueError(f"Failed to parse PDF: {str(e)}")

    if not text.strip():
        raise ValueError("PDF appears to be empty or image-based (no extractable text).")

    return text.strip()
