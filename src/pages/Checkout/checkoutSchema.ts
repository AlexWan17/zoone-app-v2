
import { z } from "zod";

// Validação condicional: se tipoEntrega é 'entrega', campos de endereço são obrigatórios
export const checkoutSchema = z.object({
  nomeCompleto: z.string().min(3, 'Nome completo é obrigatório'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  tipoEntrega: z.enum(['entrega', 'retirada_filial']),
  formaPagamento: z.enum(['pix', 'cartao']),

  // Os campos de endereço são opcionais no esquema base, mas validados depois
  endereco: z.string(),
  numero: z.string(),
  complemento: z.string().optional(),
  bairro: z.string(),
  cidade: z.string(),
  estado: z.string(),
  cep: z.string(),
})
.superRefine((data, ctx) => {
  if (data.tipoEntrega === "entrega") {
    if (!data.endereco || data.endereco.length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Endereço é obrigatório",
        path: ["endereco"],
      });
    }
    if (!data.numero || data.numero.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Número é obrigatório",
        path: ["numero"],
      });
    }
    if (!data.bairro || data.bairro.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bairro é obrigatório",
        path: ["bairro"],
      });
    }
    if (!data.cidade || data.cidade.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cidade é obrigatória",
        path: ["cidade"],
      });
    }
    if (!data.estado || data.estado.length < 2 || data.estado.length > 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Estado é obrigatório (2 letras)",
        path: ["estado"],
      });
    }
    if (!data.cep || data.cep.length < 8 || data.cep.length > 9) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CEP é obrigatório",
        path: ["cep"],
      });
    }
  }
});
