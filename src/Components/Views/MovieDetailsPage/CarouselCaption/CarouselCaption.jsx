import React from 'react'
import SecondaryBtn from '../../../Global/SecondaryBtn/SecondaryBtn'
import PrimaryBtn from '../../../Global/PrimaryBtn/PrimaryBtn'
import Badge from '../../../Global/Badge/Badge'

const addFavouriteBtn = document.getElementById("addToFavourite");
const favouriteHeart = {
    filledHeart: addFavouriteBtn.querySelector(".bi-heart-fill"),
    emptyHeart: addFavouriteBtn.querySelector(".bi-heart"),
};


addFavouriteBtn.addEventListener("click", () => {
    favouriteHeart.filledHeart.classList.toggle("d-none");
    favouriteHeart.emptyHeart.classList.toggle("d-none");
});

export default function CarouselCaption() {

    return (
        <>
            <div className="carousel-caption d-md-block mb-4">
                <div className="d-flex justify-content-start align-items-center gap-3">
                    <Badge className="genre" text="Action" />
                    <Badge className="movie-rating" text="4.5" icon={
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            fill="currentColor"
                            className="bi bi-star-fill"
                            viewBox="0 0 16 16"
                        >
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                        </svg>
                    } />
                    <div className="d-flex align-items-center gap-2">
                        <p className="mb-0 text-uppercase fs-5 d-none d-lg-block">
                            october, 2023
                        </p>
                        <p className="mb-0 text-uppercase fs-5 d-none d-lg-block">•</p>
                        <p className="mb-0 text-uppercase fs-5 d-none d-lg-block">2H 30M</p>
                    </div>
                </div>
                <div className="movie-info mt-3 text-start">
                    <h1 className="movie-title display-1">Movie Title</h1>
                    <p className="d-none d-lg-block col-7">
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Et eum ex
                        facilis ipsam sequi ut tempore officia illum eos laudantium, dolorum ea!
                        Cumque quis maxime, minima libero itaque ducimus modi beatae incidunt
                        provident obcaecati recusandae quae nostrum consectetur omnis esse?
                    </p>
                </div>
                <div className="d-flex gap-3 mt-4 justify-content-start">
                    <PrimaryBtn
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={16}
                                height={16}
                                fill="currentColor"
                                className="bi bi-play-fill"
                                viewBox="0 0 16 16"
                            >
                                <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
                            </svg>
                        }
                        toggle="modal"
                        target="#exampleModal"
                        id="watchTrailer"
                        text="Watch Trailer"
                    ></PrimaryBtn>
                    <SecondaryBtn
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={16}
                                height={16}
                                fill="currentColor"
                                className="bi bi-heart-fill d-none"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                                />
                            </svg>
                        }
                        icon2={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={16}
                                height={16}
                                fill="currentColor"
                                className="bi bi-heart"
                                viewBox="0 0 16 16"
                            >
                                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                            </svg>
                        }
                        id="addToFavourite"
                        text="Add to Favourite"
                    >
                    </SecondaryBtn>
                </div>
            </div>
        </>
    )
}
