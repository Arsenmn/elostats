import { useMemo, useState } from "react";
import { useLocation, Link } from "react-router";
import { LogOut, Settings, LayoutDashboard, X } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../hooks/useAuth.hook";
import { useLogout } from "../../hooks/useLogout.hook";
import PlayerSearchCombobox from "../../modules/player-search/components/PlayerSearchCombobox";

const navItems = [
  { label: "Search" },
  { label: "Stats", to: "/" },
  { label: "Compare", to: "/" },
  { label: "Leaderboards", to: "/players" },
];

interface AccessTokenPayload {
  sub?: string;
}

const Header = () => {
  const location = useLocation();
  const { accessToken } = useAuth();
  const { logout } = useLogout();
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

  const iconBtn =
    "flex h-12 w-12 items-center justify-center text-[#f4f7ff] no-underline transition-colors hover:text-[#dfff22] focus:outline-none focus:ring-2 focus:ring-[#dfff22]/45";
  const authAction =
    "flex h-12 items-center justify-center px-3 text-[11px] font-black uppercase text-[#f4f7ff] no-underline transition-colors hover:text-[#dfff22] focus:outline-none focus:ring-2 focus:ring-[#dfff22]/45 sm:px-4";
  const navItemClassName = (label: string) =>
    `relative shrink-0 px-3.5 py-2 text-[13px] font-black uppercase tracking-[0.08em] no-underline transition-colors focus:outline-none focus:ring-2 focus:ring-[#dfff22]/45 ${
      hoveredNavItem === label
        ? "bg-[#05070d] text-[#dfff22]"
        : hoveredNavItem
          ? "text-[#05070d]"
          : "text-[#dbe7ff] hover:text-white"
    }`;

  const openSearch = () => {
    setHoveredNavItem(null);
    setIsSearchOpen(true);
  };

  const closeSearch = () => setIsSearchOpen(false);

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

      {isSearchOpen && (
        <button
          type="button"
          aria-label="Close search"
          className="fixed inset-0 z-40 cursor-default bg-[#05070d]/18 backdrop-blur-md"
          onClick={closeSearch}
        />
      )}

      {isSearchOpen ? (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#dfff22]/50 bg-[#05070d]/92 px-4 py-3 shadow-[0_-24px_90px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:px-6">
          <div className="mx-auto flex max-w-7xl items-start gap-3">
            <PlayerSearchCombobox
              autoFocus
              className="relative flex min-w-0 flex-1 flex-col gap-3 sm:flex-row"
              inputContainerClassName="relative min-w-0 flex-1"
              onNavigate={closeSearch}
            />

            <button
              type="button"
              aria-label="Close search"
              className="flex h-14 w-14 shrink-0 items-center justify-center text-[#f4f7ff] transition-colors hover:text-[#dfff22] focus:outline-none focus:ring-2 focus:ring-[#dfff22]/45"
              onClick={closeSearch}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <header
          className="fixed inset-x-0 bottom-0 z-50 overflow-hidden border-t border-[#29324a] bg-[#05070d]/88 backdrop-blur-xl"
          onMouseLeave={() => setHoveredNavItem(null)}
        >
          <div
            className={`pointer-events-none absolute inset-0 origin-bottom bg-[#dfff22] transition-transform duration-300 ease-out ${
              hoveredNavItem ? "scale-y-100" : "scale-y-0"
            }`}
          />

          <nav className="relative flex h-14 w-full items-center justify-center overflow-x-auto px-3 transition-colors sm:h-16">
            <div className="relative z-10 flex min-w-max items-center gap-1">
              {navItems.map((item) =>
                item.to ? (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={navItemClassName(item.label)}
                    onBlur={() => setHoveredNavItem(null)}
                    onFocus={() => setHoveredNavItem(item.label)}
                    onMouseEnter={() => setHoveredNavItem(item.label)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    type="button"
                    className={navItemClassName(item.label)}
                    onBlur={() => setHoveredNavItem(null)}
                    onClick={openSearch}
                    onFocus={() => setHoveredNavItem(item.label)}
                    onMouseEnter={() => setHoveredNavItem(item.label)}
                  >
                    {item.label}
                  </button>
                ),
              )}
            </div>
          </nav>
        </header>
      )}
    </>
  );
};

export default Header;
