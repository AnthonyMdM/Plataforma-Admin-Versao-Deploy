"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import ButtonForm from "@/componentes/global/ButtonForm";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // tenta logar com a strategy credentials
    const res = await signIn("credentials", {
      redirect: false, // evita redirecionamento automático do NextAuth
      email,
      password,
    });

    setLoading(false);

    if (res?.ok) {
      // redireciona manualmente após o cookie estar pronto
      window.location.href = "/perfil";
    } else {
      setErrors([res?.error || "Erro ao fazer login"]);
    }
  }

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
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                disabled={loading}
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
        </form>
      </section>
    </main>
  );
}
