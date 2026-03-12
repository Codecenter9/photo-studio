"use client";

import AnimatedShapes from "@/components/ui/animatedShape";
import Carousel from "@/components/ui/carousel";
import { ChevronRight } from "lucide-react";
import React from "react";
import { motion, Variants } from "framer-motion";

const Features = () => {
    const birthdayShots = [
        { image: "/birthday/birthday-1.webp" },
        { image: "/birthday/birthday-2.webp" },
        { image: "/birthday/birthday-3.webp" },
    ];

    const weddingShots = [
        { image: "/wedding/wedding-1.webp" },
        { image: "/wedding/wedding-2.webp" },
        { image: "/wedding/wedding-3.webp" },
    ];

    const familyShots = [
        { image: "/family/family-1.webp" },
        { image: "/family/family-2.webp" },
        { image: "/family/family-3.webp" },
    ];

    const textVariant: Variants = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.7,
                ease: "easeOut",
            },
        },
    };

    const imageVariant: Variants = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.7,
                ease: "easeOut",
            },
        },
    };

    return (
        <div className="relative px-6 py-12 md:px-12 lg:py-24">
            <AnimatedShapes />

            <div className="flex flex-col bg-gray-50 gap-12 items-center border p-3 md:p-6 lg:p-8 border-gray-300 rounded-md shadow-sm">

                <div className="flex flex-col lg:flex-row gap-8 w-full items-center">

                    <motion.div
                        variants={textVariant}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="flex flex-col flex-1 gap-4"
                    >
                        <span className="text-lg md:text-xl lg:text-2xl font-serif font-semibold">
                            Birthday Shots
                        </span>

                        <p className="text-base md:text-lg font-extralight font-serif leading-relaxed max-w-prose text-gray-700">
                            Celebrate every special moment with high-quality birthday photography.
                            Our professional photographers capture the laughter, joy, and tiny details
                            of your celebration so that you can relive these memories forever.
                        </p>

                        <motion.span
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-3 group cursor-pointer mt-3 bg-gray-700 w-max px-4 py-2 rounded-md font-serif text-gray-200 hover:bg-gray-600 hover:text-white transition-all duration-300"
                        >
                            View More
                            <ChevronRight
                                size={18}
                                className="group-hover:translate-x-1 transition-transform duration-300"
                            />
                        </motion.span>
                    </motion.div>

                    <motion.div
                        variants={imageVariant}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="w-full flex items-center justify-center flex-1 overflow-hidden rounded-sm shadow-sm"
                    >
                        <div className="w-full">
                            <Carousel items={birthdayShots} height={350} />
                        </div>
                    </motion.div>
                </div>

                {/* Wedding */}
                <div className="flex flex-col lg:flex-row-reverse gap-8 w-full items-center">

                    <motion.div
                        variants={textVariant}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="flex flex-col flex-1 gap-4"
                    >
                        <span className="text-lg md:text-xl lg:text-2xl font-serif font-semibold">
                            Wedding Shots
                        </span>

                        <p className="text-base md:text-lg font-extralight font-serif leading-relaxed max-w-prose text-gray-700">
                            Capture the elegance and emotions of your wedding day with timeless
                            photography. From intimate moments to grand celebrations, we create
                            stunning images that preserve the beauty of your love story.
                        </p>

                        <motion.span
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-3 group cursor-pointer mt-3 bg-gray-700 w-max px-4 py-2 rounded-md font-serif text-gray-200 hover:bg-gray-600 hover:text-white transition-all duration-300"
                        >
                            View More
                            <ChevronRight
                                size={18}
                                className="group-hover:translate-x-1 transition-transform duration-300"
                            />
                        </motion.span>
                    </motion.div>

                    <motion.div
                        variants={imageVariant}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="flex items-center justify-center flex-1 overflow-hidden rounded-sm shadow-sm w-full"
                    >
                        <div className="w-full">
                            <Carousel items={weddingShots} height={350} />
                        </div>
                    </motion.div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 w-full items-center">

                    <motion.div
                        variants={textVariant}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="flex flex-col flex-1 gap-4"
                    >
                        <span className="text-lg md:text-xl lg:text-2xl font-serif font-semibold">
                            Family Shots
                        </span>

                        <p className="text-base md:text-lg font-extralight font-serif leading-relaxed max-w-prose text-gray-700">
                            Family moments are priceless. Our family photography captures warmth,
                            connection, and authentic emotions, creating beautiful memories you
                            will cherish for generations.
                        </p>

                        <motion.span
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-3 group cursor-pointer mt-3 bg-gray-700 w-max px-4 py-2 rounded-md font-serif text-gray-200 hover:bg-gray-600 hover:text-white transition-all duration-300"
                        >
                            View More
                            <ChevronRight
                                size={18}
                                className="group-hover:translate-x-1 transition-transform duration-300"
                            />
                        </motion.span>
                    </motion.div>

                    <motion.div
                        variants={imageVariant}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="flex items-center justify-center flex-1 overflow-hidden rounded-sm shadow-sm w-full"
                    >
                        <div className="w-full">
                            <Carousel items={familyShots} height={350} />
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
};

export default Features;