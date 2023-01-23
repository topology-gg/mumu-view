import { useState } from "react";
import { OperatorState } from "../types/Operator";
import AtomFaucetState from "../types/AtomFaucetState";
import AtomSinkState from "../types/AtomSinkState";
import { Constraints } from "../constants/constants";
import DAWFaucetRow from "./DAWFaucetRow";
import DAWSinkRow from "./DAWSinkRow";
import { AtomType } from "../types/AtomState";
import Grid from "../types/Grid";

interface DAWFaucetSinkPanelProps {
    sfLoaded: boolean;
    faucets?: AtomFaucetState[];
    sinks?: AtomSinkState[];
    animationState: string;
    handleAddFaucet: (index: Grid, atomType: AtomType) => void;
    handleRemoveFaucet: (i: number) => void;
    handleAddSink: (index: Grid, ) => void;
    handleRemoveSink: (i: number) => void;
}

export default function DAWFaucetSinkPanel ({
    sfLoaded,
    faucets = Constraints.daw.FAUCETS,
    sinks = Constraints.daw.SINKS,
    animationState,
    handleAddFaucet,
    handleRemoveFaucet,
    handleAddSink,
    handleRemoveSink,
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
                                faucets.map((f,f_i) => (
                                    <DAWFaucetRow
                                        faucet={f} animationState={animationState}
                                        handleOnDelete={() => handleRemoveFaucet(f_i)}
                                    />
                                ))
                            }
                            {
                                sinks.map((s,s_i) => (
                                    <DAWSinkRow
                                        sink={s} animationState={animationState}
                                        handleOnDelete={() => handleRemoveSink(s_i)}
                                    />
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
