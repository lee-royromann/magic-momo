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
    initialiseFahrplan();
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

const FAHRPLAN_URL = 'data/fahrplan.json';
const WOCHENTAGE = [
    { key: 'so', name: 'Sonntag' },
    { key: 'mo', name: 'Montag' },
    { key: 'di', name: 'Dienstag' },
    { key: 'mi', name: 'Mittwoch' },
    { key: 'do', name: 'Donnerstag' },
    { key: 'fr', name: 'Freitag' },
    { key: 'sa', name: 'Samstag' }
];

/**
 * Laedt den Fahrplan und fuellt Heute-Zeile und Wochentafel.
 * Ohne Daten bleiben die statischen Zeiten im HTML stehen.
 * @returns {void}
 */
function initialiseFahrplan() {
    const liste = document.querySelector('[data-fahrplan-liste]');
    const heute = document.querySelector('[data-fahrplan-heute]');
    if (!liste && !heute) {
        return;
    }

    fetch(FAHRPLAN_URL, { cache: 'no-cache' })
        .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
        .then((daten) => renderFahrplan(daten, liste, heute))
        .catch(() => {});
}

/**
 * Rendert alle Fahrplan-Elemente fuer den aktuellen Zeitpunkt.
 * @param {Object} daten Inhalt von fahrplan.json.
 * @param {HTMLElement|null} liste Liste der Wochentafel.
 * @param {HTMLElement|null} heute Heute-Zeile im Hero.
 * @returns {void}
 */
function renderFahrplan(daten, liste, heute) {
    const jetzt = getZuercherZeit();
    if (liste) {
        renderWochentafel(daten, jetzt, liste);
    }
    if (heute) {
        renderHeuteZeile(daten, jetzt, heute);
    }
    updateKurzfristigLink(daten);
    if (daten.beispiel) {
        markiereBeispiel(liste, heute);
    }
}

/**
 * Ermittelt den Zeitpunkt in Zuercher Zeit.
 * Mit ?jetzt=2026-11-03T12:30 laesst sich ein Zeitpunkt simulieren.
 * @returns {{jahr: number, monat: number, tag: number, datum: string, wochentag: number, minuten: number}}
 */
function getZuercherZeit() {
    const simuliert = new URLSearchParams(window.location.search).get('jetzt');
    const teile = parseSimulierteZeit(simuliert) || getZeitteile(new Date());
    return createZeitpunkt(teile.jahr, teile.monat, teile.tag, teile.stunde * 60 + teile.minute);
}

/**
 * Liest Datum und Uhrzeit in der Zeitzone Europe/Zurich.
 * @param {Date} date Der aktuelle Zeitpunkt.
 * @returns {{jahr: number, monat: number, tag: number, stunde: number, minute: number}}
 */
function getZeitteile(date) {
    const format = new Intl.DateTimeFormat('de-CH', {
        timeZone: 'Europe/Zurich',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h23'
    });
    const teile = {};
    for (const teil of format.formatToParts(date)) {
        teile[teil.type] = Number(teil.value);
    }

    return { jahr: teile.year, monat: teile.month, tag: teile.day, stunde: teile.hour, minute: teile.minute };
}

/**
 * Wandelt den Testparameter in Zeitteile um.
 * @param {string|null} text Wert von ?jetzt, zum Beispiel 2026-11-03T12:30.
 * @returns {{jahr: number, monat: number, tag: number, stunde: number, minute: number}|null}
 */
function parseSimulierteZeit(text) {
    const treffer = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/.exec(text || '');
    if (!treffer) {
        return null;
    }

    return {
        jahr: Number(treffer[1]),
        monat: Number(treffer[2]),
        tag: Number(treffer[3]),
        stunde: Number(treffer[4] || 0),
        minute: Number(treffer[5] || 0)
    };
}

/**
 * Erstellt einen Zeitpunkt mit Datum, Wochentag und Minuten seit Mitternacht.
 * @param {number} jahr Jahr.
 * @param {number} monat Monat von 1 bis 12.
 * @param {number} tag Tag im Monat, darf ueberlaufen.
 * @param {number} minuten Minuten seit Mitternacht.
 * @returns {{jahr: number, monat: number, tag: number, datum: string, wochentag: number, minuten: number}}
 */
function createZeitpunkt(jahr, monat, tag, minuten) {
    const date = new Date(Date.UTC(jahr, monat - 1, tag));
    return {
        jahr: date.getUTCFullYear(),
        monat: date.getUTCMonth() + 1,
        tag: date.getUTCDate(),
        datum: date.toISOString().slice(0, 10),
        wochentag: date.getUTCDay(),
        minuten
    };
}

/**
 * Verschiebt einen Zeitpunkt um ganze Tage, Uhrzeit Mitternacht.
 * @param {Object} zeitpunkt Ausgangspunkt.
 * @param {number} tage Anzahl Tage, auch negativ.
 * @returns {Object}
 */
function addTage(zeitpunkt, tage) {
    return createZeitpunkt(zeitpunkt.jahr, zeitpunkt.monat, zeitpunkt.tag + tage, 0);
}

/**
 * Liefert die Einsaetze eines Tages, Ausnahmen haben Vorrang vor dem Wochenplan.
 * @param {Object} daten Inhalt von fahrplan.json.
 * @param {Object} zeitpunkt Der gesuchte Tag.
 * @returns {{ausfall: boolean, einsaetze: Array<{von: string, bis: string, platz: string}>}}
 */
function getEinsaetze(daten, zeitpunkt) {
    const ausnahmen = (daten.ausnahmen || []).filter((ausnahme) => ausnahme.datum === zeitpunkt.datum);
    if (ausnahmen.some((ausnahme) => ausnahme.ausfall)) {
        return { ausfall: true, einsaetze: [] };
    }
    if (ausnahmen.length) {
        return { ausfall: false, einsaetze: ausnahmen };
    }

    const woche = daten.woche || {};
    return { ausfall: false, einsaetze: woche[WOCHENTAGE[zeitpunkt.wochentag].key] || [] };
}

/**
 * Rendert die Tafel fuer die aktuelle Woche von Montag bis Sonntag.
 * @param {Object} daten Inhalt von fahrplan.json.
 * @param {Object} jetzt Aktueller Zeitpunkt.
 * @param {HTMLElement} liste Ziel-Liste.
 * @returns {void}
 */
function renderWochentafel(daten, jetzt, liste) {
    const montag = addTage(jetzt, -((jetzt.wochentag + 6) % 7));
    const zeilen = [];
    for (let index = 0; index < 7; index++) {
        zeilen.push(...createTagesZeilen(daten, addTage(montag, index), jetzt));
    }

    liste.replaceChildren(...zeilen);
}

/**
 * Erstellt die Zeilen eines Tages, bei Mittag und Abend zwei Zeilen.
 * @param {Object} daten Inhalt von fahrplan.json.
 * @param {Object} tag Der darzustellende Tag.
 * @param {Object} jetzt Aktueller Zeitpunkt.
 * @returns {HTMLLIElement[]}
 */
function createTagesZeilen(daten, tag, jetzt) {
    const name = WOCHENTAGE[tag.wochentag].name;
    const istHeute = tag.datum === jetzt.datum;
    const plan = getEinsaetze(daten, tag);
    if (plan.ausfall) {
        return [createZeile(name, istHeute, 'is-cancelled', 'Fällt aus', '')];
    }
    if (!plan.einsaetze.length) {
        return [createZeile(name, istHeute, 'is-free', daten.ohneEinsatz || 'Kein Standplatz', '')];
    }

    return plan.einsaetze.map((einsatz, index) => createZeile(index === 0 ? name : '', istHeute, '', createOrt(daten, einsatz), formatZeitraum(einsatz)));
}

/**
 * Erstellt eine Zeile der Wochentafel.
 * @param {string} tagName Name des Wochentags oder leer fuer Folgezeilen.
 * @param {boolean} istHeute Markiert die Zeile von heute.
 * @param {string} zustand Zusaetzliche Klasse wie is-free.
 * @param {Node|string} ort Inhalt der Ortsspalte.
 * @param {string} zeit Zeitraum als Text.
 * @returns {HTMLLIElement}
 */
function createZeile(tagName, istHeute, zustand, ort, zeit) {
    const zeile = document.createElement('li');
    zeile.className = 'fahrplan-row';
    if (zustand) {
        zeile.classList.add(zustand);
    }
    if (istHeute) {
        zeile.classList.add('is-today');
        zeile.setAttribute('aria-current', 'date');
    }

    zeile.append(createSpan('fahrplan-day', tagName), createSpan('fahrplan-place', ort), createSpan('fahrplan-time', zeit));
    return zeile;
}

/**
 * Erstellt ein span-Element mit Klasse und Inhalt.
 * @param {string} klasse CSS-Klasse.
 * @param {Node|string} inhalt Text oder Knoten.
 * @returns {HTMLSpanElement}
 */
function createSpan(klasse, inhalt) {
    const span = document.createElement('span');
    span.className = klasse;
    span.append(inhalt);
    return span;
}

/**
 * Erstellt Ortsname, Wegbeschreibung und Routenlink eines Einsatzes.
 * @param {Object} daten Inhalt von fahrplan.json.
 * @param {{platz: string}} einsatz Der Einsatz.
 * @returns {DocumentFragment|string}
 */
function createOrt(daten, einsatz) {
    const platz = getPlatz(daten, einsatz);
    if (!platz) {
        return einsatz.platz || '';
    }

    const fragment = document.createDocumentFragment();
    const name = document.createElement('strong');
    name.textContent = platz.name;
    fragment.append(name);
    if (platz.hinweis) {
        const hinweis = document.createElement('span');
        hinweis.textContent = platz.hinweis;
        fragment.append(hinweis);
    }
    const route = createRouteLink(platz);
    if (route) {
        fragment.append(route);
    }

    return fragment;
}

/**
 * Sucht den Platz eines Einsatzes.
 * @param {Object} daten Inhalt von fahrplan.json.
 * @param {{platz: string}} einsatz Der Einsatz.
 * @returns {{name: string, hinweis?: string, lat?: number, lng?: number}|null}
 */
function getPlatz(daten, einsatz) {
    return (daten.plaetze || {})[einsatz.platz] || null;
}

/**
 * Erstellt einen Routenlink zu Apple Karten oder Google Maps.
 * @param {{name: string, lat?: number, lng?: number}} platz Der Platz.
 * @returns {HTMLAnchorElement|null}
 */
function createRouteLink(platz) {
    if (typeof platz.lat !== 'number' || typeof platz.lng !== 'number') {
        return null;
    }

    const link = document.createElement('a');
    const ziel = `${platz.lat},${platz.lng}`;
    link.href = /iPhone|iPad|Macintosh/.test(navigator.userAgent)
        ? `https://maps.apple.com/?daddr=${ziel}`
        : `https://www.google.com/maps/dir/?api=1&destination=${ziel}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Route';
    link.setAttribute('aria-label', `Route nach ${platz.name}`);
    return link;
}

/**
 * Fuellt die Heute-Zeile im Hero und blendet sie ein.
 * @param {Object} daten Inhalt von fahrplan.json.
 * @param {Object} jetzt Aktueller Zeitpunkt.
 * @param {HTMLElement} element Die Heute-Zeile.
 * @returns {void}
 */
function renderHeuteZeile(daten, jetzt, element) {
    const teile = getHeuteTeile(daten, jetzt);
    if (!teile) {
        return;
    }

    element.replaceChildren(...teile);
    element.hidden = false;
}

/**
 * Formuliert den Satz zum heutigen Standort.
 * @param {Object} daten Inhalt von fahrplan.json.
 * @param {Object} jetzt Aktueller Zeitpunkt.
 * @returns {Array<Node|string>|null}
 */
function getHeuteTeile(daten, jetzt) {
    const plan = getEinsaetze(daten, jetzt);
    const laufend = plan.einsaetze.find((einsatz) => toMinuten(einsatz.von) <= jetzt.minuten && jetzt.minuten < toMinuten(einsatz.bis));
    if (laufend) {
        return ['Jetzt laut Plan in ', ...createOrtSatz(daten, laufend, `, noch bis ${formatZeit(laufend.bis)} Uhr.`)];
    }

    const spaeter = plan.einsaetze.find((einsatz) => toMinuten(einsatz.von) > jetzt.minuten);
    if (spaeter) {
        return ['Heute laut Plan in ', ...createOrtSatz(daten, spaeter, `, ${formatZeitraum(spaeter)}.`)];
    }

    const einleitung = getSchlussEinleitung(plan);
    const naechster = findNaechstenEinsatz(daten, jetzt);
    if (!naechster) {
        return einleitung ? [einleitung.trim()] : null;
    }

    const wann = naechster.abstand === 1 ? 'Morgen' : `Am ${WOCHENTAGE[naechster.tag.wochentag].name}`;
    return [einleitung, `${wann} laut Plan in `, ...createOrtSatz(daten, naechster.einsatz, `, ab ${formatZeit(naechster.einsatz.von)} Uhr.`)];
}

/**
 * Liefert den Satzanfang, wenn heute nichts mehr kommt.
 * @param {{ausfall: boolean, einsaetze: Array}} plan Plan von heute.
 * @returns {string}
 */
function getSchlussEinleitung(plan) {
    if (plan.ausfall) {
        return 'Heute fällt der Truck aus. ';
    }

    return plan.einsaetze.length ? 'Für heute ist Schluss. ' : '';
}

/**
 * Erstellt Ortsname, Satzende und Routenlink fuer die Heute-Zeile.
 * @param {Object} daten Inhalt von fahrplan.json.
 * @param {{platz: string}} einsatz Der Einsatz.
 * @param {string} satzende Text nach dem Ort.
 * @returns {Array<Node|string>}
 */
function createOrtSatz(daten, einsatz, satzende) {
    const platz = getPlatz(daten, einsatz);
    const ort = document.createElement('em');
    ort.textContent = platz ? platz.name : einsatz.platz;
    const route = platz ? createRouteLink(platz) : null;
    return route ? [ort, `${satzende} `, route] : [ort, satzende];
}

/**
 * Sucht den naechsten Einsatz in den kommenden zwei Wochen.
 * @param {Object} daten Inhalt von fahrplan.json.
 * @param {Object} jetzt Aktueller Zeitpunkt.
 * @returns {{tag: Object, einsatz: Object, abstand: number}|null}
 */
function findNaechstenEinsatz(daten, jetzt) {
    for (let abstand = 1; abstand <= 14; abstand++) {
        const tag = addTage(jetzt, abstand);
        const plan = getEinsaetze(daten, tag);
        if (plan.einsaetze.length) {
            return { tag, einsatz: plan.einsaetze[0], abstand };
        }
    }

    return null;
}

/**
 * Wandelt eine Uhrzeit wie 11:30 in Minuten seit Mitternacht um.
 * @param {string} zeit Uhrzeit im Format HH:MM.
 * @returns {number}
 */
function toMinuten(zeit) {
    const [stunde, minute] = String(zeit).split(':').map(Number);
    return stunde * 60 + (minute || 0);
}

/**
 * Formatiert eine Uhrzeit in Schweizer Schreibweise, 11:00 wird 11 und 11:30 wird 11.30.
 * @param {string} zeit Uhrzeit im Format HH:MM.
 * @returns {string}
 */
function formatZeit(zeit) {
    const [stunde, minute] = String(zeit).split(':');
    return minute && minute !== '00' ? `${Number(stunde)}.${minute}` : String(Number(stunde));
}

/**
 * Formatiert einen Einsatz als Zeitraum, zum Beispiel 11 bis 14 Uhr.
 * @param {{von: string, bis: string}} einsatz Der Einsatz.
 * @returns {string}
 */
function formatZeitraum(einsatz) {
    return `${formatZeit(einsatz.von)} bis ${formatZeit(einsatz.bis)} Uhr`;
}

/**
 * Setzt den Link fuer kurzfristige Aenderungen aus den Daten.
 * @param {{kurzfristig?: string}} daten Inhalt von fahrplan.json.
 * @returns {void}
 */
function updateKurzfristigLink(daten) {
    const link = document.querySelector('[data-fahrplan-kurzfristig]');
    if (link && daten.kurzfristig) {
        link.href = daten.kurzfristig;
    }
}

/**
 * Kennzeichnet Beispieldaten sichtbar, damit sie nicht unbemerkt live gehen.
 * @param {HTMLElement|null} liste Liste der Wochentafel.
 * @param {HTMLElement|null} heute Heute-Zeile im Hero.
 * @returns {void}
 */
function markiereBeispiel(liste, heute) {
    if (liste) {
        const hinweis = document.createElement('p');
        hinweis.className = 'fahrplan-note';
        hinweis.textContent = 'Vorschau mit Beispieldaten.';
        liste.after(hinweis);
    }
    if (heute && !heute.hidden) {
        heute.prepend('Beispiel: ');
    }
}

document.addEventListener('DOMContentLoaded', initialiseSite);
