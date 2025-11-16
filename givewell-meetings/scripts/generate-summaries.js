#!/usr/bin/env node
/**
 * Generate comprehensive 1000-word summaries for each episode
 * Uses Claude API to generate summaries from meeting documents
 */

const fs = require('fs');
const path = require('path');

// Read episodes.json
const episodesPath = path.join(__dirname, '..', 'episodes.json');
const data = JSON.parse(fs.readFileSync(episodesPath, 'utf8'));

// Function to generate summary using Claude (you'll need to provide API key)
async function generateSummary(episode) {
  // Combine all attachment texts
  const allText = episode.attachments
    .map(att => `\n\n=== ${att.title} ===\n${att.text}`)
    .join('\n');

  const prompt = `You are analyzing a board meeting for GiveWell (originally called "The Clear Fund").

Meeting: ${episode.title}
Date: ${episode.dateDisplay}

Here are all the documents from this meeting:
${allText}

Please write a comprehensive 1000-word summary that:
1. Covers the key decisions made
2. Explains important discussions and debates
3. Summarizes financial/budget information
4. Notes any strategic direction or policy changes
5. Highlights personnel or organizational changes
6. Mentions any votes taken and their outcomes

Write this as a professional brief that someone could read to understand everything important that happened in this meeting. Focus on substance over process. Be specific with numbers, names, and decisions.

Write EXACTLY around 1000 words - not much shorter or longer.`;

  console.log(`\n=== Generating summary for Episode ${episode.meetingNumber}: ${episode.title} ===`);
  console.log(`Prompt length: ${prompt.length} characters`);
  console.log(`Source text length: ${allText.length} characters`);

  // TODO: Replace this with actual Claude API call
  // For now, return a placeholder that you'll need to replace
  return `[Summary for ${episode.title} - ${episode.dateDisplay}]\n\nThis is a placeholder. You need to:\n1. Add Claude API integration\n2. Or manually generate summaries\n3. Or use another AI service`;
}

async function main() {
  console.log(`Found ${data.episodes.length} episodes to process\n`);

  // Process each episode
  for (let i = 0; i < data.episodes.length; i++) {
    const episode = data.episodes[i];

    if (episode.attachments.length === 0) {
      console.log(`Skipping episode ${episode.meetingNumber} - no attachments`);
      continue;
    }

    const summary = await generateSummary(episode);

    // Update the episode description
    episode.description = summary;

    console.log(`✓ Generated summary (${summary.length} characters)`);

    // Save progress after each episode
    fs.writeFileSync(episodesPath, JSON.stringify(data, null, 2));
    console.log(`✓ Saved to episodes.json`);
  }

  console.log('\n=== All summaries generated! ===');
}

// Check if this is being run directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { generateSummary };
