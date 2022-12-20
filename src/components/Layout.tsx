import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Link,
    SxProps,
    ThemeProvider,
    Tooltip,
} from "@mui/material";
import Grid from "@mui/system/Unstable_Grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import theme from "../../styles/theme";
import Setting from "./ui_setting/setting";
import Formulas from "./formulas";
import Convo from "./convo";
import Submission from "./Submission";
import MidScreenControl from "./ui_setting/MidScreenControl";

import { useAccount, useStarknetExecute, useTransactionReceipt } from "@starknet-react/core";
import LayoutBox from "./LayoutBox";

const gridStyles: SxProps = {
    display: "flex",
    flexDirection: "row",
};

const Panel = ({ children, sx = {} }: { children: React.ReactNode; sx?: SxProps }) => {
    return <Box sx={{ textAlign: "center", flex: 1, ...sx }}>{children}</Box>;
};

export default function Layout({
    loadSave,
    board,
    stats,
    animationState,
    mechProgramming,
    formulaProgramming,
    midScreenControlProps,
    midScreenControlHandleClick,
    midScreenControlHandleSlideChange,
    loadSolution,
    loadMode,
    handleArenaModeClick,
    handleFormulaOnclick,
    callData,
}) {
    const { t } = useTranslation();
    const { account, address, status } = useAccount();

    // states
    const [openedAccordion, setOpenedAccordion] = useState<string>("accordion1");
    const [settingOpen, setSettingOpen] = useState<boolean>(true);
    const [settingRenderMode, setSettingRenderMode] = useState<string>("menu");
    const [txnPending, setTxnPending] = useState<boolean>(false);
    const [submitText, setSubmitText] = useState<string>();
    const [hash, setHash] = useState<string>();

    const { execute } = useStarknetExecute({ calls: callData });
    const { data } = useTransactionReceipt({ hash, watch: true });

    useEffect(() => {
        if (data) {
            switch (data.status) {
                case "ACCEPTED_ON_L1":
                case "ACCEPTED_ON_L2":
                    setSubmitText("Success!");
                    setTxnPending(false);
                    break;
                case "REJECTED":
                    setSubmitText("Rejected!");
                    setTxnPending(false);
                    break;
            }
        }
    }, [data]);

    // handle state changes
    function handleSetRenderMode(mode) {
        setSettingRenderMode((_) => mode);
    }
    function handleSetOpen(bool) {
        setSettingOpen((_) => bool);
    }

    //
    // Handle click event for submitting solution to StarkNet
    //
    async function handleClickSubmit() {
        if (!account) {
            console.log("> wallet not connected yet");
            setSettingOpen((_) => true);
            setSettingRenderMode((_) => "connect");
            return;
        }

        console.log("> connected address:", String(address));

        // submit tx
        console.log("> submitting args to simulator() on StarkNet:", callData);
        try {
            setSubmitText("Submission pending...");
            setTxnPending(true);
            setHash("");

            const res = await execute();
            setHash(res.transaction_hash);
        } catch (err) {
            setTxnPending(false);
            console.error(err);
        }
        return;
    }

    const MASCOT_DIM = "13rem";

    return (
        <>
            <ThemeProvider theme={theme}>
                <Box sx={{ height: { md: "100vh" }, p: 4 }} display="flex" flexDirection="column" gap={2}>
                    <Grid container spacing={2} flex={1} flexShrink={0} disableEqualOverflow justifyContent={"stretch"}>
                        <Grid xs={12} md={4} sx={gridStyles}>
                            <Panel
                                sx={{
                                    pt: 9,
                                    border: 1,
                                    borderRadius: 4,
                                    backgroundColor: "#ffffff",
                                    boxShadow: 3,
                                }}
                            >
                                <Convo />

                                <div
                                    className={"mascot"}
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
                                            handleArenaModeClick={handleArenaModeClick}
                                        />
                                    </Grid>

                                    <Grid xs={3} lg={2}>
                                        {loadSave}
                                    </Grid>

                                    <Grid xs={3} lg={2}>
                                        <Submission handleClickSubmit={handleClickSubmit} isPending={txnPending} />
                                    </Grid>
                                </Grid>

                                {hash && (
                                    <Box fontSize="0.75em" display="flex" justifyContent="center" alignItems="center">
                                        <Tooltip title="View on Starkscan" arrow>
                                            <Link
                                                color="info"
                                                underline="none"
                                                target="_blank"
                                                display="flex"
                                                justifyContent="center"
                                                alignItems="center"
                                                gap="0.25rem"
                                                href={`https://testnet.starkscan.co/tx/${hash}`}
                                            >
                                                {submitText}
                                                <OpenInNewIcon fontSize="inherit" />
                                            </Link>
                                        </Tooltip>
                                    </Box>
                                )}
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
                        <Grid xs={12} md={4} sx={gridStyles}>
                            <Panel>{stats}</Panel>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} flex={1.25} justifyContent={"stretch"}>
                        <Grid xs={12} md={4} sx={gridStyles}>
                            <LayoutBox
                                scrollable
                                sx={{ bgcolor: animationState !== "Stop" ? "grey.300" : "common.white" }}
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
                                sx={{ bgcolor: animationState !== "Stop" ? "grey.300" : "common.white" }}
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
