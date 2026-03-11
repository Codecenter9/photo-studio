"use client";

import SectionLandingPage from "@/components/frontend/layout/sectionLandingPage";
import Gallery from "@/components/ui/gallery";
import ItemData from "@/data/imageList";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";

const FrontGallery = () => {
    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

    let cols = 3;

    if (isMobile) cols = 1;
    else if (isTablet) cols = 2;

    return (
        <div>
            <SectionLandingPage
                title="Our Gallery"
                desc="Explore a collection of beautiful moments we’ve captured — from weddings and engagements to unforgettable celebrations."
            />

            <div className="px-6 py-12 md:px-12 lg:py-24">
                <Gallery itemData={ItemData} cols={cols} gap={15} />
            </div>
        </div>
    );
};

export default FrontGallery;