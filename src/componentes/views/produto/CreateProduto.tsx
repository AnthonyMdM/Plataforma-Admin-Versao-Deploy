"use client";

import { createProduto } from "@/actions/actionsProdutos";
import React from "react";
import { unidades } from "@/componentes/views/produto/unidadesProdutos";
import FormFeedback from "@/componentes/global/FormFeedBack";
import ButtonForm from "@/componentes/global/ButtonForm";
import useCombobox from "@/hooks/useCombobox";

export default function ProdutoCreate() {
  const formRef = React.useRef<HTMLFormElement>(null);
  const combobox = useCombobox(unidades);

  const [state, formAction] = React.useActionState(createProduto, {
    errors: [],
    success: false,
  });

  React.useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset();
      combobox.reset();
    }
  }, [state.success, combobox]);

  const handleSubmit = React.useCallback(
    (formData: FormData) => {
      formAction(formData);
    },
    [formAction]
  );

  const focusedId =
    combobox.focusedIndex >= 0
      ? `unidade-option-${
          combobox.availableOptions[combobox.focusedIndex]?.[1]
        }`
      : undefined;

  return (
    <section className="section">
      <header className="mb-2 sm:mb-8">
        <h1 className="titulo">Criar Produto</h1>
        <p className="text-gray-600 hidden sm:block">
          Preencha as informações do novo produto
        </p>
      </header>

      <form ref={formRef} className="space-y-3 sm:space-y-6 font-sans" action={handleSubmit}>
        <div className="divForm !grid-col">
          <div>
            <label htmlFor="nome">Nome do Produto *</label>
            <input
              type="text"
              name="nome"
              id="nome"
              placeholder="Digite o nome do produto"
              required
            />
          </div>

          <div className="relative">
            <label htmlFor="unidade">Unidade de Medida *</label>
            <div className="relative">
              <input
                type="text"
                name="unidade"
                id="unidade"
                value={combobox.search}
                onChange={(e) => {
                  combobox.setSearch(e.target.value);
                  combobox.setOpen(true);

                  if (combobox.selected) {
                    const selectedLabel = Object.entries(unidades).find(
                      ([, v]) => v === combobox.selected
                    )?.[0];
                    if (selectedLabel !== e.target.value) {
                    }
                  }
                }}
                onFocus={() => combobox.setOpen(true)}
                onBlur={() => setTimeout(() => combobox.setOpen(false), 150)}
                onKeyDown={combobox.handleKeyDown}
                placeholder="Digite para buscar..."
                role="combobox"
                aria-controls="unidade-listbox"
                aria-expanded={combobox.open}
                aria-haspopup="listbox"
                aria-autocomplete="list"
                aria-activedescendant={focusedId}
                required
              />

              {(combobox.search || combobox.selected) && (
                <button
                  type="button"
                  onClick={combobox.handleClear}
                  aria-label="Limpar seleção de unidade"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                             hover:text-gray-600 focus:outline-none focus:text-gray-600"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {combobox.selected && (
              <input
                type="hidden"
                name="unidade_value"
                value={combobox.selected}
              />
            )}

            {combobox.open && (
              <ul
                id="unidade-listbox"
                role="listbox"
                aria-label="Unidades de medida disponíveis"
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 
                           rounded-lg shadow-lg max-h-48 overflow-y-auto z-50
                           animate-in fade-in duration-150"
              >
                {combobox.availableOptions.length > 0 ? (
                  combobox.availableOptions.map(([label, value], index) => (
                    <li
                      key={value}
                      id={`unidade-option-${value}`}
                      role="option"
                      aria-selected={combobox.selected === value}
                      onMouseDown={() => combobox.handleSelect(label, value)}
                      className={`px-3 py-2 cursor-pointer transition-colors
                        ${
                          combobox.focusedIndex === index
                            ? "bg-blue-50 text-blue-700"
                            : "hover:bg-gray-50"
                        }
                        ${
                          combobox.selected === value
                            ? "bg-blue-100 font-medium text-blue-800"
                            : ""
                        }
                      `}
                    >
                      {label}
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-gray-500 text-sm">
                    Nenhuma unidade encontrada
                  </li>
                )}
              </ul>
            )}

            {combobox.selected && (
              <p
                className="text-sm text-green-600 flex items-center gap-1 mt-1"
                role="status"
                aria-live="polite"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  <strong>
                    {
                      Object.entries(unidades).find(
                        ([, v]) => v === combobox.selected
                      )?.[0]
                    }
                  </strong>
                  selecionada
                </span>
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="preco"
              className="block text-sm font-medium text-gray-700"
            >
              Preço (R$) *
            </label>
            <div className="relative">
              <input
                type="number"
                name="preco"
                id="preco"
                step="0.01"
                min="0"
                placeholder="0,00"
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           placeholder:text-gray-400 transition-colors"
                required
              />
            </div>
          </div>
        </div>

        <fieldset className="space-y-2">
          <legend className="sr-only">Características do produto</legend>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              id="perecivel"
              name="perecivel"
              value="true"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded 
                         focus:ring-blue-500 focus:ring-2 transition-colors"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
              Este produto é perecível
            </span>
          </label>
        </fieldset>

        <div className="flex justify-end pt-2 sm:pt-4 border-t border-gray-100">
          <ButtonForm />
        </div>
      </form>

      <FormFeedback state={state} />
    </section>
  );
}
