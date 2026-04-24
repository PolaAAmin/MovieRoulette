import React from 'react'
import './moviedetail.css'
import CarouselCaption from './CarouselCaption/CarouselCaption'
import IframeModal from '../../Global/IframeModal/IframeModal'
import CastList from './CastList/CastList';
import MovieDetails from './MovieDetails/MovieDetails';
import MovieList from './MovieList/MovieList';


export default function MovieDetailsPage() {

    return (
        <>
            <main className='mb-5 z-0'>
                <IframeModal src="https://www.youtube.com/embed/dQw4w9WgXcQ" />
                <div id="carouselExampleCaptions" className="carousel slide">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img
                                src="https://placehold.co/1280x720/000000/FFF000?text=Movie+Poster\n1280x720"
                                className="d-block w-100 image-fluid"
                                alt="Movie Poster"
                            />
                            <CarouselCaption />
                        </div>
                    </div>
                </div>
            </main>

            <section className="cast-section container mb-5 py-4">
                <div className="row g-3 d-flex align-items-start flex-column flex-lg-row">
                    <div className="col-12 col-lg-8 mb-4 mb-lg-0">
                        <div className="header-cast d-flex justify-content-between mb-2 align-items-center">
                            <h2 className="fst-italic">Top Cast</h2>
                            <a href="" className="btn btn-link p-0 text-uppercase" id="viewall">
                                View All
                            </a>
                        </div>
                        <CastList />
                    </div>
                    <div class="col-12 col-lg-4">
                        <MovieDetails />
                    </div>
                </div>
            </section>

            <section className="similar-movies-section container mb-5 py-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between mb-2 align-items-center">
                        <h2 className="text fst-italic">Similar Movies</h2>
                    </div>
                    <MovieList />
                </div>
            </section>

        </>
    )
}
