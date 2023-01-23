import Grid from './Grid'

export enum AtomStatus {
    FREE = 'free',
    POSSESSED = 'possessed',
    DELIVERED = 'delivered',
    CONSUMED = 'consumed',
}

export enum AtomType {
    VANILLA = 'Wood',
    HAZELNUT = 'Clover',
    CHOCOLATE = 'Rose',
    TRUFFLE = 'Fox',
    SAFFRON = 'Fire',
    TURTLE = 'Turtle',
    SANDGLASS = 'Sandglass',
    WILTED = 'Wilted Rose',
}

export default interface AtomState {
    id: string
    typ: AtomType
    status: AtomStatus
    index: Grid
    possessed_by: string
}
