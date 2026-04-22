import React from 'react'

export default function PillBtn(props) {
    return (
        <>
            <button type={ props.type } id={ props.id } lass="btn btn-primary rounded-pill w-100">
                { props.children }
            </button>

        </>
    )
}
