"use client";
import {
  createProduto,
  deleteProduto,
  getProdutos,
} from "@/actions/actionsProdutos";
import { formatCurrency } from "@/app/componentes/global/formatePreco";
import { unidades } from "@/app/componentes/produto/produto";
import TabelSkeleton from "@/app/componentes/skeleton/TabelSkeleton";
import { Produto } from "@prisma/client";
import Image from "next/image";
import React from "react";

type SortKey = keyof Produto;

export default function PageCreate() {
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState<Produto[]>([]);
  const [sortKey, setSortKey] = React.useState<SortKey>("id");
  const [searchProduto, setSearchProduto] = React.useState("");
  const [selectedProduto, setSelectedProduto] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const filteredProducts = React.useMemo(() => {
    if (searchProduto.length === 0) return [];

    const uniqueNames = Array.from(
      data.map((item) => item.nome_produto).filter(Boolean)
    );

    return uniqueNames.filter((nome) =>
      nome!.toLowerCase().includes(searchProduto.toLowerCase())
    );
  }, [data, searchProduto]);

  const filteredData = React.useMemo(() => {
    if (!selectedProduto) return data;
    return data.filter((item) => item.nome_produto === selectedProduto);
  }, [data, selectedProduto]);
  const fetchData = async () => {
    try {
      setLoading(true);
      const { produtos } = await getProdutos();

      if (produtos.length > 0) {
        setData(produtos);
        setError(null);
      } else {
        setData([]);
        setError("Não há produtos");
      }
    } catch (err) {
      setError("Erro ao buscar produtos");
      setData([]);
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    fetchData();
  }, []);

  const sortedData = React.useMemo(() => {
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === "string" && typeof valB === "string") {
        return sortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }

      return 0;
    });
    return sorted;
  }, [filteredData, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleDeletItem = async (id: number) => {
    const { success } = await deleteProduto(id);
    if (success) {
      alert("Produto deletado com sucesso!");
      fetchData();
    } else {
      alert("Produto não deletado!");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchProduto(value);
    setShowSuggestions(value.length > 0);

    if (value.length === 0) {
      setSelectedProduto("");
    }
  };

  const handleProductSelect = (productName: string) => {
    setSelectedProduto(productName);
    setSearchProduto(productName);
    setShowSuggestions(false);
  };

  const clearSelectionProduto = () => {
    setSelectedProduto("");
    setSearchProduto("");
    setShowSuggestions(false);
  };

  const [state, formAction] = React.useActionState(createProduto, {
    errors: [],
    success: false,
  });
  React.useEffect(() => {
    if (state.success) {
      resetForm();
      fetchData();
    }
  }, [state.success]);
  const filteredunidades = Object.entries(unidades).filter(([label]) =>
    label.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setSearch("");
    setSelected("");
    setOpen(false);
    const form = document.querySelector("form") as HTMLFormElement;
    if (form) form.reset();
  };

  const handleUnitSelect = (label: string, value: string) => {
    setSelected(value);
    setSearch(label);
    setOpen(false);
  };

  const clearSelection = () => {
    setSelected("");
    setSearch("");
  };

  return (
    <div className="w-full h-full bg-gray-50 text-black overflow-auto">
      <div className="max-w-8xl mx-auto px-6 py-8">
        {/*Section Criar Produtos*/}
        <section className="bg-white p-6 rounded-2xl shadow-md ">
          <h1 className="titulo text-2xl font-bold mb-6">Criar Produto</h1>

          <form
            className="flex flex-col gap-6 font-poppins"
            action={formAction}
          >
            <div className="flex flex-wrap gap-6 [&_label]:text-lg">
              <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
                <label htmlFor="nome" className="font-medium">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  name="nome"
                  id="nome"
                  className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite o nome do produto"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 flex-1 min-w-[200px] relative">
                <label htmlFor="unidade" className="font-medium">
                  Unidade de Medida
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="unidade"
                    id="unidade"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setOpen(true);
                      if (selected) {
                        const selectedLabel = Object.entries(unidades).find(
                          ([, v]) => v === selected
                        )?.[0];
                        if (selectedLabel !== e.target.value) {
                          setSelected("");
                        }
                      }
                    }}
                    onFocus={() => setOpen(true)}
                    onBlur={() => {
                      setTimeout(() => setOpen(false), 200);
                    }}
                    placeholder="Digite para buscar..."
                    className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {(search || selected) && (
                    <button
                      type="button"
                      onClick={clearSelection}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  )}
                </div>

                {selected && (
                  <input type="hidden" name="unidade_value" value={selected} />
                )}

                {open && (
                  <ul className="border rounded-lg max-h-40 overflow-y-auto absolute top-full left-0 right-0 bg-white z-10 shadow-lg">
                    {search.length > 0 ? (
                      filteredunidades.length > 0 ? (
                        filteredunidades.map(([label, value]) => (
                          <li
                            key={value}
                            onMouseDown={() => handleUnitSelect(label, value)}
                            className={`p-2 cursor-pointer hover:bg-gray-100 ${
                              selected === value
                                ? "bg-gray-200 font-medium"
                                : ""
                            }`}
                          >
                            {label}
                          </li>
                        ))
                      ) : (
                        <li className="p-2 text-gray-500">
                          Nenhuma unidade encontrada
                        </li>
                      )
                    ) : (
                      Object.entries(unidades)
                        .slice(0, 5)
                        .map(([label, value]) => (
                          <li
                            key={value}
                            onMouseDown={() => handleUnitSelect(label, value)}
                            className="p-2 cursor-pointer hover:bg-gray-100"
                          >
                            {label}
                          </li>
                        ))
                    )}
                  </ul>
                )}

                {selected && (
                  <p className="text-sm text-green-600 mt-1">
                    ✓ Unidade selecionada:{" "}
                    <b>
                      {
                        Object.entries(unidades).find(
                          ([, v]) => v === selected
                        )?.[0]
                      }
                    </b>
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 flex-1 min-w-[150px]">
                <label htmlFor="preco" className="font-medium">
                  Preço (R$)
                </label>
                <input
                  type="number"
                  name="preco"
                  id="preco"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="perecivel"
                name="perecivel"
                value="true"
                className="rounded"
              />
              <label htmlFor="perecivel" className="text-sm">
                Este produto é perecível
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Salvar Produto
              </button>
            </div>
          </form>

          {/*Resposta ao Formulário*/}
          {state.success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 w-max text-center flex items-center gap-2 mt-5">
              <span>✅</span>
              <span>Produto criado com sucesso!</span>
            </div>
          )}

          {state.errors && state.errors.length > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              <div className="font-bold mb-2">
                {state.errors.length === 1
                  ? "Erro:"
                  : `${state.errors.length} erros encontrados:`}
              </div>
              <ul className="list-disc list-inside space-y-1">
                {state.errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
        {/*Section Produtos*/}
        <section>
          <div className="mt-8">
            <div className="bg-white rounded-2xl shadow-md px-6 py-5">
              <h1 className="titulo text-xl font-bold mb-4">Produtos</h1>
              {/*Error da Busca Produtos*/}
              {error && <p className="text-red-500 mb-4">{error}</p>}

              {/*Esqueleto da Tabela*/}
              {loading && (
                <div className="hidden xl:block overflow-x-auto">
                  <TabelSkeleton columns={5} lines={5} />
                </div>
              )}

              {/*Campo de Busca de Produto*/}
              <div className="flex flex-col gap-2 relative w-full max-w-md mb-6">
                <label className="block font-medium">Buscar Produto</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchProduto}
                    onChange={handleSearchChange}
                    onFocus={() => setShowSuggestions(searchProduto.length > 0)}
                    onBlur={() =>
                      setTimeout(() => setShowSuggestions(false), 200)
                    }
                    placeholder="Digite o nome do produto..."
                    className="border rounded-lg p-3 flex-1"
                  />
                  {selectedProduto && (
                    <button
                      onClick={clearSelectionProduto}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                {/*Sugestões de Produto Buscado*/}
                {showSuggestions && filteredProducts.length > 0 && (
                  <ul className="border rounded-l max-h-40 overflow-y-auto absolute top-full left-0 right-0 bg-white z-10 shadow-lg">
                    {filteredProducts.map((nome) => (
                      <li
                        key={nome}
                        onMouseDown={() => handleProductSelect(nome!)}
                        className={`p-2 cursor-pointer hover:bg-gray-100 ${
                          selectedProduto === nome
                            ? "bg-gray-200 font-medium"
                            : ""
                        }`}
                      >
                        {nome}
                      </li>
                    ))}
                  </ul>
                )}

                {/*Caso não Haja o Produto Buscado*/}
                {searchProduto.length > 0 && filteredProducts.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Nenhum produto encontrado com este nome
                  </p>
                )}
              </div>

              {/*Tabela e CadList de Produtos*/}
              {!loading && !error && (
                <>
                  <div className="mb-4 text-sm text-gray-600">
                    Mostrando {sortedData.length} de {data.length} produtos
                  </div>

                  <div className="hidden lg:block overflow-x-auto pb-5">
                    <table className="table-base">
                      <thead>
                        <tr>
                          <th onClick={() => handleSort("id")}>
                            <div>
                              <span>ID Produto</span>
                              <Image
                                src="/arrows.svg"
                                width={20}
                                height={20}
                                alt="seta"
                              />
                            </div>
                          </th>
                          <th onClick={() => handleSort("nome_produto")}>
                            <div>
                              <span>Nome</span>
                              <Image
                                src="/arrows.svg"
                                width={20}
                                height={20}
                                alt="seta"
                              />
                            </div>
                          </th>
                          <th>
                            <div>
                              <span>Unid.</span>
                            </div>
                          </th>
                          <th onClick={() => handleSort("preco")}>
                            <div>
                              <span>Preço</span>
                              <Image
                                src="/arrows.svg"
                                width={20}
                                height={20}
                                alt="seta"
                              />
                            </div>
                          </th>
                          <th>
                            <span>Perecível</span>
                          </th>
                          <th>
                            <span>Excluir</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedData.length > 0 ? (
                          sortedData.map((item) => (
                            <tr
                              key={item.id}
                              className="border-b hover:bg-gray-50 *:p-3"
                            >
                              <td>{item.id}</td>
                              <td>{item.nome_produto?.toUpperCase()}</td>
                              <td>{item.unidadePesagem?.toUpperCase()}</td>
                              <td>{formatCurrency(item.preco)}</td>
                              <td
                                className={` ${
                                  !item.perecivel
                                    ? "bg-red-600"
                                    : "bg-green-600"
                                }`}
                              >
                                {item.perecivel ? "TRUE" : "FALSE"}
                              </td>
                              <td>
                                <button
                                  onClick={() => {
                                    handleDeletItem(item.id);
                                  }}
                                  className="cursor-pointer"
                                >
                                  <Image
                                    src="/delet.svg"
                                    width={40}
                                    height={40}
                                    alt="Deletar"
                                    className="inline-block hover:scale-110 transition curso-pointer"
                                  />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="p-8 text-gray-500">
                              {selectedProduto
                                ? "Nenhum produto encontrado com este filtro"
                                : "Nenhum produto disponível"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex flex-col md:flex-row flex-wrap *:min-w-xs *:text-xl *:self-center *:text-center gap-4 lg:hidden mt-6 pb-5">
                    {sortedData.map((item) => (
                      <div
                        key={item.id}
                        className="border rounded-lg p-3 shadow-sm text-left"
                      >
                        <p className="*:break-words">
                          <strong>Produto:</strong> {item.nome_produto}
                        </p>
                        <p>
                          <strong>Unid.:</strong>
                          {item?.unidadePesagem?.toUpperCase()}
                        </p>
                        <p>
                          <strong>Preço:</strong>{" "}
                          {formatCurrency(item.preco ?? 0)}
                        </p>
                        <p>
                          <strong>Perecível:</strong>{" "}
                          {item.perecivel ? "TRUE" : "FALSE"}
                        </p>
                        <button
                          onClick={() => handleDeletItem(item.id)}
                          className="p-1 cursor-pointer hover:bg-red-700 hover:rounded-xl"
                        >
                          <Image
                            src="/delet.svg"
                            width={30}
                            height={30}
                            alt="Deletar"
                            className="inline-block hover:scale-110 transition hover:invert"
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
