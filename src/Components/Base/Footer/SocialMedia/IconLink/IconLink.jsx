import React from 'react'

export default function IconLink(props) {
    return (
        <>
            <a href={ props.link }>
                {props.icon}
            </a>
        </>
    )
}
