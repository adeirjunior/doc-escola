"use server"
import { Status } from "@prisma/client";
import prisma from "./../prisma";
import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from "next/cache";
import { documentoSchema } from "../zod";
import { ZodError } from "zod";

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

    try {
        const validDocumento = await documentoSchema.parseAsync({ ano_final, codigo, status, id_aluno, id_escola })
        console.log("Validação bem-sucedida!", validDocumento);
    } catch (error) {
        if (error instanceof ZodError) {
            console.log("Erros de validação:", error.errors);
            throw new Error(error.message)
        } else {
            console.error("Erro inesperado:", error);
        }
    }

    const uploadDir = path.join(process.cwd(), 'public', 'old');
    await fs.mkdir(uploadDir, { recursive: true });

    let url = formData.get("url") as string;
    const file = formData.get("file") as File | null | undefined;

    // Verifica se o arquivo existe e se o nome do arquivo não é vazio ou "undefined"
    if (file && file instanceof Blob && file.name && file.name !== "undefined") {
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        const sanitizedFileName = `${Date.now()}_${file.name.replace(/[^\w.-]/g, "_")}`;
        const filePath = path.join(uploadDir, sanitizedFileName);

        await fs.writeFile(filePath, fileBuffer);

        url = `/old/${sanitizedFileName}`;
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

    revalidatePath(`/documentos/${id}`);

    return documento;
}

export async function arquiveDocumento(id: string) {
    const documento = await prisma.documento.update({
        where: { id },
        data: {
            status: 'arquivado'
        }
    });

    revalidatePath("/")

    return documento
}

export async function deleteDocumento(id: string) {
    return await prisma.documento.delete({
        where: { id }
    });
}
