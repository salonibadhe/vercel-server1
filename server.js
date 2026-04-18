import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import examRoutes from './routes/exams.js';
import questionRoutes from './routes/questions.js';
import resultRoutes from './routes/results.js';

// // Load env vars
// dotenv.config();


import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 🔥 Try both paths (works in Windows deep paths)
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

// DEBUG
console.log("Python URL:", process.env.PYTHON_API_URL);
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ✅ ADD THIS
app.get("/", (req, res) => {
  res.send("Server is running successfully 🚀");
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/results', resultRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Python server test route
app.get('/test-python', async (req, res) => {
  try {
    const response = await axios.get('https://render-python-du4a.onrender.com/health');
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error testing Python server:', error.message || error);
    const status = error.response?.status || 500;
    const data = error.response?.data || { message: 'Unable to reach Python server' };
    res.status(status).json(data);
  }
});

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
