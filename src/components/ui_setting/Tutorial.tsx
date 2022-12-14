import i18next from "i18next";
import React, {useState} from "react";

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';

const Tutorial = ({ }) => {

    const [currLesson, setCurrLesson] = useState<string | null>(null)
    const lessons = [
        'Lesson 1 / delivery boy',
        'Lesson 2 / first alchemy',
        'Lesson 3 / second alchemy',
        'Lesson 4 / production line'
    ]

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', width: '100%', paddingTop:'10px', paddingBottom:'10px'
        }}>

            <MenuList>

                {
                    lessons.map( (lesson,_) => (
                        <MenuItem
                            onClick={() => {}}
                            sx={{justifyContent: 'left', pl:10}}
                            selected={currLesson == lesson}
                        >
                            { lesson }
                        </MenuItem>
                    ))
                }

            </MenuList>

        </div>
    );
};

export default Tutorial;
