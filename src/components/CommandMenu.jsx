"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useTask } from "@/context/TaskContext";
import { m, AnimatePresence } from "framer-motion";

/**
 * CommandMenu provides a global search modal accessible via Cmd+K / Ctrl+K.
 * Supports debounced search filtering and keyboard-driven task navigation.
 */
const CommandMenu = () => {
  const { isCommandMenuOpen, toggleCommandMenu, todos, highlightTodo } =
    useTask();
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const debounceTimer = useRef(null);

  /**
   * Debounced search logic to prevent performance issues with large todo lists.
   */
  useEffect(() => {
    if (!isCommandMenuOpen) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      const results = todos.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase()),
      );
      setFiltered(results);
      setSelectedIndex(0);
    }, 100);

    return () => clearTimeout(debounceTimer.current);
  }, [query, todos, isCommandMenuOpen]);

  /**
   * Navigates to the selected todo, highlights it, and closes the menu.
   */
  const handleSelect = (todo) => {
    highlightTodo(todo.id);
    toggleCommandMenu();
    setQuery("");

    // Smooth scroll to the target task after the modal overlay has cleared
    setTimeout(() => {
      const element = document.getElementById(`todo-${todo.id}`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  };

  /**
   * Keyboard listeners for list navigation and interaction.
   */
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filtered.length > 0 ? (prev + 1) % filtered.length : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filtered.length > 0
          ? (prev - 1 + filtered.length) % filtered.length
          : 0,
      );
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    } else if (e.key === "Escape") {
      toggleCommandMenu();
    }
  };

  return (
    <AnimatePresence>
      {isCommandMenuOpen && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[110] flex items-start justify-center pt-[5vh] md:pt-[15vh] px-4 md:px-0"
        >
          {/* Backdrop blur with dismissal click listener */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={toggleCommandMenu}
          />

          {/* Search Modal Container */}
          <m.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-[95%] md:max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col mx-auto max-h-[80vh]"
          >
            <div className="flex items-center px-4 py-4 border-b border-border gap-3">
              <Search size={20} className="text-text/40 shrink-0" />
              <input
                autoFocus
                className="flex-1 bg-transparent outline-none text-text text-base md:text-lg font-geist-sans min-w-0"
                placeholder="Search tasks..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Results List */}
            <div className="overflow-y-auto p-2 flex-1">
              {filtered.length > 0 ? (
                filtered.map((todo, idx) => (
                  <div
                    key={todo.id}
                    onClick={() => handleSelect(todo)}
                    className={`p-4 rounded-xl cursor-pointer flex justify-between items-center gap-4 transition-colors ${
                      idx === selectedIndex
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-surface-highlight border border-transparent"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-text truncate">
                        {todo.title}
                      </p>
                      <p className="text-sm text-text/60 truncate">
                        {todo.description}
                      </p>
                    </div>
                    <span className="text-[10px] md:text-xs font-mono px-2 py-1 rounded bg-surface-highlight text-text/60 shrink-0 self-start mt-1">
                      {todo.priority}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-text/40 font-mono text-sm">
                    No tasks found
                  </p>
                </div>
              )}
            </div>

            {/* Keyboard hints - Desktop only */}
            <div className="hidden md:flex px-4 py-2 bg-surface-highlight/50 border-t border-border justify-between items-center text-[10px] text-text/40 font-mono uppercase tracking-widest">
              <span>↑↓ to navigate</span>
              <span>Enter to select</span>
              <span>Esc to close</span>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default CommandMenu;
