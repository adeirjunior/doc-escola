"use server"
import { Status } from "@prisma/client";
import prisma from "./../prisma";
import { revalidatePath } from "next/cache";
import { alunoSchema } from "../zod";
import { ZodError } from "zod";

export async function createAluno(usuarioId: string) {
    return await prisma.aluno.create({
        data: {
            usuario: { connect: { id: usuarioId } }
        }
    });
}

export async function findAlunoById(id: string) {
    return await prisma.aluno.findUnique({
        where: { id }
    });
}

export async function findAlunos() {
    return await prisma.aluno.findMany({
        where: {
            status: 'ativo'
        }
    })
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
                    documentos: true
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
    const nome = formData.get("nome") as string;
    const nome_pai = formData.get("nome_pai") as string;
    const nome_mae = formData.get("nome_mae") as string;
    const status = formData.get("status") as Status;

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
