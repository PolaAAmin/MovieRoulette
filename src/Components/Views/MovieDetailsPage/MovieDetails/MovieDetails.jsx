import React from 'react'

export default function MovieDetails() {
    return (
        <>
            <div className="movie-details container rounded-4 px-4 py-4 h-100">
                <div className="gradient-background position-absolute w-100 h-100 start-0 top-0 rounded-4" />
                <div className=" d-flex flex-column gap-3 justify-content-start align-items-start">
                    <div>
                        <p>The Author</p>
                        <h3>Author Name</h3>
                    </div>
                    <div>
                        <p>Production</p>
                        <h3>Production Company</h3>
                    </div>
                    <div>
                        <p>Awards</p>
                        <div className="d-flex justify-content-center align-items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={20}
                                height={20}
                                fill="white"
                                className="bi bi-award-fill"
                                viewBox="0 0 16 16"
                            >
                                <path d="m8 0 1.669.864 1.858.282.842 1.68 1.337 1.32L13.4 6l.306 1.854-1.337 1.32-.842 1.68-1.858.282L8 12l-1.669-.864-1.858-.282-.842-1.68-1.337-1.32L2.6 6l-.306-1.854 1.337-1.32.842-1.68L6.331.864z" />
                                <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1z" />
                            </svg>
                            <h3 className="ms-2 mb-0">Awards List</h3>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
