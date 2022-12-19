import { useState } from "react";
import { Box } from "@mui/material";
import { OPERATOR_TYPES } from "../types/Operator";
import { useTranslation } from "react-i18next";
import FormulaBlueprint from "./FormulaBlueprint";

export default function Formulas({ handleFormulaOnclick, clickDisabled }) {
    const { t } = useTranslation();

    var formulaList = [];
    Object.entries(OPERATOR_TYPES).forEach(([key, value]) =>
        formulaList.push(
            <FormulaBlueprint
                operatorType={value}
                clickable={!clickDisabled}
                onclick={() => handleFormulaOnclick(key)}
            />
        )
    );

    return (
        <Box
            sx={{
                textAlign: "center",
                pt: 2,
                pl: 5,
                pr: 5,
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
                    padding: "0",
                }}
            >
                {formulaList}
            </ol>

            {/* </div> */}
        </Box>
    );
}
