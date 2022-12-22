/*
 MODE & KEY DEFINITIONS

 We define Scales/Modes as an ordered array of ascending interval steps
 Example 1: [do, re, me, fa, sol, la, ti] in C Major Key -> C,D,E,F,G,A,B -> Modal Steps: [2,2,1,2,2,1]

 It is from these defined steps that we can compute a 'Key' AKA Pitches of a Mode at a given Note Base

 For microtonal scales, steps should be defined as ratios of BASEOCTAVE

 NOTE: SCALE DEGREESS USE ZERO BASED COUNTING (unlike music theory literature)

 Modes are arranged by the cycle of fifths

 It might be good to use modes with few/no avoid notes to make sure one is always sounding musical: https://en.wikipedia.org/wiki/Avoid_note

 E.G. Lydian, Pentatonic and Dorian are great choices
*/

/*
Mode Definition Map
*/

export const modes: { [name: string]: number[] } = {}

modes.major = [2, 2, 1, 2, 2, 2, 1] //avoid notes scale degree 3
modes.mixolydian = [2, 2, 1, 2, 2, 1, 2] //avoid notes scale degree 3
modes.dorian = [2, 1, 2, 2, 2, 1, 2] //avoid notes scale degree 5 but modern ears usually like it
modes.aeolian = [2, 1, 2, 2, 2, 2, 2] // avoid notes scale degree 5
modes.phrygian = [1, 2, 2, 2, 1, 2, 2] // avoid notes scale degree 1 & 5
modes.lydian = [2, 2, 2, 1, 2, 2, 1] // No avoid notes
modes.locrian = [1, 2, 2, 1, 2, 2, 2] // avoid notes scale degree 1

// Non-Diatonic Modes (Modes built from stepwise arrangement of the seven “natural” pitches)

modes.mixolydian_plus_11 = [2, 2, 2, 1, 2, 1, 2] //no avoid notes
modes.melodicminor = [2, 1, 2, 2, 2, 2, 1] //no avoid notes
modes.harmonicminor = [2, 1, 2, 2, 1, 3, 1]
modes.naturalminor = [2, 1, 2, 2, 2, 2, 2]
modes.chromatic = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
modes.pentatonic = [2, 2, 3, 2, 3] // No avoid notes

export let cycle_of_fifths_modes: { [name: string]: number[] } = {}

cycle_of_fifths_modes.major = modes.major
cycle_of_fifths_modes.mixolydian = modes.mixolydian
cycle_of_fifths_modes.dorian = modes.dorian
cycle_of_fifths_modes.aeolian = modes.aeolian
cycle_of_fifths_modes.phrygian = modes.phrygian
cycle_of_fifths_modes.locrian = modes.locrian
cycle_of_fifths_modes.lydian = modes.lydian

/*
 Modes sorted by lighter to dark quality
 Indexed 0-7 ; Equal to grid dimensions

 https://guitarchitecture.org/2011/10/02/the-guitarchitect%E2%80%99s-guide-to-modes-part-the-circle-of-5ths-modal-interchange-and-making-the-most-of-one-pattern/
*/

export var light_to_dark_mode_arr = [
  modes.pentatonic,
  modes.lydian,
  modes.major,
  modes.mixolydian_plus_11,
  modes.dorian,
  modes.aeolian,
  modes.phrygian,
  modes.locrian, //might swap with melodic minor
] 

// String - Map Version

export let lighter_to_dark_modes: { [name: string]: number[] } = {}
lighter_to_dark_modes.lydian = modes.lydian
lighter_to_dark_modes.major = modes.major
lighter_to_dark_modes.mixolydian = modes.mixolydian
lighter_to_dark_modes.dorian = modes.dorian
lighter_to_dark_modes.aeolian = modes.aeolian
lighter_to_dark_modes.phrygian = modes.phrygian
lighter_to_dark_modes.locrian = modes.locrian