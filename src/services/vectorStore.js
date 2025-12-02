// src/services/vectorStore.js
import { openDB } from 'idb';

const DB_NAME = 'GenAgentX_VectorStore';
const STORE_NAME = 'documents';
const DB_VERSION = 1;

/**
 * Initialize Vector Store Database
 */
const initVectorDB = async () => {
  return await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        store.createIndex('agentId', 'agentId', { unique: false });
        store.createIndex('filename', 'filename', { unique: false });
      }
    },
  });
};

/**
 * Generate embeddings using Gemini API
 */
export const generateEmbedding = async (text, apiKey) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/text-embedding-004',
        content: {
          parts: [{ text }]
        }
      })
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to generate embedding');
  }

  return data.embedding.values;
};

/**
 * Chunk text into smaller pieces
 */
const chunkText = (text, chunkSize = 500, overlap = 50) => {
  const chunks = [];
  const words = text.split(/\s+/);
  
  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    if (chunk.trim()) {
      chunks.push(chunk);
    }
  }
  
  return chunks;
};

/**
 * Calculate cosine similarity between two vectors
 */
const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

/**
 * Add document to vector store
 */
export const addDocument = async (agentId, filename, content, apiKey) => {
  const db = await initVectorDB();
  const chunks = chunkText(content);
  
  const documents = [];
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const embedding = await generateEmbedding(chunk, apiKey);
    
    documents.push({
      agentId,
      filename,
      content: chunk,
      embedding,
      chunkIndex: i,
      timestamp: new Date().toISOString()
    });
  }
  
  const tx = db.transaction(STORE_NAME, 'readwrite');
  for (const doc of documents) {
    await tx.store.add(doc);
  }
  await tx.done;
  
  return documents.length;
};

/**
 * Search similar documents
 */
export const searchSimilarDocuments = async (agentId, query, apiKey, topK = 5) => {
  const db = await initVectorDB();
  const queryEmbedding = await generateEmbedding(query, apiKey);
  
  const tx = db.transaction(STORE_NAME, 'readonly');
  const index = tx.store.index('agentId');
  const allDocs = await index.getAll(agentId);
  
  const similarities = allDocs.map(doc => ({
    ...doc,
    similarity: cosineSimilarity(queryEmbedding, doc.embedding)
  }));
  
  similarities.sort((a, b) => b.similarity - a.similarity);
  
  return similarities.slice(0, topK);
};

/**
 * Get all documents for an agent
 */
export const getAgentDocuments = async (agentId) => {
  const db = await initVectorDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const index = tx.store.index('agentId');
  const docs = await index.getAll(agentId);
  
  // Group by filename
  const grouped = {};
  docs.forEach(doc => {
    if (!grouped[doc.filename]) {
      grouped[doc.filename] = {
        filename: doc.filename,
        chunks: 0,
        timestamp: doc.timestamp
      };
    }
    grouped[doc.filename].chunks++;
  });
  
  return Object.values(grouped);
};

/**
 * Delete all documents for an agent
 */
export const deleteAgentDocuments = async (agentId) => {
  const db = await initVectorDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const index = tx.store.index('agentId');
  const docs = await index.getAll(agentId);
  
  for (const doc of docs) {
    await tx.store.delete(doc.id);
  }
  await tx.done;
};

/**
 * Delete specific document by filename
 */
export const deleteDocument = async (agentId, filename) => {
  const db = await initVectorDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const index = tx.store.index('agentId');
  const docs = await index.getAll(agentId);
  
  for (const doc of docs) {
    if (doc.filename === filename) {
      await tx.store.delete(doc.id);
    }
  }
  await tx.done;
};