// src/services/exportImportService.js

/**
 * Export a single agent to JSON file
 */
export const exportAgent = (agent) => {
  const exportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    agentCount: 1,
    agents: [sanitizeAgent(agent)]
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
    type: 'application/json' 
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${agent.name.replace(/\s+/g, '-').toLowerCase()}-agent.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export multiple agents to JSON file
 */
export const exportAgents = (agents) => {
  const exportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    agentCount: agents.length,
    agents: agents.map(sanitizeAgent)
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
    type: 'application/json' 
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `agentforge-agents-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Remove internal fields before export
 */
const sanitizeAgent = (agent) => {
  const { id, isDefault, ...cleanAgent } = agent;
  return {
    ...cleanAgent,
    exportedAt: new Date().toISOString()
  };
};

/**
 * Validate imported JSON structure
 */
export const validateImportData = (data) => {
  try {
    if (!data || typeof data !== 'object') {
      return { valid: false, error: 'Invalid JSON structure' };
    }

    // Check for version
    if (!data.version) {
      return { valid: false, error: 'Missing version information' };
    }

    // Check for agents array
    if (!Array.isArray(data.agents)) {
      return { valid: false, error: 'Missing or invalid agents array' };
    }

    // Validate each agent
    for (const agent of data.agents) {
      if (!agent.name || !agent.role || !agent.goal) {
        return { valid: false, error: 'Agent missing required fields (name, role, goal)' };
      }
    }

    return { valid: true, data };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

/**
 * Parse and import agents from file
 */
export const importAgentsFromFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        const validation = validateImportData(jsonData);
        
        if (!validation.valid) {
          reject(new Error(validation.error));
          return;
        }

        resolve(jsonData.agents);
      } catch (error) {
        reject(new Error('Failed to parse JSON file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
};

/**
 * Generate unique name if duplicate exists
 */
export const generateUniqueName = (baseName, existingNames) => {
  let name = baseName;
  let counter = 1;

  while (existingNames.includes(name)) {
    name = `${baseName} (${counter})`;
    counter++;
  }

  return name;
};
