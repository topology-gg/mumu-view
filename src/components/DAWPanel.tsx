import { useState } from "react";
import SoundFont from '../modules/sf2-player/src';

export default function DAWPanel ({ sf, handleSetSfFile }) {

    const onChangeSf = (event: any) => {
        console.log('value:',event.target.value)
        if (/.sf2$/.exec(event.target.value)) {

            handleSetSfFile (event.target.files[0]);
            console.log('wow')

            // await sf.loadSoundFontFromFile(event.target.files[0]);
            // setBanks(sf.banks);
            // sf.bank = sf.banks[0]['id'];
            // setPrograms(sf.programs);
            // sf.program = sf.programs[0]['id'];
        }
    }

    const CHRISTMAS_TREE_DIM = '150px'

    // render
    return (
        <div style={{}}>

            <div
                className={"christmas"}
                style={{ width: CHRISTMAS_TREE_DIM, height: CHRISTMAS_TREE_DIM, margin: "0 auto 0.5rem auto" }}
            ></div>

            <fieldset style={{border:'1px groove #77777755'}}>
                <legend>Open SF2 file</legend>
                <input
                    className='button' type="file"
                    style={{border:'none', marginTop:'5px', backgroundColor:'#ffffff00'}}
                    onChange={(e) => onChangeSf(e)}
                />
            </fieldset>

        </div>
    );
}
