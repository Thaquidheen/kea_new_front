// src/components/PDFViewer/PDFViewer.jsx

import React, { useState } from 'react';
import './PDFViewer.css';

const PDFViewer = ({ pdfUrl }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError('Failed to load PDF. Please try another viewing option.');
  };

  return (
    <div className="pdf-viewer">
      {loading && (
        <div className="pdf-loading">
          <div className="loading-spinner"></div>
          <p>Loading PDF...</p>
        </div>
      )}
      
      {error && (
        <div className="pdf-error">
          <p>{error}</p>
        </div>
      )}
      
      <iframe
        src={pdfUrl}
        className="pdf-iframe"
        title="Membership Card PDF"
        onLoad={handleLoad}
        onError={handleError}
      ></iframe>
    </div>
  );
};

export default PDFViewer;