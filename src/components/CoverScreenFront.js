import React, { Component, useState, useEffect, useRef} from "react";

// refs:
// https://stackoverflow.com/questions/65731647/how-to-fade-out-and-fade-in-in-react
// https://stackoverflow.com/questions/68016644/hiding-div-after-a-few-seconds-reactjs

export default function CoverScreenFront () {

    const [showElement,setShowElement] = React.useState(true)
    useEffect(()=>{
        setTimeout(function() {
            setShowElement(false)
                }, 1 * 1000);
            },
    [])

    return (
        <div
            className={`cover_screen_base cover_screen_front ${showElement ? 'show' : 'hide_fast'}`}
            style={{display:'flex', alignItems:'center', verticalAlign:'middle',}}
        ></div>
      );
}