import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'A URL não foi fornecida.' }, { status: 400 });
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            return NextResponse.json({ error: 'Erro ao acessar o arquivo' }, { status: response.status });
        }

        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();

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
