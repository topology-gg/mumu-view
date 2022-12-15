import i18next from "i18next";
import React, {useState} from "react";

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';

import { Lesson_names } from "../../constants/constants";

const Tutorial = ({ loadMode }) => {

    const [currLesson, setCurrLesson] = useState<string | null>(null)


    return (
        <div style={{
            display: 'flex', flexDirection: 'column', width: '100%', paddingTop:'10px', paddingBottom:'10px'
        }}>

            <MenuList>

                {
                    Object.entries(Lesson_names).map( (entry, _) => {
                        const lesson = entry[0]
                        const lesson_name = entry[1]
                        return (
                            <MenuItem
                                onClick={() => loadMode(lesson)}
                                sx={{justifyContent: 'left', pl:10}}
                                selected={currLesson == lesson}
                            >
                                { lesson_name }
                            </MenuItem>
                        )
                    })
                }

            </MenuList>

        </div>
    );
};

export default Tutorial;
