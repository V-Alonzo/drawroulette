"use client"

import { use, useEffect, useState } from "react";
import Roulette from "./components/Roulette";
import RegistryModal from "./components/Modal";
import RegistryForm from "./components/RegistryForm";
import TicketsTable from "./components/TicketsTable";
import { Input } from "./components/InputFields/base/input/input";

export default function Home() {
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [rouletteNumbers, setRouletteNumbers] = useState<number[]>([]);
  const [numberSelected, setNumberSelected] = useState<number>(-1);
  const [showRegistryModal, setShowRegistryModal] = useState(false);
  const[shouldShowModal, setShouldShowModal] = useState(false);
  const [spinNumber, setSpinNumber] = useState(0);
  const [registeredTickets, setRegisteredTickets] = useState<Record<number, { name: string; email: string; phone: string }>>({});

  const setRouletteResult = (number: number) => {
    setNumberSelected(number);
    setShouldShowModal(true);
    setSpinNumber(prev => prev + 1);
  }

  const isIntegerNumber = (value: string) => {
    const parsed = Number.parseInt(value, 10);
    return !isNaN(parsed) && parsed >= 0;
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

  const getNumbers = async () => {
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
  }

  useEffect(() => {
    if(numberSelected === -1 || !shouldShowModal) return;
    
    console.log("Número seleccionado:", numberSelected);

    setShowRegistryModal(true);

    setShouldShowModal(false);
  }, [numberSelected, shouldShowModal]);


  useEffect(() => {
    getNumbers();
  }, []);



  return (
    <div className="flex flex-col flex-1 items-center pt-12 bg-zinc-50 font-sans dark:bg-black">

      <Roulette key={spinNumber} data={rouletteNumbers} setRouletteResult={setRouletteResult} />

      {showRegistryModal && <RegistryModal ticketNumber={numberSelected} onClose={performModalClose} children={
        <RegistryForm ticketNumber={numberSelected} closeModal={performModalClose}/>        
        }
        />}  

      <Input className="p-8" hint = {!isIntegerNumber(numberSelected.toString()) ? "El número es inválido" : ""} isInvalid={!isIntegerNumber(numberSelected.toString())} label="Número de Boleto" value={numberSelected.toString() === "-1"?"0":numberSelected.toString() || "0"} onChange={(e) => setNumberSelected(Number(e))}/>

      <button className="buttonModal" onClick={() => setShowRegistryModal(true)}>Registrar Boleto Manualmente</button>

      <button className="buttonModal" onClick={checkRegisteredTickets}>Actualizar Registros</button>

      <TicketsTable registeredTickets={registeredTickets}/>

    </div>
  );
}
