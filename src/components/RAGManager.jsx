import React, { useState, useEffect } from 'react';
import { FaUpload, FaTrash, FaFile, FaSpinner } from 'react-icons/fa';
import { 
  addDocument, 
  getAgentDocuments, 
  deleteDocument 
} from '../services/vectorStore';
import { parseFile, isFileSupported, getSupportedExtensions } from '../services/fileParser';
import './RAGManager.css';

const RAGManager = ({ agent, onUpdate }) => {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  // Get API key from localStorage
  const getApiKey = () => {
    const userConfig = localStorage.getItem('userConfig');
    if (userConfig) {
      try {
        const config = JSON.parse(userConfig);
        return config.apiKey;
      } catch (error) {
        console.error('Error parsing user config:', error);
      }
    }
    return null;
  };

  useEffect(() => {
    if (agent?.id) {
      loadDocuments();
    }
  }, [agent?.id]);

  const loadDocuments = async () => {
    if (!agent?.id) return;
    try {
      const docs = await getAgentDocuments(agent.id);
      setDocuments(docs);
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const apiKey = getApiKey();
    if (!apiKey) {
      alert('API key not found. Please configure your API key in settings.');
      return;
    }

    // Check if file type is supported
    if (!isFileSupported(file)) {
      const extensions = getSupportedExtensions().join(', ');
      alert(`Unsupported file type.\n\nSupported formats:\n${extensions}`);
      return;
    }

    setUploading(true);
    setUploadProgress(`Reading ${file.name}...`);

    try {
      // Parse file based on type
      const content = await parseFile(file);
      
      if (!content || content.trim().length === 0) {
        throw new Error('No text content could be extracted from the file');
      }
      
      setUploadProgress(`Processing and creating embeddings...`);
      const chunksAdded = await addDocument(
        agent.id, 
        file.name, 
        content, 
        apiKey
      );

      setUploadProgress(`✓ Added ${chunksAdded} chunks from ${file.name}`);
      await loadDocuments();
      
      setTimeout(() => {
        setUploadProgress('');
        setUploading(false);
      }, 2000);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadProgress(`Error: ${error.message}`);
      setTimeout(() => {
        setUploading(false);
      }, 3000);
    }
  };

  const handleDeleteDocument = async (filename) => {
    if (!window.confirm(`Delete ${filename}?`)) return;

    try {
      await deleteDocument(agent.id, filename);
      await loadDocuments();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const toggleRAG = () => {
    if (!agent) return;
    onUpdate({
      ...agent,
      ragEnabled: !agent.ragEnabled
    });
  };

  // Don't render if agent is not provided
  if (!agent) {
    return null;
  }

  return (
    <div className="rag-manager">
      <div className="rag-header">
        <h3>📚 Knowledge Base (RAG)</h3>
        <label className="rag-toggle">
          <input
            type="checkbox"
            checked={agent.ragEnabled || false}
            onChange={toggleRAG}
          />
          <span className="toggle-slider"></span>
          <span className="toggle-label">
            {agent.ragEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      </div>

      {agent.ragEnabled && (
        <>
          <div className="rag-upload-section">
            <label className="upload-button">
              <FaUpload />
              <span>Upload Document</span>
              <input
                type="file"
                accept=".pdf,.docx,.xlsx,.xls,.csv,.html,.htm,.rtf,.txt,.md,.json,.xml,.js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.h,.css"
                onChange={handleFileUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
            </label>
            {uploadProgress && (
              <div className="upload-progress">
                {uploading && <FaSpinner className="spinner" />}
                {uploadProgress}
              </div>
            )}
            <p className="supported-formats">
              📄 Supported: PDF, Word, Excel, CSV, HTML, RTF, Text, Markdown, Code files
            </p>
          </div>

          <div className="rag-documents-list">
            <h4>Uploaded Documents ({documents.length})</h4>
            {documents.length === 0 ? (
              <p className="no-documents">No documents uploaded yet</p>
            ) : (
              <ul>
                {documents.map((doc, index) => (
                  <li key={index} className="document-item">
                    <FaFile />
                    <div className="document-info">
                      <span className="document-name">{doc.filename}</span>
                      <span className="document-meta">
                        {doc.chunks} chunks
                      </span>
                    </div>
                    <button
                      className="delete-doc-btn"
                      onClick={() => handleDeleteDocument(doc.filename)}
                      title="Delete document"
                    >
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rag-settings">
            <label>
              Top K Results:
              <input
                type="number"
                min="1"
                max="10"
                value={agent.ragTopK || 3}
                onChange={(e) => onUpdate({
                  ...agent,
                  ragTopK: parseInt(e.target.value)
                })}
              />
            </label>
          </div>
        </>
      )}
    </div>
  );
};

export default RAGManager;