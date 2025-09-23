"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import VendasPage from "@/app/componentes/views/VendasPage";
import CloseIcon from "@/app/componentes/global/CloseIcon";
import { useRouter } from "next/navigation";

export default function ModalVenda() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

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
          className="absolute top-2 right-5 text-gray-600 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-600 transition-colors "
          aria-label="Fechar modal"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        <div className="flex-1 overflow-y-auto min-h-0 rounded-2xl">
          <VendasPage params={params.id} />
        </div>
      </div>
    </div>
  );
}
