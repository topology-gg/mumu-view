import Grid from './Grid'
import MechState from './MechState'
import Operator from './Operator'

export default interface Solution {
    mechs: MechState[]
    programs: string[]
    operators: Operator[]
    volumes: number[]
}

export interface WrappedSolution {
    name: string
    solution: Solution
}