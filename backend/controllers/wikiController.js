const geminiService = require('../services/geminiService');

exports.summarize = async (req, res) => {
  try {
    const { text } = req.body;
    const summary = await geminiService.summarize(text);
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 