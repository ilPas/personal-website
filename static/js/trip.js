document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme toggle first
    initThemeToggle();
    
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
 * Initialize theme toggle functionality
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-toggle__icon');
    
    // Get current theme from data attribute
    let currentTheme = document.body.getAttribute('data-color-scheme') || 'dark';
    
    // Set initial icon
    updateThemeIcon(currentTheme);
    
    // Handle theme toggle click
    themeToggle.addEventListener('click', function() {
        // Toggle theme
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Update body data attribute
        document.body.setAttribute('data-color-scheme', currentTheme);
        
        // Update icon
        updateThemeIcon(currentTheme);
        
        // Add smooth transition effect
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });
    
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.textContent = '🌙';
            themeToggle.setAttribute('aria-label', 'Cambia a tema chiaro');
        } else {
            themeIcon.textContent = '☀️';
            themeToggle.setAttribute('aria-label', 'Cambia a tema scuro');
        }
    }
}

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
            closeAllAccordions();
            
            // Toggle current accordion
            if (!isExpanded) {
                this.setAttribute('aria-expanded', 'true');
                content.classList.add('expanded');
                
                // Smooth scroll to the opened accordion with offset for sticky nav
                setTimeout(() => {
                    const navHeight = document.querySelector('.nav-sticky').offsetHeight;
                    const headerTop = this.getBoundingClientRect().top + window.pageYOffset;
                    const scrollPosition = headerTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: scrollPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            }
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
                const targetTop = targetSection.getBoundingClientRect().top + window.pageYOffset;
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
        const scrollPosition = window.pageYOffset + navHeight + 50;
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

/**
 * Intersection Observer for better scroll performance and animations
 */
function initIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px -10% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);
    
    // Observe all day sections
    const sections = document.querySelectorAll('.day-section');
    sections.forEach(section => observer.observe(section));
    
    // Observe info cards for subtle animations
    const cards = document.querySelectorAll('.info-card');
    cards.forEach(card => observer.observe(card));
}

// Initialize intersection observer if supported
if ('IntersectionObserver' in window) {
    initIntersectionObserver();
}

/**
 * Handle window resize events
 */
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Re-initialize scroll spy after resize
        initScrollSpy();
    }, 250);
});

/**
 * Add loading states and error handling for external links
 */
function enhanceExternalLinks() {
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    
    externalLinks.forEach(link => {
        // Add click tracking for analytics (if needed)
        link.addEventListener('click', function(e) {
            // You can add analytics tracking here if needed
            console.log('External link clicked:', this.href);
        });
    });
}

// Enhance external links after DOM is loaded
enhanceExternalLinks();

/**
 * Add smooth reveal animations for better UX
 */
function addRevealAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        .day-section {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease-out;
        }
        
        .day-section.in-view {
            opacity: 1;
            transform: translateY(0);
        }
        
        .info-card {
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.4s ease-out;
        }
        
        .info-card.in-view {
            opacity: 1;
            transform: translateY(0);
        }
        
        .touch-device .btn.touch-active,
        .touch-device .nav-btn.touch-active,
        .touch-device .theme-toggle.touch-active {
            transform: scale(0.98);
            opacity: 0.8;
        }
        
        .external-icon {
            display: inline-block;
            margin-left: 4px;
            opacity: 0.6;
            font-size: 0.8em;
        }
        
        @media (prefers-reduced-motion: reduce) {
            .day-section,
            .info-card {
                opacity: 1;
                transform: none;
                transition: none;
            }
        }
    `;
    document.head.appendChild(style);
}

// Add reveal animations
addRevealAnimations();

/**
 * Performance optimization: Lazy load content that's not immediately visible
 */
function optimizePerformance() {
    // Defer non-critical operations
    setTimeout(() => {
        // Add subtle hover effects
        const cards = document.querySelectorAll('.info-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = 'var(--shadow-md)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '';
            });
        });
    }, 1000);
}

// Optimize performance after initial load
optimizePerformance();

/**
 * Enhanced mobile experience optimizations
 */
function initMobileOptimizations() {
    // Detect if user is on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.body.classList.add('mobile-device');
        
        // Optimize accordion animations for mobile
        const style = document.createElement('style');
        style.textContent = `
            .mobile-device .accordion__content {
                transition: max-height 0.3s ease-out;
            }
            
            .mobile-device .schedule-item {
                grid-template-columns: 1fr;
                text-align: left;
            }
            
            .mobile-device .time {
                margin-bottom: 4px;
                text-align: left;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize mobile optimizations
initMobileOptimizations();

/**
 * Add PWA-like features for better mobile experience
 */
function initPWAFeatures() {
    // Add theme color for mobile browsers based on current theme
    function updateThemeColor() {
        const currentTheme = document.body.getAttribute('data-color-scheme');
        let themeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!themeColor) {
            themeColor = document.createElement('meta');
            themeColor.name = 'theme-color';
            document.head.appendChild(themeColor);
        }
        
        // Update theme color based on current theme
        if (currentTheme === 'dark') {
            themeColor.content = '#1f2121'; // charcoal-700
        } else {
            themeColor.content = '#32808d'; // teal-500
        }
    }
    
    // Initial theme color update
    updateThemeColor();
    
    // Listen for theme changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-color-scheme') {
                updateThemeColor();
            }
        });
    });
    
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['data-color-scheme']
    });
    
    // Add apple-mobile-web-app-capable for iOS
    if (!document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
        const appleCapable = document.createElement('meta');
        appleCapable.name = 'apple-mobile-web-app-capable';
        appleCapable.content = 'yes';
        document.head.appendChild(appleCapable);
    }
}

// Initialize PWA features
initPWAFeatures();

/**
 * Add search functionality (basic implementation)
 */
function initSearchFunctionality() {
    // This could be expanded to add a search feature
    // For now, we'll just add keyboard shortcuts for navigation
    
    document.addEventListener('keydown', function(e) {
        // Alt + number keys to jump to specific days
        if (e.altKey && e.key >= '1' && e.key <= '9') {
            e.preventDefault();
            const dayNumber = e.key;
            let targetId;
            
            if (dayNumber <= '4') {
                targetId = 'giorni-1-4';
            } else {
                targetId = `giorno-${dayNumber}`;
            }
            
            const targetBtn = document.querySelector(`[data-target="${targetId}"]`);
            if (targetBtn) {
                targetBtn.click();
            }
        }
        
        // 'h' key to scroll to top (home)
        if (e.key === 'h' && !e.ctrlKey && !e.altKey && !e.metaKey) {
            const activeElement = document.activeElement;
            // Only if not typing in an input field
            if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    });
}

// Initialize search functionality
initSearchFunctionality();

/**
 * Performance monitoring and optimization
 */
function initPerformanceMonitoring() {
    // Basic performance logging
    window.addEventListener('load', function() {
        setTimeout(() => {
            if (performance && performance.getEntriesByType) {
                const navigationEntries = performance.getEntriesByType('navigation');
                if (navigationEntries.length > 0) {
                    const navEntry = navigationEntries[0];
                    console.log('Page load time:', navEntry.loadEventEnd - navEntry.fetchStart, 'ms');
                }
            }
        }, 1000);
    });
}

// Initialize performance monitoring
initPerformanceMonitoring();

/**
 * Add contextual help or tips
 */
function initContextualHelp() {
    // Add keyboard shortcuts info - simplified version without localStorage
    const helpStyle = document.createElement('style');
    helpStyle.textContent = `
        .keyboard-help {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-base);
            padding: var(--space-12);
            font-size: var(--font-size-sm);
            color: var(--color-text-secondary);
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            pointer-events: none;
            z-index: 1000;
            max-width: 200px;
        }
        
        .keyboard-help.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .keyboard-help h4 {
            margin: 0 0 8px 0;
            font-size: var(--font-size-sm);
            color: var(--color-text);
        }
        
        .keyboard-help ul {
            margin: 0;
            padding: 0;
            list-style: none;
        }
        
        .keyboard-help li {
            margin-bottom: 4px;
            font-size: var(--font-size-xs);
        }
        
        .keyboard-help kbd {
            background: var(--color-secondary);
            padding: 2px 6px;
            border-radius: 3px;
            font-family: monospace;
            font-size: 10px;
        }
    `;
    document.head.appendChild(helpStyle);
    
    // Show help on first visit (without localStorage, just show once per session)
    let helpShown = false;
    if (!helpShown) {
        setTimeout(() => {
            const helpDiv = document.createElement('div');
            helpDiv.className = 'keyboard-help';
            helpDiv.innerHTML = `
                <h4>Scorciatoie</h4>
                <ul>
                    <li><kbd>Alt</kbd>+<kbd>1-9</kbd> Vai al giorno</li>
                    <li><kbd>T</kbd> Cambia tema</li>
                    <li><kbd>H</kbd> Torna su</li>
                    <li><kbd>Esc</kbd> Chiudi tutto</li>
                </ul>
            `;
            document.body.appendChild(helpDiv);
            
            setTimeout(() => helpDiv.classList.add('show'), 100);
            
            setTimeout(() => {
                helpDiv.classList.remove('show');
                setTimeout(() => helpDiv.remove(), 300);
                helpShown = true;
            }, 4000);
        }, 2000);
    }
}

// Initialize contextual help
initContextualHelp();

/**
 * Add error handling for failed operations
 */
window.addEventListener('error', function(e) {
    console.error('JavaScript error occurred:', e.error);
    // You could send this to an error reporting service
});

/**
 * Final initialization and cleanup
 */
function finalInit() {
    // Remove loading states if any
    document.body.classList.remove('loading');
    
    // Add loaded class for any CSS that needs it
    document.body.classList.add('loaded');
    
    // Trigger any final animations
    setTimeout(() => {
        const sections = document.querySelectorAll('.day-section');
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.classList.add('in-view');
            }, index * 100);
        });
    }, 500);
}

// Run final initialization
window.addEventListener('load', finalInit);
