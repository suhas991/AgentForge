// src/constants/providers.js
// Dynamic Provider Registry for extensible LLM provider support

import { GEMINI_MODELS, GROQ_MODELS, getModelProvider } from './models';

export const PROVIDERS = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Google\'s latest generative AI models with multimodal capabilities',
    apiKeyLabel: 'Gemini API Key',
    apiKeyPlaceholder: 'AIza...',
    apiKeyPattern: /^AIza[0-9A-Za-z-_]{35}$/, // Gemini API keys start with AIza
    getKeyUrl: 'https://makersuite.google.com/app/apikey',
    icon: '🔷',
    color: '#4285f4', // Google blue
    enabled: true, // Default enabled
    models: GEMINI_MODELS
  },
  {
    id: 'groq',
    name: 'Groq',
    description: 'Ultra-fast inference with open-source models on LPU™ hardware',
    apiKeyLabel: 'Groq API Key',
    apiKeyPlaceholder: 'gsk_...',
    apiKeyPattern: /^gsk_[0-9A-Za-z]{52}$/, // Groq API keys start with gsk_
    getKeyUrl: 'https://console.groq.com/keys',
    icon: '⚡',
    color: '#f55036', // Groq orange
    enabled: true, // Default enabled
    models: GROQ_MODELS
  }
];

// Get provider by ID
export const getProvider = (providerId) => {
  return PROVIDERS.find(p => p.id === providerId);
};

// Get provider for a model
export const getProviderForModel = (modelId) => {
  const providerId = getModelProvider(modelId);
  if (providerId) {
    return getProvider(providerId);
  }

  for (const provider of PROVIDERS) {
    if (provider.models.some(m => m.id === modelId)) {
      return provider;
    }
  }
  return null;
};

// Validate API key format
export const validateApiKey = (providerId, apiKey) => {
  const provider = getProvider(providerId);
  if (!provider) return false;
  
  if (!apiKey || typeof apiKey !== 'string') return false;
  
  // Basic length check
  if (apiKey.length < 20) return false;
  
  // Pattern validation if available
  if (provider.apiKeyPattern) {
    return provider.apiKeyPattern.test(apiKey);
  }
  
  return true;
};

// Get configured providers (those with API keys)
export const getConfiguredProviders = (userConfig) => {
  if (!userConfig) return [];
  
  return PROVIDERS.filter(provider => {
    const apiKey = userConfig[`${provider.id}ApiKey`] || 
                   (provider.id === 'gemini' && userConfig.apiKey); // Backward compat
    return apiKey && apiKey.trim().length > 0;
  });
};

// Check if a model can be used (has API key configured)
export const canUseModel = (modelId, userConfig) => {
  const provider = getProviderForModel(modelId);
  if (!provider) return false;
  
  const apiKey = userConfig?.[`${provider.id}ApiKey`] || 
                 (provider.id === 'gemini' && userConfig?.apiKey);
  
  return apiKey && apiKey.trim().length > 0;
};

// Get missing provider message
export const getMissingProviderMessage = (providerId) => {
  const provider = getProvider(providerId);
  if (!provider) return 'Unknown provider';
  
  return `${provider.name} API key not configured. Please add your API key in Settings to use ${provider.name} models.`;
};
