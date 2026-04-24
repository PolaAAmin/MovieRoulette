import React from 'react'

export default function Card(props) {
    return (
        <>
            <div className={props.className + " d-flex flex-column align-items-start gap-2 justify-content-center"}>
                <div className={(props.className === "movie") ? "poster rounded-3 overflow-hidden" : "rounded-3 overflow-hidden"}>
                    <img
                        src={props.src}
                        alt={props.alt}
                        className="rounded-3 image-fluid"
                    />
                    {(props.className === "movie" ? <span
                    class="badge bg-dark px-2 py-2 text-uppercase position-absolute top-0 end-0 m-2">{ props.badge }</span> : "")}
                </div>
                <div className="d-flex flex-column gap-1 justify-content-start align-items-start">
                    <h5 className="mb-0">{props.header}</h5>
                    <div class="d-flex flex-row gap-2">
                        {(props.className === "cast-member" ? <p class="mb-0">{props.character}</p> : "")}
                        <p class="mb-0">{props.year}</p>
                        <p class="mb-0 text-uppercase"> {props.genre}</p>
                    </div>
                </div>
            </div>

        </>
    )
}
