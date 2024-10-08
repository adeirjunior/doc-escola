"use server"
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { contaSchema } from "../zod";
import { ZodError } from "zod";

export async function createUsuario(username: string, nome: string, senha: string) {
    return await prisma.usuario.create({
        data: { 
            username: username.toLowerCase(), 
            nome: nome.toUpperCase(), 
            senha 
        }
    });
}

export async function findUsuarioById(id: string) {
    return await prisma.usuario.findUnique({
        where: { id }
    });
}

export async function findUsuarioByUsername(username: string) {
    return await prisma.usuario.findUnique({
        where: { username }
    });
}

export async function findAllUsuarios() {
    return await prisma.usuario.findMany();
}

export async function updateUsuario(id: string, formData: FormData) {
    const nome = String(formData.get("nome")).toUpperCase();
    const username = String(formData.get("username")).toLocaleLowerCase();

    try {
        const validAluno = await contaSchema.parseAsync({ nome, username })
        console.log("Validação bem-sucedida!", validAluno);
    } catch (error) {
        if (error instanceof ZodError) {
            console.log("Erros de validação:", error.errors);
            throw new Error(error.message)
        } else {
            console.error("Erro inesperado:", error);
        }
    }

    const usuario = await prisma.usuario.update({
        where: { id },
        data: {
            nome,
            username
        }
    });

    revalidatePath(`/conta`)

    return usuario
}

export async function deleteUsuario(username: string) {
    return await prisma.usuario.delete({
        where: { username }
    });
}
