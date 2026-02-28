// src/services/llmService.js

import { searchSimilarDocuments } from './vectorStore';
import { getToolById } from './indexedDB';
import { executeAgentWithTools } from './agentExecutor';
import { getModelProvider, getSelectedEmbeddingModel, getModelsGroupedByProvider } from '../constants/models';
import { getProvider, canUseModel, getMissingProviderMessage } from '../constants/providers';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const GROQ_API_BASE = 'https://api.groq.com/openai/v1';

// Get all API keys from user config (localStorage) first, fallback to env
const getApiKeys = () => {
  const keys = {
    gemini: null,
    groq: null
  };

  // First check user config from onboarding
  const userConfig = localStorage.getItem('userConfig');
  if (userConfig) {
    try {
      const config = JSON.parse(userConfig);
      // Use explicit provider keys (no backward compat fallback to apiKey for individual providers)
      keys.gemini = config.geminiApiKey;
      keys.groq = config.groqApiKey;
    } catch (error) {
      console.error('Error parsing user config:', error);
    }
  }

  // Fallback to environment variables (for development)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    keys.gemini = keys.gemini || import.meta.env.VITE_GEMINI_API_KEY;
    keys.groq = keys.groq || import.meta.env.VITE_GROQ_API_KEY;
  }

  return keys;
};

// Get API key for a specific provider
const getApiKeyForProvider = (providerId) => {
  const keys = getApiKeys();
  return keys[providerId] || null;
};

// Get user config object
const getUserConfig = () => {
  const userConfigStr = localStorage.getItem('userConfig');
  if (!userConfigStr) return null;
  
  try {
    return JSON.parse(userConfigStr);
  } catch (error) {
    console.error('Error parsing user config:', error);
    return null;
  }
};

export const executeAgent = async (agent, userInput, customParams, uploadedFiles = []) => {
  // Fast-fail if the browser reports we're offline.
  if (typeof navigator !== 'undefined' && navigator && navigator.onLine === false) {
    throw new Error('No internet connection (offline). Please reconnect and try again.');
  }

  // Determine which provider this model uses
  const providerId = getModelProvider(agent.model);
  
  if (!providerId) {
    throw new Error(`Unknown model: ${agent.model}. Please select a valid model.`);
  }

  // Check if user has configured API key for this provider
  const userConfig = getUserConfig();
  const canUse = canUseModel(agent.model, userConfig);
  
  if (!canUse) {
    const message = getMissingProviderMessage(providerId);
    throw new Error(message);
  }

  const apiKey = getApiKeyForProvider(providerId);
  
  if (!apiKey) {
    const provider = getProvider(providerId);
    throw new Error(`${provider.name} API Key not found. Please configure your ${provider.name} API key in settings.`);
  }

  // Check if agent has tools - if so, use the advanced executor with tool calling
  if (agent.tools && agent.tools.length > 0) {
    console.log(`🔧 Agent has tools - using advanced executor with ${providerId} provider`);
    
    try {
      const result = await executeAgentWithTools(agent, userInput, customParams, apiKey);
      
      if (!result.success) {
        throw new Error(result.error || 'Agent execution failed');
      }
      
      // Return the final result with execution metadata
      let response = result.result;
      
      // Optionally append execution summary
      if (result.toolExecutions && result.toolExecutions.length > 0) {
        response += `\n\n---\n**Execution Summary:**\n`;
        response += `- Iterations: ${result.iterations}\n`;
        response += `- Tools Used: ${result.toolExecutions.length}\n`;
        result.toolExecutions.forEach((exec, i) => {
          response += `  ${i + 1}. ${exec.tool} (iteration ${exec.iteration})\n`;
        });
      }
      
      return response;
    } catch (error) {
      console.error('Tool-based execution error:', error);
      throw new Error(`Failed to execute agent with tools: ${error.message}`);
    }
  }

  // No tools - route to provider-specific executor
  console.log(`📝 Agent has no tools - using simple ${providerId} execution`);
  
  if (providerId === 'gemini') {
    return executeGeminiAgent(agent, userInput, customParams, uploadedFiles, apiKey);
  } else if (providerId === 'groq') {
    return executeGroqAgent(agent, userInput, customParams, apiKey);
  } else {
    throw new Error(`Unsupported provider: ${providerId}`);
  }
};

// Gemini-specific execution
const executeGeminiAgent = async (agent, userInput, customParams, uploadedFiles, apiKey) => {
  const systemPrompt = buildSystemPrompt(agent, customParams);
  const geminiParams = extractGeminiParameters(customParams);

  try {
    const model = agent.model;
    const url = `${GEMINI_API_BASE}/models/${model}:generateContent?key=${apiKey}`;
    
    // Get relevant documents if RAG is enabled
    let context = '';
    if (agent.ragEnabled) {
      const embeddingModel = getSelectedEmbeddingModel('gemini');
      const relevantDocs = await searchSimilarDocuments(
        agent.id, 
        userInput, 
        apiKey, 
        agent.ragTopK || 3,
        embeddingModel
      );
      
      if (relevantDocs.length > 0) {
        context = '\n\nRelevant Context:\n' + 
          relevantDocs.map((doc, i) => 
            `[Document ${i + 1}] ${doc.content}`
          ).join('\n\n');
      }
    }
    
    const fullPrompt = `${systemPrompt}\n\n---\n\nInput:\n${userInput}${context}`;
    
    // Build content parts - text + files
    const contentParts = [];
    
    // Add file parts first (recommended for better multimodal understanding)
    if (uploadedFiles && uploadedFiles.length > 0) {
      uploadedFiles.forEach(file => {
        if (file.isInline) {
          contentParts.push({
            inline_data: {
              mime_type: file.mimeType,
              data: file.inlineData
            }
          });
        } else {
          contentParts.push({
            file_data: {
              mime_type: file.mimeType,
              file_uri: file.uri
            }
          });
        }
      });
    }
    
    // Add text part after files
    contentParts.push({ text: fullPrompt });
    
    const requestBody = {
      contents: [{
        parts: contentParts
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
    
    if (!data.candidates || data.candidates.length === 0) {
      console.error('Unexpected API response:', data);
      
      if (data.promptFeedback?.blockReason) {
        throw new Error(`Content blocked: ${data.promptFeedback.blockReason}`);
      }
      
      throw new Error('API returned no candidates. The content may have been blocked or the response was empty.');
    }
    
    if (!data.candidates[0].content || !data.candidates[0].content.parts || data.candidates[0].content.parts.length === 0) {
      console.error('Candidate missing content:', data.candidates[0]);
      throw new Error('API response missing content. This may be due to safety filters.');
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API Error:', error);

    if (
      error instanceof TypeError ||
      (typeof error?.message === 'string' && error.message.toLowerCase().includes('failed to fetch'))
    ) {
      if (typeof navigator !== 'undefined' && navigator && navigator.onLine === false) {
        throw new Error('Failed to execute agent: you appear to be offline (no internet connection).');
      }
      throw new Error('Failed to execute agent: network error connecting to Gemini API. Check your internet/VPN/proxy and try again.');
    }

    throw new Error(`Failed to execute agent: ${error.message}`);
  }
};

// Groq-specific execution
const executeGroqAgent = async (agent, userInput, customParams, apiKey) => {
  const systemPrompt = buildSystemPrompt(agent, customParams);
  const groqParams = extractGroqParameters(customParams);

  try {
    const model = agent.model;
    const url = `${GROQ_API_BASE}/chat/completions`;
    
    // Get relevant documents if RAG is enabled
    let context = '';
    if (agent.ragEnabled) {
      // For Groq, we need to use Gemini's embedding API (or implement alternative)
      // For now, we'll use Gemini embeddings if available
      const geminiKey = getApiKeyForProvider('gemini');
      const embeddingModel = getSelectedEmbeddingModel('gemini');
      if (geminiKey) {
        const relevantDocs = await searchSimilarDocuments(
          agent.id, 
          userInput, 
          geminiKey, // Using Gemini for embeddings
          agent.ragTopK || 3,
          embeddingModel
        );
        
        if (relevantDocs.length > 0) {
          context = '\n\nRelevant Context:\n' + 
            relevantDocs.map((doc, i) => 
              `[Document ${i + 1}] ${doc.content}`
            ).join('\n\n');
        }
      }
    }
    
    const fullPrompt = `${userInput}${context}`;
    
    const requestBody = {
      model: model,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: fullPrompt
        }
      ],
      temperature: groqParams.temperature || 0.7,
      max_tokens: groqParams.max_tokens || 8000,
      top_p: groqParams.top_p || 0.95,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Groq API request failed');
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      console.error('Unexpected Groq API response:', data);
      throw new Error('Groq API returned no choices.');
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Groq API Error:', error);

    if (
      error instanceof TypeError ||
      (typeof error?.message === 'string' && error.message.toLowerCase().includes('failed to fetch'))
    ) {
      if (typeof navigator !== 'undefined' && navigator && navigator.onLine === false) {
        throw new Error('Failed to execute agent: you appear to be offline (no internet connection).');
      }
      throw new Error('Failed to execute agent: network error connecting to Groq API. Check your internet/VPN/proxy and try again.');
    }

    throw new Error(`Failed to execute agent: ${error.message}`);
  }
};

const buildSystemPrompt = (agent, customParams) => {
  let prompt = `You are a ${agent.role}.\n\nYour goal is: ${agent.goal}\n\nTask Description:\n${agent.taskDescription}\n\nExpected Output Format:\n${agent.expectedOutput}`;
  
  // Add context parameters (excluding LLM-specific params)
  const contextParams = Object.entries(customParams).filter(
    ([key]) => !['temperature', 'maxtokens', 'topp', 'topk', 'max_tokens', 'top_p'].includes(key.toLowerCase())
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

const extractGroqParameters = (customParams) => {
  const groqParams = {};
  
  const paramMapping = {
    'temperature': 'temperature',
    'maxtokens': 'max_tokens',
    'max_tokens': 'max_tokens',
    'topp': 'top_p',
    'top_p': 'top_p',
  };
  
  Object.entries(customParams).forEach(([key, value]) => {
    if (paramMapping[key.toLowerCase()]) {
      const groqKey = paramMapping[key.toLowerCase()];
      groqParams[groqKey] = parseFloat(value) || value;
    }
  });
  
  if (!groqParams.max_tokens) {
    groqParams.max_tokens = 8000;
  }
  
  return groqParams;
};

// Export helper functions for use in other services
export { getApiKeys, getApiKeyForProvider, getUserConfig };

/**
 * Select the best available model based on configured API keys
 * Tries Gemini first, then Groq, fails if neither configured
 */
export const selectBestAvailableModel = () => {
  const userConfig = getUserConfig();
  const keys = getApiKeys();
  const groupedModels = getModelsGroupedByProvider(userConfig, { enabledOnly: true });
  const geminiGroup = groupedModels.find(group => group.providerId === 'gemini');
  const groqGroup = groupedModels.find(group => group.providerId === 'groq');
  
  // Check Gemini first (preferred default)
  if (keys.gemini && keys.gemini.trim().length > 0 && geminiGroup?.models?.length > 0) {
    return geminiGroup.models[0].id;
  }
  
  // Fall back to Groq if available
  if (keys.groq && keys.groq.trim().length > 0 && groqGroup?.models?.length > 0) {
    return groqGroup.models[0].id;
  }
  
  // Neither configured
  return null;
};
