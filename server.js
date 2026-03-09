const express = require('express');
const connectDB = require('./db');
const dotenv = require('dotenv');
const cors = require('cors');

// Load env vars
dotenv.config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow us to accept JSON data in the body

// Define a simple route to check if the server is up
app.get('/', (req, res) => res.send('E-Vidyalaya API Running'));

// Define API Routes
app.use('/api/auth', require('./routes/auth'));
// Add other routes here in the future, e.g.:
// app.use('/api/students', require('./routes/students'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));