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
