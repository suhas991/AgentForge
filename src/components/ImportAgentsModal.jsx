// src/components/ImportAgentsModal.jsx
import React, { useState, useRef } from 'react';
import { importAgentsFromFile, generateUniqueName } from '../services/exportImportService';
import './ImportAgentsModal.css';

const ImportAgentsModal = ({ onClose, onImport, existingAgents }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError('');
    setSelectedFile(file);

    try {
      const agents = await importAgentsFromFile(file);
      setPreviewData(agents);
    } catch (err) {
      setError(err.message);
      setSelectedFile(null);
      setPreviewData(null);
    }
  };

  const handleImport = async () => {
    if (!previewData) return;

    setImporting(true);
    try {
      const existingNames = existingAgents.map(a => a.name);
      const agentsToImport = previewData.map(agent => ({
        ...agent,
        name: generateUniqueName(agent.name, existingNames),
        customParameters: agent.customParameters || []
      }));

      await onImport(agentsToImport);
      onClose();
    } catch (err) {
      setError('Failed to import agents: ' + err.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modern import-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Import Agents</h2>
            <p className="modal-subtitle">Upload a JSON file to import agents</p>
          </div>
          <button onClick={onClose} className="close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="file-upload-area" onClick={() => fileInputRef.current?.click()}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <div className="upload-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <p className="upload-text">
              {selectedFile ? selectedFile.name : 'Click to select a JSON file'}
            </p>
            <p className="upload-hint">or drag and drop here</p>
          </div>

          {error && (
            <div className="error-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {previewData && (
            <div className="preview-section">
              <h3>Preview ({previewData.length} agent{previewData.length !== 1 ? 's' : ''})</h3>
              <div className="preview-list">
                {previewData.map((agent, index) => (
                  <div key={index} className="preview-item">
                    <div className="preview-icon">✓</div>
                    <div className="preview-info">
                      <strong>{agent.name}</strong>
                      <span>{agent.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!previewData || importing}
            className="btn-primary"
          >
            {importing ? (
              <>
                <span className="spinner"></span>
                Importing...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                Import Agents
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportAgentsModal;
