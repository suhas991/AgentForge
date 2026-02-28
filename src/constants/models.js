// src/constants/models.js

export const GEMINI_MODELS = [
  // Current Gemini catalog (Dec 2025)
  {
    id: "gemini-3-flash-preview",
    name: "Gemini 3 Flash Preview",
    description: "Latest Model",
    category: "flash",
    provider: "gemini",
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    description: "Fast and efficient",
    category: "flash",
    provider: "gemini",
  },
  {
    id: "gemini-2.5-flash-lite",
    name: "Gemini 2.5 Flash Lite",
    description: "Ultra lightweight and fast",
    category: "lite",
    provider: "gemini",
  },
  {
    id: "gemini-robotics-er-1.5-preview",
    name: "Gemini Robotics ER 1.5 Preview",
    description: "Embodied robotics preview",
    category: "other",
    provider: "gemini",
  }
];

export const GROQ_MODELS = [
  {
    id: "llama-3.3-70b-versatile",
    name: "Llama 3.3 70B",
    description: "Most capable, balanced performance",
    category: "pro",
    provider: "groq",
  },
  {
    id: "llama-3.1-8b-instant",
    name: "Llama 3.1 8B Instant",
    description: "Ultra-fast, lightweight responses",
    category: "flash",
    provider: "groq",
  },
  {
    id: "mixtral-8x7b-32768",
    name: "Mixtral 8x7B",
    description: "Powerful mixture-of-experts model",
    category: "pro",
    provider: "groq",
  },
  {
    id: "llama-3.2-90b-vision-preview",
    name: "Llama 3.2 90B Vision",
    description: "Vision-capable multimodal model",
    category: "vision",
    provider: "groq",
  },
];

// Combine all models
export const ALL_MODELS = [...GEMINI_MODELS, ...GROQ_MODELS];

const PROVIDER_META = {
  gemini: { name: 'Google Gemini', icon: '🔷' },
  groq: { name: 'Groq', icon: '⚡' }
};

const getUserConfig = () => {
  try {
    const raw = localStorage.getItem('userConfig');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const normalizeModel = (model, providerId) => {
  if (!model || !model.id) return null;

  return {
    id: model.id,
    name: model.name || model.id,
    description: model.description || 'Dynamically discovered model',
    category: model.category || 'other',
    provider: providerId || model.provider
  };
};

const getDynamicCatalog = () => {
  const config = getUserConfig();
  const catalog = config.providerModelCatalog || {};

  const normalized = {};
  Object.keys(catalog).forEach((providerId) => {
    const providerData = catalog[providerId] || {};
    const chatModels = Array.isArray(providerData.chatModels) ? providerData.chatModels : [];
    const embeddingModels = Array.isArray(providerData.embeddingModels) ? providerData.embeddingModels : [];

    normalized[providerId] = {
      chatModels: chatModels
        .map(model => normalizeModel(model, providerId))
        .filter(Boolean),
      embeddingModels: embeddingModels
        .map(model => normalizeModel(model, providerId))
        .filter(Boolean)
    };
  });

  return normalized;
};

const uniqueById = (models) => {
  const seen = new Map();
  models.forEach((model) => {
    if (model?.id) {
      seen.set(model.id, model);
    }
  });
  return Array.from(seen.values());
};

export const getAllModels = () => {
  const dynamicCatalog = getDynamicCatalog();
  const dynamicModels = Object.values(dynamicCatalog).flatMap(providerData => [
    ...(providerData.chatModels || []),
    ...(providerData.embeddingModels || [])
  ]);

  return uniqueById([...ALL_MODELS, ...dynamicModels]);
};

// Default model - using the latest and fastest
export const DEFAULT_MODEL = "gemini-2.5-flash-lite";

// Get model by ID
export const getModel = (modelId) => {
  return getAllModels().find((m) => m.id === modelId);
};

// Get model display name
export const getModelName = (modelId) => {
  const model = getModel(modelId);
  return model ? model.name : modelId;
};

// Get model description
export const getModelDescription = (modelId) => {
  const model = getModel(modelId);
  return model ? model.description : "";
};

// Get model category for badge styling
export const getModelCategory = (modelId) => {
  const model = getModel(modelId);
  return model ? model.category : "flash";
};

// Get model provider
export const getModelProvider = (modelId) => {
  const model = getModel(modelId);
  if (model?.provider) return model.provider;

  if (modelId?.startsWith('gemini-') || modelId?.startsWith('text-embedding-')) {
    return 'gemini';
  }

  if (
    modelId?.startsWith('llama-') ||
    modelId?.startsWith('mixtral-') ||
    modelId?.startsWith('qwen-') ||
    modelId?.startsWith('gemma-')
  ) {
    return 'groq';
  }

  return null;
};

// Get models by provider
export const getModelsByProvider = (providerId) => {
  return getAllModels().filter(m => m.provider === providerId);
};

export const getSelectedChatModelIdsByProvider = (userConfig = null) => {
  const config = userConfig || getUserConfig();
  return config.selectedChatModels || {};
};

export const getSelectedEmbeddingModelIdsByProvider = (userConfig = null) => {
  const config = userConfig || getUserConfig();
  return config.selectedEmbeddingModels || {};
};

export const getSelectedEmbeddingModel = (providerId = 'gemini', userConfig = null) => {
  const selected = getSelectedEmbeddingModelIdsByProvider(userConfig);
  const selectedForProvider = selected[providerId];
  if (Array.isArray(selectedForProvider) && selectedForProvider.length > 0) {
    return selectedForProvider[0];
  }

  return providerId === 'gemini' ? 'text-embedding-004' : null;
};

// Group models by provider (returns array format for UI)
export const getModelsGroupedByProvider = (userConfig = null, options = {}) => {
  const config = userConfig || getUserConfig();
  const selectedChatModels = getSelectedChatModelIdsByProvider(config);
  const enabledOnly = options.enabledOnly === true;

  return Object.entries(PROVIDER_META)
    .map(([providerId, meta]) => {
      const providerModels = getModelsByProvider(providerId);
      const selectedIds = selectedChatModels[providerId];

      const models = enabledOnly && Array.isArray(selectedIds) && selectedIds.length > 0
        ? providerModels.filter(model => selectedIds.includes(model.id))
        : providerModels;

      return {
        providerId,
        name: meta.name,
        icon: meta.icon,
        models
      };
    })
    .filter(group => group.models.length > 0);
};
