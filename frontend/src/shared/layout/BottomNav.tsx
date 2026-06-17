import { Link } from "react-router";
import { navItems } from "./consts/navItems";
import { NavItemContent } from "./NavItemContent";
import { useState } from "react";

interface BottomNavProps {
  onOpenSearch: () => void;
}

export function BottomNav({ onOpenSearch }: BottomNavProps) {
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null);

  const navItemClassName = (id: string) =>
    `group relative flex h-11 shrink-0 items-center overflow-hidden text-[13px] font-black uppercase tracking-[0.08em] no-underline transition-[width,color,background-color] duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[#dfff22]/45 ${
      hoveredNavItem === id
        ? "w-40 bg-[#05070d] text-[#dfff22]"
        : hoveredNavItem
          ? "w-11 text-[#05070d]"
          : "w-11 text-[#dbe7ff] hover:text-white"
    }`;

  const handleSearchClick = () => {
    setHoveredNavItem(null);
    onOpenSearch();
  };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 overflow-hidden border-t border-[#29324a] bg-[#05070d]/88 backdrop-blur-xl"
      onMouseLeave={() => setHoveredNavItem(null)}
    >
      <div
        className={`pointer-events-none absolute inset-0 origin-bottom bg-[#dfff22] transition-transform duration-300 ease-out ${
          hoveredNavItem ? "scale-y-100" : "scale-y-0"
        }`}
      />

      <div className="relative flex h-14 w-full items-center justify-center overflow-x-auto px-3 transition-colors sm:h-16">
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
                  icon={<item.Icon className="h-5 w-5" />}
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
                onClick={handleSearchClick}
                onFocus={() => setHoveredNavItem(item.id)}
                onMouseEnter={() => setHoveredNavItem(item.id)}
              >
                <NavItemContent
                  icon={<item.Icon className="h-5 w-5" />}
                  isVisible={hoveredNavItem === item.id}
                  label={item.label}
                />
              </button>
            ),
          )}
        </div>
      </div>
    </nav>
  );
}
