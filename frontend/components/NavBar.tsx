"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaChessPawn, FaBars, FaTimes } from "react-icons/fa";

const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "gamification", label: "Gamificação" },
  { id: "ranking", label: "Ranking" },
  { id: "calendar", label: "Calendário" },
  { id: "formularios", label: "Formulários" },
];

interface NavbarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 1 }}
            className="flex items-center"
            aria-label="Logo Projeta"
          >
            <FaChessPawn className="text-5xl text-[#AF1B1B]" />
          </motion.div>
          <span className="text-3xl font-bold text-[#AF1B1B]">Projeta</span>
        </div>
        <nav className="flex items-center gap-6">
          {/* Exibição do menu para telas médias e acima */}
          <div className="hidden md:flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`text-lg font-medium transition-colors border-b-2 focus:outline-none ${
                  activeTab === tab.id
                    ? "text-[#AF1B1B] border-[#AF1B1B]"
                    : "text-gray-600 border-transparent hover:text-[#AF1B1B]"
                }`}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Botão Hamburger para Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setNavOpen(!navOpen)}
              className="text-2xl text-gray-600 focus:outline-none"
              aria-label={navOpen ? "Fechar Menu" : "Abrir Menu"}
            >
              {navOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </nav>
      </div>
      {navOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-6 py-4 flex flex-col gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  setNavOpen(false);
                }}
                className={`text-lg font-medium transition-colors border-b-2 focus:outline-none ${
                  activeTab === tab.id
                    ? "text-[#AF1B1B] border-[#AF1B1B]"
                    : "text-gray-600 border-transparent hover:text-[#AF1B1B]"
                }`}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
