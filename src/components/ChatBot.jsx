// src/components/ChatBot.jsx
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const ChatBot = ({ isOpen, onToggle, onSendMessage, agentName }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! 👋 I'm the **Agent Builder Assistant**. 

I can help you create well-structured AI agents. Just describe what you want!

**Examples:**
- "I need an agent that writes marketing emails"
- "Create an agent for data analysis"
- "Help me build a customer support agent"`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    setIsLoading(true);
    
    try {
      const response = await onSendMessage(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `⚠️ **Error:** ${error.message}\n\nPlease try again or rephrase your request.` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Chat cleared! 🗑️\n\nHow can I help you build an agent today?`
      }
    ]);
  };

  // Helper to copy message content
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <button 
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={onToggle}
        title="Agent Builder Assistant"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
        {!isOpen && <span className="chatbot-badge">AI Helper</span>}
      </button>

      <div className={`chatbot-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-header-content">
            <div className="chatbot-avatar">🤖</div>
            <div className="chatbot-title">
              <h3>{agentName}</h3>
              <span className="chatbot-status">
                <span className="status-dot"></span>
                Online
              </span>
            </div>
          </div>
          <div className="chatbot-actions">
            <button 
              className="chatbot-action-btn" 
              onClick={handleClearChat}
              title="Clear chat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
            <button 
              className="chatbot-action-btn" 
              onClick={onToggle}
              title="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div className="chatbot-messages">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`chat-message ${message.role}`}
            >
              {message.role === 'assistant' && (
                <div className="message-avatar">🤖</div>
              )}
              <div className="message-content">
                <div className="message-bubble">
                  {message.role === 'assistant' ? (
                    <ReactMarkdown
                      components={{
                        // Style headers
                        h1: ({node, ...props}) => <h1 className="md-h1" {...props} />,
                        h2: ({node, ...props}) => <h2 className="md-h2" {...props} />,
                        h3: ({node, ...props}) => <h3 className="md-h3" {...props} />,
                        // Style lists
                        ul: ({node, ...props}) => <ul className="md-ul" {...props} />,
                        ol: ({node, ...props}) => <ol className="md-ol" {...props} />,
                        li: ({node, ...props}) => <li className="md-li" {...props} />,
                        // Style code
                        code: ({node, inline, ...props}) => 
                          inline ? 
                            <code className="md-code-inline" {...props} /> : 
                            <code className="md-code-block" {...props} />,
                        // Style paragraphs
                        p: ({node, ...props}) => <p className="md-p" {...props} />,
                        // Style strong/bold
                        strong: ({node, ...props}) => <strong className="md-strong" {...props} />,
                        // Style links
                        a: ({node, ...props}) => <a className="md-link" target="_blank" rel="noopener noreferrer" {...props} />,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <span>{message.content}</span>
                  )}
                </div>
                {message.role === 'assistant' && (
                  <button
                    className="copy-message-btn"
                    onClick={() => copyToClipboard(message.content)}
                    title="Copy message"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                )}
              </div>
              {message.role === 'user' && (
                <div className="message-avatar user">👤</div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="chat-message assistant">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="message-bubble typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input-container">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe the agent you want to build..."
            rows="1"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="chatbot-send-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>

        <div className="chatbot-footer">
          <span>💡 Tip: Responses are formatted in Markdown</span>
        </div>
      </div>

      {isOpen && <div className="chatbot-overlay" onClick={onToggle}></div>}
    </>
  );
};

export default ChatBot;
