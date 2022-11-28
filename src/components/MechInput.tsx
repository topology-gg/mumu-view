import React, { KeyboardEventHandler, useState } from "react";
import Grid from "../types/Grid";
import styles from "../../styles/Home.module.css";
import { useTranslation } from "react-i18next";
import { INSTRUCTION_ICON_MAP, PROGRAM_SIZE_MAX, DESCRIPTION_SIZE_MAX } from "../constants/constants";
import { Draggable } from "react-beautiful-dnd";
import Unit from "../../pages/unit";
import { BgStatus, UnitText } from "../types/UnitState";
import SingleInstruction from "./SingleInstruction";
import NewInstruction from "./NewInstruction";
import Button from "@mui/material/Button";
import { Delete } from "@mui/icons-material";
import { Dialog, DialogActions, DialogContent, DialogContentText, IconButton } from "@mui/material";
import { NumericType } from "mongodb";

interface MechInputProps {
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
}

const MechInput = ({
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
}: MechInputProps) => {
    const { t } = useTranslation();

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

    return (
        <>
            <Draggable draggableId={mechIndex.toString()} index={mechIndex}>
                {(provided, _snapshot) => (
                    <div
                        ref={provided.innerRef}
                        key={`input-row-${mechIndex}`}
                        className={styles.input_row}
                        onMouseOver={() => {
                            handleMouseOver();
                        }}
                        onMouseOut={() => {
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
                                    width: "2.5rem",
                                }}
                            >
                                {t("mech")}
                                {mechIndex}
                            </p>
                        </div>

                        <IconButton disabled={!onProgramDelete} size="small" color="secondary" onClick={handleDelete}>
                            <Delete fontSize="small" />
                        </IconButton>

                        <input
                            className={styles.program}
                            onChange={(event) => {
                                if (isNaN(parseInt(event.target.value))) return;
                                onPositionChange(mechIndex, {
                                    ...position,
                                    x: parseInt(event.target.value),
                                });
                            }}
                            defaultValue={position.x}
                            value={position.x}
                            style={{
                                width: "30px",
                                height: "25px",
                                textAlign: "center",
                                border: "1px solid #CCCCCC",
                                borderRadius: "10px 0 0 10px",
                            }}
                            disabled={disabled}
                        ></input>

                        <input
                            className={styles.program}
                            onChange={(event) => {
                                if (isNaN(parseInt(event.target.value))) return;
                                onPositionChange(mechIndex, {
                                    ...position,
                                    y: parseInt(event.target.value),
                                });
                            }}
                            defaultValue={position.y}
                            value={position.y}
                            style={{
                                width: "30px",
                                height: "25px",
                                textAlign: "center",
                                marginRight: "0.8rem",
                                border: "1px solid #CCCCCC",
                                borderLeft: "0px",
                                borderRadius: "0 10px 10px 0",
                            }}
                            disabled={disabled}
                        ></input>

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

                        <input
                            className={styles.programWrapper}
                            onChange={(event) => {
                                let encoder = new TextEncoder();
                                onDescriptionChange(mechIndex, event.target.value);
                            }}
                            defaultValue={description}
                            value={description}
                            style={{
                                height: "25px",
                                width: Math.max(description.length / 2, 7) + "%",
                                margin: "0 1rem 0 1rem",
                                borderRadius: "5px",
                                backgroundColor: description.length > DESCRIPTION_SIZE_MAX ? "#FFCBCB" : "#FFFFFF00",
                            }}
                            disabled={disabled}
                        ></input>
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
