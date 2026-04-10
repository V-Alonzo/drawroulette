const express = require('express');
const cors = require('cors');
const axios = require('axios');

require('dotenv').config();

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

const registeredNumbers = [];


app.get('/api/data', (req, res) => {
  res.json({ message: "Hello from Express backend!" });
});

app.get("/api/getTicketsInterval", (req, res) => {
  const min = process.env.MINIMUM_NUMBER_TICKETS;
  const max = process.env.MAXIMUM_NUMBER_TICKETS;
  return res.json({ min, max });
});

app.get("/api/getRegisteredNumbers", (req, res) => {
  return res.json({ registeredNumbers });
});

app.get("/api/getNumber", (req, res) => {
    const min = process.env.MINIMUM_NUMBER_TICKETS;
    const max = process.env.MAXIMUM_NUMBER_TICKETS;

    const originalNumbersArray = Array.from({ length: max - min + 1 }, (_, i) => i + parseInt(min));
    const availableNumbers = originalNumbersArray.filter(num => !registeredNumbers.includes(num));

    if(availableNumbers.length === 0) {
        return res.status(400).json({ error: "¡No quedan más números disponibles!" });
    }

    const randomNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];

    registeredNumbers.push(randomNumber);
    
    return res.json({ number: randomNumber });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
