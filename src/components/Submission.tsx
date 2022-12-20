import { Trans, useTranslation } from "react-i18next";
import { Tooltip } from '@mui/material';
import { CircularProgress } from '@mui/material';

export default function Submission({ 
    handleClickSubmit, 
    isPending = false 
} : { 
    handleClickSubmit: () => void; 
    isPending?: boolean
}) {

    const { t } = useTranslation();

    return (
        // <Tooltip title={t("submission")} arrow>
            <div style={{ marginBottom: "1rem" }}>
                <button id={"submit-button"} onClick={() => handleClickSubmit()} className={"big-button"} disabled={isPending}>
                    {isPending ? 
                        <CircularProgress size="20px" color="inherit"/>
                    :
                        <i className="material-icons" style={{ fontSize: "1rem", paddingTop: "0.12rem" }}>
                            send
                        </i>
                    }
                </button>
            </div>
        // </Tooltip>
    );
}
