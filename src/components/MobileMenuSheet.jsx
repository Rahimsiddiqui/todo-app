"use client";

import { X, Search, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { useTask } from "@/context/TaskContext";

/**
 * MobileMenuSheet provides a slide-up menu for mobile devices.
 * Contains global search trigger and "New Task" action.
 */
const MobileMenuSheet = () => {
  const { menuOpen, setMenuOpen, toggleModal, toggleCommandMenu } = useTask();
  const [sheetOffset, setSheetOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const currentDragY = useRef(0);

  const closeMenu = () => {
    setMenuOpen(false);
    setSheetOffset(0);
    currentDragY.current = 0;
    setIsDragging(false);
  };

  /**
   * Drag-to-dismiss logic: Handles initial touch/pointer press.
   */
  const handleDragStart = (event) => {
    setIsDragging(true);
    dragStartY.current = event.clientY;
    currentDragY.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  /**
   * Drag-to-dismiss logic: Tracks downward movement.
   */
  const handleDragMove = (event) => {
    if (!isDragging) return;
    const delta = Math.max(0, event.clientY - dragStartY.current);
    currentDragY.current = delta;
    setSheetOffset(delta);
  };

  /**
   * Drag-to-dismiss logic: Finalizes or resets based on swipe distance.
   */
  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Dismiss if dragged down more than 120px
    if (currentDragY.current > 120) {
      closeMenu();
      return;
    }

    setSheetOffset(0);
    currentDragY.current = 0;
  };

  return (
    <div className="md:hidden">
      {/* Dimmed backdrop dismissal */}
      <div
        onClick={closeMenu}
        className={`fixed inset-0 z-[60] bg-black/35 backdrop-blur-[2px] transition-opacity duration-300 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Bottom Sheet Container */}
      <div
        className={`fixed bottom-0 left-0 z-[70] w-full transition-all duration-300 ${
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
        <div className="relative bg-surface border-t border-border rounded-t-3xl px-6 py-8 flex flex-col gap-7 h-[70vh] justify-center items-center">
          
          {/* Drag Handle (Visual and functional) */}
          <div
            className="absolute left-0 right-0 top-3 w-full flex justify-center touch-none"
            onPointerDown={handleDragStart}
            onPointerMove={handleDragMove}
            onPointerUp={handleDragEnd}
            onPointerCancel={handleDragEnd}
          >
            <div className="w-14 h-1.5 rounded-full bg-surface-highlight" />
          </div>

          {/* Search Trigger */}
          <div 
            className="relative w-full cursor-pointer"
            onClick={() => {
              closeMenu();
              toggleCommandMenu();
            }}
          >
            <input
              type="text"
              readOnly
              placeholder="Search tasks..."
              className="w-full border font-geist-sans border-border rounded-full pr-4 pl-12 py-3 bg-surface-highlight/50 text-text cursor-pointer"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-text/60" />
          </div>

          <button
            onClick={() => {
              closeMenu();
              toggleModal();
            }}
            className="cursor-pointer rounded-full text-text px-6 py-3 bg-cyan-400/90 hover:bg-cyan-400 dark:bg-cyan-600 dark:hover:bg-cyan-600/90 flex gap-2 items-center justify-center transition-[background-color] duration-300 w-full font-geist-sans"
          >
            <Plus size={20} />
            New Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenuSheet;
