"use client";

import * as React from "react";
import { AnimatePresence, motion, Transition, Variants } from "framer-motion";

interface TextLoopProps {
  children: React.ReactNode[];
  className?: string;
  interval?: number;
  variants?: Variants;
  transition?: Transition;
}

export const TextLoop = ({
  children,
  className,
  interval = 2000,
  variants,
  transition,
}: TextLoopProps) => {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % children.length);
    }, interval);
    return () => clearInterval(timer);
  }, [children.length, interval]);

  return (
    <span className={className}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
          className="inline-block"
        >
          {children[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};
