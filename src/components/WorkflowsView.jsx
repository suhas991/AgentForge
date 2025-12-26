import React, { useState, useEffect } from 'react';
import { getAllWorkflows, deleteWorkflow } from '../services/indexedDB';
import WorkflowCard from './WorkflowCard';
import NotificationModal from './NotificationModal';
import { useNotification } from '../hooks/useNotification';
import './WorkflowsView.css';

const WorkflowsView = ({ agents, onBuildWorkflow, onEditWorkflow, onRunWorkflow }) => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningWorkflowId, setRunningWorkflowId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'date'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
  
  const {
    notification,
    closeNotification,
    showConfirm,
  } = useNotification();

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
    const confirmed = await showConfirm(
      'Are you sure you want to delete this workflow? This action cannot be undone.',
      'Delete Workflow',
      { type: 'warning', confirmText: 'Delete', cancelText: 'Cancel' }
    );
    
    if (confirmed) {
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

  // Filter and sort workflows
  const getFilteredAndSortedWorkflows = () => {
    let filtered = [...workflows];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(workflow =>
        workflow.name.toLowerCase().includes(query) ||
        (workflow.description && workflow.description.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'date') {
        comparison = new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  };

  if (loading) {
    return (
      <div className="workflows-view">
        <div className="loading-state">Loading workflows...</div>
      </div>
    );
  }

  return (
    <>
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        onConfirm={notification.onConfirm}
        title={notification.title}
        message={notification.message}
        type={notification.type}
        confirmText={notification.confirmText}
        cancelText={notification.cancelText}
        showCancel={notification.showCancel}
      />
      
      {workflows.length > 0 && (
        <div className="search-sort-controls">
          <div className="search-box-container">
            <input
              type="text"
              className="search-box"
              placeholder="Search workflows by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>
                ✕
              </button>
            )}
          </div>
          
          <div className="sort-controls">
            <select
              className="sort-dropdown"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date</option>
            </select>
            
            <button
              className="sort-order-btn"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      )}
      
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
          <>
            {getFilteredAndSortedWorkflows().length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No results found</h3>
                <p>Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="workflows-grid">
                {getFilteredAndSortedWorkflows().map(workflow => (
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
          </>
        )}
      </div>
    </>
  );
};

export default WorkflowsView;
