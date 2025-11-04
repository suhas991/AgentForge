import React, { useState, useEffect } from 'react';
import './WorkflowBuilder.css';

const WorkflowBuilder = ({ agents, workflow, onSave, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Load workflow data when editing
  useEffect(() => {
    if (workflow) {
      setName(workflow.name || '');
      setDescription(workflow.description || '');
      
      // Reconstruct selectedAgents from workflow.agents
      if (workflow.agents && Array.isArray(workflow.agents)) {
        const agentsInOrder = workflow.agents
          .sort((a, b) => a.order - b.order)
          .map(wAgent => agents.find(a => a.id === wAgent.agentId))
          .filter(Boolean);
        setSelectedAgents(agentsInOrder);
      }
    }
  }, [workflow, agents]);

  const addAgent = (agent) => {
    if (!selectedAgents.find(a => a.id === agent.id)) {
      setSelectedAgents([...selectedAgents, agent]);
    }
  };

  const removeAgent = (agentId) => {
    setSelectedAgents(selectedAgents.filter(a => a.id !== agentId));
  };

  const moveAgent = (index, direction) => {
    const newAgents = [...selectedAgents];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newAgents.length) {
      [newAgents[index], newAgents[targetIndex]] = [newAgents[targetIndex], newAgents[index]];
      setSelectedAgents(newAgents);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newAgents = [...selectedAgents];
    const draggedItem = newAgents[draggedIndex];
    newAgents.splice(draggedIndex, 1);
    newAgents.splice(index, 0, draggedItem);
    
    setSelectedAgents(newAgents);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Keyboard navigation for reordering
  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault();
      moveAgent(index, 'up');
    } else if (e.key === 'ArrowDown' && index < selectedAgents.length - 1) {
      e.preventDefault();
      moveAgent(index, 'down');
    }
  };

  const handleSave = () => {
    if (!name || selectedAgents.length === 0) return;
    const workflowData = {
      name,
      description,
      agents: selectedAgents.map((agent, idx) => ({
        agentId: agent.id,
        order: idx
      }))
    };
    
    // If editing, preserve the id
    if (workflow && workflow.id) {
      workflowData.id = workflow.id;
    }
    
    onSave(workflowData);
  };

  // Filter agents based on search
  const filteredAgents = agents
    .filter(a => !a.isDefault)
    .filter(a => 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modern workflow-builder" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-section">
          <div>
            <h2>{workflow ? 'Edit Workflow' : 'Build Workflow'}</h2>
            <p className="modal-subtitle">
              {workflow ? 'Update your automated agent workflow' : 'Create an automated agent workflow'}
            </p>
          </div>
          <button onClick={onClose} className="close-btn" title="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="form-group">
          <label>Workflow Name </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Content Creation Pipeline"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this workflow do?"
            rows="3"
          />
        </div>

        <div className="builder-layout">
          <div className="available-agents">
            <div className="section-header">
              <h3>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Available Agents
              </h3>
              <span className="section-caption">{filteredAgents.length} agents</span>
            </div>
            
            <div className="search-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="clear-search" 
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="agent-list">
              {filteredAgents.length === 0 ? (
                <div className="no-results">
                  No agents found matching "{searchQuery}"
                </div>
              ) : (
                filteredAgents.map(agent => (
                  <div 
                    key={agent.id} 
                    className={`agent-item ${selectedAgents.find(a => a.id === agent.id) ? 'added' : ''}`}
                    onClick={() => addAgent(agent)}
                  >
                    <span className="add-icon">
                      {selectedAgents.find(a => a.id === agent.id) ? '✓' : '+'}
                    </span>
                    <div className="agent-details">
                      <strong>{agent.name}</strong>
                      <small>{agent.role}</small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="workflow-sequence">
            <div className="section-header">
              <h3>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
                Workflow Chain
              </h3>
              <span className="section-caption">
                {selectedAgents.length} {selectedAgents.length === 1 ? 'step' : 'steps'}
              </span>
            </div>

            {selectedAgents.length === 0 ? (
              <div className="empty-chain">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p>Click agents from the left to add them to your workflow</p>
                <small>Agents will execute in sequence from top to bottom</small>
              </div>
            ) : (
              <div className="chain-list">
                {selectedAgents.map((agent, idx) => (
                  <div 
                    key={agent.id} 
                    className={`chain-item ${draggedIndex === idx ? 'dragging' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragEnd={handleDragEnd}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    tabIndex={0}
                    role="button"
                    aria-label={`${agent.name}, position ${idx + 1}`}
                  >
                    <span className="drag-handle" title="Drag to reorder">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="9" cy="5" r="1.5"></circle>
                        <circle cx="9" cy="12" r="1.5"></circle>
                        <circle cx="9" cy="19" r="1.5"></circle>
                        <circle cx="15" cy="5" r="1.5"></circle>
                        <circle cx="15" cy="12" r="1.5"></circle>
                        <circle cx="15" cy="19" r="1.5"></circle>
                      </svg>
                    </span>
                    <span className="chain-number">{idx + 1}</span>
                    <div className="chain-info">
                      <strong>{agent.name}</strong>
                      <small>{agent.role}</small>
                    </div>
                    <div className="chain-controls">
                      <button 
                        onClick={() => moveAgent(idx, 'up')} 
                        disabled={idx === 0}
                        title="Move up (↑)"
                        aria-label="Move up"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                      </button>
                      <button 
                        onClick={() => moveAgent(idx, 'down')} 
                        disabled={idx === selectedAgents.length - 1}
                        title="Move down (↓)"
                        aria-label="Move down"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                      <button 
                        onClick={() => removeAgent(agent.id)}
                        className="remove-btn"
                        title="Remove from workflow"
                        aria-label="Remove"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-secondary" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Cancel
          </button>
          <button 
            className="btn-primary" 
            onClick={handleSave}
            disabled={!name || selectedAgents.length === 0}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            {workflow ? 'Update Workflow' : 'Save Workflow'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
