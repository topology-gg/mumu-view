import { useState } from "react";
import { OperatorState } from "../types/Operator";
import AtomFaucetState from "../types/AtomFaucetState";
import { Constraints } from "../constants/constants";
import { AtomTypeToBg } from "../types/UnitState";
import { UnitText } from "../types/UnitState";
import Unit from "./unit";
import { Delete } from "@mui/icons-material";

interface DAWFaucetRowProps {
    faucet: AtomFaucetState;
    animationState: string;
    handleOnDelete: () => void;
}

export default function DAWFaucetRow ({
    faucet,
    animationState,
    handleOnDelete,
} : DAWFaucetRowProps) {

    const disabled = animationState != 'Stop';
    const voidFunc = () => {};

    // render
    return (
        <div style={{
            marginBottom:'0.3rem', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'left',
            width: '10rem',
        }}>

            <Delete
                fontSize="small"
                sx={{mr:1, color:'#AAAAAA', "&:hover": { color:disabled?"#AAAAAA":"#555555", cursor:disabled?'default':'pointer' }}}
                onClick={!disabled ? handleOnDelete : voidFunc}
            />

            <p>Faucet  @({faucet.index.x},{faucet.index.y})</p>
            <Unit
                atomOpacity={1.0}
                state={{
                    bg_status: AtomTypeToBg[faucet.typ],
                    border_status: null,
                    unit_text: UnitText.EMPTY,
                    unit_id: null,
                }}
                handleMouseOut={() => {}}
                handleMouseOver={() => {}}
                mechHighlight={false}
                isSmall={true}
            />
        </div>
    );
}