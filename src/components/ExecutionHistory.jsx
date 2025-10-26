import React, { useEffect, useState } from 'react';
import { getAllExecutionLogs } from '../services/indexedDB';
import "./ExecutionHistory.css";

const ExecutionHistory = ({ onBack }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    getAllExecutionLogs().then(setLogs);
  }, []);

  if (!logs.length) return (
    <div className="history-page">
      <button className="back-button" onClick={onBack}>
        ← Back to Agents
      </button>
      <div className="no-data">No executions found yet.</div>
    </div>
  );

  return (
    <div className="history-page">
      <button className="back-button" onClick={onBack}>
        ← Back to Agents
      </button>
      <h2>Execution History</h2>
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
          {[...logs].reverse().map(log => (
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
                  <pre className="input-pre">
                    {log.input 
                      ? (typeof log.input === 'string' ? log.input : JSON.stringify(log.input, null, 2))
                      : 'No input'
                    }
                  </pre>
                </details>
              </td>
              <td>
                <details>
                  <summary>Show Output</summary>
                  <pre className="output-pre">
                    {log.output 
                      ? (typeof log.output === 'string' ? log.output : JSON.stringify(log.output, null, 2))
                      : 'No output'
                    }
                  </pre>
                </details>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExecutionHistory;
