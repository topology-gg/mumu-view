import { CSSProperties, useState } from "react";
import Modal from "./ui_common/Modal";
import Button from "@mui/material/Button";
import { Box, Tooltip } from "@mui/material";
import styles from "../styles/Home.module.css";
import { Trans, useTranslation } from "react-i18next";
import Typewriter from 'typewriter-effect';

export default function Convo() {

    const { t } = useTranslation();

    const sentences = [
        "Welcome to the World of MuMu!",
        "In the world of MuMu, you can craft diagrams that transform substances into powerful magical element.",
        "Tutorial levels are coming soon to help you get started!",
        "Meanwhile, go to 'Setting' > 'How to play' to dig into the mechanics."
    ]

    return (
        <Box
            flex={1} flexShrink={0} overflow="hidden"
            sx={{ textAlign:'left', mb:'1rem', pl:'3.5rem', pr:'3.5rem', height:'4rem' }}
        >
            <Typewriter
                options={{
                    strings: sentences,
                    autoStart: true,
                    loop: true,
                    delay: 50,
                    deleteSpeed: 10,
                }}
            />

        </Box>
    );
}
