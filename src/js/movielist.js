document.addEventListener('DOMContentLoaded', async () => {
    const genreButtons = document.querySelectorAll('.genre-pill');
    const sortButtons = document.querySelectorAll('.sort-btn');
    const yearSlider = document.querySelector('#yearRange');
    const yearOutput = document.querySelector('#yearOutput');
    const languageChecks = document.querySelectorAll('.language-filter');
    const movieGrid = document.querySelector('#moviesGrid');
    const movieTiles = Array.from(document.querySelectorAll('.movie-tile'));
    const resultCount = document.querySelector('#resultCount');
    const resetButton = document.querySelector('#resetFilters');

    const state = {
        genre: 'all',
        sort: 'popular',
        year: Number(yearSlider.value),
        languages: ['english']
    };

    function updateYearOutput() {
        yearOutput.textContent = `${state.year}+`;
    }

    function sortMovies(visibleMovies) {
        const sorter = {
            popular: (a, b) => Number(b.dataset.popularity) - Number(a.dataset.popularity),
            rating: (a, b) => Number(b.dataset.rating) - Number(a.dataset.rating),
            newest: (a, b) => Number(b.dataset.year) - Number(a.dataset.year)
        };

        visibleMovies.sort(sorter[state.sort]);
        visibleMovies.forEach((movie) => movieGrid.appendChild(movie));
    }

    function applyFilters() {
        const activeLanguages = state.languages;

        const visibleMovies = movieTiles.filter((movie) => {
            const matchesGenre = state.genre === 'all' || movie.dataset.genre === state.genre;
            const matchesYear = Number(movie.dataset.year) >= state.year;
            const matchesLanguage = activeLanguages.includes(movie.dataset.language);
            const shouldShow = matchesGenre && matchesYear && matchesLanguage;
            movie.classList.toggle('is-hidden', !shouldShow);
            return shouldShow;
        });

        sortMovies(visibleMovies);
        resultCount.textContent = `${visibleMovies.length} movies found`;
    }

    genreButtons.forEach((button) => {
        button.addEventListener('click', () => {
            genreButtons.forEach((item) => item.classList.remove('active'));
            button.classList.add('active');
            state.genre = button.dataset.genre;
            applyFilters();
        });
    });

    sortButtons.forEach((button) => {
        button.addEventListener('click', () => {
            sortButtons.forEach((item) => item.classList.remove('active'));
            button.classList.add('active');
            state.sort = button.dataset.sort;
            applyFilters();
        });
    });

    yearSlider.addEventListener('input', () => {
        state.year = Number(yearSlider.value);
        updateYearOutput();
        applyFilters();
    });

    languageChecks.forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            state.languages = Array.from(languageChecks)
                .filter((item) => item.checked)
                .map((item) => item.value);

            if (state.languages.length === 0) {
                checkbox.checked = true;
                state.languages = [checkbox.value];
            }

            applyFilters();
        });
    });

    resetButton.addEventListener('click', () => {
        state.genre = 'all';
        state.sort = 'popular';
        state.year = 1970;
        state.languages = ['english'];

        genreButtons.forEach((button) => {
            button.classList.toggle('active', button.dataset.genre === 'all');
        });

        sortButtons.forEach((button) => {
            button.classList.toggle('active', button.dataset.sort === 'popular');
        });

        languageChecks.forEach((checkbox) => {
            checkbox.checked = checkbox.value === 'english';
        });

        yearSlider.value = String(state.year);
        updateYearOutput();
        applyFilters();
    });

    updateYearOutput();
    applyFilters();
});
