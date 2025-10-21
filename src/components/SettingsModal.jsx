// src/components/SettingsModal.jsx
import React, { useState } from 'react';

const SettingsModal = ({ onClose, currentConfig, onSave }) => {
  const [apiKey, setApiKey] = useState(currentConfig?.apiKey || '');
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    const updatedConfig = {
      ...currentConfig,
      apiKey: apiKey
    };
    localStorage.setItem('userConfig', JSON.stringify(updatedConfig));
    onSave(updatedConfig);
    onClose();
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

          <div className="form-group">
            <label>Gemini API Key</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                style={{ paddingRight: '50px' }}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px'
                }}
              >
                {showKey ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="security-note" style={{ marginTop: '16px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span>Your API key is stored securely in your browser</span>
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
