'use client';

import { useState, useEffect, Suspense } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import './Sample.css';

import type { PDFDocumentProxy } from 'pdfjs-dist';
import { Button } from '@/components/ui/button';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const options = {
    cMapUrl: '/cmaps/',
    standardFontDataUrl: '/standard_fonts/',
};

const maxWidth = 800;

type PDFFile = string | File | null;

async function urlToFile(url: string, filename: string, mimeType: string): Promise<File> {
    const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
}

export default function Sample({ url }: { url: string }) {
    const [file, setFile] = useState<PDFFile>(null);
    const [numPages, setNumPages] = useState<number>();

    useEffect(() => {
        async function convertUrlToFile() {
            const fileFromUrl = await urlToFile(url, 'document.pdf', 'application/pdf');
            setFile(fileFromUrl);
        }
        convertUrlToFile();
    }, [url]);

    function onDocumentLoadSuccess({ numPages: nextNumPages }: PDFDocumentProxy): void {
        setNumPages(nextNumPages);
    }

    return (
        <div className="Example">
            <header className='flex justify-between items-center'>
                <h2>PDF</h2>
                <PDFDownloader url={url}/>
            </header>
            <div className="Example__container">
                <div className="Example__container__document">
                    <Suspense fallback={<p>Carregando...</p>}>
                        <Document file={file} onLoadSuccess={onDocumentLoadSuccess} options={options}>
                            {Array.from(new Array(numPages), (_el, index) => (
                                <Page
                                    key={`page_${index + 1}`}
                                    pageNumber={index + 1}
                                    width={maxWidth}
                                />
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
            const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);

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
