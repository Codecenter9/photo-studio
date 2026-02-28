"use client";

import { useState, ReactNode } from "react";
import Button from "@mui/material/Button";

interface CollapsibleCardProps {
    title?: string;
    button?: string;
    clickEvent?: () => void;
    children: ReactNode;
    defaultOpen?: boolean;
}

const CollapsibleCard: React.FC<CollapsibleCardProps> = ({
    title,
    button,
    clickEvent,
    children,
    defaultOpen = false,
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="w-full">
            <div className="flex flex-row items-center justify-between gap-3 p-3">
                {title && (
                    <span
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-purple-600 text-base font-semibold cursor-pointer hover:bg-gray-100 hover:underline px-3 py-1 rounded-md transition-colors duration-200"
                    >
                        {title}
                    </span>
                )}
                {button && (
                    <Button
                        size="small"
                        variant="contained"
                        onClick={clickEvent}
                        className="bg-purple-600 px-3 py-1 rounded-md"
                    >
                        {button}

                    </Button>
                )}
            </div>

            <div
                className={`transition-max-height duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-max p-4" : "max-h-0"
                    }`}
            >
                {children}
            </div>
        </div>
    );
};

export default CollapsibleCard;
