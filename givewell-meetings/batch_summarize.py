#!/usr/bin/env python3
"""
Batch process episodes - generates prompts for AI summarization.
Since I can't make API calls from the script, this will output the data
in a format that can be processed.
"""

import json

def main():
    # Load episodes
    with open('episodes.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Found {len(data['episodes'])} episodes to process\n")

    # For each episode, create the prompt
    summaries = {}

    for idx, episode in enumerate(data['episodes']):
        ep_id = episode['id']
        print(f"\n{'='*80}")
        print(f"EPISODE {idx}: {ep_id}")
        print(f"Title: {episode['title']}")
        print(f"Date: {episode['dateDisplay']}")
        print(f"{'='*80}\n")

        # Collect all attachment texts
        attachment_texts = []
        for att in episode.get('attachments', []):
            if 'text' in att and att['text']:
                attachment_texts.append(f"=== {att.get('title', 'Document')} ===\n{att['text']}\n")

        combined_text = "\n\n".join(attachment_texts)

        # Create the prompt
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
{combined_text}

Generate a comprehensive summary (approximately 1000 words):"""

        print(f"Combined text length: {len(combined_text)} characters")
        print(f"Prompt length: {len(prompt)} characters")

        # Save to a file for this episode
        with open(f'episode_{idx:02d}_prompt.txt', 'w', encoding='utf-8') as f:
            f.write(prompt)

        print(f"✓ Saved prompt to episode_{idx:02d}_prompt.txt")

    print(f"\n\nProcessing complete! Generated {len(data['episodes'])} prompt files.")
    print("Next step: Process each prompt file and save responses to episode_XX_summary.txt")

if __name__ == '__main__':
    main()
