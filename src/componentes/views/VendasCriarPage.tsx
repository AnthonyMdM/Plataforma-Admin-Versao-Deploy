"use client";
import { PerfilPageProps } from "@/types/tyeps-global";
import { getProdutos } from "@/actions/actionsProdutos";
import React from "react";
import FormFeedback from "@/componentes/global/FormFeedBack";
import ButtonForm from "@/componentes/global/ButtonForm";
import useCombobox from "@/hooks/useCombobox";
import useSWR from "swr";
import { formatCurrency } from "@/componentes/global/formatePreco";
import Image from "next/image";
import { createVenda } from "@/actions/actionsVendas";

const fetcher = async () => {
  return await getProdutos();
};

export default function VendasCreate({ user }: PerfilPageProps) {
  const { data } = useSWR(["produtos"], fetcher, {
    keepPreviousData: true,
  });
  const [itens, setItens] = React.useState<
    { produtoId: number; quantidade: number; preco_unitario: number }[]
  >([]);
  const [valorTotalVenda, setValorTotalVenda] = React.useState(0);

  const [preco, setPreco] = React.useState("R$ 0,00");
  const [unid, setUnid] = React.useState("Kg");
  const [precoTotal, setPrecoTotal] = React.useState("R$ 0,00");
  const [quant, setQuant] = React.useState("1");

  const optionsRecord = React.useMemo(() => {
    if (!data?.success || !data.data) return {};
    return Object.fromEntries(data.data.map((p) => [p.Nome, p.id.toString()]));
  }, [data]);

  const formRef = React.useRef<HTMLFormElement>(null);
  const combobox = useCombobox(optionsRecord);

  const [state, formAction] = React.useActionState(createVenda, {
    errors: [],
    success: false,
  });
  React.useEffect(() => {
    const dados = localStorage.getItem("lista");
    if (dados) setItens(JSON.parse(dados));
  }, []);

  React.useEffect(() => {
    localStorage.setItem("lista", JSON.stringify(itens));
  }, [itens]);

  React.useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset();
      combobox.reset();
      setItens([]);
      setQuant("1");
      setPreco("R$ 0,00");
      setPrecoTotal("R$ 0,00");
      setUnid("Kg");
    }
  }, [state.success]);

  const handleSubmit = React.useCallback(
    (formData: FormData) => {
      formAction(formData);
    },
    [formAction]
  );

  const focusedId =
    combobox.focusedIndex >= 0
      ? `products-option-${
          combobox.availableOptions[combobox.focusedIndex]?.[1]
        }`
      : undefined;

  React.useEffect(() => {
    const produto = data?.data?.find((item) => item.Nome === combobox.search);
    const precoValue = produto?.preco ?? 0;
    setPreco(formatCurrency(precoValue));
    setUnid(produto?.unidadePesagem || "?");
  }, [combobox.search, data?.data]);

  React.useEffect(() => {
    const produto = data?.data?.find((item) => item.Nome === combobox.search);
    const precoValue = produto?.preco ?? 0;
    const quantValue = parseFloat(quant) || 0;
    setPrecoTotal(formatCurrency(precoValue * quantValue));
  }, [combobox.search, quant, data?.data]);

  React.useEffect(() => {
    const total = itens.reduce((acc, item) => {
      return acc + item.quantidade * item.preco_unitario;
    }, 0);
    setValorTotalVenda(total);
  }, [itens]);

  return (
    <section className="section">
      <header className="mb-6">
        <h1 className="titulo">Criar Venda</h1>
        <p className="text-gray-600">Preencha as informações sobre a venda</p>
      </header>

      <div className="w-auto min-[900px]:w-max lg:w-auto">
        <p className="text-lg font-medium mb-2">Adicione um item a venda:</p>
        <div className="flex flex-wrap *:w-max *:md:w-auto md:grid md:grid-rows-2 md:grid-cols-7 gap-4 mb-6">
          <div className="col-span-6 md:col-span-3 lg:col-span-3 space-y-2">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="produto"
            >
              Produtos
            </label>
            <div className="relative">
              <input
                type="text"
                name="produto"
                id="produto"
                className="w-auto md:w-full px-3 py-2.5 border border-gray-300 rounded-lg 
           focus:outline-none focus:ring-2 focus:ring-blue-500 
           focus:border-transparent placeholder:text-gray-400 
           transition-colors pr-10"
                value={combobox.search}
                onChange={(e) => {
                  combobox.setSearch(e.target.value);
                  combobox.setOpen(true);

                  if (combobox.selected) {
                    const selectedLabel = Object.entries(optionsRecord).find(
                      ([, v]) => v === combobox.selected
                    )?.[0];

                    if (selectedLabel !== e.target.value) {
                      combobox.setSelected("");
                    }
                  }
                }}
                onFocus={() => combobox.setOpen(true)}
                onBlur={() => setTimeout(() => combobox.setOpen(false), 150)}
                onKeyDown={combobox.handleKeyDown}
                placeholder="Digite para buscar..."
                role="combobox"
                aria-controls="produto-listbox"
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
                  aria-label="Limpar seleção de produto"
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

              {combobox.selected && (
                <input
                  type="hidden"
                  name="produto_value"
                  value={combobox.selected}
                />
              )}

              {combobox.open && (
                <ul
                  id="produto-listbox"
                  role="listbox"
                  aria-label="Opções de produtos disponíveis"
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 
                           rounded-lg shadow-lg max-h-48 overflow-y-auto z-50
                           animate-in fade-in duration-150"
                >
                  {combobox.availableOptions.length > 0 ? (
                    combobox.availableOptions.map(([label, value], index) => (
                      <li
                        key={value}
                        id={`products-option-${value}`}
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
                      Nenhum produto encontrado
                    </li>
                  )}
                </ul>
              )}
            </div>
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
                      Object.entries(optionsRecord).find(
                        ([, v]) => v === combobox.selected
                      )?.[0]
                    }
                  </strong>{" "}
                  selecionado
                </span>
              </p>
            )}
          </div>

          <div className="col-span-4 md:col-span-2 lg:col-span-1 space-y-2 *:text-center">
            <label
              htmlFor="unidade"
              className="block text-sm font-medium text-gray-700"
            >
              Unid*
            </label>
            <input
              type="text"
              id="unidade"
              value={unid}
              readOnly
              placeholder="?"
              className="w-[100px] md:w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-700"
            />
          </div>

          <div className="col-span-4 md:col-span-3 lg:col-span-1 space-y-2">
            <label
              htmlFor="preco"
              className="block text-sm font-medium text-gray-700"
            >
              Preço (R$) *
            </label>
            <input
              type="text"
              id="preco"
              value={preco}
              readOnly
              placeholder="R$ 0,00"
              className="w-[100px] md:w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-700"
            />
          </div>

          <div className="col-span-4 md:col-span-2 lg:col-span-1 space-y-2 *:text-center">
            <label
              htmlFor="quantidade"
              className="block text-sm font-medium text-gray-700"
            >
              Quant *
            </label>
            <input
              type="number"
              name="quantidade"
              id="quantidade"
              value={quant}
              onChange={(e) => setQuant(e.target.value || "0")}
              step="0.01"
              min="0"
              placeholder="1"
              className="w-[100px] md:w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 transition-colors"
            />
          </div>

          <div className="col-span-4 lg:col-span-1 space-y-2">
            <label
              htmlFor="total"
              className="block text-sm font-medium text-gray-700"
            >
              Total
            </label>
            <input
              type="text"
              id="total"
              value={precoTotal}
              readOnly
              placeholder="R$ 0,00"
              className="w-[100px] md:w-fullpx-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-700 font-semibold text-center"
            />
          </div>

          <div className="pt-4 row-6 md:row-auto">
            <button
              type="button"
              onClick={() => {
                const quantValue = parseFloat(quant);
                if (!combobox.selected || !quantValue || quantValue <= 0) {
                  alert("Selecione um produto e informe a quantidade válida");
                  return;
                }

                const produto = data?.data?.find(
                  (item) => item.id.toString() === combobox.selected
                );

                if (produto) {
                  setItens([
                    ...itens,
                    {
                      produtoId: produto.id,
                      quantidade: quantValue,
                      preco_unitario: produto.preco,
                    },
                  ]);

                  combobox.reset();
                  setQuant("1");
                  setPreco("R$ 0,00");
                  setPrecoTotal("R$ 0,00");
                  setUnid("Kg");
                }
              }}
              className="mt-3 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 
                    disabled:bg-blue-400 disabled:cursor-not-allowed
                    transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
                    flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Adicionar
            </button>
          </div>
        </div>
      </div>

      {itens.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Itens da Venda</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Produto
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Quantidade
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Preço Unit.
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Total
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                    Excluir
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {itens.map((item, index) => {
                  const produto = data?.data?.find(
                    (p) => p.id === item.produtoId
                  );
                  return (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 *:px-4 *:py-3 *:text-sm"
                    >
                      <td>{produto?.Nome}</td>
                      <td>{item.quantidade}</td>
                      <td>{formatCurrency(item.preco_unitario)}</td>
                      <td className="font-medium">
                        {formatCurrency(item.quantidade * item.preco_unitario)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setItens(itens.filter((_, i) => i !== index))
                          }
                          className="text-red-600 hover:text-red-800"
                        >
                          <Image
                            src={"/delet.svg"}
                            width={30}
                            height={30}
                            alt="deletar"
                            className="cursor-pointer"
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="bg-gray-50 px-4 py-4 border-t border-gray-200">
              <div className="flex justify-evenly *:md:w-full items-center *:md:text-xl *:text-md max-w-md ml-auto">
                <span className="text-base text-right font-semibold text-gray-700">
                  Valor Total da Venda:
                </span>
                <span className="text-center font-bold text-blue-600">
                  {formatCurrency(valorTotalVenda)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <form ref={formRef} className="space-y-6 font-sans" action={handleSubmit}>
        <input type="hidden" id="idUser" name="idUser" value={user.id} />
        <input type="hidden" name="precoTotal" value={valorTotalVenda} />

        {itens.map((item, index) => (
          <React.Fragment key={index}>
            <input
              type="hidden"
              name={`itens[${index}][produtoId]`}
              value={item.produtoId}
            />
            <input
              type="hidden"
              name={`itens[${index}][quantidade]`}
              value={item.quantidade}
            />
            <input
              type="hidden"
              name={`itens[${index}][preco_unitario]`}
              value={item.preco_unitario}
            />
          </React.Fragment>
        ))}

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <ButtonForm />
        </div>
      </form>

      <FormFeedback state={state} />
    </section>
  );
}
