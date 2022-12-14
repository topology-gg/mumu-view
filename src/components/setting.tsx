import { CSSProperties, useState } from "react";
import Modal from "./Modal";
import { Trans, useTranslation } from "react-i18next";
import Menu from "./menu";
import Manual from "./Manual";
import ConnectWallet from "./ConnectWallet";
import LanguageSelector from "./LanguageSelector";
import Leaderboard from "./Leaderboard";

import { Box, SxProps } from "@mui/material";

export default function Setting({ loadSolution, renderMode, handleSetRenderMode, open, handleSetOpen }) {

    const { t } = useTranslation();

    // store current language as state
    // note: setting modal openness and modal rendering mode are parent's states and current language as states
    const [currLang, setCurrLang] = useState<string>('en')

    // handle state changes upon request
    const handleOpen = () => {
        handleSetRenderMode('menu'); // always open setting modal from menu mode
        handleSetOpen(true);
    };
    const handleClose = () => {handleSetOpen(false);};
    const handleBack = () => { handleSetRenderMode('menu'); };
    const handleModeChange = (mode: string) => { handleSetRenderMode(mode); };

    // alias menu component
    const MenuHooked = (
        <Menu
            onManualClick={() => handleModeChange('manual')}
            onLanguageClick={() => handleModeChange('language')}
            onConnectWalletClick={() => handleModeChange('connect')}
            onLeaderboardClick={() => handleModeChange('leaderboard')}
        />
    )

    // compute props
    const modalWidth =
        renderMode == 'menu' ? 300 :
        renderMode == 'language' ? 300 :
        renderMode == 'connect' ? 450 :
        renderMode == 'manual' ? 600 : 1100

    // render
    return (
        <div>

            <button onClick={handleOpen} className={'big-button'}>
                <i className="material-icons" style={{ fontSize: "1rem" }}>
                    settings
                </i>
            </button>

            <Modal
                isRoot={renderMode == 'menu'} open={open} width={modalWidth}
                onClose={handleClose} onBack={handleBack} maxWidth={false}
            >
                <Box sx={{
                    pt: 5, pb: 5, pl: 0, pr: 0, fontFamily: "var(--font-family-secondary)",
                }}>
                    {
                        (renderMode == 'menu') ? (
                            MenuHooked
                        ) :
                        (renderMode == 'manual') ? (
                            <Manual />
                        ) :
                        (renderMode == 'connect') ? (
                            <ConnectWallet />
                        ) :
                        (renderMode == 'language') ? (
                            <LanguageSelector
                                currLang={currLang}
                                setCurrLang={(lang) => setCurrLang(_ => lang)}
                            />
                        ) :
                        (renderMode == 'leaderboard') ? (
                            <Leaderboard loadSolution={loadSolution} />
                        ) : MenuHooked
                    }

                </Box>
            </Modal>

        </div>
    );
}
