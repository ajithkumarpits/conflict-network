// db.js
import { openDB } from 'idb';

const DB_NAME = 'locationDB';
const STORE_NAME = 'locations';

export async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function saveData(key, data) {
  const db = await getDB();
  await db.put(STORE_NAME, data, key);
}

export async function loadData(key) {
  const db = await getDB();
  return db.get(STORE_NAME, key);
}
