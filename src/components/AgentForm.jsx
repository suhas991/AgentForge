// src/components/AgentForm.jsx
import React, { useState } from 'react';
import CustomParametersField from './CustomParametersField';
import { GEMINI_MODELS, DEFAULT_MODEL } from '../constants/models';

const AgentForm = ({ onSave, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    role: initialData?.role || '',
    goal: initialData?.goal || '',
    taskDescription: initialData?.taskDescription || '',
    expectedOutput: initialData?.expectedOutput || '',
    model: initialData?.model || DEFAULT_MODEL,
    customParameters: initialData?.customParameters || []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCustomParametersChange = (params) => {
    setFormData(prev => ({
      ...prev,
      customParameters: params
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="agent-form">
      <div className="form-group">
        <label>Agent Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Content Writer Agent"
          required
        />
      </div>

      <div className="form-group">
        <label>Role *</label>
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="e.g., Professional Content Creator"
          required
        />
      </div>

      <div className="form-group">
        <label>Goal *</label>
        <textarea
          name="goal"
          value={formData.goal}
          onChange={handleChange}
          placeholder="What should this agent achieve?"
          rows="2"
          required
        />
      </div>

      <div className="form-group">
        <label>Task Description *</label>
        <textarea
          name="taskDescription"
          value={formData.taskDescription}
          onChange={handleChange}
          placeholder="Describe the tasks this agent will perform..."
          rows="4"
          required
        />
      </div>

      <div className="form-group">
        <label>Expected Output *</label>
        <textarea
          name="expectedOutput"
          value={formData.expectedOutput}
          onChange={handleChange}
          placeholder="Describe the format and structure of the expected output..."
          rows="3"
          required
        />
      </div>

      <div className="form-group">
        <label>Model *</label>
        <select
          name="model"
          value={formData.model}
          onChange={handleChange}
          required
        >
          {GEMINI_MODELS.map(model => (
            <option key={model.id} value={model.id}>
              {model.name} - {model.description}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Custom Parameters (Optional)</label>
        <CustomParametersField
          parameters={formData.customParameters}
          onChange={handleCustomParametersChange}
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {initialData ? 'Update Agent' : 'Create Agent'}
        </button>
      </div>
    </form>
  );
};

export default AgentForm;
