import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Doc Escola',
  description:
    'Programa de consulta de documentos escolares.'
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen w-full flex-col">
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
