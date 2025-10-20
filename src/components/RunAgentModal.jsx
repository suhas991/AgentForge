// src/components/RunAgentModal.jsx
import React, { useState } from 'react';
import CopyButton from './CopyButton';

const RunAgentModal = ({ agent, onRun, onClose }) => {
  const [input, setInput] = useState('');
  const [customParamValues, setCustomParamValues] = useState({});
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const defaults = {};
    agent.customParameters?.forEach(param => {
      defaults[param.key] = param.value;
    });
    setCustomParamValues(defaults);
  }, [agent]);

  const handleParamChange = (key, value) => {
    setCustomParamValues(prev => ({ ...prev, [key]: value }));
  };

  const handleRun = async () => {
    setLoading(true);
    setOutput('');
    try {
      const result = await onRun(agent, input, customParamValues);
      setOutput(result);
    } catch (error) {
      const errorMsg = error.message.includes('VITE_GEMINI_API_KEY')
        ? 'API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.'
        : `Error: ${error.message}`;
      setOutput(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const renderParameterInput = (param) => {
    if (param.type === 'select') {
      const options = param.options?.split(',').map(opt => opt.trim()) || [];
      return (
        <select
          value={customParamValues[param.key] || ''}
          onChange={(e) => handleParamChange(param.key, e.target.value)}
          className="custom-param-input"
        >
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={param.type === 'number' ? 'number' : 'text'}
        value={customParamValues[param.key] || ''}
        onChange={(e) => handleParamChange(param.key, e.target.value)}
        placeholder={param.value}
        step={param.type === 'number' ? '0.1' : undefined}
        className="custom-param-input"
      />
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modern" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{agent.name}</h2>
            <p className="modal-subtitle">
              <span className="subtitle-role">{agent.role}</span>
              <span className="subtitle-divider">•</span>
              <span>{agent.goal}</span>
            </p>
          </div>
          <button onClick={onClose} className="close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="info-badge">
            <span className="badge">{agent.model}</span>
          </div>

          {agent.customParameters && agent.customParameters.length > 0 && (
            <div className="custom-params-runtime">
              <h3>Parameters</h3>
              <div className="params-grid">
                {agent.customParameters.map((param) => (
                  <div key={param.key} className="param-field">
                    <label>{param.key}</label>
                    {renderParameterInput(param)}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Input</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your input for the agent..."
              rows="4"
              className="input-textarea"
            />
          </div>

          <button 
            onClick={handleRun} 
            disabled={!input || loading}
            className="btn-run-primary"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span>Run Agent</span>
              </>
            )}
          </button>

          {output && (
            <div className="output-section">
              <div className="output-header">
                <h3>Output</h3>
                <CopyButton text={output} />
              </div>
              <pre className="output-content">{output}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RunAgentModal;
