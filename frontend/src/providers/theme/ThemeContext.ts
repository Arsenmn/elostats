import { createContext, useContext } from "react";

type ThemeContextType = {
  theme: "light" | "dark";
  toggleTheme: () => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  accentColor: "#3b82f6",
  setAccentColor: () => {},
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
