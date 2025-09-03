"use client";
import React from "react";
import { produtosVendidos } from "../actions";
import { ProdutosMaisVendidos } from "@prisma/client";
import Image from "next/image";
import TabelSkeleton from "@/app/componentes/skeleton/TabelSkeleton";

type SortKey = keyof ProdutosMaisVendidos; // "produtoId" | "nome" | "total_vendido" | "unidadePesagem" | "valor_total"

export default function Page() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<ProdutosMaisVendidos[]>([]);
  const [sortKey, setSortKey] = React.useState<SortKey>("produtoId");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const { produtos } = await produtosVendidos();

        if (produtos.length > 0) {
          setData(produtos);
          setError(null); // limpa erro
        } else {
          setData([]);
          setError("não há produtos");
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
    const sorted = [...data];
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
  }, [data, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="p-6 bg-white text-black">
      {error && <p>{error}</p>}
      {loading && <TabelSkeleton columns={5} lines={5} />}

      {!loading && !error && (
        <table className="mt-100 grind w-full h-screen text-center items-center font-poppins text-xl">
          <thead>
            <tr className="*:text-2xl cursor-pointer">
              <th onClick={() => handleSort("produtoId")}>
                <div className="justify-center flex items-center gap-1 cursor-pointer">
                  <span>ID Produto</span>
                  <Image src="/arrows.svg" width={20} height={20} alt="seta" />
                </div>
              </th>
              <th onClick={() => handleSort("nome")}>
                <div className="justify-center flex items-center gap-1 cursor-pointer">
                  <span>Nome</span>
                  <Image src="/arrows.svg" width={20} height={20} alt="seta" />
                </div>
              </th>
              <th onClick={() => handleSort("total_vendido")}>
                <div className="justify-center flex items-center gap-1 cursor-pointer">
                  <span>Total de Vendas</span>
                  <Image src="/arrows.svg" width={20} height={20} alt="seta" />
                </div>
              </th>
              <th onClick={() => handleSort("unidadePesagem")}>
                <div className="justify-center flex items-center gap-1 cursor-pointer">
                  <span>Unidade</span>
                  <Image src="/arrows.svg" width={20} height={20} alt="seta" />
                </div>
              </th>
              <th onClick={() => handleSort("valor_total")}>
                <div className="justify-center flex items-center gap-1 cursor-pointer">
                  <span>Valor Total</span>
                  <Image src="/arrows.svg" width={20} height={20} alt="seta" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="*:border-b-1 *:border-black">
            {sortedData.map((item) => (
              <tr key={item.produtoId}>
                <td>{item.produtoId}</td>
                <td>{item.nome?.toUpperCase()}</td>
                <td>{item.total_vendido}</td>
                <td>{item.unidadePesagem?.toUpperCase()}</td>
                <td>{item.valor_total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
