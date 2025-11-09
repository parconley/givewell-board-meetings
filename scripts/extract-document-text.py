#!/usr/bin/env python3

"""
Extract text content from all PDFs and DOC/DOCX files in board meetings
and add them to episodes.json as inline content
"""

import os
import json
from pathlib import Path

try:
    from PyPDF2 import PdfReader
    has_pypdf = True
except ImportError:
    has_pypdf = False

try:
    from docx import Document
    has_docx = True
except ImportError:
    has_docx = False

def extract_pdf_text(pdf_path):
    """Extract text from a PDF file"""
    if not has_pypdf:
        return "[PDF text extraction requires PyPDF2. Install with: pip install PyPDF2]"

    try:
        reader = PdfReader(pdf_path)
        text_parts = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                text_parts.append(text)
        return '\n\n'.join(text_parts)
    except Exception as e:
        return f"[Error extracting PDF: {str(e)}]"

def extract_docx_text(docx_path):
    """Extract text from a DOCX file"""
    if not has_docx:
        return "[DOCX text extraction requires python-docx. Install with: pip install python-docx]"

    try:
        doc = Document(docx_path)
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
        return '\n\n'.join(paragraphs)
    except Exception as e:
        return f"[Error extracting DOCX: {str(e)}]"

def extract_doc_text(doc_path):
    """Extract text from a legacy DOC file"""
    # Legacy .doc files are much harder to parse
    # For now, return a placeholder
    return f"[Legacy .doc file - text extraction not yet implemented. Original file: {os.path.basename(doc_path)}]"

def main():
    # Load episodes.json
    episodes_path = Path(__file__).parent.parent / 'episodes.json'
    with open(episodes_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Process each episode
    board_meetings_dir = Path(__file__).parent.parent / 'board-meetings'

    for episode in data['episodes']:
        print(f"\nProcessing {episode['id']}...")

        # Find the corresponding folder
        meeting_folders = list(board_meetings_dir.glob(f"{episode['id']}*"))
        if not meeting_folders:
            print(f"  No folder found for {episode['id']}")
            continue

        folder = meeting_folders[0]

        # Process each attachment
        for attachment in episode['attachments']:
            filename = attachment['filename']
            file_path = folder / filename

            if not file_path.exists():
                print(f"  File not found: {filename}")
                attachment['text'] = f"[File not found: {filename}]"
                continue

            print(f"  Extracting: {filename}")

            # Extract text based on file type
            if filename.lower().endswith('.pdf'):
                text = extract_pdf_text(file_path)
            elif filename.lower().endswith('.docx'):
                text = extract_docx_text(file_path)
            elif filename.lower().endswith('.doc'):
                text = extract_doc_text(file_path)
            else:
                text = f"[Unsupported file type: {filename}]"

            # Add text to attachment
            attachment['text'] = text
            print(f"    Extracted {len(text)} characters")

    # Save updated episodes.json
    with open(episodes_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print("\n✓ Document text extraction complete!")
    print(f"Updated: {episodes_path}")

if __name__ == '__main__':
    main()
