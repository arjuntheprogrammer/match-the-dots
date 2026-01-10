import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envLocalPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else {
  dotenv.config();
}

const app = express();
const port = Number(process.env.PORT) || 8080;
const distPath = path.join(__dirname, 'dist');

const firebaseApp = admin.apps.length > 0
  ? admin.app()
  : admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID
    });

const firestoreDatabaseId = process.env.FIRESTORE_DATABASE_ID;
const db = firestoreDatabaseId ? getFirestore(firebaseApp, firestoreDatabaseId) : getFirestore(firebaseApp);
const PROGRESS_COLLECTION = 'match_the_dots';
const DEFAULT_PROGRESS = {
  unlockedLevels: 1,
  unlockedPens: ['pencil-black']
};

const cookieName = process.env.SESSION_COOKIE_NAME || '__session';
const cookieDomain = process.env.SESSION_COOKIE_DOMAIN;
const cookieSecure = process.env.SESSION_COOKIE_SECURE !== 'false';
const redirectUrl = process.env.AUTH_REDIRECT_URL || 'https://arjuntheprogrammer.com/';

const baseCookieOptions = {
  httpOnly: true,
  secure: cookieSecure,
  sameSite: 'lax',
  path: '/'
};

const cookieOptions = cookieDomain
  ? { ...baseCookieOptions, domain: cookieDomain }
  : baseCookieOptions;

app.use(express.json());
app.use(cookieParser());

app.get('/healthz', (_req, res) => {
  res.status(200).send('ok');
});

app.use(async (req, res, next) => {
  if (req.path === '/healthz') {
    return next();
  }

  const sessionCookie = req.cookies[cookieName];
  if (!sessionCookie) {
    return res.redirect(302, redirectUrl);
  }

  try {
    const decoded = await admin.auth().verifySessionCookie(sessionCookie, false);
    res.locals.user = decoded;
    return next();
  } catch (error) {
    console.error('Invalid session cookie', error);
    res.clearCookie(cookieName, cookieOptions);
    return res.redirect(302, redirectUrl);
  }
});

app.get('/api/me', async (_req, res) => {
  try {
    const decoded = res.locals.user;
    if (!decoded?.uid) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userRecord = await admin.auth().getUser(decoded.uid);
    return res.json({
      user: {
        uid: userRecord.uid,
        displayName: userRecord.displayName ?? null,
        email: userRecord.email ?? null,
        photoURL: userRecord.photoURL ?? null
      }
    });
  } catch (error) {
    console.error('Failed to load user profile', error);
    return res.status(500).json({ error: 'Failed to load user profile' });
  }
});

app.get('/api/progress', async (_req, res) => {
  try {
    const decoded = res.locals.user;
    if (!decoded?.uid) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const docRef = db.collection(PROGRESS_COLLECTION).doc(decoded.uid);
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      await docRef.set({ ...DEFAULT_PROGRESS, createdAt: admin.firestore.FieldValue.serverTimestamp(), updatedAt: admin.firestore.FieldValue.serverTimestamp() });
      return res.json({ progress: { ...DEFAULT_PROGRESS, unlockedPens: [...DEFAULT_PROGRESS.unlockedPens] } });
    }

    const data = snapshot.data() || {};
    const unlockedLevels = typeof data.unlockedLevels === 'number' && data.unlockedLevels > 0 ? data.unlockedLevels : DEFAULT_PROGRESS.unlockedLevels;
    const unlockedPens = Array.isArray(data.unlockedPens) && data.unlockedPens.length > 0 ? data.unlockedPens : [...DEFAULT_PROGRESS.unlockedPens];
    return res.json({ progress: { unlockedLevels, unlockedPens } });
  } catch (error) {
    console.error('Failed to load progress', error);
    return res.status(500).json({ error: 'Failed to load progress' });
  }
});

app.post('/api/progress', async (req, res) => {
  try {
    const decoded = res.locals.user;
    if (!decoded?.uid) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { unlockedLevels, unlockedPens } = req.body ?? {};
    if (typeof unlockedLevels !== 'number' || unlockedLevels < 1) {
      return res.status(400).json({ error: 'Invalid unlockedLevels' });
    }
    if (!Array.isArray(unlockedPens) || unlockedPens.length === 0 || !unlockedPens.every((pen) => typeof pen === 'string')) {
      return res.status(400).json({ error: 'Invalid unlockedPens' });
    }

    const docRef = db.collection(PROGRESS_COLLECTION).doc(decoded.uid);
    await docRef.set(
      {
        unlockedLevels,
        unlockedPens,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    );
    return res.json({ status: 'saved' });
  } catch (error) {
    console.error('Failed to save progress', error);
    return res.status(500).json({ error: 'Failed to save progress' });
  }
});

app.post('/api/sessionLogout', (_req, res) => {
  res.clearCookie(cookieName, cookieOptions);
  res.json({ status: 'signed_out' });
});

app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
