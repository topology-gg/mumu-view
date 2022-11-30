import React, { useState } from "react";
import { useSolutions } from "../../lib/api";
import LeaderboardRow from "./LeaderboardRow";
import { useTranslation } from "react-i18next";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import Modal from "./Modal";

const Leaderboard = ({ loadSolution }) => {
    const { t } = useTranslation();

    const { data } = useSolutions();
    const [open, setOpen] = useState<boolean>(false);
    const solutions: any[] = data?.solutions;

    const handleLoadSolution = (extractedSolution) => {
        loadSolution(extractedSolution);
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Tooltip title={t("leaderboard.title")} arrow>

            <div>
            {/* <Button color="secondary" variant="outlined" onClick={handleOpen}>
                {t("leaderboard.title")}
            </Button> */}
            <button onClick={handleOpen}>
                <i className="material-icons" style={{ fontSize: "1rem", paddingTop:'0.12rem' }}>
                    military_tech
                </i>
            </button>

            <Modal maxWidth="lg" open={open} onClose={handleClose}>
                <Box sx={{ p: 2, fontFamily: "var(--font-family-secondary)" }}>
                    <p
                        style={{
                            fontSize: "0.9rem",
                            marginBottom: "0.5rem",
                        }}
                    >
                        {t("leaderboard.title")}
                    </p>

                    <div
                        style={{
                            marginBottom: "1.5rem",
                        }}
                    >
                        {t("tutorial.goalLine3_1")}
                        <a
                            href="https://stardisc.netlify.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="stardisc"
                            style={{
                                margin: "0",
                            }}
                        >
                            <strong>StarDisc</strong>
                        </a>
                        {t("tutorial.goalLine3_2")}
                    </div>
                    {solutions ? (
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="right">{t("leaderboard.rank")}</TableCell>
                                        <TableCell>{t("leaderboard.account")}</TableCell>
                                        <TableCell align="right">{t("leaderboard.delivered")}</TableCell>
                                        <TableCell align="right">{t("leaderboard.static_cost")}</TableCell>
                                        <TableCell align="right">{t("leaderboard.latency")}</TableCell>
                                        <TableCell align="right">{t("leaderboard.dynamic_cost")}</TableCell>
                                        <TableCell align="right">{t("leaderboard.block_number")}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {solutions.map((solution, index) => {
                                        return (
                                            <LeaderboardRow
                                                key={`leaderboard-row-${index}`}
                                                solution={solution}
                                                index={index}
                                                loadSolution={handleLoadSolution}
                                            />
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <>loading ...</>
                    )}
                </Box>
            </Modal>
            </div>

        </Tooltip>
    );
};

export default Leaderboard;
