import React from 'react'

export default function IconBtn(props) {
    return (
        <>
            <div className="btn-group">
                <button
                    className="btn"
                    type="button"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="true"
                    aria-expanded="false"
                >
                    {props.icon}
                </button>
                <ul className="dropdown-menu dropdown-menu-lg-end mt-4">
                    <li>
                        <a className="dropdown-item" href="#">
                            {props.title}
                        </a>
                    </li>
                    <li>
                        <a className="dropdown-item" href="#">
                            { props.title}
                        </a>
                    </li>
                    <li>
                        <a className="dropdown-item" href="#">
                            { props.title}
                        </a>
                    </li>
                </ul>
            </div>

        </>
    )
}
