from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import date

app = FastAPI()

# Configuração do CORS (permite que o frontend se comunique com este backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique o(s) domínio(s) do frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo Pydantic para cada "Ativo"
class Ativo(BaseModel):
    id: int
    localidade: str
    numero_serie: str
    patrimonio: str
    status: str
    data: Optional[date] = None
    no_posto: Optional[str] = None
    fabricante: Optional[str] = None
    marca_modelo: Optional[str] = None
    ramal_servidor: Optional[str] = None
    ip: Optional[str] = None
    observacao: Optional[str] = None
    termo_assinado: Optional[bool] = False

# "Banco de dados" em memória (apenas para demonstração)
banco_de_ativos: List[Ativo] = []

@app.get("/ativos", response_model=List[Ativo])
def listar_ativos():
    return banco_de_ativos

@app.post("/ativos", response_model=Ativo)
def criar_ativo(ativo: Ativo):
    # Verifica se já existe um ativo com o mesmo ID
    for a in banco_de_ativos:
        if a.id == ativo.id:
            raise HTTPException(status_code=400, detail="Já existe um ativo com esse ID.")

    banco_de_ativos.append(ativo)
    return ativo

@app.get("/ativos/{ativo_id}", response_model=Ativo)
def obter_ativo(ativo_id: int):
    for ativo in banco_de_ativos:
        if ativo.id == ativo_id:
            return ativo
    raise HTTPException(status_code=404, detail="Ativo não encontrado")

@app.put("/ativos/{ativo_id}", response_model=Ativo)
def atualizar_ativo(ativo_id: int, dados_atualizados: Ativo):
    for i, ativo in enumerate(banco_de_ativos):
        if ativo.id == ativo_id:
            banco_de_ativos[i] = dados_atualizados
            return dados_atualizados
    raise HTTPException(status_code=404, detail="Ativo não encontrado")

@app.delete("/ativos/{ativo_id}")
def deletar_ativo(ativo_id: int):
    for i, ativo in enumerate(banco_de_ativos):
        if ativo.id == ativo_id:
            del banco_de_ativos[i]
            return {"detail": "Ativo removido com sucesso"}
    raise HTTPException(status_code=404, detail="Ativo não encontrado")
