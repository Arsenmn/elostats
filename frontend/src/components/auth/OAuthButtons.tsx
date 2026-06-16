import { Gamepad2, Globe2 } from "lucide-react";
import type { ReactNode } from "react";
import { authApi } from "../../api/auth.api";
import type { OAuthProvider } from "../../types/auth.interface";

const providers: Array<{
  id: OAuthProvider;
  label: string;
  icon: ReactNode;
}> = [
  {
    id: "google",
    label: "Google",
    icon: <Globe2 className="h-4 w-4" aria-hidden="true" />,
  },
  {
    id: "steam",
    label: "Steam",
    icon: <Gamepad2 className="h-4 w-4" aria-hidden="true" />,
  },
];

const OAuthButtons = () => {
  const authenticate = (provider: OAuthProvider) => {
    window.location.assign(authApi.getOAuthUrl(provider));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.16em] text-[#64748b]">
        <span className="h-px flex-1 bg-[#29324a]" />
        <span>or continue with</span>
        <span className="h-px flex-1 bg-[#29324a]" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {providers.map((provider) => (
          <button
            key={provider.id}
            type="button"
            className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#29324a] bg-[#111827] px-4 py-3 text-sm font-black uppercase text-[#f4f7ff] transition hover:border-[#22f5ff]/70 hover:bg-[#122235] hover:text-[#22f5ff] focus:outline-none focus:ring-2 focus:ring-[#22f5ff]/60"
            onClick={() => authenticate(provider.id)}
          >
            {provider.icon}
            {provider.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OAuthButtons;
