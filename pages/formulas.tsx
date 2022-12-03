import Unit from "./unit";
import UnitState, {
    BgStatus,
    BorderStatus,
    UnitText,
    AtomTypeToBg,
} from "../src/types/UnitState";
import { CSSProperties, useState } from "react";
import Modal from "../src/components/Modal";
import Button from "@mui/material/Button";
import { Box, Tooltip } from "@mui/material";
import styles from "../styles/Home.module.css";
import { OPERATOR_TYPES } from "../src/types/Operator";
import { Trans, useTranslation } from "react-i18next";
import { INSTRUCTION_ICON_MAP } from "../src/constants/constants";
import { STATIC_COSTS } from "../src/types/Cost";

export default function Formulas() {

    const { t } = useTranslation();
    const [open, setOpen] = useState<boolean>(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    function compute_formula_li_style(backgroundColor: string): CSSProperties {
        return {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: "0.5rem",
            height: "2rem",
            borderRadius: "2rem",
            backgroundColor: backgroundColor,
        };
    }
    const FORMULA_LI_OPACITY_STR = "66";

    var formulaList = []
    Object.entries(OPERATOR_TYPES).forEach(
        ([key, value]) => formulaList.push(
            <li
                style={compute_formula_li_style(value.color + FORMULA_LI_OPACITY_STR)}
            >
                <p className={styles.input_name}>{t(value.name)}:</p>
                {value.symbol}
                (
                {
                    value.input_atom_types.map( val => (
                        <Unit
                            state={{
                                bg_status: AtomTypeToBg[val],
                                border_status: null, unit_text: UnitText.EMPTY, unit_id: null,
                            }}
                            handleMouseOut={() => {}} handleMouseOver={() => {}}
                            mechHighlight={false} isSmall={true}
                        />
                    ))
                }
                )

                <p style={{margin: "0 0.5rem 0 0.5rem"}}> = </p>

                {
                    value.output_atom_types.map( val => (
                        <Unit
                            state={{
                                bg_status: AtomTypeToBg[val],
                                border_status: null, unit_text: UnitText.EMPTY, unit_id: null,
                            }}
                            handleMouseOut={() => {}} handleMouseOver={() => {}}
                            mechHighlight={false} isSmall={true}
                        />
                    ))
                }
            </li>
        )
    );

    return (
        <Box
            flex={1} flexShrink={0} overflow="scroll"
            sx={{
                border: 1, borderRadius:4, ml:6, mr: 0, textAlign:'center', pt:2, pl:5, pr:5, mb:3,
                height: '15rem',
            }}
        >
            {/* <div
                className = {styles.formulas}
                style = {{
                    textAlign: 'center',
                    overflowY: 'scroll',
                }}
            > */}

            <p
                style={{
                    fontSize: "1rem",
                    marginTop: "0",
                    marginBottom: "0",
                }}
            >
                {t("tutorial.formulaList")}
            </p>
            <ol
                style={{
                    // width: "25rem",
                    marginTop: "1rem",
                    marginBottom: "2rem",
                    padding: '0'
                }}
            >
                {formulaList}

            </ol>

            {/* </div> */}
        </Box>
    );
}
