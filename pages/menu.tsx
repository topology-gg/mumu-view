import * as React from 'react';

import { SxProps } from "@mui/material";

import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';

import WalletIcon from '@mui/icons-material/Wallet';
import LanguageIcon from '@mui/icons-material/Language';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TwitterIcon from '@mui/icons-material/Twitter';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

export default function Menu({ width }) {

    const MenuItemStyled = ({ children, sx = {} }: { children: React.ReactNode; sx?: SxProps }) => {
        return (
            <MenuItem sx={{pl:5}}>
                {children}
            </MenuItem>
        )
    };


    return (
        <Paper sx={{ width: width, maxWidth: '100%' }} elevation={0}>
            <MenuList>

                <MenuItemStyled>
                    <ListItemIcon>
                        <WalletIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Connect Wallet</ListItemText>
                    {/* <Typography variant="body2" color="text.secondary">
                        ⌘X
                    </Typography> */}
                </MenuItemStyled>

                <MenuItemStyled>
                    <ListItemIcon>
                        <LanguageIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Language</ListItemText>
                </MenuItemStyled>

                <MenuItemStyled>
                    <ListItemIcon>
                        <EmojiEventsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Leaderboard</ListItemText>
                </MenuItemStyled>

                <MenuItemStyled>
                    <ListItemIcon>
                        <SchoolIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Tutorial</ListItemText>
                </MenuItemStyled>

                <MenuItemStyled>
                    <ListItemIcon>
                        <LibraryBooksIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Manual</ListItemText>
                </MenuItemStyled>

                <Divider />

                <MenuItemStyled>
                    <ListItemIcon>
                        <TwitterIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Twitter</ListItemText>
                </MenuItemStyled>

                <MenuItemStyled>
                    <ListItemIcon>
                        <SportsEsportsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Discord</ListItemText>
                </MenuItemStyled>

            </MenuList>
        </Paper>
    );
}