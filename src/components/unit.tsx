import UnitState, { BgStatus, BorderStatus } from "../types/UnitState";
import styles from "../../styles/Unit.module.css";
import { useSpring, animated } from "react-spring";
import { AtomType } from "../types/AtomState";
import { keynumToMuMuView } from "../helpers/MuMuMusic/PitchClass";
import { Modes } from "../constants/constants";

interface UnitProps {
    atomOpacity?: number;
    mode?: Modes;
    noteNum?: number;
    state: UnitState;
    consumableAtomType?: AtomType;
    produceableAtomType?: AtomType;
    handleMouseOver?: () => void;
    handleMouseOut?: () => void;
    mechHighlight?: boolean;
    isSmall: boolean;
    onClick?: () => void;
    onMouseDown?: () => void;
    isConsumed?: boolean;
    isProduced?: boolean;
    gridDimensionRem?: number;
    marginRem?: number;
    isHovered?: boolean;
}

export default function Unit({
    atomOpacity,
    mode,
    noteNum,
    state,
    consumableAtomType,
    produceableAtomType,
    handleMouseOver,
    handleMouseOut,
    mechHighlight,
    isSmall,
    onClick,
    onMouseDown,
    isConsumed,
    isProduced,
    gridDimensionRem = 2,
    marginRem = 0.2,
    isHovered = false,
}: UnitProps) {

    // guardrail
    if (!state) {
        return <></>;
    }

    // animation prop
    // note: if this unit is an output of a formula && the unit is not producing nor occupied in the current frame,
    // .     return the backgroundSize of this unit to 0 to prepare for the animation for next producing frame
    const fullBackgroundSize = 0.9 * gridDimensionRem * 16// 90% of grid dimension
    const animationStyle = isSmall ? useSpring({}) :
    isConsumed ? useSpring({
        from: {backgroundSize: fullBackgroundSize},
        backgroundSize: 0,
        config: {friction: 45}
    }) :
    isProduced ? useSpring({
        from: {backgroundSize: 0},
        backgroundSize: fullBackgroundSize,
        config: {friction: 40}
    }) :
    (produceableAtomType !== null && state.bg_status == BgStatus.EMPTY) ? useSpring({
        backgroundSize: 0
    }) : useSpring({
        backgroundSize: fullBackgroundSize
    })

    // Compute atom styles
    let divStyle: React.CSSProperties = {};
    if (isSmall) {
        divStyle = { ...divStyle, width: `${gridDimensionRem*0.8}rem`, height: `${gridDimensionRem*0.8}rem` };
    }
    else {
        divStyle = { ...divStyle, width: `${gridDimensionRem}rem`, height: `${gridDimensionRem}rem` };
    }
    divStyle = { ...divStyle, zIndex: "20" };

    let className: string = '';
    if (state.bg_status === BgStatus.ATOM_VANILLA_FREE || (isConsumed && consumableAtomType === AtomType.VANILLA)) {
        className += styles.atomVanillaFree + " ";
    }
    else if (state.bg_status === BgStatus.ATOM_HAZELNUT_FREE || (isConsumed && consumableAtomType === AtomType.HAZELNUT)) {
        className += styles.atomHazelnutFree + " ";
    }
    else if (state.bg_status === BgStatus.ATOM_CHOCOLATE_FREE || (isConsumed && consumableAtomType === AtomType.CHOCOLATE)) {
        className += styles.atomChocolateFree + " ";
    }
    else if (state.bg_status === BgStatus.ATOM_TRUFFLE_FREE || (isConsumed && consumableAtomType === AtomType.TRUFFLE)) {
        className += styles.atomTruffleFree + " ";
    }
    else if (state.bg_status === BgStatus.ATOM_SAFFRON_FREE || (isConsumed && consumableAtomType === AtomType.SAFFRON)) {
        className += styles.atomSaffronFree + " ";
    }
    else if (state.bg_status === BgStatus.ATOM_TURTLE_FREE || (isConsumed && consumableAtomType === AtomType.TURTLE)) {
        className += styles.atomTurtleFree + " ";
    }
    else if (state.bg_status === BgStatus.ATOM_SANDGLASS_FREE || (isConsumed && consumableAtomType === AtomType.SANDGLASS)) {
        className += styles.atomSandglassFree + " ";
    }
    else if (state.bg_status === BgStatus.ATOM_WILTED_FREE || (isConsumed && consumableAtomType === AtomType.WILTED)) {
        className += styles.atomWiltedFree + " ";
    }

    const mechId = state.unit_id && state.unit_id.includes("mech") && state.unit_id.replace("mech", "");

    let renderedText = ''
    if (mode != Modes.daw) {
        renderedText = state.unit_text;
    }
    else {
        renderedText = keynumToMuMuView(noteNum);

        if (state.unit_text == 'F') {
            className += styles.faucet + ' ';
        }
        else if (state.unit_text == 'S') {
            className += styles.sink + ' ';
        }
    }

    // Render
    return (
        <animated.div
            className={`grid ${styles.unit} ${className} ${isHovered ? 'grid-hovered' : ''}`}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={onClick}
            onMouseDown={onMouseDown}
            style={{
                ...divStyle,
                ...animationStyle,
                opacity: atomOpacity || 1.0,
                margin: `${marginRem}rem`,
                borderRadius: `${gridDimensionRem/2}rem`,
            }}
        >
            {renderedText}
        </animated.div>
    );
}

