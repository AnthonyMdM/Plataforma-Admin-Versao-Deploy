"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function SideBar() {
  const [menu, setMenu] = useState(true);
  return (
    <div className="bg-amber-950 lg:w-max h-screen text-white relative transition-all">
      {menu ? (
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setMenu(!menu)}
            className="cursor-pointer lg:mx-2 mt-4 flex items-center justify-center lg:w-14 lg:h-14 rounded-full hover:bg-black transition-colors"
          >
            <Image src="/menu.svg" alt="Fechar menu" width={40} height={40} />
          </button>

          <Link
            href={"/perfil"}
            className="cursor-pointer mx-2 flex items-center justify-center lg:w-14 lg:h-14 rounded-full hover:bg-black transition-colors"
          >
            <Image src="/home.svg" alt="Fechar menu" width={40} height={40} />
          </Link>
        </div>
      ) : (
        <button
          onClick={() => setMenu(!menu)}
          className="absolute top-70 lg:top-4 left-3 cursor-pointer"
        >
          <Image
            src="/arrow_back.svg"
            alt="Fechar menu"
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
            alt="account photo"
          />
        </li>
        <li>
          <Link href={"/perfil"}>Home</Link>
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
