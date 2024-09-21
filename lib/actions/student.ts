"use server"
import prisma from "./../prisma";

export async function createAluno(id: string, nome: string, id_escola: string, usuarioId: string) {
    return await prisma.aluno.create({
        data: {
            id,
            nome,
            usuario: { connect: { id: usuarioId } }
        }
    });
}

export async function findAlunoById(id: string) {
    return await prisma.aluno.findUnique({
        where: { id }
    });
}

export async function findAllAlunos(search: string, offset: number, limit: number = 10) {
    const totalAlunos = await prisma.aluno.count({
        where: {
            nome: {
                contains: search,
            }
        }
    });

    const alunos = await prisma.aluno.findMany({
        where: {
            nome: {
                contains: search,
            }
        },
        include: {
            _count: {
                select: {
                    documentos: true
                }
            }
        },
        skip: offset,
        take: limit
    });

    const newOffset = Math.min(offset + limit, totalAlunos);
    return {
        alunos,
        newOffset,
        totalAlunos
    };
}

export async function updateAluno(id: string, data: Partial<{ nome: string, usuarioId?: string }>) {
    return await prisma.aluno.update({
        where: { id },
        data: {
            ...data,
            usuario: data.usuarioId ? { connect: { id: data.usuarioId } } : undefined
        }
    });
}

export async function deleteAluno(id: string) {
    return await prisma.aluno.delete({
        where: { id }
    });
}
