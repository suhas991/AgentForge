import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { getAllExecutionLogs, getAllWorkflowExecutionLogs } from '../services/indexedDB';
import "./ExecutionHistory.css";

const ExecutionHistory = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('agents'); // 'agents' or 'workflows'
  const [agentLogs, setAgentLogs] = useState([]);
  const [workflowLogs, setWorkflowLogs] = useState([]);

  useEffect(() => {
    getAllExecutionLogs().then(setAgentLogs);
    getAllWorkflowExecutionLogs().then(setWorkflowLogs);
  }, []);

  const renderMarkdown = (content) => {
    if (!content) return 'No content';
    
    return (
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
        {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
      </ReactMarkdown>
    );
  };

  return (
    <div className="history-page">
      <div className="history-tabs">
        <button 
          className={`tab ${activeTab === 'agents' ? 'active' : ''}`}
          onClick={() => setActiveTab('agents')}
        >
          Agent Executions ({agentLogs.length})
        </button>
        <button 
          className={`tab ${activeTab === 'workflows' ? 'active' : ''}`}
          onClick={() => setActiveTab('workflows')}
        >
          Workflow Executions ({workflowLogs.length})
        </button>
      </div>

      {activeTab === 'agents' ? (
        <table>
          <thead>
            <tr>
              <th>Agent</th>
              <th>Model</th>
              <th>Time</th>
              <th>Status</th>
              <th>Input</th>
              <th>Output</th>
            </tr>
          </thead>
          <tbody>
            {[...agentLogs].reverse().map(log => (
              <tr key={log.id}>
                <td>{log.agentName}</td>
                <td>{log.model}</td>
                <td>{new Date(log.runAt).toLocaleString()}</td>
                <td className={log.status === "success" ? "status-success" : "status-error"}>
                  {log.status}
                </td>
                <td>
                  <details>
                    <summary>Show Input</summary>
                    <div className="markdown-content">
                      {renderMarkdown(log.input)}
                    </div>
                  </details>
                </td>
                <td>
                  <details>
                    <summary>Show Output</summary>
                    <div className="markdown-content">
                      {renderMarkdown(log.output)}
                    </div>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Workflow</th>
              <th>Time</th>
              <th>Status</th>
              <th>Steps</th>
              <th>Input</th>
              <th>Output</th>
            </tr>
          </thead>
          <tbody>
            {[...workflowLogs].reverse().map(log => (
              <tr key={log.id}>
                <td>{log.workflowName}</td>
                <td>{new Date(log.runAt).toLocaleString()}</td>
                <td className={log.status === "success" ? "status-success" : "status-error"}>
                  {log.status}
                </td>
                <td>
                  <details>
                    <summary>View Steps ({log.stepResults?.length || 0})</summary>
                    <div className="workflow-steps">
                      {log.stepResults?.map((step, idx) => (
                        <div key={idx} className="step-detail">
                          <strong>Step {step.step}: {step.agentName}</strong>
                          <span className={step.status === "success" ? "status-success" : "status-error"}>
                            {step.status}
                          </span>
                          {step.error && <div className="error-text">Error: {step.error}</div>}
                        </div>
                      ))}
                    </div>
                  </details>
                </td>
                <td>
                  <details>
                    <summary>Show Input</summary>
                    <div className="markdown-content">
                      {renderMarkdown(log.input)}
                    </div>
                  </details>
                </td>
                <td>
                  <details>
                    <summary>Show Output</summary>
                    <div className="markdown-content">
                      {renderMarkdown(log.output)}
                    </div>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExecutionHistory;
