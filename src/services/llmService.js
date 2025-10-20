// src/services/llmService.js
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

export const executeAgent = async (agent, userInput, customParams = {}) => {
  const systemPrompt = buildSystemPrompt(agent, customParams);
  const geminiParams = extractGeminiParameters(customParams);
  
  // Use import.meta.env instead of process.env for Vite
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY not found in environment variables');
  }

  try {
    const model = agent.model || 'gemini-2.0-flash-exp';
    const url = `${GEMINI_API_BASE}/models/${model}:generateContent?key=${apiKey}`;

    // Combine system prompt and user input
    const fullPrompt = `${systemPrompt}\n\n---\n\nUser Input:\n${userInput}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: fullPrompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: geminiParams.temperature || 0.7,
        topK: geminiParams.topK || 40,
        topP: geminiParams.topP || 0.95,
        maxOutputTokens: geminiParams.maxOutputTokens || 2048,
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
    
    // Extract text from Gemini response
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

  // Add custom context parameters (like tone, mood, style)
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

  // Set default maxOutputTokens to 8192 if not specified (Gemini 2.0 supports up to 8k)
  if (!geminiParams.maxOutputTokens) {
    geminiParams.maxOutputTokens = 8192;
  }

  return geminiParams;
};
