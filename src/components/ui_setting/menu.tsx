import * as React from 'react';

import { SxProps } from "@mui/material";

import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

import WalletIcon from '@mui/icons-material/Wallet';
import LanguageIcon from '@mui/icons-material/Language';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TwitterIcon from '@mui/icons-material/Twitter';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import StadiumIcon from '@mui/icons-material/Stadium';
import MusicVideoIcon from '@mui/icons-material/MusicVideo';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';

export default function Menu({
    width='100%',
    onManualClick,
    onArenaModeClick,
    onLeaderboardClick,
    onDAWModeClick,
    onMusicLibraryClick,
    onDAWHandbookClick,
    onConnectWalletClick,
    onLanguageClick,
    onTutorialClick,
    onVideoTutorialsClick,
}) {

    const MenuItemStyled = ({ children, sx = {}, disabled=false }: { children: React.ReactNode; sx?: SxProps; disabled?: boolean }) => {
        return (
            <MenuItem sx={{pl:5, color:'#222222'}} disabled={disabled}>
                {children}
            </MenuItem>
        )
    };


    return (
        <Paper sx={{ width: width, maxWidth: '100%', backgroundColor:'#ffffff00'}} elevation={0}>
            <MenuList>

                <ListItemText sx={{textAlign:'center', pb:2}}>MuMu: Season 2</ListItemText>

                <Divider />

                <MenuItemStyled>
                    <ListItemIcon>
                        <StadiumIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText onClick={onArenaModeClick}>Arena Mode</ListItemText>
                </MenuItemStyled>

                <MenuItemStyled>
                    <ListItemIcon>
                        <EmojiEventsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText onClick={onLeaderboardClick}>Arena Leaderboard</ListItemText>
                </MenuItemStyled>

                <Divider />

                <MenuItemStyled>
                    <ListItemIcon>
                        <MusicVideoIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText onClick={onDAWModeClick}>Audio Workstation Mode</ListItemText>
                </MenuItemStyled>

                <MenuItemStyled>
                    <ListItemIcon>
                        <LibraryMusicIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText onClick={onMusicLibraryClick}>Music Library</ListItemText>
                </MenuItemStyled>

                <MenuItemStyled>
                    <ListItemIcon>
                        <LibraryBooksIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText onClick={onDAWHandbookClick}>Audio Workstation Handbook</ListItemText>
                </MenuItemStyled>

                <Divider />

                <MenuItemStyled>
                    <ListItemIcon>
                        <WalletIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText onClick={onConnectWalletClick}>Connect Wallet</ListItemText>
                </MenuItemStyled>

                <MenuItemStyled>
                    <ListItemIcon>
                        <LanguageIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText onClick={onLanguageClick}>Language</ListItemText>
                </MenuItemStyled>

                <MenuItemStyled>
                    <ListItemIcon>
                        <LibraryBooksIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText onClick={onManualClick}>Manual</ListItemText>
                </MenuItemStyled>

                <MenuItemStyled>
                    <ListItemIcon>
                        <SchoolIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText onClick={onTutorialClick}>Tutorial Mode</ListItemText>
                </MenuItemStyled>

                <MenuItemStyled>
                    <ListItemIcon>
                        <OndemandVideoIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText onClick={onVideoTutorialsClick}>Video Tutorials</ListItemText>
                </MenuItemStyled>

                <Divider />

                <MenuItemStyled>
                    <a
                        target="_blank" rel="noopener noreferrer"
                        href="https://discord.gg/HcWysQQVRZ"
                        style={{display:'flex',flexDirection:'row'}}
                    >
                        <ListItemIcon>
                            <SportsEsportsIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Discord</ListItemText>
                    </a>
                </MenuItemStyled>

                <MenuItemStyled>
                    <a
                        target="_blank" rel="noopener noreferrer"
                        href="https://twitter.com/topology_gg"
                        style={{display:'flex',flexDirection:'row'}}
                    >
                        <ListItemIcon>
                            <TwitterIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Twitter</ListItemText>
                    </a>
                </MenuItemStyled>

            </MenuList>
        </Paper>
    );
}