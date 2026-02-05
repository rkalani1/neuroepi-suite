/**
 * NeuroEpi Suite — Trial Database Module
 * Searchable database of 80+ major stroke trials with real published data
 */

(function() {
    'use strict';

    const MODULE_ID = 'trial-database';
    var activeFilters = new Set();
    var compareMode = false;
    var selectedTrials = new Set();
    var searchTerm = '';

    const CATEGORIES = [
        { id: 'thrombolysis', label: 'Thrombolysis' },
        { id: 'thrombectomy', label: 'Thrombectomy' },
        { id: 'ich', label: 'ICH' },
        { id: 'sah', label: 'SAH' },
        { id: 'antiplatelet', label: 'Antiplatelets' },
        { id: 'anticoagulation', label: 'Anticoagulation' },
        { id: 'pfo', label: 'PFO Closure' },
        { id: 'secondary-prevention', label: 'Secondary Prevention' },
        { id: 'carotid', label: 'Carotid' },
        { id: 'decompressive', label: 'Decompressive Surgery' },
        { id: 'neuroprotection', label: 'Neuroprotection' },
        { id: 'other', label: 'Other' }
    ];

    function render(container) {
        var html = App.createModuleLayout(
            'Stroke Trial Database',
            'Comprehensive database of landmark stroke trials with verified data. Search, filter, compare, and generate citation text for grants and manuscripts.'
        );

        // Search and filters
        html += '<div class="card">';
        html += '<div class="search-box"><input type="text" id="td-search" placeholder="Search trials by name, intervention, population..." oninput="TrialDB.search(this.value)"></div>';

        html += '<div class="filter-tags" id="td-filters">';
        CATEGORIES.forEach(function(cat) {
            html += '<button class="filter-tag" data-cat="' + cat.id + '" onclick="TrialDB.toggleFilter(\'' + cat.id + '\')">' + cat.label + '</button>';
        });
        html += '</div>';

        html += '<div class="flex justify-between items-center mb-2">'
            + '<div class="text-secondary" style="font-size:0.8rem" id="td-count">Showing all trials</div>'
            + '<div class="btn-group">'
            + '<button class="btn btn-xs btn-secondary" id="td-compare-btn" onclick="TrialDB.toggleCompare()">Compare Mode</button>'
            + '<button class="btn btn-xs btn-secondary hidden" id="td-compare-action" onclick="TrialDB.showComparison()">Compare Selected</button>'
            + '</div></div>';

        html += '<div id="td-trials"></div>';
        html += '</div>';

        // Comparison panel
        html += '<div class="card hidden" id="td-comparison">';
        html += '<div class="card-title">Trial Comparison</div>';
        html += '<div id="td-comparison-content"></div>';
        html += '</div>';

        App.setTrustedHTML(container, html);
        renderTrials();
    }

    function getFilteredTrials() {
        if (typeof TrialDatabase === 'undefined' || !TrialDatabase.trials) return [];

        return TrialDatabase.trials.filter(function(trial) {
            // Category filter
            if (activeFilters.size > 0 && !activeFilters.has(trial.category)) return false;

            // Search filter
            if (searchTerm) {
                var term = searchTerm.toLowerCase();
                var searchable = (trial.name + ' ' + (trial.fullTitle || '') + ' ' + trial.population + ' ' + trial.intervention + ' ' + (trial.comparator || '')).toLowerCase();
                if (searchable.indexOf(term) === -1) return false;
            }

            return true;
        });
    }

    function renderTrials() {
        var trials = getFilteredTrials();
        var countEl = document.getElementById('td-count');
        if (countEl) countEl.textContent = 'Showing ' + trials.length + ' of ' + (TrialDatabase.trials ? TrialDatabase.trials.length : 0) + ' trials';

        var html = '';
        trials.forEach(function(trial) {
            var isSelected = selectedTrials.has(trial.name);
            html += '<div class="trial-card' + (isSelected ? ' expanded' : '') + '" id="trial-' + trial.name.replace(/\s/g, '-') + '" onclick="TrialDB.toggleTrial(\'' + trial.name.replace(/'/g, "\\'") + '\')">';

            if (compareMode) {
                html += '<div style="float:right"><input type="checkbox" ' + (isSelected ? 'checked' : '') + ' onclick="event.stopPropagation();TrialDB.toggleSelect(\'' + trial.name.replace(/'/g, "\\'") + '\')"></div>';
            }

            html += '<div class="trial-card-header">'
                + '<div class="trial-card-name">' + trial.name + (trial.year ? ' (' + trial.year + ')' : '') + '</div>'
                + '<div class="trial-card-year">N=' + (trial.n || '?') + '</div></div>';

            html += '<div class="trial-card-desc">' + (trial.intervention || '') + ' vs ' + (trial.comparator || '') + '</div>';

            if (trial.tags) {
                html += '<div class="trial-card-tags">';
                trial.tags.forEach(function(tag) {
                    html += '<span class="trial-tag">' + tag + '</span>';
                });
                html += '</div>';
            }

            // Expanded detail
            html += '<div class="trial-detail">';
            if (trial.fullTitle) html += '<div style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:8px"><em>' + trial.fullTitle + '</em></div>';
            html += '<table class="data-table" style="font-size:0.8rem">';
            if (trial.journal) html += '<tr><td style="width:120px;font-weight:500">Journal</td><td>' + trial.journal + (trial.pmid ? ' (PMID: ' + trial.pmid + ')' : '') + '</td></tr>';
            if (trial.design) html += '<tr><td style="font-weight:500">Design</td><td>' + trial.design + '</td></tr>';
            if (trial.population) html += '<tr><td style="font-weight:500">Population</td><td>' + trial.population + '</td></tr>';
            if (trial.primaryOutcome) {
                html += '<tr><td style="font-weight:500">Primary Outcome</td><td>' + trial.primaryOutcome.measure + '</td></tr>';
                html += '<tr><td style="font-weight:500">Result</td><td class="text-accent">'
                    + trial.primaryOutcome.result
                    + (trial.primaryOutcome.ci ? ' ' + trial.primaryOutcome.ci : '')
                    + (trial.primaryOutcome.pValue ? ', P ' + trial.primaryOutcome.pValue : '')
                    + '</td></tr>';
            }
            if (trial.keySecondary && trial.keySecondary.length > 0) {
                html += '<tr><td style="font-weight:500">Key Secondary</td><td>' + trial.keySecondary.join('; ') + '</td></tr>';
            }
            if (trial.significance) html += '<tr><td style="font-weight:500">Significance</td><td>' + trial.significance + '</td></tr>';
            html += '</table>';

            html += '<div class="btn-group mt-1">'
                + '<button class="btn btn-xs btn-secondary" onclick="event.stopPropagation();TrialDB.copyCitation(\'' + trial.name.replace(/'/g, "\\'") + '\')">Copy Citation</button>'
                + '<button class="btn btn-xs btn-secondary" onclick="event.stopPropagation();TrialDB.copyDetails(\'' + trial.name.replace(/'/g, "\\'") + '\')">Copy Details</button>';
            if (trial.pmid) {
                html += '<a class="btn btn-xs btn-ghost" href="https://pubmed.ncbi.nlm.nih.gov/' + trial.pmid + '/" target="_blank" rel="noopener" onclick="event.stopPropagation()">PubMed</a>';
            }
            html += '</div>';
            html += '</div>'; // trial-detail

            html += '</div>'; // trial-card
        });

        if (trials.length === 0) {
            html = '<div class="text-center text-secondary" style="padding:40px">No trials match your search criteria.</div>';
        }

        var el = document.getElementById('td-trials');
        if (el) App.setTrustedHTML(el, html);
    }

    function search(term) {
        searchTerm = term;
        renderTrials();
    }

    function toggleFilter(catId) {
        if (activeFilters.has(catId)) {
            activeFilters.delete(catId);
        } else {
            activeFilters.add(catId);
        }
        // Update filter button states
        document.querySelectorAll('.filter-tag').forEach(function(btn) {
            btn.classList.toggle('active', activeFilters.has(btn.dataset.cat));
        });
        renderTrials();
    }

    function toggleTrial(name) {
        if (compareMode) return;
        var card = document.querySelector('[id="trial-' + name.replace(/\s/g, '-') + '"]');
        if (card) card.classList.toggle('expanded');
    }

    function toggleCompare() {
        compareMode = !compareMode;
        selectedTrials.clear();
        var btn = document.getElementById('td-compare-btn');
        if (btn) btn.textContent = compareMode ? 'Exit Compare' : 'Compare Mode';
        var action = document.getElementById('td-compare-action');
        if (action) action.classList.toggle('hidden', !compareMode);
        document.getElementById('td-comparison').classList.add('hidden');
        renderTrials();
    }

    function toggleSelect(name) {
        if (selectedTrials.has(name)) {
            selectedTrials.delete(name);
        } else {
            selectedTrials.add(name);
        }
        renderTrials();
    }

    function showComparison() {
        if (selectedTrials.size < 2) {
            Export.showToast('Select at least 2 trials to compare', 'warning');
            return;
        }

        var trials = TrialDatabase.trials.filter(function(t) { return selectedTrials.has(t.name); });
        var panel = document.getElementById('td-comparison');
        panel.classList.remove('hidden');

        var html = '<div style="overflow-x:auto"><table class="data-table">';
        html += '<thead><tr><th>Property</th>';
        trials.forEach(function(t) { html += '<th>' + t.name + '</th>'; });
        html += '</tr></thead><tbody>';

        var rows = [
            { label: 'Year', key: 'year' },
            { label: 'N', key: 'n' },
            { label: 'Design', key: 'design' },
            { label: 'Population', key: 'population' },
            { label: 'Intervention', key: 'intervention' },
            { label: 'Comparator', key: 'comparator' }
        ];

        rows.forEach(function(row) {
            html += '<tr><td style="font-weight:500">' + row.label + '</td>';
            trials.forEach(function(t) { html += '<td>' + (t[row.key] || '-') + '</td>'; });
            html += '</tr>';
        });

        // Primary outcome row
        html += '<tr><td style="font-weight:500">Primary Outcome</td>';
        trials.forEach(function(t) {
            if (t.primaryOutcome) {
                html += '<td>' + t.primaryOutcome.measure + ': <span class="text-accent">'
                    + t.primaryOutcome.result + '</span>'
                    + (t.primaryOutcome.pValue ? ' (P ' + t.primaryOutcome.pValue + ')' : '') + '</td>';
            } else {
                html += '<td>-</td>';
            }
        });
        html += '</tr>';

        html += '<tr><td style="font-weight:500">Significance</td>';
        trials.forEach(function(t) { html += '<td>' + (t.significance || '-') + '</td>'; });
        html += '</tr>';

        html += '</tbody></table></div>';

        html += '<div class="btn-group mt-2"><button class="btn btn-xs btn-secondary" onclick="TrialDB.copyComparison()">Copy as Table</button></div>';

        App.setTrustedHTML(document.getElementById('td-comparison-content'), html);
    }

    function copyCitation(name) {
        var trial = TrialDatabase.trials.find(function(t) { return t.name === name; });
        if (!trial) return;
        var text = trial.name + (trial.fullTitle ? ' (' + trial.fullTitle + ')' : '')
            + '. ' + (trial.journal || '') + ' ' + (trial.year || '')
            + (trial.pmid ? '. PMID: ' + trial.pmid : '') + '.';
        Export.copyText(text);
    }

    function copyDetails(name) {
        var trial = TrialDatabase.trials.find(function(t) { return t.name === name; });
        if (!trial) return;
        var text = trial.name + ' (' + trial.year + '): '
            + trial.intervention + ' vs ' + trial.comparator
            + '. N=' + trial.n + '. '
            + (trial.primaryOutcome ? trial.primaryOutcome.measure + ': ' + trial.primaryOutcome.result
                + (trial.primaryOutcome.ci ? ' ' + trial.primaryOutcome.ci : '')
                + (trial.primaryOutcome.pValue ? ', P ' + trial.primaryOutcome.pValue : '') : '')
            + '. ' + (trial.significance || '');
        Export.copyText(text);
    }

    function copyComparison() {
        var trials = TrialDatabase.trials.filter(function(t) { return selectedTrials.has(t.name); });
        var headers = ['Property'].concat(trials.map(function(t) { return t.name; }));
        var rows = [
            ['Year'].concat(trials.map(function(t) { return t.year || '-'; })),
            ['N'].concat(trials.map(function(t) { return t.n || '-'; })),
            ['Intervention'].concat(trials.map(function(t) { return t.intervention || '-'; })),
            ['Primary Outcome'].concat(trials.map(function(t) {
                return t.primaryOutcome ? t.primaryOutcome.result : '-';
            }))
        ];
        Export.copyTSV(headers, rows);
    }

    App.registerModule(MODULE_ID, { render: render });

    window.TrialDB = {
        search: search,
        toggleFilter: toggleFilter,
        toggleTrial: toggleTrial,
        toggleCompare: toggleCompare,
        toggleSelect: toggleSelect,
        showComparison: showComparison,
        copyCitation: copyCitation,
        copyDetails: copyDetails,
        copyComparison: copyComparison
    };
})();
