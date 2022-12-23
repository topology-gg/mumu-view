import MechState from "./MechState";
import AtomState, {AtomType} from "./AtomState";
import { OperatorState } from "./Operator";

export default interface Frame {
    mechs: MechState[]
    atoms: AtomState[]
    operators: OperatorState[]
    grid_populated_bools: { [key: string] : boolean }
    delivered_accumulated: AtomType[]
    cost_accumulated: number
    notes: string
    consumed_atom_ids: string[]
    produced_atom_ids: string[]
}
