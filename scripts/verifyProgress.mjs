import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const envLocalPath = path.join(repoRoot, '.env.local');
const envPath = fs.existsSync(envLocalPath) ? envLocalPath : path.join(repoRoot, '.env');
dotenv.config({ path: envPath });

const projectId = process.env.FIREBASE_PROJECT_ID;
const databaseId = process.env.FIRESTORE_DATABASE_ID;
const testDocId = process.env.FIRESTORE_TEST_DOC_ID || 'diagnostic';

if (!projectId) {
  throw new Error('FIREBASE_PROJECT_ID is not set.');
}

const firebaseApp = admin.apps.length > 0
  ? admin.app()
  : admin.initializeApp({ projectId });

const db = databaseId ? getFirestore(firebaseApp, databaseId) : getFirestore(firebaseApp);

const COLLECTION = 'match_the_dots';

const verifyProgress = async () => {
  const docRef = db.collection(COLLECTION).doc(testDocId);
  const payload = {
    unlockedLevels: 1,
    unlockedPens: ['pencil-black'],
    diagnostic: true,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await docRef.set(payload, { merge: true });
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    throw new Error('Progress write failed: document not found after write.');
  }

  const data = snapshot.data() || {};
  const levels = data.unlockedLevels;
  const pens = data.unlockedPens;

  if (levels !== payload.unlockedLevels || !Array.isArray(pens)) {
    throw new Error('Progress readback mismatch. Check Firestore writes.');
  }

  console.log(`Progress saved and read back from ${COLLECTION}/${testDocId} in ${projectId}/${databaseId ?? '(default)'}.`);
};

verifyProgress()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to verify progress write/read.');
    console.error(error);
    process.exit(1);
  });
