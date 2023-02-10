import MechState, {MechStatus, MechType} from '../types/MechState';
import AtomState, {AtomStatus, AtomType} from '../types/AtomState';
import Grid from '../types/Grid'
import BoardConfig from '../types/BoardConfig';
import Frame from '../types/Frame';
import { OperatorType, OPERATOR_TYPES, OperatorState } from '../types/Operator';
import { STATIC_COSTS, DYNAMIC_COSTS } from '../types/Cost';
import { ECDH } from 'crypto';

export default function previewSpirit(
    mech : MechState,
    instructions : string[],
): MechState[] {

    if (instructions == undefined)
    {
        return []
    }
    let states : MechState[] = [mech];
    instructions.map(instruction => {
        mech = _simulate_one_instruction(instruction, mech)
        states.push(mech)
    })

    return states
}

function _simulate_one_instruction (
    instruction: string,
    mechState :MechState
    
): MechState {

        let newState : MechState = {...mechState}

        if (instruction == 'd' && mechState.index.x < 9){ // x-positive
            newState.index = {x:mechState.index.x+1, y:mechState.index.y}
        } else if (instruction == 'a'  && mechState.index.x > 0){
            newState.index = {x:mechState.index.x-1, y:mechState.index.y}
        } else if (instruction == 's' && mechState.index.y < 9){
            newState.index = {x:mechState.index.x, y:mechState.index.y + 1}
        } else if (instruction == 'w' && mechState.index.y > 0){
            newState.index = {x:mechState.index.x, y:mechState.index.y - 1}
        } else if (instruction == 'z' || instruction == 'g'){
            newState.status = MechStatus.CLOSE
        } else if (instruction == 'x' || instruction == 'h'){
            newState.status = MechStatus.OPEN
        }
        
    return newState
}
