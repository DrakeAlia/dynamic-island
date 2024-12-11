"use client";

import { useMemo, useState } from "react";
import { Ring } from "./components/ring";
import { Timer } from "./components/timer";
import { motion, AnimatePresence } from "framer-motion";

// Define type for animation variant keys used in transitions
type VariantKey = keyof typeof BOUNCE_VARIANTS;

export default function DynamicIslandStarter() {
  // State for managing which component is currently displayed (idle/ring/timer)
  const [view, setView] = useState("idle");
  // State for managing which animation variant to use during transitions
  const [variantKey, setVariantKey] = useState<VariantKey>("idle");

  // Memoized content selection based on current view
  // Prevents unnecessary re-renders when state doesn't change
  const content = useMemo(() => {
    switch (view) {
      case "ring":
        return <Ring />;
      case "timer":
        return <Timer />;
      case "idle":
        return <div className="h-7" />; // Empty div for idle state
    }
  }, [view]);

  return (
    // Main container with full viewport height
    <div className="min-h-screen flex flex-col">
      {/* Top section that contains the Dynamic Island */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          {/* Main Dynamic Island container with animations */}
          <motion.div
            layout // Enables automatic layout animations
            transition={{
              type: "spring",
              bounce: BOUNCE_VARIANTS[variantKey], // Dynamic bounce effect based on state
            }}
            style={{ borderRadius: 32 }}
            className="mx-auto w-fit min-w-[100px] overflow-hidden rounded-full bg-black"
          >
            {/* Inner container for content animations */}
            <motion.div
              transition={{
                type: "spring",
                bounce: BOUNCE_VARIANTS[variantKey],
              }}
              // Initial state of the animation
              initial={{
                scale: 0.9,
                opacity: 0,
                filter: "blur(5px)",
                originX: 0.5,
                originY: 0.5,
              }}
              // Animation target state
              animate={{
                scale: 1,
                opacity: 1,
                filter: "blur(0px)",
                originX: 0.5,
                originY: 0.5,
                transition: {
                  delay: 0.05,
                },
              }}
              key={view} // Key changes trigger re-animation
            >
              {content}
            </motion.div>
          </motion.div>

          {/* Absolute positioned container for additional animations */}
          <div className="pointer-events-none absolute left-1/2 top-0 flex h-[200px] w-[300px] -translate-x-1/2 items-start justify-center">
            {/* Handles enter/exit animations for components */}
            <AnimatePresence
              mode="popLayout"
              custom={ANIMATION_VARIANTS[variantKey]}
            >
              <motion.div
                initial={{ opacity: 0 }}
                exit="exit"
                variants={variants}
                key={view}
              >
                {content}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom section containing control buttons */}
      <div className="flex-1 flex items-start justify-center">
        <div className="flex justify-center gap-4">
          {/* Map through available states to create buttons */}
          {["idle", "ring", "timer"].map((v) => (
            <button
              type="button"
              className="rounded-full capitalize w-32 h-10 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300/50 hover:bg-gray-50"
              onClick={() => {
                setView(v); // Update current view
                const newKey = `${view}-${v}` as VariantKey; // Create transition key from current to new state
                setVariantKey(newKey);
              }}
              key={v}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Define exit animation behavior
const variants = {
  exit: (transition: { scale: number; y?: number; bounce: number }) => {
    return {
      ...transition,
      opacity: [1, 0],
      filter: "blur(5px)",
    };
  },
};

// Define specific animation properties for each state transition
const ANIMATION_VARIANTS = {
  idle: {
    scale: 1,
    bounce: 0.5,
  },
  "idle-timer": {
    scale: 1.4,
    y: 7.5,
    bounce: 0.3,
  },
  "idle-ring": {
    scale: 1.1,
    bounce: 0.5,
  },
  "ring-idle": {
    scale: 0.9,
    scaleX: 0.9,
    bounce: 0.5,
  },
  "timer-ring": {
    scale: 0.7,
    y: -7.5,
    bounce: 0.35,
  },
  "ring-timer": {
    scale: 1.4,
    y: 7.5,
    bounce: 0.35,
  },
  "timer-idle": {
    scale: 0.7,
    y: -7.5,
    bounce: 0.3,
  },
};

// Define bounce animation values for each state transition
const BOUNCE_VARIANTS = {
  idle: 0.5,
  "ring-idle": 0.5,
  "timer-ring": 0.35,
  "ring-timer": 0.35,
  "timer-idle": 0.3,
  "idle-timer": 0.3,
  "idle-ring": 0.5,
};
