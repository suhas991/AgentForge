// src/components/AgentFormModal.jsx
import React from 'react';
import AgentForm from './AgentForm';

const AgentFormModal = ({ agent, onSave, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modern form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{agent ? 'Edit Agent' : 'Create New Agent'}</h2>
            <p className="modal-subtitle">
              {agent ? 'Update your agent configuration' : 'Configure your AI agent parameters'}
            </p>
          </div>
          <button onClick={onClose} className="close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <AgentForm
            initialData={agent}
            onSave={onSave}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default AgentFormModal;
