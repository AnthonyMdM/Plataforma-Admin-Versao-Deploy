import { useState, useEffect } from "react";

export type Pagination = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

type UseDataOptionsPages<T> = {
  fetchFn: (
    page: number,
    pageSize: number
  ) => Promise<{
    data: T[];
    pagination: Pagination;
  }>;
  initialPage?: number;
  pageSize?: number;
};

export function useDataPages<T>({
  fetchFn,
  initialPage = 1,
  pageSize = 10,
}: UseDataOptionsPages<T>) {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchFn(page, pageSize);
        setData(result.data);
        setPagination(result.pagination);
      } catch (err: any) {
        setError(err.message ?? "Erro inesperado");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page, pageSize, fetchFn]);

  return { data, pagination, page, setPage, loading, error };
}
