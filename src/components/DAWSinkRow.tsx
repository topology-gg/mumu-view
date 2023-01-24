import { useState } from "react";
import { OperatorState } from "../types/Operator";
import AtomFaucetState from "../types/AtomFaucetState";
import { Constraints } from "../constants/constants";
import { AtomTypeToBg } from "../types/UnitState";
import { UnitText } from "../types/UnitState";
import Unit from "./unit";
import { Delete } from "@mui/icons-material";
import AtomSinkState from "../types/AtomSinkState";

interface DAWSinkRowProps {
    sink: AtomSinkState;
    animationState: string;
    handleOnDelete: () => void;
}

export default function DAWSinkRow ({
    sink,
    animationState,
    handleOnDelete,
} : DAWSinkRowProps) {

    const disabled = animationState != 'Stop';
    const voidFunc = () => {};

    // render
    return (
        <div style={{marginBottom:'0.3rem', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'left',
            width: '10rem',
        }}>

            <Delete
                fontSize="small"
                sx={{mr:1, color:'#AAAAAA', "&:hover": { color:disabled?"#AAAAAA":"#555555", cursor:disabled?'default':'pointer' }}}
                onClick={!disabled ? handleOnDelete : voidFunc}
            />

            <p>Sink  @({sink.index.x},{sink.index.y})</p>
        </div>
    );
}
