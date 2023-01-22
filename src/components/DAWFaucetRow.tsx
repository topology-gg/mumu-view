import { useState } from "react";
import { OperatorState } from "../types/Operator";
import AtomFaucetState from "../types/AtomFaucetState";
import { Constraints } from "../constants/constants";
import { AtomTypeToBg } from "../types/UnitState";
import { UnitText } from "../types/UnitState";
import Unit from "./unit";

interface DAWFaucetRowProps {
    faucet: AtomFaucetState;
    animationState: string;
}

export default function DAWFaucetRow ({
    faucet,
    animationState,
} : DAWFaucetRowProps) {

    // render
    return (
        <div style={{marginBottom:'0.3rem', display:'flex', flexDirection:'row', alignItems:'center'}}>
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
