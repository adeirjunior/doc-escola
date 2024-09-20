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

export async function findAllEscolas(search: string, offset: number, limit: number = 10) {
    const totalEscolas = await prisma.escola.count({
        where: {
            nome: {
                contains: search,
            }
        }
    });

    const escolas = await prisma.escola.findMany({
        where: {
            nome: {
                contains: search,
            }
        },
        skip: offset,
        take: limit
    });

    const newOffset = Math.min(offset + limit, totalEscolas);

    return {
        escolas,
        newOffset,
        totalEscolas
    };
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
