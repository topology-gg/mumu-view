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

export const note_keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

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
modes.hexatonic = [2, 2, 3, 2, 2, 1] // No avoid notes

modes.minor_pentatonic = [3, 2, 2, 3, 2]
modes.minor_hexatonic = [2, 1, 2, 2, 3, 2]

var modeStepsToName = [
  [modes.major, 'Major'],
  [modes.mixolydian, 'Mixolydian'], 
  [modes.dorian, 'Dorian'], 
  [modes.aeolian, 'Aeolian'],  
  [modes.phrygian, 'Phrygian'], 
  [modes.lydian, 'Lydian'], 
  [modes.locrian, 'Locrian'],  
  [modes.mixolydian_plus_11, 'Mixolydian Plus 11'], 
  [modes.melodicminor, 'Melodic Minor'], 
  [modes.harmonicminor, 'Harmonic Minor'], 
  [modes.naturalminor, 'Natural Minor'], 
  [modes.chromatic, 'Chromatic'], 
  [modes.pentatonic, 'Major Pentatonic'], 
  [modes.hexatonic, 'Major Hexatonic'],
  [modes.minor_pentatonic, 'Minor Pentatonic'], 
  [modes.minor_hexatonic, 'Minor Hexatonic']
];

export const major_modes = [modes.pentatonic, modes.hexatonic]
export const minor_modes = [modes.minor_pentatonic, modes.minor_hexatonic]
export const mumu_modes = [major_modes, minor_modes]

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


// Helper function to get mode name string from mode steps

export function getmodeNameBySteps(key: number[]) {
  for (let i = 0; i < modeStepsToName.length; i++) {
  
   if(key.toString() === modeStepsToName[i][0].toString()){
       var out = modeStepsToName[i][1]
       }
   // console.log(key.toString() === modeStepsToName[i][0].toString())
 }
 return out;
 }