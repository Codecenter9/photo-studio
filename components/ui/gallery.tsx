"use client";

import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Image from "next/image";
import { IconButton, ImageListItemBar } from "@mui/material";
import { Info } from "lucide-react";
import { motion } from "framer-motion";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import Zoom from "yet-another-react-lightbox/plugins/zoom";
import FullscreenPlugin from "yet-another-react-lightbox/plugins/fullscreen";
import Video from "yet-another-react-lightbox/plugins/video";

interface GalleryItem {
    image: string;
    title: string;
    category: string;
    description?: string;
}

interface GalleryProps {
    itemData: GalleryItem[];
    cols?: number;
    gap?: number;
}

export default function Gallery({ itemData, cols = 3, gap = 12 }: GalleryProps) {
    const [activeCategory, setActiveCategory] = useState("all");
    const [index, setIndex] = useState(-1);

    const categories = useMemo(() => {
        const unique = Array.from(new Set(itemData.map((item) => item.category)));
        return ["all", ...unique];
    }, [itemData]);

    const filteredItems = useMemo(() => {
        if (activeCategory === "all") return itemData;
        return itemData.filter((item) => item.category === activeCategory);
    }, [activeCategory, itemData]);

    const slides = filteredItems.map((item) => ({
        src: item.image,
    }));

    const fadeUp = {
        hidden: {
            opacity: 0,
            y: 40,
        },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.07,
                duration: 0.45,
                ease: "easeOut" as const,
            },
        }),
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Stack
                direction="row"
                spacing={1}
                sx={{
                    mb: 4,
                    overflowX: "auto",
                    flexWrap: "nowrap",
                    justifyContent: "flex-start",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                }}
            >
                {categories.map((category) => (
                    <Button
                        key={category}
                        variant={activeCategory === category ? "contained" : "outlined"}
                        onClick={() => setActiveCategory(category)}
                        sx={{
                            textTransform: "capitalize",
                            borderRadius: "30px",
                            px: 3,
                            py: 0.2,
                            fontWeight: 500,
                            flexShrink: 0,
                        }}
                    >
                        {category}
                    </Button>
                ))}
            </Stack>

            <ImageList variant="masonry" cols={cols} gap={gap}>
                {filteredItems.map((item, i) => (
                    <motion.div
                        key={i}
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        custom={i}
                    >
                        <ImageListItem
                            onClick={() => setIndex(i)}
                            sx={{
                                overflow: "hidden",
                                borderRadius: 0.5,
                                position: "relative",
                                cursor: "pointer",
                                "&:hover .gallery-image": {
                                    transform: "scale(1.1)",
                                },
                                "&:hover .overlay": {
                                    opacity: 0.3,
                                },
                            }}
                        >
                            <Box
                                className="overlay"
                                sx={{
                                    position: "absolute",
                                    inset: 0,
                                    background:
                                        "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.25))",
                                    transition: "all 0.3s ease",
                                    zIndex: 1,
                                }}
                            />

                            <Image
                                className="gallery-image"
                                src={item.image}
                                alt={item.title}
                                width={500}
                                height={500}
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    objectFit: "cover",
                                    transition: "transform 0.5s ease",
                                }}
                                loading="lazy"
                            />

                            <ImageListItemBar
                                title={item.title}
                                actionIcon={
                                    <IconButton
                                        sx={{ color: "rgba(255,255,255,0.7)" }}
                                        aria-label={`info about ${item.title}`}
                                    >
                                        <Info />
                                    </IconButton>
                                }
                            />
                        </ImageListItem>
                    </motion.div>
                ))}
            </ImageList>

            <Lightbox
                open={index >= 0}
                close={() => setIndex(-1)}
                index={index}
                slides={slides}
                plugins={[Zoom, FullscreenPlugin, Video]}
            />
        </Box>
    );
}