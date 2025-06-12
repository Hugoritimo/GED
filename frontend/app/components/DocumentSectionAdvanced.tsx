import React from 'react';

interface DocumentSectionAdvancedProps {
  documents: any[];
  onSelectDocument: (doc: any) => void;
  onEditDocument: (doc: any) => void;
}

const DocumentSectionAdvanced: React.FC&lt;DocumentSectionAdvancedProps&gt; = ({ documents, onSelectDocument, onEditDocument }) => {
  return (
    <div>
      {documents.map((document, index) => (
        <div key={index}>
          <h2>{document.title}</h2>
          <button onClick={() => onSelectDocument(document)}>Select</button>
          <button onClick={() => onEditDocument(document)}>Edit</button>
        </div>
      ))}
    </div>
  );
};

export default DocumentSectionAdvanced;

