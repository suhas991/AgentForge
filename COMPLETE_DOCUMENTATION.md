# GenAgentX - Complete User & Technical Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [First Time Setup & Onboarding](#first-time-setup--onboarding)
4. [Dashboard Navigation](#dashboard-navigation)
5. [Creating AI Agents](#creating-ai-agents)
6. [Running Agents](#running-agents)
7. [Using the AI Chatbot Helper](#using-the-ai-chatbot-helper)
8. [Building Workflows](#building-workflows)
9. [Execution History](#execution-history)
10. [Import & Export](#import--export)
11. [Settings & Configuration](#settings--configuration)
12. [Technical Architecture](#technical-architecture)
13. [Troubleshooting](#troubleshooting)

---

## Overview

**GenAgentX** is a visual, no-code platform for creating, managing, and deploying AI agents powered by Google Gemini. Build intelligent assistants for content creation, coding, data analysis, and more—all from your browser.

### Key Features
- ✅ **No Code Required** - Visual interface for agent creation
- ✅ **Google Gemini Powered** - Multiple AI models (Flash, Pro, Lite)
- ✅ **100% Browser-Based** - All data stored locally (IndexedDB)
- ✅ **Workflow Builder** - Chain multiple agents together
- ✅ **AI Assistant Helper** - Built-in chatbot to guide agent creation
- ✅ **Full Privacy** - Your API key never leaves your device
- ✅ **Import/Export** - Share agents with your team
- ✅ **Execution History** - Track all agent runs with full logs
- ✅ **Theme Support** - Dark and Light modes

---

## Getting Started

### Prerequisites
- **Modern Web Browser** (Chrome, Edge, Firefox, Safari)
- **Google Gemini API Key** (Free tier available)
- **Desktop/Laptop** (1024px+ screen width)
- **Internet Connection** (for API calls to Gemini)

### Installation Options

#### Option 1: Use Live Deployment
Visit: **https://suhas991.github.io/GenAgentX/**

#### Option 2: Local Development
```bash
# Clone repository
git clone https://github.com/suhas991/GenAgentX.git

# Navigate to project
cd GenAgentX

# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:5173
```

### Getting Your API Key
1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated key (starts with `AIza...`)
5. Keep it safe - you'll need it during onboarding

---

## First Time Setup & Onboarding

### Landing Page
When you first visit GenAgentX, you'll see:
- **Hero Section**: Overview of features
- **Features Carousel**: 12 key features
- **Use Cases**: 6 practical applications
- **How It Works**: 4-step process
- **CTA Button**: "Get Started Free" or "Try It Free"

### Theme Toggle
- **Location**: Top-right navigation bar
- **Icon**: Sun (☀️) for light mode, Moon (🌙) for dark mode
- **Default**: Dark mode (retains preference in localStorage)

### Onboarding Modal (First Login)

**Step 1: Personal Information**
```
Fields Required:
├── Full Name (text, required)
├── Email Address (email, required)
└── Company/Organization (text, optional)
```

**Step 2: API Configuration**
```
Fields Required:
├── Google Gemini API Key (text, required)
│   └── Format: AIza[alphanumeric characters]
└── Get API Key Link (opens Google AI Studio)
```

**Step 3: Configuration Review**
- Displays entered information
- Confirms API key format
- Shows default model (gemini-2.0-flash)

**Step 4: Completion**
- Saves configuration to `localStorage`
- Initializes IndexedDB
- Seeds default helper agent
- Redirects to Dashboard

### What Happens During Initialization
```javascript
1. localStorage stores userConfig:
   {
     name: "Your Name",
     email: "your@email.com",
     company: "Company Name",
     apiKey: "AIza***",
     createdAt: "2025-11-19T..."
   }

2. IndexedDB creates 4 object stores:
   - agents (stores all AI agents)
   - executions (logs agent runs)
   - workflows (stores workflow configurations)
   - workflow_executions (logs workflow runs)

3. Default "GenAgentX Assistant" agent is created
   - Name: GenAgentX Assistant
   - Role: AI Agent Configuration Generator
   - Purpose: Help users create new agents via chat
```

---

## Dashboard Navigation

### Top Navigation Bar

**Left Side:**
- **Logo & App Name**: GenAgentX
- **Theme Toggle**: Switch between dark/light modes

**Right Side:**
- **User Menu Dropdown** (Avatar Icon):
  ```
  ├── User Name & Email
  ├── Settings ⚙️
  ├── Logout 🚪
  ```

### Sidebar Navigation

**Main Menu:**
```
├── 🏠 Agents (Main view - default)
├── 🔗 Workflows (Chain multiple agents)
├── 📜 History (Execution logs)
└── 💬 AI Helper (Floating chatbot toggle)
```

**Bottom Actions:**
```
├── ➕ Create Agent
├── 📥 Import Agents
├── 📤 Export All
└── ⚙️ Settings
```

### View States
1. **Agents View** - Grid of all created agents
2. **Workflows View** - List of saved workflows
3. **History View** - Execution logs and results
4. **Modal States** - Forms, runners, settings overlays

---

## Creating AI Agents

### Method 1: Manual Creation

**Step 1: Open Agent Form**
- Click **"+ Create Agent"** in sidebar
- OR click **"Create New Agent"** in empty state

**Step 2: Fill Agent Details**

**Basic Information:**
```
Agent Name*
├── Example: "Blog Post Writer"
├── Purpose: Display name for the agent
└── Validation: Required, min 3 chars

Role*
├── Example: "Senior Content Strategist"
├── Purpose: Professional identity of the agent
└── Validation: Required, min 5 chars

Goal*
├── Example: "Create SEO-optimized blog articles"
├── Purpose: What the agent aims to achieve
└── Validation: Required, min 10 chars
```

**Task Configuration:**
```
Task Description* (Textarea)
├── Example: "Generate comprehensive blog posts..."
├── Purpose: Step-by-step instructions for the agent
├── Best Practices:
│   ├── Be specific about format
│   ├── Include structure requirements
│   ├── Mention tone and style
│   └── Define constraints (word count, etc.)
└── Validation: Required, min 20 chars

Expected Output Format*
├── Example: "A well-structured article with..."
├── Purpose: Describe the output format
└── Validation: Required, min 10 chars
```

**Model Selection:**
```
Available Models (Dropdown):
├── Gemini 2.5 Flash (Fast, efficient) ⚡
├── Gemini 2.5 Pro (Most capable) 🚀
├── Gemini 2.5 Flash Lite (Ultra lightweight) 💨
├── Gemini 2.0 Flash (High throughput) ⚡
├── Gemini 2.0 Flash Lite (Cost-efficient) 💰
└── Gemini 2.0 Flash Experimental (Testing) 🧪

Default: gemini-2.0-flash
```

**Custom Parameters (Optional):**
```
Add dynamic fields for runtime customization

Example Parameters:
├── tone: "professional" | "casual" | "enthusiastic"
├── word_count: 500 (number)
├── target_audience: "developers" (text)
└── include_examples: true (checkbox)

Parameter Types:
├── text - Free text input
├── number - Numeric value
├── select - Dropdown with options
└── checkbox - Boolean true/false
```

**Step 3: Save Agent**
- Click **"Create Agent"** button
- Agent appears in main grid
- Stored in IndexedDB immediately

### Method 2: Using AI Chatbot Helper

**Step 1: Open Chatbot**
- Click **💬 AI Helper** in sidebar
- OR press floating chatbot button

**Step 2: Describe Your Need**
```
Example Prompts:
├── "Create a social media content writer"
├── "I need an agent for code review"
├── "Build a customer email responder"
└── "Make an agent that generates product descriptions"
```

**Step 3: Review Generated JSON**
The chatbot returns importable JSON:
```json
{
  "version": "1.0",
  "exportDate": "2025-11-19T10:00:00.000Z",
  "agentCount": 1,
  "agents": [{
    "name": "Social Media Content Creator",
    "role": "Professional Social Media Strategist",
    "goal": "Generate engaging social media posts",
    "model": "gemini-2.5-flash",
    "taskDescription": "Create compelling posts...",
    "expectedOutput": "A complete social media post...",
    "customParameters": [
      {"key": "platform", "value": "twitter", "type": "select", 
       "options": "twitter, linkedin, instagram"}
    ]
  }]
}
```

**Step 4: Import Agent**
- Copy the JSON from chatbot
- Click **📥 Import Agents** in sidebar
- Paste JSON into text area
- Click **"Import Agents"**
- Agent appears in your collection

### Default Agent: GenAgentX Assistant

**Cannot Be:**
- ❌ Edited
- ❌ Deleted
- ❌ Exported

**Purpose:**
- Generate importable agent configurations
- Help users design new agents
- Provide JSON templates

**How to Use:**
1. Open AI Helper chatbot
2. Describe what agent you need
3. Receive JSON configuration
4. Import to create the agent

---

## Running Agents

### Single Agent Execution

**Step 1: Select Agent**
- Click **"Run"** button on any agent card
- Run Agent Modal opens

**Step 2: Provide Input**
```
Input Textarea
├── Purpose: Main prompt for the agent
├── Example: "Write a blog about AI in healthcare"
└── Validation: Required
```

**Step 3: Configure Custom Parameters**
If agent has custom parameters:
```
Example:
├── Tone: [Select: professional ▼]
├── Word Count: [500]
├── Target Audience: [healthcare professionals]
└── Include Examples: [✓]
```

**Step 4: Execute**
- Click **"Run Agent"** button
- Loading spinner appears
- Gemini API is called
- Results display in modal

**Output Display:**
```
Output Section:
├── Markdown Rendered Content
├── Syntax Highlighting (for code)
├── Copy Button (top-right)
└── Success/Error Status
```

**Step 5: Actions**
```
Available Actions:
├── 📋 Copy Output (copies to clipboard)
├── ▶️ Run Again (keeps same input)
├── ❌ Close (returns to dashboard)
└── Execution is logged to History
```

### Execution Flow
```
User Input → Agent Configuration → System Prompt → Gemini API
                                                         ↓
                                         Response ← Model Processing
                                              ↓
                                        Display Output
                                              ↓
                                        Save to History
```

---

## Using the AI Chatbot Helper

### Opening the Chatbot
```
Methods:
├── Click "💬 AI Helper" in sidebar
├── Click floating chat button (bottom-right)
└── Shortcut: (Can be added in future)
```

### Chatbot Interface

**Components:**
```
Chat Window:
├── Header: "AI Helper - GenAgentX Assistant"
├── Close Button (X)
├── Message History (scrollable)
├── Input Field
└── Send Button
```

**Message Types:**
```
User Message:
├── Aligned right
├── Blue/purple bubble
└── Your text input

Assistant Message:
├── Aligned left
├── Gray bubble
├── Markdown rendered
└── Code blocks with syntax highlighting
```

### How to Use

**1. Ask for Agent Creation:**
```
Input: "Create a technical blog writer"

Output: JSON configuration ready to import
```

**2. Ask for Parameter Suggestions:**
```
Input: "What parameters should a translator agent have?"

Output: Suggestions with types and options
```

**3. Ask for Best Practices:**
```
Input: "How should I structure a code reviewer agent?"

Output: Task description examples and tips
```

**4. Request Multiple Agents:**
```
Input: "Create 3 agents for content marketing: writer, editor, SEO optimizer"

Output: JSON with 3 agents in one export
```

### Important Rules

**✅ Chatbot WILL:**
- Generate valid GenAgentX JSON
- Output only JSON in code blocks
- Follow exact export format
- Include all required fields

**❌ Chatbot WON'T:**
- Provide explanations (JSON only)
- Execute agents itself
- Store conversations
- Access your existing agents

### Copying from Chatbot

**Step 1:** Wait for JSON response
**Step 2:** Click code block to select
**Step 3:** Copy (Ctrl+C / Cmd+C)
**Step 4:** Use Import feature
**Step 5:** Paste and import

---

## Building Workflows

### What are Workflows?

**Definition:** A workflow is a sequence of agents that run one after another, where each agent's output becomes the next agent's input.

**Use Cases:**
```
Content Pipeline:
1. Idea Generator → generates topic
2. Outline Creator → creates structure
3. Content Writer → writes full article
4. SEO Optimizer → optimizes for search
5. Editor → final polish

Research Workflow:
1. Web Scraper Agent → collects data
2. Summarizer → condenses info
3. Analyzer → extracts insights
4. Report Writer → generates report

Code Development:
1. Requirements Analyst → defines specs
2. Code Generator → writes code
3. Code Reviewer → reviews quality
4. Documentation Writer → creates docs
```

### Creating a Workflow

**Step 1: Open Workflow Builder**
```
From Dashboard:
├── Click "🔗 Workflows" in sidebar
├── Click "➕ Create Workflow" button
└── Workflow Builder modal opens
```

**Step 2: Name Your Workflow**
```
Workflow Name*
├── Example: "Blog Content Pipeline"
├── Purpose: Identify the workflow
└── Validation: Required

Description (Optional)
├── Example: "From idea to published article"
└── Purpose: Explain the workflow purpose
```

**Step 3: Add Agents to Workflow**

**Available Agents Panel (Left):**
```
Shows all your agents:
├── Search bar to filter agents
├── Agent cards with name and role
└── "+" button to add to workflow
```

**Selected Agents Panel (Right):**
```
Shows workflow sequence:
├── Agent order (1, 2, 3...)
├── Agent name and role
├── Drag handles for reordering
├── Up/Down arrows
└── Remove button (X)
```

**Adding Agents:**
```
Method 1: Click "+" on agent card
Method 2: Drag agent from left to right panel
```

**Reordering Agents:**
```
Method 1: Drag and drop (grab handle)
Method 2: Click ↑ or ↓ arrows
Method 3: Keyboard (Arrow Up/Down when focused)
```

**Step 4: Configure Workflow**
```
Workflow Configuration:
├── Minimum 1 agent required
├── Maximum 20 agents recommended
├── Order determines execution sequence
└── No duplicate agents allowed
```

**Step 5: Save Workflow**
- Click **"Save Workflow"** button
- Workflow appears in Workflows view
- Stored in IndexedDB

### Running a Workflow

**Step 1: Select Workflow**
```
From Workflows View:
├── Find your workflow
├── Click "▶️ Run" button
└── Workflow Runner modal opens
```

**Step 2: Provide Initial Input**
```
Input Field:
├── Purpose: Starting prompt for first agent
├── Example: "AI in healthcare"
└── This goes to Agent #1
```

**Step 3: Execute Workflow**
- Click **"Run Workflow"** button
- Visual flow diagram appears
- Progress indicators show current step

**Step 4: Monitor Execution**
```
Flow Diagram Shows:
├── All agents in sequence
├── Current agent (highlighted/animated)
├── Completed agents (green checkmark)
├── Pending agents (gray)
└── Failed agents (red X)
```

**Step 5: View Results**
```
Results Section:
├── Final Output (last agent's result)
├── Intermediate Results (expandable)
│   ├── Step 1: Agent Name → Output
│   ├── Step 2: Agent Name → Output
│   └── Step N: Agent Name → Output
├── Copy buttons for each output
└── Execution time and status
```

### Workflow Execution Logic

```javascript
// Simplified flow
initialInput = "User's prompt"

for each agent in workflow:
  1. Take input (previous agent's output or initial input)
  2. Execute agent with that input
  3. Save result
  4. If error → stop workflow and show error
  5. If success → pass output to next agent
  
finalOutput = last agent's output
```

### Managing Workflows

**Edit Workflow:**
```
├── Click "✏️ Edit" on workflow card
├── Workflow Builder opens with data
├── Modify name, agents, or order
└── Save to update
```

**Delete Workflow:**
```
├── Click "🗑️ Delete" on workflow card
├── Confirmation dialog appears
├── Confirm to permanently delete
└── Workflow removed from IndexedDB
```

**Export/Import Workflows:**
```
Export:
├── Click "📤 Export" on workflow card
├── JSON file downloads
└── File name: workflow-[name]-[date].json

Import:
├── Click "📥 Import Workflow"
├── Upload JSON file
├── Workflow is validated
└── Added to your collection
```

---

## Execution History

### Viewing History

**Access Methods:**
```
├── Click "📜 History" in sidebar
├── Dedicated History page
└── Shows all agent and workflow runs
```

### History View Layout

**Filter Tabs:**
```
├── All Executions (default)
├── Agent Runs
└── Workflow Runs
```

**History Cards:**
```
Each entry shows:
├── Agent/Workflow Name
├── Execution Date & Time
├── Input Used
├── Output (expandable/collapsed)
├── Status (Success ✓ / Failed ✗)
├── Execution Duration
└── Copy Output Button
```

### History Entry Details

**Agent Execution Log:**
```json
{
  "id": "uuid",
  "agentId": 123,
  "agentName": "Blog Writer",
  "input": "Write about AI",
  "output": "Generated content...",
  "customParams": {
    "tone": "professional",
    "word_count": 500
  },
  "status": "success",
  "runAt": "2025-11-19T10:30:00.000Z",
  "duration": 3.2
}
```

**Workflow Execution Log:**
```json
{
  "id": "uuid",
  "workflowId": 456,
  "workflowName": "Content Pipeline",
  "initialInput": "AI in healthcare",
  "results": [
    {
      "step": 1,
      "agentId": 10,
      "agentName": "Idea Generator",
      "input": "AI in healthcare",
      "output": "Topic: AI Diagnostics",
      "status": "success"
    },
    {
      "step": 2,
      "agentId": 11,
      "agentName": "Content Writer",
      "input": "Topic: AI Diagnostics",
      "output": "Full article...",
      "status": "success"
    }
  ],
  "finalOutput": "Full article...",
  "status": "success",
  "runAt": "2025-11-19T11:00:00.000Z",
  "totalDuration": 8.5
}
```

### History Actions

**Individual Entry:**
```
├── 📋 Copy Output
├── 👁️ Expand/Collapse Details
├── ▶️ Re-run with Same Input (if agent still exists)
└── 🗑️ Delete Entry (optional, if implemented)
```

**Bulk Actions:**
```
├── Clear All History
├── Export History (JSON)
└── Filter by Date Range (if implemented)
```

---

## Import & Export

### Exporting Agents

**Export Single Agent:**
```
1. Click "📤" button on agent card
2. JSON file downloads
3. File name: agent-[name]-[date].json
4. Contains single agent configuration
```

**Export All Agents:**
```
1. Click "📤 Export All" in sidebar
2. JSON file downloads
3. File name: agents-export-[date].json
4. Contains all non-default agents
```

**Export File Format:**
```json
{
  "version": "1.0",
  "exportDate": "2025-11-19T10:00:00.000Z",
  "agentCount": 2,
  "agents": [
    {
      "name": "Blog Writer",
      "role": "Content Creator",
      "goal": "Write articles",
      "model": "gemini-2.5-flash",
      "taskDescription": "...",
      "expectedOutput": "...",
      "customParameters": [...]
    },
    {
      "name": "Code Reviewer",
      ...
    }
  ]
}
```

### Importing Agents

**Method 1: From Chatbot**
```
1. Ask chatbot to create agent
2. Copy JSON response
3. Click "📥 Import Agents"
4. Paste JSON in text area
5. Click "Import Agents"
6. Validation runs
7. Agents added to collection
```

**Method 2: From File**
```
1. Click "📥 Import Agents"
2. Click "Choose File" button
3. Select .json file
4. File is read and validated
5. Click "Import Agents"
6. Agents added to collection
```

**Method 3: Drag & Drop** (if implemented)
```
1. Open Import modal
2. Drag .json file to drop zone
3. File auto-loads
4. Click "Import Agents"
```

### Import Validation

**Required Fields Check:**
```javascript
✓ name (string, min 3 chars)
✓ role (string, min 3 chars)
✓ goal (string, min 5 chars)
✓ model (valid Gemini model ID)
✓ taskDescription (string)
✓ expectedOutput (string)
```

**Optional Fields:**
```javascript
- customParameters (array)
- description (string)
- tags (array)
```

**Validation Errors:**
```
Common Issues:
├── Invalid JSON format
├── Missing required fields
├── Invalid model ID
├── Duplicate agent names
└── Exceeded parameter limits
```

### Export/Import Workflows

**Export Workflow:**
```json
{
  "version": "1.0",
  "exportDate": "2025-11-19T10:00:00.000Z",
  "workflowCount": 1,
  "workflows": [{
    "name": "Content Pipeline",
    "description": "Full content creation flow",
    "agents": [
      {"agentId": 10, "order": 0},
      {"agentId": 11, "order": 1},
      {"agentId": 12, "order": 2}
    ]
  }]
}
```

**Note on Agent IDs:**
When importing workflows, agent IDs may need to be remapped to match agents in the target system.

---

## Settings & Configuration

### Opening Settings

**Access:**
```
├── Click user avatar → "⚙️ Settings"
├── Settings modal opens
└── Shows current configuration
```

### Settings Sections

**1. User Profile**
```
Editable Fields:
├── Full Name
├── Email Address
└── Company/Organization

Actions:
├── Update Profile (saves to localStorage)
└── Cancel (discard changes)
```

**2. API Configuration**
```
API Key Management:
├── View masked key (AIza•••••••)
├── Update API key (reveals input)
├── Test API connection (validates key)
└── Save new key

Security Note:
- Key stored in localStorage only
- Never transmitted to external servers
- Used only for Gemini API calls
```

**3. Default Model**
```
Model Selection:
├── Choose default Gemini model
├── Applies to new agents
├── Existing agents keep their model
└── Options: All available Gemini models
```

**4. Theme Preferences**
```
Theme Toggle:
├── Light Mode
├── Dark Mode
└── Auto (system preference) - if implemented
```

**5. Storage Management**
```
Storage Info:
├── Number of agents
├── Number of workflows
├── Number of executions
├── Approximate storage used
└── Clear data options

Clear Data:
├── Clear execution history
├── Clear all agents (except default)
├── Clear all workflows
└── Reset entire app (with confirmation)
```

**6. Advanced Settings** (if implemented)
```
├── Export all data (backup)
├── Import data (restore)
├── Auto-save preferences
└── Keyboard shortcuts
```

### Logout Process

**Steps:**
```
1. Click user avatar → "🚪 Logout"
2. Confirmation dialog appears:
   "Are you sure? This will clear your configuration."
3. If confirmed:
   ├── localStorage cleared (userConfig removed)
   ├── IndexedDB remains (data persists)
   ├── Redirect to landing page
   └── Onboarding required to login again
4. If canceled:
   └── Return to dashboard
```

**Data Persistence After Logout:**
```
Cleared:
├── ✗ User configuration (name, email, API key)
└── ✗ Session state

Preserved:
├── ✓ All agents (in IndexedDB)
├── ✓ All workflows
├── ✓ Execution history
└── ✓ Theme preference

Note: To use the app again, you must complete onboarding
with your API key. Your agents will still be there.
```

---

## Technical Architecture

### Technology Stack

**Frontend Framework:**
```
React 19.1.1
├── Functional components
├── Hooks (useState, useEffect, custom hooks)
├── React Router v7 for navigation
└── No class components
```

**State Management:**
```
Zustand 5.0.8
├── Global store (appStore.js)
├── Lightweight alternative to Redux
├── Simple API: create, set, get
└── Persistent theme storage
```

**Styling:**
```
CSS3
├── Custom CSS modules
├── CSS variables for theming
├── Animations with framer-motion
├── Responsive design (mobile blocker <1024px)
└── No CSS frameworks (Bootstrap, Tailwind, etc.)
```

**UI Components:**
```
Framer Motion 12.23.24
├── Page transitions
├── Modal animations
├── Smooth micro-interactions
└── Spring physics

React Icons 5.5.0
├── Icon library
├── Consistent icon set
└── Font Awesome, Material Icons

React Slick 0.31.0
├── Carousel component
├── Features showcase on landing
└── Touch/swipe support
```

**Markdown Rendering:**
```
react-markdown 10.1.0
├── Converts markdown to React components
├── Agent outputs rendered beautifully
└── Safe HTML rendering

react-syntax-highlighter 15.6.6
├── Code block highlighting
├── Multiple language support
└── Theme-aware styling

remark-gfm 4.0.1
├── GitHub Flavored Markdown
├── Tables, task lists, strikethrough
└── Extended markdown features

rehype-raw 7.0.0
├── Raw HTML in markdown
└── Sanitized output
```

**AI Integration:**
```
@google/genai 1.25.0
├── Official Google Gemini SDK (not actively used)
├── Direct REST API calls preferred
└── Fallback option

Custom LLM Service (llmService.js)
├── Direct HTTP calls to Gemini API
├── Custom prompt engineering
├── Parameter extraction
└── Error handling
```

**Data Storage:**
```
IndexedDB (Native Browser API)
├── 4 Object Stores:
│   ├── agents
│   ├── executions
│   ├── workflows
│   └── workflow_executions
├── Asynchronous operations
├── ~50MB storage limit (browser-dependent)
└── Persistent across sessions

localStorage
├── User configuration
├── Theme preference
├── ~5-10MB limit
└── Synchronous API
```

### Project Structure

```
GenAgentX/
├── public/
│   ├── vite.png (logo)
│   └── index.html
├── src/
│   ├── main.jsx (entry point)
│   ├── App.jsx (root component, routing)
│   ├── App.css (global styles)
│   ├── index.css (reset, base styles)
│   │
│   ├── pages/
│   │   ├── Landing.jsx (landing page)
│   │   └── Dashboard.jsx (main app interface)
│   │
│   ├── components/
│   │   ├── LandingPage.jsx (hero, features, CTA)
│   │   ├── LandingPage.css
│   │   ├── Sidebar.jsx (navigation menu)
│   │   ├── Sidebar.css
│   │   ├── AgentCard.jsx (agent display card)
│   │   ├── AgentForm.jsx (create/edit agent form)
│   │   ├── AgentFormModal.jsx (form wrapper modal)
│   │   ├── RunAgentModal.jsx (execute agent interface)
│   │   ├── RunAgentModal.css
│   │   ├── ChatBot.jsx (AI helper chatbot)
│   │   ├── Chatbot.css
│   │   ├── SettingsModal.jsx (user settings)
│   │   ├── ImportAgentsModal.jsx (import UI)
│   │   ├── ImportAgentsModal.css
│   │   ├── OnboardingModal.jsx (first-time setup)
│   │   ├── OnboardingModal.css
│   │   ├── ExecutionHistory.jsx (logs viewer)
│   │   ├── ExecutionHistory.css
│   │   ├── WorkflowsView.jsx (workflows list)
│   │   ├── WorkflowsView.css
│   │   ├── WorkflowBuilder.jsx (create workflows)
│   │   ├── WorkflowBuilder.css
│   │   ├── WorkflowRunner.jsx (execute workflows)
│   │   ├── WorkflowRunner.css
│   │   ├── WorkflowCard.jsx (workflow display)
│   │   ├── WorkflowCard.css
│   │   ├── CustomParametersField.jsx (dynamic params)
│   │   ├── CopyButton.jsx (copy to clipboard)
│   │   ├── MobileBlocker.jsx (mobile warning)
│   │   └── MobileBlocker.css
│   │
│   ├── services/
│   │   ├── indexedDB.js (database operations)
│   │   ├── llmService.js (Gemini API integration)
│   │   ├── chainExecutor.js (workflow execution logic)
│   │   └── exportImportService.js (JSON import/export)
│   │
│   ├── store/
│   │   └── appStore.js (Zustand global state)
│   │
│   └── constants/
│       ├── defaultAgents.js (helper agent config)
│       └── models.js (Gemini model definitions)
│
├── package.json (dependencies, scripts)
├── vite.config.js (build configuration)
├── eslint.config.js (code quality)
├── README.md (project overview)
└── .gitignore
```

### Data Flow Architecture

**1. User Authentication Flow:**
```
Landing Page
    ↓ (User clicks "Get Started")
Onboarding Modal
    ↓ (Collects name, email, API key)
Save to localStorage
    ↓
Initialize IndexedDB
    ↓
Seed Default Agent
    ↓
Redirect to Dashboard
```

**2. Agent Creation Flow:**
```
User Input (Form/Chatbot)
    ↓
Validate Required Fields
    ↓
Generate Agent Object
    ↓
Save to IndexedDB (agents store)
    ↓
Update Zustand State (agents array)
    ↓
Re-render Dashboard
```

**3. Agent Execution Flow:**
```
User Selects Agent
    ↓
Provide Input + Custom Params
    ↓
Build System Prompt
    ↓
Extract Gemini Parameters
    ↓
Get API Key from localStorage
    ↓
POST to Gemini API
    ↓
Parse Response
    ↓
Display Output
    ↓
Save to executions (IndexedDB)
    ↓
Update History View
```

**4. Workflow Execution Flow:**
```
User Selects Workflow
    ↓
Provide Initial Input
    ↓
Load Workflow Config from IndexedDB
    ↓
For Each Agent in Sequence:
    ├── Execute with Input
    ├── Save Result
    ├── Pass Output to Next Agent
    └── If Error → Stop & Show Error
    ↓
Display Final Output
    ↓
Save to workflow_executions (IndexedDB)
```

### State Management (Zustand)

**Global State (appStore.js):**
```javascript
{
  // Data
  agents: [],              // All agents
  userConfig: {},          // User info & API key
  
  // UI State
  theme: 'light',          // 'light' | 'dark'
  isMobile: false,         // Screen size check
  isLoading: true,         // Initial load state
  
  // Modal States
  showFormModal: false,    // Agent form
  showSettings: false,     // Settings modal
  showImportModal: false,  // Import modal
  showOnboarding: false,   // Onboarding flow
  showUserMenu: false,     // User dropdown
  
  // Active Items
  editingAgent: null,      // Agent being edited
  runningAgent: null,      // Agent being executed
  isChatBotOpen: false,    // Chatbot visibility
  
  // Actions (setters, toggles, reset)
}
```

### API Integration

**Gemini API Endpoints:**
```
Base URL:
https://generativelanguage.googleapis.com/v1beta

Endpoint:
POST /models/{model}:generateContent?key={API_KEY}

Request Headers:
{
  "Content-Type": "application/json"
}

Request Body:
{
  "contents": [{
    "parts": [{"text": "Full prompt with context"}]
  }],
  "generationConfig": {
    "temperature": 0.7,
    "topK": 40,
    "topP": 0.95,
    "maxOutputTokens": 8000
  }
}

Response:
{
  "candidates": [{
    "content": {
      "parts": [{"text": "Generated response"}]
    }
  }]
}
```

**Error Handling:**
```javascript
try {
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API failed');
  }
  return parseResponse(response);
} catch (error) {
  console.error('Gemini API Error:', error);
  throw new Error(`Failed: ${error.message}`);
}
```

### IndexedDB Schema

**Database: AgentBuilderDB (v4)**

**Store 1: agents**
```javascript
{
  keyPath: "id" (auto-increment),
  indexes: ["role"],
  structure: {
    id: number,
    name: string,
    role: string,
    goal: string,
    model: string,
    taskDescription: string,
    expectedOutput: string,
    customParameters: array,
    isDefault: boolean (optional),
    createdAt: Date,
    updatedAt: Date (optional)
  }
}
```

**Store 2: executions**
```javascript
{
  keyPath: "id" (UUID),
  indexes: ["agentId", "runAt"],
  structure: {
    id: string (UUID),
    agentId: number,
    agentName: string,
    input: string,
    output: string,
    customParams: object,
    status: "success" | "error",
    error: string (optional),
    runAt: ISO timestamp,
    duration: number (seconds)
  }
}
```

**Store 3: workflows**
```javascript
{
  keyPath: "id" (UUID),
  indexes: ["name", "createdAt"],
  structure: {
    id: string (UUID),
    name: string,
    description: string,
    agents: [
      {agentId: number, order: number}
    ],
    createdAt: ISO timestamp,
    updatedAt: ISO timestamp
  }
}
```

**Store 4: workflow_executions**
```javascript
{
  keyPath: "id" (UUID),
  indexes: ["workflowId", "runAt"],
  structure: {
    id: string (UUID),
    workflowId: string,
    workflowName: string,
    initialInput: string,
    results: [
      {
        step: number,
        agentId: number,
        agentName: string,
        input: string,
        output: string,
        status: "success" | "error",
        error: string (optional)
      }
    ],
    finalOutput: string,
    status: "success" | "error",
    runAt: ISO timestamp,
    totalDuration: number
  }
}
```

---

## Troubleshooting

### Common Issues & Solutions

**1. API Key Not Working**
```
Symptoms:
├── "API Key not found" error
├── "Unauthorized" from Gemini API
└── Agents fail to execute

Solutions:
├── Check API key format (starts with "AIza")
├── Verify key is active in Google AI Studio
├── Check API quota (free tier limits)
├── Update key in Settings → API Configuration
└── Clear browser cache and re-login
```

**2. Agents Not Saving**
```
Symptoms:
├── Create button does nothing
├── Agents disappear after refresh
└── "Failed to save" error

Solutions:
├── Check browser console for errors
├── Verify IndexedDB is enabled in browser
├── Clear IndexedDB and re-initialize
├── Check browser storage limits
└── Try incognito/private mode
```

**3. Chatbot Not Responding**
```
Symptoms:
├── Chatbot sends message but no response
├── Loading spinner indefinitely
└── "Helper agent not available" error

Solutions:
├── Refresh page to reinitialize default agent
├── Check API key is valid
├── Check internet connection
├── Verify Gemini API status
└── Clear cache and reload
```

**4. Workflow Execution Fails**
```
Symptoms:
├── Workflow stops at certain step
├── "Agent not found" error
└── Partial results only

Solutions:
├── Ensure all workflow agents still exist
├── Check if agents were deleted
├── Rebuild workflow with current agents
├── Check agent IDs match
└── Review error in execution history
```

**5. Import Fails**
```
Symptoms:
├── "Invalid JSON format" error
├── "Missing required fields" error
└── Import button disabled

Solutions:
├── Validate JSON with online tool
├── Check for missing quotes or commas
├── Ensure all required fields present
├── Verify model IDs are valid
└── Check file encoding (UTF-8)
```

**6. Mobile Blocker Shows on Desktop**
```
Symptoms:
└── "Desktop Required" message on large screen

Solutions:
├── Refresh browser
├── Resize window (1024px+ width)
├── Check browser zoom level
├── Disable browser extensions
└── Clear cache
```

**7. Theme Not Persisting**
```
Symptoms:
└── Theme resets to default on reload

Solutions:
├── Check localStorage is enabled
├── Disable private/incognito mode
├── Clear cookies and reload
└── Check browser storage settings
```

**8. Execution History Empty**
```
Symptoms:
└── No logs appear after running agents

Solutions:
├── Check if runs completed successfully
├── Verify IndexedDB executions store
├── Clear filters in history view
└── Check browser console for save errors
```

### Browser Compatibility

**Recommended Browsers:**
```
✅ Chrome 90+ (Best performance)
✅ Edge 90+
✅ Firefox 88+
✅ Safari 14+
✅ Opera 76+
```

**Required Features:**
```
✓ IndexedDB support
✓ localStorage support
✓ ES6+ JavaScript
✓ CSS Grid & Flexbox
✓ Fetch API
```

### Performance Optimization

**Tips for Better Performance:**
```
1. Limit execution history to 100-200 entries
2. Clear old logs periodically
3. Use appropriate Gemini models:
   ├── Flash for simple tasks
   ├── Pro for complex reasoning
   └── Lite for speed
4. Reduce maxOutputTokens for faster responses
5. Close chatbot when not in use
6. Limit workflow length to 5-7 agents
```

### Data Backup

**Manual Backup:**
```
1. Export all agents (JSON file)
2. Export all workflows (individual files)
3. Screenshot settings/configuration
4. Save API key securely (password manager)
5. Store backup files in cloud storage
```

**Recovery:**
```
1. Complete onboarding with API key
2. Import agents from backup JSON
3. Import workflows from backup files
4. Execution history cannot be restored
```

---

## Advanced Features

### Custom Parameters Guide

**Parameter Types:**

**1. Text Parameter**
```javascript
{
  key: "author_name",
  value: "John Doe",
  type: "text"
}

Use Cases:
├── Names, titles, descriptions
├── Free-form input
└── Template variables
```

**2. Number Parameter**
```javascript
{
  key: "word_count",
  value: "500",
  type: "number"
}

Use Cases:
├── Limits (words, characters, tokens)
├── Scores, ratings
└── Quantities
```

**3. Select Parameter**
```javascript
{
  key: "tone",
  value: "professional",
  type: "select",
  options: "professional, casual, friendly, formal"
}

Use Cases:
├── Predefined choices
├── Tone, style, format options
└── Boolean (yes/no)
```

**Parameter Best Practices:**
```
✓ Use descriptive key names (snake_case)
✓ Provide sensible default values
✓ Limit select options to 5-7 choices
✓ Document parameter purpose in task description
✗ Avoid special characters in keys
✗ Don't use reserved words (temperature, topp, etc.)
```

### Gemini-Specific Parameters

**Temperature** (0.0 - 2.0)
```
Lower (0.0-0.3): Deterministic, focused
Medium (0.4-0.8): Balanced creativity
Higher (0.9-2.0): Very creative, random
```

**Top-K** (1-40)
```
Controls diversity of token selection
Lower: More focused
Higher: More diverse vocabulary
```

**Top-P** (0.0 - 1.0)
```
Cumulative probability threshold
0.95: Recommended default
Lower: More focused
Higher: More diversity
```

**Max Output Tokens** (1-8192)
```
Maximum response length
Default: 8000
Higher: Longer responses, slower
Lower: Faster, truncated responses
```

### Prompt Engineering Tips

**Effective Task Descriptions:**
```
✓ Be specific about format
✓ Provide step-by-step instructions
✓ Include examples if possible
✓ Define constraints clearly
✓ Specify tone and style
✓ Mention edge cases to avoid

Example:
"Generate a professional email response.
Steps:
1. Greet the recipient warmly
2. Acknowledge their inquiry
3. Provide clear, concise answer
4. Offer additional help
5. Close professionally

Constraints:
- Max 150 words
- Professional tone
- No jargon
- Include call-to-action"
```

**Expected Output Descriptions:**
```
✓ Describe structure (bullets, paragraphs, etc.)
✓ Specify length requirements
✓ Mention formatting (bold, code blocks)
✓ Define success criteria

Example:
"A well-formatted email with:
- Clear subject line
- 3-4 short paragraphs
- Professional signature
- No spelling errors
- Actionable next steps"
```

---

## Keyboard Shortcuts (Future Enhancement)

```
Global:
├── Ctrl/Cmd + K: Open chatbot
├── Ctrl/Cmd + N: Create new agent
├── Ctrl/Cmd + ,: Open settings
└── Esc: Close modals

Workflow Builder:
├── Arrow Up/Down: Reorder selected agent
├── Delete: Remove selected agent
└── Ctrl/Cmd + S: Save workflow
```

---

## Security & Privacy

### Data Privacy

**What is Stored Locally:**
```
localStorage:
├── User name, email, company
├── Google Gemini API key
└── Theme preference

IndexedDB:
├── All agent configurations
├── Workflow definitions
├── Execution history
└── Workflow execution logs
```

**What is NOT Stored:**
```
✗ No server-side storage
✗ No analytics tracking
✗ No user behavior logging
✗ No cookies (except essential)
✗ No third-party integrations
```

**API Key Security:**
```
✓ Stored in localStorage only
✓ Never sent to any server except Gemini API
✓ HTTPS connection to Gemini
✓ Can be changed anytime in settings
✓ Cleared on logout

⚠️ Warning:
- Do not share your API key
- Do not commit to version control
- Rotate key if compromised
```

### Best Practices

**1. API Key Management:**
```
✓ Use dedicated key for GenAgentX
✓ Set usage quotas in Google Cloud
✓ Monitor API usage regularly
✓ Rotate keys monthly
✓ Revoke if unused
```

**2. Data Backup:**
```
✓ Export agents weekly
✓ Save exports to secure location
✓ Document important workflows
✓ Keep API key in password manager
```

**3. Browser Security:**
```
✓ Use updated browser
✓ Enable browser security features
✓ Clear cache periodically
✓ Use strong device password
✓ Logout on shared computers
```

---

## Development & Deployment

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Access at http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment (GitHub Pages)

```bash
# Configure in vite.config.js
base: '/GenAgentX/'

# Build and deploy
npm run deploy

# This runs:
# 1. npm run build (creates dist/)
# 2. gh-pages -d dist (deploys to gh-pages branch)
```

### Environment Variables

```bash
# .env (for local development)
VITE_GEMINI_API_KEY=your_api_key_here

# Not needed for production
# Users provide key during onboarding
```

---

## FAQ

**Q: Do I need a paid Gemini API key?**
A: No, the free tier is sufficient for most users. You get generous quotas.

**Q: Can I use this offline?**
A: No, you need internet to call the Gemini API. However, the UI loads offline after first visit.

**Q: Is my data safe?**
A: Yes, everything is stored locally in your browser. No data leaves your device except API calls to Gemini.

**Q: Can I use on mobile?**
A: Not yet. The app requires a screen width of 1024px or larger.

**Q: How many agents can I create?**
A: Limited only by browser storage (~50MB). Typically hundreds of agents.

**Q: Can I share agents with others?**
A: Yes, use the export feature to generate a JSON file, then share it.

**Q: What if I forget my API key?**
A: You can update it in Settings → API Configuration. Get a new one from Google AI Studio.

**Q: Can I delete the default agent?**
A: No, it's required for the chatbot helper. But it doesn't count against your quota.

**Q: Do workflows require all agents?**
A: Yes, all agents in a workflow must exist. If you delete an agent, remove it from workflows first.

**Q: How long is execution history kept?**
A: Forever, until you manually clear it or reset the app.

**Q: Can I run the same workflow multiple times?**
A: Yes, with different inputs each time. All runs are logged.

---

## Conclusion

GenAgentX empowers you to build sophisticated AI agents and workflows without writing a single line of code. With Google Gemini's power, local storage privacy, and an intuitive interface, you can create anything from simple content generators to complex multi-agent pipelines.

**Next Steps:**
1. Get your free Gemini API key
2. Complete onboarding
3. Experiment with the chatbot helper
4. Create your first agent
5. Build a workflow
6. Share your creations!

For support, issues, or contributions:
- GitHub: https://github.com/suhas991/GenAgentX
- Issues: https://github.com/suhas991/GenAgentX/issues
- Docs: This file

Happy building! 🚀
