// src/constants/models.js

export const GEMINI_MODELS = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    description: 'Fast and efficient',
    category: 'flash'
  },
  {
    id: 'gemini-2.5-flash-lite',
    name: 'Gemini 2.5 Flash Lite',
    description: 'Lightweight and fast',
    category: 'lite'
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    description: 'Most capable model',
    category: 'pro'
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    description: 'High throughput',
    category: 'flash'
  },
  {
    id: 'gemini-2.0-flash-lite',
    name: 'Gemini 2.0 Flash Lite',
    description: 'Ultra lightweight',
    category: 'lite'
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    description: 'Balanced performance',
    category: 'flash'
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    description: 'Advanced capabilities',
    category: 'pro'
  },
  {
    id: 'gemini-1.0-pro',
    name: 'Gemini 1.0 Pro',
    description: 'Stable and reliable',
    category: 'pro'
  }
];

// Default model
export const DEFAULT_MODEL = 'gemini-2.5-flash';

// Get model display name
export const getModelName = (modelId) => {
  const model = GEMINI_MODELS.find(m => m.id === modelId);
  return model ? model.name : modelId;
};

// Get model description
export const getModelDescription = (modelId) => {
  const model = GEMINI_MODELS.find(m => m.id === modelId);
  return model ? model.description : '';
};

// Get model category for badge styling
export const getModelCategory = (modelId) => {
  const model = GEMINI_MODELS.find(m => m.id === modelId);
  return model ? model.category : 'flash';
};
