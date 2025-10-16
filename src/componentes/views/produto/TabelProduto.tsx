"use client";
import React from "react";
import { deleteProduto, getProdutos } from "@/actions/actionsProdutos";
import { Produto } from "@prisma/client";
import Image from "next/image";
import TabelSkeleton from "@/componentes/skeleton/TabelSkeleton";
import { formatCurrency } from "@/utilidades/formatePreco";
import Link from "next/link";

type SortKey = keyof Produto;

export default function ProdutoTabel() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<Produto[]>([]);
  const [sortKey, setSortKey] = React.useState<SortKey>("id");
  const [searchProduto, setSearchProduto] = React.useState("");
  const [selectedProduto, setSelectedProduto] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const filteredProducts = React.useMemo(() => {
    if (searchProduto.length === 0) return [];

    const uniqueNames = Array.from(
      data.map((item) => item.Nome).filter(Boolean)
    );

    return uniqueNames.filter((nome) =>
      nome!.toLowerCase().includes(searchProduto.toLowerCase())
    );
  }, [data, searchProduto]);

  const filteredData = React.useMemo(() => {
    if (!selectedProduto) return data;
    return data.filter((item) => item.Nome === selectedProduto);
  }, [data, selectedProduto]);
  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const { data: produtos } = await getProdutos();

      if (produtos && produtos.length > 0) {
        setData(produtos);
        setError(null);
      } else {
        setData([]);
        setError("Não há produtos");
      }
    } catch (err: unknown) {
      setError("Erro ao buscar produtos");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);
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

  const handleSort = React.useCallback(
    (key: SortKey) => {
      if (key === sortKey) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortKey(key);
        setSortOrder("asc");
      }
    },
    [sortKey, sortOrder]
  );

  const handleDeletItem = React.useCallback(
    async (id: number) => {
      const { success } = await deleteProduto(id);
      if (success) {
        fetchData();
      }
    },
    [fetchData]
  );

  const handleSearchChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchProduto(value);
      setShowSuggestions(value.length > 0);

      if (value.length === 0) {
        setSelectedProduto("");
      }
    },
    []
  );

  const handleProductSelect = React.useCallback((productName: string) => {
    setSelectedProduto(productName);
    setSearchProduto(productName);
    setShowSuggestions(false);
  }, []);

  const clearSelectionProduto = React.useCallback(() => {
    setSelectedProduto("");
    setSearchProduto("");
    setShowSuggestions(false);
  }, []);

  return (
    <section className="bg-white lg:max-w-nonebg-white rounded-2xl w-auto shadow-md px-6 py-5">
      <header>
        <h1 className="titulo text-xl font-bold mb-4">Produtos</h1>
      </header>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading && (
        <div className="hidden xl:block overflow-x-auto">
          <TabelSkeleton columns={5} lines={5} />
        </div>
      )}

      <div className="flex flex-col gap-2 relative w-full max-w-md mb-6">
        <label className="block font-medium">Buscar Produto</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchProduto}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(searchProduto.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
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

        {showSuggestions && filteredProducts.length > 0 && (
          <ul className="border rounded-l max-h-40 overflow-y-auto absolute top-full left-0 right-0 bg-white z-10 shadow-lg">
            {filteredProducts.map((nome) => (
              <li
                key={nome}
                onMouseDown={() => handleProductSelect(nome!)}
                className={`p-2 cursor-pointer hover:bg-gray-100 ${
                  selectedProduto === nome ? "bg-gray-200 font-medium" : ""
                }`}
              >
                {nome}
              </li>
            ))}
          </ul>
        )}

        {searchProduto.length > 0 && filteredProducts.length === 0 && (
          <p className="text-sm text-gray-500">
            Nenhum produto encontrado com este nome
          </p>
        )}
      </div>

      {!loading && !error && (
        <>
          <div className="mb-4 text-sm text-gray-600">
            Mostrando {sortedData.length} de {data.length} produtos
          </div>

          <div className="hidden sm:block overflow-x-auto pb-5">
            <table className="table-base">
              <thead>
                <tr>
                  <th onClick={() => handleSort("id")}>
                    <div>
                      <span>ID</span>
                      <Image
                        src="/arrows.svg"
                        width={20}
                        height={20}
                        alt="seta"
                      />
                    </div>
                  </th>
                  <th onClick={() => handleSort("Nome")}>
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
                    <span>Per.</span>
                  </th>
                  <th>
                    <span>Editar</span>
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
                      className="border-b hover:bg-gray-50 *:py-2"
                    >
                      <td>{item.id}</td>
                      <td>{item.Nome?.toUpperCase()}</td>
                      <td>{item.unidadePesagem?.toUpperCase()}</td>
                      <td>{formatCurrency(item.preco)}</td>
                      <td
                        className={` ${
                          !item.perecivel ? "bg-red-600" : "bg-green-600"
                        }`}
                      >
                        {item.perecivel ? "TRUE" : "FALSE"}
                      </td>
                      <td>
                        <Link
                          href={`/produtos/${item.id}`}
                          className="cursor-pointer"
                        >
                          <Image
                            src="/edit.svg"
                            width={40}
                            height={40}
                            alt="Editar"
                            className="inline-block hover:scale-110 transition curso-pointer"
                          />
                        </Link>
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

          <div className="flex flex-col flex-wrap *:min-w-xs *:text-xl *:self-center *:text-center gap-4 sm:hidden mt-6 pb-5">
            {sortedData.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-3 shadow-sm text-left"
              >
                <p className="*:break-words">
                  <strong>Produto:</strong> {item.Nome}
                </p>
                <p>
                  <strong>Unid.:</strong>
                  {item?.unidadePesagem?.toUpperCase()}
                </p>
                <p>
                  <strong>Preço:</strong> {formatCurrency(item.preco ?? 0)}
                </p>
                <p>
                  <strong>Perecível:</strong>{" "}
                  {item.perecivel ? "TRUE" : "FALSE"}
                </p>
                <Link
                  href={`/produtos/${item.id}`}
                  className="p-1 cursor-pointer hover:bg-red-700 hover:rounded-xl"
                >
                  <Image
                    src="/edit.svg"
                    width={30}
                    height={30}
                    alt="Editar"
                    className="inline-block hover:scale-110 transition hover:invert"
                  />
                </Link>
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
    </section>
  );
}
