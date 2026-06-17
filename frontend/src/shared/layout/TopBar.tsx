import { useAuth } from "@/providers/auth/useAuth.hook";
import { useLogout } from "@/providers/auth/useLogout.hook";
import { jwtDecode } from "jwt-decode";
import { LayoutDashboard, LogOut, Settings } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router";

interface AccessTokenPayload {
  sub?: string;
}

export function TopBar() {
  const { accessToken } = useAuth();
  const { logout } = useLogout();

  const userId = useMemo(() => {
    if (!accessToken) return undefined;

    try {
      return jwtDecode<AccessTokenPayload>(accessToken).sub;
    } catch {
      return undefined;
    }
  }, [accessToken]);

  const iconBtn =
    "flex h-12 w-12 items-center justify-center text-[#f4f7ff] no-underline transition-colors hover:text-[#dfff22] focus:outline-none focus:ring-2 focus:ring-[#dfff22]/45";
  const authAction =
    "flex h-12 items-center justify-center px-3 text-[11px] font-black uppercase text-[#f4f7ff] no-underline transition-colors hover:text-[#dfff22] focus:outline-none focus:ring-2 focus:ring-[#dfff22]/45 sm:px-4";

  return (
    <>
      <div className="fixed left-4 top-4 z-50 sm:left-6 sm:top-6">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-3 px-1 py-1.5 text-[#f4f7ff] no-underline transition-colors hover:text-[#dfff22] focus:outline-none focus:ring-2 focus:ring-[#dfff22]/45"
        >
          <div className="min-w-0">
            <span className="block text-sm font-black uppercase leading-none tracking-[0.08em] text-[#f4f7ff]">
              EloStats
            </span>
            <span className="mt-1 hidden text-[10px] font-bold uppercase tracking-[0.18em] text-[#94a3b8] sm:block">
              Runner analytics
            </span>
          </div>
        </Link>
      </div>

      <div className="fixed right-0 top-4 z-50 flex items-center gap-0 sm:top-6">
        {!accessToken ? (
          <>
            <Link to="/login" className={authAction}>
              Sign in
            </Link>
            <Link to="/register" className={authAction}>
              Register
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className={iconBtn} title="Dashboard">
              <LayoutDashboard className="h-4 w-4" />
            </Link>
            {userId && (
              <Link
                to={`/profile/${userId}`}
                className={iconBtn}
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </Link>
            )}
            <button
              onClick={() => logout()}
              className={iconBtn}
              title="Sign out"
              type="button"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </>
  );
}
