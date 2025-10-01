import { useFormStatus } from "react-dom";

export default function ButtonForm() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 
                  disabled:bg-blue-400 disabled:cursor-not-allowed
                  transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
                  flex items-center gap-2"
    >
      {pending && (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {pending ? "Salvando..." : "Salvar"}
    </button>
  );
}
