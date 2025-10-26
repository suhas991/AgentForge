// src/components/CustomParametersField.jsx
import React from 'react';

const CustomParametersField = ({ parameters, onChange, disabled = false }) => {
  const addParameter = () => {
    onChange([...parameters, { key: '', value: '', type: 'text' }]);
  };

  const removeParameter = (index) => {
    const updated = parameters.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateParameter = (index, field, value) => {
    const updated = parameters.map((param, i) => 
      i === index ? { ...param, [field]: value } : param
    );
    onChange(updated);
  };

  return (
    <div className="custom-parameters-section">
      <label className="section-label">Custom Parameters</label>
      <p className="helper-text">Add custom parameters like tone, mood, temperature, etc.</p>
      
      {parameters.map((param, index) => (
        <div key={index} className="parameter-row">
          <input
            type="text"
            placeholder="Parameter name (e.g., tone)"
            value={param.key}
            onChange={(e) => updateParameter(index, 'key', e.target.value)}
            className="param-key"
            disabled={disabled}
          />
          
          <select
            value={param.type}
            onChange={(e) => updateParameter(index, 'type', e.target.value)}
            className="param-type"
            disabled={disabled}
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="select">Dropdown</option>
          </select>

          {param.type === 'select' ? (
            <input
              type="text"
              placeholder="Options (comma-separated)"
              value={param.options || ''}
              onChange={(e) => updateParameter(index, 'options', e.target.value)}
              className="param-value"
              disabled={disabled}
            />
          ) : (
            <input
              type={param.type === 'number' ? 'number' : 'text'}
              placeholder="Default value"
              value={param.value}
              onChange={(e) => updateParameter(index, 'value', e.target.value)}
              className="param-value"
              step={param.type === 'number' ? '0.1' : undefined}
              disabled={disabled}
            />
          )}

          <button
            type="button"
            onClick={() => removeParameter(index)}
            className="btn-remove"
            disabled={disabled}
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addParameter}
        className="btn-add-param"
        disabled={disabled}
      >
        + Add Parameter
      </button>
    </div>
  );
};

export default CustomParametersField;
