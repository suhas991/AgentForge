import React, { useState, useEffect } from 'react';
import { getAllWorkflows, deleteWorkflow } from '../services/indexedDB';
import WorkflowCard from './WorkflowCard';
import './WorkflowsView.css';

const WorkflowsView = ({ agents, onBuildWorkflow, onEditWorkflow, onRunWorkflow }) => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningWorkflowId, setRunningWorkflowId] = useState(null);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      const data = await getAllWorkflows();
      // Ensure data is an array
      setWorkflows(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load workflows:', error);
      setWorkflows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this workflow?')) {
      await deleteWorkflow(id);
      loadWorkflows();
    }
  };

  const handleEdit = (workflow) => {
    if (onEditWorkflow) {
      onEditWorkflow(workflow);
    }
  };

  const handleRunWorkflow = (workflow) => {
    setRunningWorkflowId(workflow.id);
    onRunWorkflow(workflow);
    // Reset after a delay to account for modal opening
    setTimeout(() => {
      setRunningWorkflowId(null);
    }, 500);
  };

  if (loading) {
    return (
      <div className="workflows-view">
        <div className="loading-state">Loading workflows...</div>
      </div>
    );
  }

  return (
    <div className="workflows-view">
      {workflows.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⚡</div>
          <h3>No Workflows Yet</h3>
          <p>Create your first agent workflow to automate complex tasks</p>
          <button className="btn-primary" onClick={onBuildWorkflow}>
            Build Your First Workflow
          </button>
        </div>
      ) : (
        <div className="workflows-grid">
          {workflows.map(workflow => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              agents={agents}
              isRunning={runningWorkflowId === workflow.id}
              onRun={() => handleRunWorkflow(workflow)}
              onEdit={handleEdit}
              onDelete={() => handleDelete(workflow.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkflowsView;
