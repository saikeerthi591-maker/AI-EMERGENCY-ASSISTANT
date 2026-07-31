import { SafeShelter, EmergencyContact, DisasterAlert, FirstAidGuide, RescueRequest, IncidentReport, SOSLog } from "../types";
import { DEFAULT_SHELTERS, DEFAULT_CONTACTS, DEFAULT_ALERTS, DEFAULT_FIRST_AID, DEFAULT_INCIDENTS, DEFAULT_RESCUES } from "../data/initialData";

const DB_NAME = "AI_EMERGENCY_ASSISTANT_DB";
const DB_VERSION = 1;

export interface OfflineSyncItem {
  id: string;
  type: "SOS" | "INCIDENT" | "RESCUE";
  payload: any;
  createdAt: string;
}

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error("IndexedDB open error:", request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains("shelters")) {
        db.createObjectStore("shelters", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("contacts")) {
        db.createObjectStore("contacts", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("alerts")) {
        db.createObjectStore("alerts", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("firstAid")) {
        db.createObjectStore("firstAid", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("rescues")) {
        db.createObjectStore("rescues", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("incidents")) {
        db.createObjectStore("incidents", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("sosLogs")) {
        db.createObjectStore("sosLogs", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("offlineSyncQueue")) {
        db.createObjectStore("offlineSyncQueue", { keyPath: "id" });
      }
    };
  });

  return dbPromise;
}

// Seed initial default data into IndexedDB if empty
export async function initOfflineDB(): Promise<void> {
  try {
    const db = await getDB();

    // Seed shelters
    const shelters = await getAllFromStore<SafeShelter>("shelters");
    if (shelters.length < DEFAULT_SHELTERS.length) {
      for (const shelter of DEFAULT_SHELTERS) {
        await saveToStore("shelters", shelter);
      }
    }

    // Seed contacts
    const contacts = await getAllFromStore<EmergencyContact>("contacts");
    if (contacts.length === 0) {
      for (const contact of DEFAULT_CONTACTS) {
        await saveToStore("contacts", contact);
      }
    }

    // Seed alerts
    const alerts = await getAllFromStore<DisasterAlert>("alerts");
    if (alerts.length === 0) {
      for (const alert of DEFAULT_ALERTS) {
        await saveToStore("alerts", alert);
      }
    }

    // Seed first aid
    const firstAid = await getAllFromStore<FirstAidGuide>("firstAid");
    if (firstAid.length < DEFAULT_FIRST_AID.length) {
      for (const fa of DEFAULT_FIRST_AID) {
        await saveToStore("firstAid", fa);
      }
    }

    // Seed incidents
    const incidents = await getAllFromStore<IncidentReport>("incidents");
    if (incidents.length === 0) {
      for (const inc of DEFAULT_INCIDENTS) {
        await saveToStore("incidents", inc);
      }
    }

    // Seed rescues
    const rescues = await getAllFromStore<RescueRequest>("rescues");
    if (rescues.length === 0) {
      for (const res of DEFAULT_RESCUES) {
        await saveToStore("rescues", res);
      }
    }

    console.log("[IndexedDB] Offline Storage Initialized Successfully.");
  } catch (error) {
    console.error("Failed to initialize IndexedDB:", error);
  }
}

// Helper methods for IndexedDB
export async function getAllFromStore<T>(storeName: string): Promise<T[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result as T[]);
    req.onerror = () => reject(req.error);
  });
}

export async function saveToStore<T extends { id: string }>(storeName: string, item: T): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const req = store.put(item);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function deleteFromStore(storeName: string, id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// Offline Queue Management
export async function queueOfflineSync(item: OfflineSyncItem): Promise<void> {
  await saveToStore("offlineSyncQueue", item);
}

export async function getPendingSyncQueue(): Promise<OfflineSyncItem[]> {
  return getAllFromStore<OfflineSyncItem>("offlineSyncQueue");
}

export async function clearPendingSyncItem(id: string): Promise<void> {
  await deleteFromStore("offlineSyncQueue", id);
}

export async function clearAllStores(): Promise<void> {
  const db = await getDB();
  const storeNames = Array.from(db.objectStoreNames);
  for (const name of storeNames) {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(name, "readwrite");
      const store = tx.objectStore(name);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
  await initOfflineDB();
}
