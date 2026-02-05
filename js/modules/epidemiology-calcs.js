/**
 * Neuro-Epi — Epidemiology Calculators Module
 * Tab A: 2x2 Table Analyzer
 * Tab B: Stratified Analysis (Mantel-Haenszel)
 * Tab C: Interaction Assessment (additive & multiplicative)
 * Tab D: Dose-Response (Cochran-Armitage trend test)
 * Tab E: Bias Checklist (catalog with clinical examples)
 *
 * Note: All HTML content is generated from trusted internal sources only.
 */
(function () {
    'use strict';

    var MODULE_ID = 'epidemiology-calcs';

    // ================================================================
    // RENDER
    // ================================================================

    function render(container) {
        var html = App.createModuleLayout(
            'Epidemiology Calculators',
            'Core epidemiological analyses: 2\u00D72 tables, stratified (Mantel-Haenszel) analysis, interaction assessment, dose-response trend tests, and a comprehensive bias catalog.'
        );

        html += '<div class="card">';
        html += '<div class="tabs" id="epi-tabs">'
            + '<button class="tab active" data-tab="twobytwo" onclick="EpiCalcModule.switchTab(\'twobytwo\')">2&times;2 Table</button>'
            + '<button class="tab" data-tab="stratified" onclick="EpiCalcModule.switchTab(\'stratified\')">Stratified (MH)</button>'
            + '<button class="tab" data-tab="interaction" onclick="EpiCalcModule.switchTab(\'interaction\')">Interaction</button>'
            + '<button class="tab" data-tab="doseresponse" onclick="EpiCalcModule.switchTab(\'doseresponse\')">Dose-Response</button>'
            + '<button class="tab" data-tab="bias" onclick="EpiCalcModule.switchTab(\'bias\')">Bias Checklist</button>'
            + '</div>';

        // ============================================================
        // TAB A: 2x2 Table Analyzer
        // ============================================================
        html += '<div class="tab-content active" id="epi-tab-twobytwo">';
        html += '<div class="card-subtitle">Enter cell counts from a 2&times;2 table. All effect measures, CIs, and tests are computed simultaneously.</div>';

        html += '<table class="data-table" style="max-width:450px;margin:0 auto 1rem">'
            + '<thead><tr><th></th><th>Disease (+)</th><th>Disease (&minus;)</th></tr></thead>'
            + '<tbody>'
            + '<tr><td><strong>Exposed</strong></td>'
            + '<td><input type="number" class="form-input form-input--small" id="epi_a" name="epi_a" value="30" min="0" style="width:80px"></td>'
            + '<td><input type="number" class="form-input form-input--small" id="epi_b" name="epi_b" value="70" min="0" style="width:80px"></td></tr>'
            + '<tr><td><strong>Unexposed</strong></td>'
            + '<td><input type="number" class="form-input form-input--small" id="epi_c" name="epi_c" value="15" min="0" style="width:80px"></td>'
            + '<td><input type="number" class="form-input form-input--small" id="epi_d" name="epi_d" value="85" min="0" style="width:80px"></td></tr>'
            + '</tbody></table>';

        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="EpiCalcModule.calc2x2()">Analyze</button></div>';
        html += '<div id="epi-2x2-results"></div>';
        html += '</div>';

        // ============================================================
        // TAB B: Stratified Analysis (Mantel-Haenszel)
        // ============================================================
        html += '<div class="tab-content" id="epi-tab-stratified">';
        html += '<div class="card-subtitle">Enter multiple 2&times;2 tables (strata) for pooled Mantel-Haenszel estimates and Breslow-Day homogeneity test.</div>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Number of Strata</label>'
            + '<input type="number" class="form-input" id="epi_mh_k" name="epi_mh_k" step="1" min="2" max="20" value="3" onchange="EpiCalcModule.buildMHInputs()"></div>'
            + '<div class="form-group"><label class="form-label">Measure</label>'
            + '<select class="form-select" id="epi_mh_measure" name="epi_mh_measure">'
            + '<option value="OR">Odds Ratio</option><option value="RR">Risk Ratio</option></select></div>'
            + '</div>';

        html += '<div id="epi-mh-inputs"></div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="EpiCalcModule.calcMH()">Pooled Analysis</button></div>';
        html += '<div id="epi-mh-results"></div>';
        html += '</div>';

        // ============================================================
        // TAB C: Interaction Assessment
        // ============================================================
        html += '<div class="tab-content" id="epi-tab-interaction">';
        html += '<div class="card-subtitle">Assess additive and multiplicative interaction between two risk factors. Input stratum-specific relative risks.</div>';

        html += '<table class="data-table" style="max-width:450px;margin:0 auto 1rem">'
            + '<thead><tr><th></th><th>Factor B +</th><th>Factor B &minus;</th></tr></thead>'
            + '<tbody>'
            + '<tr><td><strong>Factor A +</strong></td>'
            + '<td><label class="form-label text-center" style="font-size:0.8rem">RR\u2081\u2081</label>'
            + '<input type="number" class="form-input form-input--small" id="epi_rr11" name="epi_rr11" value="4.0" step="0.1" min="0" style="width:80px"></td>'
            + '<td><label class="form-label text-center" style="font-size:0.8rem">RR\u2081\u2080</label>'
            + '<input type="number" class="form-input form-input--small" id="epi_rr10" name="epi_rr10" value="2.5" step="0.1" min="0" style="width:80px"></td></tr>'
            + '<tr><td><strong>Factor A &minus;</strong></td>'
            + '<td><label class="form-label text-center" style="font-size:0.8rem">RR\u2080\u2081</label>'
            + '<input type="number" class="form-input form-input--small" id="epi_rr01" name="epi_rr01" value="1.8" step="0.1" min="0" style="width:80px"></td>'
            + '<td><div class="text-center" style="padding-top:1.2rem"><strong>Reference (1.0)</strong></div></td></tr>'
            + '</tbody></table>';

        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="EpiCalcModule.calcInteraction()">Assess Interaction</button></div>';
        html += '<div id="epi-interaction-results"></div>';
        html += '</div>';

        // ============================================================
        // TAB D: Dose-Response (Cochran-Armitage)
        // ============================================================
        html += '<div class="tab-content" id="epi-tab-doseresponse">';
        html += '<div class="card-subtitle">Cochran-Armitage trend test for ordered groups. Enter at least 3 exposure groups with event counts, totals, and trend scores.</div>';

        html += '<div class="form-group"><label class="form-label">Number of Groups</label>'
            + '<input type="number" class="form-input" id="epi_dr_k" name="epi_dr_k" step="1" min="3" max="10" value="4" onchange="EpiCalcModule.buildDRInputs()" style="max-width:120px"></div>';
        html += '<div id="epi-dr-inputs"></div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="EpiCalcModule.calcDoseResponse()">Test Trend</button></div>';
        html += '<div id="epi-dr-results"></div>';
        html += '</div>';

        // ============================================================
        // TAB E: Bias Checklist
        // ============================================================
        html += '<div class="tab-content" id="epi-tab-bias">';
        html += '<div class="card-subtitle">Comprehensive catalog of epidemiological biases with definitions, stroke-specific examples, and mitigation strategies.</div>';
        html += buildBiasChecklist();
        html += '</div>';

        html += '</div>'; // end card

        // ===== LEARN SECTION =====
        html += '<div class="card">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\');">'
            + '\u25B6 Learn: Epidemiology Calculations</div>';
        html += '<div class="learn-body hidden" style="font-size:0.9rem;line-height:1.7;">';

        html += '<div class="card-subtitle" style="font-weight:600;">Key Measures</div>';
        html += '<div style="background:var(--bg-secondary);padding:12px;border-radius:8px;font-family:var(--font-mono);margin-bottom:12px;">'
            + '<div><strong>Incidence Rate:</strong> Events / Person-time at risk</div>'
            + '<div><strong>Prevalence:</strong> Cases / Total population at a point in time</div>'
            + '<div><strong>OR (case-control):</strong> (a \u00D7 d) / (b \u00D7 c)</div>'
            + '<div><strong>RR (cohort):</strong> [a/(a+b)] / [c/(c+d)]</div>'
            + '<div><strong>AR%:</strong> (RR \u2212 1) / RR \u00D7 100% (in exposed)</div>'
            + '<div><strong>PAR%:</strong> p(RR \u2212 1) / [1 + p(RR \u2212 1)] (population)</div>'
            + '</div>';

        html += '<div class="card-subtitle" style="font-weight:600;">Common Pitfalls</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li><strong>Prevalence vs incidence:</strong> Prevalence includes old and new cases; incidence counts only new cases</li>'
            + '<li><strong>OR \u2248 RR only when outcome is rare:</strong> When prevalence >10%, OR overestimates RR</li>'
            + '<li><strong>Person-time denominators:</strong> Require knowing exact follow-up per individual</li>'
            + '<li><strong>PAR depends on prevalence:</strong> A strong association with a rare exposure has small population impact</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">References</div>';
        html += '<ul style="margin:0 0 0 16px;font-size:0.85rem;">'
            + '<li>Rothman KJ, et al. <em>Modern Epidemiology</em>. 4th ed. Wolters Kluwer; 2021.</li>'
            + '<li>Szklo M, Nieto FJ. <em>Epidemiology: Beyond the Basics</em>. 4th ed. Jones & Bartlett; 2019.</li>'
            + '</ul>';
        html += '</div></div>';

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);

        // Build dynamic inputs on first render
        setTimeout(function () {
            buildMHInputs();
            buildDRInputs();
        }, 30);
    }

    // ================================================================
    // TAB SWITCHING
    // ================================================================

    function switchTab(tabId) {
        document.querySelectorAll('#epi-tabs .tab').forEach(function (t) {
            t.classList.toggle('active', t.dataset.tab === tabId);
        });
        ['twobytwo', 'stratified', 'interaction', 'doseresponse', 'bias'].forEach(function (id) {
            var el = document.getElementById('epi-tab-' + id);
            if (el) el.classList.toggle('active', id === tabId);
        });
    }

    // ================================================================
    // TAB A: 2x2 TABLE
    // ================================================================

    function calc2x2() {
        var a = parseInt(document.getElementById('epi_a').value, 10);
        var b = parseInt(document.getElementById('epi_b').value, 10);
        var c = parseInt(document.getElementById('epi_c').value, 10);
        var d = parseInt(document.getElementById('epi_d').value, 10);
        if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) { Export.showToast('Fill all cells', 'error'); return; }
        if (a < 0 || b < 0 || c < 0 || d < 0) { Export.showToast('Cell counts must be non-negative', 'error'); return; }

        var res = Statistics.twoByTwo(a, b, c, d);
        var n = a + b + c + d;
        var n1 = a + b;
        var n2 = c + d;

        var html = '<div class="result-panel animate-in">';

        // Visual 2x2 table with computed margins
        html += '<div class="card-title mt-2">Summary Table</div>';
        html += '<table class="data-table" style="max-width:500px">'
            + '<thead><tr><th></th><th>D+</th><th>D&minus;</th><th>Total</th><th>Risk</th></tr></thead>'
            + '<tbody>'
            + '<tr><td><strong>Exposed</strong></td><td class="num">' + a + '</td><td class="num">' + b + '</td><td class="num">' + n1 + '</td><td class="num highlight">' + (res.p1 * 100).toFixed(1) + '%</td></tr>'
            + '<tr><td><strong>Unexposed</strong></td><td class="num">' + c + '</td><td class="num">' + d + '</td><td class="num">' + n2 + '</td><td class="num highlight">' + (res.p2 * 100).toFixed(1) + '%</td></tr>'
            + '<tr style="border-top:2px solid var(--border)"><td><strong>Total</strong></td><td class="num">' + (a + c) + '</td><td class="num">' + (b + d) + '</td><td class="num">' + n + '</td><td></td></tr>'
            + '</tbody></table>';

        // Effect measures grid
        html += '<div class="card-title mt-3">Effect Measures (95% CI)</div>';
        html += '<div class="result-grid">';

        html += makeResultItem('RR', res.rr.value.toFixed(3), Statistics.formatCI(res.rr.ci.lower, res.rr.ci.upper, 3));
        html += makeResultItem('OR', res.or.value.toFixed(3), Statistics.formatCI(res.or.ci.lower, res.or.ci.upper, 3));
        html += makeResultItem('RD', (res.rd.value * 100).toFixed(2) + '%',
            '(' + (res.rd.ci.lower * 100).toFixed(2) + '%, ' + (res.rd.ci.upper * 100).toFixed(2) + '%)');

        // Newcombe CI for RD
        html += makeResultItem('RD (Newcombe)', (res.rd.newcombe.diff * 100).toFixed(2) + '%',
            '(' + (res.rd.newcombe.lower * 100).toFixed(2) + '%, ' + (res.rd.newcombe.upper * 100).toFixed(2) + '%)');

        // NNT/NNH
        var nntVal = res.nnt.value;
        var nntDisplay = Math.abs(nntVal) === Infinity ? '\u221E' : Math.ceil(Math.abs(nntVal));
        var nntLabel = res.nnt.isHarm ? 'NNH' : 'NNT';
        html += makeResultItem(nntLabel, nntDisplay, '');

        // Statistical tests
        html += makeResultItem('\u03C7\u00B2', res.chi2.chi2.toFixed(2), 'p = ' + Statistics.formatPValue(res.chi2.pValue));
        html += makeResultItem('\u03C7\u00B2 (Yates)', res.chi2Yates.chi2.toFixed(2), 'p = ' + Statistics.formatPValue(res.chi2Yates.pValue));
        html += makeResultItem('Fisher exact', '', 'p = ' + Statistics.formatPValue(res.fisher.pValue));

        html += '</div>'; // end result-grid

        // Attributable fractions
        html += '<div class="card-title mt-3">Attributable Fractions</div>';
        html += '<div class="result-grid">';
        html += makeResultItem('AF (Exposed)', (res.afExposed * 100).toFixed(1) + '%',
            App.tooltip('Attributable fraction among the exposed = (RR-1)/RR'));
        html += makeResultItem('PAF', (res.paf * 100).toFixed(1) + '%',
            App.tooltip('Population Attributable Fraction'));
        html += '</div>';

        // Copy button
        html += '<div class="btn-group mt-3">'
            + '<button class="btn btn-secondary" onclick="EpiCalcModule.copy2x2()">Copy All Results</button></div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('epi-2x2-results'), html);

        window._epi2x2 = { a: a, b: b, c: c, d: d, res: res };
        Export.addToHistory(MODULE_ID, { tab: '2x2', a: a, b: b, c: c, d: d }, 'RR=' + res.rr.value.toFixed(2) + ', OR=' + res.or.value.toFixed(2));
    }

    function makeResultItem(label, value, sub) {
        return '<div class="result-item"><div class="result-item-value">' + value + '</div>'
            + '<div class="result-item-label">' + label + '<br>' + sub + '</div></div>';
    }

    function copy2x2() {
        var r = window._epi2x2;
        if (!r) return;
        var s = r.res;
        var lines = [
            '=== 2x2 Table Analysis ===',
            'a=' + r.a + ' b=' + r.b + ' c=' + r.c + ' d=' + r.d,
            'Risk (Exposed): ' + (s.p1 * 100).toFixed(2) + '%',
            'Risk (Unexposed): ' + (s.p2 * 100).toFixed(2) + '%',
            'RR: ' + s.rr.value.toFixed(4) + ' ' + Statistics.formatCI(s.rr.ci.lower, s.rr.ci.upper, 4),
            'OR: ' + s.or.value.toFixed(4) + ' ' + Statistics.formatCI(s.or.ci.lower, s.or.ci.upper, 4),
            'RD: ' + (s.rd.value * 100).toFixed(2) + '% ' + Statistics.formatCI(s.rd.ci.lower * 100, s.rd.ci.upper * 100, 2),
            'Chi-sq: ' + s.chi2.chi2.toFixed(3) + ', p=' + Statistics.formatPValue(s.chi2.pValue),
            'Fisher p=' + Statistics.formatPValue(s.fisher.pValue),
            'AF(exposed): ' + (s.afExposed * 100).toFixed(1) + '%',
            'PAF: ' + (s.paf * 100).toFixed(1) + '%'
        ];
        Export.copyText(lines.join('\n'));
    }

    // ================================================================
    // TAB B: STRATIFIED (MH)
    // ================================================================

    function buildMHInputs() {
        var k = parseInt(document.getElementById('epi_mh_k').value, 10) || 3;
        var html = '<table class="data-table mt-2" style="max-width:600px">'
            + '<thead><tr><th>Stratum</th><th>a</th><th>b</th><th>c</th><th>d</th></tr></thead><tbody>';
        var defaults = [
            [10, 40, 5, 45],
            [20, 30, 15, 35],
            [8, 42, 3, 47],
            [12, 38, 8, 42],
            [6, 44, 2, 48]
        ];
        for (var i = 0; i < k; i++) {
            var def = defaults[i] || [10, 40, 5, 45];
            html += '<tr><td>' + (i + 1) + '</td>';
            ['a', 'b', 'c', 'd'].forEach(function (cell, ci) {
                html += '<td><input type="number" class="form-input form-input--small" id="epi_mh_' + i + '_' + cell + '" value="' + def[ci] + '" min="0" style="width:70px"></td>';
            });
            html += '</tr>';
        }
        html += '</tbody></table>';
        App.setTrustedHTML(document.getElementById('epi-mh-inputs'), html);
    }

    function calcMH() {
        var k = parseInt(document.getElementById('epi_mh_k').value, 10) || 3;
        var measure = document.getElementById('epi_mh_measure').value;
        var tables = [];
        for (var i = 0; i < k; i++) {
            var a = parseInt(document.getElementById('epi_mh_' + i + '_a').value, 10);
            var b = parseInt(document.getElementById('epi_mh_' + i + '_b').value, 10);
            var c = parseInt(document.getElementById('epi_mh_' + i + '_c').value, 10);
            var d = parseInt(document.getElementById('epi_mh_' + i + '_d').value, 10);
            if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) { Export.showToast('Fill all cells for stratum ' + (i + 1), 'error'); return; }
            tables.push({ a: a, b: b, c: c, d: d });
        }

        var mh = Statistics.mantelHaenszel(tables, measure);
        if (!mh) { Export.showToast('Calculation error', 'error'); return; }

        // Crude (unstratified) pooled table
        var crudeA = 0, crudeB = 0, crudeC = 0, crudeD = 0;
        tables.forEach(function (t) { crudeA += t.a; crudeB += t.b; crudeC += t.c; crudeD += t.d; });
        var crude = Statistics.twoByTwo(crudeA, crudeB, crudeC, crudeD);
        var crudeEst = measure === 'OR' ? crude.or.value : crude.rr.value;

        // Confounding assessment
        var pctChange = Math.abs(crudeEst - mh.estimate) / crudeEst * 100;
        var confoundingLabel = pctChange > 10 ? 'Meaningful confounding likely (>' + 10 + '% change)' : 'Minimal confounding (<10% change)';

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + measure + ' (MH) = ' + mh.estimate.toFixed(3) + '</div>';
        html += '<div class="result-label">95% CI: ' + Statistics.formatCI(mh.ci.lower, mh.ci.upper, 3) + '</div>';

        // Stratum estimates
        html += '<div class="card-title mt-3">Stratum-Specific Estimates</div>';
        html += '<table class="data-table"><thead><tr><th>Stratum</th><th>a</th><th>b</th><th>c</th><th>d</th><th>' + measure + '</th></tr></thead><tbody>';
        tables.forEach(function (t, i) {
            var est = measure === 'OR' ? (t.a * t.d) / (t.b * t.c) : (t.a / (t.a + t.b)) / (t.c / (t.c + t.d));
            html += '<tr><td>' + (i + 1) + '</td><td class="num">' + t.a + '</td><td class="num">' + t.b + '</td><td class="num">' + t.c + '</td><td class="num">' + t.d + '</td>'
                + '<td class="num highlight">' + est.toFixed(3) + '</td></tr>';
        });
        html += '</tbody></table>';

        // Breslow-Day
        if (mh.breslowDay) {
            html += '<div class="card-title mt-3">Breslow-Day Test for Homogeneity</div>';
            html += '<div class="result-grid">';
            html += makeResultItem('Statistic', mh.breslowDay.statistic.toFixed(2), 'df = ' + mh.breslowDay.df);
            html += makeResultItem('p-value', Statistics.formatPValue(mh.breslowDay.pValue),
                mh.breslowDay.pValue < 0.05 ? 'Significant heterogeneity' : 'No significant heterogeneity');
            html += '</div>';
        }

        // Confounding assessment
        html += '<div class="card-title mt-3">Confounding Assessment</div>';
        html += '<div class="result-grid">';
        html += makeResultItem('Crude ' + measure, crudeEst.toFixed(3), 'Pooled (unstratified)');
        html += makeResultItem('Adjusted ' + measure, mh.estimate.toFixed(3), 'Mantel-Haenszel');
        html += makeResultItem('% Change', pctChange.toFixed(1) + '%', confoundingLabel);
        html += '</div>';

        // Copy
        html += '<div class="btn-group mt-3"><button class="btn btn-secondary" onclick="EpiCalcModule.copyMH()">Copy Results</button></div>';
        html += '</div>';

        App.setTrustedHTML(document.getElementById('epi-mh-results'), html);

        window._epiMH = { mh: mh, crudeEst: crudeEst, pctChange: pctChange, measure: measure, k: k };
        Export.addToHistory(MODULE_ID, { tab: 'MH', measure: measure, k: k }, measure + '(MH)=' + mh.estimate.toFixed(3));
    }

    function copyMH() {
        var r = window._epiMH;
        if (!r) return;
        var lines = [
            '=== Mantel-Haenszel Stratified Analysis ===',
            'Measure: ' + r.measure,
            'Strata: ' + r.k,
            'Crude ' + r.measure + ': ' + r.crudeEst.toFixed(4),
            'Adjusted ' + r.measure + ' (MH): ' + r.mh.estimate.toFixed(4) + ' ' + Statistics.formatCI(r.mh.ci.lower, r.mh.ci.upper, 4),
            '% Change: ' + r.pctChange.toFixed(1) + '%'
        ];
        if (r.mh.breslowDay) {
            lines.push('Breslow-Day: ' + r.mh.breslowDay.statistic.toFixed(3) + ', p=' + Statistics.formatPValue(r.mh.breslowDay.pValue));
        }
        Export.copyText(lines.join('\n'));
    }

    // ================================================================
    // TAB C: INTERACTION
    // ================================================================

    function calcInteraction() {
        var rr11 = parseFloat(document.getElementById('epi_rr11').value);
        var rr10 = parseFloat(document.getElementById('epi_rr10').value);
        var rr01 = parseFloat(document.getElementById('epi_rr01').value);
        if (isNaN(rr11) || isNaN(rr10) || isNaN(rr01)) { Export.showToast('Enter all RR values', 'error'); return; }

        var add = Statistics.additiveInteraction(rr11, rr10, rr01);

        // Multiplicative interaction
        var expectedMultRR = rr10 * rr01;
        var multRatio = rr11 / expectedMultRR;

        var html = '<div class="result-panel animate-in">';

        // Joint effects table
        html += '<div class="card-title mt-2">Joint Effects Table</div>';
        html += '<table class="data-table" style="max-width:400px;margin:0 auto 1rem">'
            + '<thead><tr><th></th><th>Factor B +</th><th>Factor B &minus;</th></tr></thead>'
            + '<tbody>'
            + '<tr><td><strong>Factor A +</strong></td><td class="num highlight">' + rr11.toFixed(2) + '</td><td class="num">' + rr10.toFixed(2) + '</td></tr>'
            + '<tr><td><strong>Factor A &minus;</strong></td><td class="num">' + rr01.toFixed(2) + '</td><td class="num">1.00 (ref)</td></tr>'
            + '</tbody></table>';

        // Additive interaction
        html += '<div class="card-title mt-3">Additive Interaction</div>';
        html += '<div class="result-grid">';
        html += makeResultItem('RERI', add.reri.toFixed(3),
            App.tooltip('Relative Excess Risk due to Interaction = RR11 - RR10 - RR01 + 1. 0 = no additive interaction.') + '<br>'
            + (Math.abs(add.reri) < 0.1 ? 'No meaningful additive interaction' : (add.reri > 0 ? 'Positive (synergistic)' : 'Negative (antagonistic)')));
        html += makeResultItem('AP', add.ap.toFixed(3),
            App.tooltip('Attributable Proportion due to Interaction = RERI / RR11. 0 = no interaction.'));
        html += makeResultItem('S', isFinite(add.s) ? add.s.toFixed(3) : 'Undefined',
            App.tooltip('Synergy Index = (RR11-1)/((RR10-1)+(RR01-1)). 1 = no interaction; >1 synergism; <1 antagonism.') + '<br>'
            + (isFinite(add.s) ? (Math.abs(add.s - 1) < 0.1 ? 'No interaction' : (add.s > 1 ? 'Synergism' : 'Antagonism')) : ''));
        html += '</div>';

        // Multiplicative interaction
        html += '<div class="card-title mt-3">Multiplicative Interaction</div>';
        html += '<div class="result-grid">';
        html += makeResultItem('Expected RR (multiplicative)', expectedMultRR.toFixed(3),
            'RR\u2081\u2080 &times; RR\u2080\u2081 = ' + rr10.toFixed(2) + ' &times; ' + rr01.toFixed(2));
        html += makeResultItem('Observed RR\u2081\u2081', rr11.toFixed(3), '');
        html += makeResultItem('Ratio', multRatio.toFixed(3),
            App.tooltip('Observed/Expected under multiplicativity. 1 = no multiplicative interaction.') + '<br>'
            + (Math.abs(multRatio - 1) < 0.1 ? 'No multiplicative interaction' : (multRatio > 1 ? 'Super-multiplicative' : 'Sub-multiplicative')));
        html += '</div>';

        // Interpretation guide
        html += '<div class="card-title mt-3">Interpretation Guide</div>';
        html += '<div class="text-output" style="font-size:0.85rem;line-height:1.7">'
            + '<strong>Additive interaction</strong> (public health perspective): RERI &gt; 0 and S &gt; 1 suggest synergism. Relevant for absolute risk and intervention targeting.<br>'
            + '<strong>Multiplicative interaction</strong> (statistical model perspective): Ratio &ne; 1 indicates departure from multiplicative model. Reported in logistic/Cox regression as product term.<br>'
            + '<strong>Note:</strong> Additive and multiplicative interaction can give different conclusions for the same data. Both should be reported.'
            + '</div>';

        // Copy
        html += '<div class="btn-group mt-3"><button class="btn btn-secondary" onclick="EpiCalcModule.copyInteraction()">Copy Results</button></div>';
        html += '</div>';

        App.setTrustedHTML(document.getElementById('epi-interaction-results'), html);

        window._epiInteraction = { rr11: rr11, rr10: rr10, rr01: rr01, add: add, multRatio: multRatio, expectedMultRR: expectedMultRR };
        Export.addToHistory(MODULE_ID, { tab: 'interaction', rr11: rr11, rr10: rr10, rr01: rr01 }, 'RERI=' + add.reri.toFixed(2) + ', S=' + (isFinite(add.s) ? add.s.toFixed(2) : 'undef'));
    }

    function copyInteraction() {
        var r = window._epiInteraction;
        if (!r) return;
        var lines = [
            '=== Interaction Assessment ===',
            'RR11=' + r.rr11.toFixed(3) + '  RR10=' + r.rr10.toFixed(3) + '  RR01=' + r.rr01.toFixed(3),
            'RERI: ' + r.add.reri.toFixed(4),
            'AP: ' + r.add.ap.toFixed(4),
            'S: ' + (isFinite(r.add.s) ? r.add.s.toFixed(4) : 'Undefined'),
            'Multiplicative ratio: ' + r.multRatio.toFixed(4),
            'Expected (multiplicative): ' + r.expectedMultRR.toFixed(4)
        ];
        Export.copyText(lines.join('\n'));
    }

    // ================================================================
    // TAB D: DOSE-RESPONSE
    // ================================================================

    function buildDRInputs() {
        var k = parseInt(document.getElementById('epi_dr_k').value, 10) || 4;
        var html = '<table class="data-table mt-2" style="max-width:550px">'
            + '<thead><tr><th>Group</th><th>Events</th><th>Total N</th><th>Score ' + App.tooltip('Numeric trend score (e.g. 0,1,2,3 for dose levels or midpoints)') + '</th></tr></thead><tbody>';
        var defEvents = [5, 12, 20, 30, 40, 50, 55, 60, 65, 70];
        var defTotals = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
        for (var i = 0; i < k; i++) {
            html += '<tr><td>' + (i + 1) + '</td>'
                + '<td><input type="number" class="form-input form-input--small" id="epi_dr_ev_' + i + '" value="' + (defEvents[i] || 10) + '" min="0" style="width:70px"></td>'
                + '<td><input type="number" class="form-input form-input--small" id="epi_dr_n_' + i + '" value="' + (defTotals[i] || 100) + '" min="1" style="width:70px"></td>'
                + '<td><input type="number" class="form-input form-input--small" id="epi_dr_s_' + i + '" value="' + i + '" step="0.5" style="width:70px"></td>'
                + '</tr>';
        }
        html += '</tbody></table>';
        App.setTrustedHTML(document.getElementById('epi-dr-inputs'), html);
    }

    function calcDoseResponse() {
        var k = parseInt(document.getElementById('epi_dr_k').value, 10) || 4;
        var counts = [], totals = [], scores = [];
        for (var i = 0; i < k; i++) {
            var ev = parseInt(document.getElementById('epi_dr_ev_' + i).value, 10);
            var n = parseInt(document.getElementById('epi_dr_n_' + i).value, 10);
            var s = parseFloat(document.getElementById('epi_dr_s_' + i).value);
            if (isNaN(ev) || isNaN(n) || isNaN(s)) { Export.showToast('Fill all fields for group ' + (i + 1), 'error'); return; }
            counts.push(ev);
            totals.push(n);
            scores.push(s);
        }

        var result = Statistics.cochranArmitageTrend(counts, totals, scores);

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">z = ' + result.z.toFixed(3) + '</div>';
        html += '<div class="result-label">Cochran-Armitage Trend Test, p = ' + Statistics.formatPValue(result.pValue) + '</div>';

        // Group summary table
        html += '<div class="card-title mt-3">Group Summary</div>';
        html += '<table class="data-table"><thead><tr><th>Group</th><th>Score</th><th>Events</th><th>Total</th><th>Rate (%)</th></tr></thead><tbody>';
        for (var i = 0; i < k; i++) {
            var rate = (counts[i] / totals[i] * 100).toFixed(1);
            html += '<tr><td>' + (i + 1) + '</td><td class="num">' + scores[i] + '</td><td class="num">' + counts[i] + '</td><td class="num">' + totals[i] + '</td><td class="num highlight">' + rate + '</td></tr>';
        }
        html += '</tbody></table>';

        // Trend visualization
        html += '<div class="chart-container"><canvas id="epi-trend-chart" width="600" height="300"></canvas></div>';
        html += '<div class="chart-actions"><button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'epi-trend-chart\'),\'dose-response.png\')">Export PNG</button></div>';

        // Interpretation
        html += '<div class="card-title mt-3">Interpretation</div>';
        html += '<div class="text-output" style="font-size:0.85rem">';
        if (result.pValue < 0.05) {
            html += 'There is a <strong>statistically significant linear trend</strong> in event rates across exposure groups '
                + '(z = ' + result.z.toFixed(3) + ', p = ' + Statistics.formatPValue(result.pValue) + '). '
                + 'The event rate ' + (result.z > 0 ? 'increases' : 'decreases') + ' with increasing exposure score.';
        } else {
            html += 'There is <strong>no statistically significant linear trend</strong> in event rates across exposure groups '
                + '(z = ' + result.z.toFixed(3) + ', p = ' + Statistics.formatPValue(result.pValue) + '). '
                + 'This does not exclude a non-linear relationship.';
        }
        html += '</div>';

        // Copy
        html += '<div class="btn-group mt-3"><button class="btn btn-secondary" onclick="EpiCalcModule.copyDR()">Copy Results</button></div>';
        html += '</div>';

        App.setTrustedHTML(document.getElementById('epi-dr-results'), html);

        // Draw trend chart
        setTimeout(function () {
            var canvas = document.getElementById('epi-trend-chart');
            if (!canvas) return;
            var points = [];
            for (var i = 0; i < k; i++) {
                points.push({ x: scores[i], y: counts[i] / totals[i] * 100 });
            }
            Charts.LineChart(canvas, {
                data: [{ label: 'Event Rate', points: points }],
                xLabel: 'Exposure Score',
                yLabel: 'Event Rate (%)',
                title: 'Dose-Response Trend (p = ' + Statistics.formatPValue(result.pValue) + ')',
                yMin: 0,
                width: 600,
                height: 300
            });
        }, 80);

        window._epiDR = { result: result, counts: counts, totals: totals, scores: scores, k: k };
        Export.addToHistory(MODULE_ID, { tab: 'doseResponse', k: k }, 'z=' + result.z.toFixed(2) + ', p=' + Statistics.formatPValue(result.pValue));
    }

    function copyDR() {
        var r = window._epiDR;
        if (!r) return;
        var lines = [
            '=== Cochran-Armitage Trend Test ===',
            'Groups: ' + r.k,
            'z = ' + r.result.z.toFixed(4),
            'p = ' + Statistics.formatPValue(r.result.pValue),
            '',
            'Group\tScore\tEvents\tTotal\tRate'
        ];
        for (var i = 0; i < r.k; i++) {
            lines.push((i + 1) + '\t' + r.scores[i] + '\t' + r.counts[i] + '\t' + r.totals[i] + '\t' + (r.counts[i] / r.totals[i] * 100).toFixed(1) + '%');
        }
        Export.copyText(lines.join('\n'));
    }

    // ================================================================
    // TAB E: BIAS CHECKLIST
    // ================================================================

    function buildBiasChecklist() {
        var biases = References.biases;
        if (!biases || biases.length === 0) return '<p class="text-secondary">No bias data available.</p>';

        var html = '<div class="mt-2">';
        biases.forEach(function (bias, idx) {
            html += '<div class="expandable-header" onclick="this.classList.toggle(\'open\')" style="margin-bottom:2px">'
                + '<span style="display:inline-block;width:22px;text-align:center;font-weight:700;color:var(--accent)">' + (idx + 1) + '</span> '
                + bias.name
                + '</div>'
                + '<div class="expandable-body" style="padding:0.75rem 1rem 0.75rem 2rem;font-size:0.9rem;line-height:1.6">'
                + '<p><strong>Definition:</strong> ' + bias.description + '</p>'
                + '<p style="margin-top:0.3rem"><strong>Stroke Example:</strong> <span style="color:var(--text-secondary)">' + bias.strokeExample + '</span></p>'
                + '<p style="margin-top:0.3rem"><strong>Mitigation:</strong> <span style="color:var(--success)">' + bias.mitigation + '</span></p>'
                + '</div>';
        });
        html += '</div>';
        return html;
    }

    // ================================================================
    // REGISTER
    // ================================================================

    App.registerModule(MODULE_ID, { render: render });

    window.EpiCalcModule = {
        switchTab: switchTab,
        calc2x2: calc2x2,
        copy2x2: copy2x2,
        buildMHInputs: buildMHInputs,
        calcMH: calcMH,
        copyMH: copyMH,
        calcInteraction: calcInteraction,
        copyInteraction: copyInteraction,
        buildDRInputs: buildDRInputs,
        calcDoseResponse: calcDoseResponse,
        copyDR: copyDR
    };
})();
