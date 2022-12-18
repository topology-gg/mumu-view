import i18next from "i18next";
import React, {useState} from "react";

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';

const LanguageSelector = ({ currLang, setCurrLang }) => {

    // const [currLang, setCurrLang] = useState<string>('en')
    const languages = ['en', 'scn', 'tcn', 'fr', 'jp']
    const currLangToName = {
        'en': 'English',
        'scn' : '简中',
        'tcn' : '繁中',
        'fr'  : 'Français',
        'jp'  : '日本語'
    }

    const handleLangSelected = (lang) => {
        i18next.changeLanguage(lang);
        setCurrLang (lang);
    }

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', width: '100%'
        }}>

            <MenuList>

                {
                    languages.map( lang => (
                        <MenuItem
                            onClick={() => handleLangSelected(lang)}
                            sx={{justifyContent: 'center'}}
                            selected={currLang == lang}
                        >
                            { currLangToName[lang] }
                        </MenuItem>
                    ))
                }

            </MenuList>

        </div>
    );
};

export default LanguageSelector;
