import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingPage from '../components/LandingPage';
import OnboardingModal from '../components/OnboardingModal';
import { useAppStore } from '../store/appStore';

const LandingPageContainer = () => {
  const navigate = useNavigate();
  const { showOnboarding, setShowOnboarding, setUserConfig } = useAppStore();

  const handleGetStarted = () => {
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = (config) => {
    setUserConfig(config);
    localStorage.setItem('userConfig', JSON.stringify(config));
    setShowOnboarding(false);
    navigate('/dashboard');
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
