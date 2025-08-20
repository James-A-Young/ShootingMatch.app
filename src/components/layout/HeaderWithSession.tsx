"use client";

import { SessionProvider } from "next-auth/react";
import { Header as HeaderComponent } from "./header";

export function HeaderWithSession() {
  return (
    <SessionProvider>
      <HeaderComponent />
    </SessionProvider>
  );
}
