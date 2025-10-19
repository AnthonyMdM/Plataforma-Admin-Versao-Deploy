import "@/app/global.css";
import SideBar from "@/componentes/global/SideBar";
import SessionProviderWrapper from "@/componentes/global/SessionProvider";

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <>
      <SessionProviderWrapper>
        <SideBar />
        <>
          {children}
          {modal}
        </>
      </SessionProviderWrapper>
    </>
  );
}
