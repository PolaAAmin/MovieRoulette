// .random-form Selection and fillout
const switchersMood = document.getElementById("mood");
const genreSelect = document.getElementById("genre");
const subGenreSelect = document.getElementById("sub-genre");
const languageSelect = document.getElementById("language");

//generated movie components
const addFavouriteBtn = document.getElementById("favourite");
const favouriteHeartIcon = {
    filledHeart: addFavouriteBtn.querySelector(".bi-heart-fill"),
    emptyHeart: addFavouriteBtn.querySelector(".bi-heart"),
};
const viewDetails = document.getElementById("view-details");

viewDetails.addEventListener("click", () => {
    window.location.href = "MovieDetails.html";
});


addFavouriteBtn.addEventListener("click", () => {
    favouriteHeartIcon.filledHeart.classList.toggle("d-none");
    favouriteHeartIcon.emptyHeart.classList.toggle("d-none");
});

//range setup
setupMinAndMaxRange("range-rating-min","range-rating-max","min-rating","max-rating");
setupMinAndMaxRange("range-year-min","range-year-max","min-year","max-year");
setupMinAndMaxRange("range-runtime-min", "range-runtime-max", "min-runtime", "max-runtime");

function setupMinAndMaxRange(minRange, maxRange, minLabel, maxLabel) {
    const minSlider = document.getElementById(minRange);
    const maxSlider = document.getElementById(maxRange);
    const minSpan = document.getElementById(minLabel);
    const maxSpan = document.getElementById(maxLabel);

    //init
    minSpan.textContent = minSlider.value;
    maxSpan.textContent = maxSlider.value;

    // minimum Slider
    minSlider.addEventListener("input", () => {
        if (parseInt(maxSlider.value) <= parseInt(minSlider.value)) {
            minSlider.value = parseInt(maxSlider.value) - 1;
        }
        minSpan.textContent = minSlider.value;
    });

    // maximum Slider
    maxSlider.addEventListener("input", () => {
        if (parseInt(maxSlider.value) <= parseInt(minSlider.value)) {
            maxSlider.value = parseInt(minSlider.value) + 1;
        }
        maxSpan.textContent = maxSlider.value;
    });
}