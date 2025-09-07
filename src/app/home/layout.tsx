import Header from "../componentes/principal/Header";

export default function PrincipalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <div>{children}</div>
    </div>
  );
}
