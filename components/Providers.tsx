"use client";

import type { ReactNode } from "react";
import { ATPProvider } from "atproto-react/client";
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { useAuthFromATP } from "@/hooks/useAuthFromATP";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ATPProvider>
      <ConvexProviderWithAuth client={convex} useAuth={useAuthFromATP}>
        {children}
      </ConvexProviderWithAuth>
    </ATPProvider>
  );
}
