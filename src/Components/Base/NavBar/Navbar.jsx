import React from 'react'
import NavBarBrand from './NavBarBrand/NavBarBrand'
import CollapseBtn from './CollapseBtn/CollapseBtn'
import NavBarLinks from './NavBarLinks/NavBarLinks'
import SearchForm from './SearchForm/SearchFrom'
import IconBtn from './IconBtn/IconBtn'
import './navbar.css'

export default function Navbar() {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark">
                <div className="container-fluid">
                    <NavBarBrand />
                    <CollapseBtn />
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <NavBarLinks />
                        <ul className="navbar-nav d-flex gap-3 ms-3 align-items-center flex-row flex-nowrap mt-2 mt-lg-0">
                            <li className="nav-item">
                                <SearchForm />
                            </li>
                            <li className="nav-item">
                                <div className="btn-group">
                                    <IconBtn icon={<svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={25}
                                        height={25}
                                        fill={0o0}
                                        className="bi bi-bell"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
                                    </svg>} title={'Notifications'} />
                                </div>
                            </li>
                            <li className="nav-item">
                                <div className="btn-group">
                                    <IconBtn icon={<svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={25}
                                        height={25}
                                        fill={0o0}
                                        className="bi bi-gear"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
                                        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
                                    </svg>} title={'Settings'} />

                                </div>
                            </li>
                            <li className="nav-item">
                                <div className="btn-group">
                                    <IconBtn icon={<svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={25}
                                        height={25}
                                        fill={0o0}
                                        className="bi bi-person-circle"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                        <path
                                            fillRule="evenodd"
                                            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                                        />
                                    </svg>} title={'Profile'} />
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

        </>
    )
}
