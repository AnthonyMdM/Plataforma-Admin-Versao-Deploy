"use client";
import { useState, useCallback } from "react";
import useSWR from "swr";
import { getVendas } from "@/actions/actionsVendas";
import { vendas_telas } from "@prisma/client";

import TabelSkeleton from "@/app/componentes/skeleton/TabelSkeleton";
import Pagination from "@/app/componentes/global/Pagination";
import { formatCurrency } from "../global/formatePreco";

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
    <div
      className={`p-4 lg:p-1 bg-white text-black h-[100%] items-center gap-4`}
    >
      {isLoading && <TabelSkeleton columns={6} lines={6} />}
      {error && <p className="text-red-600">{error}</p>}

      {!isLoading && !error && (
        <>
          <div className="flex flex-col items-center overflow-auto">
            <div className="text-2xl xl:text-4xl font-poppins *:text-center *:items-center flex-col xl:flex-row font-semibold *:flex *:flex-col xl:*:flex-row xl:*:gap-2 flex gap-4 xl:gap-50 xl:mb-10 xl:mt-5">
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
            <div className="hidden xl:block overflow-x-auto">
              <table className="table-base">
                <thead>
                  <tr>
                    <th>Nome do Produto</th>
                    <th>Unid.</th>
                    <th>Preço</th>
                    <th>Quantidade</th>
                    <th>Valor Total</th>
                  </tr>
                </thead>
                <tbody>
                  {vendas.map((item, i) => (
                    <tr key={i}>
                      <td>{item.nome_produto}</td>
                      <td>{item?.unidadePesagem?.toUpperCase()}</td>
                      <td>{item.preco}</td>
                      <td>{item.quantidade}</td>
                      <td>{item.preco_produto_totaltotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col w-full text-center gap-4 xl:hidden mt-6">
              {vendas.map((item, i) => (
                <div key={i} className="border rounded p-3 shadow-sm">
                  <p>
                    <strong>Produto:</strong> {item.nome_produto}
                  </p>
                  <p>
                    <strong>Unid.:</strong>{" "}
                    {item?.unidadePesagem?.toUpperCase()}
                  </p>
                  <p>
                    <strong>Preço:</strong> {formatCurrency(item.preco ?? 0)}
                  </p>
                  <p>
                    <strong>Quantidade:</strong> {item.quantidade}
                  </p>
                  <p>
                    <strong>Total:</strong>{" "}
                    {formatCurrency(item.preco_produto_totaltotal ?? 0)}
                  </p>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
