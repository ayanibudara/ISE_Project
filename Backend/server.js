const express = require('express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
  
// Middleware (example)
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello from Express backend!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
