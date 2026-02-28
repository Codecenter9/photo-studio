"use client";

import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

interface ReusableTabsProps {
    labels?: string[];
    contents?: React.ReactNode[];
    defaultValue?: number;
    maxWidth?: number | string;
}

export default function ReusableTabs({
    labels,
    contents,
    defaultValue = 0,
    maxWidth = "100%",
}: ReusableTabsProps) {
    const [value, setValue] = React.useState(defaultValue);

    const handleChange = (
        event: React.SyntheticEvent,
        newValue: number
    ) => {
        setValue(newValue);
    };

    if (labels?.length !== contents?.length) {
        console.warn("Labels and contents length mismatch.");
    }

    return (
        <Box sx={{ width: maxWidth, bgcolor: "background.paper" }}>
            <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
            >
                {labels?.map((label) => (
                    <Tab key={label} label={label} />
                ))}
            </Tabs>

            <Box sx={{ p: 2 }}>
                {contents?.[value]}
            </Box>
        </Box>
    );
}
