import React, { useEffect, useState } from 'react';
import { PROVIDERS } from '../constants/providers';
import { FaSave, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import './ProvidersView.css';

const ProvidersView = () => {
  const getUserConfig = () => {
    const userConfigStr = localStorage.getItem('userConfig');
    if (!userConfigStr) return {};
    try {
      return JSON.parse(userConfigStr);
    } catch {
      return {};
    }
  };

  const [apiKeys, setApiKeys] = useState(() => {
    const config = getUserConfig();
    return {
      gemini: config.geminiApiKey || '',
      groq: config.groqApiKey || ''
    };
  });

  const [showKeys, setShowKeys] = useState({
    gemini: false,
    groq: false
  });

  const [saveStatus, setSaveStatus] = useState({});

  const [providerModels, setProviderModels] = useState(() => {
    const config = getUserConfig();
    return config.providerModelCatalog || {};
  });

  const [selectedChatModels, setSelectedChatModels] = useState(() => {
    const config = getUserConfig();
    return config.selectedChatModels || {};
  });

  const [selectedEmbeddingModels, setSelectedEmbeddingModels] = useState(() => {
    const config = getUserConfig();
    return config.selectedEmbeddingModels || {};
  });

  const [modelFetchStatus, setModelFetchStatus] = useState({});

  const chatProviders = PROVIDERS.filter(provider => provider.id === 'gemini' || provider.id === 'groq');
  const embeddingProviders = PROVIDERS.filter(provider => provider.id === 'gemini');

  const toModelDisplayName = (modelId) => {
    if (!modelId) return 'Unknown Model';
    return modelId
      .replace(/^models\//, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const mapGeminiModel = (rawModel) => ({
    id: (rawModel?.name || '').replace('models/', ''),
    name: rawModel?.displayName || toModelDisplayName((rawModel?.name || '').replace('models/', '')),
    description: rawModel?.description || 'Gemini model',
    provider: 'gemini'
  });

  const mapGroqModel = (rawModel) => ({
    id: rawModel?.id,
    name: rawModel?.id ? toModelDisplayName(rawModel.id) : 'Unknown Model',
    description: rawModel?.owned_by ? `Owned by ${rawModel.owned_by}` : 'Groq model',
    provider: 'groq'
  });

  const fetchGeminiModels = async (apiKey) => {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || 'Failed to fetch Gemini models');
    }

    const models = Array.isArray(data?.models) ? data.models : [];

    const chatModels = models
      .filter(model => Array.isArray(model.supportedGenerationMethods) && model.supportedGenerationMethods.includes('generateContent'))
      .map(mapGeminiModel)
      .filter(model => model.id);

    const embeddingModels = models
      .filter(model => Array.isArray(model.supportedGenerationMethods) && model.supportedGenerationMethods.includes('embedContent'))
      .map(mapGeminiModel)
      .filter(model => model.id);

    return { chatModels, embeddingModels };
  };

  const fetchGroqModels = async (apiKey) => {
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || 'Failed to fetch Groq models');
    }

    const models = Array.isArray(data?.data) ? data.data : [];
    const chatModels = models
      .map(mapGroqModel)
      .filter(model => model.id);

    return { chatModels, embeddingModels: [] };
  };

  const saveModelPreferencesToConfig = (nextCatalog, nextChatSelections, nextEmbeddingSelections) => {
    const userConfig = getUserConfig();
    const updatedConfig = {
      ...userConfig,
      providerModelCatalog: nextCatalog,
      selectedChatModels: nextChatSelections,
      selectedEmbeddingModels: nextEmbeddingSelections
    };

    localStorage.setItem('userConfig', JSON.stringify(updatedConfig));
  };

  const ensureDefaultSelections = (catalog, existingSelections, type) => {
    const nextSelections = { ...existingSelections };

    Object.keys(catalog).forEach((providerId) => {
      const providerData = catalog[providerId] || {};
      const models = type === 'chat' ? (providerData.chatModels || []) : (providerData.embeddingModels || []);
      const modelIds = models.map(model => model.id);

      if (!Array.isArray(nextSelections[providerId]) || nextSelections[providerId].length === 0) {
        nextSelections[providerId] = modelIds;
      } else {
        nextSelections[providerId] = nextSelections[providerId].filter(id => modelIds.includes(id));
      }
    });

    return nextSelections;
  };

  useEffect(() => {
    const fallbackCatalog = {};

    PROVIDERS.forEach((provider) => {
      const existing = providerModels[provider.id] || {};
      fallbackCatalog[provider.id] = {
        chatModels: Array.isArray(existing.chatModels) && existing.chatModels.length > 0
          ? existing.chatModels
          : provider.models,
        embeddingModels: provider.id === 'gemini'
          ? (Array.isArray(existing.embeddingModels) && existing.embeddingModels.length > 0
            ? existing.embeddingModels
            : [{ id: 'text-embedding-004', name: 'Text Embedding 004', description: 'Gemini embedding model', provider: 'gemini' }])
          : []
      };
    });

    const nextChatSelections = ensureDefaultSelections(fallbackCatalog, selectedChatModels, 'chat');
    const nextEmbeddingSelections = ensureDefaultSelections(fallbackCatalog, selectedEmbeddingModels, 'embedding');

    setProviderModels(fallbackCatalog);
    setSelectedChatModels(nextChatSelections);
    setSelectedEmbeddingModels(nextEmbeddingSelections);
    saveModelPreferencesToConfig(fallbackCatalog, nextChatSelections, nextEmbeddingSelections);
  }, []);

  const handleKeyChange = (providerId, value) => {
    setApiKeys(prev => ({ ...prev, [providerId]: value }));
    // Clear save status when editing
    setSaveStatus(prev => ({ ...prev, [providerId]: null }));
  };

  const toggleShowKey = (providerId) => {
    setShowKeys(prev => ({ ...prev, [providerId]: !prev[providerId] }));
  };

  const handleSave = (providerId) => {
    const userConfig = getUserConfig();
    const updatedConfig = {
      ...userConfig,
      [`${providerId}ApiKey`]: apiKeys[providerId],
      providerModelCatalog: providerModels,
      selectedChatModels,
      selectedEmbeddingModels,
      // Update backward compat field if saving Gemini
      ...(providerId === 'gemini' && { apiKey: apiKeys[providerId] })
    };
    
    localStorage.setItem('userConfig', JSON.stringify(updatedConfig));
    
    // Show success feedback
    setSaveStatus(prev => ({ ...prev, [providerId]: 'success' }));
    
    // Clear status after 2 seconds
    setTimeout(() => {
      setSaveStatus(prev => ({ ...prev, [providerId]: null }));
    }, 2000);
  };

  const handleRemove = (providerId) => {
    const userConfig = getUserConfig();

    const nextCatalog = {
      ...providerModels,
      [providerId]: {
        chatModels: [],
        embeddingModels: providerId === 'gemini' ? [] : []
      }
    };

    const nextChatSelections = {
      ...selectedChatModels,
      [providerId]: []
    };

    const nextEmbeddingSelections = {
      ...selectedEmbeddingModels,
      [providerId]: []
    };

    const updatedConfig = {
      ...userConfig,
      [`${providerId}ApiKey`]: '',
      providerModelCatalog: nextCatalog,
      selectedChatModels: nextChatSelections,
      selectedEmbeddingModels: nextEmbeddingSelections,
      // Clear backward compat field if removing Gemini
      ...(providerId === 'gemini' && { apiKey: '' })
    };
    
    localStorage.setItem('userConfig', JSON.stringify(updatedConfig));
    setApiKeys(prev => ({ ...prev, [providerId]: '' }));
    setProviderModels(nextCatalog);
    setSelectedChatModels(nextChatSelections);
    setSelectedEmbeddingModels(nextEmbeddingSelections);
    
    // Show success feedback
    setSaveStatus(prev => ({ ...prev, [providerId]: 'removed' }));
    
    // Clear status after 2 seconds
    setTimeout(() => {
      setSaveStatus(prev => ({ ...prev, [providerId]: null }));
    }, 2000);
  };

  const isConfigured = (providerId) => {
    return apiKeys[providerId] && apiKeys[providerId].trim().length > 0;
  };

  const fetchProviderModels = async (providerId) => {
    const apiKey = apiKeys[providerId];

    if (!apiKey || apiKey.trim().length === 0) {
      setModelFetchStatus(prev => ({ ...prev, [providerId]: { type: 'error', message: 'Save API key first' } }));
      return;
    }

    setModelFetchStatus(prev => ({ ...prev, [providerId]: { type: 'loading', message: 'Fetching models...' } }));

    try {
      let fetched;
      if (providerId === 'gemini') {
        fetched = await fetchGeminiModels(apiKey);
      } else if (providerId === 'groq') {
        fetched = await fetchGroqModels(apiKey);
      } else {
        throw new Error('Unsupported provider');
      }

      const nextCatalog = {
        ...providerModels,
        [providerId]: {
          chatModels: fetched.chatModels,
          embeddingModels: fetched.embeddingModels
        }
      };

      const nextChatSelections = {
        ...selectedChatModels,
        [providerId]: fetched.chatModels.map(model => model.id)
      };

      const nextEmbeddingSelections = {
        ...selectedEmbeddingModels,
        [providerId]: fetched.embeddingModels.map(model => model.id)
      };

      setProviderModels(nextCatalog);
      setSelectedChatModels(nextChatSelections);
      setSelectedEmbeddingModels(nextEmbeddingSelections);
      saveModelPreferencesToConfig(nextCatalog, nextChatSelections, nextEmbeddingSelections);

      setModelFetchStatus(prev => ({
        ...prev,
        [providerId]: {
          type: 'success',
          message: `Loaded ${fetched.chatModels.length} chat model(s)${providerId === 'gemini' ? ` and ${fetched.embeddingModels.length} embedding model(s)` : ''}`
        }
      }));
    } catch (error) {
      setModelFetchStatus(prev => ({ ...prev, [providerId]: { type: 'error', message: error.message || 'Failed to fetch models' } }));
    }
  };

  const toggleChatModel = (providerId, modelId) => {
    const nextChatSelections = {
      ...selectedChatModels,
      [providerId]: selectedChatModels[providerId]?.includes(modelId)
        ? selectedChatModels[providerId].filter(id => id !== modelId)
        : [...(selectedChatModels[providerId] || []), modelId]
    };

    setSelectedChatModels(nextChatSelections);
    saveModelPreferencesToConfig(providerModels, nextChatSelections, selectedEmbeddingModels);
  };

  const toggleEmbeddingModel = (providerId, modelId) => {
    const nextEmbeddingSelections = {
      ...selectedEmbeddingModels,
      [providerId]: selectedEmbeddingModels[providerId]?.includes(modelId)
        ? selectedEmbeddingModels[providerId].filter(id => id !== modelId)
        : [...(selectedEmbeddingModels[providerId] || []), modelId]
    };

    setSelectedEmbeddingModels(nextEmbeddingSelections);
    saveModelPreferencesToConfig(providerModels, selectedChatModels, nextEmbeddingSelections);
  };

  const renderProviderCard = (provider, usage) => (
    <div key={`${usage}-${provider.id}`} className="provider-card">
      <div className="provider-card-header">
        <div className="provider-icon-wrapper" style={{ backgroundColor: `${provider.color}15` }}>
          <span className="provider-icon" style={{ fontSize: '32px' }}>
            {provider.icon}
          </span>
        </div>
        <div className="provider-info">
          <h3>{provider.name}</h3>
          <p>{provider.description}</p>
        </div>
        {isConfigured(provider.id) && (
          <div className="provider-status-badge configured">
            <FaCheckCircle /> Configured
          </div>
        )}
        {!isConfigured(provider.id) && (
          <div className="provider-status-badge not-configured">
            <FaExclamationCircle /> Not Configured
          </div>
        )}
      </div>

      <div className="provider-card-body">
        <div className="form-group">
          <label>{provider.apiKeyLabel}</label>
          <div className="api-key-input-wrapper">
            <input
              type={showKeys[provider.id] ? 'text' : 'password'}
              value={apiKeys[provider.id]}
              onChange={(e) => handleKeyChange(provider.id, e.target.value)}
              placeholder={provider.apiKeyPlaceholder}
              className="api-key-input"
            />
            <button
              type="button"
              onClick={() => toggleShowKey(provider.id)}
              className="toggle-visibility-btn"
              title={showKeys[provider.id] ? 'Hide key' : 'Show key'}
            >
              {showKeys[provider.id] ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="api-key-help">
            <a 
              href={provider.getKeyUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: provider.color }}
            >
              Get your {provider.name} API key →
            </a>
          </div>
        </div>

        <div className="provider-actions">
          <button
            onClick={() => handleSave(provider.id)}
            className="btn-primary"
            disabled={!apiKeys[provider.id] || apiKeys[provider.id].trim().length === 0}
          >
            <FaSave /> Save API Key
          </button>
          <button
            type="button"
            onClick={() => fetchProviderModels(provider.id)}
            className="btn-secondary"
            disabled={!isConfigured(provider.id)}
          >
            Refresh Models
          </button>
          {isConfigured(provider.id) && (
            <button
              onClick={() => handleRemove(provider.id)}
              className="btn-danger"
            >
              Remove Key
            </button>
          )}
        </div>

        {modelFetchStatus[provider.id]?.message && (
          <div className={`save-feedback ${modelFetchStatus[provider.id].type === 'error' ? 'removed' : 'success'}`}>
            <FaCheckCircle /> {modelFetchStatus[provider.id].message}
          </div>
        )}

        {saveStatus[provider.id] === 'success' && (
          <div className="save-feedback success">
            <FaCheckCircle /> API key saved successfully!
          </div>
        )}
        {saveStatus[provider.id] === 'removed' && (
          <div className="save-feedback removed">
            <FaCheckCircle /> API key removed successfully!
          </div>
        )}
      </div>

      <div className="provider-card-footer">
        <div className="provider-models">
          <strong>{usage === 'embedding' ? 'Embedding Models:' : 'Chat Models:'}</strong>
          <div className="model-selection-list">
            {(usage === 'embedding'
              ? (providerModels[provider.id]?.embeddingModels || [])
              : (providerModels[provider.id]?.chatModels || [])
            ).map((model) => (
              <label key={`${usage}-${provider.id}-${model.id}`} className="model-checkbox-item">
                <input
                  type="checkbox"
                  checked={usage === 'embedding'
                    ? !!selectedEmbeddingModels[provider.id]?.includes(model.id)
                    : !!selectedChatModels[provider.id]?.includes(model.id)}
                  onChange={() => usage === 'embedding'
                    ? toggleEmbeddingModel(provider.id, model.id)
                    : toggleChatModel(provider.id, model.id)}
                />
                <span>{model.name}</span>
              </label>
            ))}
            {(usage === 'embedding'
              ? (providerModels[provider.id]?.embeddingModels || [])
              : (providerModels[provider.id]?.chatModels || [])
            ).length === 0 && (
              <p className="embedding-note">No models loaded yet. Save API key and click Refresh Models.</p>
            )}
          </div>
          {usage === 'embedding' && provider.id === 'gemini' && (
            <p className="embedding-note">Required for RAG document indexing and retrieval embeddings.</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="providers-view">
      <div className="provider-section">
        <div className="provider-section-header">
          <h2>Chat Providers</h2>
          <p>Used for agent and chatbot response generation.</p>
        </div>
        <div className="providers-grid">
          {chatProviders.map(provider => renderProviderCard(provider, 'chat'))}
        </div>
      </div>

      <div className="provider-section">
        <div className="provider-section-header">
          <h2>Embedding Providers</h2>
          <p>Used for RAG knowledge base embeddings and semantic retrieval.</p>
        </div>
        <div className="providers-grid">
          {embeddingProviders.map(provider => renderProviderCard(provider, 'embedding'))}
        </div>
      </div>

      <div className="security-note">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
        <span>Your API keys are stored securely in your browser's local storage and never sent to our servers.</span>
      </div>
    </div>
  );
};

export default ProvidersView;
