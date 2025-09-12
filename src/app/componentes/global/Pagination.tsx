"use client";
import usePagination, { DOTS } from "@/app/hooks/usePagination";
import { useCallback } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const paginationRange = usePagination({
    currentPage,
    totalPageCount: totalPages,
    siblingCount: 1,
  });

  const onNext = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  const onPrevious = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handlePageClick = useCallback(
    (pageNumber: number) => {
      onPageChange(pageNumber);
    },
    [onPageChange]
  );

  if (!paginationRange || paginationRange.length < 2) {
    return null;
  }

  const lastPage = paginationRange[paginationRange.length - 1];
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === lastPage;

  return (
    <div className="flex items-center justify-center space-x-2 mt-4 mb-5">
      <button
        className={`px-3 py-2 rounded-md transition-colors ${
          isFirstPage
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "hover:bg-gray-300 text-gray-700 bg-gray-200 cursor-pointer"
        }`}
        onClick={onPrevious}
        disabled={isFirstPage}
        aria-label="Página anterior"
      >
        Anterior
      </button>

      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          return (
            <span
              key={`dots-${index}`}
              className="px-3 py-2 text-gray-500"
              aria-hidden="true"
            >
              &#8230;
            </span>
          );
        }

        const isCurrentPage = pageNumber === currentPage;

        return (
          <button
            key={`page-${pageNumber}`}
            className={`px-3 py-2 rounded-md transition-colors ${
              isCurrentPage
                ? "text-gray-700 cursor-not-allowed bg-gray-300"
                : "bg-gray-200 text-gray-700 cursor-pointer hover:bg-gray-300"
            }`}
            onClick={() => handlePageClick(pageNumber as number)}
            disabled={isCurrentPage}
            aria-label={`Ir para página ${pageNumber}`}
            aria-current={isCurrentPage ? "page" : undefined}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        className={`px-3 py-2 rounded-md transition-colors ${
          isLastPage
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
        }`}
        onClick={onNext}
        disabled={isLastPage}
        aria-label="Próxima página"
      >
        Próximo
      </button>
    </div>
  );
}
