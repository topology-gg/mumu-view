import React, { useState } from "react";
import { useSolutions } from "../../lib/api";
import LeaderboardRow from "./LeaderboardRow";
import { useTranslation } from "react-i18next";

import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import Paper from '@mui/material/Paper';

import Modal from "./Modal";

const Leaderboard = ({ loadSolution }) => {
    const { t } = useTranslation();

    const { data } = useSolutions();
    const solutions: any[] = data?.solutions;

    const handleLoadSolution = (extractedSolution) => {
        loadSolution(extractedSolution);
    };

    // render
    return (
        <Paper sx={{ width: '100%' }} elevation={0}>
            <p
                style={{
                    fontSize: "1.2rem",
                    marginBottom: "0.5rem",
                    paddingLeft:'2rem',
                }}
            >
                {t("leaderboard.title")}
            </p>

            <div
                style={{
                    marginBottom: "1.5rem",
                    paddingLeft: '2rem',
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

                                <TableCell align="right" sx={{width:2}}>{t("leaderboard.rank")}</TableCell>
                                <TableCell sx={{width:4}}>{t("leaderboard.account")}</TableCell>
                                <TableCell align="right" sx={{width:4}}>{t("leaderboard.delivered")}</TableCell>

                                <TableCell align="right" sx={{width:4}}>{t("leaderboard.static_cost")}</TableCell>
                                <TableCell align="right" sx={{width:4}}>{t("leaderboard.latency")}</TableCell>
                                <TableCell align="right" sx={{width:4}}>{t("leaderboard.dynamic_cost")}</TableCell>
                                <TableCell align="right" sx={{width:4, pr:5}}>{t("leaderboard.block_number")}</TableCell>

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
        </Paper>
    );
};

export default Leaderboard;
