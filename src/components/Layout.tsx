import styles from "../../styles/Home.module.css";
import React, { useState } from "react";
import Tutorial from "../../pages/tutorial";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import ConnectWalletStardisc from "./ConnectWalletStardisc";
import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, SxProps, ThemeProvider } from "@mui/material";
import SocialMedia from "./SocialMedia";
import Grid from "@mui/system/Unstable_Grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import theme from "../../styles/theme";

const gridStyles: SxProps = {
    display: "flex",
    flexDirection: "row",
};

const Panel = ({ children }) => {
    return <Box sx={{ textAlign: "center", flex: 1 }}>{children}</Box>;
};

export default function Layout({ controlPanel, board, stats, mechProgramming, formulaProgramming, midScreenControls }) {
    const { t } = useTranslation();

    const [openedAccordion, setOpenedAccordion] = useState<string>();

    return (
        <>
            <ThemeProvider theme={theme}>
                <Box sx={{ height: "100vh" }} display="flex" flexDirection="column">
                    <Grid container spacing={1} flex={1.25} disableEqualOverflow>
                        <Grid xs={3} sx={gridStyles}>
                            <Panel>
                                <div className={styles.title}>
                                    <h2>{t("MuMu")}</h2>
                                    <p>{t("Subtitle")}</p>
                                    <SocialMedia />
                                </div>
                                <ConnectWalletStardisc />

                                <LanguageSelector />

                                <Tutorial />
                                {controlPanel}
                            </Panel>
                        </Grid>
                        <Grid xs={6} sx={gridStyles}>
                            <Panel>{board}</Panel>
                        </Grid>
                        <Grid xs={3} sx={gridStyles}>
                            <Panel>{stats}</Panel>
                        </Grid>
                    </Grid>
                    <Divider />
                    {midScreenControls}
                    <Divider />
                    <Box flex={1} flexShrink={0} overflow="scroll">
                        <Panel>
                            <Accordion
                                key="accordion-1"
                                expanded={openedAccordion == "accordion1"}
                                onChange={(_, expanded) => setOpenedAccordion(expanded ? "accordion1" : null)}
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
                        </Panel>
                    </Box>
                </Box>
            </ThemeProvider>
        </>
    );
}
