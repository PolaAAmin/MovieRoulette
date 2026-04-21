async function loadSharedPartials() {

    const partials = [
        { container: '#navbar-container', path: './base/navbar.html' },
        { container: '#footer-container', path: './base/footer.html' }
    ];

    for (let item of partials) {

        const host = document.querySelector(item.container);
        if (!host) continue;

        try {
            const response = await fetch(item.path);
            const html = await response.text();

            host.innerHTML = html;

        } catch (error) {
            console.error("Error loading:", item.path);
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadSharedPartials();
});