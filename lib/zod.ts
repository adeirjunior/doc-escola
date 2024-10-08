/* eslint-disable @typescript-eslint/no-explicit-any */
import { object, string, number, enum as zEnum, optional } from 'zod';

export const statusEnum = zEnum(['ativo', 'rascunho', 'arquivado']);

// Função para garantir campos obrigatórios para o esquema de Escola
const requiredFields = (schema: any, optionalFields: string[] = []) => {
  return schema.refine((data: any) => {
    // Verifica se o status é 'ativo' e se todos os campos obrigatórios estão preenchidos
    if (data.status === 'ativo') {
      return Object.entries(data).every(([key, value]) =>
        optionalFields.includes(key) || (value !== undefined && value !== '') // Verifica se o valor não é vazio
      );
    }
    return true; // Se o status não é 'ativo', não há verificação
  }, {
    message: "Todos os campos são obrigatórios quando o status é 'ativo', exceto os campos opcionais.",
  });
};

export const alunoSchema = requiredFields(object({
  nome: optional(string().max(150, 'Nome não pode ter mais que 150 caracteres')),
  nome_pai: optional(string().max(150, 'Nome do pai não pode ter mais que 150 caracteres')), // Campo não obrigatório
  nome_mae: optional(string().max(150, 'Nome da mãe não pode ter mais que 150 caracteres')),
  status: statusEnum.optional().default('rascunho'),
}), ['nome_pai', 'nome_mae']); // Passando nome_pai como campo opcional

export const documentoSchema = requiredFields(object({
  url: optional(string().max(240, 'URL não pode ter mais que 240 caracteres')),
  codigo: optional(number().int().nonnegative('Código deve ser um número inteiro não negativo')),
  ano_final: optional(number().int().nonnegative('Ano final deve ser um número inteiro não negativo')),
  status: statusEnum.optional().default('rascunho'),
  id_aluno: optional(string()),
  id_escola: optional(string()),
}));

export const escolaSchema = requiredFields(object({
  nome: optional(string().max(150, 'Nome não pode ter mais que 150 caracteres')),
  endereco: optional(string().max(100, 'Endereço não pode ter mais que 100 caracteres')),
  status: statusEnum.optional().default('rascunho'),
}));

export const contaSchema = requiredFields(object({
  nome: string()
    .max(30, 'Nome não pode ter mais que 30 caracteres')
    .min(3, 'Nome é obrigatório'), 
  username: string()
    .max(10, 'Endereço não pode ter mais que 10 caracteres')
    .min(3, 'Username é obrigatório'),
}));


export const signInSchema = object({
  username: string({ required_error: "Login é obrigatório" })
    .min(1, "Login é obrigatório"),
  senha: string({ required_error: "Senha é obrigatória" })
    .min(1, "Senha é obrigatória")
    .min(8, "Senha precisa ter mais que 8 caracteres")
    .max(32, "Senha precisa ter menos que 32 caracteres"),
}) 