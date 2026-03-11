"use client";

import React from "react";
import { motion } from "framer-motion";

interface SectionPropes {
    title?: string;
    desc?: string;
}

const SectionLandingPage = ({ title, desc }: SectionPropes) => {
    const backgroundImage = "/kids/kids-2.webp";

    return (
        <div
            className="relative flex items-center justify-start px-6 md:px-12 lg:px-20 py-20 min-h-100"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
            }}
        >
            <div className="max-w-2xl text-white">
                <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-bold mb-4"
                >
                    {title}
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-lg md:text-xl"
                >
                    {desc}
                </motion.p>
            </div>
        </div>
    );
};

export default SectionLandingPage;