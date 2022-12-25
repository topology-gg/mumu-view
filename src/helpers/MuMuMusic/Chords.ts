/* 
 CHORDS
 To create chord progressions that sound good, select from any 6 adjacent cells of the chord_map below. 
 
 To modulate keys safely, rotate 6 adjacent cells along the cells columns. 

 Increasing the distance between cell sets (max-distance = 6) increased the harmonic distance.

 Applying this to formulas, chord changes could occur when a clover is made, while possible modulations to different 
 keys could occur when a smash or steam events occur. This follows the sequential nature of the formulas as each provides the harmonic context for the next. 
 Put another way - The ear needs to traverse a harmonic space to build contexts for modulations to other spaces to occur. 		
 more info at: https://ledgernote.com/columns/music-theory/circle-of-fifths-explained/
*/

import { mumu_modes } from "./Modes"
import { PitchClass } from "./PitchClass"


export class ChordMap {
  chord_map: number[][]
  tonic: PitchClass
  quality: number // 0 == major, 1 == minor

  constructor(tonic: PitchClass, quality: number) {
    this.chord_map = [
      [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5], //major modes/chords
      [9, 4, 11, 6, 1, 8, 3, 10, 5, 0, 7, 2], //minor modes/chords
    ]
    this.tonic = tonic
    this.quality = quality
  }

  getChordsAtNote(): any {

    var qualmod = this.quality % 2;
    var chord_xy = this.chord_map[qualmod].indexOf(this.tonic.note % 12);
    
    if(chord_xy == 0){
      var initial_idx = 11
    }else{
      var initial_idx = chord_xy-1
    }

    var chords = [
      [
        this.chord_map[0][initial_idx],
        this.chord_map[0][(chord_xy)],
        this.chord_map[0][(chord_xy + 1) % 12],
      ],
      [
        this.chord_map[1][initial_idx],
        this.chord_map[1][chord_xy],
        this.chord_map[1][(chord_xy + 1) % 12],
      ],
    ]
    return chords
  }

  setNewChord(x: number, y: number): any {

    var chord_options = this.getChordsAtNote();

    var new_note = chord_options[y % 2][x % 3];

    console.log('new_note'); 
    console.log(new_note); 

    var new_tonic = new PitchClass(new_note, 0);
    this.tonic = new_tonic;

    // cycle through mode options and select a mode
    var new_mode = mumu_modes[y % 2][y % mumu_modes.length];
    this.quality = y % 2;

    console.log('new_mode'); 
    console.log(new_mode); 
    
    return [new_tonic, new_mode]
  }


  getChordsAt(idx: number): any {
    var chords = [
      [
        this.chord_map[0][idx % 12],
        this.chord_map[0][(idx + 1) % 12],
        this.chord_map[0][(idx + 2) % 12],
      ],
      [
        this.chord_map[1][idx % 12],
        this.chord_map[1][(idx + 1) % 12],
        this.chord_map[1][(idx + 2) % 12],
      ],
    ]
    return chords
  }
}

export const chord_map = [
  [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5], //major modes/chords
  [9, 4, 11, 6, 1, 8, 3, 10, 5, 0, 7, 2], //minor modes/chords
] as const

//Function picks 1 of the 12 possible sets of (six) chords to choose

export function get_chords_at_idx(idx: number) {
  var chords = [
    [
      chord_map[0][idx % 12],
      chord_map[0][(idx + 1) % 12],
      chord_map[0][(idx + 2) % 12],
    ],
    [
      chord_map[1][idx % 12],
      chord_map[1][(idx + 1) % 12],
      chord_map[1][(idx + 2) % 12],
    ],
  ]
  return chords
}
