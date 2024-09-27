'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const errorMessage = Array.isArray(error.message)
    ? error.message.map((err, index) => (
      <li key={index}>{err.message}</li>
    ))
    : <p>{error.message}</p>;

  return (
    <main className="p-4 md:p-6">
      <div className="mb-8 space-y-4">
        <h1 className="font-semibold text-lg md:text-2xl">Erro</h1>
        {Array.isArray(error.message) ? (
          <ul className="list-disc pl-5">
            {errorMessage}
          </ul>
        ) : (
          errorMessage
        )}
      </div>

      <span>
        Acredita que não há erro?
        <Button className='ml-2' onClick={reset}>Tente novamente</Button>
      </span>
    </main>
  );
}
