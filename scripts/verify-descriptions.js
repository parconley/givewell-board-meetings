#!/usr/bin/env node

const fs = require('fs');

const data = JSON.parse(fs.readFileSync('../episodes.json', 'utf8'));

console.log('Sample of episodes with descriptions:\n');
[0, 10, 20, 30, 42].forEach(i => {
  if (data.episodes[i]) {
    const ep = data.episodes[i];
    console.log(`Meeting ${ep.meetingNumber} (${ep.dateDisplay}):`);
    console.log(`  ${ep.description}`);
    console.log('');
  }
});

// Check if any are missing
const missing = data.episodes.filter(ep => !ep.description || ep.description === '');
console.log(`Total episodes: ${data.episodes.length}`);
console.log(`Episodes with descriptions: ${data.episodes.length - missing.length}`);
console.log(`Missing descriptions: ${missing.length}`);

if (missing.length > 0) {
  console.log('\nMissing episodes:');
  missing.forEach(ep => console.log(`  - ${ep.id}`));
}
