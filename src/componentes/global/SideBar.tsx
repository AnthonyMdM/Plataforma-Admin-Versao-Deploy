"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState, useTransition } from "react";

export default function SideBar() {
  const { data: session } = useSession();
  const [menu, setMenu] = useState(true);
  const handleLogout = useCallback(() => {
    signOut({ redirect: true });
  }, []);
  const [menuProdutos, setMenuProdutos] = useState(false);
  const [isPendingProdutos, startTransitionProdutos] = useTransition();
  const handleOpenMenuProdutos = () => {
    startTransitionProdutos(() => {
      setMenuProdutos(!menuProdutos);
    });
  };

  const [menuVendas, setMenuVendas] = useState(false);
  const [isPendingVendas, startTransitionVendas] = useTransition();
  const handleOpenMenuVendas = () => {
    startTransitionVendas(() => {
      setMenuVendas(!menuVendas);
    });
  };
  return (
    <div
      aria-label="Menu Lateral"
      className="bg-amber-950 lg:w-max h-screen text-white relative transition-all shadow-md"
    >
      {menu ? (
        <div className="flex flex-col items-center gap-2">
          <button
            aria-label="Expandir Menu Lateral"
            onClick={() => setMenu(!menu)}
            className="cursor-pointer lg:mx-2 mt-4 flex items-center justify-center lg:w-14 lg:h-14 rounded-full hover:bg-black transition-colors"
          >
            <Image
              src="/menu.svg"
              alt="Expandir Menu Lateral"
              width={40}
              height={40}
            />
          </button>

          <Link
            href={"/perfil"}
            className="cursor-pointer mx-2 flex items-center justify-center lg:w-14 lg:h-14 rounded-full hover:bg-black transition-colors"
            aria-label="Ir para Perfil"
          >
            <Image
              src="/home.svg"
              alt="Ir para Perfil"
              width={40}
              height={40}
            />
          </Link>
          <Link
            href={"/vendas"}
            className="cursor-pointer mx-2 flex items-center justify-center lg:w-14 lg:h-14 rounded-full hover:bg-black transition-colors"
            aria-label="Ir para Vendas"
          >
            <Image
              src="/novaVenda.svg"
              alt="Ir para Vendas"
              width={40}
              height={40}
            />
          </Link>
          {session?.user.role === "ADMINISTRADOR" && (
            <>
              <Link
                href={"/produtos"}
                className="cursor-pointer mx-2 flex items-center justify-center lg:w-14 lg:h-14 rounded-full hover:bg-black transition-colors"
                aria-label="Ir para Produtos"
              >
                <Image
                  src="/novoProduto.svg"
                  alt="Ir para Produtos"
                  width={40}
                  height={40}
                />
              </Link>
              <Link
                href={"/register"}
                className="cursor-pointer mx-2 flex items-center justify-center lg:w-14 lg:h-14 rounded-full hover:bg-black transition-colors"
                aria-label="Ir para Cadastro"
              >
                <Image
                  src="/registrar.svg"
                  alt="Ir para Cadastro"
                  width={40}
                  height={40}
                />
              </Link>
            </>
          )}
          <button
            onClick={handleLogout}
            className="cursor-pointer mx-2 flex items-center justify-center lg:w-14 lg:h-14 rounded-full hover:bg-black transition-colors"
            aria-label="Deslogar"
          >
            <Image src="/logout.svg" alt="Deslogar" width={40} height={40} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setMenu(!menu)}
          className="absolute top-70 lg:top-4 left-3 cursor-pointer"
          aria-label="Minimizar menu lateral"
        >
          <Image
            src="/arrow_back.svg"
            alt="Minimizar menu lateral"
            width={35}
            height={35}
            className=" hover:opacity-75 transition-opacity brightness-0 invert"
          />
        </button>
      )}

      <ul
        className={`w-25 lg:w-50 flex flex-col gap-3 mt-2 lg:mt-4 items-center px-2 lg:px-0 [&_li]:[&_a]:cursor-pointer [&_li]:[&_a]:py-1 lg:[&_li]:[&_a]:px-4 [&_li]:[&_a]:rounded [&_li]:[&_a]:hover:bg-black font-poppins text-white text-center text-lg ${
          menu ? "hidden" : "block"
        }`}
      >
        <li>
          <Image
            src={"/account.svg"}
            height={120}
            width={120}
            alt="Foto de Perfil"
          />
        </li>
        <li>
          <Link href={"/perfil"}>Perfil</Link>
        </li>
        <li>
          <button
            onClick={handleOpenMenuVendas}
            aria-expanded={menuVendas}
            aria-controls="submenu-vendas"
            className={`
      w-max text-left py-1 px-4 rounded hover:bg-black
      ${isPendingVendas ? "opacity-50 cursor-wait" : ""}
    `}
          >
            Vendas{" "}
            <span className="text-xs ml-1">{menuVendas ? "▲" : "▼"}</span>
          </button>

          {menuVendas && (
            <div className="flex flex-col *:text-sm bg-black/10 rounded-l ">
              <Link href="/vendas/criar">Criar Vendas</Link>
              <Link href="/vendas/dinamico">Filtro Dinâmico</Link>
              <Link href="/vendas/intervalo">Filtro por Intervalo</Link>
            </div>
          )}
        </li>
        {session?.user.role === "ADMINISTRADOR" && (
          <li>
            <button
              onClick={handleOpenMenuProdutos}
              aria-expanded={menuProdutos}
              aria-controls="submenu-produtos"
              className={`
        w-max text-left py-1 px-4 rounded hover:bg-black
        ${isPendingProdutos ? "opacity-50 cursor-wait" : ""}
      `}
            >
              Produtos
              <span className="text-xs ml-1">{menuProdutos ? "▲" : "▼"}</span>
            </button>

            {menuProdutos && (
              <div className="flex flex-col *:text-sm bg-black/10 rounded-l">
                <Link href="/produtos">Ver Produtos</Link>
                <Link href="/criarProduto">Criar Produto</Link>
              </div>
            )}
          </li>
        )}

        <li>
          <Link href={"/register"}>Cadastro</Link>
        </li>

        <li>
          <a onClick={handleLogout}>Sair</a>
        </li>
      </ul>
    </div>
  );
}
