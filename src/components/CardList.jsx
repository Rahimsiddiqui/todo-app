"use client";

import { LucideCloudLightning, CheckCircle, FlameIcon } from "lucide-react";
import { useTask } from "@/context/TaskContext";

/**
 * Maps task theme identifiers to their respective icon and subtitle Tailwind classes.
 */
const getThemeClasses = (theme) => {
  switch (theme) {
    case "primary":
      return {
        icon: "text-primary dark:text-primary/80",
        subtitle: "text-primary dark:text-primary/80",
      };
    case "secondary":
      return {
        icon: "text-secondary",
        subtitle: "text-secondary",
      };
    case "fire":
      return {
        icon: "text-amber-600",
        subtitle: "opacity-60",
      };
    default:
      return {
        icon: "",
        subtitle: "",
      };
  }
};

/**
 * CardList displays a dashboard overview of user progress (completion rate, streak, remaining tasks).
 * Automatically updates when the global TaskContext changes.
 */
const CardList = () => {
  const { todos, streak } = useTask();

  const completedTodos = todos.filter((todo) => todo.completed);
  const pendingTodos = todos.filter((todo) => !todo.completed);

  // Calculate current completion percentage
  const completionRate =
    todos.length > 0
      ? Math.round((completedTodos.length / todos.length) * 100)
      : 0;

  const cards = [
    {
      title: "Daily Score",
      value: completionRate,
      valueSub: "%",
      subtitle: `${completedTodos.length} tasks completed`,
      theme: "primary",
      icon: LucideCloudLightning,
    },
    {
      title: "Current Streak",
      value: streak.count,
      valueSub: streak.count <= 1 ? "day" : "days",
      subtitle:
        streak.count === 0
          ? "No streak yet — start now"
          : "Keep the momentum going",
      theme: "fire",
      icon: CheckCircle,
    },
    {
      title: "Tasks Completed",
      value: completedTodos.length,
      valueSub: `/${todos.length}`,
      subtitle: `${pendingTodos.length} tasks remaining`,
      theme: "secondary",
      icon: FlameIcon,
    },
  ];

  return (
    <ul className="flex flex-col md:flex-row gap-5 md:gap-8 w-full mt-15">
      {cards.map((card, idx) => {
        const theme = getThemeClasses(card.theme);

        return (
          <li
            key={idx}
            className="relative flex flex-col justify-center w-full px-6 py-6 border rounded-xl bg-surface border-border transition-[background-color] duration-300"
          >
            <h3 className="text-sm font-semibold uppercase font-mono text-text/60">
              {card.title}
            </h3>

            <div className="mt-3.75 mb-1.5">
              <p className="text-2xl font-semibold text-text font-geist-sans">
                {card.value}
                <span
                  className={`${card.valueSub === "days" || card.valueSub === "day" ? "ml-1" : "ml-0.5"} text-[0.9rem] text-text/60`}
                >
                  {card.valueSub}
                </span>
              </p>
            </div>

            <div className="absolute top-4 right-4">
              <card.icon className={`size-6 ${theme.icon}`} />
            </div>

            <span className={`text-[0.8rem] font-medium ${theme.subtitle}`}>
              {card.subtitle}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default CardList;
