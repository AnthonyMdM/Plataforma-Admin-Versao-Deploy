"use client";

import ButtonForm from "@/componentes/global/ButtonForm";
import React from "react";
import { signIn } from "next-auth/react";

export default function Page() {
  const [errors, setErrors] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrors([]);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result?.ok || result?.error) {
        setErrors(["Email ou senha incorretos"]);
        setIsLoading(false);
        return;
      }

      // Redireciona manualmente se o login for bem-sucedido
      window.location.href = "/perfil";
    } catch (error) {
      setErrors(["Erro ao fazer login"]);
      setIsLoading(false);
    }
  };

  return (
    <main className="main md:!items-center md:!justify-center">
      <section className="section md:!max-w-[40%] md:!min-h-[60%] flex flex-col sm:items-center sm:justify-center">
        <header className="mb-8">
          <h1 className="titulo">Faça Login</h1>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="divForm !gap-4 mb-5 !grid-rows-2 !grid-cols-1">
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                disabled={isLoading}
              />
            </div>
            {errors.length > 0 &&
              errors.map((err, i) => (
                <p key={i} className="text-red-600">
                  {err}
                </p>
              ))}
          </div>
          <ButtonForm/>
          {isLoading && <p className="mt-2 text-gray-600">Entrando...</p>}
        </form>
      </section>
    </main>
  );
}
