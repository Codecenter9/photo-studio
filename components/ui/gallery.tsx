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

    const categories = useMemo(() => {
        const unique = Array.from(new Set(itemData.map((item) => item.category)));
        return ["all", ...unique];
    }, [itemData]);

    const filteredItems = useMemo(() => {
        if (activeCategory === "all") return itemData;
        return itemData.filter((item) => item.category === activeCategory);
    }, [activeCategory, itemData]);

    return (
        <Box sx={{ width: "100%" }}>
            <Stack
                direction="row"
                spacing={2}
                sx={{
                    mb: 4,
                    flexWrap: "wrap",
                    justifyContent: "center",
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
                        }}
                    >
                        {category}
                    </Button>
                ))}
            </Stack>

            <ImageList variant="masonry" cols={cols} gap={gap}>
                {filteredItems.map((item, index) => (
                    <ImageListItem
                        key={index}
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
                                background: "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.25))",
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
                                    sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                    aria-label={`info about ${item.title}`}
                                >
                                    <Info />
                                </IconButton>
                            }
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        </Box >
    );
}