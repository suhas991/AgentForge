// src/components/OnboardingModal.jsx
import React, { useState } from 'react';
import './OnboardingModal.css';

const OnboardingModal = ({ onComplete, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    apiKey: ''
  });
  const [errors, setErrors] = useState({});

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
    }

    if (step === 2) {
      if (!formData.apiKey.trim()) {
        newErrors.apiKey = 'API Key is required';
      } else if (formData.apiKey.length < 20) {
        newErrors.apiKey = 'Invalid API Key format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step === 2) {
        // Save to localStorage
        localStorage.setItem('userConfig', JSON.stringify(formData));
        onComplete(formData);
      } else {
        setStep(step + 1);
      }
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        <button className="onboarding-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="onboarding-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <div className="progress-circle">1</div>
            <span>Your Info</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <div className="progress-circle">2</div>
            <span>API Setup</span>
          </div>
        </div>

        {step === 1 && (
          <div className="onboarding-step">
            <h2>Welcome! Let's Get Started</h2>
            <p>Tell us a bit about yourself</p>

            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <button className="btn-onboarding-primary" onClick={handleNext}>
              Continue
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-step">
            <h2>Configure Your API Key</h2>
            <p>Enter your Google Gemini API key to get started</p>

            <div className="info-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div>
                <strong>Don't have an API key?</strong>
                <p>Get your free API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a></p>
              </div>
            </div>

            <div className="form-group">
              <label>Gemini API Key *</label>
              <input
                type="password"
                placeholder="AIza..."
                value={formData.apiKey}
                onChange={(e) => handleChange('apiKey', e.target.value)}
                className={errors.apiKey ? 'error' : ''}
              />
              {errors.apiKey && <span className="error-message">{errors.apiKey}</span>}
            </div>

            <div className="security-note">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span>Your API key is stored securely in your browser and never sent to our servers</span>
            </div>

            <div className="onboarding-actions">
              <button className="btn-onboarding-secondary" onClick={() => setStep(1)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back
              </button>
              <button className="btn-onboarding-primary" onClick={handleNext}>
                Start Building
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 11 12 14 22 4"></polyline>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingModal;
