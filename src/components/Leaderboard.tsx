import React, { useState } from "react";
import { toBN } from "starknet/dist/utils/number";
import { useSolutions } from "../../lib/api";
import LeaderboardRow from "./LeaderboardRow";
import { useTranslation } from "react-i18next";
import { Box, Button } from "@mui/material";
import Modal from "./Modal";

const Leaderboard = ({ loadSolution }) => {
    const { t } = useTranslation();

    const { data } = useSolutions();
    const [open, setOpen] = useState<boolean>(false);
    const solutions: any[] = data?.solutions;

    const th_style = { paddingBottom: "1rem" };

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            <Button color="secondary" variant="outlined" onClick={handleOpen}>
                {t("leaderboard.title")}
            </Button>
            <Modal open={open} onClose={handleClose}>
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
                        <table style={{ marginBottom: "30px" }}>
                            <thead>
                                <tr>
                                    <th style={th_style}>{t("leaderboard.rank")}</th>
                                    <th style={th_style}>{t("leaderboard.account")}</th>
                                    <th style={th_style}>{t("leaderboard.delivered")}</th>
                                    <th style={th_style}>{t("leaderboard.static_cost")}</th>
                                    <th style={th_style}>{t("leaderboard.latency")}</th>
                                    <th style={th_style}>{t("leaderboard.dynamic_cost")}</th>
                                    <th style={th_style}>{t("leaderboard.block_number")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {solutions.map((solution, index) => {
                                    return (
                                        <LeaderboardRow
                                            key={`leaderboard-row-${index}`}
                                            solution={solution}
                                            index={index}
                                            loadSolution={loadSolution}
                                        />
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <>loading ...</>
                    )}
                </Box>
            </Modal>
        </>
    );
};

export default Leaderboard;
