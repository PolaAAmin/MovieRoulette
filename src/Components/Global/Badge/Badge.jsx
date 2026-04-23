import React from 'react'

export default function Badge(props) {
    return (
        <>
            <div
                className={props.className + " align-items-center gap-1 justify-content-center px-2 py-1 rounded-2 d-none d-lg-flex"}>
                { props.icon }
                <p className="mb-0">{ props.text }</p>
            </div>
        </>
    )
}
