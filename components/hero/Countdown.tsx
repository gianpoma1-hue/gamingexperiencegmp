"use client";

import { useEffect, useState } from "react";

export default function Countdown() {
  const targetDate = new Date("2026-08-01T20:00:00");

  const calculateTimeLeft = () => {
    const difference = +targetDate - +new Date();

    let timeLeft = {
      dias: 0,
      horas: 0,
      minutos: 0,
      segundos: 0,
    };

    if (difference > 0) {
      timeLeft = {
        dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((difference / 1000 / 60) % 60),
        segundos: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mt-14">

      <p className="text-zinc-400 uppercase tracking-[4px] mb-6">
        Próximo torneo en
      </p>

      <div className="grid grid-cols-4 gap-4 max-w-xl">

        {Object.entries(timeLeft).map(([label, value]) => (

          <div
            key={label}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl py-5 text-center"
          >

            <h3 className="text-4xl font-black text-red-600">
              {String(value).padStart(2, "0")}
            </h3>

            <p className="text-zinc-400 capitalize">
              {label}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}