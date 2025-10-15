import { getProduto } from "@/actions/actionsProdutos";
import PageEditProduto from "@/componentes/views/EditProdutoPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProduto({ params }: PageProps) {
  const { id } = await params;
  const { produto } = await getProduto(Number(id));

  if (!produto) return <p>Produto não encontrado</p>;
  
  return <PageEditProduto produto={produto} />;
}