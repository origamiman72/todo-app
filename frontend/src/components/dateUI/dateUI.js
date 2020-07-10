import React from 'react';
import './dateUI.scss';

function DateUI(props) {
    return (
        <div className="dateUI">
            {props.month}/{props.day}/{props.year}
        </div>
    )
}

export default DateUI;