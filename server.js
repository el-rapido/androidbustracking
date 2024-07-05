const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const WebSocket = require('ws');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

const db = new sqlite3.Database('C:/Users/preci/location-tracker/locations.db');

db.run(`
  CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    busId INTEGER NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

let nextBusId = 1;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files (HTML, JS, CSS)
app.use(express.static('public'));

// Endpoint to assign a unique bus ID
app.get('/assignBusId', (req, res) => {
  const busId = nextBusId++;
  res.json({ busId });
  console.log(`Assigned bus ID: ${busId}`);
});

// Endpoint to receive location data
app.post('/location', (req, res) => {
  const { busId, latitude, longitude } = req.body;
  if (busId && latitude && longitude) {
    const timestamp = new Date().toISOString();
    db.run(
      'INSERT INTO locations (busId, latitude, longitude, timestamp) VALUES (?, ?, ?, ?)',
      [busId, latitude, longitude, timestamp],
      function (err) {
        if (err) {
          console.error(err.message);
          res.status(500).send('Failed to store location data');
        } else {
          const location = {
            id: this.lastID,
            busId,
            latitude,
            longitude,
            timestamp,
          };
          console.log(`Received location: ${busId}, ${latitude}, ${longitude}`);

          // Broadcast location update to all connected WebSocket clients
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(location));
            }
          });

          res.status(200).send('Location received');
        }
      }
    );
  } else {
    res.status(400).send('Invalid location data');
  }
});

// Endpoint to serve stored locations
app.get('/locations', (req, res) => {
  const { busId } = req.query;
  let query = 'SELECT * FROM locations';
  const params = [];

  if (busId) {
    query += ' WHERE busId = ?';
    params.push(busId);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).send('Failed to retrieve locations');
      console.error(err.message);
    } else {
      res.json(rows);
      console.log('Locations sent:', rows);
    }
  });
});

// Create HTTP server and WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
