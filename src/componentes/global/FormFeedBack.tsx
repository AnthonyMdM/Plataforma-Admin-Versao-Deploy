import { FormState } from "@/actions/actionsAccount";

export default function FormFeedback({ state }: { state: FormState }) {
  if (state.success) {
    return (
      <div
        role="status"
        className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg 
                   flex items-center gap-2 mt-6 animate-in slide-in-from-top duration-300 mb-10"
      >
        <span className="font-medium">Criado com sucesso!</span>
      </div>
    );
  }

  if (!state.success && state.errors.length > 0) {
    return (
      <div
        role="alert"
        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-6
                   animate-in slide-in-from-top duration-300 mb-10"
      >
        <div className="font-semibold mb-2">
          {state.errors.length === 1
            ? "Erro encontrado:"
            : `${state.errors.length} erros encontrados:`}
        </div>
        <ul className="list-disc list-inside space-y-1 text-sm">
          {state.errors.map((error: string, i: number) => (
            <li key={i}>{error}</li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
}
