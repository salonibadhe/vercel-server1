import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const axios = require('axios');

import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import examRoutes from './routes/exams.js';
import questionRoutes from './routes/questions.js';
import resultRoutes from './routes/results.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

// DEBUG
console.log("Python URL:", process.env.PYTHON_API_URL);

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Root route
app.get("/", (req, res) => {
  res.send("Server is running successfully 🚀");
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// 🔥 Python test route (IMPORTANT)
app.get('/test-python', async (req, res) => {
  const pythonUrl = process.env.PYTHON_API_URL || 'https://render-python-1-b8m9.onrender.com';
  try {
    const response = await axios.get(`${pythonUrl}/health`);
    res.json(response.data);
  } catch (error) {
    console.error('Python connection error:', error.message);
    res.status(500).json({ error: 'Python server not reachable' });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/results', resultRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
const isVercel = Boolean(process.env.VERCEL);

const startServer = async () => {
  await connectDB();

  if (!isVercel) {
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  }
};

startServer();

export default app;