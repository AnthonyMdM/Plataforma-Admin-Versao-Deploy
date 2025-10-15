import type { Session } from "next-auth";

export type Vendas = { id: number; data: Date; userId: number };
export interface FormState<T = any> {
  success: boolean;
  errors: string[];
  data?: T;
}
export type PerfilPageProps = {
  user: Session["user"];
};
