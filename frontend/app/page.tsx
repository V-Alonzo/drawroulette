"use client"

import { useCallback, useEffect, useState } from "react";
import Roulette from "./components/Roulette";
import RegistryModal from "./components/Modal";
import RegistryForm from "./components/RegistryForm";
import TicketsTable from "./components/TicketsTable";
import { Input } from "./components/InputFields/base/input/input";
import type { EditableTicketField, EditableTicketValue, RegisteredTickets } from "../types/registered-ticket";

export default function Home() {
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [rouletteNumbers, setRouletteNumbers] = useState<number[]>([]);
  const [numberSelected, setNumberSelected] = useState<number>(0);
  const [showRegistryModal, setShowRegistryModal] = useState(false);
  const[shouldShowModal, setShouldShowModal] = useState(false);
  const [spinNumber, setSpinNumber] = useState(0);
  const [registeredTickets, setRegisteredTickets] = useState<RegisteredTickets>({});

  const setRouletteResult = (number: number) => {
    setNumberSelected(number);
    setShouldShowModal(true);
    setSpinNumber(prev => prev + 1);
  }

  const isIntegerNumber = (value: string) => {
    const regex = /^\d+$/;
    return regex.test(value);
  }

  const performModalClose = (registeredTicket : boolean) => {
    setShowRegistryModal(false);

    if(registeredTicket){
      setRouletteNumbers(prevNumbers => prevNumbers.filter(num => num !== numberSelected));
    }
  }

  const checkRegisteredTickets = async () => {
    try{
      const request = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }

      const response = await fetch(`${API_URL}/getRegisteredTickets`, request);
      const data = await response.json();

      setRegisteredTickets(data.registeredTickets);

      getNumbers();

    }
    catch(error){
      console.error("Error fetching data:", error);
    }

  }

  const updateTicketField = async (ticketNumber: string, field: EditableTicketField, value: EditableTicketValue) => {
    const previousValue = registeredTickets[ticketNumber]?.[field];

    setRegisteredTickets((previousTickets) => ({
      ...previousTickets,
      [ticketNumber]: {
        ...previousTickets[ticketNumber],
        [field]: value,
      },
    }));

    try {
      const response = await fetch(`${API_URL}/updateTicketField`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticketNumber, field, value }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "No se pudo actualizar el boleto");
      }
    } catch (error) {
      setRegisteredTickets((previousTickets) => ({
        ...previousTickets,
        [ticketNumber]: {
          ...previousTickets[ticketNumber],
          [field]: previousValue,
        },
      }));

      throw error;
    }
  }

  const getNumbers = useCallback(async () => {
    try {
      const request = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }

      const response = await fetch(`${API_URL}/getFreeNumbers`, request);
      const data = await response.json();
      setRouletteNumbers(data.availableNumbers);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [API_URL]);

  useEffect(() => {
    if(numberSelected == 0 || !shouldShowModal) return;
    
    console.log("Número seleccionado:", numberSelected);

    setShowRegistryModal(true);

    setShouldShowModal(false);
  }, [numberSelected, shouldShowModal]);


  useEffect(() => {
    getNumbers();
  }, [getNumbers]);



  return (
    <div className="flex flex-col flex-1 items-center pt-12 bg-zinc-50 font-sans dark:bg-black">

      <Roulette key={spinNumber} data={rouletteNumbers} setRouletteResult={setRouletteResult} />

      {showRegistryModal && (
        <RegistryModal ticketNumber={numberSelected} onClose={performModalClose}>
          <RegistryForm ticketNumber={numberSelected} closeModal={performModalClose}/>
        </RegistryModal>
      )}

      <Input className="p-8" hint = {!isIntegerNumber(numberSelected.toString()) ? "El número es inválido" : ""} isInvalid={!isIntegerNumber(numberSelected.toString())} label="Número de Boleto" value={numberSelected.toString()} onChange={(e) => {
        if(isIntegerNumber(e))setNumberSelected(Number(e));
        if(e === "") setNumberSelected(0);

      }}/>

      <button className="buttonModal" onClick={() => setShowRegistryModal(true)}>Registrar Boleto Manualmente</button>

      <button className="buttonModal" onClick={checkRegisteredTickets}>Actualizar Registros</button>

      <TicketsTable registeredTickets={registeredTickets} onTicketFieldChange={updateTicketField}/>

    </div>
  );
}
