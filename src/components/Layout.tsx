import styles from "../../styles/Home.module.css";
import React, { useState } from "react";
import Tutorial from "./tutorial";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import ConnectWalletStardisc from "./ConnectWalletStardisc";
import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, SxProps, ThemeProvider, Tooltip } from "@mui/material";
import SocialMedia from "./SocialMedia";
import Grid from "@mui/system/Unstable_Grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import theme from "../../styles/theme";
import Setting from "./setting";
import Formulas from "./formulas";
import Convo from "./convo";
import Submission from "./Submission";
import {useAccount, useConnectors} from '@starknet-react/core'

import LoadSave from "./LoadSave";
import Leaderboard from "./Leaderboard";

const gridStyles: SxProps = {
    display: "flex",
    flexDirection: "row",
};

const Panel = ({ children, sx = {} }: { children: React.ReactNode; sx?: SxProps }) => {
    return <Box sx={{ textAlign: "center", flex: 1, ...sx }}>{children}</Box>;
};

export default function Layout({
    loadSave, leaderboard, submission, board, stats,
    mechProgramming, formulaProgramming, midScreenControls,
    indexHandleClickSubmit
}) {
    const { t } = useTranslation();
    const { account, address, status } = useAccount()

    const [openedAccordion, setOpenedAccordion] = useState<string>("accordion1");

    const MASCOT_DIM = '13rem'

    const [connectWalletModalOpen, setConnectWalletModalOpen] = useState<boolean>(false);
    function handleConnectWalletModalOnOpen(){
        setConnectWalletModalOpen(_ => true)
    }
    function handleConnectWalletModalOnClose(){
        setConnectWalletModalOpen(_ => false)
    }

    const [settingModalOpen, setSettingModalOpen] = useState<boolean>(false);

    function handleClickSubmit(){
        console.log('boom')
        if(!account){
            // open connect wallet modal
            console.log('boom not connected')
            setSettingModalOpen(_ => true)
            setConnectWalletModalOpen(_ => true)
        }
        else {
            indexHandleClickSubmit()
        }
    }

    return (
        <>
            <ThemeProvider theme={theme}>
                <Box sx={{ height: { md: "100vh" } }} display="flex" flexDirection="column">
                    <Grid container spacing={0} flex={1} disableEqualOverflow>
                        <Grid xs={12} md={4} sx={gridStyles}>
                            {/* <Panel sx={{ pl: 2 }}> */}
                            <Panel sx={{
                                pt: 9, border: 1, borderRadius:4,
                                mt:'2rem', ml:'3rem', mb: '1rem',
                            }}>
                                {/* <div className={styles.title}>
                                    <h2>{t("MuMu")}</h2>
                                    <p>{t("Subtitle")}</p>
                                    <SocialMedia />
                                </div> */}

                                <Convo />

                                <div
                                    className={'mascot'}
                                    style={{width:MASCOT_DIM, height:MASCOT_DIM, margin:'0 auto 0.5rem auto'}}
                                ></div>

                                <Grid container spacing={2} height={10}>
                                    <Grid xs={0} md={3.75}></Grid>

                                    <Grid xs={4} md={1.5}>
                                        {/* <Tutorial /> */}
                                        <Setting
                                            leaderboard={leaderboard}
                                            connectWalletModalOpen={connectWalletModalOpen}
                                            connectWalletModalOnOpen={handleConnectWalletModalOnOpen}
                                            connectWalletModalOnClose={handleConnectWalletModalOnClose}
                                            open={settingModalOpen}
                                            handleOpen={() => setSettingModalOpen(_ => true)}
                                            handleClose={() => setSettingModalOpen(_ => false)}
                                        />
                                    </Grid>
                                    <Grid xs={4} md={1.5}>
                                        {loadSave}
                                    </Grid>
                                    <Grid xs={4} md={1.5}>
                                        {/* {submission} */}
                                        <Submission handleClickSubmit={handleClickSubmit} />
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
                            <Panel sx={{ mt: '2rem', mr: 8 }}>{stats}</Panel>
                        </Grid>
                    </Grid>
                    {/* <Divider /> */}
                    {/* {midScreenControls} */}
                    {/* <Divider /> */}

                    <Grid container spacing={0} flex={1.25}>
                        <Grid xs={12} md={4}>
                            <Formulas />
                        </Grid>
                        <Grid xs={12} md={8}>
                            <Box
                                flex={1} flexShrink={0} overflow="scroll"
                                sx={{border: 1, borderRadius:4, ml:3, mr: 8, height:'15rem' }}
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
