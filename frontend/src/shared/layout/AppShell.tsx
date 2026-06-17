import type { ReactNode } from "react";
import { useState } from "react";
import { useLocation } from "react-router";
import { useAuth } from "@/providers/auth/useAuth.hook";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";
import { SearchOverlay } from "./SearchOverlay";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const { accessToken } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const shouldHideChrome =
    Boolean(accessToken) &&
    (location.pathname.startsWith("/dashboard") ||
      location.pathname.startsWith("/workspace") ||
      location.pathname.startsWith("/board") ||
      location.pathname.startsWith("/profile"));

  if (shouldHideChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <TopBar />
      {children}
      {isSearchOpen ? (
        <SearchOverlay onClose={() => setIsSearchOpen(false)} />
      ) : (
        <BottomNav onOpenSearch={() => setIsSearchOpen(true)} />
      )}
    </>
  );
}
