// src/components/AgentCard.jsx
import React from 'react';
import { exportAgent } from '../services/exportImportService';
import { getModelName, getModelCategory } from '../constants/models';

const AgentCard = ({ agent, onEdit, onRun, onDelete, isDefault }) => {
  const getModelBadgeClass = (modelId) => {
    const category = getModelCategory(modelId);
    return `model-badge ${category}`;
  };

  const handleExport = (e) => {
    e.stopPropagation();
    try {
      exportAgent(agent);
    } catch (error) {
      alert('Failed to export agent: ' + error.message);
    }
  };

  return (
    <div className={`agent-card modern ${isDefault ? 'default-agent' : ''}`}>
      {isDefault && (
        <div className="default-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
          </svg>
          Helper Agent
        </div>
      )}
      
      <div className="card-header">
        <div className="header-content">
          <div className="agent-title">
            <h3>{agent.name}</h3>
            <span className="role-subtitle">{agent.role}</span>
          </div>
          <span className={getModelBadgeClass(agent.model)}>
            {getModelName(agent.model)}
          </span>
        </div>
      </div>

      <div className="card-body">
        <div className="info-item">
          <span className="label">Goal</span>
          <p>{agent.goal}</p>
        </div>
        
        {agent.customParameters && agent.customParameters.length > 0 && (
          <div className="custom-params-preview">
            <span className="label">Parameters</span>
            <div className="params-tags">
              {agent.customParameters.slice(0, 4).map((param, idx) => (
                <span key={idx} className="param-tag">
                  {param.key}: {param.value}
                </span>
              ))}
              {agent.customParameters.length > 4 && (
                <span className="param-tag more">+{agent.customParameters.length - 4} more</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="card-actions">
        {!isDefault && (
          <button onClick={() => onEdit(agent)} className="btn-card btn-edit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit
          </button>
        )}
        
        <button onClick={() => onRun(agent)} className={`btn-card btn-run ${isDefault ? 'featured' : ''}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          {isDefault ? 'Use Helper' : 'Run'}
        </button>

        {!isDefault && (
          <button onClick={handleExport} className="btn-card btn-export" title="Export agent">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export
          </button>
        )}
        
        {!isDefault && (
          <button onClick={() => onDelete(agent.id)} className="btn-card btn-delete">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default AgentCard;
