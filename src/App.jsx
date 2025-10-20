// src/App.jsx
import React, { useState, useEffect } from 'react';
import AgentCard from './components/AgentCard';
import AgentFormModal from './components/AgentFormModal';
import RunAgentModal from './components/RunAgentModal';
import { 
  initDB, 
  saveAgent, 
  updateAgent, 
  getAllAgents, 
  deleteAgent 
} from './services/indexedDB';
import { executeAgent } from './services/llmService';
import './App.css';

function App() {
  const [agents, setAgents] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [runningAgent, setRunningAgent] = useState(null);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    await initDB();
    const allAgents = await getAllAgents();
    setAgents(allAgents);
  };

  const handleSaveAgent = async (agentData) => {
    if (editingAgent) {
      await updateAgent({ ...agentData, id: editingAgent.id });
    } else {
      await saveAgent(agentData);
    }
    await loadAgents();
    setShowFormModal(false);
    setEditingAgent(null);
  };

  const handleCreateNew = () => {
    setEditingAgent(null);
    setShowFormModal(true);
  };

  const handleEditAgent = (agent) => {
    setEditingAgent(agent);
    setShowFormModal(true);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setEditingAgent(null);
  };

  const handleDeleteAgent = async (id) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      await deleteAgent(id);
      await loadAgents();
    }
  };

  const handleRunAgent = async (agent, input, customParams) => {
    return await executeAgent(agent, input, customParams);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>AI Agent Builder</h1>
        <button 
          onClick={handleCreateNew} 
          className="btn-primary"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create New Agent
        </button>
      </header>

      {agents.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🤖</div>
          <h3>No Agents Yet</h3>
          <p>Create your first AI agent by giving it a name, role, and goal</p>
          <button onClick={handleCreateNew} className="btn-primary" style={{ marginTop: '16px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create Your First Agent
          </button>
        </div>
      )}

      {agents.length > 0 && (
        <div className="agents-grid">
          {agents.map(agent => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onEdit={handleEditAgent}
              onRun={setRunningAgent}
              onDelete={handleDeleteAgent}
            />
          ))}
        </div>
      )}

      {/* Form Modal for Create/Edit */}
      {showFormModal && (
        <AgentFormModal
          agent={editingAgent}
          onSave={handleSaveAgent}
          onClose={handleCloseFormModal}
        />
      )}

      {/* Run Agent Modal */}
      {runningAgent && (
        <RunAgentModal
          agent={runningAgent}
          onRun={handleRunAgent}
          onClose={() => setRunningAgent(null)}
        />
      )}
    </div>
  );
}

export default App;
