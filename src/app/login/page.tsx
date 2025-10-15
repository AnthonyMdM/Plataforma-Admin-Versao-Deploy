"use client";

import { actionLogin } from "@/actions/actionsAccount";
import ButtonForm from "@/componentes/global/ButtonForm";
import React from "react";

export default function Page() {
  const [state, formAction] = React.useActionState(actionLogin, {
    errors: [],
    success: false,
  });
  const handleSubmit = React.useCallback(
    (formData: FormData) => {
      formAction(formData);
    },
    [formAction]
  );
  return (
    <main className="main md:!items-center md:!justify-center">
      <section className="section md:!max-w-[40%] md:!min-h-[60%] flex flex-col sm:items-center sm:justify-center">
        <header className="mb-8">
          <h1 className="titulo">Faça Login</h1>
        </header>
        <form action={handleSubmit}>
          <div className="divForm !gap-4 mb-5 !grid-rows-2 !grid-cols-1">
            <div>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" />
            </div>
            <div>
              <label htmlFor="password">Senha</label>
              <input type="password" id="password" name="password" />
            </div>
            {state.errors.length > 0 && <p className="text-red-600">{state.errors}</p>}
          </div>
          <ButtonForm />
        </form>
      </section>
    </main>
  );
}
