"use client";

import Carousel from "@/components/ui/carousel";
import React from "react";

const Hero = () => {
    const slides = [
        {
            image: "/birthday/birthday-1.webp",
            title: "Capture Your Birthday Moments",
            description:
                "Celebrate life’s special milestones with beautifully captured birthday moments. Our professional photography preserves the laughter, joy, and emotions of your celebration so you can relive them for years to come.",
            buttons: [
                { label: "Book Session" },
                { label: "View Gallery" },
            ],
        },
        {
            image: "/birthday/birthday-2.webp",
            title: "Celebrate Every Moment",
            description:
                "From intimate family gatherings to vibrant birthday parties, we specialize in capturing every detail. Our studio and event photography ensures every smile, decoration, and memory is documented perfectly.",
            buttons: [{ label: "Explore Packages" }],
        },
        {
            image: "/birthday/birthday-3.webp",
            title: "Memories That Last Forever",
            description:
                "Every celebration deserves to be remembered. With creative lighting, professional editing, and a passion for storytelling, we turn your birthday moments into timeless photographs you'll treasure forever.",
            buttons: [{ label: "Contact Us" }],
        },
    ];

    return (
        <div className="w-full">
            <Carousel
                items={slides}
                height={650}
                subtitle="Capturing Life Through Our Lens"
            />
        </div>
    );
};

export default Hero;