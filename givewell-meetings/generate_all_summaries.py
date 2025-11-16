#!/usr/bin/env python3
"""
Generate comprehensive summaries for all 43 GiveWell board meeting episodes.
This script processes each episode and creates ~1000-word professional summaries.
"""

import json
import os
import glob

# NOTE: This script creates summary prompts. The actual AI summarization
# needs to be done by calling an AI API or processing manually.

def load_main_episodes():
    """Load the main episodes.json file."""
    with open('episodes.json', 'r') as f:
        return json.load(f)

def save_main_episodes(data):
    """Save the updated episodes.json file."""
    with open('episodes.json', 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def load_episode(filepath):
    """Load an individual episode JSON file."""
    with open(filepath, 'r') as f:
        return json.load(f)

def create_summary_prompt(episode):
    """Create a prompt for AI summarization."""
    # Combine all attachment texts
    texts = []
    for att in episode.get('attachments', []):
        if 'text' in att and att['text']:
            title = att.get('title', 'Document')
            text = att['text']
            texts.append(f"=== {title} ===\n{text}")

    combined = "\n\n".join(texts)

    prompt = f"""Based on the following board meeting documents for a {episode['title']} held on {episode['dateDisplay']}, generate a comprehensive ~1000-word summary that acts as a professional brief.

The summary should cover:
- Key decisions made and votes taken
- Important discussions and debates
- Financial/budget information with specific numbers
- Strategic direction or policy changes
- Personnel or organizational changes
- Any significant outcomes or action items

Keep the tone professional and factual. Focus on substance over process. Be specific with numbers, names, and decisions.

Meeting Documents:
{combined}

Generate a comprehensive summary (approximately 1000 words):"""

    return prompt

def main():
    print("=" * 80)
    print("GiveWell Board Meeting Summary Generator")
    print("=" * 80)
    print()

    # Get all extracted episode files
    episode_files = sorted(glob.glob('episodes_extracted/*.json'))

    if not episode_files:
        print("Error: No episode files found in episodes_extracted/")
        print("Run extract_episodes.py first!")
        return

    print(f"Found {len(episode_files)} episodes to process")
    print()

    # Load main episodes data
    main_data = load_main_episodes()

    # Create directory for prompts and summaries
    os.makedirs('summaries', exist_ok=True)

    # Process each episode
    for ep_file in episode_files:
        episode = load_episode(ep_file)
        idx = episode['index']
        ep_id = episode['id']

        print(f"[{idx+1}/43] Processing: {ep_id}")
        print(f"    Title: {episode['title']}")
        print(f"    Date: {episode['dateDisplay']}")
        print(f"    Attachments: {len(episode.get('attachments', []))}")

        # Create prompt
        prompt = create_summary_prompt(episode)

        # Save prompt to file
        prompt_file = f"summaries/{idx:02d}_prompt.txt"
        with open(prompt_file, 'w') as f:
            f.write(prompt)

        print(f"    ✓ Saved prompt ({len(prompt)} chars) to {prompt_file}")

        # Check if summary already exists
        summary_file = f"summaries/{idx:02d}_summary.txt"
        if os.path.exists(summary_file):
            with open(summary_file, 'r') as f:
                summary = f.read()

            # Update the main episodes data
            main_data['episodes'][idx]['description'] = summary
            print(f"    ✓ Found existing summary ({len(summary)} chars)")
        else:
            print(f"    ⚠ Summary not yet generated - save to {summary_file}")

        print()

    # Save updated episodes.json
    save_main_episodes(main_data)
    print("=" * 80)
    print("✓ Processing complete!")
    print()
    print("Next steps:")
    print("1. Review prompts in summaries/*_prompt.txt")
    print("2. Generate summaries and save to summaries/*_summary.txt")
    print("3. Run this script again to update episodes.json")
    print("=" * 80)

if __name__ == '__main__':
    main()
