const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());          // allow frontend requests
app.use(express.json());  // parse JSON body

// Example API route
app.get('/api/hello', (req, res) => {
  res.json({ msg: "Hello from Express backend 🚀" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});