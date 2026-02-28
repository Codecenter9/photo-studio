"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface ReusableDialogProps {
    open: boolean;
    title?: string;
    children: React.ReactNode;
    scroll?: DialogProps["scroll"]; // 'paper' | 'body'
    onClose: () => void;
    onSave?: () => void;
    closeLabel?: string;
    saveLabel?: React.ReactNode | string;
    maxWidth?: DialogProps["maxWidth"];
}

const DialogBox: React.FC<ReusableDialogProps> = ({
    open,
    title = "Dialog",
    children,
    scroll = "paper",
    onClose,
    onSave,
    closeLabel = "Cancel",
    saveLabel = "Save",
    maxWidth = "xl",
}) => {
    const descriptionElementRef = React.useRef<HTMLElement>(null);

    React.useEffect(() => {
        if (open && descriptionElementRef.current) {
            descriptionElementRef.current.focus();
        }
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={maxWidth}
            scroll={scroll}
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description"
        >
            <DialogTitle id="dialog-title">{title}</DialogTitle>

            <DialogContent dividers={scroll === "paper"}>
                <DialogContentText
                    id="dialog-description"
                    ref={descriptionElementRef}
                    tabIndex={-1}
                >
                    {children}
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>{closeLabel}</Button>
                {onSave && <Button onClick={onSave}>{saveLabel}</Button>}
            </DialogActions>
        </Dialog>
    );
};

export default DialogBox;
