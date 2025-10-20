// src/components/AgentForm.jsx
import React, { useState, useEffect } from 'react';
import CustomParametersField from './CustomParametersField';

const AgentForm = ({ agent, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    goal: '',
    model: 'gemini-2.0-flash',
    taskDescription: '',
    expectedOutput: '',
    customParameters: [],
  });

  const models = [
    {
      id: 'gemini-2.5-pro',
      name: 'Gemini 2.5 Pro',
      description: 'Most capable model'
    },
    {
      id: 'gemini-2.5-flash',
      name: 'Gemini 2.5 Flash',
      description: 'Fast and efficient'
    },
    {
      id: 'gemini-2.0-flash',
      name: 'Gemini 2.0 Flash',
      description: 'High throughput'
    },
    {
      id: 'gemini-2.5-flash-lite',
      name: 'Gemini 2.5 Flash Lite',
      description: 'Lightweight and fast'
    },
    {
      id: 'gemini-2.0-flash-lite',
      name: 'Gemini 2.0 Flash Lite',
      description: 'Ultra lightweight'
    }
  ];

  useEffect(() => {
    if (agent) {
      setFormData({
        ...agent,
        customParameters: agent.customParameters || []
      });
    }
  }, [agent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomParametersChange = (params) => {
    setFormData(prev => ({ ...prev, customParameters: params }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="agent-form">
      <div className="form-group">
        <label>Agent Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Content Generator, Code Assistant"
          required
        />
      </div>

      <div className="form-group">
        <label>Role</label>
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="e.g., Senior Data Analyst"
          required
        />
      </div>

      <div className="form-group">
        <label>Goal</label>
        <textarea
          name="goal"
          value={formData.goal}
          onChange={handleChange}
          placeholder="What should this agent achieve?"
          rows="3"
          required
        />
      </div>

      <div className="form-group">
        <label>Model</label>
        <select 
          name="model" 
          value={formData.model} 
          onChange={handleChange}
          className="model-select"
        >
          {models.map(model => (
            <option key={model.id} value={model.id}>
              {model.name} - {model.description}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Task Description</label>
        <textarea
          name="taskDescription"
          value={formData.taskDescription}
          onChange={handleChange}
          placeholder="Describe the task this agent will perform"
          rows="3"
          required
        />
      </div>

      <div className="form-group">
        <label>Expected Output</label>
        <textarea
          name="expectedOutput"
          value={formData.expectedOutput}
          onChange={handleChange}
          placeholder="What format/type of output do you expect?"
          rows="3"
          required
        />
      </div>

      <CustomParametersField
        parameters={formData.customParameters}
        onChange={handleCustomParametersChange}
      />

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          {agent ? 'Update Agent' : 'Create Agent'}
        </button>
      </div>
    </form>
  );
};

export default AgentForm;
