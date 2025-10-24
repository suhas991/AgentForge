// src/constants/models.js

export const GEMINI_MODELS = [

   {
    id: "gemini-2.0-flash-live",
    name: "Gemini 2.0 Flash Live",
    description: "Free",
    category: "live",
  },
  {
    id: "gemini-2.5-flash-live",
    name: "Gemini 2.5 Flash Live",
    description: "Free",
    category: "live",
  },
  // Latest 2.5 Models
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    description: "Fast and efficient",
    category: "flash",
  },
  {
    id: "gemini-2.5-flash-lite",
    name: "Gemini 2.5 Flash Lite",
    description: "Ultra lightweight and fast",
    category: "lite",
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    description: "Most capable model",
    category: "pro",
  },

  // 2.0 Models
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    description: "High throughput",
    category: "flash",
  },

  {
    id: "gemini-2.0-flash-exp",
    name: "Gemini 2.0 Flash Experimental",
    description: "Experimental features and testing",
    category: "exp",
  },
  {
    id: "gemini-2.0-flash-lite",
    name: "Gemini 2.0 Flash Lite",
    description: "Cost-efficient and fast",
    category: "lite",
  },
];

// Default model - using the latest and fastest
export const DEFAULT_MODEL = "gemini-2.5-flash-live";

// Get model display name
export const getModelName = (modelId) => {
  const model = GEMINI_MODELS.find((m) => m.id === modelId);
  return model ? model.name : modelId;
};

// Get model description
export const getModelDescription = (modelId) => {
  const model = GEMINI_MODELS.find((m) => m.id === modelId);
  return model ? model.description : "";
};

// Get model category for badge styling
export const getModelCategory = (modelId) => {
  const model = GEMINI_MODELS.find((m) => m.id === modelId);
  return model ? model.category : "flash";
};
