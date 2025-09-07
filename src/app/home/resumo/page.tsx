"use client";
import { useFetchContext } from "@/app/componentes/context/useContex";
import React from "react";

export default function Venda() {
  const { value, data, setValue, loading, error } = useFetchContext();
  const anoAtual = new Date().getFullYear();
  const anoCriacao = 2020;
  const anosDisponiveis = Array.from(
    { length: anoAtual - anoCriacao + 1 },
    (_, i) => anoAtual - i
  );
  const [mes, setMes] = React.useState<number | null>(null);
  const [dia, setDia] = React.useState<number | null>(null);

  const vendasLista = data.vendas;
  const filtros = data.filtros;

  const vendasFiltradas = vendasLista.filter((v) => {
    const d = new Date(v.data);
    return (
      (mes ? d.getMonth() + 1 === mes : true) &&
      (dia ? d.getDate() === dia : true)
    );
  });
  return (
    <div className="p-6 bg-white text-black">
      <h1 className="text-xl font-bold mb-4">Vendas</h1>

      {/* Filtros */}
      <div className="flex gap-4 mb-6">
        {/* Filtro Ano */}
        <div>
          <label className="block font-medium mb-1">Ano</label>
          <select
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="border p-2 rounded"
          >
            {anosDisponiveis.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Mês */}
        <div>
          <label className="block font-medium mb-1">Mês</label>
          <select
            value={mes ?? ""}
            onChange={(e) =>
              setMes(e.target.value ? Number(e.target.value) : null)
            }
            className="border p-2 rounded"
          >
            <option value="">Todos</option>
            {filtros.map((f) => (
              <option key={f.mes} value={f.mes}>
                {f.mes}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Dia */}
        <div>
          <label className="block font-medium mb-1">Dia</label>
          <select
            value={dia ?? ""}
            onChange={(e) =>
              setDia(e.target.value ? Number(e.target.value) : null)
            }
            className="border p-2 rounded"
          >
            <option value="">Todos</option>
            {mes &&
              filtros
                .find((f) => f.mes === mes)
                ?.dias.sort((a, b) => a - b)
                .map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
          </select>
        </div>
      </div>

      {/* Lista de vendas */}
      {loading && <p>Carregando....</p>}
      {error && <p>{error}</p>}
      {vendasFiltradas.length > 0 && (
        <ul className="space-y-2">
          {vendasFiltradas.map((v) => (
            <li key={v.id} className="border p-3 rounded">
              Venda #{v.id} - {new Date(v.data).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
