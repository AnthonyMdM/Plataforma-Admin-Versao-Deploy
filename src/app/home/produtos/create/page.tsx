"use client";
import { createProduto } from "@/actions/actionsProdutos";
import { unidades } from "@/app/componentes/produto/produto";
import { useActionState, useState } from "react";

export default function PageCreate() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);

  const [state, formAction] = useActionState(createProduto, {
    errors: [],
    success: false,
  });

  const filteredunidades = Object.entries(unidades).filter(([label]) =>
    label.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setSearch("");
    setSelected("");
    setOpen(false);
    const form = document.querySelector("form") as HTMLFormElement;
    if (form) form.reset();
  };

  const handleUnitSelect = (label: string, value: string) => {
    setSelected(value);
    setSearch(label);
    setOpen(false);
  };

  const clearSelection = () => {
    setSelected("");
    setSearch("");
  };

  return (
    <div className="w-full h-full bg-gray-50 text-black">
      <h1 className="titulo pl-5 pt-5">Criar Produto:</h1>
      <form
        className="ml-8 pt-4 flex flex-col gap-4 font-poppins"
        action={formAction}
      >
        <div className="flex items-baseline gap-4 flex-wrap [&_div]:[&_label]:text-xl">
          <div className="flex flex-col gap-1 min-w-[200px]">
            <label htmlFor="nome" className="font-medium">
              Nome do Produto:
            </label>
            <input
              type="text"
              name="nome"
              id="nome"
              className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o nome do produto"
              required
            />
          </div>

          <div className="flex flex-col gap-1 relative min-w-[200px]">
            <label htmlFor="unidade" className="block font-medium">
              Unidade de Medida:
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
                className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {(search || selected) && (
                <button
                  type="button"
                  onClick={clearSelection}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
            {selected && (
              <input type="hidden" name="unidade_value" value={selected} />
            )}

            {open && (
              <ul className="border rounded max-h-40 overflow-y-auto absolute top-full left-0 right-0 bg-white z-10 shadow-lg">
                {search.length > 0 ? (
                  filteredunidades.length > 0 ? (
                    filteredunidades.map(([label, value]) => (
                      <li
                        key={value}
                        onMouseDown={() => handleUnitSelect(label, value)}
                        className={`p-2 cursor-pointer hover:bg-gray-200 ${
                          selected === value ? "bg-gray-300" : ""
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
                        className="p-2 cursor-pointer hover:bg-gray-200"
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

          <div className="flex flex-col gap-1 min-w-[150px]">
            <label htmlFor="preco" className="font-medium">
              Preço (R$):
            </label>
            <input
              type="number"
              name="preco"
              id="preco"
              step="0.01"
              min="0"
              placeholder="0,00"
              className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Salvar Produto
          </button>

          {state.success && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Novo Produto
            </button>
          )}
        </div>
      </form>

      <div className="ml-5 mt-4">
        {state.success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <div className="flex items-center">
              <span className="mr-2">✅</span>
              <span>Produto criado com sucesso!</span>
            </div>
          </div>
        )}

        {state.errors && state.errors.length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
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
      </div>
    </div>
  );
}
