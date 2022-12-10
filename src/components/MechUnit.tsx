import React, { useState, useRef, useEffect, useMemo } from "react";
import MechState, { MechStatus, MechType } from "../types/MechState";
import Grid from "../types/Grid";
import { DIM, PROGRAM_SIZE_MAX, DEMO_SOLUTIONS, N_CYCLES } from "../constants/constants";
import { Box, Button, Tooltip } from "@mui/material";
import { ANIM_FRAME_LATENCY } from "../constants/constants";
import AtomState, { AtomType } from "../types/AtomState";
import { useSpring, animated } from "react-spring";
import styles from "../../styles/Unit.module.css";

interface MechUnitProps {
    mechState: MechState
    possessedAtom?: AtomState
}

export default function MechUnit ({ mechState, possessedAtom }: MechUnitProps) {

    if (!mechState) return <></>

    const lastMechGridRef = useRef<Grid>({x:0,y:0});

    const { left } = useSpring({
        from: {left: 16 + 3.2 + lastMechGridRef.current.x * (32+3.2*2)},
        left: 16 + 3.2 + mechState.index.x * (32+3.2*2)
    })
    const { top } = useSpring({
        from: {top: 16 + 3.2 + lastMechGridRef.current.y * (32+3.2*2)},
        top: 16 + 3.2 + mechState.index.y * (32+3.2*2)
    })

    // remember mech index in useRef
    lastMechGridRef.current = mechState.index

    // compute mech class name (to determine background image)
    const mechClassName = mechState.status == MechStatus.OPEN ? 'grabberOpen' : 'grabberClose'

    // compute atom class name (if possessing one)
    let AtomClassName: string = '';
    if (possessedAtom !== null) {
        if (possessedAtom.typ == AtomType.VANILLA)        AtomClassName = styles.atomVanillaPossessed
        else if (possessedAtom.typ == AtomType.HAZELNUT)  AtomClassName = styles.atomHazelnutPossessed
        else if (possessedAtom.typ == AtomType.CHOCOLATE) AtomClassName = styles.atomChocolatePossessed
        else if (possessedAtom.typ == AtomType.TRUFFLE)   AtomClassName = styles.atomTrufflePossessed
        else if (possessedAtom.typ == AtomType.SAFFRON)   AtomClassName = styles.atomSaffronPossessed
        else if (possessedAtom.typ == AtomType.TURTLE)    AtomClassName = styles.atomTurtlePossessed
        else if (possessedAtom.typ == AtomType.SANDGLASS) AtomClassName = styles.atomSandglassPossessed
        else if (possessedAtom.typ == AtomType.WILTED)    AtomClassName = styles.atomWiltedPossessed
    }

    // Render
    // ref to making child div having lower z-index than parent div:
    // https://stackoverflow.com/questions/2503705/how-to-get-a-child-element-to-show-behind-lower-z-index-than-its-parent
    return (
        <animated.div
            className={`${mechClassName}`}
            style={{
            position: 'absolute',
            // border: '1px solid #555555',
            left: left,
            top: top,
            width: '2rem',
            height: '2rem',
            alignItems: 'center',
            lineHeight: '2rem',
            zIndex: '30',
            transformStyle:'preserve-3d',
        }}>
            {
                possessedAtom !== null ?
                <div style={{
                    position:'absolute',width:'100%',height:'100%',transform:'translateZ(-10px)'
                }} className={AtomClassName}></div>
                :
                <></>
            }
        </animated.div>
    );
}
