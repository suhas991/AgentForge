// src/components/ProviderSetupModal.jsx
import React, { useState } from 'react';
import { PROVIDERS } from '../constants/providers';
import './OnboardingModal.css'; // Reuse onboarding styles

const ProviderSetupModal = ({ onComplete, onSkip, currentConfig }) => {
  const [apiKeys, setApiKeys] = useState({
    gemini: currentConfig?.geminiApiKey || currentConfig?.apiKey || '',
    groq: currentConfig?.groqApiKey || ''
  });
  const [showKeys, setShowKeys] = useState({
    gemini: false,
    groq: false
  });
  const [errors, setErrors] = useState({});

  const validateKeys = () => {
    const newErrors = {};
    
    // At least one API key must be provided
    const hasGemini = apiKeys.gemini && apiKeys.gemini.trim().length > 0;
    const hasGroq = apiKeys.groq && apiKeys.groq.trim().length > 0;
    
    if (!hasGemini && !hasGroq) {
      newErrors.apiKeys = 'Please configure at least one AI provider to continue';
    }
    
    // Validate individual keys if provided
    if (hasGemini && apiKeys.gemini.trim().length < 20) {
      newErrors.geminiApiKey = 'Invalid API Key format';
    }
    if (hasGroq && apiKeys.groq.trim().length < 20) {
      newErrors.groqApiKey = 'Invalid API Key format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateKeys()) {
      const updatedConfig = {
        ...currentConfig,
        geminiApiKey: apiKeys.gemini,
        groqApiKey: apiKeys.groq,
        apiKey: apiKeys.gemini || apiKeys.groq // Backward compatibility
      };
      localStorage.setItem('userConfig', JSON.stringify(updatedConfig));
      onComplete(updatedConfig);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  const handleKeyChange = (provider, value) => {
    setApiKeys({ ...apiKeys, [provider]: value });
    // Clear errors when user types
    if (errors[`${provider}ApiKey`]) {
      setErrors({ ...errors, [`${provider}ApiKey`]: '' });
    }
    if (errors.apiKeys) {
      setErrors({ ...errors, apiKeys: '' });
    }
  };

  const toggleShowKey = (provider) => {
    setShowKeys({ ...showKeys, [provider]: !showKeys[provider] });
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal" style={{ maxWidth: '600px' }}>
        <div className="onboarding-step">
          <h2>🚀 Configure AI Providers</h2>
          <p>Connect to one or more AI providers to power your agents</p>

          {errors.apiKeys && (
            <div className="error-banner" style={{
              padding: '12px',
              backgroundColor: '#fee',
              color: '#c33',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              border: '1px solid #fcc'
            }}>
              {errors.apiKeys}
            </div>
          )}

          <div className="providers-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
            {PROVIDERS.map(provider => (
              <div
                key={provider.id}
                className="provider-card"
                style={{
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  padding: '20px',
                  backgroundColor: '#fff'
                }}
              >
                <div className="provider-header" style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '28px' }}>{provider.icon}</span>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{provider.name}</h3>
                      <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666' }}>{provider.description}</p>
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px', display: 'block' }}>
                    {provider.apiKeyLabel}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showKeys[provider.id] ? 'text' : 'password'}
                      placeholder={provider.apiKeyPlaceholder}
                      value={apiKeys[provider.id] || ''}
                      onChange={(e) => handleKeyChange(provider.id, e.target.value)}
                      className={errors[`${provider.id}ApiKey`] ? 'error' : ''}
                      style={{ paddingRight: '45px', width: '100%' }}
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowKey(provider.id)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        fontSize: '18px'
                      }}
                    >
                      {showKeys[provider.id] ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors[`${provider.id}ApiKey`] && (
                    <span className="error-message" style={{ fontSize: '12px', color: '#c33', marginTop: '4px', display: 'block' }}>
                      {errors[`${provider.id}ApiKey`]}
                    </span>
                  )}
                </div>

                <div className="info-box" style={{
                  backgroundColor: '#f5f5f5',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#666'
                }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <div>
                      <strong>Free API Key:</strong>{' '}
                      <a href={provider.getKeyUrl} target="_blank" rel="noopener noreferrer" style={{ color: provider.color }}>
                        Get from {provider.name}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="security-note" style={{ marginBottom: '20px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span>Your API keys are stored securely in your browser and never sent to our servers</span>
          </div>

          <div className="onboarding-actions" style={{ display: 'flex', gap: '12px' }}>
            {onSkip && (
              <button className="btn-onboarding-secondary" onClick={handleSkip} style={{ flex: 1 }}>
                Skip for Now
              </button>
            )}
            <button className="btn-onboarding-primary" onClick={handleSave} style={{ flex: 1 }}>
              Save & Continue
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 11 12 14 22 4"></polyline>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderSetupModal;
