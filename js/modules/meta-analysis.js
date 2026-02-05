/**
 * Neuro-Epi — Meta-Analysis Module
 * Fixed-effect (IV), DerSimonian-Laird random-effects, HKSJ adjustment,
 * forest plot, funnel plot, sensitivity analysis, results text generation.
 */
(function() {
    'use strict';

    var MODULE_ID = 'meta-analysis';

    // ============================================================
    // STATE
    // ============================================================
    var studyData = [];
    var inputMode = 'effect'; // 'effect' or 'binary'
    var selectedMeasure = 'OR';
    var useHKSJ = false;
    var lastResults = null;

    // ============================================================
    // EXAMPLE DATA — Endovascular thrombectomy (EVT) trials
    // Log-OR and SE from published 2x2 tables
    // ============================================================
    var EVT_EXAMPLE = [
        { name: 'MR CLEAN (2015)',    logEffect: 0.4700, se: 0.2100 },
        { name: 'ESCAPE (2015)',      logEffect: 0.9555, se: 0.2510 },
        { name: 'EXTEND-IA (2015)',   logEffect: 1.1314, se: 0.4130 },
        { name: 'SWIFT PRIME (2015)', logEffect: 1.0647, se: 0.3430 },
        { name: 'REVASCAT (2015)',    logEffect: 0.5481, se: 0.2780 }
    ];

    var EVT_BINARY_EXAMPLE = [
        { name: 'MR CLEAN (2015)',    e1: 76,  n1: 233, e2: 51,  n2: 267 },
        { name: 'ESCAPE (2015)',      e1: 87,  n1: 165, e2: 43,  n2: 150 },
        { name: 'EXTEND-IA (2015)',   e1: 25,  n1: 35,  e2: 14,  n2: 35 },
        { name: 'SWIFT PRIME (2015)', e1: 44,  n1: 98,  e2: 27,  n2: 98 },
        { name: 'REVASCAT (2015)',    e1: 39,  n1: 103, e2: 28,  n2: 103 }
    ];

    // ============================================================
    // RENDER
    // ============================================================
    function render(container) {
        var html = App.createModuleLayout(
            'Meta-Analysis',
            'Combine results from multiple studies with fixed-effect (IV) or DerSimonian-Laird random-effects models. Generate publication-quality forest and funnel plots.'
        );

        html += '<div class="card">';

        // Input mode toggle
        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Input Mode ' + App.tooltip('Choose between entering effect sizes directly (log scale) or 2x2 binary tables') + '</label>'
            + '<select class="form-select" id="ma-input-mode" onchange="MetaAnalysisModule.switchInputMode(this.value)">'
            + '<option value="effect" ' + (inputMode === 'effect' ? 'selected' : '') + '>Effect Size + SE / CI</option>'
            + '<option value="binary" ' + (inputMode === 'binary' ? 'selected' : '') + '>2x2 Binary (Events / N)</option>'
            + '</select></div>'
            + '<div class="form-group"><label class="form-label">Effect Measure</label>'
            + '<select class="form-select" id="ma-measure" onchange="MetaAnalysisModule.changeMeasure(this.value)">'
            + '<option value="OR"' + (selectedMeasure === 'OR' ? ' selected' : '') + '>Odds Ratio (OR)</option>'
            + '<option value="RR"' + (selectedMeasure === 'RR' ? ' selected' : '') + '>Risk Ratio (RR)</option>'
            + '<option value="RD"' + (selectedMeasure === 'RD' ? ' selected' : '') + '>Risk Difference (RD)</option>'
            + '<option value="HR"' + (selectedMeasure === 'HR' ? ' selected' : '') + '>Hazard Ratio (HR)</option>'
            + '<option value="MD"' + (selectedMeasure === 'MD' ? ' selected' : '') + '>Mean Difference (MD)</option>'
            + '<option value="SMD"' + (selectedMeasure === 'SMD' ? ' selected' : '') + '>Standardized Mean Diff (SMD)</option>'
            + '</select></div></div>';

        // HKSJ checkbox
        html += '<div class="form-row">'
            + '<label style="display:flex;align-items:center;gap:8px;cursor:pointer;">'
            + '<input type="checkbox" id="ma-hksj" ' + (useHKSJ ? 'checked' : '') + ' onchange="MetaAnalysisModule.toggleHKSJ(this.checked)">'
            + ' Hartung-Knapp-Sidik-Jonkman (HKSJ) adjustment ' + App.tooltip('Uses t-distribution with k-1 df and adjusted SE. Recommended when number of studies is small.') + '</label></div>';

        // Action buttons
        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-secondary" onclick="MetaAnalysisModule.loadExample()">Load Example (EVT Trials)</button>'
            + '<button class="btn btn-secondary" onclick="MetaAnalysisModule.pasteClipboard()">Paste from Clipboard</button>'
            + '<button class="btn btn-secondary" onclick="MetaAnalysisModule.addRow()">+ Add Row</button>'
            + '<button class="btn btn-primary" onclick="MetaAnalysisModule.runAnalysis()">Run Meta-Analysis</button>'
            + '</div>';

        // Data table container
        html += '<div id="ma-data-table" class="mt-2"></div>';

        // Results
        html += '<div id="ma-results"></div>';
        html += '</div>'; // card

        // ===== LEARN SECTION =====
        html += '<div class="card">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\');">'
            + '\u25B6 Learn: Meta-Analysis Essentials</div>';
        html += '<div class="learn-body hidden" style="font-size:0.9rem;line-height:1.7;">';

        html += '<div class="card-subtitle" style="font-weight:600;">Key Formulas</div>';
        html += '<div style="background:var(--bg-secondary);padding:12px;border-radius:8px;font-family:var(--font-mono);margin-bottom:12px;">'
            + '<div><strong>Fixed-Effect (IV):</strong> \u03B8\u0302 = \u03A3(w\u1D62\u03B8\u1D62) / \u03A3w\u1D62, w\u1D62 = 1/v\u1D62</div>'
            + '<div><strong>DerSimonian-Laird \u03C4\u00B2:</strong> \u03C4\u00B2 = max(0, (Q \u2212 (k\u22121)) / (S\u2081 \u2212 S\u2082/S\u2081))</div>'
            + '<div><strong>Cochran Q:</strong> Q = \u03A3 w\u1D62(\u03B8\u1D62 \u2212 \u03B8\u0302)\u00B2</div>'
            + '<div><strong>I\u00B2:</strong> I\u00B2 = max(0, (Q \u2212 (k\u22121))/Q \u00D7 100%)</div>'
            + '<div><strong>HKSJ:</strong> Uses t<sub>k\u22121</sub> with adjusted variance q* = \u03A3w*\u1D62(\u03B8\u1D62 \u2212 \u03B8\u0302*)\u00B2/(k\u22121)</div>'
            + '</div>';

        html += '<div class="card-subtitle" style="font-weight:600;">Assumptions</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li>Studies are independent</li>'
            + '<li>Fixed-effect: all studies share a common true effect</li>'
            + '<li>Random-effects: true effects follow a normal distribution across studies</li>'
            + '<li>Within-study variances are known (estimated with sufficient precision)</li>'
            + '<li>No systematic publication bias (testable via funnel plot + Egger\'s)</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Common Pitfalls</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li><strong>Publication bias:</strong> Small positive studies are more likely to be published</li>'
            + '<li><strong>Garbage in, garbage out:</strong> Meta-analysis cannot fix poor-quality primary studies</li>'
            + '<li><strong>\u03C4\u00B2 underestimation:</strong> DL estimator can underestimate heterogeneity; consider REML or PM</li>'
            + '<li><strong>I\u00B2 misinterpretation:</strong> I\u00B2 measures proportion of variability due to heterogeneity, not the magnitude</li>'
            + '<li><strong>Few studies + HKSJ:</strong> HKSJ is preferred when k < 10 but can be conservative</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">References</div>';
        html += '<ul style="margin:0 0 0 16px;font-size:0.85rem;">'
            + '<li>Borenstein M, et al. <em>Introduction to Meta-Analysis</em>. 2nd ed. Wiley; 2021.</li>'
            + '<li>Higgins JPT, et al. <em>Cochrane Handbook for Systematic Reviews of Interventions</em>. v6.4; 2023.</li>'
            + '<li>IntHout J, et al. The Hartung-Knapp-Sidik-Jonkman method. <em>BMC Med Res Methodol</em>. 2014;14:25.</li>'
            + '</ul>';
        html += '</div></div>';

        App.setTrustedHTML(container, html);
        renderDataTable();
    }

    // ============================================================
    // DATA TABLE
    // ============================================================
    function renderDataTable() {
        var el = document.getElementById('ma-data-table');
        if (!el) return;
        var html = '';

        if (inputMode === 'effect') {
            html += '<table class="data-table"><thead><tr>'
                + '<th>#</th><th>Study Name</th>'
                + '<th>Effect (log scale) ' + App.tooltip('For OR, RR, HR: enter the natural log. For MD, SMD, RD: enter raw value.') + '</th>'
                + '<th>SE</th>'
                + '<th>95% CI Lower</th><th>95% CI Upper</th>'
                + '<th></th></tr></thead><tbody>';
            studyData.forEach(function(s, i) {
                html += '<tr>'
                    + '<td>' + (i + 1) + '</td>'
                    + '<td><input type="text" class="form-input form-input--small" value="' + escAttr(s.name) + '" onchange="MetaAnalysisModule.updateField(' + i + ',\'name\',this.value)"></td>'
                    + '<td><input type="number" class="form-input form-input--small" step="any" value="' + nvl(s.logEffect) + '" onchange="MetaAnalysisModule.updateField(' + i + ',\'logEffect\',this.value)"></td>'
                    + '<td><input type="number" class="form-input form-input--small" step="any" value="' + nvl(s.se) + '" onchange="MetaAnalysisModule.updateField(' + i + ',\'se\',this.value)"></td>'
                    + '<td><input type="number" class="form-input form-input--small" step="any" value="' + nvl(s.ciLower) + '" onchange="MetaAnalysisModule.updateField(' + i + ',\'ciLower\',this.value)"></td>'
                    + '<td><input type="number" class="form-input form-input--small" step="any" value="' + nvl(s.ciUpper) + '" onchange="MetaAnalysisModule.updateField(' + i + ',\'ciUpper\',this.value)"></td>'
                    + '<td><button class="btn btn-xs btn-danger" onclick="MetaAnalysisModule.removeRow(' + i + ')">x</button></td>'
                    + '</tr>';
            });
            html += '</tbody></table>';
        } else {
            html += '<table class="data-table"><thead><tr>'
                + '<th>#</th><th>Study Name</th>'
                + '<th>Events (Tx)</th><th>N (Tx)</th>'
                + '<th>Events (Ctrl)</th><th>N (Ctrl)</th>'
                + '<th></th></tr></thead><tbody>';
            studyData.forEach(function(s, i) {
                html += '<tr>'
                    + '<td>' + (i + 1) + '</td>'
                    + '<td><input type="text" class="form-input form-input--small" value="' + escAttr(s.name) + '" onchange="MetaAnalysisModule.updateField(' + i + ',\'name\',this.value)"></td>'
                    + '<td><input type="number" class="form-input form-input--small" step="1" min="0" value="' + nvl(s.e1) + '" onchange="MetaAnalysisModule.updateField(' + i + ',\'e1\',this.value)"></td>'
                    + '<td><input type="number" class="form-input form-input--small" step="1" min="1" value="' + nvl(s.n1) + '" onchange="MetaAnalysisModule.updateField(' + i + ',\'n1\',this.value)"></td>'
                    + '<td><input type="number" class="form-input form-input--small" step="1" min="0" value="' + nvl(s.e2) + '" onchange="MetaAnalysisModule.updateField(' + i + ',\'e2\',this.value)"></td>'
                    + '<td><input type="number" class="form-input form-input--small" step="1" min="1" value="' + nvl(s.n2) + '" onchange="MetaAnalysisModule.updateField(' + i + ',\'n2\',this.value)"></td>'
                    + '<td><button class="btn btn-xs btn-danger" onclick="MetaAnalysisModule.removeRow(' + i + ')">x</button></td>'
                    + '</tr>';
            });
            html += '</tbody></table>';
        }

        App.setTrustedHTML(el, html);
    }

    function escAttr(s) { return (s || '').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
    function nvl(v) { return v !== undefined && v !== null && v !== '' ? v : ''; }

    // ============================================================
    // TABLE MANAGEMENT
    // ============================================================
    function addRow() {
        if (inputMode === 'effect') {
            studyData.push({ name: 'Study ' + (studyData.length + 1), logEffect: '', se: '', ciLower: '', ciUpper: '' });
        } else {
            studyData.push({ name: 'Study ' + (studyData.length + 1), e1: '', n1: '', e2: '', n2: '' });
        }
        renderDataTable();
    }

    function removeRow(i) {
        studyData.splice(i, 1);
        renderDataTable();
    }

    function updateField(i, field, value) {
        if (field === 'name') {
            studyData[i][field] = value;
        } else {
            studyData[i][field] = value === '' ? '' : parseFloat(value);
        }
    }

    function switchInputMode(mode) {
        inputMode = mode;
        studyData = [];
        renderDataTable();
    }

    function changeMeasure(m) {
        selectedMeasure = m;
    }

    function toggleHKSJ(checked) {
        useHKSJ = checked;
    }

    // ============================================================
    // LOAD EXAMPLE
    // ============================================================
    function loadExample() {
        selectedMeasure = 'OR';
        var measureSel = document.getElementById('ma-measure');
        if (measureSel) measureSel.value = 'OR';

        if (inputMode === 'effect') {
            studyData = EVT_EXAMPLE.map(function(d) {
                return { name: d.name, logEffect: d.logEffect, se: d.se, ciLower: '', ciUpper: '' };
            });
        } else {
            studyData = EVT_BINARY_EXAMPLE.map(function(d) {
                return { name: d.name, e1: d.e1, n1: d.n1, e2: d.e2, n2: d.n2 };
            });
        }
        renderDataTable();
        Export.showToast('Loaded 5 EVT thrombectomy trials');
    }

    // ============================================================
    // PASTE FROM CLIPBOARD
    // ============================================================
    function pasteClipboard() {
        navigator.clipboard.readText().then(function(text) {
            parseTSV(text);
        }).catch(function() {
            Export.showToast('Unable to read clipboard. Paste data directly into the table.', 'error');
        });
    }

    function parseTSV(text) {
        var lines = text.trim().split('\n');
        if (lines.length < 1) return;

        // Detect whether first line is a header
        var startIdx = 0;
        var firstCols = lines[0].split('\t');
        if (firstCols.length >= 2 && isNaN(parseFloat(firstCols[1]))) {
            startIdx = 1; // skip header
        }

        studyData = [];
        for (var i = startIdx; i < lines.length; i++) {
            var cols = lines[i].split('\t');
            if (cols.length < 2) continue;

            if (inputMode === 'effect') {
                studyData.push({
                    name: cols[0] || 'Study ' + (studyData.length + 1),
                    logEffect: parseFloat(cols[1]) || 0,
                    se: cols.length > 2 ? parseFloat(cols[2]) || '' : '',
                    ciLower: cols.length > 3 ? parseFloat(cols[3]) || '' : '',
                    ciUpper: cols.length > 4 ? parseFloat(cols[4]) || '' : ''
                });
            } else {
                studyData.push({
                    name: cols[0] || 'Study ' + (studyData.length + 1),
                    e1: parseInt(cols[1]) || 0,
                    n1: parseInt(cols[2]) || 0,
                    e2: parseInt(cols[3]) || 0,
                    n2: parseInt(cols[4]) || 0
                });
            }
        }
        renderDataTable();
        Export.showToast('Parsed ' + studyData.length + ' studies from clipboard');
    }

    // ============================================================
    // COMPUTE EFFECTS FROM INPUT
    // ============================================================
    function prepareEffects() {
        var effects = [];
        var variances = [];
        var names = [];
        var seArr = [];
        var isLogScale = (selectedMeasure === 'OR' || selectedMeasure === 'RR' || selectedMeasure === 'HR');

        if (inputMode === 'effect') {
            for (var i = 0; i < studyData.length; i++) {
                var s = studyData[i];
                var eff = parseFloat(s.logEffect);
                if (isNaN(eff)) continue;

                var se = parseFloat(s.se);
                if (isNaN(se) || se <= 0) {
                    // Try to compute SE from CI
                    var lo = parseFloat(s.ciLower);
                    var hi = parseFloat(s.ciUpper);
                    if (!isNaN(lo) && !isNaN(hi)) {
                        if (isLogScale) {
                            se = (Math.log(hi) - Math.log(lo)) / (2 * 1.96);
                        } else {
                            se = (hi - lo) / (2 * 1.96);
                        }
                    }
                }
                if (isNaN(se) || se <= 0) continue;

                effects.push(eff);
                variances.push(se * se);
                seArr.push(se);
                names.push(s.name || 'Study ' + (i + 1));
            }
        } else {
            // Binary 2x2 tables
            for (var j = 0; j < studyData.length; j++) {
                var d = studyData[j];
                var e1 = parseInt(d.e1);
                var n1 = parseInt(d.n1);
                var e2 = parseInt(d.e2);
                var n2 = parseInt(d.n2);
                if (isNaN(e1) || isNaN(n1) || isNaN(e2) || isNaN(n2)) continue;
                if (n1 <= 0 || n2 <= 0) continue;

                // Continuity correction if any zero cell
                var a = e1, b = n1 - e1, c = e2, dv = n2 - e2;
                var cc = 0;
                if (a === 0 || b === 0 || c === 0 || dv === 0) cc = 0.5;

                var eff, se2;
                if (selectedMeasure === 'OR') {
                    var orVal = ((a + cc) * (dv + cc)) / ((b + cc) * (c + cc));
                    eff = Math.log(orVal);
                    se2 = 1 / (a + cc) + 1 / (b + cc) + 1 / (c + cc) + 1 / (dv + cc);
                } else if (selectedMeasure === 'RR') {
                    var rrVal = ((a + cc) / (n1 + 2 * cc)) / ((c + cc) / (n2 + 2 * cc));
                    eff = Math.log(rrVal);
                    se2 = 1 / (a + cc) - 1 / (n1 + 2 * cc) + 1 / (c + cc) - 1 / (n2 + 2 * cc);
                } else if (selectedMeasure === 'RD') {
                    eff = a / n1 - c / n2;
                    se2 = (a * b) / (n1 * n1 * n1) + (c * dv) / (n2 * n2 * n2);
                } else {
                    // Default to OR for HR, MD, SMD in binary mode
                    var orV2 = ((a + cc) * (dv + cc)) / ((b + cc) * (c + cc));
                    eff = Math.log(orV2);
                    se2 = 1 / (a + cc) + 1 / (b + cc) + 1 / (c + cc) + 1 / (dv + cc);
                }

                effects.push(eff);
                variances.push(se2);
                seArr.push(Math.sqrt(se2));
                names.push(d.name || 'Study ' + (j + 1));
            }
        }

        return { effects: effects, variances: variances, se: seArr, names: names, isLogScale: isLogScale };
    }

    // ============================================================
    // RUN ANALYSIS
    // ============================================================
    function runAnalysis() {
        var prep = prepareEffects();
        if (prep.effects.length < 2) {
            Export.showToast('Need at least 2 studies with valid data', 'error');
            return;
        }

        var k = prep.effects.length;
        var isLog = prep.isLogScale;

        // Fixed-effect
        var fe = Statistics.metaAnalysisFixedEffect(prep.effects, prep.variances);
        // Random-effects (DL)
        var re = Statistics.metaAnalysisRandomEffects(prep.effects, prep.variances, { hksj: useHKSJ });

        // Egger's test
        var egger = k >= 3 ? Statistics.eggerTest(prep.effects, prep.se) : null;

        // Leave-one-out
        var loo = Statistics.leaveOneOut(prep.effects, prep.variances);

        // Cumulative
        var cum = Statistics.cumulativeMA(prep.effects, prep.variances, prep.names);

        // Prepare study rows for forest plot
        var reWeights = re.weights; // already %

        var forestStudies = prep.names.map(function(name, i) {
            return {
                name: name,
                estimate: prep.effects[i],
                ci: {
                    lower: prep.effects[i] - 1.96 * prep.se[i],
                    upper: prep.effects[i] + 1.96 * prep.se[i]
                },
                weight: reWeights[i]
            };
        });

        // Heterogeneity interpretation
        var i2val = re.I2 * 100;
        var i2interp = i2val < 25 ? 'low' : (i2val < 50 ? 'moderate' : (i2val < 75 ? 'substantial' : 'considerable'));
        var hetSig = re.pHet < 0.10 ? 'significant' : 'not significant';

        lastResults = {
            fe: fe, re: re, egger: egger, loo: loo, cum: cum,
            prep: prep, forestStudies: forestStudies,
            i2interp: i2interp, hetSig: hetSig
        };

        // Build results HTML
        var resultEl = document.getElementById('ma-results');
        var html = '<div class="result-panel animate-in mt-3">';

        // Summary
        html += '<div class="card-title">Summary Results (' + k + ' studies)</div>';
        html += '<div class="result-grid">';

        var reEst = isLog ? Math.exp(re.pooled).toFixed(3) : re.pooled.toFixed(3);
        var reLo = isLog ? Math.exp(re.ci.lower).toFixed(3) : re.ci.lower.toFixed(3);
        var reHi = isLog ? Math.exp(re.ci.upper).toFixed(3) : re.ci.upper.toFixed(3);
        var feEst = isLog ? Math.exp(fe.pooled).toFixed(3) : fe.pooled.toFixed(3);
        var feLo = isLog ? Math.exp(fe.ci.lower).toFixed(3) : fe.ci.lower.toFixed(3);
        var feHi = isLog ? Math.exp(fe.ci.upper).toFixed(3) : fe.ci.upper.toFixed(3);

        html += '<div class="result-item"><div class="result-item-value">' + reEst + '</div>'
            + '<div class="result-item-label">RE Pooled ' + selectedMeasure + '</div></div>';
        html += '<div class="result-item"><div class="result-item-value">[' + reLo + ', ' + reHi + ']</div>'
            + '<div class="result-item-label">RE 95% CI</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + Statistics.formatPValue(re.pValue) + '</div>'
            + '<div class="result-item-label">RE p-value</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + feEst + '</div>'
            + '<div class="result-item-label">FE Pooled ' + selectedMeasure + '</div></div>';
        html += '<div class="result-item"><div class="result-item-value">[' + feLo + ', ' + feHi + ']</div>'
            + '<div class="result-item-label">FE 95% CI</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + Statistics.formatPValue(fe.pValue) + '</div>'
            + '<div class="result-item-label">FE p-value</div></div>';
        html += '</div>';

        // Heterogeneity panel
        html += '<div class="card-title mt-3">Heterogeneity ' + App.tooltip('Measures the degree to which study results differ beyond what is expected by chance alone') + '</div>';
        html += '<div class="result-grid">';
        html += '<div class="result-item"><div class="result-item-value">' + re.Q.toFixed(2) + '</div>'
            + '<div class="result-item-label">Cochran Q (df=' + re.df + ')</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + Statistics.formatPValue(re.pHet) + '</div>'
            + '<div class="result-item-label">Q p-value</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + i2val.toFixed(1) + '%</div>'
            + '<div class="result-item-label">I' + String.fromCharCode(178) + ' (' + i2interp + ')</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + re.H2.toFixed(2) + '</div>'
            + '<div class="result-item-label">H' + String.fromCharCode(178) + '</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + re.tau2.toFixed(4) + '</div>'
            + '<div class="result-item-label">' + String.fromCharCode(964) + String.fromCharCode(178) + ' (DL)</div></div>';

        // Prediction interval
        if (re.predInterval) {
            var piLo = isLog ? Math.exp(re.predInterval.lower).toFixed(3) : re.predInterval.lower.toFixed(3);
            var piHi = isLog ? Math.exp(re.predInterval.upper).toFixed(3) : re.predInterval.upper.toFixed(3);
            html += '<div class="result-item"><div class="result-item-value">[' + piLo + ', ' + piHi + ']</div>'
                + '<div class="result-item-label">Prediction Interval</div></div>';
        }
        html += '</div>';

        if (useHKSJ) {
            html += '<div class="text-secondary" style="font-size:0.85rem;margin-top:4px;">HKSJ adjustment applied. Uses t-distribution with ' + (k - 1) + ' df.</div>';
        }

        // Forest plot
        html += '<div class="card-title mt-3">Forest Plot</div>';
        html += '<div class="chart-container"><canvas id="ma-forest-canvas"></canvas></div>';
        html += '<div class="chart-actions">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'ma-forest-canvas\'),\'forest-plot.png\')">Export Forest PNG</button></div>';

        // Funnel plot
        html += '<div class="card-title mt-3">Funnel Plot</div>';
        if (egger) {
            html += '<div class="text-secondary" style="font-size:0.85rem;">Egger\'s test: intercept = ' + egger.intercept.toFixed(3)
                + ', t = ' + egger.t.toFixed(3) + ', p = ' + Statistics.formatPValue(egger.pValue)
                + (egger.pValue < 0.05 ? ' (suggests publication bias)' : ' (no evidence of publication bias)') + '</div>';
        }
        html += '<div class="chart-container"><canvas id="ma-funnel-canvas"></canvas></div>';
        html += '<div class="chart-actions">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'ma-funnel-canvas\'),\'funnel-plot.png\')">Export Funnel PNG</button></div>';

        // Sensitivity: leave-one-out
        html += '<div class="card-title mt-3">Sensitivity Analysis: Leave-One-Out</div>';
        html += '<table class="data-table"><thead><tr>'
            + '<th>Excluded Study</th><th>Pooled ' + selectedMeasure + '</th><th>95% CI</th>'
            + '<th>I' + String.fromCharCode(178) + '</th><th>' + String.fromCharCode(964) + String.fromCharCode(178) + '</th></tr></thead><tbody>';
        loo.forEach(function(r) {
            var est = isLog ? Math.exp(r.pooled).toFixed(3) : r.pooled.toFixed(3);
            var lo = isLog ? Math.exp(r.ci.lower).toFixed(3) : r.ci.lower.toFixed(3);
            var hi = isLog ? Math.exp(r.ci.upper).toFixed(3) : r.ci.upper.toFixed(3);
            html += '<tr><td>' + prep.names[r.excluded] + '</td>'
                + '<td class="num">' + est + '</td>'
                + '<td class="num">[' + lo + ', ' + hi + ']</td>'
                + '<td class="num">' + (r.I2 * 100).toFixed(1) + '%</td>'
                + '<td class="num">' + r.tau2.toFixed(4) + '</td></tr>';
        });
        html += '</tbody></table>';

        // Cumulative meta-analysis
        html += '<div class="card-title mt-3">Cumulative Meta-Analysis</div>';
        html += '<table class="data-table"><thead><tr>'
            + '<th># Studies</th><th>Added Study</th><th>Cumulative ' + selectedMeasure + '</th><th>95% CI</th>'
            + '<th>I' + String.fromCharCode(178) + '</th></tr></thead><tbody>';
        cum.forEach(function(r) {
            var est = isLog ? Math.exp(r.pooled).toFixed(3) : r.pooled.toFixed(3);
            var lo = isLog ? Math.exp(r.ci.lower).toFixed(3) : r.ci.lower.toFixed(3);
            var hi = isLog ? Math.exp(r.ci.upper).toFixed(3) : r.ci.upper.toFixed(3);
            html += '<tr><td>' + r.nStudies + '</td>'
                + '<td>' + r.label + '</td>'
                + '<td class="num">' + est + '</td>'
                + '<td class="num">[' + lo + ', ' + hi + ']</td>'
                + '<td class="num">' + (r.I2 * 100).toFixed(1) + '%</td></tr>';
        });
        html += '</tbody></table>';

        // Results text
        var resultsText = generateResultsText(prep, fe, re, egger, isLog);
        html += '<div class="card-title mt-3">Results Text for Manuscript</div>';
        html += '<div class="text-output" id="ma-results-text">' + resultsText + '</div>';

        // Copy all button
        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-secondary" onclick="MetaAnalysisModule.copyAllResults()">Copy All Results</button>'
            + '</div>';

        html += '</div>'; // result-panel

        App.setTrustedHTML(resultEl, html);

        // Draw charts after DOM update
        setTimeout(function() { drawForestPlot(forestStudies, re, prep, isLog); }, 50);
        setTimeout(function() { drawFunnelPlot(prep, re, egger); }, 100);
    }

    // ============================================================
    // FOREST PLOT
    // ============================================================
    function drawForestPlot(studies, re, prep, isLog) {
        var canvas = document.getElementById('ma-forest-canvas');
        if (!canvas) return;

        var nullVal = isLog ? 0 : 0; // log(1)=0 for OR/RR/HR; 0 for MD/RD

        Charts.ForestPlot(canvas, {
            studies: studies,
            summary: {
                estimate: re.pooled,
                ci: re.ci,
                label: 'RE Model (DL' + (useHKSJ ? '+HKSJ' : '') + ')'
            },
            predInterval: re.predInterval,
            nullValue: nullVal,
            measureLabel: selectedMeasure + (isLog ? ' (log scale)' : ''),
            logScale: isLog,
            title: 'Forest Plot: ' + selectedMeasure + ' (' + prep.effects.length + ' studies)',
            width: 850
        });
    }

    // ============================================================
    // FUNNEL PLOT
    // ============================================================
    function drawFunnelPlot(prep, re, egger) {
        var canvas = document.getElementById('ma-funnel-canvas');
        if (!canvas) return;

        Charts.FunnelPlot(canvas, {
            effects: prep.effects,
            se: prep.se,
            pooledEffect: re.pooled,
            eggerLine: egger ? { intercept: egger.intercept, slope: egger.slope } : null,
            title: 'Funnel Plot: ' + selectedMeasure,
            width: 600,
            height: 450
        });
    }

    // ============================================================
    // RESULTS TEXT
    // ============================================================
    function generateResultsText(prep, fe, re, egger, isLog) {
        var k = prep.effects.length;
        var reEst = isLog ? Math.exp(re.pooled).toFixed(2) : re.pooled.toFixed(2);
        var reLo = isLog ? Math.exp(re.ci.lower).toFixed(2) : re.ci.lower.toFixed(2);
        var reHi = isLog ? Math.exp(re.ci.upper).toFixed(2) : re.ci.upper.toFixed(2);
        var feEst = isLog ? Math.exp(fe.pooled).toFixed(2) : fe.pooled.toFixed(2);
        var i2val = (re.I2 * 100).toFixed(1);
        var i2interp = re.I2 * 100 < 25 ? 'low' : (re.I2 * 100 < 50 ? 'moderate' : (re.I2 * 100 < 75 ? 'substantial' : 'considerable'));

        var text = 'A ' + (useHKSJ ? 'DerSimonian-Laird random-effects meta-analysis with Hartung-Knapp-Sidik-Jonkman adjustment' : 'DerSimonian-Laird random-effects meta-analysis')
            + ' of ' + k + ' studies was performed. '
            + 'The pooled ' + selectedMeasure + ' was ' + reEst
            + ' (95% CI, ' + reLo + ' to ' + reHi + '; P ' + Statistics.formatPValue(re.pValue) + '). '
            + 'The fixed-effect estimate was ' + feEst + ' (P ' + Statistics.formatPValue(fe.pValue) + '). '
            + 'Statistical heterogeneity was ' + i2interp
            + ' (I' + String.fromCharCode(178) + ' = ' + i2val + '%; '
            + 'Cochran Q = ' + re.Q.toFixed(2) + ', df = ' + re.df + ', P ' + Statistics.formatPValue(re.pHet) + '; '
            + String.fromCharCode(964) + String.fromCharCode(178) + ' = ' + re.tau2.toFixed(4) + '). ';

        if (re.predInterval) {
            var piLo = isLog ? Math.exp(re.predInterval.lower).toFixed(2) : re.predInterval.lower.toFixed(2);
            var piHi = isLog ? Math.exp(re.predInterval.upper).toFixed(2) : re.predInterval.upper.toFixed(2);
            text += 'The 95% prediction interval was ' + piLo + ' to ' + piHi + '. ';
        }

        if (egger) {
            text += 'Egger\'s regression test for funnel plot asymmetry '
                + (egger.pValue < 0.05 ? 'was statistically significant' : 'did not suggest publication bias')
                + ' (intercept = ' + egger.intercept.toFixed(2)
                + ', P ' + Statistics.formatPValue(egger.pValue) + '). ';
        }

        return text;
    }

    // ============================================================
    // COPY ALL RESULTS
    // ============================================================
    function copyAllResults() {
        var textEl = document.getElementById('ma-results-text');
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
                    drawForestPlot(lastResults.forestStudies, lastResults.re, lastResults.prep, lastResults.prep.isLogScale);
                    drawFunnelPlot(lastResults.prep, lastResults.re, lastResults.egger);
                }, 50);
            }
        }
    });

    window.MetaAnalysisModule = {
        switchInputMode: switchInputMode,
        changeMeasure: changeMeasure,
        toggleHKSJ: toggleHKSJ,
        addRow: addRow,
        removeRow: removeRow,
        updateField: updateField,
        loadExample: loadExample,
        pasteClipboard: pasteClipboard,
        runAnalysis: runAnalysis,
        copyAllResults: copyAllResults
    };
})();
