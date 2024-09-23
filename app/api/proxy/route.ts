import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url); // Extraímos os parâmetros da URL
    const url = searchParams.get('url'); // Pegamos a URL a partir do query param `url`

    if (!url) {
        return NextResponse.json({ error: 'A URL não foi fornecida.' }, { status: 400 });
    }

    try {
        // Faz a requisição para o servidor local
        const response = await fetch(url);

        if (!response.ok) {
            return NextResponse.json({ error: 'Erro ao acessar o arquivo' }, { status: response.status });
        }

        // Converte a resposta para blob (nesse caso, PDF)
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();

        // Retorna o arquivo PDF com o cabeçalho correto
        return new NextResponse(Buffer.from(arrayBuffer), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
            },
        });
    } catch {
        return NextResponse.json({ error: 'Erro ao processar a requisição' }, { status: 500 });
    }
}
