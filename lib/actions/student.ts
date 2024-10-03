"use server"
import { Status } from "@prisma/client";
import prisma from "./../prisma";
import { revalidatePath } from "next/cache";
import { alunoSchema } from "../zod";
import { ZodError } from "zod";

export async function createAluno(usuarioId: string, nome?: string, nome_pai?: string, nome_mae?: string, status?: Status) {
    try {
        const validAluno = await alunoSchema.parseAsync({ nome, nome_pai, nome_mae, status })
        console.log("Validação bem-sucedida!", validAluno);
    } catch (error) {
        if (error instanceof ZodError) {
            console.log("Erros de validação:", error.errors);
            throw new Error(error.message)
        } else {
            console.error("Erro inesperado:", error);
        }
    }

    return await prisma.aluno.create({
        data: {
            usuario: { connect: { id: usuarioId } },
            nome: nome ? nome.toUpperCase() : undefined,
            nome_pai: nome_pai ? nome_pai.toUpperCase() : undefined,
            nome_mae: nome_mae ? nome_mae.toUpperCase() : undefined,
            status
        }
    });
}

export async function findAlunoById(id: string, status?: Status) {
    const aluno = await prisma.aluno.findUnique({
        where: { id }
    });

    if (!aluno) {
        return null;
    }

    const documentos = await prisma.documento.findMany({
        where: {
            id_aluno: aluno.id,
            status
        },
    });

    return {
        ...aluno,
        documentos,
    };
}

export async function findAlunos() {
    return await prisma.aluno.findMany({
        where: {
            status: 'ativo'
        }
    })
}

export async function findAllAlunosWhereSchoolId(id: string, search: string, offset: number, limit: number = 6) {
    const whereClause = {
        id_escola: id,
        aluno: {
            nome: search
                ? {
                    contains: search,
                }
                : undefined,
        },
        status: 'ativo' as Status
    };


    const data = await prisma.documento.findMany({
        where: whereClause,
        select: {
            aluno: {
                include: {
                    _count: {
                        select: {
                            documentos: {
                                where: {
                                    status: 'ativo'
                                }
                            }
                        }
                    }
                },
            },
        },
        skip: Number(offset)
    });

    const alunos = data
        .map(d => d.aluno)
        .filter(aluno => aluno !== null);

    return {
        alunos,
        newOffset: offset + limit,
        totalAlunos: alunos.length,
        limit
    }
}

export async function findAllAlunos(search?: string | null | undefined,
    status?: Status | null | undefined,
    offset: number = 0,
    limit: number = 6) {
    const whereClause = {
        nome: search
            ? {
                contains: search,
            }
            : undefined,
        status: status !== null && status !== undefined ? status : undefined,
    };

    const totalAlunos = await prisma.aluno.count({
        where: whereClause,
    });

    const alunos = await prisma.aluno.findMany({
        where: whereClause,
        include: {
            _count: {
                select: {
                    documentos: {
                        where: {
                            status: 'ativo'
                        }
                    }
                }
            }
        },
        skip: offset,
        take: limit
    });

    return {
        alunos,
        newOffset: offset + limit,
        limit,
        totalAlunos
    };
}

export async function updateAluno(id: string, formData: FormData) {
    const nome = String(formData.get("nome")).toUpperCase();
    const nome_pai = String(formData.get("nome_pai")).toUpperCase();
    const nome_mae = String(formData.get("nome_mae")).toUpperCase();
    const status = formData.get("status") as Status;

    try {
        const validAluno = await alunoSchema.parseAsync({ nome, nome_pai, nome_mae, status })
        console.log("Validação bem-sucedida!", validAluno);
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.errors.map(err => err.message).join(', ');
            console.log("Erros de validação:", error.errors);
            throw new Error(errorMessages);
        } else {
            console.error("Erro inesperado:", error);
        }
    }

    const aluno = await prisma.aluno.update({
        where: { id },
        data: {
            nome,
            nome_pai,
            nome_mae,
            status
        }
    });

    revalidatePath(`/alunos/${id}`)

    return aluno
}

export async function arquiveAluno(id: string) {
    const aluno = await prisma.aluno.update({
        where: { id },
        data: {
            status: 'arquivado'
        }
    });

    revalidatePath("/alunos")

    return aluno
}

export async function deleteAluno(id: string) {
    return await prisma.aluno.delete({
        where: { id }
    });
}
