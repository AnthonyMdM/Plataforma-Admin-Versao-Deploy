"use client";
import Link from "next/link";
import React from "react";
import { PerfilPageProps } from "@/types/tyeps-global";
import useSWR from "swr";
import { getVendasUserId } from "@/actions/actionsVendas";
import useCombobox from "@/hooks/useCombobox";
import { Vendas } from "@/types/tyeps-global";

async function fetcher([_, id]: [string, string]) {
  return await getVendasUserId(+id);
}

export default function PerfilPage({ user }: PerfilPageProps) {
  const { data, error } = useSWR(["vendasUser", user.id], fetcher, {
    keepPreviousData: true,
  });

  const anoAtual = new Date().getFullYear();
  const anoCriacao = 2020;
  const anosDisponiveis = Array.from(
    { length: anoAtual - anoCriacao + 1 },
    (_, i) => anoAtual - i
  );

  const [ano, setAno] = React.useState<number>(anoAtual);
  const [dados, setDados] = React.useState<Vendas[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [erro, setError] = React.useState<string | null>(null);

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

  const { opcoesMeses } = React.useMemo(() => {
    const mesesComDados = new Map<number, Set<number>>();

    dados.forEach((venda) => {
      const dataVenda = new Date(venda.data);
      const mesVenda = dataVenda.getMonth() + 1;
      const diaVenda = dataVenda.getDate();

      if (!mesesComDados.has(mesVenda)) {
        mesesComDados.set(mesVenda, new Set());
      }
      mesesComDados.get(mesVenda)!.add(diaVenda);
    });

    const meses: Record<string, string> = {};
    Array.from(mesesComDados.keys())
      .sort((a, b) => a - b)
      .forEach((m) => {
        meses[nomesMeses[m - 1]] = String(m);
      });

    return { opcoesMeses: meses, mesesComDados };
  }, [data]);

  const comboboxMes = useCombobox(opcoesMeses);

  const opcoesDiasAtual = React.useMemo(() => {
    if (!comboboxMes.selected) return {};

    const mesNum = Number(comboboxMes.selected);
    const dias: Record<string, string> = {};

    dados.forEach((venda) => {
      const dataVenda = new Date(venda.data);
      const mesVenda = dataVenda.getMonth() + 1;
      const diaVenda = dataVenda.getDate();

      if (mesVenda === mesNum) {
        dias[`Dia ${diaVenda}`] = String(diaVenda);
      }
    });

    return dias;
  }, [data, comboboxMes.selected]);

  const comboboxDia = useCombobox(opcoesDiasAtual);

  const vendasFiltradas = React.useMemo(() => {
    return dados.filter((venda) => {
      const dataVenda = new Date(venda.data);
      const mesVenda = dataVenda.getMonth() + 1;
      const diaVenda = dataVenda.getDate();

      const mesFiltro = comboboxMes.selected
        ? Number(comboboxMes.selected)
        : null;
      const diaFiltro = comboboxDia.selected
        ? Number(comboboxDia.selected)
        : null;

      return (
        (!mesFiltro || mesVenda === mesFiltro) &&
        (!diaFiltro || diaVenda === diaFiltro)
      );
    });
  }, [data, comboboxMes.selected, comboboxDia.selected]);

  function handleAno(anoEscolha: number) {
    setAno(anoEscolha);
    comboboxMes.reset();
    comboboxDia.reset();
  }

  React.useEffect(() => {
    comboboxDia.reset();
  }, [comboboxMes.selected]);

  React.useEffect(() => {
    async function fetchInfo() {
      setLoading(true);
      setError(null);

      try {
        const { vendas } = await getVendasUserId(+user.id);

        if (vendas.length === 0) {
          setError("Não há vendas nesse período");
          setDados([]);
        } else {
          setDados(vendas);
        }
      } catch {
        setError("Erro inesperado");
        setDados([]);
      } finally {
        setLoading(false);
      }
    }

    fetchInfo();
  }, []);
  return (
    <div className="w-full overflow-x-auto h-full bg-white">
      <nav className="bg-black py-1 pl-5 flex *:text-white justify-around font-poppins">
        <div className="flex gap-2">
          <h1>Vendas:</h1>
          <div className="flex gap-3 *:hover:opacity-80">
            <Link href={"/vendas/criar"}>Criar Venda</Link>
            <Link href={"/vendas/filtro"}>Filtro Dinâmico</Link>
            <Link href={"/vendas/intervalo"}>Filtro por Intervalo</Link>
          </div>
        </div>
        <div className="flex gap-3 ">
          <h1>Produtos:</h1>
          <div className="flex gap-3 *:hover:opacity-80">
            <Link href={"/produtos"}>Todos os Produtos</Link>
            <Link href={"/criarProduto"}>Criar Produtos</Link>
          </div>
        </div>
      </nav>
      {user && (
        <section className="mt-5 ml-8 *:mb-3">
          <h1 className="flex flex-col sm:flex-row md:gap-2 text-3xl sm:text-4xl md:text-5xl font-roboto w-max justify-start font-semibold">
            <p>Bem Vindo:</p> <span>{user.name}</span>
          </h1>
          <div className="flex-col text-xl sm:text-2xl md:text-3xl font-roboto">
            <p>Seu email é:</p>
            <span className="ml-5">{user.email}</span>
          </div>
          <div className="flex-col  text-xl sm:text-2xl md:text-3xl font-roboto">
            <p>Seu Cargo é de:</p>
            <span className="ml-5">{user.email}</span>
          </div>
          <div className="flex gap-4 text-lg mb-6 flex-wrap items-end">
            {/* Seletor de Ano */}
            {erro == null ? (
              <p>{erro}</p>
            ) : (
              <div>
                <label className="block font-medium mb-1">Ano</label>
                <select
                  value={ano}
                  onChange={(e) => handleAno(Number(e.target.value))}
                  disabled={loading}
                  className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {anosDisponiveis.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Combobox Mês */}
            <div className="relative">
              <label className="block font-medium mb-1">Mês</label>
              <div className="relative">
                <input
                  type="text"
                  value={comboboxMes.search}
                  onChange={(e) => comboboxMes.setSearch(e.target.value)}
                  onFocus={() => comboboxMes.setOpen(true)}
                  onBlur={() =>
                    setTimeout(() => comboboxMes.setOpen(false), 200)
                  }
                  onKeyDown={comboboxMes.handleKeyDown}
                  placeholder="Todos os meses"
                  disabled={Object.keys(opcoesMeses).length === 0}
                  className="border border-gray-300 p-2 rounded w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {comboboxMes.selected && (
                  <button
                    onClick={comboboxMes.handleClear}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    type="button"
                  >
                    ✕
                  </button>
                )}
              </div>

              {comboboxMes.open && comboboxMes.availableOptions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
                  {comboboxMes.availableOptions.map(([label, value], idx) => (
                    <div
                      key={value}
                      onClick={() => comboboxMes.handleSelect(label, value)}
                      className={`p-2 cursor-pointer ${
                        idx === comboboxMes.focusedIndex
                          ? "bg-blue-100"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Combobox Dia */}
            <div className="relative">
              <label className="block font-medium mb-1">Dia</label>
              <div className="relative">
                <input
                  type="text"
                  value={comboboxDia.search}
                  onChange={(e) => comboboxDia.setSearch(e.target.value)}
                  onFocus={() => comboboxDia.setOpen(true)}
                  onBlur={() =>
                    setTimeout(() => comboboxDia.setOpen(false), 200)
                  }
                  onKeyDown={comboboxDia.handleKeyDown}
                  placeholder="Todos os dias"
                  disabled={
                    !comboboxMes.selected ||
                    Object.keys(opcoesDiasAtual).length === 0
                  }
                  className="border border-gray-300 p-2 rounded w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {comboboxDia.selected && (
                  <button
                    onClick={comboboxDia.handleClear}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    type="button"
                  >
                    ✕
                  </button>
                )}
              </div>

              {comboboxDia.open && comboboxDia.availableOptions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
                  {comboboxDia.availableOptions.map(([label, value], idx) => (
                    <div
                      key={value}
                      onClick={() => comboboxDia.handleSelect(label, value)}
                      className={`p-2 cursor-pointer ${
                        idx === comboboxDia.focusedIndex
                          ? "bg-blue-100"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botão Limpar Filtros */}
            {(comboboxMes.selected || comboboxDia.selected) && (
              <div>
                <button
                  onClick={() => {
                    comboboxMes.reset();
                    comboboxDia.reset();
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                  type="button"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
          {!loading && !error && vendasFiltradas.length > 0 && (
            <ul className=" *:border-b-1 [&>*:last-child]:border-b-0 mb-2">
              {vendasFiltradas.map((venda) => (
                <li key={venda.id}>
                  <Link
                    href={`/venda/${venda.id}`}
                    className="px-6 py-5 w-full flex justify-around hover:bg-gray-100 items-center "
                  >
                    <span className="font-medium">Venda #{venda.id}</span>
                    <span className="font-medium hidden lg:block">
                      Vendedor: {venda.userId}
                    </span>
                    <span className="text-gray-600">
                      {new Date(venda.data).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
