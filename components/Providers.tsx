"use client";

import type { ReactNode } from "react";
import { ATPProvider } from "atproto-react/client";
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { useAuthFromATP } from "@/hooks/useAuthFromATP";
import { BskyAgent } from "@atproto/api";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!, {
  verbose: true,
});

const agent = new BskyAgent({
  service: "https://bsky.social",
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ATPProvider agent={agent}>
      <ConvexProviderWithAuth client={convex} useAuth={useAuthFromATP}>
        {children}
      </ConvexProviderWithAuth>
    </ATPProvider>
  );
}
