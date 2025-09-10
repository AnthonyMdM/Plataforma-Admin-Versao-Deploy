"use client";
import React from "react";
import { deleteProduto, getProdutos } from "@/actions/actionsProdutos";
import { Produto } from "@prisma/client";
import Image from "next/image";
import TabelSkeleton from "@/app/componentes/skeleton/TabelSkeleton";
import { formatCurrency } from "@/app/componentes/global/formatePreco";

type SortKey = keyof Produto;

export default function Page() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<Produto[]>([]);
  const [sortKey, setSortKey] = React.useState<SortKey>("id");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const filteredProducts = React.useMemo(() => {
    if (search.length === 0) return [];

    const uniqueNames = Array.from(
      data.map((item) => item.nome_produto).filter(Boolean)
    );

    return uniqueNames.filter((nome) =>
      nome!.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const filteredData = React.useMemo(() => {
    if (!selected) return data;
    return data.filter((item) => item.nome_produto === selected);
  }, [data, selected]);

  React.useEffect(() => {
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
    } else {
      alert("Produto não deletado!");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setShowSuggestions(value.length > 0);

    if (value.length === 0) {
      setSelected("");
    }
  };

  const handleProductSelect = (productName: string) => {
    setSelected(productName);
    setSearch(productName);
    setShowSuggestions(false);
  };

  const clearSelection = () => {
    setSelected("");
    setSearch("");
    setShowSuggestions(false);
  };

  return (
    <div className="px-6 bg-white h-max text-black ">
      <h1 className="titulo pt-5 mb-2">Produtos</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading && <TabelSkeleton columns={5} lines={5} />}

      <div className="flex flex-col gap-2 relative w-full max-w-md mb-4">
        <label className="block font-medium">Buscar Produto:</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(search.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Digite o nome do produto..."
            className="border rounded p-2 flex-1"
          />
          {selected && (
            <button
              onClick={clearSelection}
              className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Limpar
            </button>
          )}
        </div>

        {showSuggestions && filteredProducts.length > 0 && (
          <ul className="border rounded max-h-40 overflow-y-auto absolute top-full left-0 right-0 bg-white z-10 shadow-lg">
            {filteredProducts.map((nome) => (
              <li
                key={nome}
                onMouseDown={() => handleProductSelect(nome!)}
                className={`p-2 cursor-pointer hover:bg-gray-200 ${
                  selected === nome ? "bg-gray-300" : ""
                }`}
              >
                {nome}
              </li>
            ))}
          </ul>
        )}

        {selected && (
          <p className="text-sm text-green-600">
            Produto selecionado: <b>{selected}</b>
          </p>
        )}

        {search.length > 0 && filteredProducts.length === 0 && (
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

          <div className="overflow-x-auto">
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
                      <span>Unidade</span>
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
                          !item.perecivel ? "bg-red-600" : "bg-green-600"
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
                      {selected
                        ? "Nenhum produto encontrado com este filtro"
                        : "Nenhum produto disponível"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
