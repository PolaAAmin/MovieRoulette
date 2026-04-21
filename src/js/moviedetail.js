const addFavouriteBtn = document.getElementById("addToFavourite");
const favouriteHeart = {
    filledHeart: addFavouriteBtn.querySelector(".bi-heart-fill"),
    emptyHeart: addFavouriteBtn.querySelector(".bi-heart"),
};


addFavouriteBtn.addEventListener("click", () => {
    favouriteHeart.filledHeart.classList.toggle("d-none");
    favouriteHeart.emptyHeart.classList.toggle("d-none");
});

