#!/usr/bin/env python3
"""
Download all GiveWell board meeting files and organize them into folders.
"""

import os
import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, unquote
from pathlib import Path
import time

BASE_URL = "https://www.givewell.org"
BOARD_MEETINGS_BASE = f"{BASE_URL}/about/official-records/board-meeting-"
OUTPUT_DIR = Path("board-meetings")

def sanitize_filename(filename):
    """Remove or replace invalid filename characters."""
    # Replace spaces with underscores and remove problematic characters
    filename = filename.replace('%20', '_').replace(' ', '_')
    filename = re.sub(r'[^\w\-_.]', '_', filename)
    # Remove multiple underscores
    filename = re.sub(r'_+', '_', filename)
    return filename

def extract_date_from_text(soup):
    """Try to extract the meeting date from the page."""
    # Look for heading or title with date
    h1 = soup.find('h1')
    if h1:
        text = h1.get_text()
        # Try to parse date patterns
        date_match = re.search(r'(\w+)\s+(\d+),?\s+(\d{4})', text)
        if date_match:
            month, day, year = date_match.groups()
            # Convert month name to number
            months = {'January': '01', 'February': '02', 'March': '03', 'April': '04',
                     'May': '05', 'June': '06', 'July': '07', 'August': '08',
                     'September': '09', 'October': '10', 'November': '11', 'December': '12'}
            month_num = months.get(month, '00')
            return f"{year}-{month_num}-{day.zfill(2)}"
    return None

def download_file(url, filepath):
    """Download a file from URL to filepath."""
    try:
        print(f"  Downloading: {url}")
        response = requests.get(url, stream=True, timeout=30)
        response.raise_for_status()

        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"  ✓ Saved: {filepath.name}")
        return True
    except Exception as e:
        print(f"  ✗ Failed to download {url}: {e}")
        return False

def process_board_meeting(meeting_num):
    """Process a single board meeting page."""
    url = f"{BOARD_MEETINGS_BASE}{meeting_num}"
    print(f"\n[Meeting {meeting_num}] Fetching {url}")

    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
    except Exception as e:
        print(f"  ✗ Failed to fetch page: {e}")
        return False

    soup = BeautifulSoup(response.text, 'html.parser')

    # Extract meeting date
    date = extract_date_from_text(soup)
    if not date:
        date = "unknown-date"

    # Create meeting directory
    meeting_dir = OUTPUT_DIR / f"meeting-{str(meeting_num).zfill(2)}_{date}"
    meeting_dir.mkdir(parents=True, exist_ok=True)
    print(f"  Created directory: {meeting_dir}")

    # Find all links
    downloadable_files = []
    google_docs_links = []

    for link in soup.find_all('a', href=True):
        href = link['href']
        full_url = urljoin(BASE_URL, href)

        # Check if it's a downloadable file
        if any(ext in full_url.lower() for ext in ['.pdf', '.doc', '.docx', '.mp3', '.xlsx', '.xls']):
            downloadable_files.append((full_url, link.get_text(strip=True)))
        # Check if it's a Google Docs link
        elif 'docs.google.com' in full_url:
            google_docs_links.append((full_url, link.get_text(strip=True)))

    # Download files
    download_count = 0
    for file_url, link_text in downloadable_files:
        # Try to get a good filename
        filename = unquote(file_url.split('/')[-1])

        # If filename is not descriptive, use link text
        if not filename or filename == 'edit' or len(filename) < 3:
            filename = sanitize_filename(link_text) + '.unknown'
        else:
            filename = sanitize_filename(filename)

        filepath = meeting_dir / filename

        # Skip if already downloaded
        if filepath.exists():
            print(f"  ⊙ Already exists: {filename}")
            download_count += 1
            continue

        if download_file(file_url, filepath):
            download_count += 1

        # Be nice to the server
        time.sleep(0.5)

    # Save Google Docs links to a text file
    if google_docs_links:
        links_file = meeting_dir / "google_docs_links.txt"
        with open(links_file, 'w') as f:
            f.write(f"Google Docs links for Meeting {meeting_num} ({date})\n")
            f.write("=" * 60 + "\n\n")
            for url, text in google_docs_links:
                f.write(f"{text}\n{url}\n\n")
        print(f"  ✓ Saved {len(google_docs_links)} Google Docs links to google_docs_links.txt")

    print(f"  Summary: {download_count} files downloaded, {len(google_docs_links)} Google Docs links saved")
    return True

def main():
    """Main function to download all board meetings."""
    print("GiveWell Board Meetings Downloader")
    print("=" * 60)

    # Create output directory
    OUTPUT_DIR.mkdir(exist_ok=True)

    # Process all 60 meetings
    success_count = 0
    for i in range(1, 61):
        if process_board_meeting(i):
            success_count += 1
        time.sleep(1)  # Be respectful to the server

    print("\n" + "=" * 60)
    print(f"Complete! Successfully processed {success_count}/60 meetings")
    print(f"Files saved to: {OUTPUT_DIR.absolute()}")

if __name__ == "__main__":
    main()
