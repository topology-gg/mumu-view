import { AtomType } from "../types/AtomState";
import Operator, { OPERATOR_TYPES, PlacingFormula } from "../types/Operator";
import { BgStatus } from "../types/UnitState";

export const placingFormulaToOperator = (placingFormula: PlacingFormula): Operator => {
    const typ = OPERATOR_TYPES[placingFormula.type];
    const grids = placingFormula.grids;
    return {
        typ,
        input: grids.slice(0, typ.input_atom_types.length),
        output: grids.slice(typ.input_atom_types.length),
    };
};

const ATOM_TYPES_TO_FREE_BG_STATUS_MAPPING: Record<AtomType, BgStatus> = {
    [AtomType.VANILLA]: BgStatus.ATOM_VANILLA_FREE,
    [AtomType.HAZELNUT]: BgStatus.ATOM_HAZELNUT_FREE,
    [AtomType.CHOCOLATE]: BgStatus.ATOM_CHOCOLATE_FREE,
    [AtomType.TRUFFLE]: BgStatus.ATOM_TRUFFLE_FREE,
    [AtomType.SAFFRON]: BgStatus.ATOM_SAFFRON_FREE,
    [AtomType.TURTLE]: BgStatus.ATOM_TURTLE_FREE,
    [AtomType.SANDGLASS]: BgStatus.ATOM_SANDGLASS_FREE,
    [AtomType.WILTED]: BgStatus.ATOM_WILTED_FREE,
};

export const atomTypeToFreeBgStatus = (atomType: AtomType): BgStatus => {
    return ATOM_TYPES_TO_FREE_BG_STATUS_MAPPING[atomType];
};
