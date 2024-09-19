"use server"
import prisma from "./../prisma";

export async function createUsuario(username: string, nome: string, senha: string) {
    return await prisma.usuario.create({
        data: { username, nome, senha }
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

export async function updateUsuario(username: string, data: Partial<{ nome: string, senha: string }>) {
    return await prisma.usuario.update({
        where: { username },
        data
    });
}

export async function deleteUsuario(username: string) {
    return await prisma.usuario.delete({
        where: { username }
    });
}
