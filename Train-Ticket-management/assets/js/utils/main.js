// Main JavaScript utilities for Indian Railways Ticket Management System

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize tooltips
    initializeTooltips();

    // Add smooth scrolling for anchor links
    initializeSmoothScrolling();

    // Initialize animations for elements
    initializeAnimations();

    // Initialize responsive behavior
    initializeResponsiveBehavior();

    // Initialize section navigation highlight for index page
    initializeIndexNavHighlight();
});

// Initialize Bootstrap tooltips
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Initialize smooth scrolling for anchor links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize animations for elements
function initializeAnimations() {
    // For elements that should animate when scrolled into view
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length > 0) {
        // Create intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, { threshold: 0.2 }); // Trigger when 20% visible

        // Observe each element
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
}

// Initialize responsive behavior
function initializeResponsiveBehavior() {
    // Navbar scroll behavior
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }
}

// Initialize section navigation highlight for index page
function initializeIndexNavHighlight() {
    // Only apply this on the index page
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === '' || currentPage === 'index.html') {

        // Handle click on section links
        document.querySelectorAll('.navbar-nav .nav-link[href^="#"]').forEach(link => {
            link.addEventListener('click', function () {
                // Remove active class from all nav links
                document.querySelectorAll('.navbar-nav .nav-link').forEach(navLink => {
                    navLink.classList.remove('active');
                });

                // Add active class to clicked link
                this.classList.add('active');
            });
        });

        // Handle scroll to update active link
        window.addEventListener('scroll', function () {
            // Get all sections that have an ID defined
            const sections = document.querySelectorAll('section[id]');

            // Get current scroll position
            const scrollY = window.pageYOffset;

            // Loop through sections to find the one in view
            sections.forEach(current => {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 100;
                const sectionId = current.getAttribute('id');

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    // Remove active class from all nav items
                    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
                        link.classList.remove('active');
                    });

                    // Add active class to corresponding nav item
                    const activeLink = document.querySelector(`.navbar-nav .nav-link[href="#${sectionId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });

            // If at the top of the page, activate Home
            if (scrollY < 100) {
                document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                const homeLink = document.querySelector('.navbar-nav .nav-link[href="index.html"]');
                if (homeLink) {
                    homeLink.classList.add('active');
                }
            }
        });
    }
}