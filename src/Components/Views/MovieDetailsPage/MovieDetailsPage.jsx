import React from 'react'
import CarouselCaption from './CarouselCaption/CarouselCaption'
import IframeModal from '../../Global/IframeModal/IframeModal'

import './moviedetail.css'

export default function MovieDetailsPage() {

    return (
        <>
            <div className="carousel-item active">
                <IframeModal src="https://www.youtube.com/embed/dQw4w9WgXcQ" />
                <img
                    src="https://placehold.co/1280x720/000000/FFF000?text=Movie+Poster\n1280x720"
                    className="d-block w-100 image-fluid"
                    alt="Movie Poster"
                />
                <CarouselCaption />
            </div>

        </>
    )
}
