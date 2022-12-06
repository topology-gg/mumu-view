import React from "react";
import Operator, { OPERATOR_TYPES, PlacingFormula } from "../types/Operator";

import styles from "../../styles/OperatorGridBg.module.css";
import { DIM } from "../constants/constants";
import { placingFormulaToOperator } from "../helpers/typeMapping";

// An arbitrary value - the svg is scaled to fit 100% its parent
const GRID_SIZE = 32;

function pointsForOperator(operator: Operator): string {
    let points = operator.input
        .concat(operator.output)
        .map((grid) => `${grid.x * GRID_SIZE + GRID_SIZE / 2},${grid.y * GRID_SIZE + GRID_SIZE / 2}`);

    // Repeat the single point if only one is present
    if (points.length === 1) points = points.concat(points);

    return points.join(" ");
}

interface OperatorExtended extends Operator {
    highlighted: boolean;
    placing: boolean;
}

const OperatorGridBg = ({
    operators,
    highlighted,
    placingFormula,
}: {
    operators: Operator[];
    highlighted: boolean[];
    placingFormula?: PlacingFormula;
}) => {
    let operatorsVisible: OperatorExtended[] = operators.map((op, i) => ({
        ...op,
        highlighted: highlighted && highlighted[i],
        placing: false,
    }));
    if (placingFormula?.grids.length) {
        const operator = { ...placingFormulaToOperator(placingFormula), placing: true, highlighted: false };
        operatorsVisible = [...operatorsVisible, operator];
    }

    return (
        <div className={styles.gridWrapper} style={{ zIndex: 10 }}>
            <svg className={styles.grid} viewBox={`0 0 ${DIM * GRID_SIZE} ${DIM * GRID_SIZE}`}>
                {operatorsVisible.map((operator, i) => (
                    <polyline
                        key={i}
                        points={pointsForOperator(operator)}
                        fill="none"
                        stroke={operator.typ.color}
                        opacity={operator.placing ? 0.7 : operator.highlighted ? 1.0 : 0.3}
                        strokeWidth={GRID_SIZE * 0.95}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                ))}
            </svg>
        </div>
    );
};

export default OperatorGridBg;
