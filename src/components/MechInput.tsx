import React, { KeyboardEventHandler, useState } from "react";
import Grid from "../types/Grid";
import styles from "../../styles/Home.module.css";
import { useTranslation } from "react-i18next";
import { INSTRUCTION_ICON_MAP, DESCRIPTION_SIZE_MAX, Modes, Constraints } from "../constants/constants";
import { Draggable } from "react-beautiful-dnd";
import Unit from "./unit";
import { BgStatus, UnitText } from "../types/UnitState";
import SingleInstruction from "./SingleInstruction";
import NewInstruction from "./NewInstruction";
import Button from "@mui/material/Button";
import { Delete } from "@mui/icons-material";
import { Dialog, DialogActions, DialogContent, DialogContentText, IconButton } from "@mui/material";
import { NumericType } from "mongodb";
import { MechPositionPlacing } from "../types/MechState";

interface MechInputProps {
    mode: Modes
    mechIndex: number;
    position: Grid;
    description: string;
    program: string;
    pc: number;
    onPositionChange: (mechIndex: number, position: Grid) => void;
    onDescriptionChange: (mechIndex: number, description: string) => void;
    onProgramChange: (mechIndex: number, program: string) => void;
    onProgramDelete?: (mechIndex: number) => void;
    disabled: boolean;
    handleMouseOver: () => void;
    handleMouseOut: () => void;
    handleKeyDown: (event) => void;
    handleKeyUp: (event) => void;
    unitBgStatus: BgStatus;

    placing: boolean;
    completePlacing: boolean;
    placingMech: MechPositionPlacing;
    isEditingMechIndex: number | null;
    handleConfirm: () => void;
    handleCancel: () => void;
    handleRequestToEdit?: () => void;
}

const MechInput = ({
    mode,
    mechIndex,
    position,
    description,
    program,
    pc,
    onPositionChange,
    onDescriptionChange,
    onProgramChange,
    onProgramDelete,
    disabled,
    handleMouseOver,
    handleMouseOut,
    handleKeyDown: onKeyDown,
    handleKeyUp,
    unitBgStatus,

    placing,
    completePlacing,
    placingMech,
    isEditingMechIndex,
    handleConfirm,
    handleCancel,
    handleRequestToEdit,

}: MechInputProps) => {
    const { t } = useTranslation();

    // decode from mode
    const PROGRAM_SIZE_MAX = Constraints[mode].PROGRAM_SIZE_MAX

    const instructions: string[] = program ? program.split(",") : [];
    const programLength = instructions.length;
    const currentInstructionIndex = pc % programLength;

    const [selectedInstructionIndex, setSelectedInstructionIndex] = useState<number>(null);
    const [selectedNewInstruction, setSelectedNewInstruction] = useState<boolean>(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

    const handleKeyDown: KeyboardEventHandler = (event) => {
        if (event.code === "Backspace") {
            // Backspace - Remove last instruction
            const newProgram = instructions.slice(0, -1);
            onProgramChange(mechIndex, newProgram.join(","));
        } else {
            onKeyDown(event);
        }
    };

    const handleInsertInstruction = (instruction) => {
        if (instructions.length > PROGRAM_SIZE_MAX) {
            return;
        } else {
            const newProgram = [...instructions, instruction].join(",");
            onProgramChange(mechIndex, newProgram);
        }
    };

    const handleChangeInstruction: KeyboardEventHandler = (event) => {
        const instruction = event.key.toLowerCase();
        if (["Backspace", "Delete"].includes(event.key)) {
            // Remove instruction at selected index
            const newProgram = [
                ...instructions.slice(0, selectedInstructionIndex),
                ...instructions.slice(selectedInstructionIndex + 1),
            ];
            onProgramChange(mechIndex, newProgram.join(","));
            setSelectedInstructionIndex((prev) => (prev > 0 ? prev - 1 : 0));
        } else if (event.key === "ArrowLeft") {
            setSelectedInstructionIndex((prev) => (prev > 0 ? prev - 1 : 0));
        } else if (event.key === "ArrowRight") {
            setSelectedInstructionIndex((prev) => (prev < instructions.length - 1 ? prev + 1 : prev));
        } else if (Object.keys(INSTRUCTION_ICON_MAP).includes(instruction)) {
            const newInstructions = [...instructions];
            newInstructions[selectedInstructionIndex] = instruction;
            onProgramChange(mechIndex, newInstructions.join(","));
        }
    };

    const handleDelete = () => {
        if (!onProgramDelete) return;

        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        onProgramDelete(mechIndex);
        setDeleteDialogOpen(false);
    };

    const voidFunc = () => {};

    let uiAfterPos = placing ? (
        <>
            <button
                onClick={handleConfirm}
                disabled={!placingMech.complete}
                className={placingMech.complete ? "button_glow" : ""}
                style={{marginLeft:'0.5rem'}}
            > ✓ </button>

            <button
                onClick={handleCancel}
            > x </button>
        </>
    ) : (
        <div style={{display:'flex', flexDirection:'row', alignItems:'center', marginLeft:'0.5rem'}}>
            <div
                className={styles.programWrapper}
                style={{
                    height: "25px",
                    borderRadius: "5px",
                    backgroundColor: program.split(",").length > PROGRAM_SIZE_MAX ? "#FFCBCB" : "#FFFFFF00",
                }}
            >
                {instructions.map((instruction, index) => (
                    <SingleInstruction
                        instruction={instruction}
                        active={currentInstructionIndex === index}
                        selected={selectedInstructionIndex === index}
                        onSelect={() => {
                            setSelectedInstructionIndex(index);
                            setSelectedNewInstruction(false);
                        }}
                        onBlur={() => setSelectedInstructionIndex((prev) => (prev === index ? null : prev))}
                        onKeyUp={handleChangeInstruction}
                    />
                ))}
                <NewInstruction
                    onInsert={handleInsertInstruction}
                    onSelect={() => {
                        setSelectedInstructionIndex(null);
                        setSelectedNewInstruction(true);
                    }}
                    onBlur={() => setSelectedNewInstruction(false)}
                    selected={selectedNewInstruction}
                    onKeyDown={handleKeyDown}
                    onKeyUp={handleKeyUp}
                />
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <p
                    style={{
                        marginLeft: "1rem",
                        color: "#999999",
                    }}
                >
                    //
                </p>
            </div>

            <input
                className={styles.programComment}
                onChange={(event) => {
                    let encoder = new TextEncoder();
                    onDescriptionChange(mechIndex, event.target.value);
                }}
                value={description}
                size={DESCRIPTION_SIZE_MAX}
                maxLength={DESCRIPTION_SIZE_MAX}
                style={{
                    height: "25px",
                    width: "auto",
                    marginLeft: "0.3rem",
                    padding: "0 5px",
                    color: "#999999",
                    border: "none",
                    borderRadius: "7px",
                    fontSize: '12px',
                    backgroundColor:'#FFFFFF00'
                }}
                disabled={disabled}
            ></input>
        </div>
    )

    return (
        <>
            <Draggable draggableId={mechIndex.toString()} index={mechIndex}>
                {(provided, _snapshot) => (
                    <div
                        ref={provided.innerRef}
                        key={`input-row-${mechIndex}`}
                        className={styles.input_row}
                        onMouseEnter={() => {
                            handleMouseOver();
                        }}
                        onMouseLeave={() => {
                            handleMouseOut();
                        }}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <div style={{ marginLeft: "1rem" }}>
                            <Unit
                                state={{
                                    bg_status: unitBgStatus,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                                mechHighlight={false}
                                isSmall={true}
                            />
                        </div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <p
                                style={{
                                    margin: "0 1rem 0 1rem",
                                    width: "3rem",
                                }}
                            >
                                {mechIndex == -1 ? '+ Spirit' : 'Spirit ' + mechIndex.toString()}
                            </p>
                        </div>

                        {
                            placing ? <></> : (
                                <Delete
                                    fontSize="small"
                                    sx={{mr:1, color:'#AAAAAA', "&:hover": { color:disabled?"#AAAAAA":"#555555", cursor:disabled?'default':'pointer' }}}
                                    onClick={!disabled ? handleDeleteConfirm : voidFunc}
                                />
                            )
                        }
                        <div
                            className={`${disabled ? 'disabled-editable-placement' : placing && (placingMech !== null) && !completePlacing ? 'p_glow' : 'editable-placement'}`}
                            style={{
                                borderRadius:'10px', padding:'0 10px 0 10px', display:'flex', flexDirection:'row', alignItems:'center',
                                border: '1px solid #555555', height: '22px',
                            }}
                            onClick={()=>{ disabled ? voidFunc() : handleRequestToEdit(); }}
                        >
                            <div style={{width:'1rem', color: disabled ? '#999999' : '#222222'}}>
                                {position ? position.x : '?'}
                            </div>
                            <div>,</div>
                            <div style={{width:'1rem', color: disabled ? '#999999' : '#222222'}}>
                                {position ? position.y : '?'}
                            </div>
                        </div>

                        {uiAfterPos}

                    </div>
                )}
            </Draggable>

            <Dialog open={deleteDialogOpen}>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {t("removeMechConfirm", { mech: `mech${mechIndex}` })}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={() => setDeleteDialogOpen(false)}>
                        {t("no")}
                    </Button>
                    <Button variant="contained" color="error" onClick={handleDeleteConfirm} autoFocus>
                        {t("removeMech")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default MechInput;
