"use server"
import { revalidatePath } from "next/cache";
import prisma from "./../prisma";
import { Status } from "@prisma/client";
import { escolaSchema } from "../zod";
import { ZodError } from "zod";

export async function createEscola(usuarioId: string, endereco?: string, nome?: string, status?: Status ) {
    if (!usuarioId) {
        throw new Error('User ID is required to create a school');
    }

    try {
        const validEscola = await escolaSchema.parseAsync({ nome, endereco, status })
        console.log("Validação bem-sucedida!", validEscola);
    } catch (error) {
        if (error instanceof ZodError) {
            console.log("Erros de validação:", error.errors);
            throw new Error(error.message)
        } else {
            console.error("Erro inesperado:", error);
        }
    }

    const escola = await prisma.escola.create({
        data: {
            usuario: { connect: { id: usuarioId } },
            endereco: endereco ? endereco.toUpperCase() : undefined,
            nome: nome ? nome.toUpperCase() : undefined,
            status
        }
    });

    return escola
}

export async function findEscolaByNome(nome: string) {
    return await prisma.escola.findUnique({
        where: { nome }
    });
}

export async function findEscolaById(id: string) {
    // Encontrar a escola pelo id
    const escola = await prisma.escola.findUnique({
        where: {
            id: id,
        },
    });

    // Caso a escola não seja encontrada, retorna null ou um erro
    if (!escola) {
        return null; // ou throw new Error("Escola não encontrada");
    }

    // Buscar os documentos relacionados à escola para obter os alunos
    const documentos = await prisma.documento.findMany({
        where: {
            id_escola: escola.id,
        },
        select: {
            id_aluno: true,
        },
    });

    // Extrair os IDs dos alunos únicos, filtrando os nulos
    const alunoIds = documentos
        .map((doc) => doc.id_aluno)
        .filter((id): id is string => id !== null); // Filtra nulos

    // Buscar os detalhes dos alunos usando os IDs
    const alunos = await prisma.aluno.findMany({
        where: {
            id: {
                in: alunoIds,
            },
        },
    });

    // Retornar a escola com a lista de alunos
    return {
        ...escola,
        alunos,
    };
}

export async function findEscolas() {
    return await prisma.escola.findMany({
        where: {
            status: 'ativo'
        }
    })
}

export async function findAllEscolas(
    search?: string | null | undefined,
    status?: Status | null | undefined,
    offset: number = 0,
    limit: number = 6
) {
    const whereClause = {
        nome: search
            ? {
                contains: search,
            }
            : undefined,
        status: status !== null && status !== undefined ? status : undefined,
    };

    const totalEscolas = await prisma.escola.count({
        where: whereClause,
    });

    const escolas = await prisma.escola.findMany({
        where: whereClause,
        skip: offset,
        take: limit,
    });

    const escolasComContagem = await Promise.all(
        escolas.map(async (escola) => {
            const alunos = await prisma.documento.findMany({
                where: {
                    id_escola: escola.id,
                },
                select: {
                    id_aluno: true,
                },
            });

            const totalAlunos = new Set(alunos.map((doc) => doc.id_aluno)).size;

            return {
                ...escola,
                totalAlunos,
            };
        })
    );

    return {
        escolas: escolasComContagem,
        newOffset: offset + limit,
        totalEscolas,
        limit,
    };
}

export async function updateEscola(id: string, formData: FormData) {
    const nome = String(formData.get("nome")).toUpperCase();
    const endereco = String(formData.get("endereco")).toUpperCase();
    const status = formData.get("status") as Status;

    try {
        const validEscola = await escolaSchema.parseAsync({ nome, endereco, status })
        console.log("Validação bem-sucedida!", validEscola);
    } catch (error) {
        if (error instanceof ZodError) {
            console.log("Erros de validação:", error.errors);
            throw new Error(error.message)
        } else {
            console.error("Erro inesperado:", error);
        }
    }

    const escola = await prisma.escola.update({
        where: { id },
        data: {
            nome,
            endereco,
            status
        }
    });

    revalidatePath(`/escolas/${id}`)

    return escola
}

export async function arquiveEscola(id: string) {
    const escola = await prisma.escola.update({
        where: { id },
        data: {
            status: 'arquivado'
        }
    });

    revalidatePath("/escolas")

    return escola
}

export async function deleteEscola(id: string) {
    const escola = await prisma.escola.delete({
        where: { id }
    });

    revalidatePath("/escolas")
    
    return escola
}
