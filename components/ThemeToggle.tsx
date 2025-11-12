"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <Button 
    variant={'outline'}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="px-4 py-2 rounded  bg-gray-100 cursor-pointer  dark:bg-gray-800 text-black dark:text-white"
    >
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </Button>
  );
}
