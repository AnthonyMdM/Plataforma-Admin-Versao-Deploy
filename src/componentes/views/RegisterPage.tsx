"use client";
import React from "react";
import { createUser } from "@/actions/actionsAccount";
import useCombobox from "@/hooks/useCombobox";
import ButtonForm from "../global/ButtonForm";
import FormFeedback from "../global/FormFeedBack";

export default function PageRegister() {
  const RoleValues = {
    Funcionario: "FUNCIONARIO",
    Administrador: "ADMINISTRADOR",
    Desenvolvedor: "DESENVOLVEDOR",
    Cliente: "CLIENTE",
  } as const;
  const combobox = useCombobox(RoleValues);
  const [state, formAction] = React.useActionState(createUser, {
    errors: [],
    success: false,
  });
  const handleSubmit = React.useCallback(
    (formData: FormData) => {
      formAction(formData);
    },
    [formAction]
  );

  const focusedId =
    combobox.focusedIndex >= 0
      ? `role-option-${combobox.availableOptions[combobox.focusedIndex]?.[1]}`
      : undefined;
  return (
    <section className="section !self-center !max-w-3xl">
      <header className="mb-8">
        <h1 className="titulo">Criar Novo Funcionário</h1>
        <p className="text-gray-600">
          Preencha as informações do novo Funcionário
        </p>
      </header>
      <form className="w-full md:min-w-2xl" action={handleSubmit}>
        <div className="divForm !flex sm:flex-row flex-col flex-wrap *:min-w-xs items-center">
          <div>
            <label htmlFor="nome" className="font-medium">
              Nome
            </label>
            <input
              type="text"
              name="nome"
              id="nome"
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o Nome do Funcionário"
              required
            />
          </div>
          <div>
            <label htmlFor="sobreNome" className="font-medium">
              Sobrenome
            </label>
            <input
              type="text"
              name="sobreNome"
              id="sobreNome"
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o Sobrenome do Funcionário"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="font-medium">
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o Email do Funcionário"
              required
            />
          </div>
          <div>
            <label htmlFor="senha" className="font-medium">
              Senha
            </label>
            <input
              type="text"
              name="senha"
              id="senha"
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite a Senha de Acesso"
              required
            />
          </div>

          <div className="relative">
            <label htmlFor="role">Função</label>
            <div className="relative">
              <input
                type="text"
                name="role"
                id="role"
                value={combobox.search}
                onChange={(e) => {
                  combobox.setSearch(e.target.value);
                  combobox.setOpen(true);

                  if (combobox.selected) {
                    const selectedLabel = Object.entries(RoleValues).find(
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
                aria-controls="role-listbox"
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
                  aria-label="Limpar seleção de role"
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
                name="role_value"
                value={combobox.selected}
              />
            )}

            {combobox.open && (
              <ul
                id="role-listbox"
                role="listbox"
                aria-label="roles de medida disponíveis"
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 
                                       rounded-lg shadow-lg max-h-48 overflow-y-auto z-50
                                       animate-in fade-in duration-150"
              >
                {combobox.availableOptions.length > 0 ? (
                  combobox.availableOptions.map(([label, value], index) => (
                    <li
                      key={value}
                      id={`role-option-${value}`}
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
                    Nenhuma role encontrada
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
                      Object.entries(RoleValues).find(
                        ([, v]) => v === combobox.selected
                      )?.[0]
                    }
                  </strong>{" "}
                  selecionada
                </span>
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end pt-4 border-t border-gray-100 mt-5">
          <FormFeedback state={state} />
          <ButtonForm />
        </div>
      </form>
    </section>
  );
}
