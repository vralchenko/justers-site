document.addEventListener('DOMContentLoaded', () => {
    console.log('Justers site loaded');

    // Mobile Menu Toggle
    const burger = document.querySelector('.burger-menu');
    const nav = document.querySelector('.nav');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
        });

        // Close menu when clicking a link
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
            });
        });
    }
});
