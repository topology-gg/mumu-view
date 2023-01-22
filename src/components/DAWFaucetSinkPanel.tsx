import { useState } from "react";
import { OperatorState } from "../types/Operator";
import AtomFaucetState from "../types/AtomFaucetState";
import { Constraints } from "../constants/constants";
import DAWFaucetRow from "./DAWFaucetRow";

interface DAWFaucetSinkPanelProps {
    sfLoaded: boolean;
    faucets?: AtomFaucetState[];
    animationState: string;
}

export default function DAWFaucetSinkPanel ({
    sfLoaded,
    faucets = Constraints.daw.FAUCETS,
    animationState,
} : DAWFaucetSinkPanelProps) {

    // render
    return (
        <div style={{paddingBottom:'0.5rem'}}>

            {
                sfLoaded ? (
                    <div>
                        <p style={{fontSize:'1rem'}}>Faucet & Sink configurations</p>
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center', marginBottom:'0.5rem'}}>
                            {
                                faucets.map(f => (
                                    <DAWFaucetRow faucet={f} animationState={animationState}/>
                                ))
                            }
                        </div>
                        <div style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                            <button
                                onClick={() => {}}
                                style={{}}
                                disabled={animationState == 'Run'}
                            >+ Faucet</button>
                            <button
                                onClick={() => {}}
                                style={{}}
                                disabled={animationState == 'Run'}
                            >+ Sink</button>
                        </div>
                    </div>
                ) : <p style={{fontSize:'1rem'}}>Loading festive soundfonts ...</p>
            }

        </div>
    );
}
