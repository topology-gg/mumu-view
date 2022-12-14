import { CSSProperties, useState } from "react";
import Modal from "../src/components/Modal";
import { Box, Tooltip, SxProps } from "@mui/material";
import Grid from "@mui/system/Unstable_Grid";
import styles from "../../styles/Home.module.css";
import { Trans, useTranslation } from "react-i18next";
import Menu from "./menu";

export default function Setting({}) {

    const { t } = useTranslation();
    const [open, setOpen] = useState<boolean>(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const Panel = ({ children, sx = {} }: { children: React.ReactNode; sx?: SxProps }) => {
        return <Box sx={{ textAlign: "center", flex: 1, ...sx }}>{children}</Box>;
    };

    return (
        <div>

            <button onClick={handleOpen} className={'big-button'}>
                <i className="material-icons" style={{ fontSize: "1rem" }}>
                    settings
                </i>
            </button>

            <Modal open={open} onClose={handleClose} width={300}>
                <Box sx={{ pt: 5, pb: 5, pl: 0, pr: 0, fontFamily: "var(--font-family-secondary)" }}>
                    <Menu width={'100%'}/>
                </Box>
            </Modal>

        </div>
    );
}
