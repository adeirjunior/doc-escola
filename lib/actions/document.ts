"use server"
import prisma from "./../prisma";

export async function createDocumento(id: string, nome: string, url: string, escolaId: string, usuarioId: string, alunoId: string, codigo: number, ano_final: number) {
    return await prisma.documento.create({
        data: {
            id,
            nome,
            url,
            codigo,
            ano_final,
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

export async function findAllDocumentos(search: string, offset: number, limit: number = 10) {
    const totalDocumentos = await prisma.documento.count({
        where: {
            nome: {
                contains: search,
            }
        },
    });

    const documentos = await prisma.documento.findMany({
        where: {
            nome: {
                contains: search,
            }
        },
        include: {
            aluno: true,
            escola: true
        },
        skip: offset,
        take: limit
    });

    const newOffset = Math.min(offset + limit, totalDocumentos);

    return {
        documentos,
        newOffset,
        totalDocumentos
    };
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
