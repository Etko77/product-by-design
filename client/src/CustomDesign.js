import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThreeDVisualization from './three';
import './3d.css';

const CustomDesign = () => {
  const [activeTab, setActiveTab] = useState('visualization');
  const [measurements, setMeasurements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/measurements');
        if (!response.ok) {
          throw new Error('Failed to fetch measurements');
        }
        const data = await response.json();
        
        // Get the most recent measurements
        if (data && data.length > 0) {
          const latestMeasurements = data[data.length - 1].measurements;
          setMeasurements(latestMeasurements);
        } else {
          throw new Error('No measurements found');
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMeasurements();
  }, []);

  const handleDownload = () => {
    // TODO: Implement 3D model download functionality
    alert('3D model download functionality will be implemented soon!');
  };

  // Format measurement labels for display
  const formatLabel = (key) => {
    const labels = {
      chest: 'Chest Width',
      shoulder: 'Shoulder Width',
      sleeve: 'Sleeve Length',
      length: 'T-Shirt Length',
      neck: 'Neck Size'
    };
    return labels[key] || key;
  };

  if (loading) {
    return <div className="loading">Loading measurements...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <h3>Error</h3>
        <p>{error}</p>
        <Link to="/" className="back-link">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="custom-design-container">
      <h2>Your Custom T-Shirt Design</h2>
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'visualization' ? 'active' : ''}`}
          onClick={() => setActiveTab('visualization')}
        >
          3D Visualization
        </button>
        <button
          className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Measurement Details
        </button>
      </div>

      {activeTab === 'visualization' ? (
        <div className="visualization-container">
          <div className="controls-info">
            <p>3D Model Controls:</p>
            <ul>
              <li>Left Mouse Button: Rotate</li>
              <li>Right Mouse Button: Pan</li>
              <li>Mouse Wheel: Zoom</li>
            </ul>
          </div>
          {measurements && (
            <div style={{ width: '100%', height: '500px', marginTop: '20px' }}>
              <ThreeDVisualization measurements={measurements} />
            </div>
          )}
        </div>
      ) : (
        <div className="measurements-display">
          <h3>Your T-Shirt Measurements</h3>
          <div className="measurements-grid">
            {measurements && Object.entries(measurements).map(([key, value]) => (
              <div key={key} className="measurement-item">
                <span className="label">{formatLabel(key)}</span>
                <span className="value">{value} cm</span>
              </div>
            ))}
          </div>
          <div className="measurement-actions">
            <Link to="/" className="edit-link">Edit Measurements</Link>
            <button onClick={handleDownload} className="download-button">
              Download 3D Model
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDesign;

