// src/components/RunAgentModal.jsx
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import CopyButton from "./CopyButton";
import { GEMINI_MODELS, getModelName } from "../constants/models";
import "./RunAgentModal.css";
import { saveExecutionLog } from "../services/indexedDB";

const RunAgentModal = ({ agent, onRun, onClose }) => {
  const [input, setInput] = useState("");
  const [customParamValues, setCustomParamValues] = useState({});
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(agent.model);
  const [error, setError] = useState(null); // Added error state

  React.useEffect(() => {
    const defaults = {};
    agent.customParameters?.forEach((param) => {
      defaults[param.key] = param.value;
    });
    setCustomParamValues(defaults);
  }, [agent]);

  const handleParamChange = (key, value) => {
    setCustomParamValues((prev) => ({ ...prev, [key]: value }));
  };

  const parseErrorMessage = (errorMessage) => {
    // Check for quota exceeded error
    if (
      errorMessage.includes("quota") ||
      errorMessage.includes("Quota exceeded")
    ) {
      const retryMatch = errorMessage.match(/retry in ([\d.]+)s/i);
      const retrySeconds = retryMatch
        ? Math.ceil(parseFloat(retryMatch[1]))
        : null;

      return {
        type: "quota",
        title: "⏳ Rate Limit Reached",
        message: retrySeconds
          ? `Please wait ${retrySeconds} seconds before trying again, or switch to a different model.`
          : "You have reached the rate limit. Please wait a moment or switch to a different model.",
        retryIn: retrySeconds,
      };
    }

    // Check for API key errors
    if (
      errorMessage.includes("API key") ||
      errorMessage.includes("VITE_GEMINI_API_KEY")
    ) {
      return {
        type: "auth",
        title: "🔑 API Key Not Configured",
        message: "Please add your Gemini API key in Settings.",
        retryIn: null,
      };
    }

    // Check for invalid API key
    if (errorMessage.includes("invalid") && errorMessage.includes("key")) {
      return {
        type: "auth",
        title: "❌ Invalid API Key",
        message:
          "Your API key appears to be invalid. Please check your Settings and update it.",
        retryIn: null,
      };
    }

    // Check for network errors
    if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
      return {
        type: "network",
        title: "🌐 Network Error",
        message:
          "Unable to connect to Gemini API. Please check your internet connection and try again.",
        retryIn: null,
      };
    }

    // Check for model not found
    if (errorMessage.includes("model") && errorMessage.includes("not found")) {
      return {
        type: "model",
        title: "🤖 Model Not Available",
        message:
          "The selected model is not available. Please try a different model.",
        retryIn: null,
      };
    }

    // Generic error
    return {
      type: "error",
      title: "⚠️ Error",
      message:
        errorMessage.length > 200
          ? errorMessage.substring(0, 200) + "..."
          : errorMessage,
      retryIn: null,
    };
  };

  const handleRun = async () => {
    setLoading(true);
    setOutput("");
    setError(null);

    try {
      const agentWithModel = { ...agent, model: selectedModel };
      const result = await onRun(agentWithModel, input, customParamValues);
      setOutput(result);

      // 💡 Log execution with actual output
      await saveExecutionLog({
        agentId: agent.id,
        agentName: agent.name,
        runAt: new Date().toISOString(),
        input: input, // Make sure input is defined
        output: result, // Use result, not output state
        params: customParamValues,
        model: selectedModel,
        status: "success",
      });
    } catch (error) {
      console.error("Run error:", error);
      setError(error.message || "An error occurred");

      // Also log errors
      await saveExecutionLog({
        agentId: agent.id,
        agentName: agent.name,
        runAt: new Date().toISOString(),
        input: input,
        output: error.message || "Error occurred",
        params: customParamValues,
        model: selectedModel,
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderParameterInput = (param) => {
    if (param.type === "select") {
      const options = param.options?.split(",").map((opt) => opt.trim()) || [];
      return (
        <select
          value={customParamValues[param.key] || ""}
          onChange={(e) => handleParamChange(param.key, e.target.value)}
          className="custom-param-input"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={param.type === "number" ? "number" : "text"}
        value={customParamValues[param.key] || ""}
        onChange={(e) => handleParamChange(param.key, e.target.value)}
        placeholder={param.value}
        step={param.type === "number" ? "0.1" : undefined}
        className="custom-param-input"
      />
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modern"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2>{agent.name}</h2>
            <p className="modal-subtitle">
              <span className="subtitle-role">{agent.role}</span>
              <span className="subtitle-divider">•</span>
              <span>{agent.goal}</span>
            </p>
          </div>
          <button onClick={onClose} className="close-btn">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Model Selector */}
          <div className="form-group">
            <label>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{
                  display: "inline",
                  marginRight: "8px",
                  verticalAlign: "middle",
                }}
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
              Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="model-selector"
            >
              {GEMINI_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} - {model.description}
                </option>
              ))}
            </select>
            {selectedModel !== agent.model && (
              <div className="model-change-notice">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>
                  Using different model than agent default (
                  {getModelName(agent.model)})
                </span>
              </div>
            )}
          </div>

          {agent.customParameters && agent.customParameters.length > 0 && (
            <div className="custom-params-runtime">
              <h3>Parameters</h3>
              <div className="params-grid">
                {agent.customParameters.map((param) => (
                  <div key={param.key} className="param-field">
                    <label>{param.key}</label>
                    {renderParameterInput(param)}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Input</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your input for the agent..."
              rows="4"
              className="input-textarea"
            />
          </div>

          <button
            onClick={handleRun}
            disabled={!input || loading}
            className="btn-run-primary"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span>Run Agent</span>
              </>
            )}
          </button>

          {/* Error Display - Replace existing error section with this */}
          {error && (
            <div className="error-section">
              <div className={`error-box ${error.type}`}>
                {/* <div className="error-icon">
            {error.type === 'quota' && '⏳'}
            {error.type === 'auth' && '🔑'}
            {error.type === 'network' && '🌐'}
            {error.type === 'model' && '🤖'}
            {error.type === 'error' && '⚠️'}
          </div> */}

                <div className="error-content">
                  <h3 className="error-title">{error.title}</h3>
                  <p className="error-message">{error.message}</p>

                  {error.type === "quota" && (
                    <div className="error-actions">
                      <div className="suggestion-box">
                        💡 <strong>Suggestion:</strong> Try using a different
                        model to continue working
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setError(null)}
                  className="error-close-btn"
                  title="Dismiss"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Output Display */}
          {output && !error && (
            <div className="output-section">
              <div className="output-header">
                <h3>Output</h3>
                <CopyButton text={output} />
              </div>
              <div className="output-content-markdown">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className="md-h1" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="md-h2" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="md-h3" {...props} />
                    ),
                    h4: ({ node, ...props }) => (
                      <h4 className="md-h4" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="md-p" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="md-ul" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="md-ol" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="md-li" {...props} />
                    ),
                    code: ({ node, inline, className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{
                            margin: "16px 0",
                            borderRadius: "8px",
                            fontSize: "13px",
                          }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="md-code-inline" {...props}>
                          {children}
                        </code>
                      );
                    },
                    blockquote: ({ node, ...props }) => (
                      <blockquote className="md-blockquote" {...props} />
                    ),
                    table: ({ node, ...props }) => (
                      <table className="md-table" {...props} />
                    ),
                    thead: ({ node, ...props }) => (
                      <thead className="md-thead" {...props} />
                    ),
                    tbody: ({ node, ...props }) => (
                      <tbody className="md-tbody" {...props} />
                    ),
                    tr: ({ node, ...props }) => (
                      <tr className="md-tr" {...props} />
                    ),
                    th: ({ node, ...props }) => (
                      <th className="md-th" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                      <td className="md-td" {...props} />
                    ),
                    a: ({ node, ...props }) => (
                      <a
                        className="md-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="md-strong" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                      <em className="md-em" {...props} />
                    ),
                    hr: ({ node, ...props }) => (
                      <hr className="md-hr" {...props} />
                    ),
                  }}
                >
                  {output}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RunAgentModal;
