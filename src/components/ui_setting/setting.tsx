import { CSSProperties, useState } from "react";
import Modal from "../ui_common/Modal";
import { Trans, useTranslation } from "react-i18next";
import Menu from "./menu";
import Manual from "./Manual";
import ConnectWallet from "./ConnectWallet";
import LanguageSelector from "./LanguageSelector";
import Leaderboard from "./Leaderboard";
import Tutorial from "./Tutorial";

import { Box, SxProps } from "@mui/material";
import { BLANK_COLOR, Modes } from "../../constants/constants";

export default function Setting({
    loadSolution, loadMode,
    renderMode, handleSetRenderMode, open, handleSetOpen
}) {

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
            onTutorialClick={() => handleModeChange('tutorial')}
            onArenaModeClick={() => loadMode(Modes.arena)}
            onDAWModeClick={() => loadMode(Modes.daw)}
        />
    )

    // compute props
    const modalWidth =
        renderMode == 'menu' ? 350 :
        renderMode == 'language' ? 300 :
        renderMode == 'connect' ? 450 :
        renderMode == 'manual' ? 600 :
        renderMode == 'tutorial' ? 700 :
        1100 // leaderboard width

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
                    pt: 3, pb: 0, pl: 0, pr: 0, fontFamily: "var(--font-family-secondary)",
                    backgroundColor: BLANK_COLOR
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
                        ) :
                        (renderMode == 'tutorial') ? (
                            <Tutorial loadMode={loadMode} />
                        ) :
                        MenuHooked
                    }

                </Box>
            </Modal>

        </div>
    );
}
