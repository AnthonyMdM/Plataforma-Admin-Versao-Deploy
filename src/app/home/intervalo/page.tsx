"use client";
import React, { useRef } from "react";
import { getVendasPorIntervalo } from "../actions";
import { Venda } from "@prisma/client";

export default function Vendas() {
  const [date, setDate] = React.useState<Venda[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const today = new Date().toISOString().split("T")[0];

  const dateInicioValueRef = useRef<HTMLInputElement>(null);
  const dateFimValueRef = useRef<HTMLInputElement>(null);

  const handleBuscarPorIntervalo = async () => {
    if (!dateInicioValueRef.current || !dateFimValueRef.current) return;

    const dateInicioValue = dateInicioValueRef.current.value;
    const dateFimValue = dateFimValueRef.current.value;

    // Validação: pelo menos uma date deve ser preenchida
    if (!dateInicioValue || !dateFimValue) {
      setError("Selecione as datas");
      return;
    }

    if (dateInicioValue > dateFimValue) {
      setError("Date de início não pode ser posterior à date de fim");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const { vendas } = await getVendasPorIntervalo(
        new Date(dateInicioValue),
        new Date(dateFimValue)
      );

      if (vendas.length === 0) {
        setError("Não há vendas no período");
        setDate([]);
      } else {
        setDate(vendas);
      }
    } catch {
      setError("Erro ao buscar vendas por intervalo");
      setDate([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white text-black">
      <h1 className="text-xl font-bold mb-4">
        Buscar Vendas por Intervalo de Dates ({date.length} encontradas)
      </h1>

      {/* Inputs de Date na mesma linha */}
      <div className="border border-gray-300 p-4 rounded-lg mb-6">
        <div className="flex gap-6 flex-wrap items-end">
          {/* Date Início */}
          <div className="flex-1 min-w-[200px]">
            <label className="block font-medium mb-1 text-sm text-green-700">
              📅 Date Início
            </label>
            <input
              ref={dateInicioValueRef}
              type="date"
              max={today}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Date Fim */}
          <div className="flex-1 min-w-[200px]">
            <label className="block font-medium mb-1 text-sm text-red-700">
              📅 Date Fim
            </label>
            <input
              ref={dateFimValueRef}
              type="date"
              max={today}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleBuscarPorIntervalo}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors font-medium shadow-md"
        >
          {loading ? "Buscando..." : "🔍 Buscar por Intervalo"}
        </button>

        <button
          onClick={() => {
            // Reset todos os campos
            if (dateInicioValueRef.current)
              dateInicioValueRef.current.value = "";
            if (dateFimValueRef.current) dateFimValueRef.current.value = "";

            setDate([]);
            setError(null);
          }}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium shadow-md"
        >
          🔄 Limpar Filtros
        </button>
      </div>

      {/* Estados de loading/error */}
      {loading && (
        <div className="flex items-center gap-2 text-blue-600 mb-4">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
          Carregando...
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Lista de vendas */}
      {!loading && !error && date.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-medium text-gray-700">
            Vendas encontradas no intervalo ({date.length} resultados):
          </h2>
          {date.map((venda) => (
            <div
              key={venda.id}
              className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">Venda R${venda.valor_total}</span>
                <span className="font-medium">Venda R${venda.valor_total}</span>
                <span className="text-gray-600">
                  {new Date(venda.data).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    weekday: "short",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && date.length === 0 && (
        <div className="text-center text-gray-600 py-8">
          Nenhuma venda encontrada no intervalo selecionado
        </div>
      )}
    </div>
  );
}
