import React from 'react'

export default function NavBarLinks() {
    return (
    <>
        <ul className="navbar-nav mb-2 mb-lg-0 mx-auto d-flex gap-3">
            <li className="nav-item ">
                <a className="nav-link active" aria-current="page" href="./Home.html">
                    Home
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="./MovieList.html">
                    Movies
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="./MovieList.html">
                    Series
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="./RandomGenrator.html">
                    Random
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="./About.html">
                    About
                </a>
            </li>
        </ul>
    </>
    )
}
