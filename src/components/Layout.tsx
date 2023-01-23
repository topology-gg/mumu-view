import React, { useCallback, useEffect, useState, useRef } from "react";
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
import Editors from "./Editors";
import Statistics from "./Statistics";

import { useAccount, useStarknetExecute, useTransactionReceipt } from "@starknet-react/core";
import LayoutBox from "./LayoutBox";
import DAWConfigPanel from "./DAWConfigPanel";
import DAWFaucetSinkPanel from "./DAWFaucetSinkPanel"

import { BLANK_COLOR, Modes } from "../constants/constants";

const flexColumn: SxProps = {
    display: "flex",
    flexDirection: "column",
};

const Panel = ({ children, sx = {} }: { children: React.ReactNode; sx?: SxProps }) => {
    return <Box sx={{ textAlign: "center", flex: 1, ...sx }}>{children}</Box>;
};

export default function Layout({
    currMode,
    loadSave,
    board,
    faucets,
    sinks,
    liveStats,
    summaryStats,
    animationState,
    operatorStates,
    mech_n,
    mechVelocities,
    musicTitle,
    sfLoaded,
    sfPrograms,
    mechProgramming,
    formulaProgramming,
    midScreenControlProps,
    midScreenControlHandleClick,
    midScreenControlHandleSlideChange,
    loadSolution,
    loadMode,
    handleFormulaOnclick,
    handleSetSfFile,
    handleMechNoteVelocityChange,
    handleMechSfProgramChange,
    handleMusicTitleChange,
    handleAddFaucet,
    handleRemoveFaucet,
    handleAddSink,
    handleRemoveSink,
    handleOnMouseEnterGrid,
    handleOnMouseLeaveGrid,
    handleFaucetAtomTypeChange,
    callData,

    isPlacingFaucetSink,
    isPlacingFaucet,
    placingFaucet,
    placingSink,
    handleCancelFaucetSinkPlacing,
    handleConfirmFaucetSinkPlacing,
}) {
    const { t } = useTranslation();
    const { account, address, status } = useAccount();

    // states
    const [openedAccordion, setOpenedAccordion] = useState<string>(null);
    const [settingOpen, setSettingOpen] = useState<boolean>(true);
    const [settingRenderMode, setSettingRenderMode] = useState<string>("menu");
    const [txnPending, setTxnPending] = useState<boolean>(false);
    const [submitText, setSubmitText] = useState<string>();
    const [hash, setHash] = useState<string>();
    const [boardParentWidth, setBoardParentWidth] = useState<number>();

    const { execute } = useStarknetExecute({ calls: callData });

    useEffect(() => {
        if (hash) {
            account
                .waitForTransaction(hash)
                .then(() => setSubmitText("Success!"))
                .catch((err) => {
                    setSubmitText("Error! Please try again.");
                    console.error(err);
                })
                .finally(() => setTxnPending(false));
        }
    }, [hash]);

    // handle state changes
    function handleSetRenderMode(mode) {
        setSettingRenderMode((_) => mode);
    }
    function handleSetOpen(bool) {
        setSettingOpen((_) => bool);
    }

    // handle ESC keypress
    useEffect(() => {
        function handleEscapeKey(event: KeyboardEvent) {
            if (event.code === 'Escape') {
                setSettingOpen((prev) => !prev);
                setSettingRenderMode((_) => 'menu');
            }
        }
        document.addEventListener('keydown', handleEscapeKey)
        return () => document.removeEventListener('keydown', handleEscapeKey)
    }, [])

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

        // temp fix: remind player of naming music before submission in daw mode
        if (currMode == Modes.daw && musicTitle.length == 0){
            alert ('Please name your music before submitting it onchain.')
            return;
        }

        // submit tx
        console.log("> submitting args to simulator() on StarkNet:", callData);
        try {
            setSubmitText("Submission pending...");
            setTxnPending(true);
            setHash("");

            const response = await execute();
            setHash(response.transaction_hash);
        } catch (err) {
            setTxnPending(false);
            console.error(err);
        }
        return;
    }

    const MASCOT_DIM = "13rem";
    const stats_box_sx = {
        p:'1rem',backgroundColor:BLANK_COLOR,fontSize:'0.75rem',alignItems:'center',
        border: 1, borderRadius:4, boxShadow:3,
    }

    const ref = useRef(null);
    useEffect(() => {
      console.log('width', ref.current ? ref.current.offsetWidth : 0);
      setBoardParentWidth ((prev) => ref.current ? ref.current.offsetWidth : prev);
    }, [ref.current]);

    let dawVolumePanel = (
        <DAWConfigPanel
            handleSetSfFile={(file) => handleSetSfFile(file)}
            sfLoaded={sfLoaded}
            sfPrograms={sfPrograms}
            mech_n={mech_n}
            mechVelocities={mechVelocities}
            musicTitle={musicTitle}
            animationState={animationState}
            handleMechNoteVelocityChange={handleMechNoteVelocityChange}
            handleMechSfProgramChange={handleMechSfProgramChange}
            handleMusicTitleChange={handleMusicTitleChange}
            operatorStates={operatorStates}
        />
    )

    let dawFaucetSinkPanel = (
        <DAWFaucetSinkPanel
            sfLoaded={sfLoaded}
            placing={isPlacingFaucetSink}
            isPlacingFaucet={isPlacingFaucet}
            placingFaucet={placingFaucet}
            placingSink={placingSink}
            faucets={faucets}
            sinks={sinks}
            animationState={animationState}
            handleAddFaucet={handleAddFaucet}
            handleRemoveFaucet={handleRemoveFaucet} //(id: string) => void;
            handleAddSink={handleAddSink}
            handleRemoveSink={handleRemoveSink} //(id: string) => void;
            handleOnMouseEnterGrid={handleOnMouseEnterGrid}
            handleOnMouseLeaveGrid={handleOnMouseLeaveGrid}
            handleFaucetAtomTypeChange={handleFaucetAtomTypeChange}
            handleCancelPlacing={handleCancelFaucetSinkPlacing}
            handleConfirmPlacing={handleConfirmFaucetSinkPlacing}
        />
    )

    return (
        <>
            <ThemeProvider theme={theme}>
                <Box sx={{ height: { md: "100vh" }, p: 4 }} display="flex" flexDirection="column" gap={2}>
                    <Grid container spacing={2} flex={1} flexShrink={0} disableEqualOverflow justifyContent={"stretch"}>
                        {/* <Grid xs={12} md={4} sx={flexColumn}>

                        </Grid> */}
                        <Grid xs={12} md={7} sx={flexColumn} ref={ref} style={{display:'flex', flexDirection:'column'}}>

                            {board(boardParentWidth)}

                            <MidScreenControl
                                runnable={midScreenControlProps.runnable}
                                animationFrame={midScreenControlProps.animationFrame}
                                n_cycles={midScreenControlProps.n_cycles}
                                animationState={midScreenControlProps.animationState}
                                handleClick={midScreenControlHandleClick}
                                handleSlideChange={midScreenControlHandleSlideChange}
                            />

                            <Box
                                sx={{
                                    p: '1rem',
                                    border: 1,
                                    borderRadius: 4,
                                    backgroundColor: BLANK_COLOR,
                                    boxShadow: 3,
                                    width: "26rem",
                                    margin:'0 auto',
                                    justifyContent:'center',
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}
                            >

                                {/* <Grid container spacing={1} sx={{justifyContent:'center', p:0}}> */}
                                    {/* <Grid xs={3} xsOffset={1.5} lg={2} lgOffset={3}> */}
                                        <Setting
                                            renderMode={settingRenderMode}
                                            handleSetRenderMode={handleSetRenderMode}
                                            open={settingOpen}
                                            handleSetOpen={handleSetOpen}
                                            loadSolution={loadSolution}
                                            loadMode={loadMode}
                                        />
                                    {/* </Grid> */}

                                    {/* <Grid xs={3} lg={2}> */}
                                        {loadSave}
                                    {/* </Grid> */}

                                    {/* <Grid xs={3} lg={2}> */}
                                        <Submission handleClickSubmit={handleClickSubmit} isPending={txnPending} />
                                    {/* </Grid> */}
                                {/* </Grid> */}

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
                            </Box>

                        </Grid>

                        <Grid xs={12} md={5} sx={flexColumn}>
                            <Panel>
                                {
                                    currMode !== 'daw' ? (
                                        // <Panel>{stats}</Panel>
                                        <Statistics liveStats={liveStats} summaryStats={summaryStats}/>
                                    ) : (<></>)
                                    //     <Panel>
                                    //         <Box sx={stats_box_sx}>
                                    //             <DAWPanel
                                    //                 sf={null}
                                    //                 handleSetSfFile={(file) => handleSetSfFile(file)}
                                    //                 sfLoaded={sfLoaded}
                                    //                 mech_n={mech_n}
                                    //                 mechVelocities={mechVelocities}
                                    //                 musicTitle={musicTitle}
                                    //                 animationState={animationState}
                                    //                 handleMechNoteVelocityChange={handleMechNoteVelocityChange}
                                    //                 handleMusicTitleChange={handleMusicTitleChange}
                                    //                 operatorStates={operatorStates}
                                    //             />
                                    //         </Box>
                                    //     </Panel>
                                    // )
                                }
                                <Editors
                                    currMode={currMode}
                                    animationState={animationState}
                                    handleFormulaOnclick={handleFormulaOnclick}
                                    formulaProgramming={formulaProgramming}
                                    mechProgramming={mechProgramming}
                                    dawVolumePanel={dawVolumePanel}
                                    dawFaucetSinkPanel={dawFaucetSinkPanel}
                                />
                            </Panel>
                        </Grid>
                    </Grid>

                </Box>
            </ThemeProvider>
        </>
    );
}
