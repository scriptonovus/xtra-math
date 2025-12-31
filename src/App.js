import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [showCompiledCode, setShowCompiledCode] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      const fileList = await ipcRenderer.invoke('get-files');
      setFiles(fileList);
    } else {
      // Development mode - fetch from server directly
      try {
        const response = await fetch('http://localhost:3001/api/files');
        if (response.ok) {
          const fileList = await response.json();
          setFiles(fileList);
        }
      } catch (error) {
        console.error('Error loading files:', error);
      }
    }
  };

  const selectFile = async (filename) => {
    setSelectedFile(filename);
    setShowCompiledCode(false);
    
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      const content = await ipcRenderer.invoke('read-file', filename);
      if (content !== null) {
        setFileContent(content);
      }
    } else {
      // Development mode - fetch from server directly
      try {
        const response = await fetch(`http://localhost:3001/api/files/${filename}`);
        if (response.ok) {
          const data = await response.json();
          setFileContent(data.content);
        }
      } catch (error) {
        console.error('Error loading file:', error);
        setFileContent('Error loading file content');
      }
    }
  };

  const isCompiledCode = (filename) => {
    const compiledExtensions = ['.exe', '.dll', '.so', '.dylib', '.bin', '.obj', '.o'];
    return compiledExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  };

  const downloadFile = (filename) => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.invoke('download-file', filename);
    } else {
      // Development mode - download from server directly
      window.open(`http://localhost:3001/api/download/${filename}`, '_blank');
    }
  };

  const renderContent = () => {
    if (!selectedFile) return <div className="placeholder">Select a file to view</div>;
    
    if (isCompiledCode(selectedFile) && !showCompiledCode) {
      return (
        <div className="compiled-code-notice">
          <h2>THIS IS COMPILED CODE</h2>
          <p>File: {selectedFile}</p>
          <button 
            className="read-button" 
            onClick={() => setShowCompiledCode(true)}
          >
            READ
          </button>
        </div>
      );
    }
    
    if (selectedFile.endsWith('.md')) {
      return (
        <div 
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: marked(fileContent) }}
        />
      );
    }
    
    return <pre className="file-content">{fileContent}</pre>;
  };

  const minimizeWindow = () => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.invoke('minimize-window');
    }
  };

  const maximizeWindow = () => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.invoke('maximize-window');
    }
  };

  const closeWindow = () => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.invoke('close-window');
    } else {
      window.close();
    }
  };

  return (
    <div className="app">
      <div className="title-bar">
        <div className="title-bar-left">
          <span>SCRIPTO PROJECTS v1.0</span>
        </div>
        <div className="title-bar-right">
          <button onClick={minimizeWindow} className="window-button minimize"></button>
          <button onClick={maximizeWindow} className="window-button maximize"></button>
          <button onClick={closeWindow} className="window-button close"></button>
        </div>
      </div>

      <div className="main-content">
        <div className="sidebar">
          <div className="sidebar-header">
            <h2>PROJECT FILES</h2>
          </div>
          <div className="file-list">
            {files.map((file, index) => (
              <div
                key={index}
                className={`file-item ${selectedFile === file.name ? 'selected' : ''}`}
                onClick={() => selectFile(file.name)}
              >
                <span className="file-name">{file.name}</span>
                <button
                  className="download-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadFile(file.name);
                  }}
                >
                  DOWNLOAD
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="content-area">
          <div className="content-header">
            <h2>{selectedFile || 'NO FILE SELECTED'}</h2>
          </div>
          <div className="content-body">
            {renderContent()}
          </div>
        </div>
      </div>

      <div className="status-bar">
        <span>FILES: {files.length}</span>
        <span>{selectedFile ? `VIEWING: ${selectedFile}` : 'NO FILE SELECTED'}</span>
      </div>
    </div>
  );
}

export default App;
