"use client";

import { TextField } from "@mui/material";
import { User, Camera, Image as ImageIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { animate, motion } from "framer-motion";

const Counter = ({ value }: { value: number }) => {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        const controls = animate(0, value, {
            duration: 2,
            onUpdate(v) {
                setDisplay(Math.floor(v));
            },
        });

        return () => controls.stop();
    }, [value]);

    return (
        <span className="flex items-center text-gray-500 text-4xl font-serif font-semibold">
            {display}
            <sub className="text-lg">+</sub>
        </span>
    );
};

const listContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const itemVariant = {
    hidden: {
        opacity: 0,
        x: -40,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut" as const,
        },
    },
};

const formVariant = {
    hidden: {
        opacity: 0,
        y: 50,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: "easeOut" as const,
        },
    },
};

const Contact = () => {
    const counters = [
        { count: 200, desc: "Happy Clients", icon: User },
        { count: 500, desc: "Photo Sessions", icon: Camera },
        { count: 3000, desc: "Total Shots", icon: ImageIcon },
    ];

    return (
        <div className="bg-gray-950/95 px-6 py-12 md:px-12 lg:py-24">
            <div className="border border-gray-800 rounded-md p-5 flex flex-col lg:flex-row items-center gap-5">

                {/* Counters */}
                <motion.ul
                    variants={listContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex w-full lg:flex-1 flex-col items-center gap-5"
                >
                    {counters.map((counter, index) => {
                        const Icon = counter.icon;

                        return (
                            <motion.li
                                key={index}
                                variants={itemVariant}
                                whileHover={{ scale: 1.03 }}
                                className="w-full bg-gray-950 border border-gray-800 rounded-md p-4 flex justify-between items-center gap-4"
                            >
                                <Counter value={counter.count} />

                                <div className="h-10 w-px bg-gray-800"></div>

                                <div className="flex flex-col text-gray-500 items-end gap-2">
                                    <Icon size={20} />
                                    <span className="text-lg font-serif font-light">
                                        {counter.desc}
                                    </span>
                                </div>
                            </motion.li>
                        );
                    })}
                </motion.ul>

                {/* Contact Form */}
                <motion.div
                    variants={formVariant}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="border border-gray-800 p-5 rounded-md flex w-full lg:flex-2 items-center flex-col gap-3"
                >
                    <h1 className="text-3xl font-semibold text-gray-500 font-serif">
                        Get In Touch
                    </h1>

                    <hr className="h-1 w-full text-gray-800" />

                    <TextField label="Name" fullWidth className="bg-gray-500 text-white" />
                    <TextField label="Subject" fullWidth className="bg-gray-500 text-white" />
                    <TextField
                        label="Message"
                        multiline
                        rows={4}
                        fullWidth
                        className="bg-gray-500 text-white"
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;