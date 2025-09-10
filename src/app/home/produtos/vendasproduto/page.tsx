"use client";
import React from "react";
import { produtosVendidos } from "@/actions/actionsProdutos";
import { ProdutosMaisVendidos } from "@prisma/client";
import Image from "next/image";
import TabelSkeleton from "@/app/componentes/skeleton/TabelSkeleton";

type SortKey = keyof ProdutosMaisVendidos;

export default function Page() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<ProdutosMaisVendidos[]>([]);
  const [sortKey, setSortKey] = React.useState<SortKey>("produtoId");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  // Filtra produtos únicos pelos nomes
  const filteredProducts = React.useMemo(() => {
    if (search.length === 0) return [];

    const uniqueNames = Array.from(
      data.map((item) => item.nome).filter(Boolean)
    );

    return uniqueNames.filter((nome) =>
      nome!.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  // Filtra os dados da tabela baseado na seleção
  const filteredData = React.useMemo(() => {
    if (!selected) return data;
    return data.filter((item) => item.nome === selected);
  }, [data, selected]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { produtos } = await produtosVendidos();

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
    <div className="p-6 bg-white text-black h-full overflow-x-auto">
      <h1 className="titulo">Vendas por Produto</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading && <TabelSkeleton columns={5} lines={5} />}

      <div className="flex my-2 flex-col gap-2 relative w-full max-w-md mb-4">
        <label className="block font-medium">Buscar por Nome:</label>
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
                  <th onClick={() => handleSort("produtoId")}>
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
                  <th onClick={() => handleSort("nome")}>
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
                  <th onClick={() => handleSort("total_vendido")}>
                    <div>
                      <span>Total de Vendas</span>
                      <Image
                        src="/arrows.svg"
                        width={20}
                        height={20}
                        alt="seta"
                      />
                    </div>
                  </th>
                  <th onClick={() => handleSort("unidadePesagem")}>
                    <div>
                      <span>Unidade</span>
                      <Image
                        src="/arrows.svg"
                        width={20}
                        height={20}
                        alt="seta"
                      />
                    </div>
                  </th>
                  <th onClick={() => handleSort("valor_total")}>
                    <div>
                      <span>Valor Total</span>
                      <Image
                        src="/arrows.svg"
                        width={20}
                        height={20}
                        alt="seta"
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.length > 0 ? (
                  sortedData.map((item) => (
                    <tr
                      key={item.produtoId}
                      className="border-b hover:bg-gray-50 *:p-3"
                    >
                      <td>{item.produtoId}</td>
                      <td>{item.nome?.toUpperCase()}</td>
                      <td>{item.total_vendido}</td>
                      <td>{item.unidadePesagem?.toUpperCase()}</td>
                      <td>
                        {item.valor_total
                          ? `R$ ${Number(item.valor_total).toFixed(2)}`
                          : "-"}
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
