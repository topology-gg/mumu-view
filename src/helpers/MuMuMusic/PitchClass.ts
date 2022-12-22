/*
 Define a 12 note octave base
 For Microtonal mode definition, change the OCTAVEBASE and represent scales as intervallic ratios summing to OCTAVEBASE
*/

export const octavebase: number = 12

/*
 PITCHCLASS & NOTE UTILS

 Defintions:

 Note - Integer representation of pitches % OCTAVEBASE. Example E Major -> [1,3,4,6,8,9,11]  (C#,D#,E,F#,G#,A,B)
 Keynum - Integer representing MIDI note. Keynum = Note * (OCTAVEBASE * OctaveOfNote)
 Mode - Distances between adjacent notes within an OCTAVEBASE. Example: Major Key -> [2,2,1,2,2,2,1]
 Key  - A Mode transposed at a given pitch base
 Tonic - A Note transposing a Mode
 Modal Transposition - Moving up or down in pitch by a constant interval within a given mode
 Scale Degree - The position of a particular note on a scale relative to the tonic
*/

export class PitchClass {
  note: number
  octave: number

  constructor(note: number, octave: number) {
    this.note = note
    this.octave = octave
  }

  // Converts a PitchClass to a MIDI keynum

  pcToKeynum(): number {
    var keynum: number = this.note + (octavebase * (this.octave))
    return keynum
  }

  scaleDegree( tonic: PitchClass, mode: number[]): number {

    var key_arr: number[] = get_notes_of_key(tonic, mode)

    return key_arr.indexOf(this.note) 
  }

  modalTransposition(steps: number, tonic: PitchClass, mode: number[]): number {

    var key_arr: number[] = get_notes_of_key(tonic, mode)
    var scaledegree: number = key_arr.indexOf(this.note)
    var keyn = this.note + octavebase * (this.octave)
  
    var total_steps: number = num_steps_from_scale_degree(
      scaledegree,
      steps,
      tonic,
      mode
    )

    return keyn + total_steps
  }

  modalTranspositionPC(steps: number, tonic: PitchClass, mode: number[]): PitchClass {

    var key_arr: number[] = get_notes_of_key(tonic, mode)
    var scaledegree: number = key_arr.indexOf(this.note)
    var keyn = this.note + octavebase * (this.octave)
  
    var total_steps: number = num_steps_from_scale_degree(
      scaledegree,
      steps,
      tonic,
      mode
    )

    return keynumToPitchClass(keyn + total_steps)
  }

  // Converts MIDI keynum to note value

  keynumToNote(keynum: number): number {
    return keynum % octavebase
  }
}

// Utility Functions

export function keynumToNote(keynum: number) {
  return keynum % octavebase
}

export function keynumToPitchClass(keynum: number) {
  let pc = new PitchClass(
    keynum % octavebase,
    Math.floor(keynum / octavebase) 
  )
  return pc
}

/*
 MODAL TRANSPOSITION Functions

 In order to compute modal transposition of a note given a mode and stepnum, 
 one must calculate the distance of the transposition in steps from a given scale degree
 
 E.G. Transposing the note D in the key of C major by 2 steps is F. The distance of that transposition == 4 steps
 get back here the thing to test is collapse both transposition functions in to one
*/

//Compute and Return notes of mode at note base - note base is omitted

export function mode_notes_above_note_base(
    pitchbase: number,
    mode: Array<number>
  ) {
    var step_sum: number = 0
    var notes: number[] = new Array(mode.length)
  
    for (var i = 0; i < notes.length; i++) {
      step_sum = step_sum + mode[i]
      notes[i] = pitchbase + step_sum
    }
    return notes
  }
  
export function get_notes_of_key(pc: PitchClass, mode: Array<number>) {
    var step_sum: number = 0
    var notes: number[] = new Array(mode.length + 1)
    notes[0] = pc.note
  
    for (var i = 0; i < mode.length; i++) {
      step_sum = step_sum + mode[i]
      notes[i + 1] = (pc.note + step_sum) % 12
    }
    return notes
  }
  
/* 
 Returns the scale degree of a note, given a tonic and mode (-1 if not found)
 In this implementation, Scale degrees use zero-based counting, unlike in prevalent music theory literature 
*/
  
export function get_scale_degree(
    pc: PitchClass,
    tonic: PitchClass,
    mode: Array<number>
  ) {
    var key_arr: number[] = get_notes_of_key(tonic, mode)
    var index = key_arr.indexOf(pc.note)
  
    return index
  }
  
export function keynum_to_scale_degree(
    keynum: number,
    tonic: PitchClass,
    mode: Array<number>
  ) {
    var summ: number = 0
  
    var key_arr: number[] = get_notes_of_key(tonic, mode)
    var note = keynumToNote(keynum)
    var index = key_arr.indexOf(note)
  
    return index
  }
  
// Calculates for both + & - modal steps from a given scale degree
  
export function num_steps_from_scale_degree(
    scale_degree: number,
    num_steps: number,
    tonic: PitchClass,
    mode: number[]
  ) {
    var abs_steps = Math.abs(num_steps)
    var sum: number = 0
    var currentstep: number
    //var reverse_mode: number[] = mode.reverse()
    var reverse_mode: number[] = [...mode].reverse()
    var inverted_scale_degree =
      (mode.length - 1 - Math.abs(scale_degree)) % mode.length
  
    // console.log("scale degree inverted" + inverted_scale_degree)
  
    for (var i = 0; i < abs_steps; i++) {
      if (num_steps < 0) {
        var currentstep = (inverted_scale_degree + Math.abs(i)) % mode.length
        sum = sum - reverse_mode[currentstep]
      } else {
        var currentstep = (scale_degree + i) % mode.length
        sum = sum + mode[currentstep]
      }
    }
  
    return sum
  }
  
export function modaltransposition(
    keynum: number,
    num_steps: number,
    tonic: PitchClass,
    mode1: number[]
  ) {
    var scale_degree: number = keynum_to_scale_degree(keynum, tonic, mode1)
    console.log("scale degree " + scale_degree)
    console.log("mode : " + mode1)
  
    var total_steps: number = num_steps_from_scale_degree(
      scale_degree,
      num_steps,
      tonic,
      mode1
    )
  
    return keynum + total_steps
  }
  
/*
 Not Currently Necessary for Modulations

 Bi-Modal Transpostion  
 Functions to calculate transposition of a PitchClass from (tonic+mode) to a (tonic+mode) 
 Useful for changing keys when certain alchemy events occur
*/
 