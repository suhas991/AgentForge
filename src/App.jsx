// src/App.jsx
import React, { useState, useEffect } from 'react';
import AgentCard from './components/AgentCard';
import AgentFormModal from './components/AgentFormModal';
import RunAgentModal from './components/RunAgentModal';
import ChatBot from './components/ChatBot';
import MobileBlocker from './components/MobileBlocker';
import { 
  initDB, 
  saveAgent, 
  updateAgent, 
  getAllAgents, 
  deleteAgent 
} from './services/indexedDB';
import { executeAgent } from './services/llmService';
import { DEFAULT_AGENTS } from './constants/defaultAgents';
import './App.css';

function App() {
  const [agents, setAgents] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [runningAgent, setRunningAgent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);

  // Check if device is mobile/tablet
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await initDB();
      await seedDefaultAgents();
      await loadAgents();
    } catch (error) {
      console.error('App initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const seedDefaultAgents = async () => {
    const existingAgents = await getAllAgents();
    const hasDefaultAgent = existingAgents.some(agent => agent.isDefault);
    
    if (!hasDefaultAgent && existingAgents.length === 0) {
      for (const defaultAgent of DEFAULT_AGENTS) {
        await saveAgent(defaultAgent);
      }
    }
  };

  const loadAgents = async () => {
    const allAgents = await getAllAgents();
    const sortedAgents = allAgents.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return 0;
    });
    setAgents(sortedAgents);
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

  const handleEditAgent = (agent) => {
    if (agent.isDefault) {
      alert('Default agents cannot be edited. You can use the chatbot to get help building new agents.');
      return;
    }
    setEditingAgent(agent);
    setShowFormModal(true);
  };

  const handleDeleteAgent = async (id, isDefault) => {
    if (isDefault) {
      alert('Default agents cannot be deleted.');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this agent?')) {
      await deleteAgent(id);
      await loadAgents();
    }
  };

  const handleChatBotMessage = async (message) => {
    const helperAgent = agents.find(agent => agent.isDefault);
    if (!helperAgent) {
      throw new Error('Helper agent not available. Please refresh the page.');
    }
    return await executeAgent(helperAgent, message, {});
  };

  const helperAgent = agents.find(agent => agent.isDefault);

  // Show mobile blocker on small screens
  if (isMobile) {
    return <MobileBlocker />;
  }

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Initializing Agent Builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>AI Agent Builder</h1>
        <button 
          onClick={() => {
            setEditingAgent(null);
            setShowFormModal(true);
          }}
          className="btn-primary"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create New Agent
        </button>
      </header>

      {helperAgent && !isChatBotOpen && (
        <div className="helper-banner">
          <div className="helper-icon">💡</div>
          <div className="helper-content">
            <h3>Need help building agents?</h3>
            <p>Click the chat icon in the bottom right to talk with the <strong>Agent Builder Assistant</strong>!</p>
          </div>
        </div>
      )}

      <div className="agents-grid">
        {agents
          .filter(agent => !agent.isDefault)
          .map(agent => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onEdit={handleEditAgent}
              onRun={setRunningAgent}
              onDelete={handleDeleteAgent}
              isDefault={agent.isDefault}
            />
          ))}
      </div>

      {showFormModal && (
        <AgentFormModal
          agent={editingAgent}
          onSave={handleSaveAgent}
          onClose={() => {
            setShowFormModal(false);
            setEditingAgent(null);
          }}
        />
      )}

      {runningAgent && (
        <RunAgentModal
          agent={runningAgent}
          onRun={(agent, input, customParams) => executeAgent(agent, input, customParams)}
          onClose={() => setRunningAgent(null)}
        />
      )}

      <ChatBot
        isOpen={isChatBotOpen}
        onToggle={() => setIsChatBotOpen(!isChatBotOpen)}
        onSendMessage={handleChatBotMessage}
        agentName={helperAgent?.name || 'AI Assistant'}
      />
    </div>
  );
}

export default App;
