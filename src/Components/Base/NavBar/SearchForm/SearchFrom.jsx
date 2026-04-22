import React from 'react'
import PillInput from '../../../Global/PillInput/PillInput.jsx'

export default function SearchFrom() {
    // const search = document.getElementById("search");

    return (
        <>
            <form className="d-flex" role="search">
                <PillInput type="search" placeholder="Search" ariaLabel="Search" id="search" />
            </form>
        </>
    )
}
