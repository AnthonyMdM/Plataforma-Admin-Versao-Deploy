// app/home/filtro/(.)venda/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import VendasPage from "@/app/componentes/views/VendasPage";

type Params = {
  id: string;
};

export default function ModalVenda() {
  const router = useRouter();
  const params = useParams<Params>();

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

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="fixed w-full inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white px-6 pt-4 rounded-lg shadow-lg h-[90vh] overflow-y-auto ">
        <button
          onClick={() => router.back()}
          className="absolute top-2 right-2 text-gray-600 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-600 transition-colors"
          aria-label="Fechar modal"
        >
          ✕
        </button>
        <VendasPage params={params.id} />
      </div>
    </div>
  );
}
