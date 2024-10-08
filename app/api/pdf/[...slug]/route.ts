import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Função GET para lidar com a rota da API
export async function GET(req: NextRequest, { params }: { params: { slug: string[] } }) {
    const { slug } = params;

    // Verifica se o parâmetro 'slug' está presente
    if (!slug || slug.length === 0) {
        return NextResponse.json({ error: 'Missing file path in the URL' }, { status: 400 });
    }

    // Monta o caminho completo do arquivo a partir da pasta "public"
    const filePath = path.join(process.cwd(), 'public', ...slug);

    try {
        // Verifica se o arquivo existe
        if (!fs.existsSync(filePath)) {
            console.error(`File not found at: ${filePath}`);
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        // Verifica se o caminho é um arquivo válido
        const stat = fs.statSync(filePath);
        if (!stat.isFile()) {
            console.error(`Path is not a file: ${filePath}`);
            return NextResponse.json({ error: 'Path is not a valid file' }, { status: 400 });
        }

        // Lê o arquivo como um buffer
        const fileBuffer = fs.readFileSync(filePath);

        // Definir os headers apropriados
        const headers = {
            'Content-Type': 'application/pdf', // Certifique-se de que o tipo de arquivo está correto
            'Content-Disposition': `inline; filename="${slug[slug.length - 1]}"`,
            'Content-Length': stat.size.toString(),
        };

        // Retorna o arquivo com os headers
        console.log(`Successfully retrieved file: ${filePath}`);
        return new NextResponse(fileBuffer, { headers });
    } catch (error) {
        // Captura e loga qualquer erro inesperado
        console.error(`Error reading file at: ${filePath}`, error);
        return NextResponse.json({ error: 'Error reading file' }, { status: 500 });
    }
}
