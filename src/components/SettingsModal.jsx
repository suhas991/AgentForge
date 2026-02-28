// src/components/SettingsModal.jsx
import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import {  PROVIDERS } from '../constants/providers';

const SettingsModal = ({ onClose, currentConfig, onSave }) => {
  const { setUserConfig } = useAppStore();
  const [apiKeys, setApiKeys] = useState({
    gemini: currentConfig?.geminiApiKey || '',
    groq: currentConfig?.groqApiKey || ''
  });
  const [showKeys, setShowKeys] = useState({
    gemini: false,
    groq: false
  });

  const handleSave = () => {
    const updatedConfig = {
      ...currentConfig,
      geminiApiKey: apiKeys.gemini,
      groqApiKey: apiKeys.groq,
      apiKey: apiKeys.gemini || apiKeys.groq // Backward compatibility
    };
    localStorage.setItem('userConfig', JSON.stringify(updatedConfig));
    setUserConfig(updatedConfig);
    onSave(updatedConfig);
    onClose();
  };

  const handleKeyChange = (provider, value) => {
    setApiKeys({ ...apiKeys, [provider]: value });
  };

  const toggleShowKey = (provider) => {
    setShowKeys({ ...showKeys, [provider]: !showKeys[provider] });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modern" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Settings</h2>
            <p className="modal-subtitle">Update your configuration</p>
          </div>
          <button onClick={onClose} className="close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={currentConfig?.name || ''}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={currentConfig?.email || ''}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>

          <div style={{ marginTop: '24px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0' }}>AI Providers</h3>
            <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
              Manage your API keys for each provider. You can use multiple providers.
            </p>
          </div>

          <div className="providers-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {PROVIDERS.map(provider => (
              <div
                key={provider.id}
                className="provider-card"
                style={{
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  padding: '16px',
                  backgroundColor: '#fafafa'
                }}
              >
                <div className="provider-header" style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>{provider.icon}</span>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>{provider.name}</h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#666' }}>{provider.description}</p>
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '8px' }}>
                  <label style={{ fontSize: '14px' }}>{provider.apiKeyLabel}</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showKeys[provider.id] ? 'text' : 'password'}
                      value={apiKeys[provider.id]}
                      onChange={(e) => handleKeyChange(provider.id, e.target.value)}
                      placeholder={provider.apiKeyPlaceholder}
                      style={{ paddingRight: '50px' }}
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
                        fontSize: '16px'
                      }}
                    >
                      {showKeys[provider.id] ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  <div style={{ marginTop: '6px', fontSize: '11px', color: '#666' }}>
                    <a href={provider.getKeyUrl} target="_blank" rel="noopener noreferrer" style={{ color: provider.color }}>
                      Get API key from {provider.name}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="security-note" style={{ marginTop: '16px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span>Your API keys are stored securely in your browser</span>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
