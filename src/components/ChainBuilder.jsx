import React, { useState } from 'react';
import './styles/ChainBuilder.css';

const ChainBuilder = ({ agents, onSave, onClose }) => {
  const [chainName, setChainName] = useState('');
  const [chainDescription, setChainDescription] = useState('');
  const [selectedAgents, setSelectedAgents] = useState([]);

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

  const handleSave = () => {
    if (!chainName || selectedAgents.length === 0) return;
    onSave({
      name: chainName,
      description: chainDescription,
      agents: selectedAgents.map((agent, idx) => ({
        agentId: agent.id,
        order: idx
      }))
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content chain-builder" onClick={(e) => e.stopPropagation()}>
        <h2>Build Agent Chain</h2>
        
        <div className="form-group">
          <label>Chain Name</label>
          <input
            type="text"
            value={chainName}
            onChange={(e) => setChainName(e.target.value)}
            placeholder="e.g., Content Pipeline"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={chainDescription}
            onChange={(e) => setChainDescription(e.target.value)}
            placeholder="Describe what this chain does..."
            rows="2"
          />
        </div>

        <div className="chain-builder-layout">
          <div className="available-agents">
            <h3>Available Agents</h3>
            {agents.filter(a => !a.isDefault).map(agent => (
              <div key={agent.id} className="agent-item" onClick={() => addAgent(agent)}>
                <span>➕</span>
                <span>{agent.name}</span>
              </div>
            ))}
          </div>

          <div className="chain-sequence">
            <h3>Chain Sequence ({selectedAgents.length})</h3>
            {selectedAgents.length === 0 ? (
              <div className="empty-state">Select agents to add to chain</div>
            ) : (
              selectedAgents.map((agent, idx) => (
                <div key={agent.id} className="chain-agent-card">
                  <div className="chain-agent-order">{idx + 1}</div>
                  <div className="chain-agent-info">
                    <strong>{agent.name}</strong>
                    <small>{agent.role}</small>
                  </div>
                  <div className="chain-agent-actions">
                    <button onClick={() => moveAgent(idx, 'up')} disabled={idx === 0}>↑</button>
                    <button onClick={() => moveAgent(idx, 'down')} disabled={idx === selectedAgents.length - 1}>↓</button>
                    <button onClick={() => removeAgent(agent.id)}>✕</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={!chainName || selectedAgents.length === 0}>
            Save Chain
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChainBuilder;
