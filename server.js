import express from 'express';
import cookieParser from 'cookie-parser';
import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = Number(process.env.PORT) || 8080;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, 'dist');

if (admin.apps.length === 0) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID
  });
}

const cookieName = process.env.SESSION_COOKIE_NAME || '__session';
const cookieDomain = process.env.SESSION_COOKIE_DOMAIN;
const redirectUrl = process.env.AUTH_REDIRECT_URL || 'https://arjuntheprogrammer.com/';

const baseCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/'
};

const cookieOptions = cookieDomain
  ? { ...baseCookieOptions, domain: cookieDomain }
  : baseCookieOptions;

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
    await admin.auth().verifySessionCookie(sessionCookie, false);
    return next();
  } catch (error) {
    console.error('Invalid session cookie', error);
    res.clearCookie(cookieName, cookieOptions);
    return res.redirect(302, redirectUrl);
  }
});

app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
