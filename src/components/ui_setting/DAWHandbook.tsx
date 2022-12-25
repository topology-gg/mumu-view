import { CSSProperties, useState } from "react";
import { Box, ListItemText, Tooltip } from "@mui/material";

export default function DAWHandbook() {

    const NOTES_DIM = '150px'
    const CONTENT_FONT_SIZE = '0.9rem'
    const FORMULA_EFFECT_DESCRIPTIONS = [
        'Stir: Change chord progression within established key',
        'Shake: Rotate fretboard notes - Varies melodic contour and range',
        'Steam: Reharmonizes the musical sequence',
        'Smash: Flips the frets upside down',
        'Evolve: Change key - A more dramatic sound than Stir',
        'Slow: A chord change two steps down that creates a dramatic dropping feeling',
        'Wilt: Modulates from major to minor - Changes tone from light to dark (and vice versa)',
        'Bake: Varies the melodies’ intervals by altering the intervals between adjacent grid coordinates.',
    ]

    return (
        <Box sx={{ p: 2, fontFamily: "var(--font-family-secondary)" }}>
            <div style={{paddingLeft:'1rem', paddingTop:'1rem'}}>

            <p
                style={{
                    fontSize: "1.2rem",
                    marginTop: "0",
                    marginBottom: "0",
                    backgroundColor: "#ffffff00",
                }}
            >
                Audio Workstation Handbook
            </p>

            <div
                className={"notes"}
                style={{ width: NOTES_DIM, height: NOTES_DIM, margin: "0.5rem auto 0.5rem auto" }}
            ></div>

            <p style={{fontSize: CONTENT_FONT_SIZE, marginBottom:'1.5rem'}}>
                In MuMu, each Spirit is an autonomous melodic agent traversing a guitar-like fretboard of pitches determined by itself and interactions with other Objects and Formulas. Players can use the musical grid to create note sequences and chord progressions that correspond to specific in-game actions. For example, when a player moves from one square to the next, they’re creating a melody in the contour of their instructions.
            </p>

            <p style={{fontSize: CONTENT_FONT_SIZE, marginBottom:'1.5rem'}}>
                A spirit that is holding onto an object will not make sound.
            </p>

            <p style={{fontSize: CONTENT_FONT_SIZE, marginBottom:'1.5rem'}}>
                Similarly, Formulas can precipitate changes that yield satisfying and sometimes non-repeating variation. As more Spirits are introduced, polyphony arises.
            </p>

            <p style={{fontSize: CONTENT_FONT_SIZE, marginBottom:'1.5rem'}}>
                When a player reaches certain milestones in Formula production, they can trigger specific note/chord/key/fret changes that serve to punctuate the moment and evolve the music. Currently, there are 8 Formulas, each corresponding to a specific musical operation:
            </p>

            <ol
                style={{
                    width: "100%",
                    marginTop: "0.3rem",
                    marginBottom: "2rem",
                }}
            >
                {
                    FORMULA_EFFECT_DESCRIPTIONS.map(s => (
                        <li style={{fontSize: CONTENT_FONT_SIZE, marginBottom:'1rem'}}>
                            {s}
                        </li>
                    ))
                }

            </ol>

            <p style={{fontSize: CONTENT_FONT_SIZE, marginBottom:'1.5rem'}}>
                Note on UI: Clicking on the grids would play the corresponding notes; try tuning the volume for each mech to accentuate particular melodic lines.
            </p>

            </div>
        </Box>
    );
}
