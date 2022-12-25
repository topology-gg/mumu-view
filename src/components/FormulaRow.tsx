import { Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { MouseEventHandler } from "react";
import Operator from "../types/Operator";
import styles from "../../styles/Home.module.css";
import theme from "../../styles/theme";
import { useTranslation } from "react-i18next";

type FormulaRowProps = {
    disabled: boolean;
    highlighted: boolean;
    onChange: (newOperator: Operator) => void;
    onMouseOver: MouseEventHandler;
    onMouseOut: MouseEventHandler;
    onDelete: () => void;
    operator: Operator;
};

const FormulaRow = ({
    disabled,
    highlighted,
    onChange,
    onMouseOver,
    onMouseOut,
    onDelete,
    operator,
}: FormulaRowProps) => {
    const { t } = useTranslation();

    return (
        <div
            className={styles.input_row}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            style={{
                backgroundColor: highlighted ? theme.palette.primary.main : operator.typ.color + "55",
            }}
        >
            <IconButton size="small" color="secondary" onClick={onDelete}>
                <Delete fontSize="small" />
            </IconButton>

            <p className={styles.input_name}>{t(operator.typ.name)}</p>

            {Array.from({ length: operator.input.length }).map((_, input_i) => (
                <div key={`operator-input-${input_i}`} className={styles.input_grid}>
                    {input_i == 0 ? (
                        <p style={{ textAlign: "right" }} className={styles.input_text}>
                            {operator.typ.symbol}(
                        </p>
                    ) : (
                        <></>
                    )}
                    <input
                        className={styles.program}
                        onChange={(event) => {
                            // if (event.target.value.length == 0) return;
                            // if (isNaN(parseInt(event.target.value))) return;
                            let newOperator = JSON.parse(JSON.stringify(operator));
                            newOperator.input[input_i].x = parseInt(event.target.value);
                            onChange(newOperator);
                        }}
                        defaultValue={operator.input[input_i].x}
                        value={!isNaN(operator.input[input_i].x) ? operator.input[input_i].x : ""}
                        style={{
                            width: "30px",
                            height: "25px",
                            textAlign: "center",
                            border: "1px solid #CCCCCC",
                            borderRadius: "10px 0 0 10px",
                        }}
                        disabled={disabled}
                    ></input>
                    <input
                        className={styles.program}
                        onChange={(event) => {
                            // if (event.target.value.length == 0) return;
                            // if (isNaN(parseInt(event.target.value))) return;
                            let newOperator = JSON.parse(JSON.stringify(operator));
                            newOperator.input[input_i].y = parseInt(event.target.value);
                            onChange(newOperator);
                        }}
                        defaultValue={operator.input[input_i].y}
                        value={!isNaN(operator.input[input_i].y) ? operator.input[input_i].y : ""}
                        style={{
                            width: "30px",
                            height: "25px",
                            textAlign: "center",
                            border: "1px solid #CCCCCC",
                            borderLeft: "0px",
                            borderRadius: "0 10px 10px 0",
                        }}
                        disabled={disabled}
                    ></input>
                    {input_i == operator.input.length - 1 ? (
                        <p className={styles.input_text}>{`)=`}</p>
                    ) : (
                        <p className={styles.input_text}>{", "}</p>
                    )}
                </div>
            ))}

            {Array.from({ length: operator.output.length }).map((_, output_i) => (
                <div key={`input-${output_i}`} className={styles.input_grid}>
                    <input
                        className={styles.program}
                        onChange={(event) => {
                            // if (event.target.value.length == 0) return;
                            let newOperator = JSON.parse(JSON.stringify(operator));
                            newOperator.output[output_i].x = parseInt(event.target.value);
                            onChange(newOperator);
                        }}
                        defaultValue={operator.output[output_i].x}
                        value={!isNaN(operator.output[output_i].x) ? operator.output[output_i].x : ""}
                        style={{
                            width: "30px",
                            height: "25px",
                            textAlign: "center",
                            border: "1px solid #CCCCCC",
                            borderRadius: "10px 0 0 10px",
                        }}
                        disabled={disabled}
                    ></input>
                    <input
                        className={styles.program}
                        onChange={(event) => {
                            // if (event.target.value.length == 0) return;
                            let newOperator = JSON.parse(JSON.stringify(operator));
                            newOperator.output[output_i].y = parseInt(event.target.value);
                            onChange(newOperator);
                        }}
                        defaultValue={operator.output[output_i].y}
                        value={!isNaN(operator.output[output_i].y) ? operator.output[output_i].y : ""}
                        style={{
                            width: "30px",
                            height: "25px",
                            textAlign: "center",
                            border: "1px solid #CCCCCC",
                            borderLeft: "0px",
                            borderRadius: "0 10px 10px 0",
                        }}
                        disabled={disabled}
                    ></input>
                    {output_i != operator.output.length - 1 && <p className={styles.input_text}>{`,`}</p>}
                </div>
            ))}
        </div>
    );
};

export default FormulaRow;
