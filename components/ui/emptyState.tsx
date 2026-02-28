"use client";

import React from "react";
import { LucideIcon, ImageOff } from "lucide-react";

interface EmptyStateProps {
    title?: string;
    description?: string;
    Icon?: LucideIcon;
}

const EmptyState = ({
    title = "No data found",
    description = "There is nothing to display here yet.",
    Icon = ImageOff,
}: EmptyStateProps) => {
    return (
        <div className="w-full flex flex-col items-center justify-center text-center 
                       rounded-md border border-gray-950 border-dashed shadow-sm 
                       p-12 transition-all duration-300">

            <div className="w-16 h-16 flex items-center justify-center 
                          bg-gray-100 rounded-full">
                <Icon className="w-8 h-8 text-gray-500" />
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {title}
            </h3>
            <p className="text-base text-gray-500 max-w-sm mb-6">
                {description}
            </p>
        </div>
    );
};

export default EmptyState;