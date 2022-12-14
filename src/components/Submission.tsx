import {useAccount, useConnectors} from '@starknet-react/core'
import { useEffect, useState } from 'react'
// import Button from './Button'
import { toBN } from 'starknet/dist/utils/number'
import styles from './ConnectWallet.module.css'
import { Trans, useTranslation } from "react-i18next";

import {
    useStardiscRegistryByAccount
} from '../../lib/api'
import { Tooltip } from '@mui/material';

export default function Submission({ handleClickSubmit }) {

    const { t } = useTranslation();

    return (
        <Tooltip title={t("submission")} arrow>
            <div style={{ marginBottom: "1rem" }}>
                <button id={"submit-button"} onClick={() => handleClickSubmit()} className={"big-button"}>
                    <i className="material-icons" style={{ fontSize: "1rem", paddingTop: "0.12rem" }}>
                        send
                    </i>
                </button>
            </div>
        </Tooltip>
    );
}