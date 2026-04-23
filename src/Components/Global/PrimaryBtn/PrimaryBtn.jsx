import React from 'react'

export default function PrimaryBtn(props) {
    return (
        <>
            <button
                className="btn btn-primary d-flex align-items-center gap-2 px-2 py-1 px-sm-5 py-sm-3"
                data-bs-toggle={props.toggle}
                data-bs-target={props.target}
                id={props.id}
            >
                {props.icon}
                {props.text}
            </button>
        </>

    )
}
