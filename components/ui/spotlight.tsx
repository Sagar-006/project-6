"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useEffect } from "react";

export function Spotlight({
  children,
  color = "#00FFFF",
  intensity = 0.5,
  className = "",
}: {
  children?: React.ReactNode;
  color?: string;
  intensity?: number;
  className?: string;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 150, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 30 });

  const background = useMotionTemplate`
    radial-gradient(
      400px circle at ${springX}px ${springY}px,
      ${color},
      transparent ${intensity * 100}%
    )
  `;

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{ backgroundImage: background }}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}
