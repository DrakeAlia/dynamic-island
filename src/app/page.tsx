"use client";

import { useMemo, useState } from "react";
import { Ring } from "./components/ring";
import { Timer } from "./components/timer";
import { motion, AnimatePresence } from "framer-motion";

type VariantKey = keyof typeof BOUNCE_VARIANTS;

export default function DynamicIslandStarter() {
  const [view, setView] = useState("idle");
  const [variantKey, setVariantKey] = useState<VariantKey>("idle");

  const content = useMemo(() => {
    switch (view) {
      case "ring":
        return <Ring />;
      case "timer":
        return <Timer />;
      case "idle":
        return <div className="h-7" />;
    }
  }, [view]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          <motion.div
            layout
            transition={{
              type: "spring",
              bounce: BOUNCE_VARIANTS[variantKey],
            }}
            style={{ borderRadius: 32 }}
            className="mx-auto w-fit min-w-[100px] overflow-hidden rounded-full bg-black"
          >
            <motion.div
              transition={{
                type: "spring",
                bounce: BOUNCE_VARIANTS[variantKey],
              }}
              initial={{
                scale: 0.9,
                opacity: 0,
                filter: "blur(5px)",
                originX: 0.5,
                originY: 0.5,
              }}
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
              key={view}
            >
              {content}
            </motion.div>
          </motion.div>

          <div className="pointer-events-none absolute left-1/2 top-0 flex h-[200px] w-[300px] -translate-x-1/2 items-start justify-center">
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

      {/* Bottom section with buttons */}
      <div className="flex-1 flex items-start justify-center">
        <div className="flex justify-center gap-4">
          {["idle", "ring", "timer"].map((v) => (
            <button
              type="button"
              className="rounded-full capitalize w-32 h-10 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300/50 hover:bg-gray-50"
              onClick={() => {
                setView(v);
                const newKey = `${view}-${v}` as VariantKey;
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

const variants = {
  exit: (transition: { scale: number; y?: number; bounce: number }) => {
    return {
      ...transition,
      opacity: [1, 0],
      filter: "blur(5px)",
    };
  },
};

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

const BOUNCE_VARIANTS = {
  idle: 0.5,
  "ring-idle": 0.5,
  "timer-ring": 0.35,
  "ring-timer": 0.35,
  "timer-idle": 0.3,
  "idle-timer": 0.3,
  "idle-ring": 0.5,
};
