import i18next from "i18next";
import React, {useState} from "react";

import VideoEmbed from "./VideoEmbed";

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import { Divider, List, ListItem, ListItemText, Paper } from "@mui/material";


const VideoTutorials = ({ }) => {

    const titles = [
        'Introduction to MuMu - Part 1: Spirit Programming',
        'Introduction to MuMu - Part 2: Formulas Placement',
        'Introduction to MuMu - Part 3: First Complete Solution',
    ]
    const embedIds = [
        'XFmgFOPUjbo',
        'xnZupswvpCo',
        'JtwYciqjcI0',
    ]

    const videoWidth = 966
    const videoHeight = 543

    return (
        <div style={{
            display: 'flex', flexDirection: 'row', width: '100%', paddingTop:'10px', paddingBottom:'20px'
        }}>

            <List sx={{pl:'15px'}}>
                <ListItem sx={{alignItems:'left', flexDirection:'column'}}>
                    <ListItemText sx={{mb:1}}>{titles[0]}</ListItemText>
                    <VideoEmbed embedId={embedIds[0]} width={videoWidth} height={videoHeight} title={titles[0]} />
                </ListItem>

                <Divider sx={{mt:2, mb:2}} />

                <ListItem sx={{alignItems:'left', flexDirection:'column'}}>
                    <ListItemText sx={{mb:1}}>{titles[1]}</ListItemText>
                    <VideoEmbed embedId={embedIds[1]} width={videoWidth} height={videoHeight} title={titles[1]} />
                </ListItem>

                <Divider sx={{mt:2, mb:2}} />

                <ListItem sx={{alignItems:'left', flexDirection:'column'}}>
                    <ListItemText sx={{mb:1}}>{titles[2]}</ListItemText>
                    <VideoEmbed embedId={embedIds[2]} width={videoWidth} height={videoHeight} title={titles[2]} />
                </ListItem>
            </List>

        </div>
    );
};

export default VideoTutorials;
