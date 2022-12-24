import React, { useState } from "react";
import { toBN } from "starknet/dist/utils/number";
import { useSolutions, useAllSolutions } from "../../../lib/api";
import SolutionRow from "./SolutionRow";
import { useTranslation } from "react-i18next";

import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import Paper from '@mui/material/Paper';

import Modal from "../ui_common/Modal";

const SolutionBoard = ({ loadSolution, isArenaMode=true}) => {
    const { t } = useTranslation();

    const minimumDelivery = isArenaMode ? 1 : 0;
    const { data: data } = isArenaMode ? useSolutions(minimumDelivery) : useAllSolutions();
    // const { data: dataAll } = useAllSolutions();
    const solutions: any[] = data?.solutions;
    // const solutionsAll: any[] = dataAll?.solutions;
    console.log('fetched data:', data);

    const handleLoadSolution = (mode, extractedSolution) => {
        loadSolution(mode, extractedSolution);
    };

    // render
    return (
        <Paper sx={{ width: '100%', pb:5, backgroundColor:'#ffffff00'}} elevation={0}>
            <p
                style={{
                    fontSize: "1.2rem",
                    marginBottom: "0.5rem",
                    paddingLeft:'2rem',
                }}
            >
                {isArenaMode ? t("leaderboard.title") : 'Music Library'}
            </p>

            {
                isArenaMode ? (
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
                ) : <></>
            }


            {solutions ? (
                <TableContainer sx={{pl:2}}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                {
                                    isArenaMode ? <>
                                        <TableCell align="left" sx={{width:2}}>{t("leaderboard.rank")}</TableCell>
                                        <TableCell sx={{width:3}}>{t("leaderboard.account")}</TableCell>
                                        <TableCell align="right" sx={{width:4}}>{t("leaderboard.delivered")}</TableCell>

                                        <TableCell align="right" sx={{width:4}}>{t("leaderboard.static_cost")}</TableCell>
                                        <TableCell align="right" sx={{width:4}}>{t("leaderboard.latency")}</TableCell>
                                        <TableCell align="right" sx={{width:4}}>{t("leaderboard.dynamic_cost")}</TableCell>
                                        <TableCell align="right" sx={{width:4, pr:5}}>{t("leaderboard.block_number")}</TableCell>
                                    </> : <>
                                        <TableCell sx={{width:3}}>{t("leaderboard.account")}</TableCell>
                                        <TableCell sx={{width:4}}>{'Title'}</TableCell>
                                        <TableCell align="left" sx={{width:4, pr:5}}>{t("leaderboard.block_number")}</TableCell>
                                    </>
                                }


                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                isArenaMode ? solutions.map((solution, index) => {
                                    return (
                                        <SolutionRow
                                            key={`leaderboard-row-${index}`}
                                            solution={solution}
                                            index={index}
                                            loadSolution={handleLoadSolution}
                                            isArenaMode={true}
                                        />
                                    );
                                }) : solutions.map((solution, index) => {
                                    return (
                                        <SolutionRow
                                            key={`leaderboard-row-${index}`}
                                            solution={solution}
                                            index={index}
                                            loadSolution={handleLoadSolution}
                                            isArenaMode={false}
                                        />
                                    );
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <p style={{paddingLeft:'35px'}}>loading ...</p>
            )}
        </Paper>
    );
};

export default SolutionBoard;
