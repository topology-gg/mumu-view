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

        {/* <button style={buttonStyle('en')} onClick={() => {
                i18next.changeLanguage("en");
                setCurrLang ('en');
            }}>English</button>

            <button style={buttonStyle('scn')} onClick={() => {
                i18next.changeLanguage("scn");
                setCurrLang ('scn');
            }}>简中</button>

            <button style={buttonStyle('tcn')} onClick={() => {
                i18next.changeLanguage("tcn");
                setCurrLang ('tcn');
            }}>繁中</button>

            <button style={buttonStyle('fr')} onClick={() => {
                i18next.changeLanguage("fr");
                setCurrLang ('fr');
            }}>Français</button>

            <button style={buttonStyle('jp')} onClick={() => {
                i18next.changeLanguage("jp");
                setCurrLang ('jp');
            }}>日本語</button> */}

// function buttonStyle (lang) {
//     // impurity by dependency: currLang

//     let button_style = {
//         height:'1.5rem',
//         border: '1px solid #333333',
//         borderRadius: '3px',
//         marginBottom: '2px',
//     }

//     if (lang == currLang) {
//         return {...button_style, backgroundColor:'#FFFE71'}
//     }
//     else {
//         return button_style
//     }
// }

export default LanguageSelector;
