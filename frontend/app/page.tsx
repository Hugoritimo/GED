"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    
    if (!usuario || !senha) {
      setErro("Por favor, preencha ambos os campos.");
      return;
    }

    setLoading(true);
    try {
      // Simule a chamada de API ou substitua pela integração real
      setTimeout(() => {
        setLoading(false);
        router.push("/home");
      }, 1500);
    } catch (error) {
      setErro("Erro ao efetuar login. Tente novamente mais tarde.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <Card className="max-w-md w-full p-8 shadow-lg">
        <CardHeader className="mb-6 text-center">
          <CardTitle className="text-3xl font-bold text-blue-800">
            Projeta Engenharia
          </CardTitle>
          <p className="mt-2 text-sm text-gray-600">
            Bem-vindo! Faça seu login para acessar o sistema.
          </p>
        </CardHeader>
        <CardContent>
          {erro && (
            <div className="mb-4 text-center text-red-600">
              {erro}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label htmlFor="usuario" className="block mb-1">
                Usuário
              </Label>
              <Input
                id="usuario"
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                placeholder="Digite seu usuário"
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="senha" className="block mb-1">
                Senha
              </Label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                placeholder="Digite sua senha"
                className="w-full"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 text-white hover:bg-blue-800 transition-colors"
            >
              {loading ? "Aguarde..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
