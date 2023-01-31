import React, { useState, useRef, useEffect, useMemo } from "react";
import MechState, { MechStatus, MechType } from "../types/MechState";
import Grid from "../types/Grid";
import AtomState, { AtomType } from "../types/AtomState";
import { useSpring, animated } from "react-spring";
import styles from "../../styles/Unit.module.css";

interface MechUnitProps {
    mechState: MechState
    possessedAtom?: AtomState
    gridDimensionRem: number
    unitMarginRem: number
    isTransparent : boolean
}

export default function MechUnit ({ mechState, possessedAtom, gridDimensionRem, unitMarginRem, isTransparent }: MechUnitProps) {

    if (!mechState) return <></>
    if (mechState.index == null) return <></>

    
    const lastMechGridRef = useRef<Grid>({x:mechState.index.x,y:mechState.index.y});
    
    const gridPixel = gridDimensionRem * 16
    const marginPixel = unitMarginRem * 16
    const { left } = useSpring({
        from: {left: 16 + marginPixel + lastMechGridRef.current.x * (gridPixel + marginPixel*2)},
        left: 16 + marginPixel + mechState.index.x * (gridPixel + marginPixel*2)      
    })
    const { top } = useSpring({
        from: {top: 16 + marginPixel + lastMechGridRef.current.y * (gridPixel + marginPixel*2)},
        top: 16 + marginPixel + mechState.index.y * (gridPixel + marginPixel*2)     
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

    const mech_id = mechState.id.replace('mech','')

    const mech_opacity = isTransparent ? '.5' : '1';
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
            width: `${gridDimensionRem}rem`,
            height: `${gridDimensionRem}rem`,
            alignItems: 'center',
            lineHeight: `${gridDimensionRem}rem`,
            zIndex: '30',
            transformStyle:'preserve-3d',
            opacity : mech_opacity
        }}>
            {
                possessedAtom !== null ?
                <div style={{
                    position:'absolute',width:'100%',height:'100%',transform:'translateZ(-10px)'
                }} className={AtomClassName}></div>
                :
                <></>
            }
            <div className={styles.unitId}>{mech_id}</div>
        </animated.div>
    );
}
