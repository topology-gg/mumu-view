import Grid from './Grid'

export default interface AtomSinkState {
  id: string
  index: Grid
}

export interface PlacingAtomSink {
    id: string;
    index: Grid;
    complete?: boolean;
}
