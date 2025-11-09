#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('../episodes.json', 'utf8'));

console.log('Episode Topics:\n');

data.episodes.forEach(ep => {
  const topics = ep.attachments
    .map(a => a.title)
    .filter(t => t !== 'Minutes' && t !== 'Agenda' && t !== 'Document')
    .join(', ');

  console.log(`${ep.meetingNumber}. ${ep.id}`);
  console.log(`   Date: ${ep.date}`);
  console.log(`   Topics: ${topics || 'None listed'}`);
  console.log('');
});
