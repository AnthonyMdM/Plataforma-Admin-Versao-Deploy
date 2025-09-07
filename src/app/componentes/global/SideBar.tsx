"use client";

import Image from "next/image";
import { useState } from "react";

export default function SideBar() {
  const [menu, setMenu] = useState(true);
  return (
    <div className="bg-amber-950  min-h-screen text-white">
      {menu ? (
        <button
          onClick={() => setMenu(!menu)}
          className="cursor-pointer mx-3 mt-4"
        >
          <Image
            src="/menu.svg"
            alt="Fechar menu"
            width={40}
            height={40}
            className="w-10 h-10 hover:opacity-75 transition-opacity brightness-0 invert"
          />
        </button>
      ) : (
        <button
          onClick={() => setMenu(!menu)}
          className="cursor-pointer mx-3 mt-4"
        >
          <Image
            src="/arrow_back.svg"
            alt="Fechar menu"
            width={40}
            height={40}
            className="w-10 h-10 hover:opacity-75 transition-opacity brightness-0 invert"
          />
        </button>
      )}

      <ul
        className={`font-poppins w-50 flex flex-col gap-2 items-center [&_li]:cursor-pointer [&_li]:p-2 [&_li]:rounded [&_li:hover]:bg-blue-100 [&_li]:transition-colors **:text-white **:w-full text-center ${
          menu ? "hidden" : "block"
        }`}
      >
        <li>
          <p>Foto</p>
        </li>
        <li>
          <p>Home</p>
        </li>
        <li>
          <p>Perfil</p>
        </li>
        <li>
          <p>Página de Análise</p>
        </li>
      </ul>
    </div>
  );
}
