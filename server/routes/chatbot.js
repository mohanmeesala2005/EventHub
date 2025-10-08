import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/ask', async (req, res) => {
  const { message } = req.body;
  try {
    // Use Gemini API (Google AI Studio)
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: message }] }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';
    res.json({ reply });
  } catch (err) {
    console.error(err.response?.data || err.message || err);
    res.status(500).json({ error: 'AI service error' });
  }
});

export default router;