import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import Typography from '@mui/material/Typography';
import { BLANK_COLOR } from "../constants/constants";
import LayoutBox from "./LayoutBox";
import Formulas from "./formulas";

export default function Statistics ({
    liveStats,
    summaryStats
}) {

    const [displayedIndex, setDisplayedIndex] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setDisplayedIndex ((_) => newValue);
    };

    const statsBoxSx = {
        p:'0',backgroundColor:BLANK_COLOR,fontSize:'0.75rem',alignItems:'center',
        border: 1, borderRadius:'0px 16px 16px 16px', boxShadow:3,
        height: '180px', maxHeight: '180px', overflow: 'auto'
    }

    const tabStyle = (value, target) => {
        return {
            borderBottom: 'none',
            backgroundColor: BLANK_COLOR + ( (value == target) ? 'FF' : '77' ),
            color: (value == target) ? '#333333' : '#DDDDDD',
            borderRadius: '5px 5px 0 0',
            padding: '0 9px 0 9px',
        }
    }

    // render
    return (
        <Box>

            <Box sx={{ borderColor: 'divider', display:'flex', justifyContent:"flex-start" }}>
                    <button onClick={() => setDisplayedIndex ((_) => 0)} style={tabStyle(displayedIndex, 0)}>Live Stats</button>
                    <button onClick={() => setDisplayedIndex ((_) => 1)} style={tabStyle(displayedIndex, 1)}>Summary</button>
            </Box>

            <Box sx={statsBoxSx}>

                <TabPanel displayedIndex={displayedIndex} index={0}>
                    {liveStats}
                </TabPanel>

                <TabPanel displayedIndex={displayedIndex} index={1}>
                    {summaryStats}
                </TabPanel>

            </Box>
        </Box>
    );
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    displayedIndex: number;
  }

function TabPanel(props: TabPanelProps) {
    const { children, displayedIndex, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={displayedIndex !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {displayedIndex === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
}

function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}

