"use client"

import { useEffect } from "react";
import Roulette from "./components/Roulette";


export default function Home() {

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const getNumbers = async () => {
    try {
      const request = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }

      console.log("Fetching data from backend...");
      console.log(`${API_URL}/data`)

      const response = await fetch(`${API_URL}/data`, request);
      const data = await response.json();
      console.log("Data from backend:", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    getNumbers();
  }, []);


  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Roulette data={[1,2,3,4]} />

    </div>
  );
}
