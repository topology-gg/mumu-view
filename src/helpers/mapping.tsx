import MechState from "../types/MechState";
import Operator from "../types/Operator";

const symbol = {
    "&": 0,
    "%": 1,
    "^": 2,
    "#": 3,
    "§": 4,
    "|": 5,
    "~": 6,
    "!": 7,
};

export function mappingInstructions(
    instructions: number[],
    local_offset = 128
) {
    let offset = new Map<number, number>();
    instructions.forEach((instruction) => {
        let o = offset.get(instruction) || 0;
        offset.set(instruction, o + 1);
        return (instruction + 1) * local_offset + o;
    });
}

export function mappingMechs(mechs: MechState[], global_offset = 2048) {
    let offset = new Map<number, number>();
    return mechs.forEach((mech) => {
        let o = offset.get(mech.index.x * 512 + mech.index.y * 32) || 0;
        offset.set(mech.index.x * 512 + mech.index.y * 32, o + 1);
        return global_offset + mech.index.x * 512 + mech.index.y * 32 + o;
    });
}

export function mappingOperators(operators: Operator[], global_offset = 12288) {
    return operators.flatMap((operator) => {
        let t = symbol[operator.typ.symbol];
        return operator.input
            .map((i) => t * 256 + i.x * 6 + i.y)
            .concat(operator.output.map((i) => t * 256 + i.x * 6 + i.y));
    });
}
