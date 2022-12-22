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

// double check that PC to Keynum and Keynum to PC functions return the correct octave

export class FretBoard {
  name: string
  string_steps: number[]
  num_frets: number
  scale_degree: number
  tonic: PitchClass
  mode: number[]
  frets: number[][]

  constructor(name: string, string_steps: number[], num_frets: number, scale_degree: number, tonic: PitchClass, mode: number[]) {
    this.name = name
    this.string_steps = string_steps
    this.num_frets = num_frets
    this.scale_degree = scale_degree
    this.tonic = tonic
    this.mode = mode  
    this.frets = []    
  }
  
  calculateFrets(octave_offset: number): number[][] {
      
    var notearr =  Array()   
    var step_offset =  octave_offset * 12;
    for (var j = 0; j < this.num_frets; j++) {
      var step_sum: number = 0
      var notes: number[] = [] 
       
    // calculate and assign values for each j fret

    for (var i = 0; i < this.string_steps.length; i++) {
      step_sum = step_sum + this.string_steps[i] 
  
      var current_note = this.tonic.modalTransposition(this.scale_degree + j, this.tonic, this.mode)

      var total_steps: number = num_steps_from_scale_degree(
        this.scale_degree+j, //increment scale degree for the jth fret
        step_sum,
        this.tonic, //add scale degree designation here
        this.mode
      )
         notes[i] =  current_note + total_steps + step_offset
    }
    notearr.push(notes);
  }
  
  this.frets = notearr

  return  notearr  
  }

  getNoteAtXY(x: number, y: number): any {
    var fretdimensions =  this.frets.length
    return this.frets[x % fretdimensions][y % fretdimensions];
  }

}
