"use client";

import { useState, useEffect } from "react";
import { getVendas } from "@/app/home/actions";
import { vendas_telas } from "@prisma/client";
import { useParams } from "next/navigation";
import TabelSkeleton from "@/app/componentes/skeleton/TabelSkeleton";

type Pagination = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

type Params = {
  vendas: string;
};

export default function VendasPage() {
  const [vendas, setVendas] = useState<vendas_telas[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>();
  const [page, setPage] = useState(1);
  const idVendas: Params = useParams();
  console.log(idVendas);

  useEffect(() => {
    async function fetchVendas() {
      setLoading(true);
      try {
        const data = await getVendas(+idVendas.vendas, page, 5);

        if (data.vendas.length === 0) {
          setError(true);
          setVendas([]);
        } else {
          setVendas(data.vendas);
          setPagination(data.pagination);
          setError(false);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchVendas();
  }, [page, idVendas.vendas]);

  return (
    <>
      <div className="p-6 bg-white text-black h-screen grid items-end">
        {loading && <TabelSkeleton columns={6} lines={6} />}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <table className="grind w-full h-52 text-center items-center font-poppins text-xl">
            <thead>
              <tr className="*:text-2xl cursor-pointer">
                <th>
                  <div className="justify-center flex items-center gap-1 cursor-pointer">
                    <span>Nome Vendedor</span>
                  </div>
                </th>
                <th>
                  <div className="justify-center flex items-center gap-1 cursor-pointer">
                    <span>Nome do Produto</span>
                  </div>
                </th>
                <th>
                  <div className="justify-center flex items-center gap-1 cursor-pointer">
                    <span>Data da Venda</span>
                  </div>
                </th>
                <th>
                  <div className="justify-center flex items-center gap-1 cursor-pointer">
                    <span>Unid.</span>
                  </div>
                </th>
                <th>
                  <div className="justify-center flex items-center gap-1 cursor-pointer">
                    <span>Quantidade</span>
                  </div>
                </th>
                <th>
                  <div className="justify-center flex items-center gap-1 cursor-pointer">
                    <span>Valor Total</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="*:border-b-1 *:border-black">
              {vendas.map((item, i) => (
                <tr key={i}>
                  <td>{item.Name}</td>
                  <td>{item.nome_produto}</td>
                  <td>{item.data?.toLocaleDateString()}</td>
                  <td>{item?.unidadePesagem}</td>
                  <td>{item.quantidade}</td>
                  <td>{item.preco_produto_totaltotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
