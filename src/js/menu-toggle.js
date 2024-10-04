document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('menu-open');
    });

    navLinks.addEventListener('click', function(event) {
        if (event.target.tagName === 'A') {
            navLinks.classList.remove('menu-open');
        }
    });
});
