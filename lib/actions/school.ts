"use server"
import { revalidatePath } from "next/cache";
import prisma from "./../prisma";

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

export async function findAllEscolas(search: string | null | undefined, offset: number, limit: number = 10) {
    const whereClause = search ? {
        nome: {
            contains: search,
        }
    } : undefined;

    const totalEscolas = await prisma.escola.count({
        where: whereClause,
    });

    const escolas = await prisma.escola.findMany({
        where: whereClause,
        skip: offset,
        take: limit,
    });

    const escolasComContagem = await Promise.all(escolas.map(async (escola) => {
        const alunos = await prisma.documento.findMany({
            where: {
                id_escola: escola.id,
            },
            select: {
                id_aluno: true,
            },
        });

        const totalAlunos = new Set(alunos.map(doc => doc.id_aluno)).size; // Usando Set para contar alunos distintos
        
        return {
            ...escola,
            totalAlunos,
        };
    }));

    const newOffset = Math.min(offset + limit, totalEscolas);
    
    return {
        escolas: escolasComContagem,
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

export async function deleteEscola(id: string) {
    const escola = await prisma.escola.delete({
        where: { id }
    });

    revalidatePath("/escolas")
    
    return escola
}
