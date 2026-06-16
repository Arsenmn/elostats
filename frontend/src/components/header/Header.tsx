import { useMemo, useState } from "react";
import { useLocation, Link } from "react-router";
import {
  LogOut,
  Settings,
  LayoutDashboard,
  X,
  Search,
  Crown,
  ChartArea,
  GitCompareArrows,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../hooks/useAuth.hook";
import { useLogout } from "../../hooks/useLogout.hook";
import PlayerSearchCombobox from "../../modules/player-search/components/PlayerSearchCombobox";

const navItems = [
  { id: "search", label: "Search", icon: <Search className="h-5 w-5" /> },
  {
    id: "stats",
    label: "Analysis",
    icon: <ChartArea className="h-5 w-5" />,
    to: "/analysis",
  },
  {
    id: "compare",
    label: "Compare",
    icon: <GitCompareArrows className="h-5 w-5" />,
    to: "/compare",
  },
  {
    id: "leaderboards",
    label: "Leaderboards",
    icon: <Crown className="h-5 w-5" />,
    to: "/players",
  },
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
  const navItemClassName = (id: string) =>
    `group relative flex h-11 shrink-0 items-center overflow-hidden text-[13px] font-black uppercase tracking-[0.08em] no-underline transition-[width,color,background-color] duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[#dfff22]/45 ${
      hoveredNavItem === id
        ? "w-40 bg-[#05070d] text-[#dfff22]"
        : hoveredNavItem
          ? "w-11 text-[#05070d]"
          : "w-11 text-[#dbe7ff] hover:text-white"
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
              dropdownPlacement="top"
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
                    key={item.id}
                    to={item.to}
                    aria-label={item.label}
                    className={navItemClassName(item.id)}
                    onBlur={() => setHoveredNavItem(null)}
                    onFocus={() => setHoveredNavItem(item.id)}
                    onMouseEnter={() => setHoveredNavItem(item.id)}
                  >
                    <NavItemContent
                      icon={item.icon}
                      isVisible={hoveredNavItem === item.id}
                      label={item.label}
                    />
                  </Link>
                ) : (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={item.label}
                    className={navItemClassName(item.id)}
                    onBlur={() => setHoveredNavItem(null)}
                    onClick={openSearch}
                    onFocus={() => setHoveredNavItem(item.id)}
                    onMouseEnter={() => setHoveredNavItem(item.id)}
                  >
                    <NavItemContent
                      icon={item.icon}
                      isVisible={hoveredNavItem === item.id}
                      label={item.label}
                    />
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

function NavItemContent({
  icon,
  isVisible,
  label,
}: {
  icon: React.ReactNode;
  isVisible: boolean;
  label: string;
}) {
  return (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center transition-transform duration-300 ease-out group-hover:-translate-x-0.5">
        {icon}
      </span>
      <span
        className={`block overflow-hidden whitespace-nowrap text-[11px] font-black uppercase tracking-[0.08em] transition-[max-width,opacity,transform] duration-300 ease-out ${
          isVisible
            ? "max-w-28 translate-x-0 opacity-100"
            : "max-w-0 -translate-x-3 opacity-0"
        }`}
      >
        {label}
      </span>
    </>
  );
}

export default Header;
