// src/components/LandingPage.jsx
import React from 'react';
import './LandingPage.css';
import logo from '/vite.png';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <nav className="landing-nav">
          <div className="nav-logo">
            <img src={logo} alt="AgentForge" />
            <span>AgentForge</span>
          </div>
          <button className="nav-cta" onClick={onGetStarted}>
            Try It Free
          </button>
        </nav>

        <div className="hero-content">
          <div className="hero-badge">
            <span>✨ Powered by Google Gemini AI</span>
          </div>
          <h1 className="hero-title">
            Build Intelligent AI Agents
            <br />
            <span className="gradient-text">Without Writing Code</span>
          </h1>
          <p className="hero-description">
            Create, customize, and deploy powerful AI agents in minutes. 
            Define roles, goals, and tasks with an intuitive visual interface.
          </p>
          <div className="hero-buttons">
            <button className="btn-hero-primary" onClick={onGetStarted}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Get Started Free
            </button>
            <button className="btn-hero-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="10 8 16 12 10 16 10 8"></polygon>
              </svg>
              Watch Demo
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">5+</div>
              <div className="stat-label">AI Models</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">∞</div>
              <div className="stat-label">Possibilities</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">0</div>
              <div className="stat-label">Code Required</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose AgentForge?</h2>
          <p>Everything you need to create and manage AI agents</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Define Clear Roles</h3>
            <p>Set specific roles and responsibilities for your AI agents to ensure focused and accurate outputs.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Create and deploy AI agents in minutes, not hours. Get instant results with powerful Gemini models.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔧</div>
            <h3>Custom Parameters</h3>
            <p>Fine-tune behavior with custom parameters like tone, style, temperature, and more.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>AI Assistant Helper</h3>
            <p>Built-in chatbot helps you design better agents by suggesting roles, goals, and parameters.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Multiple Models</h3>
            <p>Choose from Gemini Flash, Pro, and Lite models based on your performance needs.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💾</div>
            <h3>Local Storage</h3>
            <p>All your agents are stored securely in your browser. No server required, complete privacy.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Get started in three simple steps</p>
        </div>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Sign Up & Configure</h3>
              <p>Enter your name, email, and Gemini API key. Get your free API key from Google AI Studio.</p>
            </div>
          </div>

          <div className="step-arrow">→</div>

          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Create Your Agent</h3>
              <p>Define the agent's role, goal, tasks, and expected output. Use our AI assistant for guidance.</p>
            </div>
          </div>

          <div className="step-arrow">→</div>

          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Run & Iterate</h3>
              <p>Test your agent with different inputs, refine parameters, and get instant results.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Build Your First AI Agent?</h2>
          <p>Join developers and teams building the future with AI agents</p>
          <button className="btn-cta-large" onClick={onGetStarted}>
            Get Started Now - It's Free
          </button>
          <div className="cta-note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span>Your API key is stored locally and never leaves your browser</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src={logo} alt="AgentForge" />
            <span>AgentForge</span>
          </div>
          <p>© 2025 AgentForge. Built with ❤️ and AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
