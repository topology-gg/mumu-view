import { useState } from "react";
import SoundFont from '../modules/sf2-player/src';

export default function DAWPanel ({ sf, handleSetSfFile, mech_n, mechVelocities, handleMechNoteVelocityChange, animationState }) {

    const onChangeSf = (event: any) => {
        if (/.sf2$/.exec(event.target.value)) {
            handleSetSfFile (event.target.files[0]);
        }
    }

    const DIM = '150px'

    // render
    return (
        <div style={{}}>

            <div
                className={"notes"}
                style={{ width: DIM, height: DIM, margin: "0 auto 0.5rem auto" }}
            ></div>

            <fieldset style={{border:'1px groove #77777755'}}>
                <legend>Open SF2 file</legend>
                <input
                    className='button' type="file"
                    style={{border:'none', marginTop:'5px', backgroundColor:'#ffffff00'}}
                    onChange={(e) => onChangeSf(e)}
                />
            </fieldset>

            <p style={{fontSize:'1rem'}}>Volume Control</p>
            <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                {
                    mech_n != 0? Array.from({length:mech_n}).map((_,mech_i) => (
                        <div style={{display:'flex', flexDirection:'row', marginBottom:'0.5rem'}}>
                            <p style={{padding:'0',margin:'0 1rem 0 0'}}>Spirit {mech_i}</p>
                            <input
                                id="typeinp"
                                type="range"
                                min="0"
                                max="127"
                                value={mechVelocities[mech_i]}
                                onChange={evt => {
                                    if (animationState !== 'Run'){
                                        handleMechNoteVelocityChange(mech_i, evt)
                                    }
                                }}
                                step="1"
                                style={{ width: "10rem",}}
                                disabled={animationState == 'Run'}
                            />
                        </div>
                    )) : <></>
                }
            </div>


        </div>
    );
}
