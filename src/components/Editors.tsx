import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import Typography from '@mui/material/Typography';
import { BLANK_COLOR } from "../constants/constants";
import LayoutBox from "./LayoutBox";
import Formulas from "./formulas";

export default function Editors ({
    animationState = 'Stop',
    handleFormulaOnclick,
    formulaProgramming,
    mechProgramming,
}) {

    const [displayedIndex, setDisplayedIndex] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setDisplayedIndex ((_) => newValue);
    };

    const editorBoxSx = {
        p:'1rem',backgroundColor:BLANK_COLOR,fontSize:'0.75rem',alignItems:'center',
        border: 1, borderRadius:4, boxShadow:3,
        mt: '1rem',
    }

    const tabStyle = (value, target) => {
        return {
            borderTop: `1px solid ${value==target ? '#555555' : '#CCCCCC'}`,
            borderLeft: `1px solid ${value==target ? '#555555' : '#CCCCCC'}`,
            borderRight: `1px solid ${value==target ? '#555555' : '#CCCCCC'}`,
            borderBottom: 'none',
            backgroundColor: '#FFFFFF00',
            borderRadius: '5px 5px 0 0'
        }
    }

    // render
    return (
        <Box sx={editorBoxSx}>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', alignItems:'left' }}>
                {/* <Tabs value={displayedIndex} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Add Formula" {...a11yProps(0)} />
                    <Tab label="Formulas" {...a11yProps(1)} />
                    <Tab label="Spirits" {...a11yProps(2)} />
                </Tabs> */}

                <button onClick={() => setDisplayedIndex ((_) => 0)} style={tabStyle(displayedIndex, 0)}>Add Formula</button>
                <button onClick={() => setDisplayedIndex ((_) => 1)} style={tabStyle(displayedIndex, 1)}>Formulas</button>
                <button onClick={() => setDisplayedIndex ((_) => 2)} style={tabStyle(displayedIndex, 2)}>Spirits</button>
            </Box>

            <TabPanel displayedIndex={displayedIndex} index={0}>
                <Formulas
                    handleFormulaOnclick={(k) => {
                        setDisplayedIndex((_) => 1);
                        handleFormulaOnclick(k);
                    }}
                    clickDisabled={animationState !== "Stop" ? true : false}
                />
            </TabPanel>

            <TabPanel displayedIndex={displayedIndex} index={1}>
                {formulaProgramming}
            </TabPanel>

            <TabPanel displayedIndex={displayedIndex} index={2}>
                {mechProgramming}
            </TabPanel>

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

