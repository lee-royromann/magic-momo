/**
 * Magic Momo Foodtruck - JavaScript
 * Mobile Navigation, Smooth Scrolling, Active Section Highlighting
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ========================================
    // Mobile Menu Toggle
    // ========================================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.header');

    const setMobileMenuState = (isOpen) => {
        if (!mobileMenuToggle || !navMenu) {
            return;
        }

        navMenu.classList.toggle('active', isOpen);
        mobileMenuToggle.classList.toggle('active', isOpen);
        mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
    };

    if (mobileMenuToggle && navMenu) {
        setMobileMenuState(false);

        mobileMenuToggle.addEventListener('click', () => {
            setMobileMenuState(!navMenu.classList.contains('active'));
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                setMobileMenuState(false);
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                setMobileMenuState(false);
            }
        });
    }

    const scrollToTarget = (target) => {
        const headerOffset = header ? header.offsetHeight : 0;
        const targetPosition = Math.max(
            target.getBoundingClientRect().top + window.scrollY - headerOffset,
            0
        );

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    };

    // ========================================
    // Smooth Scrolling (nur für Anker-Links)
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            // Nur bei echten Ankern (nicht nur "#")
            if (targetId && targetId.length > 1) {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    scrollToTarget(target);

                    // Mobile-Menu schließen nach Klick
                    if (navMenu && mobileMenuToggle) {
                        setMobileMenuState(false);
                    }
                }
            }
        });
    });

    // ========================================
    // Active Section Highlighting (Startseite)
    // ========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length > 0 && navLinks.length > 0) {
        const highlightActiveSection = () => {
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - 100) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href && href.substring(1) === current) {
                    link.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', highlightActiveSection);
        // Initial ausführen
        highlightActiveSection();
    }
});
