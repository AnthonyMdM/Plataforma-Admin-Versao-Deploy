"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CloseIcon from "@/componentes/global/CloseIcon";
import { getProduto } from "@/actions/actionsProdutos";
import { Produto } from "@prisma/client";
import PageEditProduto from "@/componentes/views/produto/EditProdutoPage";

export default function ModalEditProduto() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarProduto() {
      try {
        setLoading(true);
        const { produto: produtoData } = await getProduto(Number(params.id));

        if (!produtoData) {
          setError("Produto não encontrado");
        } else {
          setProduto(produtoData);
        }
      } catch (err) {
        setError("Erro ao carregar produto");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      carregarProduto();
    }
  }, [params.id]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        router.back();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      router.back();
    }
  };

  return (
    <div
      className="fixed w-full inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-7xl max-h-[90vh] flex flex-col pt-8 xl:pt-5">
        <button
          onClick={() => router.back()}
          className="absolute top-2 right-5 text-gray-600 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-600 transition-colors"
          aria-label="Fechar modal"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        <div className="flex-1 overflow-y-auto min-h-0 rounded-2xl">
          {loading ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center">
                <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Carregando produto...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center text-red-600">
                <p className="text-xl font-semibold mb-2">Erro</p>
                <p>{error}</p>
                <button
                  onClick={() => router.back()}
                  className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Voltar
                </button>
              </div>
            </div>
          ) : produto ? (
            <PageEditProduto produto={produto} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
