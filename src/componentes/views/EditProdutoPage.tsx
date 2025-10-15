"use client";
import { updateProduto } from "@/actions/actionsProdutos";
import ButtonForm from "@/componentes/global/ButtonForm";
import React from "react";
import FormFeedback from "../global/FormFeedBack";
import { formatCurrency, parseCurrency } from "../global/formatePreco";
import { Produto } from "@prisma/client";

type ProdutoP = {
  produto: Produto;
};

export default function PageEditProduto({ produto }: ProdutoP) {
  const [nome, setNome] = React.useState(produto.Nome);
  const [precoInput, setPrecoInput] = React.useState(
    formatCurrency(produto.preco)
  );
  const [preco, setPreco] = React.useState(produto.preco);

  const [state, formAction] = React.useActionState(updateProduto, {
    errors: [],
    success: false,
  });

  return (
    <main className="main md:!items-center">
      <section className="section md:!max-w-max flex flex-col sm:items-center sm:justify-center">
        <header className="mb-8">
          <h1 className="titulo">Editar o Item</h1>
        </header>
        <div className="w-auto min-[900px]:w-max lg:w-max">
          <div className="flex flex-wrap *:w-max *:md:w-auto gap-4 mb-6">
            <div className="space-y-2 *:text-center">
              <label
                htmlFor="idProduto"
                className="block text-sm font-medium text-gray-700"
              >
                ID
              </label>
              <input
                type="text"
                id="idProduto"
                disabled
                readOnly
                value={produto.id}
                className="w-[100px] md:w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-700"
              />
            </div>
            <div className="space-y-2 *:text-center">
              <label
                htmlFor="nomeInput"
                className="block text-sm font-medium text-gray-700"
              >
                Nome
              </label>
              <input
                type="text"
                name="nomeInput"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ovo"
                className="w-[100px] md:w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 cursor-pointer text-gray-700"
              />
            </div>

            <div className="space-y-2 *:text-center">
              <label
                htmlFor="unidade"
                className="block text-sm font-medium text-gray-700"
              >
                Unid*
              </label>
              <input
                type="text"
                id="unidade"
                value={produto.unidadePesagem}
                disabled
                readOnly
                placeholder="Kg"
                className="w-[100px] md:w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-700"
              />
            </div>

            <div className="col-span-4 md:col-span-3 space-y-2">
              <label
                htmlFor="precoInput"
                className="block text-sm font-medium text-gray-700"
              >
                Preço (R$) *
              </label>
              <input
                type="text"
                name="precoInput"
                value={precoInput}
                onChange={(e) => {
                  const input = e.target.value;
                  setPrecoInput(input);
                  const parsed = parseCurrency(input);
                  setPreco(isNaN(parsed) || parsed === null ? 0 : parsed);
                }}
                placeholder="R$ 0,00"
                className="w-[100px] md:w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 cursor-pointer text-gray-700"
              />
            </div>
          </div>
          <form action={formAction}>
            <input type="hidden" name="idProduto" value={produto.id} />
            <input type="hidden" name="valor" value={preco} />
            <input type="hidden" name="nome" value={nome} />

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <ButtonForm />
            </div>
          </form>
          <FormFeedback state={state} />
        </div>
      </section>
    </main>
  );
}
