'use client';

import { useTransition } from 'react';
import { useRouter, useSearchParams, useSelectedLayoutSegments } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/icons';
import { Search } from 'lucide-react';

export function SearchInput() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const offset = Number(searchParams.get('offset')) ?? 0;
  const q = searchParams.get('q') || '';
  const segments = useSelectedLayoutSegments();

  function searchAction(formData: FormData) {
    const q = formData.get('q') as string;
    const newOffset = Math.max(0, offset - 12);

    const queryString = `?offset=${newOffset}${q ? `&q=${q}` : ''}${searchParams.get('escola') ? `&escola=${searchParams.get('escola')}` : ''}${searchParams.get('status') ? `&status=${status}` : ''}`;

    startTransition(() => {
      router.replace(`${queryString}`);
    });
  }

  return (
    <form action={searchAction} className="relative ml-auto flex-1 md:grow-0">
      {
        segments[0] === 'conta' || segments[0] === 'configuracoes' ? (
          <div></div>
        ) : (
          <>
            <Search className="absolute left-2.5 top-[.75rem] h-4 w-4 text-muted-foreground" />
            <Input
              name="q"
              type="search"
              placeholder="Pesquisa..."
              defaultValue={q}
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
            {isPending && <Spinner />}
          </>
        )
      }
    </form>
  );
}
