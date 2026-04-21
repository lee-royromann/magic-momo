'use strict';

let siteElements = null;

/**
 * Initialisiert alle Interaktionen nach dem Laden des DOM.
 * @returns {void}
 */
function initialiseSite() {
    siteElements = getSiteElements();
    initialiseMobileMenu();
    initialiseSmoothScrolling();
    initialiseSectionHighlight();
}

/**
 * Sammelt die benoetigten DOM-Referenzen.
 * @returns {{mobileMenuToggle: Element|null, navMenu: Element|null, header: Element|null, sections: NodeListOf<HTMLElement>, navLinks: NodeListOf<HTMLElement>}}
 */
function getSiteElements() {
    return {
        mobileMenuToggle: document.querySelector('.mobile-menu-toggle'),
        navMenu: document.querySelector('.nav-menu'),
        header: document.querySelector('.header'),
        sections: document.querySelectorAll('section[id]'),
        navLinks: document.querySelectorAll('.nav-link')
    };
}

/**
 * Richtet das mobile Menu ein.
 * @returns {void}
 */
function initialiseMobileMenu() {
    if (!hasMobileMenu()) {
        return;
    }

    setMobileMenuState(false);
    siteElements.mobileMenuToggle.addEventListener('click', handleMenuToggleClick);
    document.addEventListener('keydown', handleDocumentKeydown);
    window.addEventListener('resize', handleWindowResize);
}

/**
 * Prueft, ob die mobilen Navigationselemente vorhanden sind.
 * @returns {boolean}
 */
function hasMobileMenu() {
    return Boolean(siteElements.mobileMenuToggle && siteElements.navMenu);
}

/**
 * Setzt den sichtbaren Zustand des mobilen Menus.
 * @param {boolean} isOpen Gibt an, ob das Menu geoeffnet ist.
 * @returns {void}
 */
function setMobileMenuState(isOpen) {
    if (!hasMobileMenu()) {
        return;
    }

    siteElements.navMenu.classList.toggle('active', isOpen);
    siteElements.mobileMenuToggle.classList.toggle('active', isOpen);
    siteElements.mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
}

/**
 * Schaltet das mobile Menu per Button um.
 * @returns {void}
 */
function handleMenuToggleClick() {
    const isOpen = siteElements.navMenu.classList.contains('active');
    setMobileMenuState(!isOpen);
}

/**
 * Schliesst das mobile Menu mit Escape.
 * @param {KeyboardEvent} event Das ausgeloeste Tastaturereignis.
 * @returns {void}
 */
function handleDocumentKeydown(event) {
    if (event.key !== 'Escape') {
        return;
    }

    setMobileMenuState(false);
}

/**
 * Schliesst das mobile Menu bei Desktop-Breite.
 * @returns {void}
 */
function handleWindowResize() {
    if (window.innerWidth <= 768) {
        return;
    }

    setMobileMenuState(false);
}

/**
 * Aktiviert sanftes Scrollen fuer interne Anker.
 * @returns {void}
 */
function initialiseSmoothScrolling() {
    document.addEventListener('click', handleAnchorNavigation);
}

/**
 * Behandelt Klicks auf interne Ankerlinks.
 * @param {MouseEvent} event Das ausgeloeste Klickereignis.
 * @returns {void}
 */
function handleAnchorNavigation(event) {
    const anchor = getAnchorLink(event);
    const target = getAnchorTarget(anchor);
    if (!target) {
        return;
    }

    event.preventDefault();
    scrollToTarget(target);
    setMobileMenuState(false);
}

/**
 * Ermittelt einen gueltigen internen Ankerlink aus dem Klickziel.
 * @param {MouseEvent} event Das ausgeloeste Klickereignis.
 * @returns {HTMLAnchorElement|null}
 */
function getAnchorLink(event) {
    if (!(event.target instanceof Element)) {
        return null;
    }

    const anchor = event.target.closest('a[href^="#"]');
    return isValidAnchor(anchor) ? anchor : null;
}

/**
 * Prueft, ob ein Ankerlink ein echtes Ziel referenziert.
 * @param {HTMLAnchorElement|null} anchor Der gefundene Link.
 * @returns {boolean}
 */
function isValidAnchor(anchor) {
    return Boolean(anchor && anchor.getAttribute('href')?.length > 1);
}

/**
 * Findet das DOM-Ziel zu einem internen Link.
 * @param {HTMLAnchorElement|null} anchor Der ausgewaehlte Link.
 * @returns {Element|null}
 */
function getAnchorTarget(anchor) {
    if (!anchor) {
        return null;
    }

    return document.querySelector(anchor.getAttribute('href'));
}

/**
 * Scrollt mit Header-Offset zu einem Zielbereich.
 * @param {Element} target Das Ziel-Element.
 * @returns {void}
 */
function scrollToTarget(target) {
    window.scrollTo({
        top: getTargetPosition(target),
        behavior: 'smooth'
    });
}

/**
 * Berechnet die vertikale Zielposition fuer das Scrollen.
 * @param {Element} target Das Ziel-Element.
 * @returns {number}
 */
function getTargetPosition(target) {
    const headerOffset = siteElements.header ? siteElements.header.offsetHeight : 0;
    const position = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    return Math.max(position, 0);
}

/**
 * Aktiviert das Highlighting der aktiven Sektion.
 * @returns {void}
 */
function initialiseSectionHighlight() {
    if (!hasHighlightTargets()) {
        return;
    }

    window.addEventListener('scroll', highlightActiveSection);
    highlightActiveSection();
}

/**
 * Prueft, ob Sektionen und Navigationslinks vorhanden sind.
 * @returns {boolean}
 */
function hasHighlightTargets() {
    return Boolean(siteElements.sections.length && siteElements.navLinks.length);
}

/**
 * Markiert den aktuell sichtbaren Navigationslink.
 * @returns {void}
 */
function highlightActiveSection() {
    const currentSectionId = getCurrentSectionId();
    for (const link of siteElements.navLinks) {
        updateActiveLink(link, currentSectionId);
    }
}

/**
 * Ermittelt die aktuell sichtbare Sektions-ID.
 * @returns {string}
 */
function getCurrentSectionId() {
    let currentSectionId = '';
    for (const section of siteElements.sections) {
        currentSectionId = getVisibleSectionId(section, currentSectionId);
    }

    return currentSectionId;
}

/**
 * Aktualisiert die sichtbare Sektions-ID anhand der Scrollposition.
 * @param {HTMLElement} section Die gepruefte Sektion.
 * @param {string} currentSectionId Die bisher aktive ID.
 * @returns {string}
 */
function getVisibleSectionId(section, currentSectionId) {
    if (window.scrollY < section.offsetTop - 100) {
        return currentSectionId;
    }

    return section.getAttribute('id') || currentSectionId;
}

/**
 * Setzt den Aktivstatus fuer einen Navigationslink.
 * @param {HTMLElement} link Der zu aktualisierende Link.
 * @param {string} currentSectionId Die aktive Sektions-ID.
 * @returns {void}
 */
function updateActiveLink(link, currentSectionId) {
    link.classList.toggle('active', isMatchingSectionLink(link, currentSectionId));
}

/**
 * Prueft, ob ein Link zur aktiven Sektion gehoert.
 * @param {HTMLElement} link Der zu pruefende Link.
 * @param {string} currentSectionId Die aktive Sektions-ID.
 * @returns {boolean}
 */
function isMatchingSectionLink(link, currentSectionId) {
    const href = link.getAttribute('href');
    return Boolean(href && href.substring(1) === currentSectionId);
}

document.addEventListener('DOMContentLoaded', initialiseSite);
