import UnitState, {BgStatus, BorderStatus} from '../src/types/UnitState';
import styles from '../styles/Unit.module.css';

export default function Unit({ state, handleMouseOver, handleMouseOut, mechHighlight, isSmall }) {

    // guardrail
    if (!state) {return <></>}

    // Compute atom styles
    let divStyle: React.CSSProperties = mechHighlight ? {borderWidth:'3px'} : {borderWidth: '1px'}
    if (isSmall) divStyle = {...divStyle, width:'1.6rem', height:'1.6rem'}
    divStyle = {...divStyle, zIndex:'20'}

    let className: string = '';
    // let nuclei: number = 0;
    if (state.bg_status === BgStatus.ATOM_VANILLA_FREE) {
        className += styles.atomVanillaFree + ' ';
        // nuclei = 1;
    }
    else if (state.bg_status === BgStatus.ATOM_VANILLA_POSSESSED) {
        className += styles.atomVanillaPossessed + ' ';
        // nuclei = 1;
    }

    else if (state.bg_status === BgStatus.ATOM_HAZELNUT_FREE) {
        className += styles.atomHazelnutFree + ' ' + styles.twoNuclei + ' ';
        // nuclei = 2;
    }
    else if (state.bg_status === BgStatus.ATOM_HAZELNUT_POSSESSED) {
        className += styles.atomHazelnutPossessed + ' ' + styles.twoNuclei + ' ';
        // nuclei = 2;
    }

    else if (state.bg_status === BgStatus.ATOM_CHOCOLATE_FREE) {
        className += styles.atomChocolateFree + ' ' + styles.threeNuclei + ' ';
        // nuclei = 3;
    }
    else if (state.bg_status === BgStatus.ATOM_CHOCOLATE_POSSESSED) {
        className += styles.atomChocolatePossessed + ' ' + styles.threeNuclei + ' ';
        // nuclei = 3;
    }

    else if (state.bg_status === BgStatus.ATOM_TRUFFLE_FREE) {
        className += styles.atomTruffleFree + ' ' + styles.fourNuclei + ' ';
        // nuclei = 4;
    }
    else if (state.bg_status === BgStatus.ATOM_TRUFFLE_POSSESSED) {
        className += styles.atomTrufflePossessed + ' ' + styles.fourNuclei + ' ';
        // nuclei = 4;
    }

    else if (state.bg_status === BgStatus.ATOM_SAFFRON_FREE) {
        className += styles.atomSaffronFree + ' ';
        // nuclei = 1;
    }
    else if (state.bg_status === BgStatus.ATOM_SAFFRON_POSSESSED) {
        className += styles.atomSaffronPossessed + ' ';
        // nuclei = 1;
    }

    else if (state.bg_status === BgStatus.ATOM_TURTLE_FREE) {
        className += styles.atomTurtleFree + ' ';
        // nuclei = 1;
    }
    else if (state.bg_status === BgStatus.ATOM_TURTLE_POSSESSED) {
        className += styles.atomTurtlePossessed + ' ';
        // nuclei = 1;
    }

    else if (state.bg_status === BgStatus.ATOM_SANDGLASS_FREE) {
        className += styles.atomSandglassFree + ' ';
        // nuclei = 1;
    }
    else if (state.bg_status === BgStatus.ATOM_SANDGLASS_POSSESSED) {
        className += styles.atomSandglassPossessed + ' ';
        // nuclei = 1;
    }

    else if (state.bg_status === BgStatus.ATOM_WILTED_FREE) {
        className += styles.atomWiltedFree + ' ';
        // nuclei = 1;
    }
    else if (state.bg_status === BgStatus.ATOM_WILTED_POSSESSED) {
        className += styles.atomWiltedPossessed + ' ';
        // nuclei = 1;
    }

    //
    // Compute mech styles
    //
    let grabberClassName: string = '';
    if (state.border_status == BorderStatus.SINGLETON_OPEN) {
        className += styles.mechSingletonOpen + ' ';
        grabberClassName += styles.grabberOpen + ' ';
    }
    else if (state.border_status == BorderStatus.SINGLETON_CLOSE) {
        className += styles.mechSingletonClose + ' ';
        grabberClassName += styles.grabberClose + ' ';
    }

    const mechId = state.unit_id && state.unit_id.includes('mech') && state.unit_id.replace('mech', '')

    // Render
    return (
        <div
            className={`grid ${styles.unit} ${className}`}
            onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}
            style={divStyle}
        >
            {/* {Array.from({length: nuclei}).map((_, i) =>
                <div key={`nucleus${i}`} className={`${styles.nucleus}`} />
            )} */}
            <div key={`grabber`} className={`${styles.grabber} ${grabberClassName}`} />
            {state.unit_text}
            {mechId && <div className={styles.unitId}>{mechId}</div>}
        </div>
    )
}
