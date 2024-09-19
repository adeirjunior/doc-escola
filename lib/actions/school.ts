"use server"
import prisma from "./../prisma";

export async function createEscola(nome: string, endereco: string, usuarioId: string) {
    return await prisma.escola.create({
        data: {
            nome,
            endereco,
            usuario: { connect: { id: usuarioId } }
        }
    });
}

export async function findEscolaByNome(nome: string) {
    return await prisma.escola.findUnique({
        where: { nome }
    });
}

export async function findAllEscolas() {
    return await prisma.escola.findMany();
}

export async function updateEscola(nome: string, data: Partial<{ endereco: string, usuarioId?: string }>) {
    return await prisma.escola.update({
        where: { nome },
        data: {
            ...data,
            usuario: data.usuarioId ? { connect: { id: data.usuarioId } } : undefined
        }
    });
}

export async function deleteEscola(nome: string) {
    return await prisma.escola.delete({
        where: { nome }
    });
}
