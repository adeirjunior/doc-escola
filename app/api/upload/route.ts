import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file || file.type !== 'application/pdf') {
        return NextResponse.json({ message: 'Apenas arquivos PDF são permitidos.' }, { status: 400 });
    }

    const oldFolderPath = path.join(process.cwd(), 'public', 'old');
    await fs.mkdir(oldFolderPath, { recursive: true });

    const filePath = path.join(oldFolderPath, file.name);
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    await fs.writeFile(filePath, fileBuffer);

    return NextResponse.json({ message: 'Arquivo enviado!' });
}
