"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { DocumentType } from "@/components/DocumentSectionAdvanced"; // Ajuste o caminho conforme necessário
import { Button } from "@/components/ui/button";

interface DocumentEditorModalProps {
  doc: DocumentType; // prop renomeada para "doc"
  onClose: () => void;
}

export default function DocumentEditorModal({ doc, onClose }: DocumentEditorModalProps) {
  useEffect(() => {
    console.log("DocumentEditorModal received doc:", doc);
  }, [doc]);
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-lg w-full max-w-4xl p-6 relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, transition: { duration: 0.3 } }}
          exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.2 } }}
        >
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            onClick={onClose}
            aria-label="Fechar"
          >
            ×
          </button>
          <h2 className="text-2xl font-bold text-blue-800 mb-4">
            Editar Documento: {doc.title}
          </h2>
          {doc.fileType === "pdf" ? (
            <div>
              <p className="mb-2 font-semibold">Visualização de PDF:</p>
              {doc.previewUrl ? (
                <iframe
                  src={doc.previewUrl}
                  className="w-full h-96 border"
                  title="PDF Preview"
                ></iframe>
              ) : (
                <p className="text-gray-600">Nenhuma URL de pré-visualização disponível.</p>
              )}
            </div>
          ) : (
            <div>
              <p className="mb-2">
                Editor de {doc.fileType.toUpperCase()} em desenvolvimento.
              </p>
              <textarea
                className="w-full h-40 border rounded-md p-2"
                placeholder={`Editar documento ${doc.fileType.toUpperCase()}...`}
              ></textarea>
              <div className="mt-4 flex justify-end">
                <Button
                  className="bg-blue-700 text-white hover:bg-blue-800 transition-colors"
                  onClick={() => alert("Salvando alterações...")}
                >
                  Salvar Alterações
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}