import { Box, Button, IconButton, List, ListItem, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BLANK_SOLUTION, DEMO_SOLUTIONS, Modes } from "../constants/constants";
import {
    getNamespaceFromLocal,
    getSolutionFromLocal,
    removeSolutionFromLocal,
    saveSolutionToLocal,
} from "../helpers/localStorage";
import MechState from "../types/MechState";
import Operator from "../types/Operator";
import Solution from "../types/Solution";
import Modal from "./ui_common/Modal";

import { SxProps } from "@mui/material";

import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SaveIcon from '@mui/icons-material/Save';
import { Delete } from "@mui/icons-material";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ClearIcon from '@mui/icons-material/Clear';
import DownloadIcon from '@mui/icons-material/Download';

interface LoadSaveProps {
    onLoadSolutionClick: (solutionMode: string, viewSolution: Solution) => void;
    mechInitStates: MechState[];
    programs: string[];
    operators: Operator[];
    mode: Modes;
    volumes: number[];
}

const LoadSave = ({ onLoadSolutionClick, mechInitStates, programs, operators, mode, volumes }: LoadSaveProps) => {
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
            operators: operators,
            volumes: volumes
        };
        saveSolutionToLocal(`${mode}.${saveToName}`, solution);
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

    const SOLUTIONS = [BLANK_SOLUTION].concat(DEMO_SOLUTIONS)

    const MenuItemStyled = ({ children, sx = {} }: { children: React.ReactNode; sx?: SxProps }) => {
        return (
            <MenuItem sx={{pl:5, color:'#333333'}}>
                {children}
            </MenuItem>
        )
    };
    return (
        <Box sx={{ margin: '0 6px 0 6px' }}>
            <button onClick={handleOpen}>
                <i className="material-icons" style={{ fontSize: "1rem", paddingTop:'0.1rem' }}>
                    save
                </i>
            </button>
            <Modal
                open={open} onClose={handleClose} isRoot={true}
                maxWidth={false} width={350}
            >
                <Paper sx={{ maxWidth: '100%', pt:3 }} elevation={0}>
                    <MenuList>

                        <ListItemText sx={{textAlign:'center', pb:2}}>Load / Save</ListItemText>

                        <Divider />

                        {Array.from({ length: SOLUTIONS.length }).map((_, i) =>
                            i == 0 ? (
                                <MenuItem key={`demo-blank`} sx={{pl:5, color:'#333333', mt:1}} onClick={() => {
                                    onLoadSolutionClick('arena', SOLUTIONS[0]);
                                }}>
                                    <ListItemIcon>
                                        <InsertDriveFileIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>{t("demo-blank")}</ListItemText>
                                </MenuItem>
                            ) : (
                                <MenuItem key={`demo-${i}`} sx={{pl:5, color:'#333333'}} onClick={() => {
                                    onLoadSolutionClick('arena',SOLUTIONS[i]);
                                }}>
                                    <ListItemIcon>
                                        <InsertDriveFileIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>{t(`demo`)}{i - 1}</ListItemText>
                                </MenuItem>
                            )
                        )}

                        <Divider />
                        {mounted ? (
                            <>
                            {
                                namespace.map((name: string, name_i: number) => {
                                    return (
                                        <MenuItem key={`local-saved-${name_i}`} sx={{pl:5, color:'#333333'}} onClick={() => {
                                            const solution = getSolutionFromLocal(name);
                                            const solutionMode: string = name.split('.')[0]
                                            onLoadSolutionClick(solutionMode, solution);
                                        }}>
                                            <ListItemIcon>
                                                <AttachFileIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText>{name}</ListItemText>

                                            <IconButton size="small" color="secondary" onClick={(event) => {
                                                event.stopPropagation(); // without this line, the parent menuitem onclick will fire
                                                handleClearSpecificClick(name);
                                            }}>
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </MenuItem>
                                    );
                                })
                            }
                            </>
                        ) : (
                            <div />
                        )}

                        <Divider />

                        {/* Prevent typing in input from triggering "the parent menu navigation by typing" */}
                        {/* Ref: https://stackoverflow.com/questions/67913886/disable-select-by-typing-in-material-ui-menu-component */}
                        <MenuItem sx={{pl:5}}
                            onKeyDown={(e) => e.stopPropagation()}
                            onClick={() => {handleSaveClick()}}
                        >
                            <ListItemIcon>
                                <SaveIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Save</ListItemText>
                            <input
                                onChange={(event) => {
                                    setSaveToName(_ => event.target.value);
                                }}
                                onClick={(event) => {event.stopPropagation();}}
                                defaultValue={DEFAULT_SAVE_TO_NAME}
                                style={{ width: "10rem", marginRight: "8px", height: "26px" }}
                                placeholder={t("save to name")}
                            ></input>
                        </MenuItem>

                        <MenuItem sx={{pl:5}} onClick={() => {handleClearClick()}}>
                            <ListItemIcon>
                                <ClearIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Clear All</ListItemText>
                        </MenuItem>

                        <MenuItem sx={{pl:5}} onClick={() => {
                            const solution: Solution = {
                                mechs: mechInitStates,
                                programs: programs,
                                operators: operators,
                                volumes: volumes
                            };
                            const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
                                JSON.stringify(solution)
                            )}`;
                            const link = document.createElement("a");
                            link.href = jsonString;
                            link.download = "mumu_export.json";
                            link.click();
                        }}>
                            <ListItemIcon>
                                <DownloadIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Export to JSON</ListItemText>
                        </MenuItem>

                    </MenuList>
                </Paper>
            </Modal>
        </Box>
    );

};

export default LoadSave;
