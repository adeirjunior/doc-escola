import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const usuarios = ['adeir', 'maria'];
    const escolas = ['ESCOLA MUNICIPAL PROF. GUILHERME MACHADO DE SOUZA', 'ESCOLA MUNICIPAL ANTÔNIO BORGES DA FONSECA'];
    const documentos = ['adeir', 'maria'];
    const alunos = ['adeir', 'maria'];

    for (const username of usuarios) {
        await prisma.usuario.upsert({
            where: { username },
            update: {
                nome: username,
                username,
                senha: "12345678"
            },
            create: {
                nome: username,
                username,
                senha: "12345678"
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
                    endereco: "LINHA 152 GLEBA 09 LOTE 28 KM 12 NORTE",
                    status: "ativo",
                    usuario: { connect: { id: usuario.id } }
                },
                create: {
                    nome,
                    endereco: "LINHA 152 GLEBA 09 LOTE 28 KM 12 NORTE",
                    status: "ativo",
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
                    url: "http://192.168.3.32/doc-escola/old/3/73543.pdf",
                    escola: { connect: { id: escola.id } },
                    usuario: { connect: { id: usuario.id } },
                    aluno: { connect: { id: aluno.id } }
                },
                create: {
                    id: nome,
                    url: "http://192.168.3.32/doc-escola/old/3/73543.pdf",
                    escola: { connect: { id: escola.id } },
                    usuario: { connect: { id: usuario.id } },
                    aluno: { connect: { id: aluno.id } },
                    ano_final: 2008,
                    codigo: 1
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