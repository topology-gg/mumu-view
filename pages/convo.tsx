import { CSSProperties, useState } from "react";
import Modal from "../src/components/Modal";
import Button from "@mui/material/Button";
import { Box, Tooltip } from "@mui/material";
import styles from "../styles/Home.module.css";
import { Trans, useTranslation } from "react-i18next";

export default function Convo() {

    const { t } = useTranslation();

    return (
        <Box
            flex={1} flexShrink={0} overflow="scroll"
            sx={{ textAlign:'center', mb:'1rem' }}
        >
        Welcome to the World of MuMu!
        </Box>
    );
}
