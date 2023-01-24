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
    isEditingFaucetIndex: number | null;
    isEditingSinkIndex: number | null;
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
    handleRequestToEdit: (isFaucet: boolean, index: number) => void;
}

export default function DAWFaucetSinkPanel ({
    sfLoaded,
    placing,
    isEditingFaucetIndex,
    isEditingSinkIndex,
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
    handleRequestToEdit,
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
                                        placing={placing && (isEditingFaucetIndex == f_i)}
                                        isFaucet={true} faucetSink={f} animationState={animationState}
                                        handleOnDelete={() => handleRemoveFaucet(f_i)}
                                        handleCancel={() => handleCancelPlacing()}
                                        handleOnMouseEnter={() => handleOnMouseEnterGrid(f.index)}
                                        handleOnMouseLeave={() => handleOnMouseLeaveGrid(f.index)}
                                        handleAtomTypeChange={(atomType: AtomType) => handleFaucetAtomTypeChange(f_i, atomType)}
                                        handleRequestToEdit={() => { handleRequestToEdit(true, f_i) }}
                                    />
                                ))
                            }
                            {
                                sinks.map((s,s_i) => (
                                    <DAWFaucetSinkRow
                                        key={`dawfaucetsinkrow-faucet-${s_i}`}
                                        placing={placing && (isEditingSinkIndex == s_i)}
                                        isFaucet={false} faucetSink={s} animationState={animationState}
                                        handleOnDelete={() => handleRemoveSink(s_i)}
                                        handleCancel={() => handleCancelPlacing()}
                                        handleOnMouseEnter={() => handleOnMouseEnterGrid(s.index)}
                                        handleOnMouseLeave={() => handleOnMouseLeaveGrid(s.index)}
                                        handleRequestToEdit={() => { handleRequestToEdit(false, s_i) }}
                                    />
                                ))
                            }
                            {
                                placing && (isEditingFaucetIndex == null) && (isEditingFaucetIndex == null) ? (
                                    <DAWFaucetSinkRow
                                        key={`dawfaucetsinkrow-placing`}
                                        placing={true}
                                        complete={isPlacingFaucet ? placingFaucet.complete : placingSink.complete}
                                        isFaucet={isPlacingFaucet}
                                        faucetSink={isPlacingFaucet ? placingFaucet : placingSink}
                                        animationState={animationState}
                                        handleAtomTypeChange={(atomType: AtomType) => handleFaucetAtomTypeChange(-1, atomType)}
                                        handleCancel={() => {handleCancelPlacing()}}
                                        handleOnMouseEnter={() => {}}
                                        handleOnMouseLeave={() => {}}
                                        handleConfirm={() => {handleConfirmPlacing()}}
                                        handleRequestToEdit={() => {}}
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
