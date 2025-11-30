// src/services/llmService.js

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

// Get API key from user config (localStorage) first, fallback to env
const getApiKey = () => {
  // First check user config from onboarding
  const userConfig = localStorage.getItem('userConfig');
  if (userConfig) {
    try {
      const config = JSON.parse(userConfig);
      if (config.apiKey) {
        return config.apiKey;
      }
    } catch (error) {
      console.error('Error parsing user config:', error);
    }
  }

  // Fallback to environment variable (for development)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_GEMINI_API_KEY;
  }
  
  if (typeof process !== 'undefined' && process.env) {
    return process.env.REACT_APP_GEMINI_API_KEY;
  }
  
  return null;
};

export const executeAgent = async (agent, userInput, customParams) => {
  const systemPrompt = buildSystemPrompt(agent, customParams);
  const geminiParams = extractGeminiParameters(customParams);
  
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('API Key not found. Please configure your API key in settings or onboarding.');
  }

  try {
    // Use the model from agent, fallback to gemini-2.0-flash
    const model = agent.model;
    const url = `${GEMINI_API_BASE}/models/${model}:generateContent?key=${apiKey}`;
    
    const fullPrompt = `${systemPrompt}\n\n---\n\nInput:\n${userInput}`;
    
    const requestBody = {
      contents: [{
        parts: [{ text: fullPrompt }]
      }],
      generationConfig: {
        temperature: geminiParams.temperature || 0.7,
        topK: geminiParams.topK || 40,
        topP: geminiParams.topP || 0.95,
        maxOutputTokens: geminiParams.maxOutputTokens || 8000,
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Gemini API request failed');
    }

    const data = await response.json();
    
    // Check if response has expected structure
    if (!data.candidates || data.candidates.length === 0) {
      console.error('Unexpected API response:', data);
      
      // Check for safety ratings or prompt blocking
      if (data.promptFeedback?.blockReason) {
        throw new Error(`Content blocked: ${data.promptFeedback.blockReason}`);
      }
      
      throw new Error('API returned no candidates. The content may have been blocked or the response was empty.');
    }
    
    // Check if candidate has content
    if (!data.candidates[0].content || !data.candidates[0].content.parts || data.candidates[0].content.parts.length === 0) {
      console.error('Candidate missing content:', data.candidates[0]);
      throw new Error('API response missing content. This may be due to safety filters.');
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(`Failed to execute agent: ${error.message}`);
  }
};

const buildSystemPrompt = (agent, customParams) => {
  let prompt = `You are a ${agent.role}.\n\nYour goal is: ${agent.goal}\n\nTask Description:\n${agent.taskDescription}\n\nExpected Output Format:\n${agent.expectedOutput}`;
  
  // Add context parameters (excluding Gemini-specific params)
  const contextParams = Object.entries(customParams).filter(
    ([key]) => !['temperature', 'maxtokens', 'topp', 'topk'].includes(key.toLowerCase())
  );
  
  if (contextParams.length > 0) {
    prompt += '\n\nContext:';
    contextParams.forEach(([key, value]) => {
      prompt += `\n- ${key}: ${value}`;
    });
  }
  
  return prompt;
};

const extractGeminiParameters = (customParams) => {
  const geminiParams = {};
  
  const paramMapping = {
    'temperature': 'temperature',
    'maxtokens': 'maxOutputTokens',
    'topp': 'topP',
    'topk': 'topK',
  };
  
  Object.entries(customParams).forEach(([key, value]) => {
    if (paramMapping[key.toLowerCase()]) {
      const geminiKey = paramMapping[key.toLowerCase()];
      geminiParams[geminiKey] = parseFloat(value) || value;
    }
  });
  
  if (!geminiParams.maxOutputTokens) {
    geminiParams.maxOutputTokens = 8192;
  }
  
  return geminiParams;
};
