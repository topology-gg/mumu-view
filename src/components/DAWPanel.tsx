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

    // render
    return (
        <div style={{}}>

            <fieldset style={{border:'1px groove #77777755'}}>
                <legend>Open SF2 file</legend>
                <input
                    className='button' type="file"
                    style={{border:'none', marginTop:'5px'}}
                    onChange={(e) => onChangeSf(e)}
                />
            </fieldset>

        </div>
    );
}
