"use client";

import React, { useState } from "react";
import MuiCarousel from "react-material-ui-carousel";
import { Box, Button, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";

interface CarouselButton {
    label: string;
    onClick?: () => void;
    variant?: "primary" | "secondary";
}

interface CarouselItem {
    image: string;
    title?: string;
    description?: string;
    buttons?: CarouselButton[];
}

interface CarouselProps {
    items: CarouselItem[];
    subtitle?: string;
    height?: number;
}

const MotionTypography = motion(Typography);
const MotionStack = motion(Stack);

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
};

const Carousel: React.FC<CarouselProps> = ({ items, subtitle, height = 600 }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <MuiCarousel
            autoPlay
            swipe
            interval={4000}
            animation="fade"
            indicators
            onChange={(now) => {
                if (now !== undefined) {
                    setActiveIndex(now);
                }
            }}
        >
            {items.map((item, index) => {

                const isActive = index === activeIndex;

                return (
                    <Box
                        key={index}
                        sx={{
                            height,
                            width: "100%",
                            position: "relative",
                            backgroundImage: `url(${item.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >

                        {/* overlay */}
                        <Box
                            sx={{
                                position: "absolute",
                                inset: 0,
                                background: "rgba(0,0,0,0.5)"
                            }}
                        />

                        <MotionStack
                            spacing={3}
                            sx={{
                                position: "relative",
                                zIndex: 2,
                                maxWidth: 650,
                                paddingLeft: { xs: 4, md: 12 },
                                color: "white"
                            }}
                            initial="hidden"
                            animate={isActive ? "visible" : "hidden"}
                            variants={{
                                hidden: {},
                                visible: {
                                    transition: { staggerChildren: 0.25 }
                                }
                            }}
                        >

                            {/* subtitle */}
                            {subtitle && (
                                <MotionTypography
                                    variants={fadeUp}
                                    transition={{ duration: 0.6 }}
                                    sx={{
                                        fontFamily: `"Playfair Display", serif`,
                                        letterSpacing: "4px",
                                        textTransform: "uppercase",
                                        fontSize: "0.8rem",
                                        borderLeft: "3px solid white",
                                        paddingLeft: 1.5
                                    }}
                                >
                                    {subtitle}
                                </MotionTypography>
                            )}

                            {/* title */}
                            {item.title && (
                                <MotionTypography
                                    variant="h3"
                                    fontWeight={700}
                                    variants={fadeUp}
                                    transition={{ duration: 0.6 }}
                                    sx={{
                                        fontFamily: `"Playfair Display", serif`,
                                        lineHeight: 1.2
                                    }}
                                >
                                    {item.title}
                                </MotionTypography>
                            )}

                            {/* description */}
                            {item.description && (
                                <MotionTypography
                                    variants={fadeUp}
                                    transition={{ duration: 0.6 }}
                                    sx={{
                                        fontSize: "1.1rem",
                                        maxWidth: 500,
                                        opacity: 0.9
                                    }}
                                >
                                    {item.description}
                                </MotionTypography>
                            )}

                            {/* buttons */}
                            {item.buttons && (
                                <MotionStack
                                    direction="row"
                                    spacing={2}
                                    variants={fadeUp}
                                    transition={{ duration: 0.6 }}
                                >
                                    {item.buttons.map((btn, i) => (
                                        <Button
                                            key={i}
                                            onClick={btn.onClick}
                                            variant={btn.variant === "secondary" ? "outlined" : "contained"}
                                            sx={{
                                                px: 4,
                                                py: 1.2,
                                                borderRadius: "40px",
                                                textTransform: "none",
                                                fontWeight: 600,
                                                borderColor: "white",
                                                color: btn.variant === "secondary" ? "white" : "black",
                                                background:
                                                    btn.variant === "secondary"
                                                        ? "transparent"
                                                        : "linear-gradient(135deg,#ffffff,#dcdcdc)",
                                                transition: "all .3s",
                                                "&:hover": {
                                                    transform: "translateY(-3px)",
                                                    background:
                                                        btn.variant === "secondary"
                                                            ? "rgba(255,255,255,0.15)"
                                                            : "white",
                                                },
                                            }}
                                        >
                                            {btn.label}
                                        </Button>
                                    ))}
                                </MotionStack>
                            )}

                        </MotionStack>
                    </Box>
                );
            })}
        </MuiCarousel>
    );
};

export default Carousel;