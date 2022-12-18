import { CSSProperties, useState } from "react";
import Modal from "./ui_common/Modal";
import { Trans, useTranslation } from "react-i18next";
import { Lesson_instruction } from "../constants/constants";
import { Box, SxProps } from "@mui/material";

export default function LessonInstruction({lesson}) {

    const { t } = useTranslation();

    // react state for open
    const [open, setOpen] = useState<boolean>(false);

    // handle state changes upon request
    const handleOpen = () => {setOpen(_ => true)};
    const handleClose = () => {setOpen(_ => false)};

    // get instruction for lesson
    const instruction = Lesson_instruction[lesson]

    // render
    return (
        <div style={{textAlign:'left'}}>

            <button onClick={handleOpen}>
                Details
            </button>

            <Modal
                isRoot={true} open={open} width={500}
                onClose={handleClose} maxWidth={false}
            >
                <Box sx={{
                    p:4, pt:5, fontFamily: "var(--font-family-secondary)"
                }}>
                    {
                        instruction.map((s,i) => (
                            <p style={{
                                fontSize:'0.9rem',marginTop:'0',
                                marginBottom: i==instruction.length-1 ? '0' : '1.5rem'
                            }}>{s}</p>
                        ))
                    }

                </Box>
            </Modal>

        </div>
    );
}
