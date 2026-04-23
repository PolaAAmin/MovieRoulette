import React from 'react'

export default function IframeModal(props) {
    return (
        <>
            <div
                className="modal fade"
                id="exampleModal"
                tabIndex={-1}
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content position-relative">
                        <iframe
                            width={1080}
                            height={500}
                            src={props.src}
                            title="YouTube video player"
                            frameBorder={0}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen=""
                            className="mx-auto position-absolute start-50 top-50 translate-middle"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
