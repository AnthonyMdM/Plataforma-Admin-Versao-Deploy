"use client";
import { useState, useCallback } from "react";
import useSWR from "swr";
import { getVendas } from "@/app/home/actions";
import { vendas_telas } from "@prisma/client";

import TabelSkeleton from "@/app/componentes/skeleton/TabelSkeleton";
import Pagination from "@/app/componentes/global/Pagination";

const fetcher = async (id: number, page: number) => {
  return await getVendas(id, page, 10);
};

export default function VendasPage({ params }: { params: string }) {
  const id = +params;
  const [page, setPage] = useState(1);

  const { data, error, isLoading } = useSWR(
    ["vendas", id, page],
    () => fetcher(id, page),
    { keepPreviousData: true }
  );

  const handlePageChange = useCallback(
    (newPage: number) => setPage(newPage),
    []
  );

  const vendas: vendas_telas[] = data?.vendas || [];
  const totalPages: number = data?.totalPages || 1;

  return (
    <div className="p-6 bg-white text-black h-screen flex flex-col items-center gap-4">
      {isLoading && <TabelSkeleton columns={6} lines={6} />}
      {error && <p className="text-red-600">{error}</p>}

      {!isLoading && !error && (
        <>
          {/* Tabela de vendas */}
          <div className="flex-1 overflow-auto">
            <div className="text-3xl font-poppins font-semibold *:flex *:gap-2 flex gap-50 mb-10 mt-5">
              <div>
                <p>Nome do Vendedor:</p>
                <span>{vendas[0]?.Name || "-"}</span>
              </div>
              <div>
                <p>Data da Venda:</p>
                <span>
                  {vendas[0]?.data
                    ? new Date(vendas[0].data).toLocaleDateString()
                    : "-"}
                </span>
              </div>
            </div>
            <table className="table-auto w-full text-center font-poppins text-xl ">
              <thead>
                <tr className="*:text-2xl cursor-pointer border-b">
                  <th>Nome do Produto</th>
                  <th>Unid.</th>
                  <th>Preço</th>
                  <th>Quantidade</th>
                  <th>Valor Total</th>
                </tr>
              </thead>
              <tbody>
                {vendas.map((item, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-2">{item.nome_produto}</td>
                    <td className="py-2">
                      {item?.unidadePesagem?.toUpperCase()}
                    </td>
                    <td className="py-2">{item.preco}</td>
                    <td className="py-2">{item.quantidade}</td>
                    <td className="py-2">{item.preco_produto_totaltotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
