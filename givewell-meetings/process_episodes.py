#!/usr/bin/env python3
"""
Helper script to process episodes and update descriptions.
"""

import json
import sys

def load_episodes():
    """Load episodes from JSON file."""
    with open('episodes.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def save_episodes(data):
    """Save episodes back to JSON file."""
    with open('episodes.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def get_episode_text(episode_index):
    """Get all text content for a specific episode."""
    data = load_episodes()
    if episode_index < 0 or episode_index >= len(data['episodes']):
        print(f"Error: Episode index {episode_index} out of range (0-{len(data['episodes'])-1})")
        return None

    episode = data['episodes'][episode_index]

    # Combine all attachment texts
    texts = []
    for att in episode.get('attachments', []):
        if 'text' in att and att['text']:
            texts.append(f"=== {att.get('title', 'Document')} ===\n{att['text']}")

    combined = "\n\n".join(texts)

    print(f"Episode {episode_index}: {episode['title']} - {episode['dateDisplay']}")
    print(f"Attachments: {len(episode.get('attachments', []))}")
    print(f"Total text length: {len(combined)} characters")
    print("=" * 80)
    print(combined[:2000] + "..." if len(combined) > 2000 else combined)

    return combined

def update_description(episode_index, new_description):
    """Update the description for a specific episode."""
    data = load_episodes()
    if episode_index < 0 or episode_index >= len(data['episodes']):
        print(f"Error: Episode index {episode_index} out of range (0-{len(data['episodes'])-1})")
        return False

    old_desc = data['episodes'][episode_index]['description']
    data['episodes'][episode_index]['description'] = new_description

    save_episodes(data)

    print(f"✓ Updated episode {episode_index}")
    print(f"  Old: {len(old_desc)} chars")
    print(f"  New: {len(new_description)} chars")

    return True

def get_episode_info(episode_index):
    """Get basic info about an episode."""
    data = load_episodes()
    if episode_index < 0 or episode_index >= len(data['episodes']):
        print(f"Error: Episode index {episode_index} out of range (0-{len(data['episodes'])-1})")
        return None

    episode = data['episodes'][episode_index]
    return {
        'id': episode['id'],
        'title': episode['title'],
        'date': episode['dateDisplay'],
        'attachments': len(episode.get('attachments', [])),
        'current_description': episode['description']
    }

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python process_episodes.py info <index>       - Get episode info")
        print("  python process_episodes.py text <index>       - Get episode text")
        print("  python process_episodes.py update <index>     - Update from stdin")
        sys.exit(1)

    command = sys.argv[1]

    if command == 'info' and len(sys.argv) >= 3:
        info = get_episode_info(int(sys.argv[2]))
        if info:
            print(json.dumps(info, indent=2))

    elif command == 'text' and len(sys.argv) >= 3:
        get_episode_text(int(sys.argv[2]))

    elif command == 'update' and len(sys.argv) >= 3:
        new_desc = sys.stdin.read().strip()
        update_description(int(sys.argv[2]), new_desc)

    else:
        print("Invalid command or missing arguments")
        sys.exit(1)
