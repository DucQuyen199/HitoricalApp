require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const sql = require('mssql');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const multer = require('multer');

// Kiểm tra biến môi trường
console.log('Environment variables loaded:', {
  port: process.env.PORT,
  geminiKey: process.env.GEMINI_API_KEY ? 'Set' : 'Not set'
});

const app = express();
const PORT = process.env.PORT || 5001;

// Tăng timeout cho server
app.use((req, res, next) => {
  res.setTimeout(60000, () => {
    console.log('Request has timed out.');
    res.status(408).send('Request has timed out');
  });
  next();
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());

// Database configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  }
};

// Gemini AI configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.get('/api/events', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query('SELECT * FROM historical_events');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        SELECT 
          e.*,
          hi.image_url as additional_image_url,
          hi.caption as image_caption,
          hf.name as figure_name,
          hf.portrait_url as figure_portrait,
          efr.relationship_type
        FROM historical_events e
        LEFT JOIN historical_images hi ON e.id = hi.event_id
        LEFT JOIN event_figure_relations efr ON e.id = efr.event_id
        LEFT JOIN historical_figures hf ON efr.figure_id = hf.id
        WHERE e.id = @id
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Format the response
    const event = result.recordset[0];
    const formattedEvent = {
      ...event,
      additional_images: result.recordset
        .filter(r => r.additional_image_url)
        .map(r => ({
          url: r.additional_image_url,
          caption: r.image_caption
        })),
      related_figures: result.recordset
        .filter(r => r.figure_name)
        .map(r => ({
          name: r.figure_name,
          portrait: r.figure_portrait,
          relationship_type: r.relationship_type
        }))
    };

    res.json(formattedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI Route for answering questions
app.post('/api/ai/question', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash"
    });
    const { question } = req.body;
    const result = await model.generateContent(question);
    const response = await result.response;
    res.json({ answer: response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload image route (you'll need multer for handling file uploads)
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

app.post('/api/upload-image', upload.single('image'), async (req, res) => {
  try {
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search events
app.get('/api/events/search', async (req, res) => {
  try {
    const { q } = req.query;
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('searchTerm', sql.NVarChar, `%${q}%`)
      .query(`
        SELECT * FROM historical_events 
        WHERE title LIKE @searchTerm 
        OR description LIKE @searchTerm 
        OR location LIKE @searchTerm
        OR period LIKE @searchTerm
      `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Start server with error handling
const server = app.listen(PORT, '0.0.0.0', (error) => {
  if (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  } else {
    console.error('Server error:', error);
  }
  process.exit(1);
});

// Handle process termination
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server terminated');
    process.exit(0);
  });
});