import React from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Breakpoint } from "@mui/material";

interface ModalProps {
    children: React.ReactNode;
    open: boolean;
    onClose: () => void;
    maxWidth?: false | Breakpoint;
}

const Modal = ({ children, open, onClose, maxWidth = "sm" }: ModalProps) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth={true}>
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            {children}
        </Dialog>
    );
};

export default Modal;
