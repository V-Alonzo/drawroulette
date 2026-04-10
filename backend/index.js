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

const registeredTickets = {};


app.get('/api/data', (req, res) => {
  res.json({ message: "Hello from Express backend!" });
});

app.get("/api/getFreeNumbers", (req, res) => {
  const min = process.env.MINIMUM_NUMBER_TICKETS;
  const max = process.env.MAXIMUM_NUMBER_TICKETS;

  const originalNumbersArray = Array.from({ length: max - min + 1 }, (_, i) => i + parseInt(min));
  const availableNumbers = originalNumbersArray.filter(num => !registeredNumbers.includes(parseInt(num)));

  return res.json({ availableNumbers });
});

app.get("/api/getRegisteredNumbers", (req, res) => {
  return res.json({ registeredNumbers });
});

app.get("/api/getRegisteredTickets", (req, res) => {
  return res.json({ registeredTickets });
});


app.get("/api/getNumber", (req, res) => {
    const min = process.env.MINIMUM_NUMBER_TICKETS;
    const max = process.env.MAXIMUM_NUMBER_TICKETS;

    const originalNumbersArray = Array.from({ length: max - min + 1 }, (_, i) => i + parseInt(min));
    const availableNumbers = originalNumbersArray.filter(num => !registeredNumbers.includes(parseInt(num)));

    if(availableNumbers.length === 0) {
        return res.status(400).json({ error: "¡No quedan más números disponibles!" });
    }

    const randomNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
    
    return res.json({ number: randomNumber });
});

app.post("/api/registerTicket", (req, res) => {
    let { ticketNumber, name, email, phone } = req.body;
    
    ticketNumber = parseInt(ticketNumber);

    if (!ticketNumber || !name || !email || !phone) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    if (registeredTickets[ticketNumber]) {
        return res.status(400).json({ error: "El boleto ya está registrado" });
    }

    registeredTickets[ticketNumber] = { name, email, phone };

    registeredNumbers.push(ticketNumber);

    console.log("Boletos registrados hasta ahora:", registeredTickets);
    console.log("Números registrados hasta ahora:", registeredNumbers);

    return res.json({ message: "Boleto registrado con éxito" });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
