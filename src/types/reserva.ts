
export type ReservaStatus = "ativa" | "confirmada" | "cancelada" | "expirada";

// Tipo Reserva (exemplo padrão, ajude a refinar conforme o backend)
export type Reserva = {
  id: string;
  consumidor_id: string;
  filial_id: string;
  produto_id: string;
  quantidade: number;
  status: ReservaStatus;
  criado_em: string;
  atualizado_em: string;
  expira_em?: string;
};
