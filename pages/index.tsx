import Head from "next/head";
import React, { useState, useMemo, useEffect } from "react";
import simulator from "../src/components/simulator";
import MechState, { MechPositionPlacing, MechStatus, MechType } from "../src/types/MechState";
import AtomState, { AtomStatus, AtomType } from "../src/types/AtomState";
import AtomFaucetState, { PlacingAtomFaucet } from "../src/types/AtomFaucetState";
import AtomSinkState, { PlacingAtomSink } from "../src/types/AtomSinkState";
import BoardConfig from "../src/types/BoardConfig";
import Frame from "../src/types/Frame";

import UnitState, { BgStatus, BorderStatus, UnitText } from "../src/types/UnitState";
import Grid from "../src/types/Grid";
import Operator, { OperatorState, OPERATOR_TYPES, PlacingFormula } from "../src/types/Operator";
import Delivery from "../src/components/delivery";
import Summary from "../src/components/summary";
import { isGridOOB, areGridsNeighbors } from "../src/helpers/gridHelpers";
import {
    BLANK_COLOR,
    Modes,
    Constraints,
    BLANK_SOLUTION,
    DEMO_SOLUTIONS,
    ANIM_FRAME_LATENCY_NON_DAW,
    ANIM_FRAME_LATENCY_DAW,
    Lesson_instruction,
    Lesson_objective,
    SOUNDFONT_FILENAME
} from "../src/constants/constants";
import { useTranslation } from "react-i18next";
import "../config/i18n";
import { useAccount, useStarknetExecute, useTransactionReceipt } from "@starknet-react/core";
import packSolution, { programsToInstructionSets } from "../src/helpers/packSolution";
import { SIMULATOR_ADDR } from "../src/components/SimulatorContract";
import Solution from "../src/types/Solution";

import { Box } from "@mui/material";
import MechProgramming from "../src/components/MechProgramming";
import Layout from "../src/components/Layout";
import LoadSave from "../src/components/LoadSave";

import FormulaBlueprint from "../src/components/FormulaBlueprint";
import { atomTypeToFreeBgStatus, placingFormulaToOperator } from "../src/helpers/typeMapping";
import Board from "../src/components/board";
import SoundFont from '../src/modules/sf2-player/src';
import FormulaRow from "../src/components/FormulaRow";

import CoverScreen from "../src/components/CoverScreen";
import CoverScreenFront from "../src/components/CoverScreenFront";
import previewSpirit from "../src/components/SpiritPreview";

export default function Home() {
    const { t } = useTranslation();

    // React state for current mode (which lessons of tutorial, or arena mode)
    // note: this impacts many components - board, mid screen control, programming components etc
    const [currMode, setCurrMode] = useState<Modes>(Modes.arena);

    // Constants unpack from current mode
    const DIM = Constraints[currMode].DIM;
    const PROGRAM_SIZE_MAX = Constraints[currMode].PROGRAM_SIZE_MAX;
    const MAX_NUM_MECHS = Constraints[currMode].MAX_NUM_MECHS;
    const MAX_NUM_OPERATORS = Constraints[currMode].MAX_NUM_OPERATORS;
    const N_CYCLES = Constraints[currMode].N_CYCLES;
    const ATOMS = Constraints[currMode].ATOMS;
    const MODE_OBJECTIVE = currMode == Modes.arena ? "" : Lesson_objective[currMode];
    const MODE_INSTRUCTION = currMode == Modes.arena ? [] : Lesson_instruction[currMode];

    // Other constants
    const INIT_PROGRAM = "";
    const INIT_DESCRIPTION = "New Spirit";
    var unitStatesInit = [];
    for (var x = 0; x < DIM; x++) {
        unitStatesInit.push(
            Array(DIM).fill({
                bg_status: BgStatus.EMPTY,
                border_status: BorderStatus.EMPTY,
                unit_text: UnitText.GRID,
                unit_id: null,
            })
        );
    }

    // React states for mechs, programs and descriptions
    const [programs, setPrograms] = useState<string[]>(BLANK_SOLUTION.programs);
    const [mechInitPositions, setMechInitPositions] = useState<Grid[]>(BLANK_SOLUTION.mechs.map((mech) => mech.index));
    const [mechDescriptions, setMechDescriptions] = useState<string[]>(
        BLANK_SOLUTION.mechs.map((mech) => mech.description)
    );
    const [spiritPreview, setSpiritPreview] = useState<MechState[]>([]);

    const [placingMech, setPlacingMech] = useState<MechPositionPlacing | null>(null);
    const [isEditingMechIndex, setIsEditingMechIndex] = useState<number | null>(null);
    const [cachedMechPos, setCachedMechPos] = useState<Grid | null>(null);
    const numMechs = programs.length;

    // React states for operators
    const [operators, setOperators] = useState<Operator[]>(BLANK_SOLUTION.operators);
    const [placingFormula, setPlacingFormula] = useState<PlacingFormula>();
    const numOperators = operators.length;

    // React states for faucets and sinks
    const DEFAULT_FAUCETS = Constraints[currMode].FAUCETS;
    const DEFAULT_SINKS = Constraints[currMode].SINKS;
    const [cachedFaucetPos, setCachedFaucetPos] = useState<Grid>(null);
    const [cachedSinkPos, setCachedSinkPos] = useState<Grid>(null);
    const [isEditingFaucetIndex, setIsEditingFaucetIndex] = useState<number | null>(null);
    const [isEditingSinkIndex, setIsEditingSinkIndex] = useState<number | null>(null);
    const [placedFaucets, setPlacedFaucets] = useState<AtomFaucetState[]>(DEFAULT_FAUCETS);
    const [placedSinks, setPlacedSinks] = useState<AtomSinkState[]>(DEFAULT_SINKS);
    const [placingFaucet, setPlacingFaucet] = useState<PlacingAtomFaucet>();
    const [placingSink, setPlacingSink] = useState<PlacingAtomSink>();
    const [hoveredGrid, setHoveredGrid] = useState<Grid | null>();

    // React states for animation control
    const [animationState, setAnimationState] = useState("Stop");
    const [animationFrame, setAnimationFrame] = useState<number>(0);
    const [frames, setFrames] = useState<Frame[]>();
    const [loop, setLoop] = useState<NodeJS.Timer>();
    const [viewSolution, setViewSolution] = useState<Solution>(BLANK_SOLUTION);

    // React states for UI
    const [gridHovering, setGridHovering] = useState<[string, string]>(["-", "-"]);

    let operatorInputHighlightInit: boolean[] = Array(numOperators).fill(false);
    const [operatorInputHighlight, setOperatorInputHighlight] = useState<boolean[]>(operatorInputHighlightInit);

    const [mechIndexHighlighted, setMechIndexHighlighted] = useState<number | undefined>(undefined);

    // React states for DAW mode
    const [mechVelocities, setMechVelocities] = useState<number[]>([]);
    const [musicTitle, setMusicTitle] = useState<string>('');
    const [sfLoaded, setSfLoaded] = useState<boolean>(false);
    const [sf, setSF] = useState(new SoundFont());
    const [sfBanks, setSfBanks] = useState([]);
    const [sfPrograms, setSfPrograms] = useState([]);
    const [mechSfProgramIds, setMechSfProgramIds] = useState([]);

    //
    // States derived from React states
    //
    const isPlacingSomething = placingFaucet || placingSink || placingMech;
    const runnable = isRunnable();
    const mechInitStates: MechState[] = mechInitPositions.map((pos, mech_i) => {
        return {
            status: MechStatus.OPEN,
            index: pos,
            id: `mech${mech_i}`,
            typ: MechType.SINGLETON,
            description: mechDescriptions[mech_i],
            pc_next: 0,
        };
    });
    const atomInitStates: AtomState[] = ATOMS.map(function (atom, i) {
        return {
            status: AtomStatus.FREE,
            index: atom.index,
            id: `atom${i}`,
            typ: atom.typ,
            possessed_by: null,
        };
    });
    const frame = frames?.[animationFrame];
    const atomStates = frame?.atoms || atomInitStates;
    const mechStates = !frame ? mechInitStates : (animationState=='Stop' && animationFrame==0) ? mechInitStates : frame.mechs;
    const [currPreviewFrame, setCurrPreviewFrame] = useState<number[]>(mechStates.map(_ => {
        return 0
    }));
    const operatorStates: OperatorState[] = !frame ? operators.map(o => {
        return {operator:o, firing:false} as OperatorState
    }) : frame.operatorStates
    const unitStates = setVisualForStates(atomStates, mechStates, unitStatesInit) as UnitState[][];

    let consumableAtomTypes: AtomType[][] = Array.from({ length: DIM }).map(
        _ => Array.from({ length: DIM }).map(_ => null)
    )
    for (const operator of operators){
        operator.input.forEach((grid, i) => {consumableAtomTypes[grid.x][grid.y] = operator.typ.input_atom_types[i]})
    }
    let produceableAtomTypes: AtomType[][] = Array.from({ length: DIM }).map(
        _ => Array.from({ length: DIM }).map(_ => null)
    )
    for (const operator of operators){
        operator.output.forEach((grid, i) => {produceableAtomTypes[grid.x][grid.y] = operator.typ.output_atom_types[i]})
    }

    const delivered = frame?.delivered_accumulated;
    const cost_accumulated = frame?.cost_accumulated || 0;
    const consumedAtomIds = frame?.consumed_atom_ids;
    const producedAtomIds = frame?.produced_atom_ids;

    let mech_carries: BgStatus[] = Array(mechInitPositions.length).fill(BgStatus.EMPTY);
    atomStates.forEach((atom: AtomState, atom_i: number) => {
        if (atom.status == AtomStatus.POSSESSED) {
            const mech_index: number = Number(atom.possessed_by.replace("mech", ""));

            let bgStatus: BgStatus;
            if (atom.typ == AtomType.VANILLA) {
                bgStatus = BgStatus.ATOM_VANILLA_FREE;
            } else if (atom.typ == AtomType.CHOCOLATE) {
                bgStatus = BgStatus.ATOM_CHOCOLATE_FREE;
            } else if (atom.typ == AtomType.HAZELNUT) {
                bgStatus = BgStatus.ATOM_HAZELNUT_FREE;
            } else if (atom.typ == AtomType.TRUFFLE) {
                bgStatus = BgStatus.ATOM_TRUFFLE_FREE;
            } else if (atom.typ == AtomType.SAFFRON) {
                bgStatus = BgStatus.ATOM_SAFFRON_FREE;
            } else if (atom.typ == AtomType.TURTLE) {
                bgStatus = BgStatus.ATOM_TURTLE_FREE;
            } else if (atom.typ == AtomType.SANDGLASS) {
                bgStatus = BgStatus.ATOM_SANDGLASS_FREE;
            } else if (atom.typ == AtomType.WILTED) {
                bgStatus = BgStatus.ATOM_WILTED_FREE;
            }

            mech_carries[mech_index] = bgStatus;
        }
    });

    // Load soundfont
    const handleSetSfFile = async (file) => {
        await sf.loadSoundFontFromFile(file);
        sf.bank = sf.banks[0]['id'];
        sf.program = sf.programs[0]['id'];
        setSfLoaded((_) => true);
    }
    const loadSfFileFromURL = async (file) => {
        if (sfLoaded) return;

        await sf.loadSoundFontFromURL(file);
        sf.bank = sf.banks[0]['id'];
        sf.program = sf.programs[0]['id'];
        setSfLoaded((_) => true);
        setSfPrograms((_) => sf.programs);
    }
    const loadSoundfont = async () => {
        await loadSfFileFromURL(`/${SOUNDFONT_FILENAME}`);
        setMechSfProgramIds((_) => BLANK_SOLUTION.mechs.map((_) => sfPrograms[0].id));
    }
    useEffect(() => {
        loadSoundfont ();
    }, [])


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
            
        }, ANIM_FRAME_LATENCY_DAW)
        return () => clearInterval(interval);

    }, [currPreviewFrame, spiritPreview, mechIndexHighlighted])

    // React useMemo
    const calls = useMemo(() => {
        let instructionSets = programsToInstructionSets(programs);
        const args = isPlacingSomething ? [] : packSolution(
            instructionSets,
            mechInitPositions,
            mechDescriptions,
            operators,
            currMode == Modes.daw ? musicTitle : '',
            currMode == Modes.daw ? mechVelocities : mechInitPositions.map(_ => 0),
            placedFaucets.map(f => f.index),
            placedSinks.map(s => s.index),
        );
        // console.log ('> musicTitle to submit:', musicTitle)
        // console.log ('> mechVelocities to submit:', mechVelocities)
        // console.log ('> useMemo: args =', args)

        const tx = {
            contractAddress: SIMULATOR_ADDR,
            entrypoint: "simulator",
            calldata: args,
        };
        return [tx];
    }, [
        programs, mechInitPositions, mechDescriptions,
        operators, musicTitle, mechVelocities,
        placedFaucets, placedSinks
    ]);

    ////////////////////

    //
    // Style the Run button based on solution legality == operator placement legality && mech initial placement legality
    //
    function isRunnable() {
        if (isPlacingSomething) return false;

        // impurity by dependencies: operatorStates, mechInitPosition, programs
        if (!isOperatorPlacementLegal()) {
            console.log("> simulation not runnable because of operator placement illegality");
            return false;
        }
        if (!isMechInitialPlacementLegal()) {
            console.log("> simulation not runnable because of mech initial placement illegality");
            return false;
        }

        for (const program of programs) {
            const instructions = program.split(",") as string[];
            if (instructions.length > PROGRAM_SIZE_MAX) return false;
        }

        return true;
    }

    //
    // Definition of setting DOM state
    //
    function setVisualForStates(atomStates: AtomState[], mechStates: MechState[], states: UnitState[][]) {
        let newStates = JSON.parse(JSON.stringify(states)); // duplicate

        for (const atom of atomStates) {
            newStates = setAtomVisualForStates(atom, newStates);
        }
        for (const mech of mechStates) {
            newStates = setMechVisualForStates(mech, newStates);
        }

        newStates = setConfigVisualForStates(newStates);

        return newStates;
    }

    //
    // Definition of setting mech's visual to DOM state
    //
    function setMechVisualForStates(mech: MechState, states: UnitState[][]) {
        // duplicate
        let newStates: UnitState[][] = JSON.parse(JSON.stringify(states));

        // if this mech has undefined position, return
        if (mech.index == null) return newStates;

        // if this mech is positioned illegally, don't render it
        if (isGridOOB(mech.index, DIM)) {
            return newStates;
        }

        // newStates[mech.index.x][mech.index.y].unit_id = mech.id;
        if (mech.status == MechStatus.OPEN) {
            newStates[mech.index.x][mech.index.y].border_status = BorderStatus.SINGLETON_OPEN;
        } else {
            newStates[mech.index.x][mech.index.y].border_status = BorderStatus.SINGLETON_CLOSE;
        }
        return newStates;
    }

    //
    // Definition of setting atom's visual to DOM state
    //
    function setAtomVisualForStates(atom: AtomState, states: UnitState[][]) {
        let newStates: UnitState[][] = JSON.parse(JSON.stringify(states)); // duplicate
        newStates[atom.index.x][atom.index.y].unit_id = atom.id;
        newStates[atom.index.x][atom.index.y].unit_text = UnitText.EMPTY;

        if (atom.status == AtomStatus.FREE) {
            newStates[atom.index.x][atom.index.y].bg_status = atomTypeToFreeBgStatus(atom.typ);
        }
        return newStates;
    }

    //
    // Function to check operator placement validity
    // Note: surfaced by Dham playtesting in Lisbon prior to the MovyMovy talk
    //
    function isOperatorPlacementLegal() {
        // impurity by dependencies: operatorStates, constants such as faucet and sink positions

        if (!operators) return false;
        if (isAnyOperatorPositionInvalid(operators)) return false;

        for (const operator of operators) {
            if (isOperatorPositionInvalid(operator)) return false;
        }

        return true;
    }

    //
    // Function to check mech initial placement validity
    //
    function isMechInitialPlacementLegal() {
        for (const pos of mechInitPositions) {
            if (isGridOOB(pos, DIM)) return false;
        }
        return true;
    }

    //
    // Definition of setting config's visual to DOM state (operators, faucets, sinks)
    //
    function setConfigVisualForStates(states: UnitState[][]) {
        let newStates = JSON.parse(JSON.stringify(states)); // duplicate

        // Faucet & Sink
        for (const faucet_pos of placedFaucets.map(f => f.index)) {
            if (faucet_pos == null) continue;
            newStates[faucet_pos.x][faucet_pos.y].unit_text = UnitText.FAUCET;
        }

        for (const sink_pos of placedSinks.map(s => s.index)) {
            if (sink_pos == null) continue;
            newStates[sink_pos.x][sink_pos.y].unit_text = UnitText.SINK;
        }

        // Operators
        if (operators && !isAnyOperatorPositionInvalid(operators)) {
            for (const operator of operators) {
                if (isOperatorPositionInvalid(operator)) continue;

                for (const grid of operator.input) {
                    newStates[grid.x][grid.y].unit_text = operator.typ.symbol;
                }
                for (const grid of operator.output) {
                    newStates[grid.x][grid.y].unit_text = UnitText.OUTPUT;
                }
            }
        }

        return newStates;
    }

    function isAnyOperatorPositionInvalid(operators: Operator[]): boolean {
        // Check that the current adder's a,b,z + faucet's loc + sink's loc + all other operators' locs are all unique values,
        // otherwise, return true (adder position invalid)
        // note: Set() works for primitive types, hence stringify index object into string
        var adder_indices_in_str = [];
        operators.forEach(function (operator: Operator) {
            for (const grid of operator.input) {
                if (isNaN(grid.x) || isNaN(grid.y)) return false;
                adder_indices_in_str = [...adder_indices_in_str, JSON.stringify(grid)];
            }
            for (const grid of operator.output) {
                if (isNaN(grid.x) || isNaN(grid.y)) return false;
                adder_indices_in_str = [...adder_indices_in_str, JSON.stringify(grid)];
            }
        });

        let faucet_sink_indices_in_str = placedSinks.map(s => JSON.stringify(s.index));
        faucet_sink_indices_in_str = faucet_sink_indices_in_str.concat(placedFaucets.map(f => JSON.stringify(f.index)));

        const all_indices = adder_indices_in_str.concat(faucet_sink_indices_in_str);
        const unique_indices = all_indices.filter(onlyUnique);

        // if unique operation reduces array length, we have duplicate indices
        if (all_indices.length != unique_indices.length) {
            return true;
        }

        return false;
    }

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    function isOperatorPositionInvalid(operator: Operator): boolean {
        const grid_array = operator.input.concat(operator.output);
        for (const grid of grid_array) {
            if (isGridOOB(grid, DIM)) return true;
        }

        // Each operator grid needs to be neighbor with the next grid
        return Array.from({ length: grid_array.length - 1 }).some((_, i) => {
            return !areGridsNeighbors(grid_array[i], grid_array[i + 1]);
        });
    }

    // Handle click event for adding/removing mechs
    function handleMechClick(mode: string) {
        if (animationState != "Stop") return; // only when in Stop mode can player add/remove mechs
        if (isPlacingSomething) return;

        if (mode === "+" && numMechs < MAX_NUM_MECHS) {
            setPlacingMech((_) => {
                return { index: null, complete: false } as MechPositionPlacing;
            })
        }
    }
    function handleEditMechClick() {

    }

    // Handle click even for addming/removing Adder (operator)
    function handleOperatorClick(mode: string, typ: string) {
        if (animationState !== "Stop") return;

        if (mode === "+" && numOperators < MAX_NUM_OPERATORS) {
            setPlacingFormula({ type: typ, grids: [] });
        } else if (mode === "-" && numOperators > 0) {
            setOperators((prev) => {
                let prev_copy: Operator[] = JSON.parse(JSON.stringify(prev));
                prev_copy.pop();
                return prev_copy;
            });
        }
    }
    function handleFormulaDelete(operator_i) {
        setOperators((prev) => {
            let prev_copy: Operator[] = JSON.parse(JSON.stringify(prev));
            prev_copy.splice(operator_i, 1);
            return prev_copy;
        });
    }

    //
    // Handle click event for animation control
    //
    function handleClick(mode: string) {
        if (mode == "NextFrame" && animationState != "Run") {
            if (!frames) return;
            setAnimationFrame((prev) => (prev < N_CYCLES ? prev + 1 : prev));
        } else if (mode == "PrevFrame" && animationState != "Run") {
            if (!frames) return;
            setAnimationFrame((prev) => (prev > 0 ? prev - 1 : prev));
        }

        // Run simulation
        else if (mode == "ToggleRun") {
            // If in Run => go to Pause
            if (animationState == "Run") {
                clearInterval(loop); // kill the timer
                setAnimationState("Pause");
            }

            // If in Pause => resume Run without simulation
            else if (animationState == "Pause") {
                // Begin animation
                setAnimationState("Run");
                const latency = currMode == Modes.daw ? ANIM_FRAME_LATENCY_DAW : ANIM_FRAME_LATENCY_NON_DAW
                setLoop(
                    setInterval(() => {
                        simulationLoop(frames);
                    }, latency)
                );
            }

            // If in Stop => perform simulation then go to Run
            else if (animationState == "Stop" && runnable) {
                // Parse program into array of instructions and store to react state
                let instructionSets = programsToInstructionSets(programs);
                console.log("running instructionSets", instructionSets);

                // Prepare input
                const boardConfig: BoardConfig = {
                    dimension: DIM,
                    atom_faucets: placedFaucets.map((f, index) => {
                        return {
                            id: `atom_faucet${index}`,
                            typ: f.typ,
                            index: { x: f.index.x, y: f.index.y },
                        };
                    }),
                    atom_sinks: placedSinks.map((s, index) => {
                        return {
                            id: `atom_sink${index}`,
                            index: { x: s.index.x, y: s.index.y },
                        };
                    }),
                    operators: operators,
                };

                // Run simulation to get all frames and set to reference
                const simulatedFrames = simulator(
                    N_CYCLES, // n_cycles,
                    mechInitStates,
                    atomInitStates,
                    instructionSets, // instructions
                    boardConfig
                ) as Frame[];
                setFrames(simulatedFrames);

                simulatedFrames.forEach((f: Frame, frame_i: number) => {
                    // const s = f.atoms.map(function(v){return JSON.stringify(v)}).join('\n')
                    // console.log(frame_i, f.atoms)
                    // console.log(frame_i, f.notes)
                });
                const final_delivery = simulatedFrames[simulatedFrames.length - 1].delivered_accumulated;

                // Begin animation
                setAnimationState("Run");
                const latency = currMode == Modes.daw ? ANIM_FRAME_LATENCY_DAW : ANIM_FRAME_LATENCY_NON_DAW
                setLoop(
                    setInterval(() => {
                        simulationLoop(simulatedFrames);
                    }, latency)
                );
                // console.log('Running with instruction:', instructions)
            }
        } else {
            // Stop
            clearInterval(loop); // kill the timer
            setAnimationState("Stop");
            setAnimationFrame((_) => 0);
        }
    }

    function setOperator(operator_i: number, new_operator: Operator) {
        setOperators((prev) => {
            let prev_copy = JSON.parse(JSON.stringify(prev));
            prev_copy[operator_i] = new_operator;
            return prev_copy;
        });
    }

    const simulationLoop = (frames: Frame[]) => {
        setAnimationFrame((prev) => {
            if (prev >= frames.length - 1) {
                return 0;
            } else {
                return prev + 1;
            }
        });
    };

    function handleSlideChange(evt) {
        if (animationState == "Run") return;

        const slide_val: number = parseInt(evt.target.value);
        setAnimationFrame(slide_val);
    }

    function handleMouseOver(i: number, j: number) {
        const gridString: [string, string] = [i.toString(), j.toString()];
        setGridHovering(gridString);
    }

    function handleMouseOut() {
        setGridHovering(["-", "-"]);
    }

    function handleMechNoteVelocityChange (mech_i: number, value: number) {
        setMechVelocities (prev => {
            let prev_copy: number[] = JSON.parse(JSON.stringify(prev));
            prev_copy[mech_i] = value
            return prev_copy;
        })
    }
    function handleMechSfProgramChange (mech_i: number, sfProgramId) {
        setMechSfProgramIds (prev => {
            let prev_copy: number[] = JSON.parse(JSON.stringify(prev));
            prev_copy[mech_i] = sfProgramId;
            return prev_copy;
        });
    }
    function handleMusicTitleChange(value) {
        if (value.length > 31) return;
        setMusicTitle ((_) => value);
    }

    async function handleLoadSolutionClick(solutionMode: string, viewSolution: Solution) {
        console.log('viewSolution:', viewSolution)
        // Switch to solutionMode first
        setCurrMode((_) => (solutionMode as Modes));

        // If daw mode => load default soundfont
        await loadSfFileFromURL(`/${SOUNDFONT_FILENAME}`);
        if (solutionMode == Modes.daw) {
            setMechVelocities((_) => viewSolution.volumes)

            //
            // TODO: update Cairo side interface to allow specification of per-mech sound font program
            //
            setMechSfProgramIds((_) => viewSolution.volumes.map(_ => sfPrograms[0].id))

            console.log('volumes:',viewSolution.volumes)
        }

        if (animationState != "Stop") {
            setAnimationState((_) => "Stop");
            clearInterval(loop); // kill the timer
        }
        setViewSolution((prev) => viewSolution);

        // set react states to render the solution on the board
        setPrograms((prev) => viewSolution.programs);
        setMechInitPositions((prev) => viewSolution.mechs.map((mech) => mech.index));
        setMechDescriptions((prev) => viewSolution.mechs.map((mech) => mech.description));
        setOperators((prev) => viewSolution.operators);
        setAnimationFrame((prev) => 0);
        setFrames((_) => null);
        setPlacingFormula((_) => null);
    }

    function handleMouseOverOperatorInput(operator_i: number) {
        let newHighlight = Array(numOperators).fill(false);

        newHighlight[operator_i] = true;

        setOperatorInputHighlight((prev) => newHighlight);
    }

    function handleMouseOutOperatorInput(operator_i: number) {
        let newHighlight = [];
        for (let i = 0; i < numOperators; i++) {
            newHighlight.push(false);
        }
        setOperatorInputHighlight((prev) => newHighlight);
    }

    function handleUnitClick(x: number, y: number) {
        if (placingFormula) {
            setPlacingFormula((prev) => {
                const newPlacingFormula = { ...prev, grids: [...prev.grids, { x, y }] };
                const operator = placingFormulaToOperator(newPlacingFormula);

                // Check validity of operator
                if (operator.output.length > operator.typ.output_atom_types.length) return prev;
                if (isAnyOperatorPositionInvalid([...operators, operator])) return prev;
                if (isOperatorPositionInvalid(operator)) return prev;

                const complete = operator.output.length === operator.typ.output_atom_types.length;

                return { ...newPlacingFormula, complete };
            });
            return;
        }
        if (placingFaucet) {
            setPlacingFaucet((prev) => {
                // fabricate a fake operator for the purpose of checking position validity
                const fakeOperator: Operator = {input:[{ x,y }], output:[], typ:OPERATOR_TYPES.STIR};
                if (isAnyOperatorPositionInvalid([...operators, fakeOperator])) return prev;

                // if editing => update placed values directly
                if (isEditingFaucetIndex !== null){
                    setPlacedFaucets((prev) => {
                        let prev_copy: AtomFaucetState[] = JSON.parse(JSON.stringify(prev));
                        prev_copy[isEditingFaucetIndex].index = {x,y};
                        return prev_copy;
                    });
                }

                return {id:prev.id, typ:prev.typ, index:{x,y}, complete:true};
            });
            return;
        }
        if (placingSink) {
            setPlacingSink((prev) => {
                // fabricate a fake operator for the purpose of checking position validity
                const fakeOperator: Operator = {input:[{ x,y }], output:[], typ:OPERATOR_TYPES.STIR};
                if (isAnyOperatorPositionInvalid([...operators, fakeOperator])) return prev;

                // if editing => update placed values directly
                if (isEditingSinkIndex !== null){
                    setPlacedSinks((prev) => {
                        let prev_copy: AtomSinkState[] = JSON.parse(JSON.stringify(prev));
                        prev_copy[isEditingSinkIndex].index = {x,y};
                        return prev_copy;
                    });
                }

                return {id:prev.id, index:{x,y}, complete:true};
            });
            return;
        }
        if (placingMech) {
            setPlacingMech((prev) => {

                // if editing => update placed values directly
                if (isEditingMechIndex !== null) {
                    setMechInitPositions((prev) => {
                        let prev_copy: Grid[] = JSON.parse(JSON.stringify(prev));
                        prev_copy[isEditingMechIndex] = {x,y};
                        return prev_copy;
                    })
                }

                return {index:{x,y}, complete:true};
            })
        }

        return;
    }

    function handleConfirmFormula() {
        setOperators((prev) => [...prev, placingFormulaToOperator(placingFormula)]);
        setPlacingFormula(null);
    }
    function handleCancelFormula() {
        setPlacingFormula(null);
    }

    async function handleLoadModeClick(mode: Modes) {
        // reset various states
        setAnimationState((_) => "Stop");
        clearInterval(loop); // kill the timer

        setAnimationFrame((_) => 0);
        setFrames((_) => null);
        setPlacingFormula((_) => null);
        setPlacingFaucet((_) => null);
        setPlacingSink((_) => null);
        setPrograms((_) => BLANK_SOLUTION.programs);
        setMechInitPositions((_) => BLANK_SOLUTION.mechs.map((mech) => mech.index));
        setMechDescriptions((_) => BLANK_SOLUTION.mechs.map((mech) => mech.description));
        setOperators((_) => BLANK_SOLUTION.operators);

        // set current mode
        setCurrMode((_) => mode);

        // set faucets and sinks
        setPlacedFaucets((_) => Constraints[mode].FAUCETS);
        setPlacedSinks((_) => Constraints[mode].SINKS);
    }

    // Lazy style objects
    const makeshift_button_style = { marginLeft: "0.2rem", marginRight: "0.2rem", height: "1.5rem" };
    const makeshift_run_button_style = runnable
        ? makeshift_button_style
        : { ...makeshift_button_style, color: "#CCCCCC" };

    const loadSave = (
        <LoadSave
            mode={currMode}
            onLoadSolutionClick={handleLoadSolutionClick}
            mechInitStates={mechInitStates}
            operators={operators}
            programs={programs}
            volumes={currMode == Modes.daw ? mechVelocities : mechInitStates.map((_) => 0)}
        />
    );

    const playMidiNum = (mech_i: number, midi_num: number) => {

        if (!sfLoaded) {
            setAnimationState((_) => 'Stop');
            alert('Please load a soundfont first!');
            return;
        }

        var velocity
        if (mech_i == -1) velocity = 96 // note: midi velocity range is 0-127
        else velocity = mechVelocities[mech_i]

        if (mech_i == -1) {
            // from board onClick
            sf.program = sfPrograms[0].id;
        }
        else {
            // grab the sound font for this mech
            sf.program = mechSfProgramIds[mech_i];
            // sf.program = sfPrograms[1].id;
        }
        // console.log('playMidiNum sf program id:', sf.program)
        sf.noteOn(midi_num, velocity, 0);
    }

    const stopMidiNum = (midi_num: number) => {

        if (!sfLoaded) return;

        sf.noteOff(midi_num, 0, 0);
    }

    const board = (parentDim) => <Board
        mode={currMode}
        animationState={animationState}
        animationFrame={animationFrame}
        objective={MODE_OBJECTIVE}
        instruction={MODE_INSTRUCTION}
        operatorStates = {operatorStates}
        operatorInputHighlight = {operatorInputHighlight}
        placingFormula = {placingFormula}
        unitStates = {unitStates}
        consumableAtomTypes = {consumableAtomTypes}
        produceableAtomTypes = {produceableAtomTypes}
        mechStates = {mechStates}
        atomStates = {atomStates}
        mechIndexHighlighted = {mechIndexHighlighted}
        handleMouseOver = {(x,y) => handleMouseOver(x,y)}
        handleMouseOut = {() => handleMouseOut()}
        handleUnitClick = {(x,y) => handleUnitClick(x,y)}
        consumedAtomIds = {consumedAtomIds}
        producedAtomIds = {producedAtomIds}
        playMidiNum = {playMidiNum}
        stopMidiNum = {stopMidiNum}
        parentDim = {parentDim}
        hoveredGrid = {hoveredGrid}
        spiritPreview = {spiritPreview}
        currPreviewFrame = {currPreviewFrame}
    />

    const stats_box_sx = {
        p:'1rem',backgroundColor:BLANK_COLOR,fontSize:'0.75rem',alignItems:'center',
        border: 1, borderRadius:4, boxShadow:3,
    }

    const liveStats = (
        <div>
            <Delivery delivered={delivered} cost_accumulated={cost_accumulated} />
        </div>
    );
    const summaryStats = (
        <div>
            <Summary mode={currMode} frames={frames} n_cycles={N_CYCLES} />
        </div>
    );

    function handleMechConfirm () {
        if (isEditingMechIndex !== null) {
            // editing
        }
        else {
            // adding
            setMechInitPositions((prev) => {
                let prev_copy: Grid[] = JSON.parse(JSON.stringify(prev));
                prev_copy.push(placingMech.index);
                return prev_copy;
            });
            setPrograms((prev) => {
                let prev_copy = JSON.parse(JSON.stringify(prev));
                prev_copy.push(INIT_PROGRAM);
                return prev_copy;
            });
            setMechDescriptions((prev) => {
                let prev_copy = JSON.parse(JSON.stringify(prev));
                prev_copy.push(INIT_DESCRIPTION);
                return prev_copy;
            });
            setMechVelocities((prev) => {
                let prev_copy = JSON.parse(JSON.stringify(prev));
                prev_copy.push(60);
                return prev_copy;
            })
            if (currMode == Modes.daw){
                setMechSfProgramIds (prev => {
                    let prev_copy: number[] = JSON.parse(JSON.stringify(prev));
                    prev_copy.push (sfPrograms[0].id);
                    return prev_copy;
                });
            }
        }

        handleMechCancel (true)
    }
    function handleMechCancel (hasConfirmed: boolean) {
        if (!hasConfirmed) {
            setMechInitPositions((prev) => {
                let prev_copy: Grid[] = JSON.parse(JSON.stringify(prev));
                prev_copy[isEditingMechIndex] = cachedMechPos;
                return prev_copy;
            })
        }
        setPlacingMech((_) => null);
        setIsEditingMechIndex((_) => null);
        setCachedMechPos((_) => null);
    }
    function handleRequestToEditMech (mech_i: number) {
        setPlacingMech((_) => { return { index: null, complete: false } as MechPositionPlacing; });
        setIsEditingMechIndex((_) => mech_i);
        setCachedMechPos((_) => mechInitPositions[mech_i]);
        // setMechInitPositions((prev) => {
        //     setCachedMechPos((_) => mechInitPositions[mech_i]);

        //     let prev_copy: Grid[] = JSON.parse(JSON.stringify(prev));
        //     prev_copy[mech_i] = null;
        //     return prev_copy;
        // })
    }
    
    function onIndexHighlight(index)  {
        setMechIndexHighlighted(index);

        if(index == -1)
        {
            setSpiritPreview([])
        }

        let mech = mechInitStates[index]
        let instructionSets = programsToInstructionSets(programs);
        let instructionSet = instructionSets[index]

        let mechStates = previewSpirit(mech, instructionSet);
        setSpiritPreview(mechStates)
    }

    const mechProgramming = (
        <div>
            <MechProgramming
                mode={currMode}
                animationState={animationState}
                mechCarries={mech_carries}
                mechIndexHighlighted={mechIndexHighlighted}
                mechInitPositions={mechInitPositions}
                mechDescriptions={mechDescriptions}
                mechStates={mechStates}
                mechVelocities={mechVelocities}
                onMechInitPositionsChange={setMechInitPositions}
                onMechDescriptionChange={setMechDescriptions}
                onMechIndexHighlight={onIndexHighlight}
                onMechVelocitiesChange={setMechVelocities}
                onProgramsChange={setPrograms}
                programs={programs}

                placingMech={placingMech}
                isEditingMechIndex={isEditingMechIndex}
                handleConfirm={handleMechConfirm}
                handleCancel={() => handleMechCancel(false)}
                handleRequestToEdit={handleRequestToEditMech}
                currPreviewFrame={currPreviewFrame[mechIndexHighlighted]}
            />
            <Box sx={{ display: "flex", flexDirection: "row", marginTop: "0.6rem", marginLeft: "3rem" }}>   
                <button onClick={() => handleMechClick("+")} disabled={animationState !== "Stop" ? true : false}>
                    {t("newMech")}
                </button>
            </Box>
        </div>
    );

    const formulaProgramming = (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

            <p style={{fontSize:'1rem'}}>Placed Formulas</p>

            {numOperators == 0 ? <p>No formula placed yet.</p> : <></>}

            <Box sx={{pl:'40px', pr:'40px', textAlign: "center",}}>
                {operators.map((operator, opIndex) => (
                    <FormulaRow
                        key={`operator-${opIndex}`}
                        disabled={animationState !== "Stop"}
                        highlighted={operatorInputHighlight[opIndex]}
                        onChange={(newOperator) => setOperator(opIndex, newOperator)}
                        onMouseOver={() => handleMouseOverOperatorInput(opIndex)}
                        onMouseOut={() => handleMouseOutOperatorInput(opIndex)}
                        operator={operator}
                        onDelete={() => handleFormulaDelete(opIndex)}
                    />
                ))}
            </Box>

            {placingFormula && (
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 0 }}>

                    <FormulaBlueprint
                        placing
                        operatorType={OPERATOR_TYPES[placingFormula.type]}
                        grids={placingFormula.grids}
                    />

                    <button
                        onClick={handleConfirmFormula}
                        disabled={!placingFormula.complete}
                        className={placingFormula.complete ? "button_glow" : ""}
                        style={{marginLeft:'0.5rem'}}
                    >
                        {/* {placingFormula.complete ? t("confirmFormula") : t("placeFormula")} */}
                        {t("confirmFormula")}
                    </button>

                    <button onClick={handleCancelFormula}>x</button>
                </Box>
            )}
        </Box>
    );

    function handleRemoveFaucet (f_i: number) {
        console.log('handleRemoveFaucet', f_i)
        setPlacedFaucets((prev) => {
            let prev_copy: AtomFaucetState[] = JSON.parse(JSON.stringify(prev));
            prev_copy.splice(f_i, 1);
            return prev_copy;
        });
    }
    function handleRemoveSink (s_i: number) {
        setPlacedSinks((prev) => {
            let prev_copy: AtomSinkState[] = JSON.parse(JSON.stringify(prev));
            prev_copy.splice(s_i, 1);
            return prev_copy;
        });
    }
    function handleOnMouseEnterGrid (index: Grid) {
        setHoveredGrid((_) => index);
    }
    function handleOnMouseLeaveGrid (index: Grid) {
        setHoveredGrid((_) => null);
    }
    function handleFaucetAtomTypeChange (f_i: number, atomType: AtomType) {
        if (f_i == -1) {
            // changing atom type for the faucet in placement
            setPlacingFaucet((prev) => {
                return {
                    id: prev.id,
                    index: prev.index,
                    typ: atomType,
                    complete: prev.complete
                } as PlacingAtomFaucet
            })
        }
        else {
            setPlacedFaucets((prev) => {
                let prev_copy: AtomFaucetState[] = JSON.parse(JSON.stringify(prev));
                prev_copy[f_i].typ = atomType;
                return prev_copy;
            });
        }
    }
    function handleAddFaucet () {
        if (isPlacingSomething) return;

        setPlacingFaucet({
            id: `${placedFaucets.length}`,
            typ: AtomType.VANILLA,
            index: null,
            complete: false,
        });
    }
    function handleAddSink () {
        if (isPlacingSomething) return;

        setPlacingSink({
            id: `${placedSinks.length}`,
            index: null,
            complete: false,
        });
    }
    function handleCancelFaucetSinkPlacing (hasConfirmed: boolean) {
        if (placingFaucet) {
            if ( (isEditingFaucetIndex !== null) && !hasConfirmed ) { // in edit mode => canceling edit without confirm sets position to cached value
                setPlacedFaucets((prev) => {
                    let prev_copy: AtomFaucetState[] = JSON.parse(JSON.stringify(prev));
                    prev_copy[isEditingFaucetIndex].index = cachedFaucetPos;
                    return prev_copy;
                })
            }
            setPlacingFaucet((_) => null);
            setIsEditingFaucetIndex((_) => null);
            setCachedFaucetPos((_) => null);
        }
        else if (placingSink) {
            if ( (isEditingSinkIndex !== null) && !hasConfirmed ) { // in edit mode => canceling edit without confirm sets position to cached value
                setPlacedSinks((prev) => {
                    let prev_copy: AtomSinkState[] = JSON.parse(JSON.stringify(prev));
                    prev_copy[isEditingSinkIndex].index = cachedSinkPos;
                    return prev_copy;
                })
            }
            setPlacingSink((_) => null);
            setIsEditingSinkIndex((_) => null);
            setCachedSinkPos((_) => null);
        }
    }
    function handleConfirmFaucetSinkPlacing () {
        if (placingFaucet){

            if (isEditingFaucetIndex !== null) {
                // editing; placedFaucets already updated in handleUnitClick
            }
            else {
                // adding
                setPlacedFaucets((prev) => {
                    let prev_copy: AtomFaucetState[] = JSON.parse(JSON.stringify(prev));
                    prev_copy.push({id:placingFaucet.id, index:placingFaucet.index, typ:placingFaucet.typ} as AtomFaucetState)
                    return prev_copy;
                });
            }
        }
        else {
            if (isEditingSinkIndex !== null) {
                // editing; placedSinks already updated in handleUnitClick
            }
            else {
                // adding
                setPlacedSinks((prev) => {
                    let prev_copy: AtomSinkState[] = JSON.parse(JSON.stringify(prev));
                    prev_copy.push({id:placingSink.id, index:placingSink.index} as AtomSinkState)
                    return prev_copy;
                });
            }
        }
        handleCancelFaucetSinkPlacing (true);
    }
    function handleRequestToEditFaucetSink (isFaucet: boolean, index: number) {
        if (isPlacingSomething) return;

        if (isFaucet) {
            setPlacedFaucets((prev) => {
                setCachedFaucetPos((_) => placedFaucets[index].index)
                let prev_copy: AtomFaucetState[] = JSON.parse(JSON.stringify(prev));
                prev_copy[index].index = null;
                return prev_copy;
            })
            setPlacingFaucet({
                id: placedFaucets[index].id,
                typ: placedFaucets[index].typ,
                index: null,
                complete: false,
            });
            setIsEditingFaucetIndex((_) => index);
        }
        else {
            setPlacedSinks((prev) => {
                setCachedSinkPos((_) => placedSinks[index].index)
                let prev_copy: AtomSinkState[] = JSON.parse(JSON.stringify(prev));
                prev_copy[index].index = null;
                return prev_copy;
            })
            setPlacingSink({
                id: placedSinks[index].id,
                index: null,
                complete: false,
            });
            setIsEditingSinkIndex((_) => index);
        }
    }

    // Render
    return (
        <>
            <Head>
                <title>MuMu</title>
                <meta name="MuMu" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <CoverScreenFront />
            <CoverScreen sfLoaded={sfLoaded} />

            <Layout
                currMode={currMode}
                loadSave={loadSave}
                board={board}
                faucets={placedFaucets}
                sinks={placedSinks}
                liveStats={liveStats}
                summaryStats={summaryStats}
                animationState={animationState}
                operatorStates={operatorStates}
                mech_n={numMechs}
                sfLoaded={sfLoaded}
                sfPrograms={sfPrograms}
                mechVelocities={mechVelocities}
                musicTitle={musicTitle}
                mechProgramming={mechProgramming}
                formulaProgramming={formulaProgramming}
                midScreenControlProps={{
                    runnable: runnable,
                    animationFrame: animationFrame,
                    n_cycles: N_CYCLES,
                    animationState: animationState,
                }}
                midScreenControlHandleClick={handleClick}
                midScreenControlHandleSlideChange={handleSlideChange}
                loadSolution={handleLoadSolutionClick}
                loadMode={(mode: Modes) => handleLoadModeClick(mode)}
                handleFormulaOnclick={(formula_key) => {handleOperatorClick("+", formula_key)}}
                handleSetSfFile={handleSetSfFile}
                handleMechNoteVelocityChange={handleMechNoteVelocityChange}
                handleMechSfProgramChange={handleMechSfProgramChange}
                handleMusicTitleChange={handleMusicTitleChange}
                callData={calls}
                handleAddFaucet={handleAddFaucet}
                handleAddSink={handleAddSink}
                handleRemoveFaucet={handleRemoveFaucet}
                handleRemoveSink={handleRemoveSink}
                handleOnMouseEnterGrid={handleOnMouseEnterGrid}
                handleOnMouseLeaveGrid={handleOnMouseLeaveGrid}
                handleFaucetAtomTypeChange={handleFaucetAtomTypeChange}

                isEditingFaucetIndex={isEditingFaucetIndex}
                isEditingSinkIndex={isEditingSinkIndex}
                isPlacingFaucetSink={placingFaucet || placingSink}
                isPlacingFaucet={placingFaucet}
                placingFaucet={placingFaucet}
                placingSink={placingSink}
                handleCancelFaucetSinkPlacing={ () => handleCancelFaucetSinkPlacing(false) }
                handleConfirmFaucetSinkPlacing={handleConfirmFaucetSinkPlacing}
                handleRequestToEdit={handleRequestToEditFaucetSink}
                mechSfProgramIds={mechSfProgramIds}
            />
        </>
    );
}
