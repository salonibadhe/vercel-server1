import express from 'express';

const router = express.Router();

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'https://render-python-du4a.onrender.com';

// POST /api/proctor/analyze
router.post('/analyze', async (req, res) => {
  try {
    const { frame, reference_image } = req.body || {};
    if (!frame) return res.status(400).json({ message: 'Missing frame in request' });

    const response = await fetch(`${PYTHON_API_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ frame, reference_image }),
    });

    const data = await response.json();
    return res.status(response.status || 200).json(data);
  } catch (error) {
    console.error('Proctor proxy error:', error?.message || error);
    return res.status(500).json({ message: 'Proctor proxy error', error: String(error) });
  }
});

// GET /api/proctor/health
router.get('/health', async (req, res) => {
  try {
    const response = await fetch(`${PYTHON_API_URL}/health`);
    const data = await response.json();
    return res.status(response.status || 200).json(data);
  } catch (error) {
    console.error('Proctor proxy health error:', error?.message || error);
    return res.status(500).json({ message: 'Unable to reach Python service' });
  }
});

// POST /api/proctor/analyze_code -> forwards code analysis requests
router.post('/analyze_code', async (req, res) => {
  try {
    const { code } = req.body || {};
    if (!code) return res.status(400).json({ message: 'Missing code in request' });

    const response = await fetch(`${PYTHON_API_URL}/analyze_code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();
    return res.status(response.status || 200).json(data);
  } catch (error) {
    console.error('Proctor proxy analyze_code error:', error?.message || error);
    return res.status(500).json({ message: 'Proctor proxy analyze_code error', error: String(error) });
  }
});

export default router;
