// "use client";

// import { getVendasPorAno } from "@/app/home/actions";
// import React from "react";

// export type Vendas = { id: number; data: Date; userId: number };
// export type Filtro = { mes: number; dias: number[] };

// type FetchContextType = {
//   value: number;
//   data: {
//     vendas: Vendas[];
//     filtros: Filtro[];
//   };
//   setValue: (val: number) => void;
//   loading: boolean;
//   error: string | null;
// };
// type DataType = NonNullable<FetchContextType["data"]>;

// const UserContext = React.createContext<FetchContextType | undefined>(
//   undefined
// );

// export const UserContextProvider = ({
//   children,
// }: {
//   children: React.ReactNode;
// }) => {
//   const initialData: DataType = {
//     vendas: [],
//     filtros: [],
//   };

//   const dataAtual = new Date().getFullYear();
//   const [value, setValue] = React.useState(dataAtual);
//   const [data, setData] = React.useState<DataType>(initialData);
//   const [loading, setLoading] = React.useState(false);
//   const [error, setError] = React.useState<string | null>(null);

//   React.useEffect(() => {
//     async function fetchInfo(ano: number) {
//       setLoading(true);
//       setError(null);
//       try {
//         const { vendas, filtros } = await getVendasPorAno(ano);
//         if (vendas.length === 0) {
//           setError("Não há vendas nesse período");
//           setData(initialData);
//         } else {
//           setData({ vendas, filtros });
//         }
//       } catch {
//         setError("Erro inesperado");
//         setData(initialData);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchInfo(value);
//   }, [value]);

//   return (
//     <UserContext.Provider value={{ value, data, setValue, loading, error }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useFetchContext = () => {
//   const context = React.useContext(UserContext);
//   if (!context) {
//     throw new Error("useFetchContext deve estar dentro do UserContextProvider");
//   }
//   return context;
// };
