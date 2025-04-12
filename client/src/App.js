import React, { useState } from 'react';
import './App.css';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import CustomDesign from './CustomDesign';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [measurements, setMeasurements] = useState({ 
    chest: '', 
    shoulder: '', 
    sleeve: '', 
    length: '', 
    neck: '' 
  });
  const [status, setStatus] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setMeasurements({
        ...measurements,
        [e.target.name]: value,
      });
    }
  };

  const validateMeasurements = () => {
    if (!measurements.chest || !measurements.shoulder || !measurements.sleeve || 
        !measurements.length || !measurements.neck) {
      setError('Please fill in all measurements');
      return false;
    }
    if (measurements.chest <= 0 || measurements.shoulder <= 0 || measurements.sleeve <= 0 || 
        measurements.length <= 0 || measurements.neck <= 0) {
      setError('Measurements must be greater than 0');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateMeasurements()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/measurements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ measurements }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error saving measurements');
      }

      setStatus('Measurements saved successfully!');
      setSaved(true);
      setMeasurements({ chest: '', shoulder: '', sleeve: '', length: '', neck: '' });
      
      // Automatically redirect to the custom design page after a short delay
      setTimeout(() => {
        navigate('/custom-design');
      }, 1500);
    } catch (err) {
      setError(err.message);
      setStatus('Error saving measurements');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>ProductByDesign</h1>

      <Routes>
        <Route path="/" element={
          !saved ? (
            <div className="measurements-form">
              <h2>T-Shirt Measurements</h2>
              <p className="form-description">Enter your t-shirt measurements in centimeters</p>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>
                    Chest Width (cm):
                    <input
                      type="number"
                      name="chest"
                      value={measurements.chest}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      placeholder="Enter chest width"
                    />
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    Shoulder Width (cm):
                    <input
                      type="number"
                      name="shoulder"
                      value={measurements.shoulder}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      placeholder="Enter shoulder width"
                    />
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    Sleeve Length (cm):
                    <input
                      type="number"
                      name="sleeve"
                      value={measurements.sleeve}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      placeholder="Enter sleeve length"
                    />
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    T-Shirt Length (cm):
                    <input
                      type="number"
                      name="length"
                      value={measurements.length}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      placeholder="Enter t-shirt length"
                    />
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    Neck Size (cm):
                    <input
                      type="number"
                      name="neck"
                      value={measurements.neck}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      placeholder="Enter neck size"
                    />
                  </label>
                </div>
                <button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Measurements'}
                </button>
              </form>
              {error && <div className="error-message">{error}</div>}
            </div>
          ) : (
            <div className="success-message">
              <h2>Your measurements are saved!</h2>
              <p>Redirecting to your custom design...</p>
              <div className="loading-spinner"></div>
            </div>
          )
        } />
        <Route path="/custom-design" element={<CustomDesign />} />
      </Routes>
      
      {status && <p className="status-message">{status}</p>}
    </div>
  );
}

export default App;
