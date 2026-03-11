"use client";

import React from "react";
import Gallery from "@/components/ui/gallery";
import ItemData from "@/data/imageList";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const Portfolio = () => {
    const itemdata = ItemData.slice(0, 8);

    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

    let cols = 3;

    if (isMobile) {
        cols = 1;
    } else if (isTablet) {
        cols = 2;
    }

    return (
        <div className="px-6 py-12 md:px-12 lg:py-24">
            <Gallery itemData={itemdata} cols={cols} gap={15} />
        </div>
    );
};

export default Portfolio;