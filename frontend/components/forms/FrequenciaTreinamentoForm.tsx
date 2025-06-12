"use client";

import { useState, useRef, ChangeEvent, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignatureCanvas from "react-signature-canvas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Participant {
  id: number;
  nome: string;
  cpf: string;
  empresa: string;
  assinatura: string;
}

const initialParticipants: Participant[] = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  nome: "",
  cpf: "",
  empresa: "",
  assinatura: "",
}));

export default function FrequenciaTreinamentoPage() {
  // Estado dos participantes
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  // Estado para controle do modal de assinatura
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedParticipantId, setSelectedParticipantId] = useState<number | null>(null);
  // Ref para o canvas de assinatura no modal
  const sigCanvasRef = useRef<SignatureCanvas>(null);

  // Informações do treinamento (dados fixos neste exemplo)
  const trainingInfo = {
    titulo: "NR 18 - SEGURANÇA E SAÚDE NO TRABALHO NA INDÚSTRIA DA CONSTRUÇÃO",
    data: "21/02/2025",
    horario: "08:00h - 12:00h | 13:00h – 15:00h",
    cargaHoraria: "6 h",
    local: "Projeta",
    instrutor: "Erick Castro",
    conteudo: `CONTEÚDO PROGRAMÁTICO 2.1:
O conteúdo programático do treinamento inicial deve conter informações sobre:
I. as condições e meio ambiente de trabalho;
II. os riscos inerentes às atividades desenvolvidas;
III. os equipamentos e proteção coletiva existentes no canteiro de obras;
IV. o uso adequado dos equipamentos de proteção individual;
V. o PGR do canteiro de obras.`,
  };

  // Atualiza os campos de um participante
  const handleInputChange = (
    participantId: number,
    field: "nome" | "cpf" | "empresa",
    value: string
  ) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === participantId ? { ...p, [field]: value } : p))
    );
  };

  // Abre o modal para capturar a assinatura de um participante
  const openSignatureModal = (participantId: number) => {
    setSelectedParticipantId(participantId);
    setModalOpen(true);
  };

  // Salva a assinatura capturada para o participante selecionado
  const saveSignature = () => {
    if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty() && selectedParticipantId !== null) {
      const dataUrl = sigCanvasRef.current.getTrimmedCanvas().toDataURL("image/png");
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === selectedParticipantId ? { ...p, assinatura: dataUrl } : p
        )
      );
    }
    setModalOpen(false);
    setSelectedParticipantId(null);
  };

  // Limpa o canvas de assinatura do modal
  const clearSignature = () => {
    sigCanvasRef.current?.clear();
  };

  // Variantes para animação do modal com Framer Motion
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  return (
    <div className="p-6 space-y-10">
      {/* Informações do Treinamento */}
      <Card className="shadow-md">
        <CardHeader className="bg-[#004481] text-white">
          <CardTitle>{trainingInfo.titulo}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Data:</strong> {trainingInfo.data}</p>
          <p><strong>Horário:</strong> {trainingInfo.horario}</p>
          <p><strong>Carga Horária:</strong> {trainingInfo.cargaHoraria}</p>
          <p><strong>Local:</strong> {trainingInfo.local}</p>
          <p><strong>Instrutor:</strong> {trainingInfo.instrutor}</p>
          <p><strong>Conteúdo Programático:</strong></p>
          <p className="text-sm whitespace-pre-line">{trainingInfo.conteudo}</p>
        </CardContent>
      </Card>

      {/* Tabela de Participantes */}
      <Card className="shadow-md">
        <CardHeader className="bg-[#004481] text-white">
          <CardTitle>Lista de Frequência de Treinamento</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Nº</th>
                <th className="border px-4 py-2">Nome Completo</th>
                <th className="border px-4 py-2">CPF</th>
                <th className="border px-4 py-2">Empresa</th>
                <th className="border px-4 py-2">Assinatura</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p, index) => (
                <tr key={p.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <td className="border px-4 py-2 text-center">{p.id}</td>
                  <td className="border px-4 py-2">
                    <Input
                      value={p.nome}
                      onChange={(e) => handleInputChange(p.id, "nome", e.target.value)}
                      placeholder="Digite o nome"
                      className="w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <Input
                      value={p.cpf}
                      onChange={(e) => handleInputChange(p.id, "cpf", e.target.value)}
                      placeholder="Digite o CPF"
                      className="w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <Input
                      value={p.empresa}
                      onChange={(e) => handleInputChange(p.id, "empresa", e.target.value)}
                      placeholder="Digite a empresa"
                      className="w-full"
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {p.assinatura ? (
                      <img
                        src={p.assinatura}
                        alt={`Assinatura ${p.id}`}
                        className="w-20 h-10 object-contain"
                      />
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => openSignatureModal(p.id)}
                        className="bg-[#004481] text-white hover:scale-105 transition-transform"
                      >
                        Assinar
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Modal para Capturar Assinatura */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4 text-[#004481]">Assine Aqui</h2>
              <SignatureCanvas
                ref={sigCanvasRef}
                penColor="black"
                canvasProps={{ width: 300, height: 150, className: "sigCanvas" }}
              />
              <div className="mt-4 flex justify-end space-x-4">
                <Button
                  onClick={() => sigCanvasRef.current?.clear()}
                  variant="outline"
                  className="hover:scale-105 transition-transform"
                >
                  Limpar
                </Button>
                <Button
                  onClick={saveSignature}
                  className="bg-[#004481] text-white hover:scale-105 transition-transform"
                >
                  Salvar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
