"use client";

import React from "react";
import { motion } from "framer-motion";

const CTA = () => {
    const backgroundImage = "/birthday/birthday-1.webp";

    return (
        <div
            className="relative flex items-center justify-center text-center px-6 md:px-12 lg:px-20 py-20 min-h-[400px]"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
            }}
        >
            <div className="absolute inset-0 bg-black/60"></div>

            <motion.div
                className="relative z-10 max-w-3xl text-white flex flex-col gap-6"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <motion.h2
                    className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    Capture Your Special Moments
                </motion.h2>

                <motion.p
                    className="text-base md:text-lg font-light leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    Every birthday is a story worth remembering. Our studio
                    captures genuine smiles, joyful celebrations, and the
                    emotions that make your special day unforgettable.
                    Let us turn your moments into timeless memories.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                >
                    <button className="cursor-pointer px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition">
                        Book Your Session
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default CTA;