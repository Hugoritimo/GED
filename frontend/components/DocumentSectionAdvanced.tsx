import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Definição do tipo para um documento
interface DocumentType {
  id: string | number;
  title: string;
}

// Tipagem para as props do componente
interface DocumentSectionAdvancedProps {
  documents: DocumentType[];
  onSelectDocument: (doc: DocumentType) => void;
  onEditDocument: (doc: DocumentType) => void;
}

const DocumentSectionAdvanced = ({
  documents,
  onSelectDocument,
  onEditDocument,
}: DocumentSectionAdvancedProps) => {
  const handleEditClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    document: DocumentType
  ) => {
    event.stopPropagation();
    onEditDocument(document);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((document) => (
        <Card
          key={document.id}
          onClick={() => onSelectDocument(document)}
          className="hover:shadow-lg cursor-pointer transition"
        >
          <CardHeader>
            <CardTitle className="text-blue-800 text-lg">
              {document.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => handleEditClick(e, document)}
            >
              Editar
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DocumentSectionAdvanced;
