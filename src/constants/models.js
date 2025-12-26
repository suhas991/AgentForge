// src/constants/models.js

export const GEMINI_MODELS = [
  // Current Gemini catalog (Dec 2025)
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
    id: "gemini-3-flash",
    name: "Gemini 3 Flash",
    description: "Latest text generation",
    category: "flash",
  },
  {
    id: "gemini-2.5-flash-tts",
    name: "Gemini 2.5 Flash TTS",
    description: "Text-to-speech generation",
    category: "tts",
  },
  {
    id: "gemini-2.5-flash-native-audio-dialog",
    name: "Gemini 2.5 Flash Native Audio Dialog",
    description: "Live audio dialog",
    category: "live",
  },
  {
    id: "gemini-robotics-er-1.5-preview",
    name: "Gemini Robotics ER 1.5 Preview",
    description: "Embodied robotics preview",
    category: "other",
  },
];

// Default model - using the latest and fastest
export const DEFAULT_MODEL = "gemini-2.5-flash";

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
