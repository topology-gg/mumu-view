import React, { CSSProperties } from "react";
import Unit from "./unit";
import { OperatorType } from "../types/Operator";
import { AtomTypeToBg, UnitText } from "../types/UnitState";
import styles from "../../styles/Home.module.css";
import { useTranslation } from "react-i18next";
import Grid from "../types/Grid";
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

interface FormulaBlueprintProps {
    operatorType: OperatorType;
    placing?: boolean;
    grids?: Grid[];
    clickable?: boolean;
    onclick?: () => void;
}

const FORMULA_LI_OPACITY_STR = "66";

function compute_formula_li_style(backgroundColor: string): CSSProperties {
    return {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginTop: "0.5rem",
        height: "2rem",
        borderRadius: "2rem",
        backgroundColor: backgroundColor + FORMULA_LI_OPACITY_STR,
    };
}

const FormulaBlueprint = ({ operatorType, placing, grids = [], clickable = false, onclick}: FormulaBlueprintProps) => {
    const { t } = useTranslation();

    const inputAtomGrids = grids.slice(0, operatorType.input_atom_types.length);
    const currentInputIndex = placing && inputAtomGrids.length;
    const inputAtomGridsComplete = inputAtomGrids.length === operatorType.input_atom_types.length;

    const outputAtomGrids = grids.slice(operatorType.input_atom_types.length);
    const currentOutputIndex = placing && inputAtomGridsComplete && outputAtomGrids.length;

    function handleClick() {
        if (!clickable) return;
        onclick()
    }

    const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} classes={{ popper: className }} />
      ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
          backgroundColor: theme.palette.common.white,
          color: 'rgba(0, 0, 0, 0.87)',
          boxShadow: theme.shadows[3],
          fontSize: 12,
        },
      }));

    let li = (
        <li
            style={compute_formula_li_style(operatorType.color)}
            onClick={() => handleClick()}
            className={clickable ? styles.clickable_li : ''}
        >
            <p className={styles.input_name}>{t(operatorType.name)}:</p>
            {operatorType.symbol}(
            {operatorType.input_atom_types.map((atomType, i) => (
                <div key={`formula-blueprint-input-${i}`} style={{ position: "relative" }}>
                    <div
                        className={"operand_pointer"}
                        style={{ opacity: placing && currentInputIndex === i ? 1.0 : 0 }}
                    />

                    <Unit
                        atomOpacity={!placing || currentInputIndex > i ? 1.0 : 0.5}
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
            {operatorType.output_atom_types.map((atomType, i) => (
                <div key={`formula-blueprint-output-${i}`} style={{ position: "relative" }}>
                    <div className={"operand_pointer"} style={{ opacity: currentOutputIndex === i ? 1.0 : 0 }} />
                    <Unit
                        atomOpacity={!placing || (inputAtomGridsComplete && outputAtomGrids.length > i) ? 1.0 : 0.5}
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
        </li>
    );

    if (clickable) {
        return (
            <LightTooltip title="Add to diagram" arrow placement="right">
                {li}
            </LightTooltip>
        )
    }
    else {
        return (<>{li}</>)
    }
};

export default FormulaBlueprint;
