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
    padding?: number
}

const Modal = ({ children, open, onClose, maxWidth = "sm", padding = 0 }: ModalProps) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth={true}
        PaperProps={{ sx:{p:padding} }}>
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
