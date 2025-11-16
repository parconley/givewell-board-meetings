#!/usr/bin/env python3
"""
Extract each episode into individual JSON files for easier processing.
"""

import json
import os

def main():
    # Create output directory
    os.makedirs('episodes_extracted', exist_ok=True)

    # Load episodes
    with open('episodes.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Extracting {len(data['episodes'])} episodes...")

    for idx, episode in enumerate(data['episodes']):
        ep_id = episode.get('id', f'episode_{idx}')
        filename = f'episodes_extracted/{idx:02d}_{ep_id}.json'

        # Extract just this episode
        episode_data = {
            'index': idx,
            **episode
        }

        # Save to individual file
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(episode_data, f, indent=2, ensure_ascii=False)

        print(f"  {idx:2d}. {ep_id} -> {filename}")

    print(f"\n✓ Extracted {len(data['episodes'])} episodes to episodes_extracted/")

if __name__ == '__main__':
    main()
