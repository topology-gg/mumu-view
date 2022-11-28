import React, { useState } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { InstructionKey, INSTRUCTION_KEYS } from "../constants/constants";
import { reorder } from "../helpers/reorder";
import Grid from "../types/Grid";
import MechState from "../types/MechState";
import { BgStatus } from "../types/UnitState";
import IconizedInstructionPanel from "./IconizedInstructionPanel";
import MechInput from "./MechInput";

interface MechProgrammingProps {
    animationState: string;
    mechCarries: BgStatus[];
    mechIndexHighlighted: number;
    mechStates: MechState[];
    mechInitPositions: Grid[];
    mechDescriptions: string[];
    programs: string[];
    onProgramsChange: (programs: string[]) => void;
    onMechDescriptionChange: (descriptions: string[]) => void;
    onMechInitPositionsChange: (mechInitPositions: Grid[]) => void;
    onMechIndexHighlight: (index: number) => void;
}

const MechProgramming = ({
    animationState,
    mechCarries,
    mechIndexHighlighted,
    mechInitPositions,
    mechDescriptions,
    mechStates,
    programs,
    onProgramsChange,
    onMechInitPositionsChange,
    onMechDescriptionChange,
    onMechIndexHighlight,
}: MechProgrammingProps) => {
    let programKeyDownInit = {};
    for (const key of INSTRUCTION_KEYS) {
        programKeyDownInit[key] = false;
    }
    const [programKeyDown, setProgramKeyDown] = useState<{ [key: InstructionKey]: boolean }>(programKeyDownInit);

    const numMechs = programs.length;

    const handleDragEnd = ({ destination, source }: DropResult) => {
        // dropped outside the list
        if (!destination) return;

        const newPrograms = reorder(programs, source.index, destination.index);
        const newPositions = reorder(mechInitPositions, source.index, destination.index);

        onProgramsChange(newPrograms);
        onMechInitPositionsChange(newPositions);
    };

    const handleKeyMechInputProgram = (event, typ: string) => {
        // typ takes 'down' or 'up'
        const key = event.key;
        if (INSTRUCTION_KEYS.includes(key)) {
            // console.log(`> key ${typ} mech input program:`, event.key)
            const bool = typ == "down" ? true : false;
            setProgramKeyDown((prev) => {
                let prev_copy = JSON.parse(JSON.stringify(prev));
                prev_copy[key] = bool;
                return prev_copy;
            });
        }
    };

    function handleMouseOverMechInput(mech_i: number) {
        onMechIndexHighlight(mech_i);
    }

    function handleMouseOutMechInput(mech_i: number) {
        onMechIndexHighlight(-1);
    }

    const handleInstructionPanelPress = (key: InstructionKey) => {
        // No selected mech, return

        // Insert the instruction in the currently selected mech
        console.log("key pressed", key);
    };

    function handleMechInitPositionChange(mech_i: number, position: Grid) {
        let newPositions = JSON.parse(JSON.stringify(mechInitPositions));
        newPositions[mech_i] = position;
        onMechInitPositionsChange(newPositions);
    }

    function handleMechDescriptionChange(mech_i: number, description: string) {
        let newDescriptions: string[] = JSON.parse(JSON.stringify(mechDescriptions));
        newDescriptions[mech_i] = description;
        onMechDescriptionChange(newDescriptions);
    }

    function handleProgramDelete(index: number) {
        onProgramsChange(programs.filter((_v, i) => i !== index));
        onMechInitPositionsChange(mechInitPositions.filter((_v, i) => i !== index));
        onMechDescriptionChange(mechDescriptions.filter((_v, i) => i !== index));
        onMechIndexHighlight(-1);
    }

    return (
        <>
            <IconizedInstructionPanel programKeyDown={programKeyDown} onPress={handleInstructionPanelPress} />

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="mech-input-list" isDropDisabled={animationState !== "Stop"}>
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {animationState == "Stop"
                                ? Array.from({ length: numMechs }).map((_, mech_i) => (
                                      <MechInput
                                          key={`mech-input-${mech_i}`}
                                          mechIndex={mech_i}
                                          position={mechInitPositions[mech_i]}
                                          description={mechDescriptions[mech_i]}
                                          program={programs[mech_i]}
                                          pc={0}
                                          onPositionChange={(index, position) => {
                                              handleMechInitPositionChange(index, position);
                                          }}
                                          onDescriptionChange={(index, description) => {
                                              handleMechDescriptionChange(index, description);
                                          }}
                                          onProgramChange={(index, program) =>
                                              onProgramsChange(programs.map((p, i) => (i === index ? program : p)))
                                          }
                                          onProgramDelete={handleProgramDelete}
                                          disabled={animationState == "Stop" ? false : true}
                                          handleMouseOver={() => {
                                              handleMouseOverMechInput(mech_i);
                                          }}
                                          handleMouseOut={() => {
                                              handleMouseOutMechInput(mech_i);
                                          }}
                                          handleKeyDown={(event) => {
                                              handleKeyMechInputProgram(event, "down");
                                          }}
                                          handleKeyUp={(event) => {
                                              handleKeyMechInputProgram(event, "up");
                                          }}
                                          unitBgStatus={mechCarries[mech_i]}
                                      />
                                  ))
                                : Array.from({ length: numMechs }).map((_, mech_i) => (
                                      <MechInput
                                          key={`mech-input-${mech_i}`}
                                          mechIndex={mech_i}
                                          position={mechInitPositions[mech_i]}
                                          description={mechDescriptions[mech_i]}
                                          program={programs[mech_i]}
                                          pc={mechStates[mech_i].pc_next}
                                          onPositionChange={(index, position) => {}}
                                          onDescriptionChange={(index, description) => {}}
                                          onProgramChange={(index, program) => {}}
                                          disabled={animationState == "Stop" ? false : true}
                                          handleMouseOver={() => {
                                              handleMouseOverMechInput(mech_i);
                                          }}
                                          handleMouseOut={() => {
                                              handleMouseOutMechInput(mech_i);
                                          }}
                                          handleKeyDown={() => {}}
                                          handleKeyUp={() => {}}
                                          unitBgStatus={mechCarries[mech_i]}
                                      />
                                  ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </>
    );
};

export default MechProgramming;
