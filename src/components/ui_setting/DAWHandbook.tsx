import { CSSProperties, useState } from "react";
import { Box, ListItemText, Tooltip } from "@mui/material";

export default function DAWHandbook() {

    return (
        <Box sx={{ p: 2, fontFamily: "var(--font-family-secondary)" }}>
            <div style={{paddingLeft:'1rem', paddingTop:'1rem'}}>

            <p
                style={{
                    fontSize: "0.9rem",
                    marginTop: "0",
                    marginBottom: "0",
                    backgroundColor: "#ffffff00",
                }}
            >
                Audio Workstation Handbook
            </p>

            <ol
                style={{
                    width: "30rem",
                    marginTop: "0.3rem",
                    marginBottom: "2rem",
                }}
            >
                <li style={{}}>
                    Stir: Change chord progression within established key
                </li>

                <li style={{}}>
                    Shake: Rotate fretboard notes - Varies melodic contour and range
                </li>

                <li style={{}}>
                    Steam: Reharmonizes the musical sequence
                </li>

                <li style={{}}>
                    Smash: Flips the frets upside down
                </li>

                <li style={{}}>
                    Evolve: Change key - A more dramatic sound than Stir
                </li>

                <li style={{}}>
                    Slow: A chord change two steps down that creates a dramatic dropping feeling
                </li>

                <li style={{}}>
                    Wilt: Modulates from major to minor - Changes tone from light to dark (and vice versa)
                </li>

                <li style={{}}>
                    Bake: Varies the melodies’ intervals by altering the intervals between adjacent grid coordinates.
                </li>

            </ol>

            </div>
        </Box>
    );
}
