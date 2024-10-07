'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { SessionProvider } from "next-auth/react"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <SessionProvider basePath={`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth`}>
        {children}
      </SessionProvider>
    </TooltipProvider>);
}
