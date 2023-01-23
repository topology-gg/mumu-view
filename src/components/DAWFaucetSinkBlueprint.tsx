import React, { CSSProperties } from "react";
import Unit from "./unit";
import { OperatorType } from "../types/Operator";
import { AtomTypeToBg, UnitText } from "../types/UnitState";
import styles from "../../styles/Home.module.css";
import { useTranslation } from "react-i18next";
import Grid from "../types/Grid";
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { AtomType } from "../types/AtomState";

const FORMULA_LI_OPACITY_STR = "66";

function compute_formula_li_style(backgroundColor: string): CSSProperties {
    return {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginTop: "0.5rem",
        height: "2rem",
        borderRadius: "2rem",
        backgroundColor: backgroundColor + FORMULA_LI_OPACITY_STR,
    };
}

interface DAWFaucetSinkBlueprintProps {
    isFaucet: boolean;
    placing?: boolean;
    grid?: Grid;
    typ?: AtomType;
    clickable?: boolean;
    onclick?: () => void;
}

const DAWFaucetSinkBlueprint = ({
    isFaucet,
    placing,
    grid = null,
    typ = null,
    clickable = false,
    onclick
}: DAWFaucetSinkBlueprintProps) => {

    const { t } = useTranslation();


};

export default DAWFaucetSinkBlueprint;
