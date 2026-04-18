document.addEventListener('DOMContentLoaded', async () => {
    const chips = document.querySelectorAll('.filter-chip');
    const cards = document.querySelectorAll('.movie-card');

    chips.forEach((chip) => {
        chip.addEventListener('click', () => {
            chips.forEach((item) => item.classList.remove('active'));
            chip.classList.add('active');

            const selectedGenre = chip.dataset.genre;

            cards.forEach((card) => {
                const matches = selectedGenre === 'all' || card.dataset.genre === selectedGenre;
                card.classList.toggle('is-hidden', !matches);
            });
        });
    });
});
