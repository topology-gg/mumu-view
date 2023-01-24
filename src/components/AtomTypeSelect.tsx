import { useState } from "react";
import { OperatorState } from "../types/Operator";
import AtomFaucetState from "../types/AtomFaucetState";
import AtomSinkState from "../types/AtomSinkState";
import { Constraints } from "../constants/constants";
import { AtomTypeToBg } from "../types/UnitState";
import { UnitText } from "../types/UnitState";
import Unit from "./unit";
import { AtomType } from "../types/AtomState";

interface AtomTypeSelectProps {
    currAtomType: AtomType;
    handleAtomTypeChange: (atomType: AtomType) => void;
}

export function AtomTypeSelect ({
    currAtomType,
    handleAtomTypeChange,
} : AtomTypeSelectProps) {

    return (
        <div className="select" style={{marginLeft:'0.5rem'}}>
            <select
                name="unit" id="units"
                onChange={event => {
                    // console.log('AtomTypeSelect onChange:', AtomType[event.target.value])
                    handleAtomTypeChange(event.target.value as AtomType);
                }}
                style={{fontSize:'11px'}}
                defaultValue={currAtomType}
            >
            {
                Object.values(AtomType).map((atomType: AtomType) => (
                    <option value={atomType} key={atomType}>
                        {/* <Unit
                            atomOpacity={1.0}
                            state={{
                                bg_status: AtomTypeToBg[atomType],
                                border_status: null,
                                unit_text: UnitText.EMPTY,
                                unit_id: null,
                            }}
                            handleMouseOut={() => {}}
                            handleMouseOver={() => {}}
                            mechHighlight={false}
                            isSmall={true}
                        /> */}
                        {atomType}
                    </option>
                ))
            }
            </select>
        </div>
    )
}
