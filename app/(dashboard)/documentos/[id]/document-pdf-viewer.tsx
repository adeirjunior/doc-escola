'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type PDFFile = string | File | null;

async function urlToFile(path: string, filename: string, mimeType: string): Promise<File> {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}${path}`;

    console.log(url)

    const response = await fetch(url);

    const blob = await response.blob();

    return new File([blob], filename, { type: mimeType });
}

export default function Sample({ url, name }: { url: string; name: string }) {
    const [file, setFile] = useState<PDFFile>(null);
    const [numPages, setNumPages] = useState<number>();

    const options = useMemo(() => {
        return {
            cMapUrl: `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/bcmaps/`,
            standardFontDataUrl: `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/standard_fonts/`,
            cMapPacked: true,
        };
    }, []);

    useEffect(() => {
        async function convertUrlToFile() {
            const fileFromUrl = await urlToFile(url, 'document.pdf', 'application/pdf');
            setFile(fileFromUrl);
        }
        convertUrlToFile();
    }, [url]);

    function onFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const { files } = event.target;
        const nextFile = files?.[0];

        if (nextFile) {
            setFile(nextFile);
        }
    }

    function onDocumentLoadSuccess({ numPages }: {numPages: number}) {
        setNumPages(numPages);
    }

    return (
        <div className="Example">
            <header className="bg-slate-300 p-4 my-4 rounded-md flex justify-between items-center">
                <h2 className='font-bold text-slate-700'>PDF</h2>
                <PDFDownloader url={url} />
            </header>
            <div className="Example__container">
                <div>
                    <p className="font-medium my-2">Carregar de arquivo:</p>{' '}
                    <Input name={name} onChange={onFileChange} type="file" />
                </div>
                <div className="Example__container__document">
                    <Suspense fallback={<p>Carregando...</p>}>
                        <Document file={file} onLoadSuccess={onDocumentLoadSuccess} options={options}>
                            {Array.from(new Array(numPages), (_, index) => (
                                <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                            ))}

                        </Document>
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

function PDFDownloader({ url }: { url: string }) {
    const [loading, setLoading] = useState(false);

    async function handleDownload() {
        setLoading(true);
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Erro ao baixar o PDF');
            }

            const blob = await response.blob();
            const fileUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = 'documento.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Erro ao baixar o arquivo:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Button onClick={handleDownload} disabled={loading}>
                {loading ? 'Baixando...' : 'Baixar PDF'}
            </Button>
        </div>
    );
}
