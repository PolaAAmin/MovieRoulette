import React from 'react'

export default function Series() {
    return (
        <>
            <div className="col-12 col-sm-6 col-lg-3 series">
                <p className="mb-2">Explore our series collection!</p>
                <ul className="navbar-nav d-flex flex-column gap-2">
                    <li className="nav-item">
                        <a href="#" className="text-decoration-none">
                            Top Rated
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className="text-decoration-none">
                            New Releases
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className="text-decoration-none">
                            Genres
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className="text-decoration-none">
                            Actors
                        </a>
                    </li>
                </ul>
            </div>

        </>
    )
}
