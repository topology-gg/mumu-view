import i18next from "i18next";
import React, {useState} from "react";

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';

import { Lesson_names, Lesson_descriptions } from "../../constants/constants";
import { Paper } from "@mui/material";

const Tutorial = ({ loadMode }) => {

    const [currLesson, setCurrLesson] = useState<string | null>(null);
    const [currHoveredLesson, setCurrHoveredLesson] = useState<string | null>(null);

    const lesson_descriptions = Lesson_descriptions[currHoveredLesson !== null ? currHoveredLesson : currLesson]

    return (
        <div style={{
            display: 'flex', flexDirection: 'row', width: '100%', paddingTop:'10px', paddingBottom:'20px'
        }}>

            <MenuList sx={{width:'350px'}}>

                {
                    Object.entries(Lesson_names).map( (entry, _) => {
                        const lesson = entry[0]
                        const lesson_name = entry[1]
                        return (
                            <MenuItem
                                onClick={() => {
                                    setCurrLesson(_ => lesson)
                                    loadMode(lesson)
                                }}
                                onMouseEnter={() => setCurrHoveredLesson(_ => lesson)}
                                onMouseLeave={() => setCurrHoveredLesson(_ => null)}
                                sx={{justifyContent: 'left', pl:10}}
                                selected={currLesson == lesson}
                                disabled={(lesson=='lesson_1' || lesson=='lesson_2') ? false : true} // disable the lessons that are not implemented yet
                            >
                                { lesson_name }
                            </MenuItem>
                        )
                    })
                }

            </MenuList>

            <Paper sx={{ml:1, mt:'8px', mb:'8px', p:2, width:'320px'}}>
                {lesson_descriptions ? lesson_descriptions.map(
                    description => (
                        <p style={{fontSize:'0.8rem', marginTop:'0'}}>{description}</p>
                    )
                ) : null}
            </Paper>

        </div>
    );
};

export default Tutorial;
