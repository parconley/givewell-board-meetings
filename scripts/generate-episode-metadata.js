#!/usr/bin/env node

/**
 * GiveWell Board Meetings - Episode Metadata Generator
 *
 * Scans the board-meetings/ directory and generates episodes.json
 * with complete metadata for all meetings that have audio files.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MEETINGS_DIR = path.join(__dirname, '..', 'board-meetings');
const OUTPUT_FILE = path.join(__dirname, '..', 'episodes.json');

/**
 * Extract duration from MP3 file using ffprobe
 */
function getAudioDuration(filePath) {
  try {
    const output = execSync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`,
      { encoding: 'utf8' }
    );
    return Math.floor(parseFloat(output.trim()));
  } catch (error) {
    console.error(`Failed to get duration for ${filePath}:`, error.message);
    return 0;
  }
}

/**
 * Format duration in seconds to human-readable string
 */
function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Format file size in bytes to human-readable string
 */
function formatFileSize(bytes) {
  if (bytes >= 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }
  return `${bytes} B`;
}

/**
 * Parse date from folder name or filename
 */
function parseDate(folderName, fileName) {
  // Try folder name first (format: meeting-XX_YYYY-MM-DD)
  const folderMatch = folderName.match(/_(\d{4}-\d{2}-\d{2})/);
  if (folderMatch) {
    return folderMatch[1];
  }

  // Try filename (format: YYYY_MM_DD or YYYY-MM-DD)
  const fileMatch = fileName.match(/(\d{4})[\s_-](\d{2})[\s_-](\d{2})/);
  if (fileMatch) {
    return `${fileMatch[1]}-${fileMatch[2]}-${fileMatch[3]}`;
  }

  return null;
}

/**
 * Format date for display (e.g., "June 22, 2007")
 */
function formatDateDisplay(dateStr) {
  if (!dateStr) return 'Unknown date';

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const [year, month, day] = dateStr.split('-');
  return `${months[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;
}

/**
 * Categorize attachment by filename
 */
function categorizeAttachment(filename) {
  const lower = filename.toLowerCase();

  if (lower.includes('agenda')) {
    return { type: 'agenda', label: 'Agenda' };
  }
  if (lower.includes('minutes')) {
    return { type: 'minutes', label: 'Minutes' };
  }

  // Extract attachment letter (A, B, C, etc.)
  const attachMatch = filename.match(/attachment[_\s]+([a-z])/i);
  if (attachMatch) {
    const letter = attachMatch[1].toUpperCase();

    // Try to extract title from filename
    const titleMatch = filename.match(/attachment[_\s]+[a-z][_\s]*-[_\s]*(.+)\.(pdf|docx?)/i);
    const title = titleMatch ? titleMatch[1].replace(/_/g, ' ') : `Attachment ${letter}`;

    return { type: 'attachment', label: `Attachment ${letter}`, title };
  }

  return { type: 'document', label: 'Document' };
}

/**
 * Process a single meeting folder
 */
function processMeeting(folderName, folderPath) {
  const files = fs.readdirSync(folderPath);

  // Find MP3 file(s)
  const mp3Files = files.filter(f => f.toLowerCase().endsWith('.mp3'));

  // Skip if no audio
  if (mp3Files.length === 0) {
    return null;
  }

  // Use the main meeting audio (skip intros)
  const mainAudio = mp3Files.find(f => !f.toLowerCase().includes('introduction')) || mp3Files[0];
  const audioPath = path.join(folderPath, mainAudio);

  // Extract meeting number
  const numberMatch = folderName.match(/meeting-(\d+)/);
  const meetingNumber = numberMatch ? parseInt(numberMatch[1]) : 0;

  // Parse date
  const date = parseDate(folderName, mainAudio);

  // Get audio info
  const stats = fs.statSync(audioPath);
  const duration = getAudioDuration(audioPath);

  // Find all documents
  const documents = files
    .filter(f => {
      const ext = path.extname(f).toLowerCase();
      return ['.pdf', '.doc', '.docx', '.xlsx', '.xls'].includes(ext);
    })
    .map(filename => {
      const category = categorizeAttachment(filename);
      return {
        filename,
        type: category.type,
        label: category.label,
        title: category.title || category.label,
      };
    })
    .sort((a, b) => {
      // Sort: agenda first, then minutes, then attachments by letter
      const order = { 'agenda': 0, 'minutes': 1, 'attachment': 2, 'document': 3 };
      return (order[a.type] || 99) - (order[b.type] || 99);
    });

  // Determine title
  let title = 'Clear Fund Board Meeting';
  if (mainAudio.includes('Board call')) {
    title = 'Clear Fund Board Call';
  } else if (mainAudio.includes('GiveWell')) {
    title = 'GiveWell Board Meeting';
  }

  return {
    id: folderName,
    meetingNumber,
    title,
    date: date || 'unknown',
    dateDisplay: formatDateDisplay(date),
    audioFilename: mainAudio,
    duration,
    durationDisplay: formatDuration(duration),
    fileSize: stats.size,
    fileSizeDisplay: formatFileSize(stats.size),
    description: '', // To be filled manually
    attachments: documents,
  };
}

/**
 * Main function
 */
function main() {
  console.log('GiveWell Board Meetings - Metadata Generator');
  console.log('='.repeat(50));
  console.log();

  // Read all meeting folders
  const folders = fs.readdirSync(MEETINGS_DIR)
    .filter(f => f.startsWith('meeting-'))
    .sort();

  console.log(`Found ${folders.length} meeting folders`);
  console.log();

  // Process each folder
  const episodes = [];
  let audioCount = 0;

  for (const folder of folders) {
    const folderPath = path.join(MEETINGS_DIR, folder);
    const episode = processMeeting(folder, folderPath);

    if (episode) {
      episodes.push(episode);
      audioCount++;
      console.log(`✓ ${folder} - ${episode.title} (${episode.dateDisplay}) - ${episode.durationDisplay}`);
    } else {
      console.log(`⊘ ${folder} - No audio file`);
    }
  }

  console.log();
  console.log(`Processed ${audioCount} episodes with audio`);

  // Generate output
  const output = {
    metadata: {
      generatedAt: new Date().toISOString(),
      totalEpisodes: episodes.length,
      source: 'https://www.givewell.org/about/official-records',
    },
    episodes,
  };

  // Write JSON file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log();
  console.log(`✓ Generated ${OUTPUT_FILE}`);
  console.log();
  console.log('Next steps:');
  console.log('1. Manually add descriptions to each episode in episodes.json');
  console.log('2. Review and verify all metadata is correct');
  console.log('3. Set up GitHub repository with audio files and documents');
}

main();
