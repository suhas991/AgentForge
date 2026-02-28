# Groq Integration Guide

## Overview
Successfully integrated Groq LLM provider alongside Gemini to give users choice between multiple LLM providers for agents and workflows.

## What Changed

### 1. **Models Configuration** (`src/constants/models.js`)
- Added `GROQ_MODELS` array with available Groq models:
  - `mixtral-8x7b-32768` - Powerful open-source model
  - `llama-3.1-70b-versatile` - Versatile and capable
  - `llama-3.1-8b-instant` - Fast and lightweight
  - `llama-3.2-90b-vision-preview` - Vision capable model
- Added `ALL_MODELS` that combines both Gemini and Groq models
- Added `provider` field to each model object
- New helper functions:
  - `getAllModels()` - Returns all models from both providers
  - `getModelsByProvider(provider)` - Returns models for specific provider
  - `getModelProvider(modelId)` - Returns provider for a given model

### 2. **LLM Service** (`src/services/llmService.js`)
- Refactored API key management:
  - Now handles both `apiKey`/`geminiApiKey` and `groqApiKey`
  - `getApiKeys()` function returns object with both keys
  - Looks for API keys in this order:
    1. `localStorage.userConfig` (user settings)
    2. Environment variables (`VITE_GEMINI_API_KEY`, `VITE_GROQ_API_KEY`)

- Updated `executeAgent()` function:
  - Detects model provider using `getModelProvider()`
  - Routes to appropriate executor (`executeGeminiAgent` or `executeGroqAgent`)
  - Validates required API key before execution

- Added `executeGroqAgent()` function:
  - Makes requests to Groq API endpoint: `https://api.groq.com/openai/v1/chat/completions`
  - Uses OpenAI-compatible format
  - Supports RAG (knowledge base) context
  - Handles temperature, max_tokens, top_p parameters

- Refactored `executeGeminiAgent()` function:
  - Contains all original Gemini-specific logic
  - Supports RAG and file uploads
  - Maintains backward compatibility

### 3. **Agent Form** (`src/components/AgentForm.jsx`)
- Updated model selector to show optgroups:
  - "Gemini Models" group
  - "Groq Models" group
- Users can now select any model from either provider
- Form automatically works with selected model (no changes needed)

### 4. **Onboarding Modal** (`src/components/OnboardingModal.jsx`)
- Extended to 3 steps (previously 2):
  - **Step 1**: User info (name, email)
  - **Step 2**: Gemini API Key (required)
  - **Step 3**: Groq API Key (optional)
- Added support for `groqApiKey` field in form data
- Updated validation to handle Groq key as optional
- Updated progress indicator to show 3 steps

### 5. **Settings Modal** (`src/components/SettingsModal.jsx`)
- Added separate fields for both API keys:
  - Gemini API Key (required)
  - Groq API Key (optional)
- Each key has show/hide toggle for visibility
- Updates localStorage with both keys
- Maintains backward compatibility with `apiKey` field

## API Key Storage

API keys are stored in `localStorage` under `userConfig` as a JSON object:

```json
{
  "name": "User Name",
  "email": "user@example.com",
  "apiKey": "AIza...",           // Kept for backward compatibility
  "geminiApiKey": "AIza...",     // New explicit field
  "groqApiKey": "gsk_..."        // New field for Groq
}
```

## Usage

### For Users

1. **Initial Setup**:
   - Complete onboarding with name, email, and Gemini API key
   - Optionally add Groq API key (can be added later in settings)

2. **Creating Agents**:
   - When creating an agent, select a model from the dropdown
   - Models are grouped by provider (Gemini vs Groq)
   - Choose any model; the system automatically uses the correct API key

3. **Running Workflows**:
   - Workflows can use agents with different providers
   - Each agent in a workflow will use its configured model and provider

4. **Updating API Keys**:
   - Go to Settings
   - Update Gemini or Groq API keys as needed
   - Changes are saved to browser storage

### For Developers

To add more Groq models:
1. Add to `GROQ_MODELS` array in `src/constants/models.js`
2. Include `id`, `name`, `description`, `category`, and `provider: "groq"`

Example:
```javascript
{
  id: "gemma-7b-it",
  name: "Gemma 7B IT",
  description: "Instruction-tuned Gemma model",
  category: "lite",
  provider: "groq",
}
```

To add support for another provider:
1. Add model list to `src/constants/models.js`
2. Create executor function in `src/services/llmService.js` (e.g., `executeOpenAIAgent()`)
3. Add provider detection logic to `executeAgent()`
4. Update UI components to support new provider

## Backward Compatibility

- Existing agents and workflows continue to work
- Both `apiKey` and `geminiApiKey` are supported
- Default model remains Gemini 2.5 Flash Lite
- Users with only Gemini key can still use the system

## Environment Variables (Development)

```bash
# .env or .env.local
VITE_GEMINI_API_KEY=your_gemini_key
VITE_GROQ_API_KEY=your_groq_key
```

## RAG (Knowledge Base) Support

Both providers support RAG:
- Documents are retrieved using embeddings
- Context is appended to the prompt
- `ragEnabled` and `ragTopK` agent settings work for both

## Limitations

- **Groq**: 
  - File uploads not supported (text-only)
  - Vision models available but not tested with file uploads
  
- **Gemini**:
  - Multimodal support maintained
  - Can accept file uploads

## Testing Checklist

- [x] Create agent with Gemini model
- [x] Create agent with Groq model
- [x] Run agent with Gemini
- [x] Run agent with Groq
- [x] Create workflow with mixed providers
- [x] Update API keys in settings
- [x] Test RAG with both providers
- [x] Test custom parameters with both
- [x] Verify error handling for missing API keys
- [x] Test onboarding flow for both API keys

## Future Enhancements

1. Support for additional providers (OpenAI, Anthropic, etc.)
2. Model-specific UI hints (e.g., different parameter ranges)
3. Per-agent API key configuration
4. Cost tracking by provider
5. Provider health status indicators
