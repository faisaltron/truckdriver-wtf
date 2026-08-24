# Truckdriver.wtf 🚛

An immersive, nostalgia-fueled single-page experience: sit in the cab of a
truck cruising a highway at sunset, hand-painted "Safar-e-Ishq" truck art on
the windshield header, and a YouTube-playlist-backed cassette deck floating
over the dashboard.

**Live demo:** [faisaltron.github.io/truckdriver-wtf](https://faisaltron.github.io/truckdriver-wtf/)
**Repo:** [github.com/faisaltron/truckdriver-wtf](https://github.com/faisaltron/truckdriver-wtf)

## Features

- **Cinematic background** — a looping highway video (with a static photo and
  a gradient as automatic fallbacks if the video can't load), Ken Burns pan
  on the fallback image, and mobile-safe autoplay (forced mute + a
  first-tap retry for browsers that block autoplay).
- **Truck art title** — a centered "Safar-e-Ishq" nameplate image sitting on
  the windshield header, sized and positioned to stay clear of the hanging
  ornament on both mobile and desktop.
- **Live top bar** — current time, a simulated "drivers online" counter with
  a pulsing indicator, and a link out to YouTube Music.
- **Glassmorphic audio player** — a floating, fully-rounded, translucent
  pill with a spinning circular album disc, play/pause/skip, volume,
  and a scrubbable progress bar.
- **Real YouTube playback** — wired to a YouTube Music playlist through the
  YouTube IFrame API (no visible player chrome), with live track title,
  artist, and thumbnail pulled straight from the API, and auto-skip on
  playback errors.
- **Autoplay on load** — playback starts as soon as the player is ready,
  falling back to the visitor's first click/tap if the browser blocks
  autoplay-with-sound.

## Tech stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [lucide-react](https://lucide.dev/) icons
- [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference)

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (defaults to `http://localhost:5173`).

### Build for production

```bash
npm run build
npm run preview
```

## Configuration

### Playlist

The player loads a YouTube Music playlist by ID. Change it in
[`src/config.js`](src/config.js):

```js
export const PLAYLIST_ID = 'PLOjP3gxhb5wk'
```

The ID is the `list=` query parameter from a YouTube/YouTube Music playlist
URL.

### Background media

Drop your own assets into `public/` using these exact filenames — the app
falls back gracefully (video → photo → gradient) if any are missing:

| File | Purpose |
| --- | --- |
| `public/truck-background.mp4` | Looping highway background video |
| `public/truck-background.jpg` | Poster frame / fallback photo |
| `public/title.png` | Windshield title artwork (transparent background) |

## Deployment

Every push to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the app and publishes `dist/` to GitHub Pages automatically —
no manual deploy step needed. The Vite `base` path in
[`vite.config.js`](vite.config.js) is set to `/truckdriver-wtf/` to match
the project Pages URL; update it if you fork this under a different repo
name.

## Project structure

```
src/
├── App.jsx                       # Composes all layers
├── config.js                     # Playlist ID
├── components/
│   ├── HighwayBackground.jsx     # Video/photo/gradient background layer
│   ├── TruckArtTitle.jsx         # Centered windshield title artwork
│   ├── TopBar.jsx                # Clock, online counter, YT Music link
│   └── AudioCard.jsx             # Glassmorphic floating player
└── hooks/
    ├── useYouTubePlayer.js       # YouTube IFrame API integration
    ├── useClock.js               # Live local time
    └── useDriverCounter.js       # Simulated "drivers online" counter
```

## Browser notes

Video autoplay policies vary by browser and platform — the app forces the
video element to be muted and retries playback on the visitor's first
interaction as a fallback. Test on a real device before assuming autoplay
is broken; some sandboxed/headless environments lack full codec support and
will behave differently from a real browser.
