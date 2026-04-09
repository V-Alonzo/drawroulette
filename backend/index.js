const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5001;

const corsOptions = {
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.get('/api/data', (req, res) => {
  res.json({ message: "Hello from Express backend!" });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
