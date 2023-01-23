import { useState } from "react";
import { OperatorState } from "../types/Operator";
import AtomFaucetState from "../types/AtomFaucetState";
import AtomSinkState from "../types/AtomSinkState";
import { Constraints } from "../constants/constants";
import { AtomTypeToBg } from "../types/UnitState";
import { UnitText } from "../types/UnitState";
import Unit from "./unit";
import { Delete } from "@mui/icons-material";

interface DAWFaucetSinkRowProps {
    isFaucet: boolean;
    faucetSink: AtomFaucetState | AtomSinkState;
    animationState: string;
    handleOnDelete: () => void;
    handleOnMouseEnter: () => void;
    handleOnMouseLeave: () => void;
}

export default function DAWFaucetSinkRow ({
    isFaucet,
    faucetSink,
    animationState,
    handleOnDelete,
    handleOnMouseEnter,
    handleOnMouseLeave,
} : DAWFaucetSinkRowProps) {

    const disabled = animationState != 'Stop';
    const voidFunc = () => {};

    // render
    return (
        <div style={{
            marginBottom:'0.3rem',
            display:'flex', flexDirection:'row', alignItems:'center',
            justifyContent:'left',
            width: '10rem'
        }}>
            <div
                style={{
                    display:'flex', flexDirection:'row', alignItems:'center', borderRadius:'10px', padding:'0 5px 0 5px'
                }}
                className='daw-faucet-row-div'
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
            >
                <Delete
                    fontSize="small"
                    sx={{mr:1, color:'#AAAAAA', "&:hover": { color:disabled?"#AAAAAA":"#555555", cursor:disabled?'default':'pointer' }}}
                    onClick={!disabled ? handleOnDelete : voidFunc}
                />

                <p>{isFaucet ? 'Faucet' : 'Sink'}  @({faucetSink.index.x},{faucetSink.index.y})</p>

                {
                    isFaucet ? <Unit
                        atomOpacity={1.0}
                        state={{
                            bg_status: AtomTypeToBg[(faucetSink as AtomFaucetState).typ],
                            border_status: null,
                            unit_text: UnitText.EMPTY,
                            unit_id: null,
                        }}
                        handleMouseOut={() => {}}
                        handleMouseOver={() => {}}
                        mechHighlight={false}
                        isSmall={true}
                    /> : <div style={{width:'5px'}}/>
                }

            </div>
        </div>
    );
}
