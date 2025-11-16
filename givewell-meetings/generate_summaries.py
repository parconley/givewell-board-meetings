#!/usr/bin/env python3
"""
Generate comprehensive 1000-word summaries for all GiveWell board meeting episodes.
"""

import json
import anthropic
import os
from typing import Dict, Any

def generate_summary(episode: Dict[str, Any], client) -> str:
    """Generate a comprehensive ~1000-word summary for an episode."""

    # Combine all attachment texts
    attachment_texts = []
    for att in episode.get('attachments', []):
        if 'text' in att and att['text']:
            attachment_texts.append(f"=== {att.get('title', 'Document')} ===\n{att['text']}\n")

    combined_text = "\n\n".join(attachment_texts)

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

    message = client.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=2000,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return message.content[0].text

def main():
    # Load the episodes file
    episodes_file = '/home/parker/Projects/givewell-board-meetings/givewell-meetings/episodes.json'

    with open(episodes_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Initialize Anthropic client
    api_key = os.environ.get('ANTHROPIC_API_KEY')
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY environment variable not set")

    client = anthropic.Anthropic(api_key=api_key)

    total_episodes = len(data['episodes'])
    print(f"Processing {total_episodes} episodes...")

    # Process each episode
    for i, episode in enumerate(data['episodes'], 1):
        episode_id = episode.get('id', 'unknown')
        print(f"\n[{i}/{total_episodes}] Processing episode: {episode_id} - {episode.get('title', 'Unknown')}")

        try:
            # Generate summary
            summary = generate_summary(episode, client)

            # Update the description field
            episode['description'] = summary

            print(f"  ✓ Generated summary ({len(summary)} characters)")

        except Exception as e:
            print(f"  ✗ Error processing episode: {e}")
            continue

    # Save the updated JSON
    with open(episodes_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\n✓ Complete! Updated {episodes_file}")

if __name__ == '__main__':
    main()
