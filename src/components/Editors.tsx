import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import Typography from '@mui/material/Typography';
import { BLANK_COLOR } from "../constants/constants";
import LayoutBox from "./LayoutBox";
import Formulas from "./formulas";

export default function Editors ({
    currMode = 'arena',
    animationState = 'Stop',
    handleFormulaOnclick,
    formulaProgramming,
    mechProgramming,
    dawPanel,
}) {

    const [displayedIndex, setDisplayedIndex] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setDisplayedIndex ((_) => newValue);
    };

    const editorBoxSx = {
        p:'1rem',backgroundColor:BLANK_COLOR,fontSize:'0.75rem',alignItems:'center',
        border: 1, borderRadius:'0px 16px 16px 16px', boxShadow:3,
        maxHeight: 500, overflow: 'auto'
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
                    <button onClick={() => setDisplayedIndex ((_) => 0)} style={tabStyle(displayedIndex, 0)}>+ Formula</button>
                    <button onClick={() => setDisplayedIndex ((_) => 1)} style={tabStyle(displayedIndex, 1)}>Formulas</button>
                    <button onClick={() => setDisplayedIndex ((_) => 2)} style={tabStyle(displayedIndex, 2)}>Spirits</button>
                    {
                        currMode == 'daw' ? (
                            <button onClick={() => setDisplayedIndex ((_) => 3)} style={tabStyle(displayedIndex, 3)}>Music</button>
                        ) : <></>
                    }
            </Box>

            <Box sx={editorBoxSx}>

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

                {
                    currMode == 'daw' ? (
                        <TabPanel displayedIndex={displayedIndex} index={3}>
                            {dawPanel}
                        </TabPanel>
                    ) : <></>
                }
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

