import React, { Component, useState, useEffect, useRef} from "react";
import { CircularProgress } from "@mui/material";
// refs:
// https://stackoverflow.com/questions/65731647/how-to-fade-out-and-fade-in-in-react
// https://stackoverflow.com/questions/68016644/hiding-div-after-a-few-seconds-reactjs

export default function CoverScreen ({ sfLoaded }) {

    const [showElement,setShowElement] = React.useState(true)

    useEffect(()=>{
        if (!sfLoaded) return; // wait for sound font to load
        if (!showElement) return; // if already hidden => stay hidden

        setTimeout(function() {
            setShowElement(false)
                }, 2 * 1000);

    }, [sfLoaded])

    return (
        <div
            className={`cover_screen_base cover_screen ${showElement ? 'show' : 'hide_slow'}`}
            style={{display:'flex', alignItems:'center', verticalAlign:'middle',}}
        >
            <div style={{display:'flex',flexDirection:'column',justifyContent:'center',margin:'0 auto'}}>
                <p style={{
                    color:'#FFFFFF', fontSize:'36px', margin:'0 auto', fontFamily:'RockSalt',
                    display: 'block', textAlign:'center', verticalAlign:'middle',
                }}>
                    MuMu
                </p>

                <p style={{
                    textAlign:'center', color:'#FFFFFF',
                    fontSize:'16px', padding:'0', marginTop:'0.5rem',
                    display: 'block', textAlign:'center', verticalAlign:'middle',
                }}>
                    An Experiment by Casey Wescott & Topology
                </p>
                <div style={{display: 'flex', justifyContent: 'center', marginTop:'2rem'}}>
                    <CircularProgress />
                    <p style={{color:'#FFFFFF', marginLeft:'1rem'}}>{sfLoaded ? 'Getting ready ...' : 'Loading awesome sound font ...'}</p>
                </div>
            </div>
        </div>
      );
}