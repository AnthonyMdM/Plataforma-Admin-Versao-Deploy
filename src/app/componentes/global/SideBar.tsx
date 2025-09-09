"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function SideBar() {
  const [menu, setMenu] = useState(false);
  return (
    <div className="bg-amber-950 h-screen text-white relative">
      {menu ? (
        <div className="flex flex-col items-center gap-5 mt-2">
          <button
            onClick={() => setMenu(!menu)}
            className="cursor-pointer mx-3 mt-4"
          >
            <Image
              src="/menu.svg"
              alt="Fechar menu"
              width={40}
              height={40}
              className="w-10 h-10 hover:opacity-75 transition-opacity "
            />
          </button>
          <Link href={"/home"}>
            <Image
              src="/home.svg"
              alt="Fechar menu"
              width={40}
              height={40}
              className="w-10 h-10 hover:opacity-75 transition-opacity "
            />
          </Link>
        </div>
      ) : (
        <button
          onClick={() => setMenu(!menu)}
          className="absolute top-4 left-3 cursor-pointer"
        >
          <Image
            src="/arrow_back.svg"
            alt="Fechar menu"
            width={35}
            height={35}
            className="hover:opacity-75 transition-opacity brightness-0 invert"
          />
        </button>
      )}

      <ul
        className={` w-50 flex flex-col gap-3 mt-4 items-center [&_li]:[&_a]:cursor-pointer [&_li]:[&_a]:py-1 [&_li]:[&_a]:px-4 [&_li]:[&_a]:rounded [&_li]:[&_a]:hover:bg-black font-poppins text-white text-center text-lg  ${
          menu ? "hidden" : "block"
        }`}
      >
        <li>
          <Image
            src={"/account.svg"}
            height={120}
            width={120}
            alt="account photo"
          />
        </li>
        <li>
          <Link href={"/home"}>Home</Link>
        </li>
        <li>
          <Link href={"/"}>Perfil</Link>
        </li>
        <li>
          <Link href={"/"}>Página de Análise</Link>
        </li>
      </ul>
    </div>
  );
}
