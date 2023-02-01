import { useState } from "react";
import SoundFont from '../modules/sf2-player/src';
import { OperatorState } from "../types/Operator";

export default function DAWConfigPanel ({
    handleSetSfFile,
    sfLoaded,
    sfPrograms,
    mech_n,
    mechVelocities,
    musicTitle,
    handleMechNoteVelocityChange,
    handleMechSfProgramChange,
    handleMusicTitleChange,
    animationState,
    operatorStates,
    mechSfProgramIds,
}) {

    const onChangeSf = (event: any) => {
        if (/.sf2$/.exec(event.target.value)) {
            handleSetSfFile (event.target.files[0]);
        }
    }

    const operatorIndices: number[] = operatorStates.map((oS, i: number) => i)
    const firingOperators = operatorStates && operatorStates.length>0 ? operatorIndices.filter(i => operatorStates[i].firing) : []
    // console.log('firingOperators:', firingOperators)

    const disabled = animationState != 'Stop'
    const DIM = '130px'
    // render
    return (
        <div style={{paddingBottom:'0.5rem'}}>

            {/* <div
                className={"notes"}
                style={{ width: DIM, height: DIM, margin: "0 auto 0.5rem auto" }}
            ></div> */}

            {
                sfLoaded ? (
                    <>
                        {/* <p style={{fontSize:'1rem'}}>(Debug) Indices of Firing Formulas</p> */}
                        <div style={{
                            display:'flex', flexDirection:'column',
                            marginBottom:'2.5rem', justifyContent: 'center', alignItems:'center',
                        }}>
                            <p style={{fontSize:'1rem'}}>Name your music</p>

                            <input
                                onChange={(event) => {
                                    handleMusicTitleChange(event.target.value);
                                }}
                                style={{
                                    width: "10rem", marginRight: "8px", height: "26px", textAlign:'center',
                                    border: '1px solid #CCCCCC', borderRadius:'10px', fontSize: '12px'
                                }}
                                placeholder={'jingle bells'}
                                value={musicTitle}
                            ></input>
                        </div>

                        <p style={{fontSize:'1rem'}}>Per-Spirit Configuration</p>
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                            {
                                mech_n != 0 ? Array.from({length:mech_n}).map((_,mech_i) => (
                                    <div
                                        style={{
                                            display:'flex', flexDirection:'row', marginBottom:'0.2rem', height: '1.5rem',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <p style={{padding:'0',margin:'0 1rem 0 0',width:'3rem'}}>Spirit {mech_i}</p>
                                        <input
                                            id="typeinp"
                                            type="range"
                                            min="0"
                                            max="127"
                                            value={mechVelocities[mech_i]}
                                            onChange={evt => {
                                                if (animationState !== 'Run'){
                                                    handleMechNoteVelocityChange(mech_i, evt.target.value)
                                                }
                                            }}
                                            step="1"
                                            style={{ width: "10rem", height: '10px'}}
                                            disabled={animationState == 'Run'}
                                        />
                                        {/* <p style={{padding:'0',margin:'0 0 0 0.2rem',width:'4rem'}}>{mechVelocities[mech_i]} / 127</p> */}

                                        <div className="select">
                                            <select
                                                name="program" id="programs"
                                                onChange={event => handleMechSfProgramChange(mech_i, event.target.value)}
                                                className="sf-program-select"
                                                style={{fontSize:'11px'}}
                                                defaultValue={mechSfProgramIds[mech_i]}
                                                disabled={disabled}
                                            >
                                            {
                                                sfPrograms.map((program: any) => (
                                                    <option
                                                        value={program.id}
                                                        key={program.id}
                                                    >
                                                        {program.name}
                                                    </option>
                                                ))
                                            }
                                            </select>
                                        </div>
                                    </div>
                                )) : <p style={{padding:'0',margin:'0'}}>(No spirit yet)</p>
                            }
                        </div>
                        {
                            mech_n != 0 ? (
                                <button onClick={() => {
                                    Array.from({length:mech_n}).map((_,mech_i) => {
                                        if (animationState !== 'Run'){
                                            handleMechNoteVelocityChange(mech_i, 60)
                                        }
                                    })
                                }}
                                    style={{marginTop:'0.5rem'}}
                                    disabled={animationState == 'Run'}
                                >Reset Volume</button>
                            ) : <></>
                        }
                    </>
                ) : <p style={{fontSize:'1rem'}}>Loading festive soundfonts ...</p>
            }


        </div>
    );
}
