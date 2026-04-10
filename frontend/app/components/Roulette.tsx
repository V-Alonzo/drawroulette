"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

const WHEEL_SIZE = 300;
const SPIN_DURATION_SECONDS = 4;
const COLORS = [
  "#3f297e",
  "#175fa9",
  "#169ed8",
  "#239b63",
  "#64b031",
  "#efe61f",
  "#f7a416",
  "#e6471d",
  "#dc0936",
  "#e5177b",
  "#be1180",
  "#871f7f"
];

const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360;

const Roulette = ({ data, setRouletteResult }: { data: number[], setRouletteResult: (number: number) => void}) => {

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const request = {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        }

  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [rotation, setRotation] = useState(0);
  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rouletteData = useMemo(() => {
    return data
      .map((item) => Number(item));
  }, [data]);

  const displayedPrizeIndex =
    rouletteData.length === 0 ? 0 : Math.min(prizeNumber, rouletteData.length - 1);

  const wheelBackground = useMemo(() => {
    if (rouletteData.length === 0) {
      return "#f2f2f2";
    }

    const sliceAngle = 360 / rouletteData.length;
    const segments = rouletteData.map((_, index) => {
      const start = sliceAngle * index;
      const end = start + sliceAngle;
      const color = COLORS[index % COLORS.length];
      return `${color} ${start}deg ${end}deg`;
    });

    return `conic-gradient(from 0deg, ${segments.join(", ")})`;
  }, [rouletteData]);

  const getNumberFromBackend = async () => {
    try {
        const response = await fetch(`${API_URL}/getNumber`, request);
        const res = await response.json();
        console.log("Número obtenido del backend:", res.number);
        if(Object.keys(res).includes("error")){
            alert(res.error);
            return -1;
        }
        return res.number;
    }
    catch (error) {
        console.error("Error fetching data:", error);
        alert("Error al obtener el número del backend. Por favor, inténtalo de nuevo.");
        return -1;
    }
  }

  const handleSpinClick = async () => {
    if (rouletteData.length === 0 || mustSpin) return;

    const res = await getNumberFromBackend();
    if(res === -1) return;

    const newPrizeNumber = rouletteData.indexOf(res);
    const sliceAngle = 360 / rouletteData.length;
    const selectedSliceCenter = newPrizeNumber * sliceAngle + sliceAngle / 2;
    const targetAngle = normalizeAngle(360 - selectedSliceCenter);
    const extraTurns = (4 + Math.floor(Math.random() * 3)) * 360;

    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
    }

    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
    setRotation((prev) => {
      const currentAngle = normalizeAngle(prev);
      const deltaToTarget = normalizeAngle(targetAngle - currentAngle);
      return prev + extraTurns + deltaToTarget;
    });

    spinTimeoutRef.current = setTimeout(() => {
      setMustSpin(false);
      setRouletteResult(rouletteData[newPrizeNumber]);
      spinTimeoutRef.current = null;
    }, SPIN_DURATION_SECONDS * 1000);
  };

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="roulette-container">
        {rouletteData.length > 0 ? (
          <div
            style={{
              position: "relative",
              width: `${WHEEL_SIZE}px`,
              margin: "0 auto"
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "50%",
                top: "-14px",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "12px solid transparent",
                borderRight: "12px solid transparent",
                borderTop: "24px solid #111",
                zIndex: 3
              }}
            />

            <div
              style={{
                width: `${WHEEL_SIZE}px`,
                height: `${WHEEL_SIZE}px`,
                borderRadius: "50%",
                border: "9px solid #ccc",
                boxSizing: "border-box",
                position: "relative",
                overflow: "hidden",
                background: wheelBackground,
                transform: `rotate(${rotation}deg)`,
                transition: mustSpin
                  ? `transform ${SPIN_DURATION_SECONDS}s cubic-bezier(0.2, 0.8, 0.2, 1)`
                  : "none"
              }}
            >
              {rouletteData.map((value, index) => {
                const sliceAngle = 360 / rouletteData.length;
                const labelAngle = index * sliceAngle + sliceAngle / 2;

                return (
                  <div
                    key={`${value}-${index}`}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      transform: `rotate(${labelAngle}deg) translateY(-${Math.round(
                        WHEEL_SIZE * 0.33
                      )}px) rotate(-${labelAngle}deg)`,
                      transformOrigin: "center",
                      color: "#f5f5f5",
                      fontSize: "14px",
                      fontWeight: 700,
                      textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                      whiteSpace: "nowrap",
                      zIndex: 2
                    }}
                  >
                    {value}
                  </div>
                );
              })}
            </div>

            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: "#111",
                border: "2px solid #fff",
                zIndex: 4
              }}
            />
          </div>
        ) : (
          <p className="no-data-message">No hay boletos que mostrar.</p>
        )}

        {rouletteData.length > 0 && (
            <button
          className="button roulette-button"
          onClick={handleSpinClick}
          disabled={mustSpin || rouletteData.length === 0}
            >
            ¡Gira la Ruleta!
            </button>
        )}
        

      </div>
      <br />
      <button
        className="prize-message"
        onClick={handleSpinClick}
        disabled={mustSpin || rouletteData.length === 0}
      >
      </button>
    </>
  );
};

export default Roulette;
