"use client";

import { actionLogin } from "@/actions/actionsAccount";
import ButtonForm from "@/componentes/global/ButtonForm";
import { useActionState, useEffect } from "react";

export default function Page() {
  const [state, formAction, isPending] = useActionState(actionLogin, {
    errors: [],
    success: false,
  });

  useEffect(() => {
    async function redirect() {
      if (state.success) {
        window.location.href = "/perfil";
      }
    }
    redirect();
  }, [state]);

  return (
    <main className="main md:!items-center md:!justify-center">
      <section className="section md:!max-w-[40%] md:!min-h-[60%] flex flex-col sm:items-center sm:justify-center">
        <header className="mb-8">
          <h1 className="titulo">Faça Login</h1>
        </header>
        <form action={formAction}>
          <div className="divForm !gap-4 mb-5 !grid-rows-2 !grid-cols-1">
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                disabled={isPending}
              />
            </div>
            <div>
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                disabled={isPending}
              />
            </div>
            {state.errors.length > 0 &&
              state.errors.map((err, i) => (
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
