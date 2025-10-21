// src/components/MobileBlocker.jsx
import "./MobileBlocker.css"
const MobileBlocker = () => {
  return (
    <div className="mobile-blocker">
      <div className="mobile-blocker-content">
        <div className="blocker-icon">🖥️</div>
        <h1>Desktop Only</h1>
        <p>AgentForge is optimized for desktop and laptop devices.</p>
        <p className="blocker-subtext">
          Please open this application on a desktop or laptop computer with a minimum screen width of 1024px for the best experience.
        </p>
        {/* <div className="blocker-features">
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <span>Advanced Agent Builder Interface</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <span>Real-time AI Agent Testing</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <span>Complex Parameter Management</span>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default MobileBlocker;
