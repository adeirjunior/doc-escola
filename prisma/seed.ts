import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const usuarios = ['adeir', 'maria'];
    const escolas = ['adeir', 'maria'];
    const documentos = ['adeir', 'maria'];
    const alunos = ['adeir', 'maria'];

    for (const username of usuarios) {
        await prisma.usuario.upsert({
            where: { username },
            update: {
                nome: username,
                username,
                senha: "123"
            },
            create: {
                nome: username,
                username,
                senha: "123"
            },
        });
    }

    for (const nome of escolas) {
        const usuario = await prisma.usuario.findFirst({
            where: { username: nome }
        });

        if (usuario) {
            await prisma.escola.upsert({
                where: { nome },
                update: {
                    nome,
                    endereco: "Rua A, 42343, Bairro Central",
                    usuario: { connect: { id: usuario.id } }
                },
                create: {
                    nome,
                    endereco: "Rua A, 42343, Bairro Central",
                    usuario: { connect: { id: usuario.id } }
                },
            });
        }
    }

    for (const nome of documentos) {
        const escola = await prisma.escola.findFirst({
            where: { nome }
        });

        const usuario = await prisma.usuario.findFirst({
            where: { username: nome }
        });

        const aluno = await prisma.aluno.findFirst({
            where: { id: nome }
        });

        if (escola && usuario && aluno) {
            await prisma.documento.upsert({
                where: { id: nome },
                update: {
                    nome,
                    url: "http://192.168.3.32/doc-escola/old/3/73543.pdf",
                    escola: { connect: { id: escola.id } },
                    usuario: { connect: { id: usuario.id } },
                    aluno: { connect: { id: aluno.id } }
                },
                create: {
                    id: nome, 
                    nome,
                    url: "http://192.168.3.32/doc-escola/old/3/73543.pdf",
                    escola: { connect: { id: escola.id } },
                    usuario: { connect: { id: usuario.id } },
                    aluno: { connect: { id: aluno.id } }
                },
            });
        }
    }

    for (const id of alunos) {
        const escola = await prisma.escola.findFirst({
            where: { nome: id }
        });

        const usuario = await prisma.usuario.findFirst({
            where: { username: id }
        });

        if (escola && usuario) {
            await prisma.aluno.upsert({
                where: { id },
                update: {},
                create: {
                    id,
                    nome: "Ade",
                    id_escola: escola.id,
                    usuario: { connect: { id: usuario.id } }
                },
            });
        }
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })