// src/components/AgentCard.jsx
import React from 'react';

const AgentCard = ({ agent, onEdit, onRun, onDelete }) => {
  return (
    <div className="agent-card modern">
      <div className="card-header">
        <div className="header-content">
          <div className="agent-title">
            <h3>{agent.name}</h3>
            <span className="role-subtitle">{agent.role}</span>
          </div>
          <span className="model-badge">{agent.model}</span>
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
        <button onClick={() => onEdit(agent)} className="btn-card btn-edit">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          Edit
        </button>
        <button onClick={() => onRun(agent)} className="btn-card btn-run">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          Run
        </button>
        <button onClick={() => onDelete(agent.id)} className="btn-card btn-delete">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
};

export default AgentCard;
