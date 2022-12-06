import Operator, { OPERATOR_TYPES, PlacingFormula } from "../types/Operator";

export const placingFormulaToOperator = (placingFormula: PlacingFormula): Operator => {
    const typ = OPERATOR_TYPES[placingFormula.type];
    const grids = placingFormula.grids;
    return {
        typ,
        input: grids.slice(0, typ.input_atom_types.length),
        output: grids.slice(typ.input_atom_types.length),
    };
};
