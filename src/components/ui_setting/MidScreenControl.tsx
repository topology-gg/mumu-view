import React from "react";
import styles from "../../../styles/Home.module.css";
import { useTranslation } from "react-i18next";

import { Box } from "@mui/material";

const MidScreenControl = ({
    runnable, animationFrame, n_cycles, animationState,
    handleClick, handleSlideChange
 }) => {

    const { t } = useTranslation();

    const makeshift_button_style = { marginLeft: "0.2rem", marginRight: "0.2rem", height: "1.5rem" };
    const makeshift_run_button_style = runnable
        ? makeshift_button_style
        : { ...makeshift_button_style, color: "#CCCCCC" };

    return (
        <Box sx={{
            display:'flex',flexDirection:'row',justifyContent:'center', alignItems:'center',
            width:'26rem',backgroundColor:'#ffffff', ml:'1.7rem', p:'1rem', mt:'1rem',
            border: 1, borderRadius:4, boxShadow:3,

        }}>
            {/* <div
                className={styles.midScreenControls}
                style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}
            > */}
                <p
                    style={{
                        padding: "0",
                        textAlign: "center",
                        verticalAlign: "middle",
                        width: "6.5rem",
                        margin: "0 0.5rem 0 0",
                        // width: "100px" /* Make room for dynamic text */,
                        height: "20px",
                        lineHeight: "20px",
                        fontSize: "0.75rem",
                    }}
                >
                    {" "}
                    {t("frame")}# {animationFrame} / {n_cycles}
                </p>

                <input
                    id="typeinp"
                    type="range"
                    min="0"
                    max={n_cycles}
                    value={animationFrame}
                    onChange={handleSlideChange}
                    step="1"
                    style={{ width: "6.5rem" }}
                />

                {/* ref: https://stackoverflow.com/questions/22885702/html-for-the-pause-symbol-in-audio-and-video-control */}
                <button
                    style={{ ...makeshift_run_button_style, marginLeft: "0.5rem" }}
                    onClick={() => handleClick("ToggleRun")}
                    className={animationState == 'Pause' ? 'paused' : ''}
                >
                    {" "}
                    {animationState != "Run" ? (
                        <i className="material-icons" style={{ fontSize: "1.2rem" }}>
                            play_arrow
                        </i>
                    ) : (
                        <i className="material-icons" style={{ fontSize: "1.2rem" }}>
                            pause
                        </i>
                    )}{" "}
                </button>
                <button style={makeshift_button_style} onClick={() => handleClick("Stop")}>
                    <i className="material-icons" style={{ fontSize: "1.2rem" }}>
                        stop
                    </i>
                </button>

                <button style={makeshift_button_style} onClick={() => handleClick("PrevFrame")}>
                    <i className="material-icons" style={{ fontSize: "1.2rem" }}>
                        fast_rewind
                    </i>
                </button>
                <button style={makeshift_button_style} onClick={() => handleClick("NextFrame")}>
                    <i className="material-icons" style={{ fontSize: "1.2rem" }}>
                        fast_forward
                    </i>
                </button>

            {/* </div> */}
        </Box>
    )
}

export default MidScreenControl