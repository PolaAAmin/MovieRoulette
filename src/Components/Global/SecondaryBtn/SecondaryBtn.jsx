import React from 'react'

export default function SecondaryBtn(props) {

    return (
        <>
            <button
                className="btn btn-secondary d-flex align-items-center gap-2 px-2 py-2 px-sm-5 py-sm-3"
                id={props.id}
            >
                {props.icon}
                {props.icon2}
                {props.text}
            </button>
        </>

    )
}
