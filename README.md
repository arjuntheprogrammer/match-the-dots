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
- Level selector with progress synced to Firebase via a shared session cookie (falls back to localStorage when offline).

## Tech Stack

- React 19 + TypeScript
- Vite
- Matter.js (loaded via CDN in `index.html`)
- Tailwind CSS (CDN)

## Run Locally

**Prerequisites:**

- Node.js
- Firebase project with Firestore + service account JSON (used by `firebase-admin`).
- Session cookie issued from [arjuntheprogrammer.com](https://arjuntheprogrammer.com/) (or `http://localhost:3000/` when running locally; the Express server redirects there if the cookie is missing).

1. Install dependencies: `npm install`
2. Copy `.env.template` to `.env` for shared/prod cookie defaults, and create `.env.local` (already checked in) for localhost overrides. Values in `.env.local` take priority, so it points `AUTH_REDIRECT_URL` to `http://localhost:3000/` and sets `SESSION_COOKIE_SECURE=false` for HTTP. Keep `SESSION_COOKIE_DOMAIN` empty locally so both apps issue and clear the same host-only cookie. If your Firestore database uses a custom ID (e.g., `match-the-dots`), set `FIRESTORE_DATABASE_ID` to that value.
3. Update `GOOGLE_APPLICATION_CREDENTIALS` inside `.env.local` if your key lives elsewhere. The provided path points to `secrets/…json` under this repo for convenience.
4. Start the API/server (required so `/api/*` endpoints work during dev): `npm run start` (keep it running in its own terminal; by default `.env.local` sets `PORT=8081` to avoid clashing with the auth app on 8080).
5. In another terminal start the Vite dev server (defaults to port 3002 so it never collides with the auth app on 3000): `npm run dev`
6. Visit the printed localhost URL (for example `http://localhost:3002/`). The SPA calls `/api/me` → `/api/progress` through Vite’s proxy so your session cookie and Firestore saves stay in sync.
7. To verify your environment can reach Firestore, run `npm run test:firestore`. It will attempt to read the `match_the_dots` collection using the configured credentials and database ID.
8. To verify a write + read round-trip, run `npm run test:firestore-progress`. It writes a diagnostic doc to `match_the_dots/diagnostic` (override with `FIRESTORE_TEST_DOC_ID`) and reads it back.

## Firebase + Cookie Sync Setup

1. Create (or reuse) the Firebase project named **match-the-dots**.
2. Enable **Firestore (Native mode)**. If you create a custom database ID (e.g., `match-the-dots`), reuse that value in `FIRESTORE_DATABASE_ID`. The Express API writes level progress to the `match_the_dots` collection using each authenticated UID as the document ID.
3. Provision a service account JSON for `firebase-admin` and reference it via `GOOGLE_APPLICATION_CREDENTIALS` (or set `FIREBASE_CONFIG` in the hosting environment).
4. Ensure your auth entrypoint (arjuntheprogrammer.com) issues a Firebase session cookie named per `SESSION_COOKIE_NAME` and scoped to `SESSION_COOKIE_DOMAIN`. Match-the-dots reuses that cookie and will redirect to `AUTH_REDIRECT_URL` if it becomes invalid.
5. Grant that service account the IAM roles it needs (minimum `roles/serviceusage.serviceUsageConsumer`, `roles/firebaseauth.admin`, plus Firestore write access). Example:

```bash
gcloud projects add-iam-policy-binding arjuntheprogrammer \
  --member="serviceAccount:firebase-adminsdk-fbsvc@arjuntheprogrammer.iam.gserviceaccount.com" \
  --role="roles/serviceusage.serviceUsageConsumer"

gcloud projects add-iam-policy-binding arjuntheprogrammer \
  --member="serviceAccount:firebase-adminsdk-fbsvc@arjuntheprogrammer.iam.gserviceaccount.com" \
  --role="roles/firebaseauth.admin"

gcloud projects add-iam-policy-binding arjuntheprogrammer \
  --member="serviceAccount:firebase-adminsdk-fbsvc@arjuntheprogrammer.iam.gserviceaccount.com" \
  --role="roles/datastore.user"
```

6. Deploy the built `dist/` folder behind the provided Express server so every request flows through the cookie guard + API endpoints.

## Build and Preview

- Production build: `npm run build`
- Preview the build: `npm run preview`
- Serve the `dist` folder: `npm run start` (uses `PORT` if set)

## Project Structure

- `App.tsx` handles level progression and routing between views.
- `components/GameView.tsx` implements drawing, physics, and win logic.
- `components/LevelSelector.tsx` renders the level grid and unlock state.
- `constants.ts` defines levels, pens, and game dimensions.

## Notes

- Progress and mute state continue to mirror to localStorage (`match_the_dots_save`, `match_the_dots_muted`) so you can keep playing offline.
