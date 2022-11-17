import React from 'react'
import Solution from '../types/Solution'

export default function SavedSolutionElement ({ key, name, onLoadClick, onClearClick }) {

    const CLEAR_BUTTON_DIM = 16

    // render table row
    return (
        <div style={{
            position:'relative',
            height:'35px',
            width: '50px',
            marginRight: '5px'
        }}>
            <button
                style={{
                    border: '1px solid #555555',
                    borderRadius: '3px',
                    fontSize: '12px',
                    margin:'0 3px 0 3px',
                    position:'absolute',
                    bottom:'0',
                    right: '0',
                }}
                onClick={onLoadClick}
                key={key}
            >
                {name}
            </button>

            <button
                style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    width: `${CLEAR_BUTTON_DIM}px`,
                    height: `${CLEAR_BUTTON_DIM}px`,
                    fontSize: `${CLEAR_BUTTON_DIM/1.6}px`,
                    padding: '0',
                    borderRadius: `50%`,
                    zIndex: '1'
                }}
                onClick={onClearClick}
                key={key+'-clear'}
            >
                {'x'}
            </button>
        </div>
    )

}
