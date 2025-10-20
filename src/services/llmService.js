// src/services/llmService.js - Update the model handling
const getApiKey = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_GEMINI_API_KEY;
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env.REACT_APP_GEMINI_API_KEY;
  }
  return null;
};

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

export const executeAgent = async (agent, userInput, customParams = {}) => {
  const systemPrompt = buildSystemPrompt(agent, customParams);
  const geminiParams = extractGeminiParameters(customParams);
  
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error('API Key not found. Please set VITE_GEMINI_API_KEY in your .env file');
  }

  try {
    // Use the model from agent, fallback to gemini-2.0-flash
    const model = agent.model || 'gemini-2.0-flash';
    const url = `${GEMINI_API_BASE}/models/${model}:generateContent?key=${apiKey}`;

    const fullPrompt = `${systemPrompt}\n\n---\n\nUser Input:\n${userInput}`;

    const requestBody = {
      contents: [
        {
          parts: [{ text: fullPrompt }]
        }
      ],
      generationConfig: {
        temperature: geminiParams.temperature || 0.7,
        topK: geminiParams.topK || 40,
        topP: geminiParams.topP || 0.95,
        maxOutputTokens: geminiParams.maxOutputTokens || 8192,
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
    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(`Failed to execute agent: ${error.message}`);
  }
};

const buildSystemPrompt = (agent, customParams) => {
  let prompt = `You are a ${agent.role}.

Your goal is: ${agent.goal}

Task Description: ${agent.taskDescription}

Expected Output Format: ${agent.expectedOutput}`;

  const contextParams = Object.entries(customParams).filter(
    ([key]) => !['temperature', 'max_tokens', 'top_p', 'top_k'].includes(key)
  );

  if (contextParams.length > 0) {
    prompt += '\n\nAdditional Context:';
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
    'max_tokens': 'maxOutputTokens',
    'top_p': 'topP',
    'top_k': 'topK',
  };

  Object.entries(customParams).forEach(([key, value]) => {
    if (paramMapping[key]) {
      const geminiKey = paramMapping[key];
      geminiParams[geminiKey] = parseFloat(value) || value;
    }
  });

  if (!geminiParams.maxOutputTokens) {
    geminiParams.maxOutputTokens = 8192;
  }

  return geminiParams;
};
    