function startReading() {
    const firstScene = document.getElementById('scene-1');
    if (firstScene) {
        // Expand the first scene if it isn't
        if (!firstScene.classList.contains('expanded')) {
            firstScene.classList.add('expanded');
        }
        
        // Scroll considering the header height
        const headerOffset = 70;
        const elementPosition = firstScene.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
}

function toggleAccordion(sceneId) {
    const element = document.getElementById(sceneId);
    if (element) {
        element.classList.toggle('expanded');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const navSceneTitle = document.getElementById('navSceneTitle');
    const scenes = document.querySelectorAll('.scene');
    const topNav = document.getElementById('topNav');

    // Hide header on initial load (hero section)
    let lastScrollY = window.scrollY;

    // Scroll Progress Logic
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = scrollTop / (docHeight - winHeight);
        const scrollPercentRounded = Math.min(100, Math.max(0, Math.round(scrollPercent * 100)));
        
        progressBar.style.width = scrollPercentRounded + '%';
        progressText.innerText = scrollPercentRounded + '%';

        // Auto-hide header when scrolling down, show when scrolling up
        // Unless we are at the very top
        if (scrollTop < 50) {
            topNav.style.transform = 'translateY(-100%)'; // Hide at very top
        } else {
            topNav.style.transform = 'translateY(0)'; // Show header
        }
        
        lastScrollY = scrollTop;
    }, { passive: true });

    // Initial check for topNav
    if (window.scrollY < 50) {
        topNav.style.transform = 'translateY(-100%)';
    }

    // Intersection Observer for Current Scene Title
    const observerOptions = {
        root: null,
        rootMargin: '-80px 0px -40% 0px', // Adjust depending on header height and typical scene length
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const title = entry.target.getAttribute('data-title');
                if (title) {
                    navSceneTitle.innerText = title;
                }
            }
        });
    }, observerOptions);

    scenes.forEach(scene => {
        observer.observe(scene);
        
        // Optionally start all collapsed except first one? 
        // Currently the HTML has them all 'expanded'.
        // Let's keep them expanded by default for full searchability,
        // but user can collapse them.
    });
});
