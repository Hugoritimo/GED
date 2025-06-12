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
  assinatura: string; // DataURL
}

const initialParticipants: Participant[] = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  nome: "",
  cpf: "",
  empresa: "",
  assinatura: "",
}));

export default function ControleFrequenciaPage() {
  // Estado dos participantes
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  // Estado para abrir modal de assinatura para um participante específico
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedParticipantId, setSelectedParticipantId] = useState<number | null>(null);
  // Ref para o canvas de assinatura do modal
  const sigCanvasRef = useRef<SignatureCanvas>(null);

  // Dados do curso (estáticos para este exemplo)
  const courseInfo = {
    curso: "CURSO NR 35 TRABALHO EM ALTURA",
    data: "21/02/2025",
    horario: "08:00h-12:00h | 13:00h-17:00h",
    cargaHoraria: "8 h",
    local: "Projeta",
    instrutor: "Erick Castro",
    conteudo: `Conceitos;
Equipamentos para trabalho em altura com andaimes;
Plataformas de trabalho aéreo;
Equipamentos de guindar para elevação de pessoas;
Tipos de escadas;
Passarela para telhado;
Balancim;
Acesso por cordas;
Equipamentos de segurança – Cinturão de segurança (talabarte duplo, trava quedas retrátil, trava quedas de posição, linha de vida, acesso por cordas);
Riscos e medidas de prevenção;
Normas e regulamentos;
Noções de Primeiros Socorros.`,
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

  // Abre o modal para capturar assinatura de um participante
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

  // Variantes simples para a animação do modal
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  return (
    <div className="p-6 space-y-10">
      {/* Dados do Curso */}
      <Card>
        <CardHeader>
          <CardTitle>{courseInfo.curso}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Data:</strong> {courseInfo.data}</p>
          <p><strong>Horário:</strong> {courseInfo.horario}</p>
          <p><strong>Carga Horária:</strong> {courseInfo.cargaHoraria}</p>
          <p><strong>Local:</strong> {courseInfo.local}</p>
          <p><strong>Instrutor:</strong> {courseInfo.instrutor}</p>
          <p><strong>Conteúdo Programático:</strong></p>
          <p className="text-sm whitespace-pre-line">{courseInfo.conteudo}</p>
        </CardContent>
      </Card>

      {/* Tabela de Participantes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Controle de Frequência</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Nº</th>
                <th className="border px-4 py-2">Nome Completo</th>
                <th className="border px-4 py-2">CPF</th>
                <th className="border px-4 py-2">Empresa</th>
                <th className="border px-4 py-2">Assinatura</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p) => (
                <tr key={p.id}>
                  <td className="border px-4 py-2 text-center">{p.id}</td>
                  <td className="border px-4 py-2">
                    <Input
                      value={p.nome}
                      onChange={(e) =>
                        handleInputChange(p.id, "nome", e.target.value)
                      }
                      placeholder="Digite o nome"
                      className="w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <Input
                      value={p.cpf}
                      onChange={(e) =>
                        handleInputChange(p.id, "cpf", e.target.value)
                      }
                      placeholder="Digite o CPF"
                      className="w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <Input
                      value={p.empresa}
                      onChange={(e) =>
                        handleInputChange(p.id, "empresa", e.target.value)
                      }
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

      {/* Modal para captura de assinatura */}
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
                >
                  Limpar
                </Button>
                <Button
                  onClick={saveSignature}
                  className="bg-[#004481] text-white"
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
