"use client";
import { useState, useCallback } from "react";
import useSWR from "swr";
import { getVendas } from "@/actions/actionsVendas";
import { vendas_telas } from "@prisma/client";
import TabelSkeleton from "@/componentes/skeleton/TabelSkeleton";
import Pagination from "@/componentes/global/Pagination";
import { formatCurrency } from "@/utilidades/formatePreco";

const fetcher = async (id: number, page: number) => {
  return await getVendas(id, page, 10);
};

export default function VendasPageUnit({ params }: { params: string }) {
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
  const somaTotal = vendas.reduce(
    (acc, item) => acc + (item.preco_produto_totaltotal ?? 0),
    0
  );

  return (
    <div className={`bg-white text-black w-full items-center gap-4`}>
      {isLoading && <TabelSkeleton columns={6} lines={6} />}
      {error && <p className="text-red-600">{error}</p>}

      {!isLoading && !error && (
        <>
          <div className="flex flex-col items-center">
            <div className="text-2xl xl:text-3xl font-poppins *:text-center *:items-center md:*:text-2xl flex-col lg:*:flex-row lg:flex-row font-semibold *:flex *:flex-col lg:flex-wrap lg:*:gap-2 flex gap-4 lg:gap-3 xl:gap-12 lg:mb-5 lx:mb-10 lg:mt-5 justify-center w-full">
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
              <div>
                <p>Valor Total da Venda:</p>
                <span>
                  <p>{formatCurrency(somaTotal)}</p>
                </span>
              </div>
            </div>
            <div className="hidden lg:block w-full ">
              <div className=" flex justify-center w-full mb-10">
                <table className="table-base !max-w-[95%] ">
                  <thead>
                    <tr>
                      <th className="w-[30%]">Produto</th>
                      <th className="w-[10%]">Unid.</th>
                      <th className="w-[10%]">Preço</th>
                      <th className="w-[10%]">Quant.</th>
                      <th className="w-[10%]">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendas.map((item, i) => (
                      <tr key={i}>
                        <td>{item.nome_produto}</td>
                        <td>{item?.unidadePesagem?.toUpperCase()}</td>
                        <td>{formatCurrency(item.preco ?? 0)}</td>
                        <td>{item.quantidade}</td>
                        <td>
                          {formatCurrency(item.preco_produto_totaltotal ?? 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:flex-wrap sm:*:min-w-[300px] justify-center w-auto text-center gap-4 lg:hidden my-4">
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
