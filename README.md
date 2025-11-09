# GiveWell Board Meetings Archive

This repository contains all publicly available board meeting records from GiveWell (Clear Fund), downloaded from https://www.givewell.org/about/official-records

## Download Summary

- **Total Meetings**: 60 (June 2007 - August 2025)
- **Total Files Downloaded**: 320
- **Total Size**: 3.1 GB

### File Breakdown

- **PDF Documents**: 166 files (minutes, financial statements, reports)
- **Audio Recordings (MP3)**: 44 files (full meeting recordings)
- **Word Documents (.doc/.docx)**: 87 files (agendas, attachments, proposals)
- **Excel Spreadsheets**: Multiple files (budgets, financial data)
- **Google Docs Links**: 11 text files containing links to Google Docs/Sheets

## Folder Structure

Each meeting is organized in its own folder following this naming convention:
```
meeting-XX_YYYY-MM-DD/
```

For example:
- `meeting-01_unknown-date/` - First meeting (June 22, 2007)
- `meeting-30_2015-06-17/` - Meeting 30 (June 17, 2015)
- `meeting-60_2025-08-06/` - Most recent meeting (August 6, 2025)

## Contents of Each Meeting Folder

Depending on the meeting date, folders may contain:

### Downloadable Files
- **Minutes**: Official meeting minutes (PDF or Word)
- **Audio**: Full meeting recordings (MP3 format, typically 1-2 hours)
- **Agenda**: Meeting agenda (Word or PDF)
- **Attachments**: Lettered attachments (A, B, C, etc.) including:
  - Financial reports and budgets
  - Compensation reviews
  - Strategic plans
  - Policy documents
  - Annual reviews
  - Insurance reviews
  - Grant proposals

### Google Docs Links
Recent meetings (approximately 2016 onwards) include a `google_docs_links.txt` file containing URLs to Google Docs and Google Sheets documents. These documents typically require authentication to access and may include:
- Draft minutes
- Redacted agendas
- Executive summaries
- Financial spreadsheets
- Strategic planning documents
- Compensation analyses

## Historical Context

- **Organization Name**: The board meetings are for "Clear Fund" which is GiveWell's legal entity name
- **Early Meetings (2007-2015)**: Typically include full downloadable files (audio, documents)
- **Recent Meetings (2016-2025)**: Mix of downloadable PDFs and Google Docs links
- **Some meetings** have limited public documentation

## Example Meeting Contents

### Meeting 1 (June 22, 2007)
```
- Meeting minutes (Word)
- Full meeting audio (MP3)
- Board member introductions audio (MP3)
- Agenda (Word)
- Attachment A: Annual Statements
- Attachment B: Budget
- Attachment C: Review of Compensation
- Attachment D: Scope
```

### Meeting 60 (August 6, 2025)
```
- 2024 Audited Financial Statements (PDF)
- 2024 Audit Committee Report (PDF)
- google_docs_links.txt with 16+ Google Docs/Sheets links
```

## Usage Notes

1. **Audio Files**: MP3 recordings are typically 1-2 hours long and provide complete meeting discussions
2. **Google Docs**: Links in `google_docs_links.txt` files may require GiveWell board member access
3. **File Naming**: Files are named descriptively to indicate their content and date
4. **Date Extraction**: Some early meetings show "unknown-date" in the folder name because dates couldn't be automatically extracted from the page headers

## Download Script

This archive was created using `download_meetings.py`, which:
- Systematically fetches all 60 board meeting pages
- Downloads all publicly accessible files (PDF, DOC, MP3, XLSX)
- Saves Google Docs/Sheets links to text files
- Organizes everything into dated folders
- Implements respectful rate limiting when accessing the server

## Data Source

All files were downloaded from:
https://www.givewell.org/about/official-records

Last updated: November 8, 2025

## License and Usage

These documents are public records made available by GiveWell. Please refer to GiveWell's website for their terms of use and any applicable licenses for this material.
