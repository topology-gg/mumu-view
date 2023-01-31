import styles from "../../styles/Home.module.css";
import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import MechState, { MechStatus, MechType } from "../types/MechState";
import Unit from "./unit";
import UnitState, { BgStatus, BorderStatus, UnitText } from "../types/UnitState";
import Grid from "../types/Grid";
import Operator, { OperatorState, OPERATOR_TYPES, PlacingFormula } from "../types/Operator";
import OperatorGridBg from "./OperatorGridBg";
import { Constraints, DEMO_SOLUTIONS, Modes, Lesson_names } from "../constants/constants";
import { useTranslation } from "react-i18next";
import "../../config/i18n";
import { Box, Button, Container, Tooltip } from "@mui/material";
import AtomState, { AtomType } from "../types/AtomState";
import { useSpring, animated } from "react-spring";
import MechUnit from "./MechUnit";
import LessonInstruction from "./lessonInstruction";

import SchoolIcon from "@mui/icons-material/School";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";

import SoundFont from '../modules/sf2-player/src';
import { FretBoard } from "../helpers/MuMuMusic/FretBoard";


interface BoardProps {
    mode: Modes;
    animationState: string;
    animationFrame: number;
    objective: string;
    instruction: string[];
    operatorStates: OperatorState[];
    operatorInputHighlight: boolean[];
    placingFormula?: PlacingFormula;
    unitStates: UnitState[][];
    consumableAtomTypes: AtomType[][];
    produceableAtomTypes: AtomType[][];
    mechStates: MechState[];
    atomStates: AtomState[];
    mechIndexHighlighted: number | undefined;
    handleMouseOver: (x: number, y: number) => void;
    handleMouseOut: () => void;
    handleUnitClick: (x: number, y: number) => void;
    playMidiNum: (mech_i: number, midi_num: number) => void,
    stopMidiNum: (midi_num: number) => void,
    consumedAtomIds: string[];
    producedAtomIds: string[];
    parentDim: number;
    hoveredGrid: Grid | null;
    spiritPreview : MechState[]
}

var fretboard = new FretBoard()
fretboard.calculateFrets()

export default function Board({
    mode,
    animationState,
    animationFrame,
    objective = "",
    instruction = [],
    operatorStates,
    operatorInputHighlight,
    placingFormula,
    unitStates,
    consumableAtomTypes,
    produceableAtomTypes,
    mechStates,
    atomStates,
    mechIndexHighlighted,
    handleMouseOver,
    handleMouseOut,
    handleUnitClick,
    playMidiNum,
    stopMidiNum,
    consumedAtomIds,
    producedAtomIds,
    parentDim,
    hoveredGrid,
    spiritPreview
}: BoardProps) {

    // render nothing if mechStates is not ready yet
    if (!mechStates) return <></>;

    // render nothing if parentDim is not set yet
    if (parentDim == null) return <></>;

    // Unpack constants given mode
    const DIM = Constraints[mode].DIM;

    // // React state tracking window dimension
    // const [windowInnerWidth, setWindowInnerWidth] = useState<number>(0);
    // const handleWindowResize = useCallback (event => {
    //     setWindowInnerWidth (window.innerWidth);
    // }, []);

    // useEffect(() => {
    //     window.addEventListener('resize', handleWindowResize);

    //     window.dispatchEvent(new Event('resize'));

    //     return () => {
    //         window.removeEventListener('resize', handleWindowResize);
    //     };
    // }, [handleWindowResize]);

    // notes played in previous frame
    const [lastSimulationNotes, setLastSimulationNotes] = useState<number[]>([]);
    // notes played by onMouseDown Grid cells
    const [lastPreviewNote, setLastPreviewNote] = useState<number>(null);

    const [currPreviewFrame, setCurrPreviewFrame] = useState<number[]>(mechStates.map(_ => {
        return 0
    }));


    useEffect(() => {
        setCurrPreviewFrame(mechStates.map(_ => {
            return 0
        }))
    }, [mechIndexHighlighted])

    useEffect(() => {
        const interval = setInterval(() => {
            if(currPreviewFrame[mechIndexHighlighted] < spiritPreview.length - 1)
            {   
                // Array copy in order to trigger rerender
                let updatedPreview = [...currPreviewFrame];
                updatedPreview[mechIndexHighlighted] = updatedPreview[mechIndexHighlighted] + 1;
                setCurrPreviewFrame(updatedPreview)
            }else{
                let updatedPreview = [...currPreviewFrame];
                updatedPreview[mechIndexHighlighted] = 0;
                setCurrPreviewFrame(updatedPreview)
            }
            
        }, 750)
        return () => clearInterval(interval);

    }, [currPreviewFrame, spiritPreview, mechIndexHighlighted])

    // build mapping from mech_i to possessed atom (if any)
    var possessedAtom = mechStates.map((_) => null);
    for (const atomState of atomStates) {
        if (atomState.possessed_by !== null) {
            const mech_i: number = +atomState.possessed_by.replace("mech", "");
            possessedAtom[mech_i] = atomState;
        }
    }

    // demostrate getting firing info on placed formulas when animationFrame changes
    useEffect(() => {
        operatorStates.forEach((operatorState, i) => {
            if (operatorState.firing) {
                console.log(`
                    At frame ${animationFrame}, Formula ${i} of type ${operatorState.operator.typ} is firing;
                    This formula spans the following input grids: ${JSON.stringify(operatorState.operator.input)},
                    and the following output grids: ${JSON.stringify(operatorState.operator.output)};
                    the substance types at inputs are as follows: ${JSON.stringify(operatorState.operator.typ.input_atom_types)},
                    and the substance types at outputs are as follows: ${JSON.stringify(operatorState.operator.typ.output_atom_types)}.
                `);

                switch( operatorState.operator.typ ) {

                    case OPERATOR_TYPES.STIR: // Stir - Change Chord Progression in Key
                        fretboard.setNewChord(
                            operatorState.operator.output[0].x,
                            operatorState.operator.output[0].y
                            );
                        console.log(fretboard.msg);
                        break;

                    case OPERATOR_TYPES.SHAKE: // Shake - Change Chord Progression in Key
                        fretboard.rotateFrets(
                            operatorState.operator.output[0].x,
                            operatorState.operator.output[0].y
                            );
                        console.log(fretboard.msg);
                        break;

                    case OPERATOR_TYPES.STEAM: //Steam - Reharmonizes the Musical Sequence
                        fretboard.changeScaleDegree(
                            (operatorState.operator.output[0].x + operatorState.operator.output[1].x) % 9,
                            (operatorState.operator.output[0].y + operatorState.operator.output[1].y) % 9
                            );
                        console.log(fretboard.msg);
                        break;

                    case OPERATOR_TYPES.SMASH:  // Smash - Flips the frets upside down
                        fretboard.flipFrets(
                            operatorState.operator.output[0].x,
                            operatorState.operator.output[0].y); //flips no matter the x,y inputs
                        console.log(fretboard.msg);
                        break;

                    case OPERATOR_TYPES.EVOLVE: // Evolve - Evolve the frets mapping
                        fretboard.changeTransposeDownNSteps(
                            operatorState.operator.output[0].x,
                            operatorState.operator.output[0].y
                            ); //rotate no matter the x,y inputs
                        console.log(fretboard.msg);
                        break;

                    case OPERATOR_TYPES.SLOW: // Slow - A chord change two steps that creates a dramatic dropping feeling
                        fretboard.changeTransposeDownTwoSteps(
                            (operatorState.operator.output[0].x + operatorState.operator.output[1].x) % 9,
                            (operatorState.operator.output[0].y + operatorState.operator.output[1].y) % 9
                            ); //rotate no matter the x,y inputs
                        console.log(fretboard.msg);
                        break;

                    case OPERATOR_TYPES.WILT: // Wilt - Changes From Major to Minor Goes from Light to Dark (and vice versa)
                        fretboard.changeQuality(
                            operatorState.operator.output[0].x,
                            operatorState.operator.output[0].y
                            ); //modulates no matter the x,y inputs
                        console.log(fretboard.msg);
                        break;

                    case OPERATOR_TYPES.BAKE: // Bake - Alters the intervals between adjecent grid coordinates
                        fretboard.changeFrets(
                            (operatorState.operator.output[0].x + operatorState.operator.output[1].x) % 9,
                            (operatorState.operator.output[0].y + operatorState.operator.output[1].y) % 9
                            ); //Change Fret Interval Structure
                        console.log(fretboard.msg);
                        break;

                    default:
                        fretboard.setNewChord(
                            operatorState.operator.output[0].x,
                            operatorState.operator.output[0].y
                        );
                        console.log(fretboard.msg);

                    }
            }
        })
    }, [animationFrame])


    // hardcoded frets for debug
    /*
    const frets = [
        [48, 50, 53, 55, 57, 60, 62, 65, 67, 69],
        [50, 53, 55, 57, 60, 62, 65, 67, 69, 72],
        [53, 55, 57, 60, 62, 65, 67, 69, 72, 74],
        [55, 57, 60, 62, 65, 67, 69, 72, 74, 77],
        [57, 60, 62, 65, 67, 69, 72, 74, 77, 79],
        [60, 62, 65, 67, 69, 72, 74, 77, 79, 81],
        [62, 65, 67, 69, 72, 74, 77, 79, 81, 84],
        [65, 67, 69, 72, 74, 77, 79, 81, 84, 86],
        [67, 69, 72, 74, 77, 79, 81, 84, 86, 89],
        [69, 72, 74, 77, 79, 81, 84, 86, 89, 91],
      ];
*/
    // firing note.play in parent
    useEffect(() => {

        // Reset FretBoard when game loop is stopped

        if(mode == Modes.daw && animationState=='Stop' && animationFrame==0 ){
            fretboard.setFretBoardToInitialState()
        }

        if (mode == Modes.daw && animationState=='Run'){

            var notes = []
            mechStates.forEach((mechState, mech_i) => {
                lastSimulationNotes.forEach(lastSimulationNote => {
                    stopMidiNum(lastSimulationNote);
                });

                // only open mech makes sound based on its location on the board
                if (mechState.status == MechStatus.OPEN){
                    //fretboard.setNewChord(Math.floor(Math.random() * 9),Math.floor(Math.random() * 9));
                    playMidiNum(mech_i, fretboard.frets[mechState.index.x][mechState.index.y]);
                    notes.push(fretboard.frets[mechState.index.x][mechState.index.y])
                }
            });
            setLastSimulationNotes(_ => notes);
        }
    }, [animationFrame]);

    const BOARD_BORDER_REM = 1;
    const BOARD_PADDING_REM = 1;
    const LAYOUT_PADDING_REM = 1;
    const GRID_DIVIDER = DIM <= 10 ? 10 : DIM;
    const GRID_DIM_REM: number = (
        parentDim
         - LAYOUT_PADDING_REM * 16
         - BOARD_BORDER_REM * 2 * 16
         - BOARD_PADDING_REM * 2 * 16
        ) / GRID_DIVIDER / 16 * 0.7;
    const UNIT_MARGIN_REM = GRID_DIM_REM / 10;
    // console.log ("GRID_DIM_REM:", GRID_DIM_REM);
    const BOX_DIM: number = DIM * GRID_DIM_REM + DIM * GRID_DIM_REM * UNIT_MARGIN_REM + GRID_DIM_REM;
    const BOARD_DIM: number = DIM * (GRID_DIM_REM + 2 * UNIT_MARGIN_REM) + BOARD_PADDING_REM; // unit is rem; reflect the dimensions, padding and margin set in CSS
    const board = (
        <div
            style={{
                width: `${BOARD_DIM}rem`,
                height: (mode !== Modes.arena) && (mode !== Modes.daw) ? `${BOARD_DIM+11}rem` : `${BOARD_DIM}rem`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                margin: '0 auto',
            }}
        >
            {(mode !== Modes.arena) && (mode !== Modes.daw) ? (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "left",
                        p: 2,
                        backgroundColor: "#ffffff",
                        mb: 3,
                        border: 1,
                        borderRadius: 4,
                        boxShadow: 3,
                        width: '40rem',
                        maxHeight: '11rem',
                        overflow: "hidden",
                    }}
                >
                    <ListItem sx={{ pl: 0, pt: 0 }}>
                        <ListItemIcon sx={{ minWidth: "30px" }}>
                            <SchoolIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>{Lesson_names[mode]}</ListItemText>
                    </ListItem>

                    <p
                        style={{
                            textAlign: "left",
                            fontSize: "0.85rem",
                            marginTop: "0",
                            marginBottom: "1.3rem",
                        }}
                    >
                        Objective: {objective}
                    </p>

                    <LessonInstruction lesson={mode} />
                </Box>
            ) : null}

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: `${BOARD_DIM}rem`,
                    height:`${BOARD_DIM}rem`,
                    border: `${BOARD_BORDER_REM}rem`,
                    borderRadius: 4,
                    boxShadow: 3,
                    backgroundColor: "#FDF5E6",
                }}
            >
                <div
                    className={styles.grid_parent}
                    style={{
                        padding:`${BOARD_PADDING_REM}rem`
                    }}
                >
                    <OperatorGridBg
                        operators={operatorStates.map(oS => oS.operator)}
                        highlighted={operatorInputHighlight}
                        placingFormula={placingFormula}
                        dim={DIM}
                    />

                    {mechStates.map((mechState, mech_i) => (
                        mech_i != mechIndexHighlighted ? 
                        <MechUnit
                            mechState={mechState} possessedAtom={possessedAtom[mech_i]}
                            gridDimensionRem={GRID_DIM_REM}
                            unitMarginRem={UNIT_MARGIN_REM}
                            isTransparent={mechIndexHighlighted >= 0? true : false}
                            key={mech_i}
                        />  : null
                    ))}

                    {mechIndexHighlighted >= 0 ? <MechUnit
                            key={mechIndexHighlighted}
                            mechState={spiritPreview[currPreviewFrame[mechIndexHighlighted]]} possessedAtom={null}
                            gridDimensionRem={GRID_DIM_REM}
                            unitMarginRem={UNIT_MARGIN_REM}
                            isTransparent={false}
                        /> : null}

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
                                    ) => {
                                        // if (unitStates[j][i].unit_id !== null) console.log(unitStates[j][i].unit_id)
                                        const isConsumed =
                                            unitStates[j][i].unit_id == null
                                                ? false
                                                : !consumedAtomIds
                                                ? false
                                                : consumedAtomIds.includes(unitStates[j][i].unit_id);
                                        const isProduced =
                                            unitStates[j][i].unit_id == null
                                                ? false
                                                : !producedAtomIds
                                                ? false
                                                : producedAtomIds.includes(unitStates[j][i].unit_id);

                                        if (isConsumed) console.log(`isConsumed at (i,j)=(${i},${j})`);
                                        if (isProduced) console.log(`isProduced at (i,j)=(${i},${j})`);

                                        const rawUnit = (
                                            <div key={`${j}-${i}`}>
                                                <Unit
                                                    key={`unit-${j}-${i}`}
                                                    state={unitStates[j][i]}
                                                    consumableAtomType={consumableAtomTypes[j][i]}
                                                    produceableAtomType={produceableAtomTypes[j][i]}
                                                    handleMouseOver={() => handleMouseOver(j, i)}
                                                    handleMouseOut={() => {handleMouseOut()}}
                                                    onMouseDown={() => {
                                                        if (mode == Modes.daw) {
                                                            stopMidiNum(lastPreviewNote);
                                                             const note = fretboard.frets[j][i]
                                                            //const note = frets[j][i]
                                                            playMidiNum(-1, note);
                                                            setLastPreviewNote(_ => note);
                                                        }
                                                    }}
                                                    onClick={() => {handleUnitClick(j, i)}}
                                                    mechHighlight={false}
                                                    isSmall={false}
                                                    isConsumed={isConsumed}
                                                    isProduced={isProduced}
                                                    gridDimensionRem={GRID_DIM_REM}
                                                    marginRem={UNIT_MARGIN_REM}
                                                    isHovered={hoveredGrid ? (hoveredGrid.x == j)&&(hoveredGrid.y == i) : false}
                                                />
                                            </div>
                                        )

                                        return (
                                            <Tooltip
                                                key={`tooltip-unit-${j}-${i}`}
                                                title={`${j},${i}`}
                                                disableInteractive
                                                arrow
                                                enterDelay={0}
                                                leaveDelay={0}
                                                TransitionProps={{ timeout: 100 }}
                                            >
                                                {rawUnit}
                                            </Tooltip>
                                        );

                                    }
                                )}
                            </div>
                        )
                    )}
                </div>
            </Box>
        </div>
    );

    // Render
    return board;
}
