"use client";

import { useState, useEffect } from "react";
import { getVendas } from "@/app/home/actions";
import { vendas_telas } from "@prisma/client";
import { useParams } from "next/navigation";
import TabelSkeleton from "@/app/componentes/skeleton/TabelSkeleton";

type Params = {
  vendas: string;
};

export default function VendasPage() {
  const [vendas, setVendas] = useState<vendas_telas[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const idVendas: Params = useParams();

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchVendas() {
      setLoading(true);
      try {
        const data = await getVendas(+idVendas.vendas, page, 5);

        if (data.vendas.length === 0) {
          setError("Nenhuma venda encontrada.");
          setVendas([]);
          return;
        }
        setTotalPages(data.totalPages);
        setVendas(data.vendas);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar vendas.");
      } finally {
        setLoading(false);
        console.log(totalPages);
      }
    }
    fetchVendas();
  }, [page, idVendas.vendas]);

  return (
    <div className="p-6 bg-white text-black h-screen flex flex-col gap-4">
      {loading && <TabelSkeleton columns={6} lines={6} />}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <table className="table-auto w-full text-center font-poppins text-xl border-collapse">
          <thead>
            <tr className="*:text-2xl cursor-pointer border-b">
              <th>Nome Vendedor</th>
              <th>Nome do Produto</th>
              <th>Data da Venda</th>
              <th>Unid.</th>
              <th>Quantidade</th>
              <th>Valor Total</th>
            </tr>
          </thead>
          <tbody>
            {vendas.map((item, i) => (
              <tr key={i} className="border-b">
                <td>{item.Name}</td>
                <td>{item.nome_produto}</td>
                <td>
                  {item.data ? new Date(item.data).toLocaleDateString() : "-"}
                </td>
                <td>{item?.unidadePesagem}</td>
                <td>{item.quantidade}</td>
                <td>{item.preco_produto_totaltotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Paginação */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {page > 1 && (
          <button
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded hover:bg-gray-200"
          >
            Anterior
          </button>
        )}

        {page > 2 && (
          <>
            <button
              onClick={() => setPage(1)}
              className={`px-3 py-1 border rounded hover:bg-gray-200 ${
                page === 1 ? "font-bold bg-gray-300" : ""
              }`}
            >
              1
            </button>
            {page > 3 && <span>...</span>}
          </>
        )}
        {page > 1 && (
          <button
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded hover:bg-gray-200"
          >
            {page - 1}
          </button>
        )}

        <button
          className="px-3 py-1 border rounded bg-gray-300 font-bold"
          disabled
        >
          {page}
        </button>

        {page < totalPages && (
          <button
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded hover:bg-gray-200"
          >
            {page + 1}
          </button>
        )}

        {page < totalPages - 1 && (
          <>
            {page < totalPages - 2 && <span>...</span>}
            <button
              onClick={() => setPage(totalPages)}
              className={`px-3 py-1 border rounded hover:bg-gray-200 ${
                page === totalPages ? "font-bold bg-gray-300" : ""
              }`}
            >
              {totalPages}
            </button>
          </>
        )}

        {page < totalPages && (
          <button
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded hover:bg-gray-200"
          >
            Próximo
          </button>
        )}
      </div>
    </div>
  );
}
