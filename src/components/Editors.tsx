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

    // render
    return (
        <Box sx={editorBoxSx}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={displayedIndex} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Add Formula" {...a11yProps(0)} />
                <Tab label="Formulas" {...a11yProps(1)} />
                <Tab label="Spirits" {...a11yProps(2)} />
                </Tabs>
            </Box>

            <TabPanel displayedIndex={displayedIndex} index={0}>
                {/* <LayoutBox
                    scrollable={true}
                    sx={{ bgcolor: animationState !== "Stop" ? "grey.500" : BLANK_COLOR }}
                > */}
                    <Formulas
                        handleFormulaOnclick={(k) => {
                            setDisplayedIndex((_) => 1);
                            handleFormulaOnclick(k);
                        }}
                        clickDisabled={animationState !== "Stop" ? true : false}
                    />
                {/* </LayoutBox> */}
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

