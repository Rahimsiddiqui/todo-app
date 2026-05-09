"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTask } from "@/context/TaskContext";
import { m, AnimatePresence } from "framer-motion";

/**
 * Top Sheet Modal for creating new tasks.
 * Features: Overlay dismissal, scroll locking, ESC support, and auto-focus.
 */
const CreateTaskModal = () => {
  const { isModalOpen, toggleModal, addTodo } = useTask();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Med",
  });

  /**
   * Prevents background scrolling when the modal is active.
   */
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  /**
   * Accessibility: Close modal on ESC key press.
   */
  useEffect(() => {
    if (!isModalOpen) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") toggleModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isModalOpen, toggleModal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const now = new Date();

    // Explicitly format time as HH:MM AM/PM for cross-browser consistency
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const timeString = `${hours}:${minutes} ${ampm}`;

    const newTodo = {
      id: Date.now(),
      ...formData,
      completed: false,
      createdAt: now.toISOString().split("T")[0],
      time: timeString,
      // Map priority to theme identifiers
      theme:
        formData.priority === "High"
          ? "fire"
          : formData.priority === "Med"
            ? "primary"
            : "secondary",
    };

    addTodo(newTodo);
    setFormData({ title: "", description: "", priority: "Med" });
    toggleModal();
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col"
        >
          {/* Background overlay with blur and dimming */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={toggleModal}
          />

          {/* Slide-down/up sheet content */}
          <m.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full bg-surface border-b border-border p-8 shadow-2xl"
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl tracking-wide font-bold font-geist-sans text-text">
                  Create New Task
                </h2>
                <button
                  onClick={toggleModal}
                  className="p-2 hover:bg-surface-highlight cursor-pointer rounded-full transition-colors"
                >
                  <X size={24} className="text-text" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-60 text-text">
                    Title
                  </label>
                  <input
                    required
                    autoFocus
                    className="w-full bg-surface-highlight border border-border rounded-xl p-4 outline-none focus:border-primary text-text transition-colors"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-60 text-text">
                    Description
                  </label>
                  <textarea
                    className="w-full bg-surface-highlight border border-border rounded-xl p-4 h-32 outline-none focus:border-primary text-text transition-colors"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                {/* Priority Selector */}
                <div className="flex gap-4">
                  {["Low", "Med", "High"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: p })}
                      className={`px-6 py-2 cursor-pointer rounded-full border transition-all ${
                        formData.priority === p
                          ? "bg-primary dark:bg-primary/60 border-primary dark:border-primary/30 text-white"
                          : "border-border text-text hover:border-text/40"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-primary/95 hover:bg-primary dark:bg-primary/60 dark:hover:bg-primary/65 cursor-pointer text-white rounded-xl font-bold text-lg transition-[background-color]"
                >
                  Create Task
                </button>
              </form>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default CreateTaskModal;
