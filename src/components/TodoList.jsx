"use client";

import Checkbox from "@mui/material/Checkbox";
import { useTask } from "@/context/TaskContext";
import { Trash2 } from "lucide-react";

/**
 * Formats a date and time string into a user-friendly relative format.
 * (e.g., "Today, 10:30 AM", "Yesterday, 09:15 PM", or "09 May 2026, 14:00")
 */
export const formatDate = (dateString, timeString) => {
  if (!dateString || !timeString) return "";

  try {
    // Normalize timeString (supports both "10:30 AM" and "22:30" formats)
    let isoTime = timeString;
    if (timeString.includes("AM") || timeString.includes("PM")) {
      const [time, modifier] = timeString.split(" ");
      let [hours, minutes] = time.split(":");
      if (hours === "12") hours = "00";
      if (modifier === "PM") hours = parseInt(hours) + 12;
      isoTime = `${hours.toString().padStart(2, "0")}:${minutes}:00`;
    } else if (
      !timeString.includes(":00") &&
      timeString.split(":").length === 2
    ) {
      isoTime = `${timeString}:00`;
    }

    const inputDate = new Date(`${dateString}T${isoTime}`);
    if (isNaN(inputDate.getTime())) return `${dateString}, ${timeString}`;

    const now = new Date();
    const isToday = inputDate.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = inputDate.toDateString() === yesterday.toDateString();

    const displayTime = inputDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) return `Today, ${displayTime}`;
    if (isYesterday) return `Yesterday, ${displayTime}`;

    return `${inputDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}, ${displayTime}`;
  } catch (e) {
    return `${dateString}, ${timeString}`;
  }
};

/**
 * Maps task priority to theme-specific Tailwind classes.
 */
const getPriorityThemeClasses = (theme) => {
  switch (theme) {
    case "fire":
      return "text-amber-600 bg-amber-600/20";
    case "primary":
      return "text-primary dark:text-primary/80 bg-primary/15";
    case "secondary":
      return "text-secondary dark:text-secondary bg-secondary/15";
    default:
      return "text-text/60 bg-surface-highlight";
  }
};

const TodoList = ({ todos }) => {
  const { toggleTodo, updateStreak, deleteTodo, highlightedTodoId } = useTask();

  const handleToggle = (id, currentlyCompleted) => {
    toggleTodo(id);
    // Only trigger streak logic when completing a task
    if (!currentlyCompleted) {
      updateStreak();
    }
  };

  return (
    <ul className="mt-10 space-y-4 pb-20">
      {todos.map((todo) => (
        <li
          key={todo.id}
          id={`todo-${todo.id}`}
          className={`relative group flex flex-col sm:flex-row items-center justify-between py-4 px-5 rounded-lg bg-surface border border-border gap-7 sm:gap-0 transition-all duration-300 ${
            highlightedTodoId === todo.id
              ? "ring-2 ring-primary shadow-[0_0_15px_rgba(0,255,255,0.3)] scale-[1.02] z-20"
              : ""
          }`}
        >
          {/* Action: Delete Task */}
          <button
            onClick={() => deleteTodo(todo.id)}
            className="absolute -top-2 -right-2 p-2 bg-red-500 hover:bg-red-600 dark:bg-red-600/90 dark:hover:bg-red-600 transition-[background-color] duration-200 text-white rounded-full shadow-lg z-10 cursor-pointer"
            title="Delete task"
          >
            <Trash2 size={14} />
          </button>

          {/* Task Info & Completion Toggle */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-4">
            <Checkbox
              checked={todo.completed}
              onChange={() => handleToggle(todo.id, todo.completed)}
              sx={{
                color: "var(--text)",
                "&.Mui-checked": {
                  color: "var(--text-primary)",
                },
              }}
            />

            <div className="flex-1 min-w-0">
              <h3
                className={`text-lg text-center sm:text-left font-semibold ${
                  todo.completed ? "line-through text-text/40" : "text-text"
                }`}
              >
                {todo.title}
              </h3>

              <p
                className={`text-sm text-center sm:text-left mt-1 max-w-2xl ${
                  todo.completed ? "line-through text-text/40" : "text-text/60"
                }`}
              >
                {todo.description}
              </p>
            </div>
          </div>

          {/* Metadata: Priority & Timestamp */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex flex-col items-end gap-1">
              <p
                className={`py-2 px-3.5 rounded-lg text-xs font-semibold ${getPriorityThemeClasses(todo.theme)}`}
              >
                {todo.priority}
              </p>
            </div>
            <p className="text-xs text-text/60">
              {formatDate(todo.createdAt, todo.time)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
