import { Box, Button, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DEMO_SOLUTIONS } from "../constants/constants";
import {
    getNamespaceFromLocal,
    getSolutionFromLocal,
    removeSolutionFromLocal,
    saveSolutionToLocal,
} from "../helpers/localStorage";
import MechState from "../types/MechState";
import Operator from "../types/Operator";
import Solution from "../types/Solution";
import Modal from "./Modal";
import SavedSolutionElement from "./savedSolutionElement";

interface LoadSaveProps {
    onLoadSolutionClick: (viewSolution: Solution) => void;
    mechInitStates: MechState[];
    programs: string[];
    operatorStates: Operator[];
}

const LoadSave = ({ onLoadSolutionClick, mechInitStates, programs, operatorStates }: LoadSaveProps) => {
    const { t } = useTranslation();

    const [open, setOpen] = useState<boolean>(false);
    const [mounted, setMounted] = useState(false);
    const initNamespace: string[] = getNamespaceFromLocal();
    const [namespace, setNamespace] = useState<string[]>(initNamespace);

    // Local storage
    const DEFAULT_SAVE_TO_NAME = "";
    const [saveToName, setSaveToName] = useState<string>(DEFAULT_SAVE_TO_NAME);

    const saveButtonStyle = mounted ? computeSaveButtonStyle() : {};

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    function computeSaveButtonStyle(): React.CSSProperties {
        if (typeof window == "undefined") return;

        let valid = true;

        // rejecting 'namespace'
        if (saveToName == "namespace") {
            // console.log ('> rejecting namespace as name')
            valid = false;
        }

        // rejecting empty string
        else if (saveToName.length == 0) {
            // console.log ('> rejecting empty string as name')
            valid = false;
        }

        // check for collision
        else {
            const namespaceStr = localStorage.getItem("namespace");
            if (namespaceStr) {
                const namespace: string[] = JSON.parse(namespaceStr);
                if (namespace.includes(saveToName)) {
                    // console.log (`> rejecting ${saveToName} because of collision`)
                    valid = false;
                }
            }
        }

        // affect style
        if (valid) return {};
        else return { pointerEvents: "none", backgroundColor: "gray" };
    }

    function handleSaveClick() {
        const solution: Solution = {
            mechs: mechInitStates,
            programs: programs,
            operators: operatorStates,
        };
        saveSolutionToLocal(saveToName, solution);
        console.log("> saved solution:", solution);
        const newNamespace: string[] = getNamespaceFromLocal();
        setNamespace((prev) => newNamespace); // trigger rerender
    }
    function handleClearClick() {
        const namespace: string[] = getNamespaceFromLocal();
        namespace.forEach((name, name_i) => {
            removeSolutionFromLocal(name);
            console.log("remove saved solution:", name);
        });
        const newNamespace: string[] = getNamespaceFromLocal();
        setNamespace((prev) => newNamespace); // trigger rerender
    }
    function handleClearSpecificClick(name: string) {
        removeSolutionFromLocal(name);
        console.log("remove saved solution:", name);
        const newNamespace: string[] = getNamespaceFromLocal();
        setNamespace((prev) => newNamespace); // trigger rerender
    }

    return (
        <Tooltip title={t("load_save")} arrow>

        <Box sx={{ mb: 2 }}>
            {/* <Button color="secondary" variant="outlined" onClick={handleOpen}>
                {t("load_save")}
            </Button> */}
            <button onClick={handleOpen} className={'big-button'}>
                <i className="material-icons" style={{ fontSize: "1rem", paddingTop:'0.1rem' }}>
                    save
                </i>
            </button>
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        p: 2,
                        fontFamily: "var(--font-family-secondary)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <Box>
                        {Array.from({ length: DEMO_SOLUTIONS.length }).map((_, i) =>
                            i == 0 ? (
                                <button
                                    key={`load-demo-${i}`}
                                    onClick={() => {
                                        onLoadSolutionClick(DEMO_SOLUTIONS[0]);
                                        handleClose();
                                    }}
                                >
                                    {t("demo-blank")}
                                </button>
                            ) : (
                                <button
                                    key={`load-demo-${i}`}
                                    onClick={() => {
                                        onLoadSolutionClick(DEMO_SOLUTIONS[i]);
                                        handleClose();
                                    }}
                                >
                                    {t(`demo`)}
                                    {i - 1}
                                </button>
                            )
                        )}
                    </Box>

                    <Box sx={{ display: "flex", gap: 1 }}>
                        {mounted ? (
                            namespace.map((name: string, name_i: number) => {
                                return (
                                    <SavedSolutionElement
                                        key={`saved-solution-element-${name_i}`}
                                        name={name}
                                        onLoadClick={() => {
                                            const solution = getSolutionFromLocal(name);
                                            onLoadSolutionClick(solution);
                                            handleClose();
                                        }}
                                        onClearClick={() => {
                                            handleClearSpecificClick(name);
                                        }}
                                    />
                                );
                            })
                        ) : (
                            <div />
                        )}
                    </Box>

                    <Box>
                        <input
                            onChange={(event) => {
                                setSaveToName((prev) => event.target.value);
                            }}
                            defaultValue={DEFAULT_SAVE_TO_NAME}
                            style={{ width: "7rem", margin: "0 3px 0 3px", height: "24px" }}
                            placeholder={t("save to name")}
                        ></input>
                        <button
                            onClick={() => {
                                handleSaveClick();
                            }}
                            style={saveButtonStyle}
                        >
                            {" "}
                            {t("Save")}{" "}
                        </button>
                        <button
                            onClick={() => {
                                handleClearClick();
                            }}
                        >
                            {" "}
                            {t("Clear")}{" "}
                        </button>
                        <button
                            onClick={() => {
                                const solution: Solution = {
                                    mechs: mechInitStates,
                                    programs: programs,
                                    operators: operatorStates,
                                };
                                const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
                                    JSON.stringify(solution)
                                )}`;
                                const link = document.createElement("a");
                                link.href = jsonString;
                                link.download = "mumu_export.json";

                                link.click();
                            }}
                        >
                            {" "}
                            {t("Export")}{" "}
                        </button>
                    </Box>
                </Box>
            </Modal>
        </Box>

        </Tooltip>
    );
};

export default LoadSave;
