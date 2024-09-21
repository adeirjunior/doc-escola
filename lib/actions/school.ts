"use server"
import { revalidatePath } from "next/cache";
import prisma from "./../prisma";
import { Status } from "@prisma/client";

export async function createEscola(usuarioId: string) {
    if (!usuarioId) {
        throw new Error('User ID is required to create a school');
    }

    return await prisma.escola.create({
        data: {
            usuario: { connect: { id: usuarioId } }
        }
    });
}

export async function findEscolaByNome(nome: string) {
    return await prisma.escola.findUnique({
        where: { nome }
    });
}

export async function findEscolaById(id: string) {
    return await prisma.escola.findUnique({
        where: { id }
    });
}

export async function findAllEscolas(search: string | null | undefined, offset: number = 0, limit: number = 6) {
    const whereClause = search
        ? {
            nome: {
                contains: search,
            },
        }
        : undefined;

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
        limit
    };
}


export async function updateEscola(id: string, formData: FormData) {
    const nome = formData.get("nome") as string;
    const endereco = formData.get("endereco") as string;
    const status = formData.get("status") as Status;

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

export async function deleteEscola(id: string) {
    const escola = await prisma.escola.delete({
        where: { id }
    });

    revalidatePath("/escolas")
    
    return escola
}
