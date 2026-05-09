"use client";

import { createContext, useContext, useState, useEffect } from "react";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [streak, setStreak] = useState({ count: 0, lastActive: null });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [highlightedTodoId, setHighlightedTodoId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Hydrate state from localStorage on mount
  useEffect(() => {
    try {
      const savedTodos = localStorage.getItem("todos");
      if (savedTodos) {
        setTodos(JSON.parse(savedTodos));
      } else {
        const initialTodos = [
          {
            id: 1,
            title: "Give water to plants and sleep",
            description:
              "Give water to the plants and make sure to sleep at 10:30 PM",
            priority: "High",
            theme: "fire",
            completed: false,
            createdAt: new Date().toISOString().split("T")[0],
            time: "10:00 AM",
          },
        ];
        setTodos(initialTodos);
      }

      const savedStreak = localStorage.getItem("streak");
      if (savedStreak) {
        setStreak(JSON.parse(savedStreak));
      }
    } catch (e) {
      console.error("Failed to hydrate TaskContext", e);
    }
  }, []);

  // Sync state to localStorage on changes
  useEffect(() => {
    if (todos.length > 0 || localStorage.getItem("todos")) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);

  useEffect(() => {
    if (streak.count > 0 || streak.lastActive || localStorage.getItem("streak")) {
      localStorage.setItem("streak", JSON.stringify(streak));
    }
  }, [streak]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleCommandMenu = () => setIsCommandMenuOpen(!isCommandMenuOpen);

  const highlightTodo = (id) => {
    setHighlightedTodoId(id);
    setTimeout(() => setHighlightedTodoId(null), 3000);
  };

  const addTodo = (todo) => {
    setTodos((prev) => [todo, ...prev]);
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const updateStreak = () => {
    const today = new Date().toISOString().split("T")[0];

    if (typeof streak?.lastActive === "string" && streak.lastActive === today) {
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    setStreak((prev) => {
      const newCount =
        typeof prev?.lastActive === "string" && prev.lastActive === yesterdayStr
          ? prev.count + 1
          : 1;

      return {
        count: newCount,
        lastActive: today,
      };
    });
  };

  const resetStreak = () => {
    setStreak({ count: 0, lastActive: null });
  };

  const updateTodos = (newTodos) => setTodos(newTodos);

  return (
    <TaskContext.Provider
      value={{
        todos,
        updateTodos,
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
