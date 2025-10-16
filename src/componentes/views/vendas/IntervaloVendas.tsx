"use client";
import React, { useRef } from "react";
import useSWR from "swr";
import { getVendasPorIntervalo } from "@/actions/actionsVendas";
import { Venda } from "@prisma/client";
import Link from "next/link";

async function fetchVendas([_, start, end]: [string, string, string]) {
  if (!start || !end) return [];
  const { vendas } = await getVendasPorIntervalo(
    new Date(start),
    new Date(end)
  );
  return vendas;
}

export default function VendasIntervalo() {
  const today = new Date().toISOString().split("T")[0];

  const dateInicioValueRef = useRef<HTMLInputElement>(null);
  const dateFimValueRef = useRef<HTMLInputElement>(null);

  const [intervalo, setIntervalo] = React.useState<[string, string] | null>(
    null
  );

  const {
    data: vendas,
    error,
    isLoading,
  } = useSWR<Venda[]>(
    intervalo ? ["vendasIntervalo", intervalo[0], intervalo[1]] : null,
    fetchVendas
  );

  const handleBuscarPorIntervalo = () => {
    const start = dateInicioValueRef.current?.value;
    const end = dateFimValueRef.current?.value;

    if (!start || !end) {
      alert("Selecione as datas");
      return;
    }
    if (start > end) {
      alert("A data de início não pode ser posterior à data final");
      return;
    }

    setIntervalo([start, end]);
  };

  return (
    <section className="section">
      <h1 className="titulo mb-2 md:mb-6 flex flex-col items-baseline gap-1">
        Vendas
        <span className="md:text-xl text-sm">
          por Intervalo de Datas: ({vendas?.length ?? 0} encontrada
          {vendas && vendas.length !== 1 ? "s" : ""})
        </span>
      </h1>

      <div className="border border-gray-300 p-4 rounded-lg mb-6">
        <div className="flex gap-6 flex-wrap items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block font-medium mb-1 text-sm text-green-700 lg:text-lg">
              Data Início
            </label>
            <input
              ref={dateInicioValueRef}
              type="date"
              max={today}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block font-medium mb-1 text-sm lg:text-lg text-red-700">
              Data Fim
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

      <div className="flex gap-4 mb-6">
        <button
          onClick={handleBuscarPorIntervalo}
          disabled={isLoading}
          className="py-2 text:lg md:px-3 md:py-4 text-sm md:text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors shadow-md md:w-30 md:h-15 w-20 h-15 font-semibold"
        >
          {isLoading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-blue-600 mb-4">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
          Carregando...
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Erro ao buscar vendas
        </div>
      )}

      {!isLoading && !error && vendas && vendas.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-medium text-gray-700">
            Vendas encontradas no intervalo ({vendas.length} resultados):
          </h2>
          {vendas.map((venda) => (
            <Link href={`/venda/${venda.id}`} key={venda.id} className="p-4">
              <div className="flex justify-between items-center px-6 py-5 w-full hover:bg-gray-100">
                <span className="font-medium">Venda #{venda.id}</span>
                <span className="text-gray-600">
                  {new Date(venda.data).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    weekday: "short",
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!isLoading && !error && vendas?.length === 0 && (
        <div className="text-center text-gray-600 py-8">
          Nenhuma venda encontrada no intervalo selecionado
        </div>
      )}
    </section>
  );
}
