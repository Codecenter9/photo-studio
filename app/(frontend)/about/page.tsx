"use client";

import SectionLandingPage from '@/components/frontend/layout/sectionLandingPage'
import React from 'react'
import { motion } from "framer-motion";

const container = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.25,
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

const About = () => {
    return (
        <div>
            <SectionLandingPage
                title="About Us"
                desc="Have a question or want to book a session? We'd love to hear from you. Reach out and let's create beautiful memories together."
            />

            <motion.div
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-col gap-6 px-6 py-12 md:px-12 lg:py-24 max-w-4xl mx-auto text-gray-700 leading-relaxed"
            >
                <motion.p variants={fadeUp}>
                    Our studio is dedicated to capturing life’s most meaningful moments through
                    creative and high-quality photography. We believe every photo tells a story,
                    and our goal is to preserve those memories in a way that feels natural,
                    authentic, and timeless.
                </motion.p>

                <motion.p variants={fadeUp}>
                    With experience in wedding, birthday, family, and portrait photography,
                    our team focuses on blending artistic vision with professional techniques.
                    We work closely with our clients to understand their style and create
                    images that truly reflect their personalities and special moments.
                </motion.p>

                <motion.p variants={fadeUp}>
                    Whether you are celebrating a milestone, documenting family memories,
                    or planning a special event, our studio is committed to delivering
                    beautiful photographs that you will cherish for years to come.
                </motion.p>
            </motion.div>
        </div>
    )
}

export default About