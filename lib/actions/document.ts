"use server"
import prisma from "./../prisma";

export async function createDocumento(id: string, nome: string, url: string, escolaId: string, usuarioId: string, alunoId: string) {
    return await prisma.documento.create({
        data: {
            id,
            nome,
            url,
            escola: { connect: { id: escolaId } },
            usuario: { connect: { id: usuarioId } },
            aluno: { connect: { id: alunoId } }
        }
    });
}

export async function findDocumentoById(id: string) {
    return await prisma.documento.findUnique({
        where: { id }
    });
}

export async function findAllDocumentos() {
    return await prisma.documento.findMany();
}

export async function updateDocumento(id: string, data: Partial<{ nome: string, url: string, escolaId?: string, usuarioId?: string, alunoId?: string }>) {
    return await prisma.documento.update({
        where: { id },
        data: {
            ...data,
            escola: data.escolaId ? { connect: { id: data.escolaId } } : undefined,
            usuario: data.usuarioId ? { connect: { id: data.usuarioId } } : undefined,
            aluno: data.alunoId ? { connect: { id: data.alunoId } } : undefined
        }
    });
}

export async function deleteDocumento(id: string) {
    return await prisma.documento.delete({
        where: { id }
    });
}
