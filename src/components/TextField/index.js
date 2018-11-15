import React from 'react';

export default function TextField(props) {
    function handleChange(event) {
        props.onChange(event.target.value, props.id);
    }
    return (
        <div>
            <label>{props.label}</label>
            <input
                id={props.id}
                onChange={handleChange}
                value={props.value}
                maxLength={props.maxLength}
                type={props.type}
            />
            <span style={{ color: 'red' }} >{props.error}</span>
        </div>
    )
}