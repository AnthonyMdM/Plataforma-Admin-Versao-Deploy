"use client";

import { createProduto } from "@/actions/actionsProdutos";
import React from "react";
import { unidades } from "./unidadesProdutos";

export default function ProdutoCreate() {
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const [state, formAction] = React.useActionState(createProduto, {
    errors: [],
    success: false,
    message: "",
  });

  const filteredunidades = Object.entries(unidades).filter(([label]) =>
    label.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = React.useCallback(() => {
    setSearch("");
    setSelected("");
    setOpen(false);
    const form = document.querySelector("form") as HTMLFormElement;
    if (form) form.reset();
  }, []);
  const handleSubmit = React.useCallback(
    (formData: FormData) => {
      resetForm();
      formAction(formData);
    },
    [resetForm]
  );

  const handleUnitSelect = React.useCallback((label: string, value: string) => {
    setSelected(value);
    setSearch(label);
    setOpen(false);
  }, []);

  const clearSelection = React.useCallback(() => {
    setSelected("");
    setSearch("");
  }, []);
  return (
    <section className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-md md:max-w-[1000px] lg:max-w-none">
      <header>
        <h1 className="titulo text-2xl font-bold mb-6">Criar Produto</h1>
      </header>

      <form className="flex flex-col gap-6 font-poppins" action={handleSubmit}>
        <div className="flex flex-wrap gap-6 [&_label]:text-lg">
          <div className="flex flex-col gap-2 w-full lg:w-[200px]">
            <label htmlFor="nome" className="font-medium">
              Nome do Produto
            </label>
            <input
              type="text"
              name="nome"
              id="nome"
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o nome do produto"
              required
            />
          </div>

          <div className="flex flex-col gap-2 w-full lg:w-[200px] relative">
            <label htmlFor="unidade" className="font-medium">
              Unidade de Medida
            </label>
            <div className="relative">
              <input
                type="text"
                name="unidade"
                id="unidade"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setOpen(true);
                  if (selected) {
                    const selectedLabel = Object.entries(unidades).find(
                      ([, v]) => v === selected
                    )?.[0];
                    if (selectedLabel !== e.target.value) {
                      setSelected("");
                    }
                  }
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => {
                  setTimeout(() => setOpen(false), 200);
                }}
                placeholder="Digite para buscar..."
                className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {(search || selected) && (
                <button
                  type="button"
                  onClick={clearSelection}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>

            {selected && (
              <input type="hidden" name="unidade_value" value={selected} />
            )}

            {open && (
              <ul className="border rounded-lg max-h-40 overflow-y-auto absolute top-full left-0 right-0 bg-white z-10 shadow-lg">
                {search.length > 0 ? (
                  filteredunidades.length > 0 ? (
                    filteredunidades.map(([label, value]) => (
                      <li
                        key={value}
                        onMouseDown={() => handleUnitSelect(label, value)}
                        className={`p-2 cursor-pointer hover:bg-gray-100 ${
                          selected === value ? "bg-gray-200 font-medium" : ""
                        }`}
                      >
                        {label}
                      </li>
                    ))
                  ) : (
                    <li className="p-2 text-gray-500">
                      Nenhuma unidade encontrada
                    </li>
                  )
                ) : (
                  Object.entries(unidades)
                    .slice(0, 5)
                    .map(([label, value]) => (
                      <li
                        key={value}
                        onMouseDown={() => handleUnitSelect(label, value)}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                      >
                        {label}
                      </li>
                    ))
                )}
              </ul>
            )}

            {selected && (
              <p className="text-sm text-green-600 mt-1">
                ✓ Unidade selecionada:{" "}
                <b>
                  {
                    Object.entries(unidades).find(
                      ([, v]) => v === selected
                    )?.[0]
                  }
                </b>
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 w-[150px]">
            <label htmlFor="preco" className="font-medium lg:flex-row-2">
              Preço (R$)
            </label>
            <input
              type="number"
              name="preco"
              id="preco"
              step="0.01"
              min="0"
              placeholder="0,00"
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <input
            type="checkbox"
            id="perecivel"
            name="perecivel"
            value="true"
            className="rounded"
          />
          <label htmlFor="perecivel" className="text-sm">
            Este produto é perecível
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Salvar Produto
          </button>
        </div>
      </form>

      {state.success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 w-max text-center flex items-center gap-2 mt-5">
          <span>✅</span>
          <span>Produto criado com sucesso!</span>
        </div>
      )}

      {!state.success && state.errors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          <div className="font-bold mb-2">
            {state.errors.length === 1
              ? "Erro:"
              : `${state.errors.length} erros encontrados:`}
          </div>
          <ul className="list-disc list-inside space-y-1">
            {state.errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
