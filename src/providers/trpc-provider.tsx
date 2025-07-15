// providers.tsx
"use client";

import { AppRouter } from "@/server/routers";
import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { TRPCProvider as TrpcProvider } from "@/lib/trpc";

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: "http://localhost:3002",
        }),
      ],
    })
  );

  return (
    <TrpcProvider trpcClient={trpcClient} queryClient={queryClient}>
      {children}
    </TrpcProvider>
  );
}
