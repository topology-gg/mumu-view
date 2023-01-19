import { useState } from "react";
import { OperatorState } from "../types/Operator";

export default function DAWFaucetSinkPanel ({
    sfLoaded,
    animationState,
}) {

    // render
    return (
        <div style={{paddingBottom:'0.5rem'}}>

            {
                sfLoaded ? (
                    <>
                        <p style={{fontSize:'1rem'}}>Faucet & Sink configurations</p>
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                            ...
                        </div>
                    </>
                ) : <p style={{fontSize:'1rem'}}>Loading festive soundfonts ...</p>
            }


        </div>
    );
}
