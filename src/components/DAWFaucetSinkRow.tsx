import { useState } from "react";
import { OperatorState } from "../types/Operator";
import AtomFaucetState from "../types/AtomFaucetState";
import AtomSinkState from "../types/AtomSinkState";
import { Constraints } from "../constants/constants";
import { AtomTypeToBg } from "../types/UnitState";
import { UnitText } from "../types/UnitState";
import Unit from "./unit";
import { Delete } from "@mui/icons-material";
import { AtomTypeSelect } from "./AtomTypeSelect";
import { AtomType } from "../types/AtomState";

interface DAWFaucetSinkRowProps {
    placing: boolean;
    complete?: boolean;
    isFaucet: boolean;
    faucetSink: AtomFaucetState | AtomSinkState;
    animationState: string;
    handleOnDelete?: () => void;
    handleOnMouseEnter: () => void;
    handleOnMouseLeave: () => void;
    handleAtomTypeChange?: (atomType: AtomType) => void;
    handleConfirm?: () => void;
    handleCancel?: () => void;
    handleRequestToEdit?: () => void;
}

export default function DAWFaucetSinkRow ({
    placing,
    complete,
    isFaucet,
    faucetSink,
    animationState,
    handleOnDelete,
    handleOnMouseEnter,
    handleOnMouseLeave,
    handleAtomTypeChange,
    handleConfirm,
    handleCancel,
    handleRequestToEdit,
} : DAWFaucetSinkRowProps) {

    const disabled = animationState != 'Stop';
    const voidFunc = () => {};

    // render
    return (
        <div style={{
            marginBottom:'0.3rem',
            display:'flex', flexDirection:'row', alignItems:'center',
            justifyContent:'left',
            width: '18rem'
        }}>
            <div
                style={{
                    display:'flex', flexDirection:'row', alignItems:'center', borderRadius:'10px', padding:'0 5px 0 5px'
                }}
                className='daw-faucet-row-div'
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
            >
                {
                    placing ? (
                        <p style={{marginRight:'0.5rem'}}>+</p>
                    ) : (
                        <Delete
                            fontSize="small"
                            sx={{mr:1, color:'#AAAAAA', "&:hover": { color:disabled?"#AAAAAA":"#555555", cursor:disabled?'default':'pointer' }}}
                            onClick={!disabled ? handleOnDelete : voidFunc}
                        />
                    )
                }

                <div style={{display:'flex',flexDirection:'row'}}>
                    <p style={{width:'3rem', textAlign:'left'}}>
                        {isFaucet ? 'Faucet' : 'Sink'}
                    </p>
                    <div
                        className={`${disabled ? 'disabled-editable-placement' : placing && !complete ? 'p_glow' : 'editable-placement'}`}
                        style={{
                            borderRadius:'10px', padding:'0 10px 0 10px', display:'flex', flexDirection:'row', alignItems:'center',
                            border: '1px solid #555555', margin: '8px auto'
                        }}
                        onClick={()=>{ disabled ? voidFunc() : handleRequestToEdit(); }}
                    >
                        <div style={{width:'1rem', color: disabled ? '#999999' : '#222222'}}>
                            {faucetSink.index ? faucetSink.index.x : '?'}
                        </div>
                        <div>,</div>
                        <div style={{width:'1rem', color: disabled ? '#999999' : '#222222'}}>
                            {faucetSink.index ? faucetSink.index.y : '?'}
                        </div>
                    </div>
                </div>

                {
                    isFaucet ? (
                        <div style={{display:'flex', flexDirection:'row', marginLeft:'0.5rem', alignItems:'center'}}>
                            <Unit
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
                            />
                            <AtomTypeSelect
                                disabled={disabled}
                                currAtomType={(faucetSink as AtomFaucetState).typ}
                                handleAtomTypeChange={handleAtomTypeChange}
                            />
                        </div>
                    ): <div style={{width:'5px'}}/>
                }

                {
                    placing ? <>
                        <button
                            onClick={handleConfirm}
                            disabled={!complete}
                            className={complete ? "button_glow" : ""}
                            style={{marginLeft:'0.5rem'}}
                        > ✓ </button>

                        <button onClick={handleCancel}> x </button>
                    </> : <></>
                }

            </div>
        </div>
    );
}
