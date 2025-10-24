// src/App.jsx
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import OnboardingModal from './components/OnboardingModal';
import AgentCard from './components/AgentCard';
import AgentFormModal from './components/AgentFormModal';
import RunAgentModal from './components/RunAgentModal';
import ChatBot from './components/ChatBot';
import MobileBlocker from './components/MobileBlocker';
import SettingsModal from './components/SettingsModal';
import ImportAgentsModal from './components/ImportAgentsModal';
import { 
  initDB, 
  saveAgent, 
  updateAgent, 
  getAllAgents, 
  deleteAgent 
} from './services/indexedDB';
import { executeAgent } from './services/llmService';
import { exportAgents } from './services/exportImportService';
import { DEFAULT_AGENTS } from './constants/defaultAgents';
import './App.css';
import logo from '/vite.png';

function App() {
  const [agents, setAgents] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [runningAgent, setRunningAgent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showSettings, setShowSettings] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  
  // Onboarding states
  const [showLanding, setShowLanding] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userConfig, setUserConfig] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // ADD THEME STATE
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    checkUserConfig();
  }, []);

  // ADD THEME EFFECT
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-wrapper')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const checkUserConfig = async () => {
    const savedConfig = localStorage.getItem('userConfig');
    if (savedConfig) {
      setUserConfig(JSON.parse(savedConfig));
      setShowLanding(false);
      await initializeApp();
    } else {
      setIsLoading(false);
    }
  };

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
  const existingDefaultAgent = existingAgents.find(agent => agent.isDefault);
  
  // Get the latest default agent configuration
  const latestDefaultAgent = DEFAULT_AGENTS[0];
  
  // If default agent exists, UPDATE it with new configuration
  if (existingDefaultAgent) {
    console.log('🔄 Updating default agent with latest configuration...');
    await updateAgent({
      ...latestDefaultAgent,
      id: existingDefaultAgent.id, // Keep the same ID
      isDefault: true
    });
    console.log('✅ Default agent updated!');
  } 
  // If no default agent exists and no agents at all, CREATE it
  else if (existingAgents.length === 0) {
    console.log('🆕 Creating default agent...');
    for (const defaultAgent of DEFAULT_AGENTS) {
      await saveAgent(defaultAgent);
    }
    console.log('✅ Default agent created!');
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

  const handleGetStarted = () => {
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = async (config) => {
    setUserConfig(config);
    setShowOnboarding(false);
    setShowLanding(false);
    setIsLoading(true);
    await initializeApp();
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout? This will clear your configuration.')) {
      localStorage.removeItem('userConfig');
      setUserConfig(null);
      setShowLanding(true);
      setAgents([]);
    }
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

  const handleImportAgents = async (importedAgents) => {
    for (const agent of importedAgents) {
      await saveAgent(agent);
    }
    await loadAgents();
  };

  const handleExportAll = () => {
    const exportableAgents = agents.filter(agent => !agent.isDefault);
    if (exportableAgents.length === 0) {
      alert('No agents to export');
      return;
    }
    exportAgents(exportableAgents);
  };

  // ADD THEME TOGGLE HANDLER
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const helperAgent = agents.find(agent => agent.isDefault);

  // Show mobile blocker on small screens
  if (isMobile) {
    return <MobileBlocker />;
  }

  // Show landing page if not configured
  if (showLanding && !isLoading) {
    return (
      <>
        <LandingPage onGetStarted={handleGetStarted} />
        {showOnboarding && (
          <OnboardingModal
            onComplete={handleOnboardingComplete}
            onClose={() => setShowOnboarding(false)}
          />
        )}
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Initializing AgentForge...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <img src={logo} className="app-logo" alt="AgentForge Logo" />
          <h1>AgentForge</h1>
        </div>
        <div className="header-right">
          

          {/* USER MENU */}
          <div className="user-menu-wrapper">
            <button 
              className="user-info-button"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <span className="user-avatar">👤</span>
              <span className="user-name">{userConfig?.name}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            
            {showUserMenu && (
              <div className="user-menu-dropdown">
                <div className="user-menu-header">
                  <strong>{userConfig?.name}</strong>
                  <span>{userConfig?.email}</span>
                </div>
                <div className="user-menu-divider"></div>
                
                <button 
                  className="user-menu-item"
                  onClick={() => {
                    setShowUserMenu(false);
                    setShowImportModal(true);
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  Import Agents
                </button>

                <button 
                  className="user-menu-item"
                  onClick={() => {
                    setShowUserMenu(false);
                    handleExportAll();
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Export All Agents
                </button>

                <div className="user-menu-divider"></div>

                <button 
                  className="user-menu-item"
                  onClick={() => {
                    setShowUserMenu(false);
                    setShowSettings(true);
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M12 1v6m0 6v6m5.2-13.2l-1.5 1.5m-7.4 7.4l-1.5 1.5m13.2-.3l-1.5-1.5m-7.4-7.4l-1.5-1.5"></path>
                  </svg>
                  Settings
                </button>

                <button 
                  className="user-menu-item danger"
                  onClick={() => {
                    setShowUserMenu(false);
                    handleLogout();
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
          
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
            Build New Agent
          </button>

          {/* THEME TOGGLE BUTTON */}
          {/* <button 
            onClick={toggleTheme}
            className="theme-toggle"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button> */}
        </div>
      </header>

      {helperAgent && !isChatBotOpen && (
        <div className="helper-banner">
          <div className="helper-icon">💡</div>
          <div className="helper-content">
            <h3>Need help building agents?</h3>
            <p>Click the chat icon in the bottom right to talk with the <strong>AgentForge Assistant</strong>!</p>
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
        agentName={'AgentForge Assistant'}
        onImportAgent={async (agent) => {
          await saveAgent(agent);
          await loadAgents();
        }}
      />

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          currentConfig={userConfig}
          onSave={setUserConfig}
        />
      )}

      {showImportModal && (
        <ImportAgentsModal
          onClose={() => setShowImportModal(false)}
          onImport={handleImportAgents}
          existingAgents={agents}
        />
      )}

      
    </div>
  );
}

export default App;
