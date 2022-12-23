import { getmodeNameBySteps, mumu_modes, note_keys } from "./Modes"
import { keynumToPitchClass, num_steps_from_scale_degree, PitchClass } from "./PitchClass"

/* 
This function calculates the notes of any zither/guitar FretBoard for N Strings X N Frets in any Tuning:

We can use this to calculate Calculate a PitchClass Matrix (AKA FretBoard) where only notes contained in a specified mode can be played. 
When Mech's traverse the grid, musicals notes are selected.

Arguments: 

    Name 
    String Steps - Specify Number of modal steps between each open string note for N zither strings (Violins/Guitars are tuned to fourths)
    Num_Frets - Number of Frets to generate. For MuMu, Num_Frets == 7
    Scaledegree - The scaledegree of a given tonic/mode to build the fretboard
    Tonic - Pitch base of the tuning
    Mode - Mode used to tune Frets and steps to increment fret values

EG: Standard Guitar Tuning: 
    E Dorian with string steps: [0, 3, 3, 3, 2, 3, 2], beginning at scale degree 0:
    E - A - D - G - B - E (G) (Seventh String Added for the grid.)

EG: Standard Guqin Tuning: 
    F Pentatonic with string steps: [0, 1, 1, 1, 1, 1, 1], beginning at scale degree 3:
    C - D - F - G - A - C - D (Seventh String Added to match grid dimensions)
*/

/* 
 CHORDS - C-Map
 To create chord progressions that sound good, select from any 6 adjacent cells of the chord_map below. 
 
 To modulate keys safely, rotate 6 adjacent cells along the cells columns. 

 Increasing the distance between cell sets (max-distance = 6) increased the harmonic distance.

 Applying this to formulas, chord changes could occur when a clover is made, while possible modulations to different 
 keys could occur when a smash or steam events occur. This follows the sequential nature of the formulas as each provides the harmonic context for the next. 
 Put another way - The ear needs to traverse a harmonic space to build contexts for modulations to other spaces to occur. 		
 more info at: https://ledgernote.com/columns/music-theory/circle-of-fifths-explained/
*/


// double check that PC to Keynum and Keynum to PC functions return the correct octave

export class FretBoard {
  name: string
  string_steps: number[]
  num_frets: number
  scale_degree: number
  tonic: PitchClass
  mode: number[]
  frets: number[][]
  c_map: number[][]
  quality: number
  offset: number
  msg: string

  constructor(name: string, string_steps: number[], num_frets: number, scale_degree: number, tonic: PitchClass, mode: number[], c_map: number[][], quality: number, offset: number, msg: string) {
    this.name = name
    this.string_steps = string_steps
    this.num_frets = num_frets
    this.scale_degree = scale_degree
    this.tonic = tonic
    this.mode = mode  
    this.frets = []    
    this.c_map = [
      [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5], //major modes/chords
      [9, 4, 11, 6, 1, 8, 3, 10, 5, 0, 7, 2], //minor modes/chords
    ]
    this.quality = quality
    this.offset = offset
    this.fretDataToString()
  }

  fretDataToString(): string {
    return note_keys[this.tonic.note]+ " " + getmodeNameBySteps(this.mode);
  }

  // Using note and quality as argument, output the index to collect the good chords

  // Returns the 6 chords that sound good in relation to the current tonic/mode

  getChordsAtNote(): any {

    var qualmod = this.quality % 2;
    var chord_xy = this.c_map[qualmod].indexOf(this.tonic.note % 12);
    
    if(chord_xy == 0){
      var initial_idx = 11
    }else{
      var initial_idx = chord_xy-1
    }

    var chords = [
      [
        this.c_map[0][initial_idx],
        this.c_map[0][(chord_xy)],
        this.c_map[0][(chord_xy + 1) % 12],
      ],
      [
        this.c_map[1][initial_idx],
        this.c_map[1][chord_xy],
        this.c_map[1][(chord_xy + 1) % 12],
      ],
    ]
    return chords
  }

  //changes the chord in a pleasing way based on x,y coordinate

  setNewChord(x: number, y: number): any {

    var chord_options = this.getChordsAtNote();

    var new_note = chord_options[y % 2][x % 3];

    //console.log('new_note'); 
    //console.log(new_note); 

    var new_tonic = new PitchClass(new_note, 0);
    this.tonic = new_tonic;

    // cycle through mode options and select a mode

    var new_mode = mumu_modes[y % 2][y % mumu_modes.length];
    this.mode = new_mode;

    this.quality = y % 2;

    console.log('new_mode'); 
    console.log(new_mode); 
    
    return this.calculateFrets();
    //return [new_tonic, new_mode]
  }
  
  //subtle change, Sound like a harmonization of the original trajectory - Same harmonic space usually will s

  changeScaleDegree(x: number, y: number): any {
    this.scale_degree = y % this.mode.length;
    var outfrets = this.calculateFrets();
    this.msg = this.msg+' Change Degree: '+this.scale_degree
    return outfrets;
  }

  // Changes chord to from Major -> Minor, Minor -> Major

  changeQuality(x: number, y: number): any {
    var mu_idx = (this.quality + 1) % 2;
    this.quality = mu_idx;
    this.mode = mumu_modes[mu_idx][(x * y) % mumu_modes[mu_idx].length]
    return this.calculateFrets();
  }

  // dramatic shifting modal chord change, especially distinct from the diatonic operations in setNewChord and changeScaleDegree

  changeTransposeDownTwoSteps(x: number, y: number): any {

    if(this.tonic.note-2 < 0){
     this.tonic = new PitchClass(11 + (this.tonic.note-2), 0) 
    }else{
     this.tonic = new PitchClass(this.tonic.note-2, 0) 
    }
    
    return this.calculateFrets();
  }

  changeTransposeDownNSteps(x: number, y: number): any {
    var modprod = (x * y) % 12;
    if(this.tonic.note-modprod < 0){
     this.tonic = new PitchClass(11 + (this.tonic.note - modprod), 0) 
    }else{
     this.tonic = new PitchClass(this.tonic.note - modprod, 0) 
    }
    
    return this.calculateFrets();
  }

  flipFrets(): any {
    var flippedMatrix: number[][] = this.frets.map( (row) =>  row.reverse());
      flippedMatrix.reverse(); 
      this.frets = flippedMatrix;
      this.msg = this.msg+' Frets Flipped'
      return flippedMatrix;
  }

  rotateFrets(n_rotations: number): any {
    let rotatedMatrix: number[][] = this.frets.map( (row) =>  row.slice());
  
    for (let i = 0; i < n_rotations; i++) {
        rotatedMatrix = rotatedMatrix[0].map((_, colIndex) => 
            rotatedMatrix.map((row) =>   row[colIndex])
        );
        rotatedMatrix.reverse(); 
    }
    this.frets = rotatedMatrix;
    this.msg = this.msg+' Frets Rotated'
    return rotatedMatrix;
  }
  
  changeFrets(x: number, y: number): any {
    var fret_choices = [
      [0,2,2,2,2,2,2,2,2,2],
      [0,2,3,2,2,2,3,2,2,3],
      [0,1,2,1,2,1,2,1,2,1],
      [0,2,3,2,3,2,3,2,3,2],
      [0,3,2,3,2,3,2,3,2,3],
      [0,2,2,3,2,2,2,3,2,2],
      [0,2,3,3,2,2,3,3,2,3],
      [0,2,3,3,2,2,3,3,2,3],
      [0,3,2,3,3,2,2,3,2,2],
      [0,3,3,3,2,3,2,2,3,2]
    ];

    this.string_steps = fret_choices[x];
    var outfrets = this.calculateFrets();
    this.msg = this.msg+' Frets Warped'
    return outfrets;
  }

  calculateFrets(): number[][] {
    
    var notearr =  Array()   
  
    var step_offset =  this.offset * 12;
    var top_note_threshold = 120;

    for (var j = 0; j < this.num_frets; j++) {
      var step_sum: number = 0
      var notes: number[] = [] 
       
    // calculate and assign values for each j fret

    for (var i = 0; i < this.string_steps.length; i++) {
      step_sum = step_sum + this.string_steps[i] 
  
      var current_note = this.tonic.modalTransposition((this.scale_degree % this.mode.length) + j, this.tonic, this.mode)

      var total_steps: number = num_steps_from_scale_degree(
        (this.scale_degree % this.mode.length)+j, //increment scale degree for the jth fret
        step_sum,
        this.tonic, //add scale degree designation here
        this.mode
      )
         notes[i] =  current_note + total_steps + step_offset
    }
    notearr.push(notes);
  }

  //check and transpose down n octaves if the upper range is too high
  var topnote = notearr[this.string_steps.length-1][this.num_frets-1];

  if(topnote > top_note_threshold){

    // calculate number of steps to tranpose
    var decrement = ((Math.trunc(topnote - top_note_threshold) + 1) * 12);

    // transpose down decrement-steps
    this.frets = notearr.map(function(entry) { return entry.map(function(entry2) { return entry2-decrement;})})
  }else{
    this.frets = notearr
  }
  
  this.msg = this.fretDataToString();

  return  this.frets  
  }

  getNoteAtXY(x: number, y: number): any {
    var fretdimensions =  this.frets.length
    return this.frets[x % fretdimensions][y % fretdimensions];
  }

}
