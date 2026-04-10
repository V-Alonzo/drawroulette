import {initializeApp} from "firebase/app";
import { getDatabase, update, ref, onValue} from "firebase/database";
import dotenv from 'dotenv';
import axios from "axios";
import cors from "cors";
import express from "express";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

const corsOptions = {
  origin: ['http://localhost:3000', process.env.FRONTEND_URL],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};


const appFirebase = initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
});

app.use(cors(corsOptions));

app.use(express.json());

let registeredNumbers = [];

let registeredTickets = {};


const establishFirebaseListener = () => {
  try {
    const db = getDatabase(appFirebase);
    const registeredTicketsRef = ref(db, 'RegisteredTickets');

    onValue(
      registeredTicketsRef,
      (snapshot) => {
        const data = snapshot.val() ?? {};

        registeredTickets = {}
        registeredNumbers = []

        console.log("Datos actualizados desde Firebase:", Object.keys(data));

        for (const key of Object.keys(data)) {
            const value = data[key];
            registeredTickets[key] = value;
            registeredNumbers.push(parseInt(key, 10));
        }

      },
      (error) => {
        console.error('Error listening to Firebase changes:', error);
      },
    );
  } catch (error) {
    console.error('Error initializing Firebase listener:', error);
  }
};

establishFirebaseListener();

const sendDataToFirebase = async (path, data) => {
  try {
    const db = getDatabase(appFirebase);
    await update(ref(db, path), data);

  } catch (error) {
    console.error('Error writing data to Firebase:', error);
    throw error;
  }
};

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

app.post("/api/registerTicket", async (req, res) => {
    let { ticketNumber, name, email, phone } = req.body;
    
    ticketNumber = parseInt(ticketNumber);

    if (!ticketNumber || !name || !email || !phone) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    if (registeredTickets[ticketNumber]) {
        return res.status(400).json({ error: "El boleto ya está registrado" });
    }

    const newTicket = { name, email, phone };

    registeredTickets[ticketNumber] = newTicket;
    registeredNumbers.push(ticketNumber);

    try {
      await sendDataToFirebase(`RegisteredTickets/${ticketNumber}`, newTicket);
    } catch (error) {
      return res.status(500).json({ error: "No se pudo guardar el boleto en Firebase" });
    }

    //console.log("Boletos registrados hasta ahora:", registeredTickets);
    //console.log("Números registrados hasta ahora:", registeredNumbers);

    return res.json({ message: "Boleto registrado con éxito" });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
