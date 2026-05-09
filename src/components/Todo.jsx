"use client";

import { useState } from "react";
import TodoList from "./TodoList";
import { useTask } from "@/context/TaskContext";

const tabs = ["all", "active", "completed"];

/**
 * Todo component manages task filtering logic and orchestrates the display of the Task list.
 */
const Todo = () => {
  const { todos } = useTask();
  const [filter, setFilter] = useState("all");

  // Client-side filtering logic based on completion status
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-6 mt-17">
      {/* Filtering Tabs */}
      <ul className="flex gap-8 items-center mb-6">
        {tabs.map((tab) => (
          <li
            key={tab}
            onClick={() => setFilter(tab)}
            className="relative cursor-pointer text-base font-mono font-medium"
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}

            {/* Visual indicator for the active filter */}
            {filter === tab && (
              <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-text rounded-full" />
            )}
          </li>
        ))}
      </ul>

      {/* Main Task List */}
      <TodoList todos={filteredTodos} />
    </div>
  );
};

export default Todo;
