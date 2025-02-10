const express = require('express');
const { geoToH3 } = require('h3-js'); // Destructure geoToH3 from h3-js

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse query parameters
app.use(express.urlencoded({ extended: true }));

// GET endpoint for H3 index conversion
app.get('/api/h3', (req, res) => {
  try {
    // Validate required parameters
    const { lat, lng, resolution } = req.query;
    if (!lat || !lng || !resolution) {
      return res.status(400).json({ error: 'Missing required parameters: lat, lng, resolution' });
    }

    // Convert parameters to numbers
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const resLevel = parseInt(resolution, 10);

    // Validate parameter ranges
    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      return res.status(400).json({ error: 'Invalid latitude value (must be between -90 and 90)' });
    }
    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      return res.status(400).json({ error: 'Invalid longitude value (must be between -180 and 180)' });
    }
    if (isNaN(resLevel) || resLevel < 0 || resLevel > 15) {
      return res.status(400).json({ error: 'Invalid resolution value (must be integer between 0 and 15)' });
    }

    // Generate H3 index using the geoToH3 function.
    const h3Index = geoToH3(latitude, longitude, resLevel);

    // Return successful response
    res.json({ h3Index });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
