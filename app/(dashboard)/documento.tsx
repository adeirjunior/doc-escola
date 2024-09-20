import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Documento as DocumentoType } from '@prisma/client';
import { deleteDocumento } from '@/lib/actions/document';

export function Documento({ documento }: { documento: DocumentoType }) {
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="Product image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src='/placeholder-user.jpg'
          width="64"
        />
      </TableCell>
      <TableCell className="font-medium">{documento.nome}</TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {documento.criadoEm.toLocaleDateString("pt-BR")}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{`$${documento.codigo}`}</TableCell>
      <TableCell className="hidden md:table-cell">{documento.ano_final}</TableCell>
      <TableCell className="hidden md:table-cell">
        {documento.atualizadoEm.toLocaleDateString("pt-BR")}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem>
              <form action={() => deleteDocumento(documento.id)}>
                <button type="submit">Deletar</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
