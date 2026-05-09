"use client";

import { createContext, useContext, useState, useEffect } from "react";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [highlightedTodoId, setHighlightedTodoId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [streak, setStreak] = useState({
    count: 0,
    lastActive: null,
  });

  /**
   * Initialize state from localStorage.
   * Runs once on mount to avoid hydration mismatches.
   */
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    } else {
      // Seed initial data for first-time users
      const initialTodos = [
        {
          id: 1,
          title: "Complete Portfolio Homepage",
          description: "Finish the responsive landing page design.",
          priority: "High",
          theme: "fire",
          completed: false,
          createdAt: "2026-05-09",
          time: "10:00 AM"
        }
      ];
      setTodos(initialTodos);
      localStorage.setItem("todos", JSON.stringify(initialTodos));
    }

    const savedStreak = localStorage.getItem("streak");
    if (savedStreak) {
      setStreak(JSON.parse(savedStreak));
    }
  }, []);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleCommandMenu = () => setIsCommandMenuOpen(!isCommandMenuOpen);

  /**
   * Briefly highlights a todo (e.g., after searching and navigating to it).
   */
  const highlightTodo = (id) => {
    setHighlightedTodoId(id);
    setTimeout(() => setHighlightedTodoId(null), 3000);
  };

  const addTodo = (todo) => {
    const newTodos = [todo, ...todos];
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const toggleTodo = (id) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const deleteTodo = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  /**
   * Logic to increment or reset the user's daily streak.
   * Only allows one increment per calendar day.
   */
  const updateStreak = () => {
    const today = new Date().toISOString().split("T")[0];
    const newStreak = { ...streak };

    if (streak.lastActive === today) return; 

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    // If active yesterday, increment. Otherwise, start/restart at 1.
    if (streak.lastActive === yesterdayStr) {
      newStreak.count += 1;
    } else {
      newStreak.count = 1;
    }

    newStreak.lastActive = today;
    setStreak(newStreak);
    localStorage.setItem("streak", JSON.stringify(newStreak));
  };

  const resetStreak = () => {
    const freshStreak = { count: 0, lastActive: null };
    setStreak(freshStreak);
    localStorage.setItem("streak", JSON.stringify(freshStreak));
  };

  return (
    <TaskContext.Provider
      value={{
        todos,
        setTodos,
        isModalOpen,
        toggleModal,
        isCommandMenuOpen,
        toggleCommandMenu,
        highlightedTodoId,
        highlightTodo,
        addTodo,
        toggleTodo,
        deleteTodo,
        streak,
        setStreak,
        updateStreak,
        resetStreak,
        menuOpen,
        setMenuOpen,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => useContext(TaskContext);
