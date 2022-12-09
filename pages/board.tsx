import styles from "../styles/Home.module.css";
import React, { useState, useEffect, useMemo } from "react";
import MechState, { MechStatus, MechType } from "../src/types/MechState";
import Unit from "./unit";
import UnitState, { BgStatus, BorderStatus, UnitText } from "../src/types/UnitState";
import Grid from "../src/types/Grid";
import Operator, { OPERATOR_TYPES, PlacingFormula } from "../src/types/Operator";
import OperatorGridBg from "../src/components/OperatorGridBg";
import { DIM, PROGRAM_SIZE_MAX, DEMO_SOLUTIONS, N_CYCLES } from "../src/constants/constants";
import { useTranslation } from "react-i18next";
import "../config/i18n";
import { Box, Button, Tooltip } from "@mui/material";
import MechProgramming from "../src/components/MechProgramming";
import {
    MAX_NUM_MECHS,
    MIN_NUM_MECHS,
    MAX_NUM_OPERATORS,
    MIN_NUM_OPERATORS,
    ANIM_FRAME_LATENCY,
} from "../src/constants/constants";

interface BoardProps {
    operatorStates: Operator[]
    operatorInputHighlight: boolean[]
    placingFormula: PlacingFormula
    unitStates: UnitState[][]
    mechStates: MechState[]
    mechIndexHighlighted: number
    handleMouseOver: (x: number, y: number) => void
    handleMouseOut: () => void
    handleUnitClick: (x: number, y: number) => void
}

export default function Board (
    { operatorStates, operatorInputHighlight, placingFormula,
    unitStates, mechStates, mechIndexHighlighted,
    handleMouseOver, handleMouseOut, handleUnitClick}: BoardProps) {

    const board = (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: "2rem" }}>
            <div className={styles.grid_parent}>
                <OperatorGridBg
                    operators={operatorStates}
                    highlighted={operatorInputHighlight}
                    placingFormula={placingFormula}
                />
                {Array.from({ length: DIM }).map(
                    (
                        _,
                        i // i is y
                    ) => (
                        <div key={`row-${i}`} className={styles.grid_row}>
                            {Array.from({ length: DIM }).map(
                                (
                                    _,
                                    j // j is x
                                ) => (
                                    <Tooltip title={`${j},${i}`} disableInteractive arrow>
                                        <div>
                                            <Unit
                                                key={`unit-${j}-${i}`}
                                                state={unitStates[j][i]}
                                                handleMouseOver={() => handleMouseOver(j, i)}
                                                handleMouseOut={() => handleMouseOut()}
                                                onClick={() => handleUnitClick(j, i)}
                                                mechHighlight={
                                                    mechIndexHighlighted == -1
                                                        ? false
                                                        : j == mechStates[mechIndexHighlighted].index.x &&
                                                          i == mechStates[mechIndexHighlighted].index.y
                                                        ? true
                                                        : false
                                                }
                                                isSmall={false}
                                            />
                                        </div>
                                    </Tooltip>
                                )
                            )}
                        </div>
                    )
                )}
            </div>
        </Box>
    );

    // Render
    return board;
}
