# GiveWell Board Meetings - React Native App

A clean, minimal audio player app for listening to GiveWell board meetings on your phone. Styled with GiveWell's brand identity.

## Features

- ✅ Browse all 43 board meetings with audio (2007-2020)
- ✅ Clean, distraction-free player interface
- ✅ Play/pause, seek, skip forward/backward (30s)
- ✅ Variable playback speed (1x, 1.25x, 1.5x, 2x)
- ✅ Automatic progress tracking and resume
- ✅ Show notes with PDF attachments
- ✅ Background audio support
- ✅ GiveWell-inspired branding (blue primary, gold accents)

## Tech Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Navigation**: expo-router
- **Audio**: expo-av
- **Storage**: AsyncStorage

## Project Structure

```
givewell-meetings/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Episodes list screen
│   │   ├── player.tsx         # Now playing screen
│   │   └── _layout.tsx        # Tab navigation
│   └── _layout.tsx            # Root layout
├── components/
│   └── EpisodeCard.tsx        # Episode list item
├── services/
│   ├── audioService.ts        # Audio playback management
│   ├── episodesService.ts     # Episodes data fetching
│   └── storageService.ts      # Progress persistence
├── hooks/
│   ├── useAudioPlayer.ts      # Audio player hook
│   └── useEpisodes.ts         # Episodes data hook
├── constants/
│   ├── Colors.ts              # GiveWell brand colors
│   └── Typography.ts          # Typography system
└── types/
    └── episode.ts             # TypeScript types
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Episode Data URL

Update the URL in `services/episodesService.ts`:

```typescript
const EPISODES_JSON_URL = 'https://YOUR_GITHUB_URL/episodes.json';
```

And update the audio/document URLs:

```typescript
getAudioUrl(episode: Episode): string {
  const baseUrl = 'https://raw.githubusercontent.com/YOUR_USERNAME/givewell-board-meetings-app/main/audio';
  return `${baseUrl}/${episode.id}_${episode.audioFilename}`;
}
```

### 3. Run the App

**On iOS Simulator:**
```bash
npm run ios
```

**On Android Emulator:**
```bash
npm run android
```

**Using Expo Go (easiest):**
```bash
npx expo start
```

Then scan the QR code with the Expo Go app on your phone.

## Next Steps

### Required Before App Works

1. **Set up GitHub Repository**
   - Create a public repo for hosting files
   - Upload audio files to `/audio/` directory
   - Upload PDFs to `/documents/meeting-XX/` directories
   - Upload `episodes.json` to `/data/` directory
   - Update URLs in `episodesService.ts`

2. **Add Episode Descriptions**
   - Edit `episodes.json`
   - Fill in the `description` field for each episode
   - Use agendas/minutes as reference
   - Keep descriptions 1-2 sentences, factual tone

3. **Test with Real Data**
   - Ensure all audio files are accessible
   - Test playback on physical device
   - Verify background audio works
   - Test PDF attachment links

### Optional Enhancements

- [ ] Download episodes for offline listening
- [ ] Search/filter episodes by year or topic
- [ ] Auto-play next episode
- [ ] Sleep timer
- [ ] In-app PDF viewer (instead of external browser)
- [ ] Share episode with timestamp
- [ ] Transcripts integration

## File Hosting Options

### Option 1: GitHub (Free, Current Plan)
- **Pros**: Free, simple, version controlled
- **Cons**: 1GB bandwidth/month limit, files are public
- **Setup**: See "GitHub Setup" section below

### Option 2: Cloudflare R2
- **Pros**: Very cheap ($0.015/GB/month), no bandwidth fees
- **Cons**: Requires account setup, monthly billing
- **Cost**: ~$0.05/month for 3GB

### Option 3: Supabase
- **Pros**: Includes database, auth, storage in one
- **Cons**: More expensive ($25/mo for 8GB)
- **Best for**: If you want to add user accounts later

## GitHub Setup (Recommended)

1. **Create Repository**
```bash
cd /home/parker/Projects/givewell-board-meetings
git init
git add episodes.json board-meetings/ scripts/
git commit -m "Add GiveWell board meetings data"
gh repo create givewell-board-meetings-app --public
git push -u origin main
```

2. **Structure**
```
repo/
├── data/
│   └── episodes.json
├── audio/
│   ├── meeting-01_unknown-date_Clear_Fund_Board_Meeting_2007_06_22.mp3
│   ├── meeting-03_unknown-date_Clear_Fund_Board_Meeting_2008_01_03.mp3
│   └── ...
└── documents/
    ├── meeting-01_unknown-date/
    │   ├── Meeting_2007_06_22_Agenda.doc
    │   ├── Meeting_2007_06_22_Minutes.doc
    │   └── ...
    └── ...
```

3. **Enable GitHub Pages** (for episodes.json)
   - Settings → Pages
   - Source: Deploy from main branch
   - Directory: / (root)
   - Access at: `https://YOUR_USERNAME.github.io/givewell-board-meetings-app/data/episodes.json`

## GiveWell Brand Guidelines

The app follows GiveWell's visual identity:

**Colors:**
- Primary Blue: `#1F88D6` - Main actions, highlights
- Gold Accent: `#FDB913` - Progress bars, seek handle
- Neutral Grays: Clean backgrounds and text

**Typography:**
- System fonts (SF Pro on iOS, Roboto on Android)
- Clear hierarchy: H1 (26pt), H2 (20pt), Body (15pt)
- Sentence case everywhere, no all caps
- Minimal, analytical tone

**Layout:**
- White background, lots of breathing room
- 20px screen padding, 16px section spacing
- 44px minimum touch targets
- Rounded corners (8-12px), subtle borders

## Development Commands

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Build for production (requires EAS)
npx eas build --platform ios
npx eas build --platform android

# Type check
npx tsc --noEmit

# Clear cache
npx expo start --clear
```

## Troubleshooting

**"No episodes found"**
- Check that episodes.json URL is correct
- Verify CORS is enabled on hosting
- Check network tab in Expo DevTools

**Audio won't play**
- Verify audio URLs are correct and accessible
- Check that files are properly uploaded
- Test URLs directly in browser

**Progress not saving**
- Ensure AsyncStorage is working
- Check console for storage errors
- Try clearing app data and restarting

## Credits

- **Data Source**: [GiveWell Official Records](https://www.givewell.org/about/official-records)
- **Design**: Inspired by GiveWell's brand guidelines
- **Framework**: Built with Expo and React Native

## License

This app is for personal use. Meeting content and recordings are provided by GiveWell.
