import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingPage from '../components/LandingPage';
import OnboardingModal from '../components/OnboardingModal';
import { useAppStore } from '../store/appStore';
import {
  initDB,
  saveAgent,
  updateAgent,
  getAllAgents,
} from '../services/indexedDB';
import { DEFAULT_AGENTS } from '../constants/defaultAgents';

const LandingPageContainer = () => {
  const navigate = useNavigate();
  const { showOnboarding, setShowOnboarding, setUserConfig, setAgents, setIsLoading } = useAppStore();

  const handleGetStarted = () => {
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = async (config) => {
    try {
      setIsLoading(true);
      setUserConfig(config);
      localStorage.setItem('userConfig', JSON.stringify(config));
      setShowOnboarding(false);

      // Initialize database and load agents
      await initDB();
      
      // Seed default agents
      const existingAgents = await getAllAgents();
      const existingDefaultAgent = existingAgents.find(agent => agent.isDefault);

      if (!existingDefaultAgent && existingAgents.length === 0) {
        for (const defaultAgent of DEFAULT_AGENTS) {
          await saveAgent(defaultAgent);
        }
      }

      // Load and set agents
      const allAgents = await getAllAgents();
      const sortedAgents = allAgents.sort((a, b) => {
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;
        return 0;
      });
      setAgents(sortedAgents);

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Onboarding completion error:', error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

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
};

export default LandingPageContainer;
