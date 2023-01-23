import { useState } from "react";
import { OperatorState } from "../types/Operator";
import AtomFaucetState, { PlacingAtomFaucet } from "../types/AtomFaucetState";
import AtomSinkState, { PlacingAtomSink } from "../types/AtomSinkState";
import { Constraints } from "../constants/constants";
import DAWFaucetSinkRow from "./DAWFaucetSinkRow";
import { AtomType } from "../types/AtomState";
import Grid from "../types/Grid";

interface DAWFaucetSinkPanelProps {
    sfLoaded: boolean;
    placing: boolean;
    isPlacingFaucet: boolean;
    placingFaucet: PlacingAtomFaucet;
    placingSink: PlacingAtomSink;
    faucets: AtomFaucetState[];
    sinks: AtomSinkState[];
    animationState: string;
    handleAddFaucet: () => void;
    handleRemoveFaucet: (i: number) => void;
    handleAddSink: () => void;
    handleRemoveSink: (i: number) => void;
    handleOnMouseEnterGrid: (index: Grid) => void;
    handleOnMouseLeaveGrid: (index: Grid) => void;
    handleFaucetAtomTypeChange: (i: number, atomType: AtomType) => void;
    handleCancelPlacing: () => void;
    handleConfirmPlacing: () => void;
}

export default function DAWFaucetSinkPanel ({
    sfLoaded,
    placing,
    isPlacingFaucet,
    placingFaucet,
    placingSink,
    faucets,
    sinks,
    animationState,
    handleAddFaucet,
    handleRemoveFaucet,
    handleAddSink,
    handleRemoveSink,
    handleOnMouseEnterGrid,
    handleOnMouseLeaveGrid,
    handleFaucetAtomTypeChange,
    handleCancelPlacing,
    handleConfirmPlacing,
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
                                    <DAWFaucetSinkRow
                                        key={`dawfaucetsinkrow-faucet-${f_i}`}
                                        placing={false}
                                        isFaucet={true} faucetSink={f} animationState={animationState}
                                        handleOnDelete={() => handleRemoveFaucet(f_i)}
                                        handleOnMouseEnter={() => handleOnMouseEnterGrid(f.index)}
                                        handleOnMouseLeave={() => handleOnMouseLeaveGrid(f.index)}
                                        handleAtomTypeChange={(atomType: AtomType) => handleFaucetAtomTypeChange(f_i, atomType)}
                                    />
                                ))
                            }
                            {
                                sinks.map((s,s_i) => (
                                    <DAWFaucetSinkRow
                                        key={`dawfaucetsinkrow-faucet-${s_i}`}
                                        placing={false}
                                        isFaucet={false} faucetSink={s} animationState={animationState}
                                        handleOnDelete={() => handleRemoveSink(s_i)}
                                        handleOnMouseEnter={() => handleOnMouseEnterGrid(s.index)}
                                        handleOnMouseLeave={() => handleOnMouseLeaveGrid(s.index)}
                                    />
                                ))
                            }
                            {
                                placing ? (
                                    <DAWFaucetSinkRow
                                        key={`dawfaucetsinkrow-placing`}
                                        placing={true}
                                        complete={isPlacingFaucet ? placingFaucet.complete : placingSink.complete}
                                        isFaucet={isPlacingFaucet}
                                        faucetSink={isPlacingFaucet ? placingFaucet : placingSink}
                                        animationState={animationState}
                                        handleAtomTypeChange={(atomType: AtomType) => handleFaucetAtomTypeChange(-1, atomType)}
                                        handleOnDelete={() => {handleCancelPlacing()}}
                                        handleOnMouseEnter={() => {}}
                                        handleOnMouseLeave={() => {}}
                                        handleConfirm={() => {handleConfirmPlacing()}}
                                    />
                                ) : <></>
                            }
                        </div>
                        <div style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                            <button
                                onClick={handleAddFaucet}
                                style={{}}
                                disabled={animationState == 'Run'}
                            >+ Faucet</button>
                            <button
                                onClick={handleAddSink}
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
