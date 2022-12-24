import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { Accordion, AccordionDetails, AccordionSummary, Box, SxProps, ThemeProvider } from "@mui/material";
import Grid from "@mui/system/Unstable_Grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import theme from "../../styles/theme";
import Setting from "./ui_setting/setting";
import Formulas from "./formulas";
import Convo from "./convo";
import Submission from "./Submission";
import MidScreenControl from "./ui_setting/MidScreenControl";

import { useAccount, useConnectors } from "@starknet-react/core";
import LayoutBox from "./LayoutBox";
import DAWPanel from "./DAWPanel";

import { BLANK_COLOR } from "../constants/constants";

const gridStyles: SxProps = {
    display: "flex",
    flexDirection: "row",
};

const Panel = ({ children, sx = {} }: { children: React.ReactNode; sx?: SxProps }) => {
    return <Box sx={{ textAlign: "center", flex: 1, ...sx }}>{children}</Box>;
};

export default function Layout({
    currMode,
    loadSave,
    board,
    stats,
    animationState,
    operatorStates,
    mech_n,
    mechVelocities,
    musicTitle,
    sfLoaded,
    mechProgramming,
    formulaProgramming,
    midScreenControlProps,
    midScreenControlHandleClick,
    midScreenControlHandleSlideChange,
    indexHandleClickSubmit,
    loadSolution,
    loadMode,
    handleFormulaOnclick,
    handleSetSfFile,
    handleMechNoteVelocityChange,
    handleMusicTitleChange,
}) {
    const { t } = useTranslation();
    const { account, address, status } = useAccount();

    // states
    const [openedAccordion, setOpenedAccordion] = useState<string>(null);
    const [settingOpen, setSettingOpen] = useState<boolean>(true);
    const [settingRenderMode, setSettingRenderMode] = useState<string>("menu");

    // handle state changes
    function handleSetRenderMode(mode) {
        setSettingRenderMode((_) => mode);
    }
    function handleSetOpen(bool) {
        setSettingOpen((_) => bool);
    }

    function handleClickSubmit() {
        if (!account) {
            console.log("boom not connected");
            setSettingOpen((_) => true);
            setSettingRenderMode((_) => "connect");
        } else {
            indexHandleClickSubmit();
        }
    }

    const MASCOT_DIM = "13rem";
    const stats_box_sx = {
        p:'1rem',backgroundColor:BLANK_COLOR,fontSize:'0.75rem',alignItems:'center',
        border: 1, borderRadius:4, boxShadow:3,
    }

    return (
        <>
            <ThemeProvider theme={theme}>
                <Box sx={{ height: { md: "100vh" }, p: 4 }} display="flex" flexDirection="column" gap={2}>
                    <Grid container spacing={2} flex={1} flexShrink={0} disableEqualOverflow justifyContent={"stretch"}>
                        <Grid xs={12} md={4} sx={gridStyles}>
                            <Panel
                                sx={{
                                    p: 0,
                                    border: 1,
                                    borderRadius: 4,
                                    backgroundColor: BLANK_COLOR,
                                    boxShadow: 3,
                                }}
                            >
                                <Convo />

                                <div
                                    className={"christmas"}
                                    style={{ width: MASCOT_DIM, height: MASCOT_DIM, margin: "0 auto 0.5rem auto" }}
                                ></div>

                                <Grid container spacing={1}>
                                    <Grid xs={3} xsOffset={1.5} lg={2} lgOffset={3}>
                                        <Setting
                                            renderMode={settingRenderMode}
                                            handleSetRenderMode={handleSetRenderMode}
                                            open={settingOpen}
                                            handleSetOpen={handleSetOpen}
                                            loadSolution={loadSolution}
                                            loadMode={loadMode}
                                        />
                                    </Grid>

                                    <Grid xs={3} lg={2}>
                                        {loadSave}
                                    </Grid>

                                    <Grid xs={3} lg={2}>
                                        <Submission handleClickSubmit={handleClickSubmit} />
                                    </Grid>
                                </Grid>
                            </Panel>
                        </Grid>
                        <Grid xs={12} md={4} sx={gridStyles}>
                            <Panel>
                                {board}
                                <MidScreenControl
                                    runnable={midScreenControlProps.runnable}
                                    animationFrame={midScreenControlProps.animationFrame}
                                    n_cycles={midScreenControlProps.n_cycles}
                                    animationState={midScreenControlProps.animationState}
                                    handleClick={midScreenControlHandleClick}
                                    handleSlideChange={midScreenControlHandleSlideChange}
                                />
                            </Panel>
                        </Grid>
                        {
                            currMode !== 'daw' ? (
                                <Grid xs={12} md={4} sx={gridStyles}>
                                    <Panel>{stats}</Panel>
                                </Grid>
                            ) :
                            <Grid xs={12} md={4} sx={gridStyles}>
                                <Panel>
                                    <Box sx={stats_box_sx}>
                                        <DAWPanel
                                            sf={null}
                                            handleSetSfFile={(file) => handleSetSfFile(file)}
                                            sfLoaded={sfLoaded}
                                            mech_n={mech_n}
                                            mechVelocities={mechVelocities}
                                            musicTitle={musicTitle}
                                            animationState={animationState}
                                            handleMechNoteVelocityChange={handleMechNoteVelocityChange}
                                            handleMusicTitleChange={handleMusicTitleChange}
                                            operatorStates={operatorStates}
                                        />
                                    </Box>
                                </Panel>
                            </Grid>

                        }
                    </Grid>

                    <Grid container spacing={2} flex={1.25} justifyContent={"stretch"}>
                        <Grid xs={12} md={4} sx={gridStyles}>
                            <LayoutBox
                                scrollable
                                sx={{ bgcolor: animationState !== "Stop" ? "grey.500" : BLANK_COLOR }}
                            >
                                <Formulas
                                    handleFormulaOnclick={(k) => {
                                        setOpenedAccordion((_) => "accordion1");
                                        handleFormulaOnclick(k);
                                    }}
                                    clickDisabled={animationState !== "Stop" ? true : false}
                                />
                            </LayoutBox>
                        </Grid>
                        <Grid xs={12} md={8} sx={gridStyles}>
                            <LayoutBox
                                scrollable
                                sx={{ bgcolor: animationState !== "Stop" ? "grey.500" : BLANK_COLOR }}
                            >
                                <Accordion
                                    key="accordion-1"
                                    expanded={openedAccordion == "accordion1"}
                                    onChange={(_, expanded) => setOpenedAccordion(expanded ? "accordion1" : null)}
                                    style={{ boxShadow: "none", backgroundColor: "#ffffff00" }}
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
                                    style={{ boxShadow: "none", backgroundColor: "#ffffff00" }}
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
                            </LayoutBox>
                        </Grid>
                    </Grid>
                </Box>
            </ThemeProvider>
        </>
    );
}
