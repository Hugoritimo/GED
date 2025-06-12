"use client"
import { useState, useRef, ChangeEvent, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SignatureCanvas from 'react-signature-canvas';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Modelo do termo – contém dados do funcionário, equipamento e ambas as assinaturas
interface TermoAssinatura {
  id: number;
  nome_funcionario: string;
  cargo: string;
  cpf: string;
  endereco_funcionario: string;
  tipo_equipamento: string;
  marca: string;
  modelo: string;
  numero_serie: string;
  acessorios: string;
  assinatura_tecnico: string;
  assinatura_usuario: string; // ficará vazio até o funcionário assinar
  data: string; // data de cadastro
}

// Formulário para cadastro feito pelo técnico
interface TechForm {
  nome_funcionario: string;
  cargo: string;
  cpf: string;
  endereco_funcionario: string;
  tipo_equipamento: string;
  marca: string;
  modelo: string;
  numero_serie: string;
  acessorios: string;
  assinatura_tecnico: string;
}

const initialTechForm: TechForm = {
  nome_funcionario: '',
  cargo: '',
  cpf: '',
  endereco_funcionario: '',
  tipo_equipamento: '',
  marca: '',
  modelo: '',
  numero_serie: '',
  acessorios: '',
  assinatura_tecnico: '',
};

//
// Funções de persistência usando localStorage
//
const loadTerms = (): TermoAssinatura[] => {
  const stored = localStorage.getItem('termos');
  return stored ? JSON.parse(stored) : [];
};

const saveTerms = (terms: TermoAssinatura[]) => {
  localStorage.setItem('termos', JSON.stringify(terms));
};

const getNextId = (): number => {
  const nextId = localStorage.getItem('nextId');
  let id = nextId ? parseInt(nextId) : 1;
  localStorage.setItem('nextId', (id + 1).toString());
  return id;
};

//
// Variantes para animação com Framer Motion
//
const stepVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: 50, transition: { duration: 0.3 } },
};

//
// Componente de Indicador de Etapas (Wizard)
//
function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex justify-center mb-6">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => (
        <div
          key={step}
          className={`mx-1 w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
            step === currentStep ? 'bg-[#004481] text-white' : 'bg-gray-300 text-gray-800'
          }`}
        >
          {step}
        </div>
      ))}
    </div>
  );
}

//
// Modal para visualizar termo assinado no histórico
//
function TermModal({ term, onClose }: { term: TermoAssinatura; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full overflow-y-auto max-h-full"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#004481]">Termo Assinado</h2>
            <Button onClick={onClose} className="bg-[#004481] text-white">
              Fechar
            </Button>
          </div>
          <div>{renderPreview(term)}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

//
// Função para renderizar o preview dinâmico do termo
//
const renderPreview = (termData?: TermoAssinatura, techData?: TechForm) => {
  const data = termData || {
    nome_funcionario: techData?.nome_funcionario || '',
    cargo: techData?.cargo || '',
    cpf: techData?.cpf || '',
    endereco_funcionario: techData?.endereco_funcionario || '',
    tipo_equipamento: techData?.tipo_equipamento || '',
    marca: techData?.marca || '',
    modelo: techData?.modelo || '',
    numero_serie: techData?.numero_serie || '',
    acessorios: techData?.acessorios || '',
    assinatura_tecnico: termData ? termData.assinatura_tecnico : '',
    assinatura_usuario: termData ? termData.assinatura_usuario : '',
    data: termData ? termData.data : new Date().toISOString(),
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <p className="font-bold text-xl text-[#004481]">IDENTIFICAÇÃO DAS PARTES</p>
      <p className="mt-2"><strong>EMPREGADOR:</strong> Projeta Engenharia</p>
      <p>RUA A - VILA VICENTE FIALHO, CASA 01</p>
      <p>CNPJ: 04.892.580/0001-20</p>
      <br />
      <p><strong>FUNCIONÁRIO:</strong> {data.nome_funcionario || '_______________'}</p>
      <p>Cargo: {data.cargo || '_______________'}</p>
      <p>CPF: {data.cpf || '_______________'}</p>
      <p>Endereço: {data.endereco_funcionario || '_______________'}</p>
      <br />
      <p className="font-bold text-xl text-[#004481]">OBJETO DO TERMO</p>
      <p className="mt-2">
        Este Termo de Responsabilidade formaliza o compromisso do FUNCIONÁRIO quanto ao uso, guarda e conservação do equipamento cedido pelo EMPREGADOR.
      </p>
      <br />
      <p className="font-bold text-xl text-[#004481]">EQUIPAMENTO CEDIDO</p>
      <p className="mt-2">Tipo: {data.tipo_equipamento || '_______________'}</p>
      <p>Marca: {data.marca || '_______________'}</p>
      <p>Modelo: {data.modelo || '_______________'}</p>
      <p>Número de Série: {data.numero_serie || '_______________'}</p>
      <p>Acessórios: {data.acessorios || '_______________'}</p>
      <br />
      <p className="font-bold text-xl text-[#004481]">RESPONSABILIDADES DO FUNCIONÁRIO</p>
      <ul className="list-disc ml-6 mt-2">
        <li>Zelar pelo uso e conservação do equipamento.</li>
        <li>Utilizar o equipamento exclusivamente para fins profissionais.</li>
        <li>Não instalar softwares não autorizados.</li>
        <li>Informar problemas ou danos imediatamente.</li>
        <li>Devolver o equipamento em perfeito estado, salvo desgaste natural.</li>
        <li>Permitir manutenções preventivas autorizadas.</li>
        <li>Manter a confidencialidade das informações.</li>
      </ul>
      <br />
      <p className="font-bold text-xl text-[#004481]">PENALIDADES</p>
      <p className="mt-2">
        O descumprimento das responsabilidades implicará no ressarcimento dos custos de reparo ou substituição do equipamento.
      </p>
      <br />
      <p className="font-bold text-xl text-[#004481]">DISPOSIÇÕES FINAIS</p>
      <p className="mt-2">
        Este Termo entra em vigor na data de sua assinatura e vigorará enquanto o equipamento estiver em posse do FUNCIONÁRIO.
      </p>
      <br />
      <p className="font-bold text-xl text-[#004481]">DECLARAÇÃO DE RECEBIMENTO</p>
      <p className="mt-2">
        Declaro ter recebido o equipamento descrito e concordo com os termos estabelecidos.
      </p>
      <br />
      <p>Local e Data: {new Date(data.data).toLocaleDateString()}</p>
      <br />
      <p className="mt-4"><strong>Assinatura do Representante do EMPREGADOR:</strong></p>
      {data.assinatura_tecnico ? (
        <img src={data.assinatura_tecnico} alt="Assinatura do Técnico" className="mt-2 border" />
      ) : (
        <p className="italic">Aguardando assinatura do técnico.</p>
      )}
      <br />
      <p className="mt-4"><strong>Assinatura do FUNCIONÁRIO:</strong></p>
      {data.assinatura_usuario ? (
        <img src={data.assinatura_usuario} alt="Assinatura do Funcionário" className="mt-2 border" />
      ) : (
        <p className="italic">Aguardando assinatura do funcionário.</p>
      )}
    </div>
  );
};

export default function Home() {
  // Estado do fluxo (wizard)
  const [currentStep, setCurrentStep] = useState<number>(1);
  // Estados dos formulários e dados
  const [techForm, setTechForm] = useState<TechForm>(initialTechForm);
  const [termos, setTermos] = useState<TermoAssinatura[]>([]);
  const [alert, setAlert] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [selectedTermId, setSelectedTermId] = useState<number | null>(null);
  const [modalTerm, setModalTerm] = useState<TermoAssinatura | null>(null);
  const [exportTerm, setExportTerm] = useState<TermoAssinatura | null>(null);

  // Refs para assinaturas e exportação
  const techSigPadRef = useRef<SignatureCanvas>(null);
  const userSigPadRef = useRef<SignatureCanvas>(null);
  const termRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  // Carrega os termos do localStorage ao montar
  useEffect(() => {
    setTermos(loadTerms());
  }, []);

  // useEffect para exportar o termo quando exportTerm for definido
  useEffect(() => {
    if (exportTerm && exportRef.current) {
      html2canvas(exportRef.current, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Cabeçalho personalizado
        pdf.setFontSize(16);
        pdf.setTextColor(0, 68, 129); // #004481
        pdf.text("Projeta Engenharia", 10, 15);
        pdf.setFontSize(10);
        pdf.text("RUA A - VILA VICENTE FIALHO, CASA 01 - CNPJ: 04.892.580/0001-20", 10, 22);

        const marginTop = 30;
        const imgProps = pdf.getImageProperties(imgData);
        const imgWidth = pdfWidth - 20;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 10, marginTop, imgWidth, imgHeight);

        // Rodapé personalizado
        pdf.setFontSize(10);
        pdf.text("Termo Assinado - Projeta Engenharia", 10, pdfHeight - 10);

        pdf.save(`termo-${exportTerm.id}.pdf`);
        setExportTerm(null);
      });
    }
  }, [exportTerm]);

  // Navegação entre etapas
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  // Validação simples para o formulário do técnico
  const validateTechForm = () => {
    if (
      !techForm.nome_funcionario ||
      !techForm.cargo ||
      !techForm.cpf ||
      !techForm.endereco_funcionario ||
      !techForm.tipo_equipamento ||
      !techForm.marca ||
      !techForm.modelo ||
      !techForm.numero_serie
    ) {
      setAlert({ message: 'Preencha todos os campos obrigatórios.', type: 'error' });
      return false;
    }
    return true;
  };

  // Manipulação do formulário do técnico
  const handleTechChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTechForm(prev => ({ ...prev, [name]: value }));
  };

  const clearTechSignature = () => {
    techSigPadRef.current?.clear();
  };

  const handleTechSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateTechForm()) return;
    if (techSigPadRef.current?.isEmpty()) {
      setAlert({ message: 'O técnico precisa fornecer sua assinatura digital.', type: 'error' });
      return;
    }
    const assinaturaTecnico = techSigPadRef.current.getTrimmedCanvas().toDataURL('image/png');
    const novoTermo: TermoAssinatura = {
      id: getNextId(),
      nome_funcionario: techForm.nome_funcionario,
      cargo: techForm.cargo,
      cpf: techForm.cpf,
      endereco_funcionario: techForm.endereco_funcionario,
      tipo_equipamento: techForm.tipo_equipamento,
      marca: techForm.marca,
      modelo: techForm.modelo,
      numero_serie: techForm.numero_serie,
      acessorios: techForm.acessorios,
      assinatura_tecnico: assinaturaTecnico,
      assinatura_usuario: '',
      data: new Date().toISOString(),
    };
    const novosTermos = [...termos, novoTermo];
    setTermos(novosTermos);
    saveTerms(novosTermos);
    setTechForm(initialTechForm);
    clearTechSignature();
    setAlert({ message: 'Termo cadastrado com sucesso!', type: 'success' });
    nextStep();
  };

  // Manipulação para assinatura do funcionário
  const clearUserSignature = () => {
    userSigPadRef.current?.clear();
  };

  const handleUserSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedTermId === null) {
      setAlert({ message: 'Selecione um termo para assinar.', type: 'error' });
      return;
    }
    if (userSigPadRef.current?.isEmpty()) {
      setAlert({ message: 'Forneça sua assinatura digital.', type: 'error' });
      return;
    }
    const assinaturaUsuario = userSigPadRef.current.getTrimmedCanvas().toDataURL('image/png');
    const updatedTerms = termos.map(term => {
      if (term.id === selectedTermId) {
        return { ...term, assinatura_usuario: assinaturaUsuario };
      }
      return term;
    });
    setTermos(updatedTerms);
    saveTerms(updatedTerms);
    setAlert({ message: 'Termo assinado com sucesso!', type: 'success' });
    nextStep();
  };

  // Função para exportar o termo finalizado (usada na etapa 4)
  const exportToPDF = () => {
    if (!termRef.current) return;
    html2canvas(termRef.current, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Cabeçalho
      pdf.setFontSize(16);
      pdf.setTextColor(0, 68, 129);
      pdf.text("Projeta Engenharia", 10, 15);
      pdf.setFontSize(10);
      pdf.text("RUA A - VILA VICENTE FIALHO, CASA 01 - CNPJ: 04.892.580/0001-20", 10, 22);

      const marginTop = 30;
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth - 20;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 10, marginTop, imgWidth, imgHeight);

      // Rodapé
      pdf.setFontSize(10);
      pdf.text("Termo Assinado - Projeta Engenharia", 10, pdfHeight - 10);

      pdf.save('termo-assinatura.pdf');
    });
  };

  // Função para exportar um termo específico do histórico para PDF
  const exportTermToPDF = (term: TermoAssinatura) => {
    setExportTerm(term);
  };

  // useEffect para exportar o termo quando exportTerm for definido
  useEffect(() => {
    if (exportTerm && exportRef.current) {
      html2canvas(exportRef.current, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Cabeçalho
        pdf.setFontSize(16);
        pdf.setTextColor(0, 68, 129);
        pdf.text("Projeta Engenharia", 10, 15);
        pdf.setFontSize(10);
        pdf.text("RUA A - VILA VICENTE FIALHO, CASA 01 - CNPJ: 04.892.580/0001-20", 10, 22);

        const marginTop = 30;
        const imgProps = pdf.getImageProperties(imgData);
        const imgWidth = pdfWidth - 20;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 10, marginTop, imgWidth, imgHeight);

        // Rodapé
        pdf.setFontSize(10);
        pdf.text("Termo Assinado - Projeta Engenharia", 10, pdfHeight - 10);

        pdf.save(`termo-${exportTerm.id}.pdf`);
        setExportTerm(null);
      });
    }
  }, [exportTerm]);

  // Simula compartilhamento por email
  const shareViaEmail = () => {
    window.location.href =
      "mailto:?subject=Termo Assinado&body=Segue o termo assinado em anexo (simulação).";
  };

  // Filtra os termos pendentes de assinatura do funcionário
  const termosPendentes = termos.filter(term => !term.assinatura_usuario);
  const selectedTerm = termos.find(t => t.id === selectedTermId);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#004481]">Projeta Engenharia</h1>
          <nav>
            <a
              href="https://www.projetacs.com/"
              target="_blank"
              rel="noreferrer"
              className="text-[#004481] font-semibold"
            >
              Visite o Site
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {alert && (
          <div className={`mb-6 rounded p-3 text-center ${alert.type === 'error' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
            {alert.message}
          </div>
        )}

        <StepIndicator currentStep={currentStep} totalSteps={4} />

        <AnimatePresence exitBeforeEnter>
          {/* Etapa 1: Cadastro do Termo (Técnico) */}
          {currentStep === 1 && (
            <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
              <Card className="mb-6 bg-white rounded-lg shadow-lg border border-[#004481]">
                <CardHeader className="bg-[#004481] text-white p-4 rounded-t-lg">
                  <CardTitle className="text-2xl">Cadastro do Termo (Técnico)</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleTechSubmit} className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div title="Informe o nome completo do funcionário">
                        <Label htmlFor="nome_funcionario">Nome do Funcionário</Label>
                        <Input id="nome_funcionario" name="nome_funcionario" value={techForm.nome_funcionario} onChange={handleTechChange} required />
                      </div>
                      <div title="Informe o cargo do funcionário">
                        <Label htmlFor="cargo">Cargo</Label>
                        <Input id="cargo" name="cargo" value={techForm.cargo} onChange={handleTechChange} required />
                      </div>
                      <div title="Informe o CPF do funcionário">
                        <Label htmlFor="cpf">CPF</Label>
                        <Input id="cpf" name="cpf" value={techForm.cpf} onChange={handleTechChange} required />
                      </div>
                      <div title="Informe o endereço do funcionário">
                        <Label htmlFor="endereco_funcionario">Endereço</Label>
                        <Input id="endereco_funcionario" name="endereco_funcionario" value={techForm.endereco_funcionario} onChange={handleTechChange} required />
                      </div>
                      <div title="Ex.: Notebook, Desktop">
                        <Label htmlFor="tipo_equipamento">Tipo de Equipamento</Label>
                        <Input id="tipo_equipamento" name="tipo_equipamento" value={techForm.tipo_equipamento} onChange={handleTechChange} required />
                      </div>
                      <div title="Informe a marca do equipamento">
                        <Label htmlFor="marca">Marca</Label>
                        <Input id="marca" name="marca" value={techForm.marca} onChange={handleTechChange} required />
                      </div>
                      <div title="Informe o modelo do equipamento">
                        <Label htmlFor="modelo">Modelo</Label>
                        <Input id="modelo" name="modelo" value={techForm.modelo} onChange={handleTechChange} required />
                      </div>
                      <div title="Informe o número de série">
                        <Label htmlFor="numero_serie">Número de Série</Label>
                        <Input id="numero_serie" name="numero_serie" value={techForm.numero_serie} onChange={handleTechChange} required />
                      </div>
                      <div className="md:col-span-2" title="Liste os acessórios, se houver">
                        <Label htmlFor="acessorios">Acessórios</Label>
                        <Input id="acessorios" name="acessorios" value={techForm.acessorios} onChange={handleTechChange} />
                      </div>
                    </div>

                    {/* Assinatura do Técnico */}
                    <div className="mt-4">
                      <Label>Assinatura Digital do Técnico (Representante da Empresa)</Label>
                      <div className="border border-gray-300 rounded">
                        <SignatureCanvas ref={techSigPadRef} penColor="black" canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }} />
                      </div>
                      <Button variant="outline" onClick={clearTechSignature} className="mt-2 hover:scale-105 transition-transform">
                        Limpar Assinatura
                      </Button>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" className="mt-4 bg-[#004481] text-white hover:scale-105 transition-transform">
                        Avançar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Etapa 2: Prévia do Termo */}
          {currentStep === 2 && (
            <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
              <Card className="mb-6 bg-white rounded-lg shadow-lg border border-[#004481]">
                <CardHeader className="bg-[#002E5D] text-white p-4 rounded-t-lg">
                  <CardTitle className="text-2xl">Prévia do Termo</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="mb-4 italic text-gray-700">Revise os dados preenchidos:</p>
                  {renderPreview(undefined, techForm)}
                </CardContent>
                <div className="flex justify-between p-4">
                  <Button onClick={prevStep} className="bg-gray-400 text-white hover:scale-105 transition-transform">
                    Voltar
                  </Button>
                  <Button onClick={nextStep} className="bg-[#004481] text-white hover:scale-105 transition-transform">
                    Avançar
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Etapa 3: Assinatura do Termo (Funcionário) */}
          {currentStep === 3 && (
            <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
              <Card className="mb-6 bg-white rounded-lg shadow-lg border border-[#004481]">
                <CardHeader className="bg-[#002E5D] text-white p-4 rounded-t-lg">
                  <CardTitle className="text-2xl">Assinatura do Termo (Funcionário)</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {termosPendentes.length === 0 ? (
                    <p className="text-gray-700">Nenhum termo pendente para assinatura.</p>
                  ) : (
                    <>
                      <div className="mb-4">
                        <Label htmlFor="selectTermo">Selecione o Termo a Assinar</Label>
                        <select
                          id="selectTermo"
                          className="w-full p-2 border rounded"
                          value={selectedTermId ?? ''}
                          onChange={(e) => setSelectedTermId(Number(e.target.value))}
                        >
                          <option value="">-- Selecione --</option>
                          {termosPendentes.map((termo) => (
                            <option key={termo.id} value={termo.id}>
                              {`[${termo.id}] ${termo.nome_funcionario} - ${termo.tipo_equipamento}`}
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedTerm && (
                        <div ref={termRef} className="mb-4">
                          {renderPreview(selectedTerm)}
                        </div>
                      )}

                      <div className="mt-4">
                        <Label>Assinatura Digital do Funcionário</Label>
                        <div className="border border-gray-300 rounded">
                          <SignatureCanvas ref={userSigPadRef} penColor="black" canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }} />
                        </div>
                        <Button variant="outline" onClick={clearUserSignature} className="mt-2 hover:scale-105 transition-transform">
                          Limpar Assinatura
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
                <div className="flex justify-between p-4">
                  <Button onClick={prevStep} className="bg-gray-400 text-white hover:scale-105 transition-transform">
                    Voltar
                  </Button>
                  <Button onClick={handleUserSubmit} className="bg-[#004481] text-white hover:scale-105 transition-transform">
                    Assinar Termo
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Etapa 4: Confirmação, Exportação e Compartilhamento */}
          {currentStep === 4 && (
            <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
              <Card className="mb-6 bg-white rounded-lg shadow-lg border border-[#004481]">
                <CardHeader className="bg-[#004481] text-white p-4 rounded-t-lg">
                  <CardTitle className="text-2xl">Termo Finalizado</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="mb-4 text-gray-700">O termo foi assinado com sucesso!</p>
                  {selectedTerm ? (
                    <div ref={termRef}>
                      {renderPreview(selectedTerm)}
                    </div>
                  ) : (
                    <p className="text-gray-700">Nenhum termo selecionado para visualização.</p>
                  )}
                </CardContent>
                <div className="flex justify-between p-4">
                  <Button onClick={prevStep} className="bg-gray-400 text-white hover:scale-105 transition-transform">
                    Voltar
                  </Button>
                  <div className="flex gap-3">
                    <Button onClick={exportToPDF} className="bg-[#004481] text-white hover:scale-105 transition-transform">
                      Exportar para PDF
                    </Button>
                    <Button onClick={shareViaEmail} className="bg-[#004481] text-white hover:scale-105 transition-transform">
                      Compartilhar por Email
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Histórico de Termos com botão de exportar PDF para cada termo */}
        <Card className="mt-6 bg-white rounded-lg shadow-lg border border-[#004481]">
          <CardHeader className="bg-[#002E5D] text-white p-4 rounded-t-lg">
            <CardTitle className="text-xl">Histórico de Termos</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {termos.length === 0 ? (
              <p className="text-gray-700">Nenhum termo cadastrado.</p>
            ) : (
              <ul>
                {termos.map((termo) => (
                  <li
                    key={termo.id}
                    className="mb-4 border-b pb-2 flex items-center justify-between"
                  >
                    <div
                      className="cursor-pointer hover:underline"
                      onClick={() => setModalTerm(termo)}
                    >
                      <strong className="text-[#004481]">{termo.nome_funcionario}</strong> - {new Date(termo.data).toLocaleString()}
                      <br />
                      <p className="text-gray-700">Equipamento: {termo.tipo_equipamento} - {termo.marca} {termo.modelo}</p>
                    </div>
                    <Button
                      onClick={() => exportTermToPDF(termo)}
                      className="bg-[#004481] text-white hover:scale-105 transition-transform"
                    >
                      Exportar PDF
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Container off-screen para exportação do termo específico */}
        <div ref={exportRef} className="absolute left-[-10000px]">
          {exportTerm && renderPreview(exportTerm)}
        </div>

        {/* Modal para visualizar termo assinado */}
        <AnimatePresence>
          {modalTerm && (
            <TermModal term={modalTerm} onClose={() => setModalTerm(null)} />
          )}
        </AnimatePresence>
        </main>
    </div>
  );
}
