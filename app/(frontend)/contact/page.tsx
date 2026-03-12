"use client";

import SectionLandingPage from "@/components/frontend/layout/sectionLandingPage";
import { Button, TextField } from "@mui/material";
import { Mail, MapPin, Phone } from "lucide-react";
import React from "react";
import { FacebookIcon, TelegramIcon, ThreadsIcon, TwitterIcon, WhatsappIcon } from "react-share";
import { motion } from "framer-motion";

const container = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const fadeUp = {
    hidden: {
        opacity: 0,
        y: 40,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut" as const,
        },
    },
};

const Contact = () => {
    return (
        <div>
            <SectionLandingPage
                title="Contact Us"
                desc="Have a question or want to book a session? We'd love to hear from you. Reach out and let's create beautiful memories together."
            />

            <div className="flex flex-col gap-10 px-6 py-12 md:px-12 lg:py-24">

                {/* Contact Info Cards */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-3"
                >
                    {[
                        { icon: Mail, text: "meskot@gmail.com" },
                        { icon: Phone, text: "+251 900 000 000" },
                        { icon: MapPin, text: "Addis Ababa, Ethiopia" },
                    ].map((item, i) => {
                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={i}
                                variants={fadeUp}
                                whileHover={{ scale: 1.03 }}
                                className="flex items-center gap-6 p-6 rounded-md border border-gray-300 bg-gray-100 transition"
                            >
                                <Icon className="text-gray-700" size={36} />

                                <div className="h-10 w-px bg-gray-300"></div>

                                <span className="text-lg md:text-xl font-serif tracking-wide text-gray-800">
                                    {item.text}
                                </span>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Map + Form */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-5"
                >

                    {/* Map */}
                    <motion.div
                        variants={fadeUp}
                        className="w-full h-100 rounded-md overflow-hidden"
                    >
                        <iframe
                            src="https://www.google.com/maps?q=Addis%20Ababa&output=embed"
                            width="100%"
                            height="100%"
                            loading="lazy"
                            className="border-0"
                        ></iframe>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        variants={fadeUp}
                        className="border border-gray-300 p-5 rounded-md flex w-full items-center flex-col gap-3"
                    >
                        <h1 className="text-3xl font-semibold text-blue-500 font-serif">
                            Get In Touch
                        </h1>

                        <hr className="h-1 w-full text-gray-300" />

                        <TextField label="Name" fullWidth />
                        <TextField label="Subject" fullWidth />
                        <TextField label="Message" multiline rows={4} fullWidth />

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full"
                        >
                            <Button variant="outlined" size="medium" fullWidth>
                                Send Message
                            </Button>
                        </motion.div>

                        <div className="w-full flex items-center justify-center gap-1 mt-5">
                            <hr className="h-1 text-gray-300 w-full" />
                            <span className="w-full text-base text-center">Follow Us</span>
                            <hr className="h-1 text-gray-300 w-full" />
                        </div>

                        {/* Social Icons */}
                        <div className="flex items-center gap-3 flex-wrap">
                            {[TelegramIcon, TwitterIcon, FacebookIcon, ThreadsIcon, WhatsappIcon].map((Icon, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.15 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="cursor-pointer"
                                >
                                    <Icon size={32} round />
                                </motion.div>
                            ))}
                        </div>

                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;