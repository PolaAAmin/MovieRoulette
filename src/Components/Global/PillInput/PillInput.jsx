import React from 'react'

export default function PillInput(props) {
    return (
        <>
            <input
                className="form-control me-2 rounded-pill px-4 bg-dark text-white border-1"
                type={props.type}
                placeholder={props.placeholder}
                aria-label={props.ariaLabel}
                id={props.id}
            />
        </>
    )
}
