"use server"
import { Status } from "@prisma/client";
import prisma from "./../prisma";
import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from "next/cache";

export async function createDocumento(usuarioId: string) {
    return await prisma.documento.create({
        data: {
            usuario: { connect: { id: usuarioId } },
        }
    });
}

export async function findDocumentoById(id: string) {
    return await prisma.documento.findUnique({
        where: { id },
        include: {
            aluno: true,
            escola: true
        },
    });
}

export async function findAllDocumentos(search: string | null | undefined,
    status: Status | null | undefined,
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

    const totalDocumentos = await prisma.documento.count({
        where: whereClause
    });

    const documentos = await prisma.documento.findMany({
        where: whereClause,
        include: {
            aluno: true,
            escola: true
        },
        skip: offset,
        take: limit
    });

    return {
        documentos,
        newOffset: offset + limit,
        totalDocumentos,
        limit
    };
}

export async function updateDocumento(id: string, formData: FormData) {
    const ano_final = Number(formData.get("ano_final"));
    const codigo = Number(formData.get("codigo"));
    const status = formData.get("status") as Status;
    const id_aluno = formData.get("id_aluno") as string;
    const id_escola = formData.get("id_escola") as string;

    const uploadDir = path.join(process.cwd(), 'public', 'old');
    await fs.mkdir(uploadDir, { recursive: true });

    let url = formData.get("url") as string;

    const file = formData.get("file") as File | null;
    if (file && file instanceof Blob) {
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadDir, fileName);

        await fs.writeFile(filePath, fileBuffer);

        url = `/old/${fileName}`;
    }

    const documento = await prisma.documento.update({
        where: { id },
        data: {
            ano_final,
            codigo,
            status,
            url,
            id_escola,
            id_aluno
        }
    });

    // Revalida o caminho do documento
    revalidatePath(`/documentos/${id}`);

    return documento;
}

export async function deleteDocumento(id: string) {
    return await prisma.documento.delete({
        where: { id }
    });
}
