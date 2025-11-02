document.addEventListener('DOMContentLoaded', function() {
    // Fix external links first, before other initializations
    fixExternalLinks();
    
    // Initialize accordion functionality
    initAccordions();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize scroll spy for active navigation highlighting
    initScrollSpy();
});

/**
 * Fix external links to ensure they all open in new tabs
 */
function fixExternalLinks() {
    // Get all links that start with http or https
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    
    externalLinks.forEach(link => {
        // Ensure target="_blank" and proper security attributes
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        
        // Add visual indicator for external links
        if (!link.querySelector('.external-icon')) {
            const icon = document.createElement('span');
            icon.className = 'external-icon';
            icon.innerHTML = ' ↗';
            icon.style.opacity = '0.6';
            icon.style.fontSize = '0.8em';
            icon.style.marginLeft = '4px';
            link.appendChild(icon);
        }
    });
    
    // Also handle any dynamically created links
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href^="http"]');
        if (link) {
            // Ensure the link has proper attributes
            if (!link.hasAttribute('target') || link.getAttribute('target') !== '_blank') {
                e.preventDefault();
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
                // Trigger click again with proper attributes
                setTimeout(() => {
                    link.click();
                }, 0);
            }
        }
    });
}

/**
 * Initialize accordion functionality
 */
function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion__header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const content = this.nextElementSibling;
            
            // Close all other accordions first
            // closeAllAccordions(); // Disabilitato per permettere più sezioni aperte
            
            // Toggle current accordion
            // if (!isExpanded) { // Permette di chiudere cliccando di nuovo
                this.setAttribute('aria-expanded', 'true');
                content.classList.add('expanded');
                
                // Smooth scroll to the opened accordion with offset for sticky nav
                setTimeout(() => {
                    const navHeight = document.querySelector('.nav-sticky').offsetHeight;
                    const headerTop = this.getBoundingClientRect().top + window.scrollY;
                    const scrollPosition = headerTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: scrollPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            // }
        });
    });
}

/**
 * Close all accordions
 */
function closeAllAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion__header');
    const accordionContents = document.querySelectorAll('.accordion__content');
    
    accordionHeaders.forEach(header => {
        header.setAttribute('aria-expanded', 'false');
    });
    
    accordionContents.forEach(content => {
        content.classList.remove('expanded');
    });
}

/**
 * Initialize navigation functionality
 */
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Remove active class from all buttons
                navButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get the nav height for offset
                const navHeight = document.querySelector('.nav-sticky').offsetHeight;
                const targetTop = targetSection.getBoundingClientRect().top + window.scrollY;
                const scrollPosition = targetTop - navHeight - 20;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth'
                });
                
                // Open the accordion for the target section
                setTimeout(() => {
                    const accordion = targetSection.querySelector('.accordion__header');
                    if (accordion && accordion.getAttribute('aria-expanded') !== 'true') {
                        accordion.click();
                    }
                }, 500);
            }
        });
    });
}

/**
 * Initialize scroll spy for active navigation highlighting
 */
function initScrollSpy() {
    const sections = document.querySelectorAll('.day-section');
    const navButtons = document.querySelectorAll('.nav-btn');
    const navHeight = document.querySelector('.nav-sticky').offsetHeight;
    
    // Throttled scroll handler for better performance
    let ticking = false;
    
    function updateActiveNav() {
        const scrollPosition = window.scrollY + navHeight + 50;
        let activeSection = null;
        
        // Find the currently visible section
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                activeSection = section;
            }
        });
        
        // Update active navigation button
        if (activeSection) {
            const activeId = activeSection.id;
            
            navButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-target') === activeId) {
                    btn.classList.add('active');
                    
                    // Scroll the nav button into view if needed
                    scrollNavButtonIntoView(btn);
                }
            });
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateActiveNav);
            ticking = true;
        }
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', requestTick);
    
    // Initial call to set active nav on page load
    updateActiveNav();
}

/**
 * Scroll navigation button into view if it's outside the visible area
 */
function scrollNavButtonIntoView(button) {
    const navScroll = document.querySelector('.nav-scroll');
    const buttonLeft = button.offsetLeft;
    const buttonWidth = button.offsetWidth;
    const scrollLeft = navScroll.scrollLeft;
    const scrollWidth = navScroll.clientWidth;
    
    // Check if button is outside the visible area
    if (buttonLeft < scrollLeft) {
        // Scroll left to show the button
        navScroll.scrollTo({
            left: buttonLeft - 20,
            behavior: 'smooth'
        });
    } else if (buttonLeft + buttonWidth > scrollLeft + scrollWidth) {
        // Scroll right to show the button
        navScroll.scrollTo({
            left: buttonLeft + buttonWidth - scrollWidth + 20,
            behavior: 'smooth'
        });
    }
}

/**
 * Add touch-friendly interactions for mobile devices
 */
if ('ontouchstart' in window) {
    // Add touch class for styling adjustments
    document.body.classList.add('touch-device');
    
    // Improve button interactions on touch devices
    const buttons = document.querySelectorAll('.btn, .nav-btn, .accordion__header, .theme-toggle');
    
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        button.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 150);
        });
    });
}

/**
 * Keyboard accessibility improvements
 */
document.addEventListener('keydown', function(e) {
    // Handle Enter and Space keys for accordion headers
    if (e.target.classList.contains('accordion__header')) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.target.click();
        }
    }
    
    // Handle Enter and Space keys for nav buttons
    if (e.target.classList.contains('nav-btn')) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.target.click();
        }
    }
    
    // Handle Enter and Space keys for theme toggle
    if (e.target.id === 'theme-toggle') {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.target.click();
        }
    }
    
    // Handle Escape key to close all accordions
    if (e.key === 'Escape') {
        closeAllAccordions();
    }
    
    // 'T' key to toggle theme
    if (e.key === 't' || e.key === 'T') {
        const activeElement = document.activeElement;
        // Only if not typing in an input field
        if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            document.getElementById('theme-toggle').click();
        }
    }
});
