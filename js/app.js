/**
 * NeuroEpi Suite — App Shell
 * SPA router, navigation, theme toggle, state management
 * Note: All HTML content is generated from trusted internal sources only (no user-supplied HTML).
 */

const App = (() => {
    'use strict';

    const modules = {};
    let currentModule = null;

    // Navigation structure — all data is hardcoded/trusted
    const NAV = [
        {
            title: 'STUDY DESIGN',
            items: [
                { id: 'sample-size', label: 'Sample Size', icon: '#' },
                { id: 'power-analysis', label: 'Power Analysis', icon: 'P' },
                { id: 'hypothesis-builder', label: 'Hypothesis Builder', icon: 'H' },
                { id: 'regression-helper', label: 'Regression Planning', icon: 'R' }
            ]
        },
        {
            title: 'ANALYSIS',
            items: [
                { id: 'nnt-calculator', label: 'NNT / NNH', icon: 'N' },
                { id: 'effect-size', label: 'Effect Sizes', icon: 'E' },
                { id: 'epidemiology-calcs', label: 'Epi Calculators', icon: '2' },
                { id: 'diagnostic-accuracy', label: 'Diagnostic Accuracy', icon: 'D' },
                { id: 'risk-calculators', label: 'Risk Calculators', icon: '%' },
                { id: 'survival-analysis', label: 'Survival Analysis', icon: 'S' },
                { id: 'meta-analysis', label: 'Meta-Analysis', icon: 'M' }
            ]
        },
        {
            title: 'EVIDENCE',
            items: [
                { id: 'trial-database', label: 'Trial Database', icon: 'T' },
                { id: 'critical-appraisal', label: 'Critical Appraisal', icon: 'C' }
            ]
        },
        {
            title: 'WRITING',
            items: [
                { id: 'grant-assistant', label: 'Grant Assistant', icon: 'G' }
            ]
        }
    ];

    const MOBILE_NAV = [
        { id: 'sample-size', label: 'Design', icon: '#' },
        { id: 'nnt-calculator', label: 'Analysis', icon: 'N' },
        { id: 'meta-analysis', label: 'Meta', icon: 'M' },
        { id: 'trial-database', label: 'Trials', icon: 'T' },
        { id: 'grant-assistant', label: 'Writing', icon: 'G' }
    ];

    // ============================================================
    // INITIALIZATION
    // ============================================================

    function init() {
        renderSidebar();
        renderMobileNav();
        initTheme();
        initRouter();
        window.addEventListener('resize', handleResize);
    }

    // ============================================================
    // SAFE DOM HELPERS
    // All rendered content comes from trusted internal constants.
    // ============================================================

    function setTrustedHTML(element, trustedContent) {
        // All callers only pass hardcoded/trusted template strings
        element.innerHTML = trustedContent;
    }

    // ============================================================
    // SIDEBAR
    // ============================================================

    function renderSidebar() {
        const sidebar = document.getElementById('sidebar');
        let html = '<div class="sidebar-header">'
            + '<div class="sidebar-logo">'
            + '<div class="sidebar-logo-icon">NE</div>'
            + '<div>'
            + '<div class="sidebar-logo-text">NeuroEpi Suite</div>'
            + '<div class="sidebar-logo-version">Stroke Research Toolkit v1.0</div>'
            + '</div></div></div>'
            + '<nav class="sidebar-nav">';

        NAV.forEach(group => {
            html += '<div class="sidebar-group">'
                + '<div class="sidebar-group-title">' + group.title + '</div>';
            group.items.forEach(item => {
                html += '<div class="sidebar-link" data-module="' + item.id + '" onclick="App.navigate(\'' + item.id + '\')">'
                    + '<span class="sidebar-link-icon">' + item.icon + '</span>'
                    + '<span>' + item.label + '</span>'
                    + '</div>';
            });
            html += '</div>';
        });

        html += '</nav>'
            + '<div class="sidebar-footer">'
            + '<a href="https://github.com/rizwankalani/neuroepi-suite" target="_blank" rel="noopener" style="font-size:0.75rem;color:var(--text-tertiary);">GitHub</a>'
            + '<button class="theme-toggle" onclick="App.toggleTheme()" title="Toggle theme">'
            + '<span id="theme-icon">&#9790;</span>'
            + '</button></div>';

        setTrustedHTML(sidebar, html);
    }

    function renderMobileNav() {
        const nav = document.getElementById('mobile-nav');
        let html = '<div class="mobile-nav-items">';
        MOBILE_NAV.forEach(item => {
            html += '<button class="mobile-nav-item" data-module="' + item.id + '" onclick="App.navigate(\'' + item.id + '\')">'
                + '<span class="mobile-nav-item-icon">' + item.icon + '</span>'
                + '<span>' + item.label + '</span></button>';
        });
        html += '</div>';
        setTrustedHTML(nav, html);
    }

    // ============================================================
    // THEME
    // ============================================================

    function initTheme() {
        const saved = localStorage.getItem('neuroepi_theme');
        if (saved === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            updateThemeIcon('light');
        }
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('neuroepi_theme', next);
        updateThemeIcon(next);
        if (currentModule && modules[currentModule] && modules[currentModule].onThemeChange) {
            modules[currentModule].onThemeChange();
        }
    }

    function updateThemeIcon(theme) {
        const icon = document.getElementById('theme-icon');
        if (icon) icon.textContent = theme === 'light' ? '\u2600' : '\u263E';
    }

    // ============================================================
    // ROUTER
    // ============================================================

    function initRouter() {
        window.addEventListener('hashchange', handleRoute);
        handleRoute();
    }

    function handleRoute() {
        const hash = window.location.hash.slice(1) || 'sample-size';
        navigate(hash, false);
    }

    function navigate(moduleId, pushState) {
        if (pushState === undefined) pushState = true;
        if (pushState) {
            window.location.hash = moduleId;
        }

        document.querySelectorAll('.sidebar-link').forEach(function(el) {
            el.classList.toggle('active', el.dataset.module === moduleId);
        });

        document.querySelectorAll('.mobile-nav-item').forEach(function(el) {
            el.classList.toggle('active', el.dataset.module === moduleId);
        });

        document.getElementById('sidebar').classList.remove('open');
        var overlay = document.getElementById('sidebar-overlay');
        if (overlay) overlay.classList.remove('visible');

        currentModule = moduleId;
        var content = document.getElementById('module-content');

        if (modules[moduleId] && modules[moduleId].render) {
            content.textContent = '';
            content.classList.add('animate-in');
            modules[moduleId].render(content);
            setTimeout(function() { content.classList.remove('animate-in'); }, 200);
        } else {
            var header = document.createElement('div');
            header.className = 'module-header';
            var h1 = document.createElement('h1');
            h1.textContent = moduleId.replace(/-/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
            var p = document.createElement('p');
            p.textContent = 'Loading module...';
            header.appendChild(h1);
            header.appendChild(p);
            content.textContent = '';
            content.appendChild(header);
        }

        var savedInputs = Export.loadState('inputs_' + moduleId);
        if (savedInputs) {
            setTimeout(function() {
                Object.entries(savedInputs).forEach(function(entry) {
                    var input = content.querySelector('[name="' + entry[0] + '"]');
                    if (input) input.value = entry[1];
                });
            }, 50);
        }
    }

    function registerModule(id, module) {
        modules[id] = module;
    }

    // ============================================================
    // HELPERS
    // ============================================================

    function handleResize() {
        // Responsive adjustments if needed
    }

    function openSidebar() {
        document.getElementById('sidebar').classList.add('open');
        var overlay = document.getElementById('sidebar-overlay');
        if (overlay) overlay.classList.add('visible');
    }

    function closeSidebar() {
        document.getElementById('sidebar').classList.remove('open');
        var overlay = document.getElementById('sidebar-overlay');
        if (overlay) overlay.classList.remove('visible');
    }

    function autoSaveInputs(container, moduleId) {
        container.addEventListener('input', function(e) {
            if (e.target.name) {
                var inputs = {};
                container.querySelectorAll('[name]').forEach(function(el) {
                    inputs[el.name] = el.value;
                });
                Export.saveState('inputs_' + moduleId, inputs);
            }
        });
    }

    function createModuleLayout(title, description) {
        return '<div class="module-header">'
            + '<h1>' + title + '</h1>'
            + '<p>' + description + '</p></div>';
    }

    function tooltip(text) {
        return '<span class="tooltip-trigger" tabindex="0">i<span class="tooltip-content">' + text + '</span></span>';
    }

    // ============================================================
    // PUBLIC API
    // ============================================================

    return {
        init: init,
        navigate: navigate,
        registerModule: registerModule,
        toggleTheme: toggleTheme,
        openSidebar: openSidebar,
        closeSidebar: closeSidebar,
        autoSaveInputs: autoSaveInputs,
        createModuleLayout: createModuleLayout,
        tooltip: tooltip,
        setTrustedHTML: setTrustedHTML,
        NAV: NAV,
        get currentModule() { return currentModule; }
    };
})();

document.addEventListener('DOMContentLoaded', function() { App.init(); });
