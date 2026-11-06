"use client";

import { useEffect, useState } from "react";

// Hora oficial de los torneos: Argentina (UTC-3, sin horario de verano).
export function inicioDelTorneo(fecha?: string | null, hora?: string | null): Date | null {
  if (!fecha) return null;
  const hhmm = (hora ?? "00:00").slice(0, 5);
  const d = new Date(`${fecha.slice(0, 10)}T${hhmm}:00-03:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

// "vie 7 nov · 21:30 h"
export function textoInicio(inicio: Date, conHora = true) {
  const dia = inicio
    .toLocaleDateString("es-AR", {
      weekday: "short",
      day: "numeric",
      month: "short",
      timeZone: "America/Argentina/Buenos_Aires",
    })
    .replace(/\./g, "")
    .replace(/ de /g, " ");
  if (!conHora) return dia;
  const hora = inicio.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Argentina/Buenos_Aires",
  });
  return `${dia} · ${hora} h`;
}

// Milisegundos que faltan para el inicio (0 si ya empezó). Se actualiza cada segundo.
// Devuelve null hasta montar en el navegador, para no desfasar el render del servidor.
export function useFaltaParaInicio(inicio: Date | null) {
  const [ahora, setAhora] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setAhora(Date.now());
    const primero = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(primero);
      clearInterval(id);
    };
  }, []);

  if (!inicio || ahora === null) return null;
  return Math.max(0, inicio.getTime() - ahora);
}

export function partesCuenta(ms: number) {
  const s = Math.floor(ms / 1000);
  return {
    dias: Math.floor(s / 86400),
    horas: Math.floor((s % 86400) / 3600),
    minutos: Math.floor((s % 3600) / 60),
    segundos: s % 60,
  };
}

// ---- Horario de cada partido (campo datetime-local <-> base, en hora de Argentina) ----

// "2026-11-07T21:30" para un <input type="datetime-local">
export function horarioAInput(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  // Argentina es UTC-3 todo el año
  const ar = new Date(d.getTime() - 3 * 60 * 60 * 1000);
  return ar.toISOString().slice(0, 16);
}

// "2026-11-07T21:30" (hora de Argentina) -> ISO para guardar, o null si está vacío
export function inputAHorario(valor: string) {
  if (!valor) return null;
  const d = new Date(`${valor}:00-03:00`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

// "vie 7 nov · 21:30 h"
export function textoHorario(iso?: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : textoInicio(d);
}
