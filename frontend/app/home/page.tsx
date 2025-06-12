"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Rubik } from "next/font/google";
import {
  FaHome,
  FaBell,
  FaUserCircle,
  FaChartLine,
  FaFileAlt,
  FaPen,
  FaCogs,
} from "react-icons/fa";
import DocumentEditorModal from "@/components/DocumentEditorModal";
import { Button } from "@/components/ui/button";
// Configuração da fonte corporativa
const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-rubik",
});

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: <FaHome /> },
  { id: "documents", label: "Documentos", icon: <FaFileAlt /> },
  { id: "signatures", label: "Assinaturas", icon: <FaPen /> },
  { id: "reports", label: "Relatórios", icon: <FaChartLine /> },
  { id: "settings", label: "Configurações", icon: <FaCogs /> },
];

const contentVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: 10, transition: { duration: 0.3 } },
};

// Dados simulados para Documentos
const documentsData: DocumentType[] = [
  {
    id: 1,
    title: "Política de Segurança",
    status: "Em revisão",
    lastModified: "2023-09-15",
    version: "v1.2",
    fileType: "pdf",
    tags: ["Segurança", "Política"],
    favorite: false,
    previewUrl: "https://example.com/sample.pdf",
  },
  {
    id: 2,
    title: "Termo de Confidencialidade",
    status: "Aprovado",
    lastModified: "2023-08-30",
    version: "v1.0",
    fileType: "word",
    tags: ["Confidencialidade"],
    favorite: false,
    previewUrl: "https://example.com/sample.docx",
  },
  {
    id: 3,
    title: "Manual do Colaborador",
    status: "Pendente",
    lastModified: "2023-09-05",
    version: "v2.0",
    fileType: "excel",
    tags: ["Manual", "Colaborador"],
    favorite: false,
    previewUrl: "https://example.com/sample.xlsx",
  },
];

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("documents");
  const [editingDocument, setEditingDocument] = useState<DocumentType | null>(null);

  const renderMainContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="p-8">
            <h1 className="text-4xl font-bold text-blue-800">Dashboard</h1>
            <p className="mt-2 text-gray-600">Conteúdo do Dashboard corporativo.</p>
            {/* Adicione gráficos, indicadores e atividades recentes */}
          </div>
        );
      case "documents":
return <div className="p-8">Teste</div>;
      case "signatures":
        return <div className="p-8">Assinaturas</div>;
      case "reports":
        return <div className="p-8">Relatórios</div>;
      case "settings":
        return <div className="p-8">Configurações</div>;
      default:
        return null;
    }
  };

  return (
    <div className={`${rubik.className} min-h-screen flex`}>
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex-shrink-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold">GED Control</h1>
          <p className="text-sm text-blue-300">Gerenciamento de Documentos</p>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center px-6 py-3 w-full text-left transition-colors focus:outline-none ${
                    activeSection === item.id
                      ? "bg-blue-800"
                      : "hover:bg-blue-800 text-blue-200"
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="ml-4 text-lg">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Área Principal */}
      <div className="flex flex-col flex-1">
        {/* Cabeçalho Superior */}
        <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-blue-800">
            {sidebarItems.find((item) => item.id === activeSection)?.label}
          </h2>
          <div className="flex items-center gap-4">
            <button aria-label="Notificações">
              <FaBell className="text-2xl text-gray-600 hover:text-blue-800 transition-colors" />
            </button>
            <Link href="/perfil" aria-label="Perfil">
              <FaUserCircle className="text-3xl text-gray-600 hover:text-blue-800 transition-colors" />
            </Link>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="flex-1 overflow-auto bg-gray-100 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {renderMainContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="bg-white shadow-md px-6 py-4">
          <div className="text-center text-gray-600">
            © {new Date().getFullYear()} GED Control. Todos os direitos reservados.
          </div>
        </footer>
      </div>

      {/* Modal para Edição de Documento */}
      <AnimatePresence>
        {editingDocument && (
          <DocumentEditorModal
            doc={editingDocument}  // Aqui usamos a prop "doc"
            onClose={() => setEditingDocument(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
