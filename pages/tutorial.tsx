import Unit from "./unit";
import UnitState, {
    BgStatus,
    BorderStatus,
    UnitText,
} from "../src/types/UnitState";
import { CSSProperties, useState } from "react";
import Modal from "../src/components/Modal";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import styles from "../styles/Home.module.css";
import { OPERATOR_TYPES } from "../src/types/Operator";
import { Trans, useTranslation } from "react-i18next";
import { INSTRUCTION_ICON_MAP } from "../src/constants/constants";

export default function Tutorial() {
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
    const CONTENT_LI_STYLE: CSSProperties = {
        marginTop: "0.5rem",
        alignItems:'center',
    };

    const { t } = useTranslation();

    const [open, setOpen] = useState<boolean>(false);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    // OPERATOR_TYPES.STIR.symbol

    return (
        <div
            style={{
                marginBottom: "2rem",
            }}
        >
            <Button color="secondary" variant="outlined" onClick={handleOpen}>
                {t("tutorial.title")}
            </Button>
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ p: 2, fontFamily: "var(--font-family-secondary)" }}>
                    <div style={{paddingLeft:'1rem', paddingTop:'1rem'}}>

                    <p
                        style={{
                            fontSize: "0.9rem",
                            marginTop: "0",
                            marginBottom: "0",
                        }}
                    >
                        {t("tutorial.Overview")}
                    </p>
                    <ol
                        style={{
                            width: "30rem",
                            marginTop: "1.5rem",
                            marginBottom: "2rem",
                            marginRight:'1rem',
                        }}
                    >
                        <li style={compute_formula_li_style("#FFFFFFFF")}>
                            {t("tutorial.overviewLine1")}
                        </li>
                    </ol>

                    <p
                        style={{
                            fontSize: "0.9rem",
                            marginTop: "0",
                            marginBottom: "0",
                        }}
                    >
                        {t("tutorial.goal")}
                    </p>
                    <ol
                        style={{
                            width: "30rem",
                            marginTop: "0.3rem",
                            marginBottom: "2rem",
                        }}
                    >
                        <li style={compute_formula_li_style("#FFFFFFFF")}>
                            <Trans t={t} i18nKey="tutorial.goalAffordance">
                                With Faucet replenishing
                                <Unit
                                    state={{
                                        bg_status: BgStatus.ATOM_VANILLA_FREE,
                                        border_status: null,
                                        unit_text: UnitText.EMPTY,
                                        unit_id: null,
                                    }}
                                    handleMouseOut={() => {}}
                                    handleMouseOver={() => {}}
                                    mechHighlight={false}
                                    isSmall={true}
                                />
                                at 1 unit per frame,
                            </Trans>
                        </li>
                        <li style={compute_formula_li_style("#FFFFFFFF")}>
                            <Trans t={t} i18nKey="tutorial.goalDeliver">
                                Produce and deliver
                                <Unit
                                    state={{
                                        bg_status: BgStatus.ATOM_SAFFRON_FREE,
                                        border_status: null,
                                        unit_text: UnitText.EMPTY,
                                        unit_id: null,
                                    }}
                                    handleMouseOut={() => {}}
                                    handleMouseOver={() => {}}
                                    mechHighlight={false}
                                    isSmall={true}
                                />
                                to Sink.
                            </Trans>
                        </li>
                        <li style={compute_formula_li_style("#FFFFFFFF")}>
                            {t("tutorial.goalLine2")}
                        </li>
                        <li style={compute_formula_li_style("#FFFFFFFF")}>
                            {t("tutorial.goalLine3_1")}
                            <a
                                href="https://stardisc.netlify.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="stardisc"
                            >
                                <u>
                                    <strong>StarDisc</strong>
                                </u>
                            </a>
                            {t("tutorial.goalLine3_2")}
                        </li>
                    </ol>

                    <p
                        style={{
                            fontSize: "0.9rem",
                            marginTop: "0",
                            marginBottom: "0",
                        }}
                    >
                        {t("tutorial.formulaList")}
                    </p>
                    <ol
                        style={{
                            width: "30rem",
                            marginTop: "1rem",
                            marginBottom: "2rem",
                        }}
                    >
                        <li
                            style={compute_formula_li_style(
                                OPERATOR_TYPES.STIR.color +
                                    FORMULA_LI_OPACITY_STR
                            )}
                        >
                            <p className={styles.input_name}>{t("Stir ")}</p>
                            {OPERATOR_TYPES.STIR.symbol}(
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_VANILLA_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                                mechHighlight={false}
                                isSmall={true}
                            />
                            ,
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_VANILLA_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                                mechHighlight={false}
                                isSmall={true}
                            />
                            )
                            <p
                                style={{
                                    marginLeft: "0.5rem",
                                    marginRight: "0.5rem",
                                }}
                            >
                                =
                            </p>
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_HAZELNUT_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                                mechHighlight={false}
                                isSmall={true}
                            />
                        </li>

                        <li
                            style={compute_formula_li_style(
                                OPERATOR_TYPES.SHAKE.color +
                                    FORMULA_LI_OPACITY_STR
                            )}
                        >
                            <p className={styles.input_name}>{t("Shake")}</p>
                            {OPERATOR_TYPES.SHAKE.symbol}(
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_HAZELNUT_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                                mechHighlight={false}
                                isSmall={true}
                            />
                            ,
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_HAZELNUT_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                                mechHighlight={false}
                                isSmall={true}
                            />
                            )
                            <p
                                style={{
                                    marginLeft: "0.5rem",
                                    marginRight: "0.5rem",
                                }}
                            >
                                =
                            </p>
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_CHOCOLATE_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                                mechHighlight={false}
                                isSmall={true}
                            />
                        </li>

                        <li
                            style={compute_formula_li_style(
                                OPERATOR_TYPES.STEAM.color +
                                    FORMULA_LI_OPACITY_STR
                            )}
                        >
                            <p className={styles.input_name}>{t("Steam")}</p>
                            {OPERATOR_TYPES.STEAM.symbol}(
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_HAZELNUT_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                                mechHighlight={false}
                                isSmall={true}
                            />
                            ,
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_CHOCOLATE_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                                mechHighlight={false}
                                isSmall={true}
                            />
                            ,
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_CHOCOLATE_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                                mechHighlight={false}
                                isSmall={true}
                            />
                            )
                            <p
                                style={{
                                    marginLeft: "0.5rem",
                                    marginRight: "0.5rem",
                                }}
                            >
                                =
                            </p>
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_TRUFFLE_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                                mechHighlight={false}
                                isSmall={true}
                            />{" "}
                            ,
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_VANILLA_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                                mechHighlight={false}
                                isSmall={true}
                            />
                        </li>

                        <li
                            style={compute_formula_li_style(
                                OPERATOR_TYPES.SMASH.color +
                                    FORMULA_LI_OPACITY_STR
                            )}
                        >
                            <p className={styles.input_name}>{t("Smash")}</p>
                            {OPERATOR_TYPES.SMASH.symbol}(
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_TRUFFLE_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                                mechHighlight={false}
                                isSmall={true}
                            />
                            )
                            <p
                                style={{
                                    marginLeft: "0.5rem",
                                    marginRight: "0.5rem",
                                }}
                            >
                                =
                            </p>
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_VANILLA_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                                mechHighlight={false}
                                isSmall={true}
                            />{" "}
                            ,
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_VANILLA_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                                mechHighlight={false}
                                isSmall={true}
                            />{" "}
                            ,
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_VANILLA_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                                mechHighlight={false}
                                isSmall={true}
                            />{" "}
                            ,
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_VANILLA_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                                mechHighlight={false}
                                isSmall={true}
                            />
                            ,
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_SAFFRON_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                                mechHighlight={false}
                                isSmall={true}
                            />
                        </li>
                    </ol>



                    <p
                        style={{
                            fontSize: "0.9rem",
                            marginTop: "0",
                            marginBottom: "0",
                        }}
                    >
                        {t("tutorial.instructions")}
                    </p>
                    <ol
                        style={{
                            width: "30rem",
                            marginTop: "1rem",
                            marginBottom: "2rem",
                        }}
                    >
                        <li style={CONTENT_LI_STYLE}>
                            {t("tutorial.explain_program")}
                            {/* A program is a sequence of instructions. */}
                        </li>
                        <li style={CONTENT_LI_STYLE}>
                            {t("tutorial.explain_mech")}
                            {/* Each mech has its own program. */}
                        </li>
                        <li style={CONTENT_LI_STYLE}>
                            {t("tutorial.explain_simulation")}
                            {/* During simulation, each mech runs its own program on repeat. */}
                        </li>
                        <li style={CONTENT_LI_STYLE}>
                            {t("tutorial.available_instructions")}
                            {/* Available instructions: */}
                            <i className="material-icons" style={{ fontSize: "1rem" }}>
                                {INSTRUCTION_ICON_MAP['w']}{INSTRUCTION_ICON_MAP['a']}{INSTRUCTION_ICON_MAP['s']}{INSTRUCTION_ICON_MAP['d']}{INSTRUCTION_ICON_MAP['z']}{INSTRUCTION_ICON_MAP['x']}{INSTRUCTION_ICON_MAP['g']}{INSTRUCTION_ICON_MAP['h']}{INSTRUCTION_ICON_MAP['.']}
                            </i>
                        </li>
                        <li style={CONTENT_LI_STYLE}>
                            <i className="material-icons" style={{ fontSize: "1rem" }}>
                                {INSTRUCTION_ICON_MAP['w']}/{INSTRUCTION_ICON_MAP['a']}/{INSTRUCTION_ICON_MAP['s']}/{INSTRUCTION_ICON_MAP['d']}
                            </i>
                            {t("tutorial.instruction_wasd")}
                            {/* : move up/left/down/right by one grid on the canvas. */}
                        </li>
                        <li style={CONTENT_LI_STYLE}>
                            <i className="material-icons" style={{ fontSize: "1rem" }}>
                                {INSTRUCTION_ICON_MAP['z']}
                            </i>
                            {t("tutorial.instruction_z")}
                            {/* : pick up an object, if available. */}
                        </li>
                        <li style={CONTENT_LI_STYLE}>
                            <i className="material-icons" style={{ fontSize: "1rem" }}>
                                {INSTRUCTION_ICON_MAP['x']}
                            </i>
                            {t("tutorial.instruction_x")}
                            {/* : drop the object in possession, if available. */}

                        </li>
                        <li style={CONTENT_LI_STYLE}>
                            <i className="material-icons" style={{ fontSize: "1rem" }}>
                                {INSTRUCTION_ICON_MAP['g']}
                            </i>
                            {t("tutorial.instruction_g")}
                            {/* : block program until pick up an object. This instruction becomes no-op if the mech already possesses an object. */}
                        </li>
                        <li style={CONTENT_LI_STYLE}>
                            <i className="material-icons" style={{ fontSize: "1rem" }}>
                                {INSTRUCTION_ICON_MAP['h']}
                            </i>
                            {t("tutorial.instruction_h")}
                            {/* : block program until drop the object in possession.  This instruction becomes no-op if the mech is not possessing an object. */}
                        </li>
                        <li style={CONTENT_LI_STYLE}>
                            <i className="material-icons" style={{ fontSize: "1rem" }}>
                                {INSTRUCTION_ICON_MAP['.']}
                            </i>
                            {t("tutorial.instruction_noop")}
                            {/* : no-op (no operation). */}
                        </li>
                        <li style={CONTENT_LI_STYLE}>
                            {t("tutorial.program_limit")}
                            {/* Program size shall not exceed 40 instructions. */}
                        </li>
                        <li style={CONTENT_LI_STYLE}>
                            {t("tutorial.formula_placement")}
                            {/* On formula placement: operands and product must be contiguous grids i.e. for &(a,b)=c, a-b and b-c must both be neighbors. When the contiguity rule is violated, formula symbols are not rendered. */}
                        </li>
                        <li style={CONTENT_LI_STYLE}>
                            {t("tutorial.faucet_sink")}
                            {/* Faucet is marked as "F" on the board, while Sink is marked as "S" on the board. */}
                        </li>

                    </ol>

                    <p
                        style={{
                            fontSize: "0.9rem",
                            marginTop: "0",
                            marginBottom: "0",
                        }}
                    >
                        {t("tutorial.costTitle")}
                    </p>
                    <p
                        style={{
                            fontSize: "0.8rem",
                            marginTop: "1rem",
                            marginBottom: "0",
                        }}
                    >
                        {t("tutorial.staticCostTitle")}
                    </p>
                    <ol
                        style={{
                            width: "30rem",
                            marginTop: "0.5rem",
                            marginBottom: "2rem",
                        }}
                    >
                        <li style={CONTENT_LI_STYLE}>
                            {t("tutorial.staticCostLine1")}
                        </li>
                        <li style={CONTENT_LI_STYLE}>
                            {t("tutorial.staticCostLine2")}
                        </li>
                        <li style={CONTENT_LI_STYLE}>
                            {t("tutorial.staticCostLine3")}
                        </li>
                        <li style={CONTENT_LI_STYLE}>
                            {t("tutorial.staticCostLine4")}
                        </li>
                        <li style={CONTENT_LI_STYLE}>
                            {t("tutorial.staticCostLine5")}
                        </li>
                    </ol>

                    <p
                        style={{
                            fontSize: "0.8rem",
                            marginTop: "0.5rem",
                            marginBottom: "0",
                        }}
                    >
                        {t("tutorial.dynamicCostTitle")}
                    </p>
                    <ol
                        style={{
                            width: "30rem",
                            marginTop: "0.5rem",
                            marginBottom: "2rem",
                        }}
                    >
                        <li style={CONTENT_LI_STYLE}>
                            <i className="material-icons" style={{ fontSize: "1rem" }}>
                                {INSTRUCTION_ICON_MAP['w']}/{INSTRUCTION_ICON_MAP['a']}/{INSTRUCTION_ICON_MAP['s']}/{INSTRUCTION_ICON_MAP['d']}
                            </i>
                            {t("tutorial.dynamicCostLine1")}
                        </li>
                        <li style={CONTENT_LI_STYLE}>
                            <i className="material-icons" style={{ fontSize: "1rem" }}>
                                {INSTRUCTION_ICON_MAP['w']}/{INSTRUCTION_ICON_MAP['a']}/{INSTRUCTION_ICON_MAP['s']}/{INSTRUCTION_ICON_MAP['d']}
                            </i>
                            {t("tutorial.dynamicCostLine2")}
                        </li>
                        <li style={CONTENT_LI_STYLE}>
                            <i className="material-icons" style={{ fontSize: "1rem" }}>
                                {INSTRUCTION_ICON_MAP['z']} / {INSTRUCTION_ICON_MAP['g']}
                            </i>
                            {t("tutorial.dynamicCostLine3")}
                        </li>
                        <li style={CONTENT_LI_STYLE}>
                            <i className="material-icons" style={{ fontSize: "1rem" }}>
                                {INSTRUCTION_ICON_MAP['x']} / {INSTRUCTION_ICON_MAP['h']}
                            </i>
                            {t("tutorial.dynamicCostLine4")}
                        </li>
                        <li style={CONTENT_LI_STYLE}>
                            <i className="material-icons" style={{ fontSize: "1rem" }}>
                                {INSTRUCTION_ICON_MAP['g']} / {INSTRUCTION_ICON_MAP['h']}
                            </i>
                            {t("tutorial.dynamicCostLine5")}
                        </li>
                    </ol>

                    </div>
                </Box>
            </Modal>
        </div>
    );
}
