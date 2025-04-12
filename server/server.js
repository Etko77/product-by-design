const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory store for simplicity (would use a database in production)
let userMeasurements = [];

// Validation middleware
const validateMeasurements = (req, res, next) => {
  const { measurements } = req.body;
  
  if (!measurements) {
    return res.status(400).json({ error: 'Measurements are required' });
  }

  // Add more validation as needed based on your measurement structure
  if (typeof measurements !== 'object') {
    return res.status(400).json({ error: 'Measurements must be an object' });
  }

  next();
};

// Routes
app.post('/api/measurements', validateMeasurements, (req, res) => {
  try {
    const { measurements } = req.body;
    userMeasurements.push({
      id: Date.now(), // Simple unique ID
      measurements,
      timestamp: new Date().toISOString()
    });
    
    res.status(201).json({
      message: 'Measurements saved successfully',
      data: measurements
    });
  } catch (error) {
    console.error('Error saving measurements:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/measurements', (req, res) => {
  try {
    res.json(userMeasurements);
  } catch (error) {
    console.error('Error fetching measurements:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Start server with error handling
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Trying port ${port + 1}`);
    server.listen(port + 1);
  } else {
    console.error('Server error:', err);
  }
});
