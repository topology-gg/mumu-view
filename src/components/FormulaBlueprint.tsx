import React, { CSSProperties } from "react";
import Unit from "../../pages/unit";
import { OperatorType } from "../types/Operator";
import { AtomTypeToBg, BorderStatus, UnitText } from "../types/UnitState";
import styles from "../../styles/Home.module.css";
import { useTranslation } from "react-i18next";
import Grid from "../types/Grid";

interface FormulaBlueprintProps {
    operatorType: OperatorType;
    placing?: boolean;
    grids?: Grid[];
}

function compute_formula_li_style(backgroundColor: string): CSSProperties {
    return {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginTop: "0.5rem",
        height: "2rem",
        borderRadius: "2rem",
        backgroundColor: backgroundColor,
    };
}

const FORMULA_LI_OPACITY_STR = "66";

const FormulaBlueprint = ({ operatorType, placing, grids = [] }: FormulaBlueprintProps) => {
    const { t } = useTranslation();

    const inputAtomGrids = grids.slice(0, operatorType.input_atom_types.length);
    const currentInputIndex = placing && inputAtomGrids.length;
    const inputAtomGridsComplete = inputAtomGrids.length === operatorType.input_atom_types.length;

    const outputAtomGrids = grids.slice(operatorType.input_atom_types.length);
    const currentOutputIndex = placing && inputAtomGridsComplete && outputAtomGrids.length;

    return (
        <li style={compute_formula_li_style(operatorType.color + FORMULA_LI_OPACITY_STR)}>
            <p className={styles.input_name}>{t(operatorType.name)}:</p>
            {operatorType.symbol}(
            {operatorType.input_atom_types.map((atomType, i) => (
                <Unit
                    atomOpacity={!placing || currentInputIndex > i ? 1.0 : 0.5}
                    state={{
                        bg_status: AtomTypeToBg[atomType],
                        border_status: currentInputIndex === i ? BorderStatus.SINGLETON_OPEN : null,
                        unit_text: UnitText.EMPTY,
                        unit_id: null,
                    }}
                    handleMouseOut={() => {}}
                    handleMouseOver={() => {}}
                    mechHighlight={false}
                    isSmall={true}
                />
            ))}
            )<p style={{ margin: "0 0.5rem 0 0.5rem" }}> = </p>
            {operatorType.output_atom_types.map((atomType, i) => (
                <Unit
                    atomOpacity={!placing || (inputAtomGridsComplete && outputAtomGrids.length > i) ? 1.0 : 0.5}
                    state={{
                        bg_status: AtomTypeToBg[atomType],
                        border_status:
                            inputAtomGridsComplete && outputAtomGrids.length === i ? BorderStatus.SINGLETON_OPEN : null,
                        unit_text: UnitText.EMPTY,
                        unit_id: null,
                    }}
                    handleMouseOut={() => {}}
                    handleMouseOver={() => {}}
                    mechHighlight={false}
                    isSmall={true}
                />
            ))}
        </li>
    );
};

export default FormulaBlueprint;
