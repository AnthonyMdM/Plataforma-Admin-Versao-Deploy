import { UserContextProvider } from "../componentes/context/useContex";
import Header from "../componentes/principal/Header";

export default function PrincipalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <UserContextProvider>{children}</UserContextProvider>
    </div>
  );
}
