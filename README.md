<div align="center">
<img width="1200" height="475" alt="GHBanner" src="assets/match%20the%20dots.jpeg" />
</div>

# Match the Dots

Match the Dots is a physics-based drawing puzzle game where players guide a blue ball and a red ball into collision by sketching lines and shapes. It blends logic, physics, and creative drawing mechanics with increasingly tricky, riddle-like stages that reward flexible thinking.

## Core Gameplay

- Draw freely with different pens to create ramps, bridges, and barriers.
- The simulation makes balls roll, bounce, and react to your shapes in real time.
- A level is cleared only when the blue and red balls collide, encouraging trial-and-error experimentation.

## Features

- Real-time physics powered by Matter.js.
- Multiple pens with different widths/colors that unlock as you progress.
- Hints per level, reset controls, and optional sound effects with mute.
- Level selector with progress saved in localStorage.

## Tech Stack

- React 19 + TypeScript
- Vite
- Matter.js (loaded via CDN in `index.html`)
- Tailwind CSS (CDN)

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Open the local URL printed by Vite in your browser.

## Build and Preview

- Production build: `npm run build`
- Preview the build: `npm run preview`
- Serve the `dist` folder: `npm run start` (uses `PORT` if set)

## Project Structure

- `App.tsx` handles auth stub, level progression, and routing between views.
- `components/GameView.tsx` implements drawing, physics, and win logic.
- `components/AuthView.tsx` provides a mock sign-in screen (no real auth).
- `components/LevelSelector.tsx` renders the level grid and unlock state.
- `constants.ts` defines levels, pens, and game dimensions.

## Notes

- Progress and mute state are persisted in localStorage (`match_the_dots_save`, `match_the_dots_muted`).
