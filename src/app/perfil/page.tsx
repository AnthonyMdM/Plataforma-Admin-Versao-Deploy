"use client";
import Link from "next/link";
import React from "react";
import { Role } from "@prisma/client";
import { createUser } from "@/actions/actionsAccount";

export default function Page() {
  const [state, formAction] = React.useActionState(createUser, {
    errors: [],
    success: false,
    message: "",
  });
  const user = false;
  return (
    <div className="w-full overflow-x-auto h-full bg-white">
      <nav className="bg-black py-1 pl-5 flex *:text-white justify-around font-poppins">
        <div className="flex gap-2">
          <h1>Vendas:</h1>
          <div className="flex gap-3 *:hover:opacity-80">
            <Link href={"/perfil/filtro"}>Filtro Dinâmico</Link>
            <Link href={"/perfil/intervalo"}>Filtro por Intervalo</Link>
          </div>
        </div>
        <div className="flex gap-3 ">
          <h1>Produtos:</h1>
          <div className="flex gap-3 *:hover:opacity-80">
            <Link href={"/perfil/produtos"}>Todos os Produtos</Link>
            <Link href={"/perfil/produtos/createproduto"}>Criar Produtos</Link>
          </div>
        </div>
      </nav>
      {user && (
        <>
          <div>{user.image}</div>
          <div>{user.Name}</div>
          <div>{user.email}</div>
        </>
      )}
      {user.role == "admin" && (
        <>
          <form action="">
            <label htmlFor="nome" className="font-medium">
              Nome
            </label>
            <input
              type="text"
              name="nome"
              id="nome"
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o nome do produto"
              required
            />
            <label htmlFor="email" className="font-medium">
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o seu email"
              required
            />
            <label htmlFor="senha" className="font-medium">
              Senha
            </label>
            <input
              type="text"
              name="senha"
              id="senha"
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite sua senha"
              required
            />
            <label>Role:</label>
            <select name="role" defaultValue={Role.FUNCIONARIO}>
              {Object.values(Role).map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </form>
        </>
      )}
    </div>
  );
}
