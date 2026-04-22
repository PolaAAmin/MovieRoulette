import React from 'react';
import brandLogo from '../../../assets/brandLogo.png'


export default function NavBarBrand() {
    return (
        <>
            <a className="navbar-brand d-flex justify-content-center" href="#">
                <img
                    src={brandLogo}
                    alt="Logo"
                    width={40}
                    height={40}
                    className="d-inline-block align-text-top mx-2"
                />
                <h1 className="brand-name">MovieRoulette</h1>
            </a>
        </>
    )
}
