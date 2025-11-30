// src/App.jsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAppStore } from './store/appStore';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import MobileBlocker from './components/MobileBlocker';
import NotificationModal from './components/NotificationModal';
import { useNotification } from './hooks/useNotification';
import {
  initDB,
  saveAgent,
  updateAgent,
  getAllAgents,
  deleteAgent,
  getWorkflowsUsingAgent,
} from './services/indexedDB';
import { executeAgent } from './services/llmService';
import { exportAgents } from './services/exportImportService';
import { DEFAULT_AGENTS } from './constants/defaultAgents';
import './App.css';
import ExecutionHistory from './components/ExecutionHistory';

function App() {
  const navigate = useNavigate();
  const {
    notification,
    closeNotification,
    showAlert,
    showConfirm,
    showWarning,
    showError,
  } = useNotification();
  
  const {
    agents,
    setAgents,
    userConfig,
    setUserConfig,
    isLoading,
    setIsLoading,
    isMobile,
    setIsMobile,
    editingAgent,
    setEditingAgent,
    showFormModal,
    setShowFormModal,
    runningAgent,
    setRunningAgent,
    isChatBotOpen,
    setIsChatBotOpen,
    showSettings,
    setShowSettings,
    showImportModal,
    setShowImportModal,
    showOnboarding,
    setShowOnboarding,
    showUserMenu,
    setShowUserMenu,
    theme,
  } = useAppStore();

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile]);

  // Initialize app and check user config
  useEffect(() => {
    checkUserConfig();
  }, []);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
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
  }, [showUserMenu, setShowUserMenu]);

  const checkUserConfig = async () => {
    const savedConfig = localStorage.getItem('userConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setUserConfig(config);
      await initializeApp();
      navigate('/dashboard');
    } else {
      setIsLoading(false);
      navigate('/');
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

    const latestDefaultAgent = DEFAULT_AGENTS[0];

    if (existingDefaultAgent) {
      console.log('🔄 Updating default agent with latest configuration...');
      await updateAgent({
        ...latestDefaultAgent,
        id: existingDefaultAgent.id,
        isDefault: true,
      });
      console.log('✅ Default agent updated!');
    } else if (existingAgents.length === 0) {
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

  const handleOnboardingComplete = async (config) => {
    setUserConfig(config);
    localStorage.setItem('userConfig', JSON.stringify(config));
    setShowOnboarding(false);
    setIsLoading(true);
    await initializeApp();
    navigate('/dashboard');
  };

  const handleLogout = async () => {
    const confirmed = await showConfirm(
      'Are you sure you want to logout? This will clear your configuration.',
      'Logout',
      { type: 'warning', confirmText: 'Logout', cancelText: 'Cancel' }
    );
    
    if (confirmed) {
      localStorage.removeItem('userConfig');
      setUserConfig(null);
      setAgents([]);
      navigate('/');
    }
  };

  const handleSaveAgent = async (agentData) => {
    try {
      console.log('Saving agent:', agentData);
      if (editingAgent) {
        await updateAgent({ ...agentData, id: editingAgent.id });
        console.log('Agent updated successfully');
      } else {
        const result = await saveAgent(agentData);
        console.log('Agent created successfully:', result);
      }
      await loadAgents();
      setShowFormModal(false);
      setEditingAgent(null);
    } catch (error) {
      console.error('Error in handleSaveAgent:', error);
      throw error;
    }
  };

  const handleEditAgent = (agent) => {
    if (agent.isDefault) {
      showWarning(
        'Default agents cannot be edited. You can use the chatbot to get help building new agents.',
        'Cannot Edit Default Agent'
      );
      return;
    }
    setEditingAgent(agent);
    setShowFormModal(true);
  };

  const handleDeleteAgent = async (id, isDefault) => {
    if (isDefault) {
      await showWarning('Default agents cannot be deleted.', 'Cannot Delete Default Agent');
      return;
    }

    // Check if agent is used in any workflows
    const workflowsUsingAgent = await getWorkflowsUsingAgent(id);
    
    if (workflowsUsingAgent.length > 0) {
      const workflowNames = workflowsUsingAgent.map(w => w.name).join(', ');
      await showError(
        `This agent is used in the following workflow(s):\n${workflowNames}\n\nPlease delete or update the workflow(s) first before deleting this agent.`,
        'Cannot Delete Agent'
      );
      return;
    }

    const confirmed = await showConfirm(
      'Are you sure you want to delete this agent? This action cannot be undone.',
      'Delete Agent',
      { type: 'warning', confirmText: 'Delete', cancelText: 'Cancel' }
    );
    
    if (confirmed) {
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

  const handleRunAgent = async (agent, input, customParams) => {
    return await executeAgent(agent, input, customParams);
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
      showWarning('No custom agents available to export.', 'No Agents to Export');
      return;
    }
    exportAgents(exportableAgents);
  };

  // Show mobile blocker on small screens
  if (isMobile) {
    return <MobileBlocker />;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="app">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Initializing GenAgentX...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        onConfirm={notification.onConfirm}
        title={notification.title}
        message={notification.message}
        type={notification.type}
        confirmText={notification.confirmText}
        cancelText={notification.cancelText}
        showCancel={notification.showCancel}
      />
      
      <Routes>
        <Route
          path="/"
          element={
            userConfig ? <Navigate to="/dashboard" replace /> : <Landing />
          }
        />
        <Route
          path="/dashboard"
          element={
            userConfig ? (
              <Dashboard
                onSaveAgent={handleSaveAgent}
                onEditAgent={handleEditAgent}
                onDeleteAgent={handleDeleteAgent}
                onChatBotMessage={handleChatBotMessage}
                onRunAgent={handleRunAgent}
                onImportAgents={handleImportAgents}
                onExportAll={handleExportAll}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="/history" element={<ExecutionHistory />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </>
  );
}

export default App;
