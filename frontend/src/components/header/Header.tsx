import { useMemo, useState } from "react";
import { useLocation, Link } from "react-router";
import { LogOut, Settings, LayoutDashboard, Menu, X } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../hooks/useAuth.hook";
import { useLogout } from "../../hooks/useLogout.hook";

const navItems = ["Players", "Stats", "Compare", "Leaderboards"];
const accent = "#d66f7c";

interface AccessTokenPayload {
  sub?: string;
}

const Header = () => {
  const location = useLocation();
  const { accessToken } = useAuth();
  const { logout } = useLogout();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isDashboardPage =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/workspace") ||
    location.pathname.startsWith("/board") ||
    location.pathname.startsWith("/profile");

  const userId = useMemo(() => {
    if (!accessToken) return undefined;

    try {
      return jwtDecode<AccessTokenPayload>(accessToken).sub;
    } catch {
      return undefined;
    }
  }, [accessToken]);

  // On dashboard — render nothing, the sidebar/viewer handle the chrome
  if (isDashboardPage && accessToken) return null;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const iconBtn =
    "text-[#c9cec8] hover:text-white hover:bg-[#d66f7c]/12 hover:border-[#d66f7c]/45";
  const navText =
    "relative text-[#c9cec8] after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:bg-[#d66f7c] after:transition-transform hover:text-white hover:after:scale-x-100";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#333a37] bg-[#0d100f]/88 backdrop-blur-xl">
      <nav
        className="flex h-14 w-full items-center justify-between px-4 transition-colors sm:h-16 sm:px-6"
      >
        <Link
          to="/"
          className="flex min-w-0 items-center gap-3 px-1 py-1.5 no-underline"
          onClick={closeMobileMenu}
        >
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center border border-[#d66f7c]/50 bg-[#141716] shadow-[6px_6px_0_rgba(214,111,124,0.22)]">
            <span className="text-[13px] font-black leading-none text-[#e6dfd3]">
              ES
            </span>
            <span
              className="absolute -right-1 top-1 h-7 w-1"
              style={{ backgroundColor: accent }}
            />
          </div>
          <div className="min-w-0">
            <span className="block text-sm font-black uppercase leading-none tracking-[0.08em] text-[#e6dfd3]">
              EloStats
            </span>
            <span className="mt-1 hidden text-[10px] font-bold uppercase tracking-[0.18em] text-[#858c87] sm:block">
              Ashen analytics
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item}
              type="button"
              className={`px-3.5 py-2 text-[13px] font-black uppercase tracking-[0.08em] transition-colors ${navText}`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {!accessToken ? (
            <>
              <Link
                to="/login"
                className={`hidden border border-transparent px-3.5 py-2 text-[13px] font-bold uppercase no-underline transition-colors sm:inline-flex ${iconBtn}`}
                onClick={closeMobileMenu}
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="hidden bg-[#d66f7c] px-3.5 py-2 text-[13px] font-black uppercase text-[#101312] no-underline shadow-[0_12px_30px_rgba(214,111,124,0.22)] transition hover:bg-[#e2939d] sm:inline-flex"
                onClick={closeMobileMenu}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className={`hidden h-9 w-9 items-center justify-center border border-transparent no-underline transition-colors sm:flex ${iconBtn}`}
                title="Dashboard"
                onClick={closeMobileMenu}
              >
                <LayoutDashboard className="h-4 w-4" />
              </Link>
              {userId && (
                <Link
                  to={`/profile/${userId}`}
                  className={`hidden h-9 w-9 items-center justify-center border border-transparent no-underline transition-colors sm:flex ${iconBtn}`}
                  title="Settings"
                  onClick={closeMobileMenu}
                >
                  <Settings className="h-4 w-4" />
                </Link>
              )}
              <button
                onClick={() => {
                  closeMobileMenu();
                  logout();
                }}
                className={`hidden h-9 w-9 items-center justify-center border border-transparent transition-colors sm:flex ${iconBtn}`}
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}

          <button
            type="button"
            className={`flex h-10 w-10 items-center justify-center border border-[#333a37] text-[#e6dfd3] transition hover:border-[#d66f7c] hover:text-white md:hidden`}
            onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
            aria-label="Toggle navigation"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="border-t border-[#333a37] bg-[#0d100f]/96 px-4 py-4 shadow-[0_24px_70px_rgba(0,0,0,0.45)] md:hidden">
          <div className="grid gap-1">
            {navItems.map((item) => (
              <button
                key={item}
                type="button"
                className="border-l-2 border-transparent px-3 py-3 text-left text-sm font-black uppercase tracking-[0.1em] text-[#c9cec8] transition hover:border-[#d66f7c] hover:bg-[#d66f7c]/10 hover:text-white"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-2 border-t border-[#333a37] pt-4">
            {!accessToken ? (
              <>
                <Link
                  to="/login"
                  className="border border-[#333a37] px-3 py-3 text-sm font-bold uppercase text-[#c9cec8] no-underline"
                  onClick={closeMobileMenu}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-[#d66f7c] px-3 py-3 text-sm font-black uppercase text-[#101312] no-underline"
                  onClick={closeMobileMenu}
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="border border-[#333a37] px-3 py-3 text-sm font-bold uppercase text-[#c9cec8] no-underline"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
                {userId && (
                  <Link
                    to={`/profile/${userId}`}
                    className="border border-[#333a37] px-3 py-3 text-sm font-bold uppercase text-[#c9cec8] no-underline"
                    onClick={closeMobileMenu}
                  >
                    Settings
                  </Link>
                )}
                <button
                  type="button"
                  className="bg-[#d66f7c] px-3 py-3 text-left text-sm font-black uppercase text-[#101312]"
                  onClick={() => {
                    closeMobileMenu();
                    logout();
                  }}
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
