"use client"

import { useEffect, useState } from "react";
import Roulette from "./components/Roulette";


export default function Home() {
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [rouletteNumbers, setRouletteNumbers] = useState<number[]>([]);
  const [numberSelected, setNumberSelected] = useState<number>(-1);

  const setRouletteResult = (number: number) => {
    setNumberSelected(number);
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
    console.log("Número seleccionado:", numberSelected);

    setRouletteNumbers(prevNumbers => {
      if(rouletteNumbers.includes(numberSelected)) return prevNumbers.filter(num => num !== numberSelected);
      return prevNumbers;
    })

    
  }, [numberSelected]);

  useEffect(() => {
    getNumbers();
  }, []);


  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">

      <Roulette key={numberSelected} data={rouletteNumbers} setRouletteResult={setRouletteResult} />

    </div>
  );
}
