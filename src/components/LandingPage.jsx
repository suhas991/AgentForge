// src/components/LandingPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { 
  FaRocket, FaBolt, FaCog, FaComments, FaChartLine, FaSave,
  FaNetworkWired, FaMarkdown, FaHistory, FaFileExport, FaPalette,
  FaLock, FaRobot, FaCogs, FaChartBar, FaUsers,
  FaHandshake, FaPen, FaCode, FaGraduationCap, FaChartPie,
  FaHeadset, FaTheaterMasks, FaPlay, FaCheckCircle, FaArrowRight,
  FaShieldAlt, FaStar
} from 'react-icons/fa';
import './LandingPage.css';
import logo from '/vite.png';

const LandingPage = ({ onGetStarted }) => {
  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -60 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.7, ease: "easeOut" }
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 60 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.7, ease: "easeOut" }
  };

  const fadeInScale = {
    initial: { opacity: 0, scale: 0.8 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.1
      }
    },
    viewport: { once: true, margin: "-100px" }
  };

  const staggerItem = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const scaleIn = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <motion.nav 
          className="landing-nav"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="nav-logo"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img src={logo} alt="GenAgentX" />
            <span>GenAgentX</span>
          </motion.div>
          <motion.button 
            className="nav-cta" 
            onClick={onGetStarted}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(99, 102, 241, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            Try It Free
          </motion.button>
        </motion.nav>

        <div className="hero-content">
          <motion.div 
            className="hero-badge"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <FaStar className="badge-icon" />
            <span>Powered by Google Gemini AI</span>
          </motion.div>
          
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Build Intelligent AI Agents
            <br />
            <span className="gradient-text">Without Writing Code</span>
          </motion.h1>
          
          <motion.p 
            className="hero-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Create, customize, and deploy powerful AI agents in minutes. 
            Define roles, goals, and tasks with an intuitive visual interface.
          </motion.p>
          
          <motion.div 
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <motion.button 
              className="btn-hero-primary" 
              onClick={onGetStarted}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlay />
              Get Started Free
            </motion.button>
            <motion.button 
              className="btn-hero-secondary"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlay />
              Watch Demo
            </motion.button>
          </motion.div>
          
          <motion.div 
            className="hero-stats"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {[
              { number: '5+', label: 'AI Models' },
              { number: '∞', label: 'Possibilities' },
              { number: '0', label: 'Code Required' }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="stat-item"
                variants={fadeInUp}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Why Choose GenAgentX?</h2>
          <p>Everything you need to create and manage AI agents</p>
        </motion.div>

        <div className="features-carousel-container">
          <Slider
            dots={true}
            infinite={true}
            speed={500}
            slidesToShow={3}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={3000}
            pauseOnHover={true}
            arrows={true}
            responsive={[
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1,
                }
              },
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  arrows: false
                }
              }
            ]}
          >
            {[
              { icon: <FaRocket />, title: 'Define Clear Roles', desc: 'Set specific roles and responsibilities for your AI agents to ensure focused and accurate outputs.' },
              { icon: <FaBolt />, title: 'Lightning Fast', desc: 'Create and deploy AI agents in minutes, not hours. Get instant results with powerful Gemini models.' },
              { icon: <FaCog />, title: 'Custom Parameters', desc: 'Fine-tune behavior with custom parameters like tone, style, temperature, and more.' },
              { icon: <FaComments />, title: 'AI Assistant Helper', desc: 'Built-in chatbot helps you design better agents by suggesting roles, goals, and parameters.' },
              { icon: <FaChartLine />, title: 'Multiple Models', desc: 'Choose from Gemini Flash, Pro, and Lite models based on your performance needs.' },
              { icon: <FaSave />, title: 'Local Storage', desc: 'All your agents are stored securely in your browser. No server required, complete privacy.' },
              { icon: <FaNetworkWired />, title: 'Workflow Builder', desc: 'Chain multiple agents together to create complex workflows with sequential processing.' },
              { icon: <FaMarkdown />, title: 'Markdown Support', desc: 'All outputs are beautifully rendered with markdown support, code highlighting, and formatting.' },
              { icon: <FaHistory />, title: 'Execution History', desc: 'Track all agent and workflow executions with detailed logs, inputs, and outputs.' },
              { icon: <FaFileExport />, title: 'Import & Export', desc: 'Share agents with your team or community. Export and import agent configurations easily.' },
              { icon: <FaPalette />, title: 'Visual Flow Diagram', desc: 'See your workflow execution in real-time with animated progress indicators and status updates.' },
              { icon: <FaLock />, title: 'Privacy First', desc: 'Your data never leaves your browser. All processing happens locally with your own API key.' }
            ].map((feature, index) => (
              <div key={index} className="carousel-slide">
                <motion.div 
                  className="feature-carousel-card"
                  whileHover={{ 
                    y: -8,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                >
                  <motion.div 
                    className="feature-icon-modern"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </motion.div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Detailed Features Section */}
      <section className="detailed-features-section">
        <motion.div 
          className="section-header"
          {...fadeInScale}
        >
          <h2>Everything You Need in One Platform</h2>
          <p>Powerful features designed for productivity</p>
        </motion.div>

        <motion.div 
          className="detailed-features-compact"
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Agent Management */}
          <motion.div className="feature-detail-card" variants={staggerItem}>
            <div className="feature-detail-header">
              <div className="feature-detail-icon"><FaRobot /></div>
              <h3>Agent Management</h3>
            </div>
            <div className="feature-detail-body">
              <p className="feature-description">
                Create custom AI agents with unique roles, goals, and tasks. Control output formats and fine-tune behavior with custom parameters. Choose from 5+ Gemini models for optimal performance.
              </p>
            </div>
          </motion.div>

          {/* Workflow System */}
          <motion.div className="feature-detail-card" variants={staggerItem}>
            <div className="feature-detail-header">
              <div className="feature-detail-icon"><FaCogs /></div>
              <h3>Workflow Builder</h3>
            </div>
            <div className="feature-detail-body">
              <p className="feature-description">
                Chain multiple agents together with visual drag-and-drop interface. Watch real-time execution progress and view detailed results for each step in your workflow.
              </p>
            </div>
          </motion.div>

          {/* Execution & History */}
          <motion.div className="feature-detail-card" variants={staggerItem}>
            <div className="feature-detail-header">
              <div className="feature-detail-icon"><FaChartBar /></div>
              <h3>Smart History</h3>
            </div>
            <div className="feature-detail-body">
              <p className="feature-description">
                Track all executions with rich markdown rendering and syntax highlighting. Collapsible details keep your workspace clean while one-click copy lets you use outputs instantly.
              </p>
            </div>
          </motion.div>

          {/* Collaboration */}
          <motion.div className="feature-detail-card" variants={staggerItem}>
            <div className="feature-detail-header">
              <div className="feature-detail-icon"><FaUsers /></div>
              <h3>Share & Collaborate</h3>
            </div>
            <div className="feature-detail-body">
              <p className="feature-description">
                Export and import agents and workflows as JSON. Share configurations with your team or community. Start with template library and customize to your needs.
              </p>
            </div>
          </motion.div>

          {/* AI Assistant */}
          <motion.div className="feature-detail-card" variants={staggerItem}>
            <div className="feature-detail-header">
              <div className="feature-detail-icon"><FaHandshake /></div>
              <h3>AI Helper</h3>
            </div>
            <div className="feature-detail-body">
              <p className="feature-description">
                Built-in chatbot helps you design better agents with suggestions for roles, goals, and parameters. Get instant guidance and best practices as you build.
              </p>
            </div>
          </motion.div>

          {/* Privacy & Security */}
          <motion.div className="feature-detail-card" variants={staggerItem}>
            <div className="feature-detail-header">
              <div className="feature-detail-icon"><FaShieldAlt /></div>
              <h3>Privacy First</h3>
            </div>
            <div className="feature-detail-body">
              <p className="feature-description">
                All data stored locally in your browser using IndexedDB. Your API key never leaves your device. No servers, no tracking, complete control over your data.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Use Cases Section */}
      <section className="use-cases-section">
        <motion.div 
          className="section-header"
          {...fadeInScale}
        >
          <h2>Perfect For Every Use Case</h2>
          <p>From content creation to code review, GenAgentX has you covered</p>
        </motion.div>

        <motion.div 
          className="use-cases-grid"
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-100px" }}
        >
          {[
            { icon: <FaPen />, title: 'Content Creation', desc: 'Blog posts, social media content, email campaigns, product descriptions, and marketing copy', example: 'Social Media Content Wizard → SEO Optimizer → Hashtag Generator' },
            { icon: <FaCode />, title: 'Development', desc: 'Code review, documentation generation, bug fixing, unit test creation, and API design', example: 'Code Analyzer → Documentation Writer → Test Case Generator' },
            { icon: <FaGraduationCap />, title: 'Education', desc: 'Study guides, quiz generation, explanation of concepts, tutoring assistance, and learning paths', example: 'Topic Explainer → Quiz Creator → Study Plan Generator' },
            { icon: <FaChartPie />, title: 'Business Analysis', desc: 'Market research, competitor analysis, SWOT reports, data insights, and strategy recommendations', example: 'Data Analyzer → Insight Generator → Report Writer' },
            { icon: <FaHeadset />, title: 'Customer Support', desc: 'FAQ responses, ticket categorization, response templates, escalation handling, and sentiment analysis', example: 'Ticket Analyzer → Response Generator → Quality Checker' },
            { icon: <FaTheaterMasks />, title: 'Creative Work', desc: 'Story writing, character development, world-building, plot generation, and creative brainstorming', example: 'Story Planner → Character Creator → Dialogue Writer' }
          ].map((useCase, index) => (
            <motion.div 
              key={index}
              className="use-case-card"
              variants={staggerItem}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <motion.div 
                className="use-case-icon-modern"
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                {useCase.icon}
              </motion.div>
              <h3>{useCase.title}</h3>
              <p>{useCase.desc}</p>
              <motion.div 
                className="use-case-example"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <strong>Example:</strong> {useCase.example}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>How It Works</h2>
          <p>Get started in four simple steps</p>
        </motion.div>

        <motion.div 
          className="steps-container"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div 
            className="step-card"
            variants={fadeInUp}
            whileHover={{ y: -10, scale: 1.03 }}
          >
            <motion.div 
              className="step-number"
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              1
            </motion.div>
            <div className="step-content">
              <h3>Sign Up & Configure</h3>
              <p>Enter your name, email, and Gemini API key. Get your free API key from Google AI Studio in seconds.</p>
              <div className="step-note">
                <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
                  Get Free API Key →
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="step-arrow"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            →
          </motion.div>

          <motion.div 
            className="step-card"
            variants={fadeInUp}
            whileHover={{ y: -10, scale: 1.03 }}
          >
            <motion.div 
              className="step-number"
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              2
            </motion.div>
            <div className="step-content">
              <h3>Create Your Agent</h3>
              <p>Define the agent's role, goal, tasks, and expected output. Use our AI assistant for guidance and best practices.</p>
              <div className="step-note">Choose from 5+ AI models</div>
            </div>
          </motion.div>

          <motion.div 
            className="step-arrow"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            →
          </motion.div>

          <motion.div 
            className="step-card"
            variants={fadeInUp}
            whileHover={{ y: -10, scale: 1.03 }}
          >
            <motion.div 
              className="step-number"
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              3
            </motion.div>
            <div className="step-content">
              <h3>Build Workflows</h3>
              <p>Chain multiple agents together to create powerful workflows. Watch them execute in real-time with visual feedback.</p>
              <div className="step-note">Unlimited workflow complexity</div>
            </div>
          </motion.div>

          <motion.div 
            className="step-arrow"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            →
          </motion.div>

          <motion.div 
            className="step-card"
            variants={fadeInUp}
            whileHover={{ y: -10, scale: 1.03 }}
          >
            <motion.div 
              className="step-number"
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              4
            </motion.div>
            <div className="step-content">
              <h3>Run & Iterate</h3>
              <p>Test your agents and workflows, review execution history, refine parameters, and achieve perfect results.</p>
              <div className="step-note">Full execution tracking</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div 
          className="cta-content"
          {...fadeInScale}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Ready to Build Your First AI Agent?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Join developers and teams building the future with AI agents
          </motion.p>
          <motion.button 
            className="btn-cta-large" 
            onClick={onGetStarted}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.4, duration: 0.6 }}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(0, 217, 255, 0.4)" }}
            whileTap={{ scale: 0.95 }}
          >
            <FaRocket style={{ marginRight: '10px' }} />
            Get Started Now - It's Free
          </motion.button>
          <motion.div 
            className="cta-note"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <FaShieldAlt />
            <span>Your API key is stored locally and never leaves your browser</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer 
        className="landing-footer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="footer-content">
          <motion.div 
            className="footer-logo"
            whileHover={{ scale: 1.05 }}
          >
            <img src={logo} alt="GenAgentX" />
            <span>GenAgentX</span>
          </motion.div>
          <p>© 2025 GenAgentX. Built with ❤️ and AI.</p>
        </div>
      </motion.footer>
    </div>
  );
};

export default LandingPage;
