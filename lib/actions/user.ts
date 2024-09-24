"use server"
import { revalidatePath } from "next/cache";
import prisma from "./../prisma";

export async function createUsuario(username: string, nome: string, senha: string) {
    return await prisma.usuario.create({
        data: { username, nome, senha }
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
    const nome = formData.get("nome") as string;
    const username = formData.get("username") as string;

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
