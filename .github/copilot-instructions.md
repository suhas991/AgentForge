# Copilot instructions — GenAgentX

## Big picture
- This is a React + Vite SPA deployed to GitHub Pages. Routing uses `HashRouter` (see `src/main.jsx`) because static hosting + the Vite `base` path are used (`vite.config.js` sets `base: '/GenAgentX/'`).
- App bootstrapping happens in `src/App.jsx`: it reads onboarding config from `localStorage.userConfig`, initializes IndexedDB, seeds default agents, loads agents, then routes to `Landing` or `Dashboard`.

## State & persistence
- Global UI state is in Zustand (`src/store/appStore.js`): modals, theme (`localStorage.theme`), mobile blocking, and app-wide UI flags.
- Durable data is stored client-side:
  - Agents, workflows, and execution history: `src/services/indexedDB.js` (DB `AgentBuilderDB`, versioned schema; stores: `agents`, `executions`, `workflows`, `workflow_executions`).
  - RAG “vector store” documents: `src/services/vectorStore.js` (separate `idb` DB `GenAgentX_VectorStore`).

## Agent execution (Gemini)
- Model execution is implemented via REST `fetch` (not the `@google/genai` SDK): `src/services/llmService.js`.
- API key lookup order is important:
  1) `localStorage.userConfig.apiKey` (from onboarding/settings)
  2) `import.meta.env.VITE_GEMINI_API_KEY` (dev fallback)
- Prompt construction:
  - `buildSystemPrompt(agent, customParams)` creates the “system” section from agent fields.
  - Runtime input is appended, plus optional RAG context.
  - `customParams` are split into (a) context parameters and (b) Gemini generation config (`temperature`, `topK`, `topP`, `maxOutputTokens`).

## RAG (Knowledge Base)
- Agents can opt-in to RAG using `ragEnabled` and tune retrieval via `ragTopK` (see `src/components/AgentForm.jsx` and `src/components/RAGManager.jsx`).
- Upload pipeline (RAGManager):
  - Parse documents in `src/services/fileParser.js` (PDF/DOCX/XLSX/CSV/HTML/RTF/text/code).
  - Chunk + embed via `text-embedding-004` in `src/services/vectorStore.js`.
  - Retrieve via cosine similarity and append a “Relevant Context” block in `src/services/llmService.js`.

## Workflows
- A workflow is an ordered list of `{ agentId, order }` built in `src/components/WorkflowBuilder.jsx`.
- Workflow execution is strictly sequential and passes previous output as next input; the chain stops on the first error (`src/services/chainExecutor.js`).

## Developer workflows
- Dev server: `npm run dev`
- Lint: `npm run lint`
- Build / preview: `npm run build` / `npm run preview`
- GitHub Pages deploy: `npm run deploy` (depends on hash routing + `vite.config.js` base; don’t switch to `BrowserRouter` without changing hosting).

## Project-specific conventions
- Default helper agents have `isDefault: true` and are treated specially in UI (not editable/deletable; typically filtered out of lists). If you touch this behavior, start from `src/App.jsx` + `src/pages/Dashboard.jsx`.
- If you change the agent import/export schema, update both:
  - `src/services/exportImportService.js` (sanitize/validate)
  - `src/constants/defaultAgents.js` (the built-in assistant’s strict “JSON-only” output contract)
