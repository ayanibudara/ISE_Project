const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const appointmentRoutes = require('./Routes/Appoinment/appointmentRoutes.js');

const guideAssignRoutes = require('./Routes/guideAssignRoutes.js');
//newly addedd

const router = express.Router();

// Load environment variables/
dotenv.config();

const app = express();

//app.use("/guideassign", assignroutes);
// Middleware (example)
app.use(express.json());
//newly addedd

//MongoDB connect
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


// Routes
app.use("/guideassign", guideAssignRoutes);

app.use('/api/appointments', appointmentRoutes);
app.get('/', (req, res) => {
  res.send('Hello from Express backend!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
