"use client";
import React, { useMemo } from "react";
import { getVendasPorAno } from "../../../actions/actionsVendas";
import { Vendas } from "@/types/tyeps-global";
import Link from "next/link";

export default function Venda() {
  const anoAtual = new Date().getFullYear();
  const anoCriacao = 2020;
  const anosDisponiveis = Array.from(
    { length: anoAtual - anoCriacao + 1 },
    (_, i) => anoAtual - i
  );

  const [ano, setAno] = React.useState<number>(anoAtual);
  const [mes, setMes] = React.useState<number | null>(null);
  const [dia, setDia] = React.useState<number | null>(null);
  const [data, setData] = React.useState<Vendas[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const opcoesFiltro = useMemo(() => {
    const mesesComDados = new Map<number, Set<number>>();

    data.forEach((venda) => {
      const dataVenda = new Date(venda.data);
      const mesVenda = dataVenda.getMonth() + 1;
      const diaVenda = dataVenda.getDate();

      if (!mesesComDados.has(mesVenda)) {
        mesesComDados.set(mesVenda, new Set());
      }
      mesesComDados.get(mesVenda)!.add(diaVenda);
    });

    return {
      meses: Array.from(mesesComDados.keys()).sort((a, b) => a - b),
      diasDoMes: mes
        ? Array.from(mesesComDados.get(mes) || []).sort((a, b) => a - b)
        : [],
    };
  }, [data, mes]);

  const vendasFiltradas = useMemo(() => {
    return data.filter((venda) => {
      const dataVenda = new Date(venda.data);
      const mesVenda = dataVenda.getMonth() + 1;
      const diaVenda = dataVenda.getDate();

      return (!mes || mesVenda === mes) && (!dia || diaVenda === dia);
    });
  }, [data, mes, dia]);

  function handleAno(anoEscolha: number) {
    setAno(anoEscolha);
    setMes(null);
    setDia(null);
  }

  function handleMes(mesEscolha: number | null) {
    setMes(mesEscolha);
    setDia(null);
  }

  React.useEffect(() => {
    async function fetchInfo(ano: number) {
      setLoading(true);
      setError(null);

      try {
        const { vendas } = await getVendasPorAno(ano);

        if (vendas.length === 0) {
          setError("Não há vendas nesse período");
          setData([]);
        } else {
          setData(vendas);
        }
      } catch {
        setError("Erro inesperado");
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchInfo(ano);
  }, [ano]);

  const nomesMeses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  return (
    <div className=" p-4 xl:p-6 h-[100%] bg-white text-black">
      <h1 className="text-2xl font-bold xl:mt-2 mb-6">
        Vendas ({vendasFiltradas.length} encontrada
        {vendasFiltradas.length !== 1 ? "s" : ""})
      </h1>

      <div className="flex gap-4 text-lg mb-6 flex-wrap">
        <div>
          <label className="block font-medium mb-1">Ano</label>
          <select
            value={ano}
            onChange={(e) => handleAno(Number(e.target.value))}
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {anosDisponiveis.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Mês</label>
          <select
            value={mes ?? ""}
            onChange={(e) =>
              handleMes(e.target.value ? Number(e.target.value) : null)
            }
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={opcoesFiltro.meses.length === 0}
          >
            <option value="">Todos os meses</option>
            {opcoesFiltro.meses.map((m) => (
              <option key={m} value={m}>
                {nomesMeses[m - 1]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Dia</label>
          <select
            value={dia ?? ""}
            onChange={(e) =>
              setDia(e.target.value ? Number(e.target.value) : null)
            }
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!mes || opcoesFiltro.diasDoMes.length === 0}
          >
            <option value="">Todos os dias</option>
            {opcoesFiltro.diasDoMes.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Botão limpar filtros */}
        {(mes || dia) && (
          <div className="flex items-end">
            <button
              onClick={() => {
                setMes(null);
                setDia(null);
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {/* Estados de loading/error */}
      {loading && (
        <div className="flex items-center gap-2 text-blue-600">
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
      {!loading && !error && vendasFiltradas.length > 0 && (
        <div className="space-y-2">
          {vendasFiltradas.map((venda) => (
            <Link href={`/home/filtro/venda/${venda.id}`} key={venda.id}>
              <div className="px-6 py-5 w-full flex justify-around hover:bg-gray-100 items-center">
                <span className="font-medium">Venda #{venda.id}</span>
                <span className="font-medium hidden xl:block">Vendedor: {venda.userId}</span>
                <span className="text-gray-600">
                  {new Date(venda.data).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading &&
        !error &&
        vendasFiltradas.length === 0 &&
        data.length > 0 && (
          <div className="text-center text-gray-600 py-8">
            Nenhuma venda encontrada com os filtros aplicados
          </div>
        )}
    </div>
  );
}
