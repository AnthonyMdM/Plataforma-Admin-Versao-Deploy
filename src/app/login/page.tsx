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

    console.log("🔍 [LOGIN] Tentando fazer login...");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("🔍 [LOGIN] Resultado:", result);

      if (!result) {
        console.log("❌ [LOGIN] Resultado undefined");
        setErrors(["Erro ao fazer login"]);
        setIsLoading(false);
        return;
      }

      if (result.error) {
        console.log("❌ [LOGIN] Erro:", result.error);
        setErrors(["Email ou senha incorretos"]);
        setIsLoading(false);
        return;
      }

      if (result.ok) {
        console.log("✅ [LOGIN] Login bem-sucedido, redirecionando...");
        window.location.href = "/perfil";
        return;
      }

      console.log("❌ [LOGIN] Status desconhecido");
      setErrors(["Erro inesperado"]);
      setIsLoading(false);
    } catch (error) {
      console.error("❌ [LOGIN] Erro no catch:", error);
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
          <ButtonForm />
          {isLoading && <p className="mt-2 text-gray-600">Entrando...</p>}
        </form>
      </section>
    </main>
  );
}
