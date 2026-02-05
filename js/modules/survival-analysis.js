/**
 * Neuro-Epi — Survival Analysis Module
 * Kaplan-Meier estimator, log-rank test, hazard ratio, KM plot,
 * multi-group overlay, survival tables, results text generation.
 */
(function() {
    'use strict';

    var MODULE_ID = 'survival-analysis';

    // ============================================================
    // STATE
    // ============================================================
    var survivalData = [];
    var lastResults = null;

    // ============================================================
    // EXAMPLE DATA — Clinical example, 2 groups (Treatment vs Control)
    // ============================================================
    var STROKE_EXAMPLE = [
        { time:  2, event: 1, group: 'EVT' },
        { time:  5, event: 1, group: 'EVT' },
        { time:  8, event: 0, group: 'EVT' },
        { time: 12, event: 1, group: 'EVT' },
        { time: 15, event: 0, group: 'EVT' },
        { time: 18, event: 1, group: 'EVT' },
        { time: 22, event: 0, group: 'EVT' },
        { time: 28, event: 1, group: 'EVT' },
        { time: 30, event: 0, group: 'EVT' },
        { time: 35, event: 0, group: 'EVT' },
        { time: 40, event: 1, group: 'EVT' },
        { time: 48, event: 0, group: 'EVT' },
        { time: 52, event: 0, group: 'EVT' },
        { time: 60, event: 0, group: 'EVT' },
        { time: 72, event: 0, group: 'EVT' },
        { time:  1, event: 1, group: 'Medical' },
        { time:  3, event: 1, group: 'Medical' },
        { time:  6, event: 1, group: 'Medical' },
        { time:  9, event: 1, group: 'Medical' },
        { time: 10, event: 0, group: 'Medical' },
        { time: 14, event: 1, group: 'Medical' },
        { time: 16, event: 1, group: 'Medical' },
        { time: 20, event: 0, group: 'Medical' },
        { time: 24, event: 1, group: 'Medical' },
        { time: 26, event: 1, group: 'Medical' },
        { time: 30, event: 0, group: 'Medical' },
        { time: 33, event: 1, group: 'Medical' },
        { time: 38, event: 0, group: 'Medical' },
        { time: 45, event: 1, group: 'Medical' },
        { time: 55, event: 0, group: 'Medical' }
    ];

    // ============================================================
    // RENDER
    // ============================================================
    function render(container) {
        var html = App.createModuleLayout(
            'Survival Analysis',
            'Kaplan-Meier survival estimation with log-rank testing and hazard ratio calculation. Supports multi-group comparisons.'
        );

        html += '<div class="card">';

        // Action buttons
        html += '<div class="btn-group">'
            + '<button class="btn btn-secondary" onclick="SurvivalModule.loadExample()">Load Clinical Example</button>'
            + '<button class="btn btn-secondary" onclick="SurvivalModule.pasteCSV()">Paste CSV</button>'
            + '<button class="btn btn-secondary" onclick="SurvivalModule.addRow()">+ Add Row</button>'
            + '<button class="btn btn-secondary" onclick="SurvivalModule.clearData()">Clear All</button>'
            + '<button class="btn btn-primary" onclick="SurvivalModule.runAnalysis()">Analyze</button>'
            + '</div>';

        // Data table
        html += '<div id="sa-data-table" class="mt-2"></div>';

        // Results
        html += '<div id="sa-results"></div>';
        html += '</div>';

        App.setTrustedHTML(container, html);
        renderDataTable();
    }

    // ============================================================
    // DATA TABLE
    // ============================================================
    function renderDataTable() {
        var el = document.getElementById('sa-data-table');
        if (!el) return;

        var html = '<table class="data-table"><thead><tr>'
            + '<th>#</th>'
            + '<th>Time ' + App.tooltip('Follow-up time (any unit: days, months, years)') + '</th>'
            + '<th>Event ' + App.tooltip('1 = event occurred, 0 = censored') + '</th>'
            + '<th>Group (optional) ' + App.tooltip('Leave blank for single-group analysis, or enter group name for comparison') + '</th>'
            + '<th></th>'
            + '</tr></thead><tbody>';

        survivalData.forEach(function(s, i) {
            html += '<tr>'
                + '<td>' + (i + 1) + '</td>'
                + '<td><input type="number" class="form-input form-input--small" step="any" min="0" value="' + nvl(s.time) + '" onchange="SurvivalModule.updateField(' + i + ',\'time\',this.value)"></td>'
                + '<td><select class="form-select form-input--small" onchange="SurvivalModule.updateField(' + i + ',\'event\',this.value)">'
                + '<option value="1"' + (s.event === 1 ? ' selected' : '') + '>1 (Event)</option>'
                + '<option value="0"' + (s.event === 0 ? ' selected' : '') + '>0 (Censored)</option>'
                + '</select></td>'
                + '<td><input type="text" class="form-input form-input--small" value="' + escAttr(s.group) + '" onchange="SurvivalModule.updateField(' + i + ',\'group\',this.value)"></td>'
                + '<td><button class="btn btn-xs btn-danger" onclick="SurvivalModule.removeRow(' + i + ')">x</button></td>'
                + '</tr>';
        });
        html += '</tbody></table>';

        if (survivalData.length > 0) {
            var nEvents = survivalData.filter(function(s) { return s.event === 1; }).length;
            var nCensored = survivalData.length - nEvents;
            var groups = getUniqueGroups();
            html += '<div class="text-secondary" style="font-size:0.85rem;margin-top:4px;">'
                + survivalData.length + ' observations: ' + nEvents + ' events, ' + nCensored + ' censored'
                + (groups.length > 1 ? ' | Groups: ' + groups.join(', ') : '')
                + '</div>';
        }

        App.setTrustedHTML(el, html);
    }

    function escAttr(s) { return (s || '').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
    function nvl(v) { return v !== undefined && v !== null && v !== '' ? v : ''; }

    function getUniqueGroups() {
        var set = {};
        survivalData.forEach(function(s) {
            if (s.group && s.group.trim()) set[s.group.trim()] = true;
        });
        return Object.keys(set);
    }

    // ============================================================
    // TABLE MANAGEMENT
    // ============================================================
    function addRow() {
        survivalData.push({ time: '', event: 1, group: '' });
        renderDataTable();
    }

    function removeRow(i) {
        survivalData.splice(i, 1);
        renderDataTable();
    }

    function updateField(i, field, value) {
        if (field === 'time') {
            survivalData[i].time = value === '' ? '' : parseFloat(value);
        } else if (field === 'event') {
            survivalData[i].event = parseInt(value);
        } else {
            survivalData[i][field] = value;
        }
    }

    function clearData() {
        survivalData = [];
        renderDataTable();
        var resEl = document.getElementById('sa-results');
        if (resEl) App.setTrustedHTML(resEl, '');
    }

    // ============================================================
    // LOAD EXAMPLE
    // ============================================================
    function loadExample() {
        survivalData = STROKE_EXAMPLE.map(function(d) {
            return { time: d.time, event: d.event, group: d.group };
        });
        renderDataTable();
        Export.showToast('Loaded clinical survival example (30 observations, 2 groups)');
    }

    // ============================================================
    // PASTE CSV
    // ============================================================
    function pasteCSV() {
        navigator.clipboard.readText().then(function(text) {
            parseCSVData(text);
        }).catch(function() {
            Export.showToast('Unable to read clipboard', 'error');
        });
    }

    function parseCSVData(text) {
        var lines = text.trim().split('\n');
        if (lines.length < 1) return;

        var delimiter = lines[0].indexOf('\t') >= 0 ? '\t' : ',';
        var startIdx = 0;
        var firstCols = lines[0].split(delimiter);
        if (firstCols.length >= 2 && isNaN(parseFloat(firstCols[0]))) {
            startIdx = 1;
        }

        survivalData = [];
        for (var i = startIdx; i < lines.length; i++) {
            var cols = lines[i].split(delimiter).map(function(c) { return c.trim(); });
            if (cols.length < 2) continue;
            survivalData.push({
                time: parseFloat(cols[0]) || 0,
                event: parseInt(cols[1]) || 0,
                group: cols.length > 2 ? cols[2] : ''
            });
        }
        renderDataTable();
        Export.showToast('Parsed ' + survivalData.length + ' observations');
    }

    // ============================================================
    // RUN ANALYSIS
    // ============================================================
    function runAnalysis() {
        // Validate
        var validData = survivalData.filter(function(s) {
            return s.time !== '' && !isNaN(s.time) && s.time >= 0;
        });
        if (validData.length < 2) {
            Export.showToast('Need at least 2 observations with valid time', 'error');
            return;
        }

        var times = validData.map(function(s) { return s.time; });
        var events = validData.map(function(s) { return s.event; });
        var groups = getUniqueGroups();
        var hasGroups = groups.length > 1;
        var groupArr = hasGroups ? validData.map(function(s) { return s.group || groups[0]; }) : null;

        // KM analysis
        var km = Statistics.kaplanMeier(times, events, groupArr);

        // Log-rank test (if 2 groups)
        var logRank = null;
        if (hasGroups && groups.length === 2) {
            logRank = Statistics.logRankTest(times, events, groupArr);
        }

        lastResults = { km: km, logRank: logRank, groups: groups, hasGroups: hasGroups, validData: validData };

        // Build results HTML
        var resultEl = document.getElementById('sa-results');
        var html = '<div class="result-panel animate-in mt-3">';

        // Summary
        html += '<div class="card-title">Kaplan-Meier Analysis</div>';

        var groupKeys = Object.keys(km);

        // Summary metrics
        html += '<div class="result-grid">';
        groupKeys.forEach(function(gKey) {
            var gData = km[gKey];
            var label = hasGroups ? gKey : 'Overall';
            html += '<div class="result-item"><div class="result-item-value">' + gData.n + '</div>'
                + '<div class="result-item-label">' + label + ' N</div></div>';

            var nEvts = 0;
            gData.table.forEach(function(r) { nEvts += r.events; });
            html += '<div class="result-item"><div class="result-item-value">' + nEvts + '</div>'
                + '<div class="result-item-label">' + label + ' Events</div></div>';

            if (gData.median !== null) {
                var medStr = gData.median.toFixed(1);
                if (gData.medianCI && gData.medianCI.lower !== null && gData.medianCI.upper !== null) {
                    medStr += ' [' + gData.medianCI.lower.toFixed(1) + ', '
                        + (gData.medianCI.upper !== null ? gData.medianCI.upper.toFixed(1) : 'NR') + ']';
                }
                html += '<div class="result-item"><div class="result-item-value">' + medStr + '</div>'
                    + '<div class="result-item-label">' + label + ' Median Survival (95% CI)</div></div>';
            } else {
                html += '<div class="result-item"><div class="result-item-value">NR</div>'
                    + '<div class="result-item-label">' + label + ' Median Survival</div></div>';
            }
        });
        html += '</div>';

        // Log-rank test results
        if (logRank) {
            html += '<div class="card-title mt-3">Log-Rank Test</div>';
            html += '<div class="result-grid">';
            html += '<div class="result-item"><div class="result-item-value">' + logRank.chi2.toFixed(3) + '</div>'
                + '<div class="result-item-label">Chi-squared (df=1)</div></div>';
            html += '<div class="result-item"><div class="result-item-value">' + Statistics.formatPValue(logRank.pValue) + '</div>'
                + '<div class="result-item-label">P-value</div></div>';
            html += '<div class="result-item"><div class="result-item-value">' + logRank.hr.toFixed(3) + '</div>'
                + '<div class="result-item-label">Hazard Ratio</div></div>';
            html += '<div class="result-item"><div class="result-item-value">[' + logRank.hrCI.lower.toFixed(3) + ', ' + logRank.hrCI.upper.toFixed(3) + ']</div>'
                + '<div class="result-item-label">HR 95% CI</div></div>';
            html += '</div>';
        }

        // KM Plot
        html += '<div class="card-title mt-3">Kaplan-Meier Plot</div>';
        html += '<div class="chart-container"><canvas id="sa-km-canvas"></canvas></div>';
        html += '<div class="chart-actions">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'sa-km-canvas\'),\'km-plot.png\')">Export PNG</button></div>';

        // Survival tables per group
        groupKeys.forEach(function(gKey) {
            var gData = km[gKey];
            var label = hasGroups ? gKey : 'Overall';
            html += '<div class="card-title mt-3">Survival Table: ' + label + '</div>';
            html += '<table class="data-table"><thead><tr>'
                + '<th>Time</th><th>N at Risk</th><th>Events</th><th>Censored</th>'
                + '<th>Survival</th><th>SE</th><th>95% CI</th>'
                + '</tr></thead><tbody>';
            gData.table.forEach(function(r) {
                if (r.time === 0 && r.events === 0 && r.censored === 0) {
                    // initial row
                    html += '<tr><td class="num">0</td><td class="num">' + r.nRisk + '</td>'
                        + '<td class="num">-</td><td class="num">-</td>'
                        + '<td class="num">1.000</td><td class="num">-</td><td class="num">-</td></tr>';
                    return;
                }
                html += '<tr>'
                    + '<td class="num">' + r.time.toFixed(1) + '</td>'
                    + '<td class="num">' + r.nRisk + '</td>'
                    + '<td class="num">' + r.events + '</td>'
                    + '<td class="num">' + r.censored + '</td>'
                    + '<td class="num">' + r.survival.toFixed(4) + '</td>'
                    + '<td class="num">' + r.se.toFixed(4) + '</td>'
                    + '<td class="num">[' + r.ciLower.toFixed(4) + ', ' + r.ciUpper.toFixed(4) + ']</td>'
                    + '</tr>';
            });
            html += '</tbody></table>';
        });

        // Results text
        var resultsText = generateResultsText(km, logRank, groups, hasGroups, validData);
        html += '<div class="card-title mt-3">Results Text for Manuscript</div>';
        html += '<div class="text-output" id="sa-results-text">' + resultsText + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-secondary" onclick="SurvivalModule.copyResults()">Copy Results Text</button>'
            + '</div>';

        html += '</div>'; // result-panel

        App.setTrustedHTML(resultEl, html);

        // Draw KM plot
        setTimeout(function() { drawKMPlot(km, groups, hasGroups); }, 50);
    }

    // ============================================================
    // KM PLOT
    // ============================================================
    function drawKMPlot(km, groups, hasGroups) {
        var canvas = document.getElementById('sa-km-canvas');
        if (!canvas) return;

        var groupKeys = Object.keys(km);
        var plotGroups = groupKeys.map(function(gKey) {
            var gData = km[gKey];
            return {
                label: hasGroups ? gKey : 'Overall',
                table: gData.table
            };
        });

        Charts.KaplanMeierPlot(canvas, {
            groups: plotGroups,
            medianLines: true,
            showCI: true,
            showCensoring: true,
            showAtRisk: true,
            title: 'Kaplan-Meier Survival Curve',
            xLabel: 'Time',
            yLabel: 'Survival Probability',
            width: 700,
            height: 500
        });
    }

    // ============================================================
    // RESULTS TEXT
    // ============================================================
    function generateResultsText(km, logRank, groups, hasGroups, validData) {
        var totalN = validData.length;
        var totalEvents = validData.filter(function(s) { return s.event === 1; }).length;
        var text = '';

        if (hasGroups && groups.length === 2) {
            var g1 = km[groups[0]];
            var g2 = km[groups[1]];
            var n1 = g1.n;
            var n2 = g2.n;
            var e1 = 0;
            var e2 = 0;
            g1.table.forEach(function(r) { e1 += r.events; });
            g2.table.forEach(function(r) { e2 += r.events; });

            text += 'Survival analysis was performed on ' + totalN + ' participants (' + n1 + ' in the ' + groups[0]
                + ' group and ' + n2 + ' in the ' + groups[1] + ' group). '
                + 'A total of ' + totalEvents + ' events were observed (' + e1 + ' in ' + groups[0]
                + ' and ' + e2 + ' in ' + groups[1] + '). ';

            // Median survival
            if (g1.median !== null) {
                text += 'Median survival in the ' + groups[0] + ' group was ' + g1.median.toFixed(1);
                if (g1.medianCI && g1.medianCI.lower !== null) {
                    text += ' (95% CI, ' + g1.medianCI.lower.toFixed(1) + ' to '
                        + (g1.medianCI.upper !== null ? g1.medianCI.upper.toFixed(1) : 'not reached') + ')';
                }
                text += '. ';
            } else {
                text += 'Median survival in the ' + groups[0] + ' group was not reached. ';
            }

            if (g2.median !== null) {
                text += 'Median survival in the ' + groups[1] + ' group was ' + g2.median.toFixed(1);
                if (g2.medianCI && g2.medianCI.lower !== null) {
                    text += ' (95% CI, ' + g2.medianCI.lower.toFixed(1) + ' to '
                        + (g2.medianCI.upper !== null ? g2.medianCI.upper.toFixed(1) : 'not reached') + ')';
                }
                text += '. ';
            } else {
                text += 'Median survival in the ' + groups[1] + ' group was not reached. ';
            }

            if (logRank) {
                text += 'The log-rank test ' + (logRank.pValue < 0.05 ? 'showed a statistically significant difference' : 'did not show a statistically significant difference')
                    + ' between groups (chi-squared = ' + logRank.chi2.toFixed(2) + ', P ' + Statistics.formatPValue(logRank.pValue) + '). '
                    + 'The hazard ratio was ' + logRank.hr.toFixed(2)
                    + ' (95% CI, ' + logRank.hrCI.lower.toFixed(2) + ' to ' + logRank.hrCI.upper.toFixed(2) + '). ';
            }
        } else {
            var gKey = Object.keys(km)[0];
            var gData = km[gKey];
            text += 'Kaplan-Meier analysis was performed on ' + totalN + ' participants with '
                + totalEvents + ' events observed. ';
            if (gData.median !== null) {
                text += 'Median survival was ' + gData.median.toFixed(1);
                if (gData.medianCI && gData.medianCI.lower !== null) {
                    text += ' (95% CI, ' + gData.medianCI.lower.toFixed(1) + ' to '
                        + (gData.medianCI.upper !== null ? gData.medianCI.upper.toFixed(1) : 'not reached') + ')';
                }
                text += '. ';
            } else {
                text += 'Median survival was not reached. ';
            }
        }

        return text;
    }

    // ============================================================
    // COPY RESULTS
    // ============================================================
    function copyResults() {
        var textEl = document.getElementById('sa-results-text');
        if (textEl) {
            Export.copyText(textEl.textContent);
        }
    }

    // ============================================================
    // REGISTER MODULE
    // ============================================================
    App.registerModule(MODULE_ID, {
        render: render,
        onThemeChange: function() {
            if (lastResults) {
                setTimeout(function() {
                    drawKMPlot(lastResults.km, lastResults.groups, lastResults.hasGroups);
                }, 50);
            }
        }
    });

    window.SurvivalModule = {
        loadExample: loadExample,
        pasteCSV: pasteCSV,
        addRow: addRow,
        removeRow: removeRow,
        updateField: updateField,
        clearData: clearData,
        runAnalysis: runAnalysis,
        copyResults: copyResults
    };
})();
