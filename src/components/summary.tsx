import AtomState, { AtomStatus, AtomType } from '../types/AtomState';
import Unit from './unit';
import { AtomTypeToBg, UnitText } from '../types/UnitState';
import { BgStatus } from '../types/UnitState';
import Frame from '../types/Frame';
import styles from '../../styles/Home.module.css'
import { useTranslation } from 'react-i18next';
import { TO_PRECISION, Constraints, Modes } from '../constants/constants'

export default function Summary ({ mode, frames, n_cycles }) {

    const { t } = useTranslation();

    if (!frames) {
        return (
            <div style={{padding:'0'}}>
                <p style={{fontSize:'0.9rem'}}>{t('summary.title')}</p>
                <p>n/a</p>
            </div>
        )
    }

    const target_type: AtomType = Constraints[mode].TARGET_TYPE
    const target_bg: BgStatus = AtomTypeToBg[target_type]
    const last_frame: Frame = frames[frames.length-1]

    // Get total delivery
    const total_delivery = last_frame.delivered_accumulated.filter(t => t == target_type).length;

    // Get static cost
    const static_cost = frames[0].cost_accumulated

    // Calculate average latency & average dynamic cost per delivery
    // 1. mark the frame index and accumulated cost at each devliery
    // 2. find average dynamic cost and average latency
    let frame_indices_at_delivery = []
    let costs_accumulated_at_delivery = []
    for (var frame_i = 1; frame_i < frames.length; frame_i++){
        const prev_count = frames[frame_i-1].delivered_accumulated.filter(t => t == target_type).length;
        const curr_count = frames[frame_i  ].delivered_accumulated.filter(t => t == target_type).length;
        if (curr_count > prev_count) { // delivery at this frame
            frame_indices_at_delivery.push(frame_i)
            costs_accumulated_at_delivery.push(frames[frame_i].cost_accumulated)
        }
    }
    const n_deliveries = frame_indices_at_delivery.length
    const average_latency_str = n_deliveries == 0 ? `>${n_cycles}` : (
        TO_PRECISION( frame_indices_at_delivery[n_deliveries-1] / n_deliveries )
    ).toString();
    const average_dynamic_cost_str = n_deliveries == 0 ? `n/a` : (
        TO_PRECISION( (costs_accumulated_at_delivery[n_deliveries-1] - static_cost) / n_deliveries )
    ).toString();

    // Compute if lesson objective is completed
    const success = total_delivery >= Constraints[mode].OBJECTIVE_DELIVERY

    // Makeshift styling the reported numbers
    const makeshift_number_style = {
        textDecoration: 'underline',
        marginLeft: '0.2rem'
    }
    const div_style: React.CSSProperties = {
        display:'flex',flexDirection:'row',paddingLeft:'2rem',
        alignItems:'center'
    }
    const celebrate_size = '4rem'

    return (
        <div style={{padding:'0'}}>
            <p style={{fontSize:'0.9rem'}}>{t('summary.title')}</p>

            {
                (mode !== Modes.arena) ? (
                    success ?
                    <div style={{display:'flex',flexDirection:'column',paddingLeft:'2rem'}}>
                        <div style={div_style}>
                            <p>You successfully delivered {Constraints[mode].OBJECTIVE_DELIVERY} x</p>
                            <Unit state={{bg_status: target_bg}} isSmall={true}/>
                            <p>in {n_cycles} cycles.</p>
                        </div>
                        <div style={div_style}>
                            <div className='celebrate' style={{width:celebrate_size,height:celebrate_size}}></div>
                            <p style={{fontSize:'1rem',marginLeft:'15px'}}>Lesson passed!</p>
                        </div>
                    </div>:
                    <div style={div_style}>
                        <p>To pass this lesson, deliver {Constraints[mode].OBJECTIVE_DELIVERY} x</p>
                        <Unit state={{bg_status: target_bg}} isSmall={true}/>
                        <p>in {n_cycles} cycles.</p>
                    </div>
                ) : <></>
            }

            {
                (mode == Modes.arena) ? (
                    <>
                        <div style={div_style}>
                            <p>{t('summary.totalPre', { frames: n_cycles })}</p>
                            <Unit
                                state={{
                                    bg_status: target_bg,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                isSmall={true}
                            />
                            <p>{t('summary.inFrames', { frames: n_cycles })}:</p>
                            <p style={makeshift_number_style}>{total_delivery}</p>
                            <p style={{marginLeft:'0.3rem'}}>{t('summary.totalPost')}</p>
                        </div>
                        <div style={div_style}>
                            <p>{t('summary.averageLatencyPre')}</p>
                            <Unit
                                state={{
                                    bg_status: target_bg,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                isSmall={true}
                            />
                            <p>{t('summary.averageLatencyPost')}:</p>
                            <p style={makeshift_number_style}>{average_latency_str}</p>
                        </div>

                        <div style={div_style}>
                            <p>{t('summary.averageDynamicCostPre')}</p>
                            <Unit
                                state={{
                                    bg_status: target_bg,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                isSmall={true}
                            />
                            <p>{t('summary.averageDynamicCostPost')}:</p>
                            <p style={makeshift_number_style}>{average_dynamic_cost_str}</p>
                        </div>

                        <div style={div_style}>
                            <p>{t('summary.staticCost')}:</p>
                            <p style={makeshift_number_style}>{static_cost}</p>
                        </div>
                    </>
                ) : <></>
            }

        </div>
    )
}
