"use client";

import { Menu, Plus, Search, X, Sun, Moon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTask } from "@/context/TaskContext";
import Link from "next/link";

/**
 * Navbar component providing navigation, theme switching, and search triggering.
 * Uses Tailwind responsive classes for instantaneous server-side rendering (SSR).
 */
const Navbar = () => {
  const { toggleModal, menuOpen, setMenuOpen, toggleCommandMenu } = useTask();
  const [theme, setTheme] = useState("light");

  // Keyboard shortcut listener: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        toggleCommandMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleCommandMenu]);

  // Synchronize theme with localStorage and document class
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <div className="relative z-50 flex flex-row min-w-screen justify-between items-center px-6 sm:px-8 py-4 md:py-3 bg-surface/80 transition-colors duration-300">
      <Link
        className="font-bold text-text text-xl min-[450px]:text-2xl hover:opacity-90 transition-opacity duration-300 relative z-50"
        href="/"
      >
        Nexus
      </Link>

      {/* Desktop View: Navigation & Search */}
      <div className="hidden md:flex flex-row items-center gap-6">
        <button
          onClick={toggleTheme}
          className="cursor-pointer p-2 rounded-xl hover:bg-surface-highlight transition-colors duration-300"
        >
          {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Global Search Trigger */}
        <div 
          className="relative cursor-pointer"
          onClick={toggleCommandMenu}
        >
          <input
            type="text"
            readOnly
            placeholder="Search tasks..."
            className="w-full border border-border rounded-full pr-4 pl-12.5 py-2.5 bg-surface-highlight/50 font-geist-sans text-text transition-[background-color] duration-300 cursor-pointer"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-text/60 dark:text-text-80" />
          <span className="absolute text-[11px] rounded-lg right-6 top-1/2 -translate-y-1/2 text-text/80 uppercase">
            Ctrl/Cmd + K
          </span>
        </div>

        <button
          onClick={toggleModal}
          className="cursor-pointer rounded-full text-text px-6 py-2 bg-cyan-400/90 hover:bg-cyan-400 dark:bg-cyan-600 dark:hover:bg-cyan-600/90 flex gap-2 items-center transition-[background-color] duration-300 font-geist-sans"
        >
          <Plus size={20} /> New Task
        </button>
      </div>

      {/* Mobile View: Toggles */}
      <div className="md:hidden relative z-50 flex flex-row gap-7 items-center">
        <button onClick={toggleTheme} className="cursor-pointer">
          {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button onClick={toggleMenu} className="cursor-pointer">
          {!menuOpen ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
