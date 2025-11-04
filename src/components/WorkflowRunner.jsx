import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { executeChain } from '../services/chainExecutor';
import { saveWorkflowExecutionLog } from '../services/indexedDB';
import CopyButton from './CopyButton';
import './WorkflowRunner.css';

const WorkflowRunner = ({ workflow, agents, onRunAgent, onClose }) => {
  const [input, setInput] = useState('');
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState([]);

  const handleRun = async () => {
    if (!input.trim()) return;
    
    setRunning(true);
    setResults(null);
    setError(null);
    setCurrentStep(-1);
    setCompletedSteps([]);
    
    try {
      // Execute chain with progress tracking
      const workflowAgents = workflow.agents.sort((a, b) => a.order - b.order);
      const stepResults = [];
      let currentInput = input;

      for (let i = 0; i < workflowAgents.length; i++) {
        const workflowAgent = workflowAgents[i];
        const agent = agents.find(a => a.id === workflowAgent.agentId);
        
        if (!agent) {
          throw new Error(`Agent not found: ${workflowAgent.agentId}`);
        }

        // Update current step
        setCurrentStep(i);
        
        try {
          const output = await onRunAgent(agent, currentInput, {});
          
          stepResults.push({
            step: i + 1,
            agentId: agent.id,
            agentName: agent.name,
            input: currentInput,
            output,
            status: 'success'
          });
          
          // Mark step as completed
          setCompletedSteps(prev => [...prev, i]);
          
          currentInput = output;
        } catch (error) {
          stepResults.push({
            step: i + 1,
            agentId: agent.id,
            agentName: agent.name,
            input: currentInput,
            output: null,
            error: error.message,
            status: 'error'
          });
          throw error;
        }
      }

      const executionResults = {
        workflowId: workflow.id,
        workflowName: workflow.name,
        results: stepResults,
        finalOutput: currentInput
      };
      
      setResults(executionResults);
      setCurrentStep(-1);
      
      // Save workflow execution log
      await saveWorkflowExecutionLog({
        workflowId: workflow.id,
        workflowName: workflow.name,
        input: input,
        output: currentInput,
        status: 'success',
        stepResults: stepResults,
        runAt: new Date().toISOString()
      });
    } catch (err) {
      setError(err.message);
      console.error('Workflow execution failed:', err);
      setCurrentStep(-1);
      
      // Save failed execution log
      await saveWorkflowExecutionLog({
        workflowId: workflow.id,
        workflowName: workflow.name,
        input: input,
        output: null,
        error: err.message,
        status: 'error',
        stepResults: results?.results || [],
        runAt: new Date().toISOString()
      });
    } finally {
      setRunning(false);
    }
  };

  // Get the agents in order for the workflow
  const workflowAgents = workflow.agents
    .sort((a, b) => a.order - b.order)
    .map(wAgent => agents.find(a => a.id === wAgent.agentId))
    .filter(Boolean);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content workflow-runner" onClick={(e) => e.stopPropagation()}>
        <h2>Execute: {workflow.name}</h2>
        
        {!results && (
          <>
            <div className="form-group">
              <label>Initial Input </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter input for the first agent in the chain..."
                rows="4"
                disabled={running}
              />
            </div>

            {/* Workflow Flow Diagram */}
            <div className="workflow-flow-diagram">
              <h3>Workflow Flow</h3>
              <div className="flow-container">
                {workflowAgents.map((agent, index) => {
                  const isCompleted = completedSteps.includes(index);
                  const isRunning = currentStep === index;
                  const isPending = !isCompleted && !isRunning;
                  
                  return (
                    <React.Fragment key={agent.id}>
                      <div className={`flow-agent-card ${isCompleted ? 'completed' : ''} ${isRunning ? 'running' : ''} ${isPending ? 'pending' : ''}`}>
                        <div className="flow-step-number">
                          {isCompleted ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          ) : isRunning ? (
                            <svg className="spinner-small" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"></circle>
                            </svg>
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div className="flow-agent-name">{agent.name}</div>
                        {isRunning && <div className="flow-status-badge">Running...</div>}
                        {isCompleted && <div className="flow-status-badge completed">Completed</div>}
                      </div>
                      {index < workflowAgents.length - 1 && (
                        <div className={`flow-arrow ${isCompleted ? 'completed' : ''}`}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            <button 
              className="btn-primary btn-run-workflow" 
              onClick={handleRun} 
              disabled={running || !input.trim()}
            >
              {running ? (
                <>
                  <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                  Running Workflow...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  Run Workflow
                </>
              )}
            </button>
          </>
        )}

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {results && (
          <div className="workflow-results">
            <h3>Execution Results</h3>
            
            {results.results.map((result, idx) => (
              <div key={idx} className={`result-step ${result.status}`}>
                <div className="result-header">
                  <span className="step-badge">Step {result.step}</span>
                  <span className="agent-name">{result.agentName}</span>
                  <span className={`status-badge ${result.status}`}>
                    {result.status === 'success' ? '✓' : '✗'}
                  </span>
                </div>
                
                <div className="result-content">
                  <details>
                    <summary>Input</summary>
                    <div className="markdown-content">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ node, ...props }) => <h1 className="md-h1" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="md-h2" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="md-h3" {...props} />,
                          p: ({ node, ...props }) => <p className="md-p" {...props} />,
                          ul: ({ node, ...props }) => <ul className="md-ul" {...props} />,
                          ol: ({ node, ...props }) => <ol className="md-ol" {...props} />,
                          li: ({ node, ...props }) => <li className="md-li" {...props} />,
                          code: ({ node, inline, className, children, ...props }) => {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                customStyle={{ margin: '8px 0', borderRadius: '8px', fontSize: '13px' }}
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code className="md-code-inline" {...props}>{children}</code>
                            );
                          },
                          strong: ({ node, ...props }) => <strong className="md-strong" {...props} />,
                          a: ({ node, ...props }) => <a className="md-link" target="_blank" rel="noopener noreferrer" {...props} />,
                        }}
                      >
                        {result.input}
                      </ReactMarkdown>
                    </div>
                  </details>
                  
                  {result.status === 'success' ? (
                    <details>
                      <summary>Output</summary>
                      <div className="markdown-content">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ node, ...props }) => <h1 className="md-h1" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="md-h2" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="md-h3" {...props} />,
                            p: ({ node, ...props }) => <p className="md-p" {...props} />,
                            ul: ({ node, ...props }) => <ul className="md-ul" {...props} />,
                            ol: ({ node, ...props }) => <ol className="md-ol" {...props} />,
                            li: ({ node, ...props }) => <li className="md-li" {...props} />,
                            code: ({ node, inline, className, children, ...props }) => {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline && match ? (
                                <SyntaxHighlighter
                                  style={vscDarkPlus}
                                  language={match[1]}
                                  PreTag="div"
                                  customStyle={{ margin: '8px 0', borderRadius: '8px', fontSize: '13px' }}
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code className="md-code-inline" {...props}>{children}</code>
                              );
                            },
                            strong: ({ node, ...props }) => <strong className="md-strong" {...props} />,
                            a: ({ node, ...props }) => <a className="md-link" target="_blank" rel="noopener noreferrer" {...props} />,
                          }}
                        >
                          {result.output}
                        </ReactMarkdown>
                      </div>
                    </details>
                  ) : (
                    <div className="error-detail">
                      <strong>Error:</strong> {result.error}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="final-result">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ margin: 0 }}>🎯 Final Output:</h4>
                <CopyButton text={results.finalOutput} />
              </div>
              <div className="markdown-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => <h1 className="md-h1" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="md-h2" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="md-h3" {...props} />,
                    p: ({ node, ...props }) => <p className="md-p" {...props} />,
                    ul: ({ node, ...props }) => <ul className="md-ul" {...props} />,
                    ol: ({ node, ...props }) => <ol className="md-ol" {...props} />,
                    li: ({ node, ...props }) => <li className="md-li" {...props} />,
                    code: ({ node, inline, className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{ margin: '8px 0', borderRadius: '8px', fontSize: '13px' }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="md-code-inline" {...props}>{children}</code>
                      );
                    },
                    strong: ({ node, ...props }) => <strong className="md-strong" {...props} />,
                    a: ({ node, ...props }) => <a className="md-link" target="_blank" rel="noopener noreferrer" {...props} />,
                  }}
                >
                  {results.finalOutput}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowRunner;
