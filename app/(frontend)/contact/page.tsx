"use client";

import SectionLandingPage from "@/components/frontend/layout/sectionLandingPage";
import { Button, Divider, TextField } from "@mui/material";
import { Mail, MapPin, Phone } from "lucide-react";
import React from "react";
import { FacebookIcon, TelegramIcon, ThreadsIcon, TwitterIcon, WhatsappIcon } from "react-share";

const Contact = () => {
    return (
        <div>
            <SectionLandingPage
                title="Contact Us"
                desc="Have a question or want to book a session? We'd love to hear from you. Reach out and let's create beautiful memories together."
            />

            <div className="flex flex-col gap-10 px-6 py-12 md:px-12 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div className="flex items-center gap-6 p-6 rounded-md border border-gray-300 bg-gray-100 transition">

                        <Mail className="text-gray-700" size={36} />

                        <div className="h-10 w-px bg-gray-300"></div>

                        <span className="text-lg md:text-xl font-serif tracking-wide text-gray-800">
                            meskot@gmail.com
                        </span>

                    </div>

                    <div className="flex items-center gap-5 p-6 rounded-md border border-gray-300 bg-gray-100 transition">

                        <Phone className="text-gray-700" size={36} />

                        <div className="h-10 w-px bg-gray-300"></div>

                        <span className="text-lg md:text-xl font-serif tracking-wide text-gray-800">
                            +251 900 000 000
                        </span>

                    </div>

                    <div className="flex items-center gap-5 p-6 rounded-md border border-gray-300 bg-gray-100 transition">
                        <MapPin className="text-gray-700" size={36} />

                        <div className="h-10 w-px bg-gray-300"></div>

                        <span className="text-lg md:text-xl font-serif tracking-wide text-gray-800">
                            Addis Ababa, Ethiopia
                        </span>

                    </div>

                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                    <div className="w-full h-100 rounded-md overflow-hidden">
                        <iframe
                            src="https://www.google.com/maps?q=Addis%20Ababa&output=embed"
                            width="100%"
                            height="100%"
                            loading="lazy"
                            className="border-0"
                        ></iframe>
                    </div>

                    <div className="border border-gray-300 p-5 rounded-md flex w-full lg:flex-2 items-center flex-col gap-3">
                        <h1 className="text-3xl font-semibold text-blue-500 font-serif">Get In Touch</h1>

                        <hr className="h-1 w-full text-gray-300" />

                        <TextField label="Name" fullWidth />
                        <TextField label="Subject" fullWidth />
                        <TextField label="Message" multiline rows={4} fullWidth />
                        <Button variant="outlined" size="medium" fullWidth>Send Message</Button>

                        <div className="w-full flex items-center justify-center gap-1 mt-5">
                            <hr className="h-1 text-gray-300 w-full" />
                            <span className="w-full text-base text-center">Follow Us</span>
                            <hr className="h-1 text-gray-300 w-full" />
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <TelegramIcon size={32} round className="cursor-pointer" />
                            <TwitterIcon size={32} round className="cursor-pointer" />
                            <FacebookIcon size={32} round className="cursor-pointer" />
                            <ThreadsIcon size={32} round className="cursor-pointer" />
                            <WhatsappIcon size={32} round className="cursor-pointer" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;