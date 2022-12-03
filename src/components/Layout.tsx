import styles from "../../styles/Home.module.css";
import React, { useState } from "react";
import Tutorial from "../../pages/tutorial";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import ConnectWalletStardisc from "./ConnectWalletStardisc";
import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, SxProps, ThemeProvider, Tooltip } from "@mui/material";
import SocialMedia from "./SocialMedia";
import Grid from "@mui/system/Unstable_Grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import theme from "../../styles/theme";
import Setting from "../../pages/setting";
import Formulas from "../../pages/formulas";

import LoadSave from "./LoadSave";
import Leaderboard from "./Leaderboard";

const gridStyles: SxProps = {
    display: "flex",
    flexDirection: "row",
};

const Panel = ({ children, sx = {} }: { children: React.ReactNode; sx?: SxProps }) => {
    return <Box sx={{ textAlign: "center", flex: 1, ...sx }}>{children}</Box>;
};

export default function Layout({ loadSave, leaderboard, submission, board, stats, mechProgramming, formulaProgramming, midScreenControls }) {
    const { t } = useTranslation();

    const [openedAccordion, setOpenedAccordion] = useState<string>();

    return (
        <>
            <ThemeProvider theme={theme}>
                <Box sx={{ height: { md: "100vh" } }} display="flex" flexDirection="column">
                    <Grid container spacing={1} flex={1.25} disableEqualOverflow>
                        <Grid xs={12} md={4} sx={gridStyles}>
                            {/* <Panel sx={{ pl: 2 }}> */}
                            <Panel sx={{ pt: 8 }}>
                                <div className={styles.title}>
                                    <h2>{t("MuMu")}</h2>
                                    <p>{t("Subtitle")}</p>
                                    <SocialMedia />
                                </div>
                                <ConnectWalletStardisc />

                                <Grid container spacing={2} height={10}>
                                    <Grid xs={0} md={3.75}></Grid>

                                    <Grid xs={4} md={1.5}>
                                        {/* <Tutorial /> */}
                                        <Setting leaderboard={leaderboard}/>
                                    </Grid>
                                    <Grid xs={4} md={1.5}>
                                        {loadSave}
                                    </Grid>
                                    <Grid xs={4} md={1.5}>
                                        {submission}
                                    </Grid>

                                    <Grid xs={0} md={3.75}></Grid>
                                </Grid>

                            </Panel>
                        </Grid>
                        <Grid xs={12} md={4} pb={2} sx={gridStyles}>
                            <Panel>
                                {board}
                                {midScreenControls}
                            </Panel>
                        </Grid>
                        <Grid xs={12} md={4} sx={gridStyles}>
                            <Panel sx={{ pr: 2 }}>{stats}</Panel>
                        </Grid>
                    </Grid>
                    {/* <Divider /> */}
                    {/* {midScreenControls} */}
                    {/* <Divider /> */}

                    <Grid container spacing={1} flex={1.25} overflow="scroll">
                        <Grid xs={12} md={4}  overflow="scroll">
                            <Formulas />
                        </Grid>
                        <Grid xs={12} md={8} overflow="scroll">
                            <Box
                                flex={1} flexShrink={0} overflow="scroll"
                                sx={{border: 1, borderRadius:4, ml:3, mr: 8 }}
                            >

                                {/* <Panel> */}
                                    <Accordion
                                        key="accordion-1"
                                        expanded={openedAccordion == "accordion1"}
                                        onChange={(_, expanded) => setOpenedAccordion(expanded ? "accordion1" : null)}
                                        style={{boxShadow: "none"}}
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            {t("Formula placement")}
                                        </AccordionSummary>
                                        <AccordionDetails>{formulaProgramming}</AccordionDetails>
                                    </Accordion>

                                    <Accordion
                                        key="accordion-2"
                                        expanded={openedAccordion == "accordion2"}
                                        onChange={(_, expanded) => setOpenedAccordion(expanded ? "accordion2" : null)}
                                        style={{boxShadow: "none"}}
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            {t("Mech programming")}
                                        </AccordionSummary>
                                        <AccordionDetails>{mechProgramming}</AccordionDetails>
                                    </Accordion>
                                {/* </Panel> */}
                            </Box>
                        </Grid>
                        <Grid xs={0} md={0.5}></Grid>
                    </Grid>





                </Box>
            </ThemeProvider>
        </>
    );
}
