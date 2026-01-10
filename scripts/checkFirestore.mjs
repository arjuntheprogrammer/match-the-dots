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
if (!projectId) {
  throw new Error('FIREBASE_PROJECT_ID is not set.');
}

const firebaseApp = admin.apps.length > 0
  ? admin.app()
  : admin.initializeApp({ projectId });

const databaseId = process.env.FIRESTORE_DATABASE_ID;
const db = databaseId ? getFirestore(firebaseApp, databaseId) : getFirestore(firebaseApp);

const COLLECTION = 'match_the_dots';

(async () => {
  try {
    const snapshot = await db.collection(COLLECTION).limit(1).get();
    if (snapshot.empty) {
      console.log(`Connected to Firestore (${projectId}/${databaseId ?? '(default)'}). Collection "${COLLECTION}" exists but is empty.`);
    } else {
      const doc = snapshot.docs[0];
      console.log(`Connected to Firestore (${projectId}/${databaseId ?? '(default)'}). Found document "${doc.id}" in "${COLLECTION}".`);
    }
    process.exit(0);
  } catch (error) {
    console.error('Failed to reach Firestore. Check credentials and database ID.');
    console.error(error);
    process.exit(1);
  }
})();
