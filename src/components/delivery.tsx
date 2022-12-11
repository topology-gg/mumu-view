import AtomState, { AtomStatus, AtomType } from '../types/AtomState';
import Unit from './unit';
import UnitState, {BgStatus, BorderStatus, UnitText} from '../types/UnitState';
import styles from '../../styles/Delivery.module.css'
import { useTranslation } from 'react-i18next';

export default function Delivery({ delivered, cost_accumulated }) {

    const { t } = useTranslation();

    if (!delivered) {
        return (
            <div  style={{alignItems:'center', margin:'0 auto'}}>
                <p>{t('delivery.accumulatedCost')}: n/a</p>
                <p>{t('delivery.delivered')}: n/a</p>
            </div>
        )
    }
    else if (delivered.length == 0) {
        return (
            <div  style={{alignItems:'center', margin:'0 auto'}}>
                <p>{t('delivery.accumulatedCost')}: {cost_accumulated}</p>
                <p>{t('delivery.delivered')}: 0</p>
            </div>
        )
    }

    let counts: { [key: string] : number } = {}
    for (let typ in AtomType){
        const count = delivered.filter(t => t == typ).length;
        if (count == 0) {
            continue;
        }
        counts[typ as string] = count
    }

    return (
        <div style={{alignItems:'center', margin:'0 auto'}}>
            <p>{t('delivery.accumulatedCost')}: {cost_accumulated}</p>
            <p>
                {t('delivery.delivered')}:
                {
                    Object.keys(counts).map(function(key: string,i: number){
                        // const bg_status = key == AtomType.HAZELNUT ? BgStatus.ATOM_HAZELNUT_FREE : BgStatus.ATOM_VANILLA_FREE
                        let bg_status: BgStatus
                        switch(key) {
                            case AtomType.VANILLA:
                                bg_status = BgStatus.ATOM_VANILLA_FREE
                                break;
                            case AtomType.HAZELNUT:
                                bg_status = BgStatus.ATOM_HAZELNUT_FREE
                                break;
                            case AtomType.CHOCOLATE:
                                bg_status = BgStatus.ATOM_CHOCOLATE_FREE
                                break;
                            case AtomType.TRUFFLE:
                                bg_status = BgStatus.ATOM_TRUFFLE_FREE
                                break;
                            case AtomType.SAFFRON:
                                bg_status = BgStatus.ATOM_SAFFRON_FREE
                                break;
                            default:
                                throw `invalid atom type encountered: ${key}`
                        }
                        return (
                            <div
                                key={`delivery-${key}`}
                                className={styles.deliveryUnit}
                            >
                                <p>{counts[key]} x</p>
                                <Unit
                                    state={{
                                        bg_status: bg_status,
                                        border_status: null,
                                        unit_text: UnitText.EMPTY,
                                        unit_id: null
                                    }}
                                    handleMouseOut={() => {}}
                                    handleMouseOver={() => {}}
                                    mechHighlight = {false}
                                    isSmall={true}
                                />
                            </div>
                        )
                    })
                }
            </p>
        </div>
    )
}
