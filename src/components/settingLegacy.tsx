import { CSSProperties, useState } from "react";
import Modal from "./Modal";
import Button from "@mui/material/Button";
import { Box, Tooltip, SxProps } from "@mui/material";
import Grid from "@mui/system/Unstable_Grid";
import styles from "../../styles/Home.module.css";
import { Trans, useTranslation } from "react-i18next";
import Tutorial from "./Manual";
import LanguageSelector from "./LanguageSelector";
import SocialMedia from "./SocialMedia";
import ConnectWalletStardisc from "./ConnectWalletStardisc";
import ConnectWallet from "./ConnectWallet";

export default function Setting({
    leaderboard, connectWalletModalOpen,
    connectWalletModalOnOpen, connectWalletModalOnClose,
    open, handleOpen, handleClose
}) {

    const { t } = useTranslation();
    // const [open, setOpen] = useState<boolean>(false);
    // const handleOpen = () => {
    //     setOpen(true);
    // };
    // const handleClose = () => {
    //     setOpen(false);
    // };

    const Panel = ({ children, sx = {} }: { children: React.ReactNode; sx?: SxProps }) => {
        return <Box sx={{ textAlign: "center", flex: 1, ...sx }}>{children}</Box>;
    };

    return (
        <Tooltip title={t("setting")} arrow>

        <div
            // style={{
            //     marginBottom: "2rem",
            // }}
        >
            {/* <Button color="secondary" variant="outlined" onClick={handleOpen}>
                {t("tutorial.title")}
            </Button> */}
            <button onClick={handleOpen} className={'big-button'}>
                <i className="material-icons" style={{ fontSize: "1rem" }}>
                    settings
                </i>
            </button>
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ p: 5, height: '25rem', fontFamily: "var(--font-family-secondary)" }}>
                    <Panel>
                        <div className={styles.title}>
                            <h2>{t("MuMu")}</h2>
                            <p>{t("Subtitle")}</p>
                            <SocialMedia />
                        </div>

                        {/* <ConnectWalletStardisc /> */}
                        <ConnectWallet
                            modalOpen={connectWalletModalOpen}
                            handleOnOpen={connectWalletModalOnOpen}
                            handleOnClose={connectWalletModalOnClose}
                        />

                        {/* makeshift spacer; will discard in next refactor PR */}
                        <div style={{height:'1rem'}}></div>

                        <LanguageSelector />

                        <Grid container spacing={2} height={10}>
                            <Grid xs={0} md={4.5}></Grid>

                            <Grid xs={3} md={1.5}>
                                <Tutorial />
                            </Grid>
                            <Grid xs={3} md={1.5}>
                                {leaderboard}
                            </Grid>

                            <Grid xs={0} md={4.5}></Grid>
                        </Grid>

                    </Panel>
                </Box>
            </Modal>
        </div>

        </Tooltip>
    );
}
