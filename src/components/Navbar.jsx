"use client";

import { Menu, Plus, Search, X, Sun, Moon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [sheetOffset, setSheetOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const inputRef = useRef(null);
  const dragStartY = useRef(0);
  const currentDragY = useRef(0);

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputRef]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";

    setTheme(savedTheme);

    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    setSheetOffset(0);
    currentDragY.current = 0;
    setIsDragging(false);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    setSheetOffset(0);
    currentDragY.current = 0;
    setIsDragging(false);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    setTheme(newTheme);

    localStorage.setItem("theme", newTheme);

    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleDragStart = (event) => {
    setIsDragging(true);
    dragStartY.current = event.clientY;
    currentDragY.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleDragMove = (event) => {
    if (!isDragging) return;

    const delta = Math.max(0, event.clientY - dragStartY.current);
    currentDragY.current = delta;
    setSheetOffset(delta);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);

    if (currentDragY.current > 120) {
      closeMenu();
      return;
    }

    setSheetOffset(0);
    currentDragY.current = 0;
  };

  return (
    <div className="relative z-50 flex flex-row min-w-screen justify-between items-center px-6 sm:px-8 py-4 md:py-3 bg-surface/80 transition-colors duration-300">
      <Link
        className="font-bold text-text text-xl min-[450px]:text-2xl hover:opacity-90 transition-opacity duration-300 relative z-50"
        href="/"
      >
        Nexus
      </Link>

      {!isMobile ? (
        <>
          <div className="flex flex-row items-center gap-6">
            <li
              onClick={toggleTheme}
              className="cursor-pointer p-2 rounded-xl hover:bg-surface-highlight transition-colors duration-300"
            >
              {theme === "light" ? (
                <Sun size={isMobile ? 18 : 20} />
              ) : (
                <Moon size={isMobile ? 18 : 20} />
              )}
            </li>

            <div className="relative">
              <input
                type="text"
                ref={inputRef}
                placeholder="Search tasks..."
                className="w-full border border-border rounded-full pr-4 pl-12.5 py-2.5 bg-surface-highlight/50 text-text transition-[background-color] duration-300"
              />

              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-text/60 dark:text-text-80" />

              <span className="absolute text-[11px] rounded-lg right-6 top-1/2 -translate-y-1/2 text-text/80 uppercase">
                Ctrl/Cmd + K
              </span>
            </div>

            <button className="cursor-pointer rounded-full text-text px-6 py-2 bg-cyan-400/90 hover:bg-cyan-400 dark:bg-cyan-600 dark:hover:bg-cyan-600/90 flex gap-2 items-center transition-[background-color] duration-300">
              <Plus size={20} /> New Task
            </button>
          </div>
        </>
      ) : (
        <ul className="relative z-50 flex flex-row gap-7">
          <li onClick={toggleTheme}>
            {theme === "light" ? (
              <Sun size={isMobile ? 18 : 20} />
            ) : (
              <Moon size={isMobile ? 18 : 20} />
            )}
          </li>
          <li onClick={toggleMenu}>
            {!menuOpen ? (
              <Menu size={isMobile ? 18 : 20} />
            ) : (
              <X size={isMobile ? 18 : 20} />
            )}
          </li>
        </ul>
      )}

      {isMobile && (
        <>
          <div
            onClick={closeMenu}
            className={`fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px] transition-opacity duration-300 ${
              menuOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          />

          <div
            className={`fixed bottom-0 left-0 z-50 w-full transition-all duration-300 ${
              menuOpen
                ? "opacity-100 pointer-events-auto"
                : "translate-y-full opacity-0 pointer-events-none"
            }`}
            style={{
              transform: menuOpen
                ? `translateY(${sheetOffset}px)`
                : "translateY(100%)",
              transitionProperty: isDragging ? "none" : "transform, opacity",
            }}
          >
            <div className="relative z-50 bg-surface border-t border-border rounded-t-3xl px-6 py-8 flex flex-col gap-7 h-[70vh] justify-center items-center">
              <div
                className="absolute left-0 right-0 top-3 z-50 w-full flex justify-center touch-none"
                onPointerDown={handleDragStart}
                onPointerMove={handleDragMove}
                onPointerUp={handleDragEnd}
                onPointerCancel={handleDragEnd}
              >
                <div className="w-14 h-1.5 rounded-full bg-surface-highlight" />
              </div>

              <div className="relative w-full">
                <input
                  type="text"
                  ref={inputRef}
                  placeholder="Search tasks..."
                  className="w-full border border-border rounded-full pr-4 pl-12 py-3 bg-surface-highlight/50 text-text"
                />

                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-text/60" />
              </div>

              <button className="cursor-pointer rounded-full text-text px-6 py-3 bg-cyan-400/90 hover:bg-cyan-400 dark:bg-cyan-600 dark:hover:bg-cyan-600/90 flex gap-2 items-center justify-center transition-[background-color] duration-300 w-full">
                <Plus size={20} />
                New Task
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
