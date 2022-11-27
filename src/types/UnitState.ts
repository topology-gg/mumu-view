
import { AtomType } from "./AtomState"

export enum BgStatus {
    EMPTY = 'empty',
    ATOM_VANILLA_FREE = 'vanilla_free',
    ATOM_VANILLA_POSSESSED = 'vanilla_possessed',
    ATOM_HAZELNUT_FREE = 'hazelnut_free',
    ATOM_HAZELNUT_POSSESSED = 'hazelnut_possessed',
    ATOM_CHOCOLATE_FREE = 'chocolate_free',
    ATOM_CHOCOLATE_POSSESSED = 'chocolate_possessed',
    ATOM_TRUFFLE_FREE = 'truffle_free',
    ATOM_TRUFFLE_POSSESSED = 'truffle_possessed',
    ATOM_SAFFRON_FREE = 'saffron_free',
    ATOM_SAFFRON_POSSESSED = 'saffron_possessed',
    ATOM_TURTLE_FREE = 'turtle_free',
    ATOM_TURTLE_POSSESSED = 'turtle_possessed',
    ATOM_SANDGLASS_FREE = 'sandglass_free',
    ATOM_SANDGLASS_POSSESSED = 'sandglass_possessed',
    ATOM_WILTED_FREE = 'wilted_free',
    ATOM_WILTED_POSSESSED = 'wilted_possessed',
}

export const AtomTypeToBg: { [key in AtomType]: BgStatus } = {
    [AtomType.VANILLA]: BgStatus.ATOM_VANILLA_FREE,
    [AtomType.HAZELNUT]: BgStatus.ATOM_HAZELNUT_FREE,
    [AtomType.CHOCOLATE]: BgStatus.ATOM_CHOCOLATE_FREE,
    [AtomType.TRUFFLE]: BgStatus.ATOM_TRUFFLE_FREE,
    [AtomType.SAFFRON]: BgStatus.ATOM_SAFFRON_FREE,
    [AtomType.TURTLE]: BgStatus.ATOM_TURTLE_FREE,
    [AtomType.SANDGLASS]: BgStatus.ATOM_SANDGLASS_FREE,
    [AtomType.WILTED]: BgStatus.ATOM_WILTED_FREE,
}

export enum BorderStatus {
    EMPTY = 'empty',
    SINGLETON_OPEN = 'singleton_open',
    SINGLETON_CLOSE = 'singleton_close',
}

export enum UnitText {
    EMPTY = '',
    GRID = '·',
    FAUCET = 'F',
    SINK = 'S',
    OPERAND_STIR = '&',
    OPERAND_SHAKE = '%',
    OUTPUT = '=',
}

export default interface UnitState {
    unit_id: string | null,
    bg_status: BgStatus,
    border_status: BorderStatus,
    unit_text: UnitText
}
