import { Box, SxProps } from "@mui/material";
import React from "react";

interface LayoutBoxProps {
    children: React.ReactNode;
    scrollable?: boolean;
    sx?: SxProps;
}

const LayoutBox = ({ children, scrollable, sx = {} }: LayoutBoxProps) => {
    return (
        <Box
            sx={{
                border: 1,
                borderRadius: 4,
                boxShadow: 3,
                position: "relative",
                width: "100%",
                bgcolor: "common.white",
                ...sx,
            }}
        >
            {scrollable ? (
                <Box sx={{ position: { md: "absolute" }, top: 0, right: 0, left: 0, bottom: 0, overflow: "auto" }}>
                    {children}
                </Box>
            ) : (
                children
            )}
        </Box>
    );
};

export default LayoutBox;
