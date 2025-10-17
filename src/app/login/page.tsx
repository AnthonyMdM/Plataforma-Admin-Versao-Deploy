"use client";

import ButtonForm from "@/componentes/global/ButtonForm";
import React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [errors, setErrors] = React.useState<string[]>([]);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result || result.error) {
      setErrors(["Email ou senha incorretos"]);
      return;
    }

    router.push("/perfil"); // redireciona para /perfil
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
              <input type="email" id="email" name="email" required />
            </div>
            <div>
              <label htmlFor="password">Senha</label>
              <input type="password" id="password" name="password" required />
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
