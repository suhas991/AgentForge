const DB_NAME = "AgentBuilderDB";
const STORE_NAME = "agents";
const EXECUTIONS_STORE = "executions";
const DB_VERSION = 2; // Increment! (If you change schema, always bump this)

export const getDB = async () => await initDB();

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
        objectStore.createIndex("role", "role", { unique: false });
      }
      if (!db.objectStoreNames.contains(EXECUTIONS_STORE)) {
        const executionStore = db.createObjectStore(EXECUTIONS_STORE, {
          keyPath: "id",
        });
        executionStore.createIndex("agentId", "agentId", { unique: false });
        executionStore.createIndex("runAt", "runAt", { unique: false });
      }
    };
  });
};


// ---------- AGENT CRUD ----------

export const saveAgent = async (agent) => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add({ ...agent, createdAt: new Date() });

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const updateAgent = async (agent) => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({ ...agent, updatedAt: new Date() });

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllAgents = async () => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAgentById = async (id) => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const deleteAgent = async (id) => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};


// ---------- EXECUTION HISTORY ----------

// Save a run (call this after each successful or failed agent run)
export async function saveExecutionLog(log) {
  const db = await getDB();
  const transaction = db.transaction([EXECUTIONS_STORE], "readwrite");
  const store = transaction.objectStore(EXECUTIONS_STORE);
  const request = store.add({ id: crypto.randomUUID(), ...log });
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Fetch all executions
export async function getAllExecutionLogs() {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([EXECUTIONS_STORE], "readonly");
    const store = transaction.objectStore(EXECUTIONS_STORE);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
