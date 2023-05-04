"use client";

import { ATPProvider } from "atproto-react/client";

export function Providers({ children }) {
  return <ATPProvider>{children}</ATPProvider>;
}
