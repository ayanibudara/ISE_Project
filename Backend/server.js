const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const appointmentRoutes = require('./Routes/Appoinment/appointmentRoutes.js');

// Load environment variables
dotenv.config();


// Import routes
const authRoutes = require('./Routes/auth');
const adminRoutes = require('./Routes/admin');
const appointmentRoutes = require('./Routes/Appoinment/appointmentRoutes');
const guideRoutes = require('./Routes/Guide/guideRoute');

// Initialize express app

const app = express();

// Middleware (example)
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/myDatabase';


mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});


// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'tourist_management_secret_key_2024',
  resave: false,
  saveUninitialized: false,
  name: 'tourist.sid',
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  }
}));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));


// Routes
app.use('/api/appointments', appointmentRoutes);
app.get('/', (req, res) => {
  res.send('Hello from Express backend!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//tttt