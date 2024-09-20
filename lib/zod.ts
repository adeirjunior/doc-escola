import { object, string } from "zod"
 
export const signInSchema = object({
  username: string({ required_error: "Login é obrigatório" })
    .min(1, "Login é obrigatório"),
  senha: string({ required_error: "Senha é obrigatória" })
    .min(1, "Senha é obrigatória")
    .min(8, "Senha precisa ter mais que 8 caracteres")
    .max(32, "Senha precisa ter menos que 32 caracteres"),
})