"use client";

import React from "react";
import { motion } from "framer-motion";

const AnimatedShapes = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Shape 1 – Large gradient blob with slow floating */}
            <motion.div
                className="absolute w-64 h-64 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-gradient-to-br from-purple-300/30 to-pink-300/30 blur-xl top-10 -left-20 z-0"
                animate={{
                    x: [0, 30, 0],
                    y: [0, -20, 0],
                    rotate: [0, 10, -5, 0],
                    borderRadius: [
                        "40% 60% 70% 30% / 40% 50% 60% 50%",
                        "50% 50% 50% 50% / 60% 40% 60% 40%",
                        "40% 60% 70% 30% / 40% 50% 60% 50%",
                    ],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                }}
            />

            {/* Shape 2 – Small glowing ring with orbiting dot */}
            <div className="absolute top-1/4 right-1/4 z-10">
                <motion.div
                    className="absolute w-16 h-16 border-2 border-blue-300/50 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute w-3 h-3 bg-cyan-300 rounded-full top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-sm"
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>

            {/* Shape 3 – Floating hexagon (using clip-path) with gradient */}
            <motion.div
                className="absolute w-20 h-20 bg-gradient-to-tr from-yellow-300/40 to-orange-300/40 bottom-1/3 left-10 z-20"
                style={{
                    clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                }}
                animate={{
                    y: [0, -25, 0],
                    rotate: [0, 15, -15, 0],
                }}
                transition={{
                    duration: 14,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "anticipate",
                }}
            />

            {/* Shape 4 – Pulsing dot cluster */}
            <div className="absolute bottom-10 right-10 flex gap-2">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-4 h-4 bg-indigo-400/60 rounded-full"
                        animate={{
                            y: [0, -15, 0],
                            scale: [1, 1.3, 1],
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 3 + i,
                            repeat: Infinity,
                            delay: i * 0.5,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* Shape 5 – Wavy line (thin rectangle with rotation) */}
            <motion.div
                className="absolute w-40 h-1 bg-gradient-to-r from-teal-300/50 to-transparent top-2/3 left-1/2 blur-[2px]"
                animate={{
                    x: [-50, 50, -50],
                    rotate: [0, 20, -20, 0],
                    scaleX: [1, 1.5, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "linear",
                }}
            />

            {/* Shape 6 – Twinkling star (small cross) */}
            <motion.div
                className="absolute w-3 h-3 bg-white/80 top-1/3 left-1/5 z-30"
                style={{
                    clipPath:
                        "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                }}
                animate={{
                    scale: [1, 1.6, 1],
                    opacity: [0.6, 1, 0.6],
                    rotate: [0, 180, 360],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Shape 7 – Soft blurred circle that drifts */}
            <motion.div
                className="absolute w-32 h-32 bg-purple-200/20 rounded-full blur-2xl bottom-1/4 right-1/5"
                animate={{
                    x: [0, 40, -20, 0],
                    y: [0, -30, 20, 0],
                    scale: [1, 1.2, 0.9, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                }}
            />
        </div>
    );
};

export default AnimatedShapes;