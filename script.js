document.addEventListener('DOMContentLoaded', () => {
    // មុខងារសម្រាប់ប៊ូតុង "ទិញឥឡូវនេះ"
    const heroButton = document.querySelector('.hero-button');
    heroButton.addEventListener('click', () => {
        document.querySelector('#products').scrollIntoView({ behavior: 'smooth' });
    });

    // មុខងារសម្រាប់ Menu Links (Smooth Scrolling)
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // មុខងារសម្រាប់ Menu Icon (Hamburger Icon)
    const menuIcon = document.querySelector('.menu-icon');
    const nav = document.querySelector('.nav');

    menuIcon.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuIcon.classList.toggle('change');
    });
});
