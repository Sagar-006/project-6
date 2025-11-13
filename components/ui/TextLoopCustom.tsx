"use client";
import { TextLoop } from "./TextLoop";

export function TextLoopCustomVariantsTransition() {
  return (
    <p className="inline-flex whitespace-pre-wrap text-xl md:text-xl text-white font-semibold ">
      
      <TextLoop
        className="overflow-y-clip ml-2 text-purple-400 text-4xl "
        transition={{
          type: "spring",
          stiffness: 900,
          damping: 80,
          mass: 10,
          
        }}
        variants={{
          initial: {
            y: 20,
            rotateX: 90,
            opacity: 0,
            filter: "blur(4px)",
          },
          animate: {
            y: 0,
            rotateX: 0,
            opacity: 1,
            filter: "blur(0px)",
          },
          exit: {
            y: -20,
            rotateX: -90,
            opacity: 0,
            filter: "blur(3px)",
          },
        }}
        
      >
        <span>Beat</span>
        <span>Vibe</span>
        <span>Sound</span>
        <span>Rhythm</span>
      </TextLoop >
    </p>
  );
}
