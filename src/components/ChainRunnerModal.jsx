import React, { useState } from 'react';
import { executeChain } from '../services/chainExecutor';

const ChainRunnerModal = ({ chain, agents, onRunAgent, onClose }) => {
  const [input, setInput] = useState('');
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);

  const handleRun = async () => {
    setRunning(true);
    setResults(null);
    try {
      const chainResults = await executeChain(chain, agents, input, onRunAgent);
      setResults(chainResults);
    } catch (error) {
      console.error('Chain execution failed:', error);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content chain-runner" onClick={(e) => e.stopPropagation()}>
        <h2>Run Chain: {chain.name}</h2>
        
        <div className="form-group">
          <label>Initial Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter input for the first agent..."
            rows="4"
          />
        </div>

        <button className="btn-primary" onClick={handleRun} disabled={running || !input}>
          {running ? 'Running Chain...' : 'Run Chain'}
        </button>

        {results && (
          <div className="chain-results">
            <h3>Chain Execution Results</h3>
            {results.results.map((result, idx) => (
              <div key={idx} className="chain-step-result">
                <h4>Step {idx + 1}: {result.agentName}</h4>
                <div><strong>Input:</strong> {result.input.slice(0, 100)}...</div>
                <div><strong>Output:</strong> {result.output?.slice(0, 100)}...</div>
                <div><strong>Status:</strong> {result.status}</div>
              </div>
            ))}
            <div className="final-output">
              <h4>Final Output:</h4>
              <pre>{results.finalOutput}</pre>
            </div>
          </div>
        )}

        <button className="btn-secondary" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ChainRunnerModal;
