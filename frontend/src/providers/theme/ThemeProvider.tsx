import { useEffect, useMemo, useState } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import { ThemeContext } from "./ThemeContext";

const DEFAULT_ACCENT = "#3b82f6";

function restoreMode(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const v = localStorage.getItem("theme");
  return v === "dark" ? "dark" : "light";
}

function restoreAccent(): string {
  if (typeof window === "undefined") return DEFAULT_ACCENT;
  return localStorage.getItem("accentColor") ?? DEFAULT_ACCENT;
}

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<"light" | "dark">(restoreMode);
  const [accentColor, setAccentColorState] = useState<string>(restoreAccent);
  const [mounted, setMounted] = useState(false);

  const toggleTheme = () => setMode((p) => (p === "light" ? "dark" : "light"));

  const setAccentColor = (color: string) => setAccentColorState(color);

  const muiTheme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  useEffect(() => {
    localStorage.setItem("theme", mode);
    document.body.setAttribute("data-theme", mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem("accentColor", accentColor);
    document.body.style.setProperty("--accent", accentColor);
    // Derive a slightly transparent version for hover states
    document.body.style.setProperty("--accent-muted", accentColor + "26"); // 15% opacity
  }, [accentColor]);

  useEffect(() => {
    // Apply stored accent immediately on mount (before first render)
    document.body.style.setProperty("--accent", accentColor);
    document.body.style.setProperty("--accent-muted", accentColor + "26");
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme: mode, toggleTheme, accentColor, setAccentColor }}
    >
      <MuiThemeProvider theme={muiTheme}>
        {mounted && children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export { ThemeProvider };
