import { Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { MouseEventHandler } from "react";
import Operator from "../types/Operator";
import styles from "../../styles/Home.module.css";
import theme from "../../styles/theme";
import { useTranslation } from "react-i18next";
import Unit from "./unit";
import { AtomTypeToBg, UnitText } from "../types/UnitState";

type FormulaRowProps = {
    disabled: boolean;
    highlighted: boolean;
    onChange: (newOperator: Operator) => void;
    onMouseOver: MouseEventHandler;
    onMouseOut: MouseEventHandler;
    onDelete: () => void;
    operator: Operator;
};

const FormulaRow = ({
    disabled,
    highlighted,
    onChange,
    onMouseOver,
    onMouseOut,
    onDelete,
    operator,
}: FormulaRowProps) => {
    const { t } = useTranslation();
    const voidFunc = () => {};

    return (
        <div
            className={styles.input_row}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            style={{
                backgroundColor: highlighted ? theme.palette.primary.main : operator.typ.color + "55",
            }}
        >
            {/* <IconButton size="small" onClick={onDelete}> */}
            <Delete
                fontSize="small"
                sx={{ml:1, color:'#AAAAAA', "&:hover": { color:disabled?"#AAAAAA":"#555555", cursor:disabled?'default':'pointer' }}}
                onClick={!disabled ? onDelete : voidFunc}
            />
            {/* </IconButton> */}

            <p className={styles.input_name}>{t(operator.typ.name)}</p>

            {operator.typ.input_atom_types.map((atomType, i) => (
                <div key={`formula-blueprint-input-${i}`} style={{ position: "relative" }}>

                    <Unit
                        atomOpacity={1.0}
                        state={{
                            bg_status: AtomTypeToBg[atomType],
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
            ))}
            )<p style={{ margin: "0 0.5rem 0 0.5rem" }}> = </p>
            {operator.typ.output_atom_types.map((atomType, i) => (
                <div key={`formula-blueprint-output-${i}`} style={{ position: "relative" }}>

                    <Unit
                        atomOpacity={1.0}
                        state={{
                            bg_status: AtomTypeToBg[atomType],
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
            ))}
        </div>
    );
};

export default FormulaRow;
