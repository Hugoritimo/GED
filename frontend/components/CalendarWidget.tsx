"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaBell } from "react-icons/fa";

// Define a interface para os eventos
interface Event {
  title: string;
  description?: string;
}

// Mapeia datas (no formato ISO "YYYY-MM-DD") para uma lista de eventos
const events: { [date: string]: Event[] } = {
  "2025-02-21": [
    { title: "Treinamento A" },
    { title: "Reunião B" },
  ],
  "2025-02-22": [{ title: "Evento X" }],
};

export default function CalendarWidget() {
  const [date, setDate] = useState<Date>(new Date());

  // Função que adiciona conteúdo customizado para cada dia
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      // Formata a data para ISO (YYYY-MM-DD)
      const dateString = date.toISOString().split("T")[0];
      if (events[dateString]) {
        // Cria um texto com os títulos dos eventos para exibição em tooltip
        const tooltipText = events[dateString].map(e => e.title).join(", ");
        return (
          <div className="absolute bottom-1 right-1 text-[#AF1B1B]" title={tooltipText}>
            <FaBell size={12} />
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 border border-gray-200 relative">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Calendário de Eventos
      </h3>
      <Calendar
        onChange={setDate}
        value={date}
        tileContent={tileContent}
        className="w-full"
      />
      <div className="mt-4 text-gray-600">
        Data selecionada: {date.toLocaleDateString()}
      </div>
    </div>
  );
}
