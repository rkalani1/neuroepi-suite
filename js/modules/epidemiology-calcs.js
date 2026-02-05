/**
 * Neuro-Epi — Epidemiology Calculators Module
 * Tab A: 2x2 Table Analyzer
 * Tab B: Stratified Analysis (Mantel-Haenszel)
 * Tab C: Interaction Assessment (additive & multiplicative)
 * Tab D: Dose-Response (Cochran-Armitage trend test)
 * Tab E: Bias Checklist (catalog with clinical examples)
 * Tab F: Case-Control Analysis (matched/unmatched OR, Cornfield CI)
 * Tab G: Screening Metrics (PPV/NPV given prevalence, sensitivity, specificity)
 * Tab H: Population Attributable Fraction (multiple exposure levels)
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
            'Core epidemiological analyses: 2\u00D72 tables, stratified (Mantel-Haenszel) analysis, interaction assessment, dose-response trend tests, case-control analysis, screening metrics, population attributable fraction, and a comprehensive bias catalog.'
        );

        html += '<div class="card">';
        html += '<div class="tabs" id="epi-tabs" style="flex-wrap:wrap;">'
            + '<button class="tab active" data-tab="twobytwo" onclick="EpiCalcModule.switchTab(\'twobytwo\')">2&times;2 Table</button>'
            + '<button class="tab" data-tab="stratified" onclick="EpiCalcModule.switchTab(\'stratified\')">Stratified (MH)</button>'
            + '<button class="tab" data-tab="interaction" onclick="EpiCalcModule.switchTab(\'interaction\')">Interaction</button>'
            + '<button class="tab" data-tab="doseresponse" onclick="EpiCalcModule.switchTab(\'doseresponse\')">Dose-Response</button>'
            + '<button class="tab" data-tab="casecontrol" onclick="EpiCalcModule.switchTab(\'casecontrol\')">Case-Control</button>'
            + '<button class="tab" data-tab="screening" onclick="EpiCalcModule.switchTab(\'screening\')">Screening Metrics</button>'
            + '<button class="tab" data-tab="paf" onclick="EpiCalcModule.switchTab(\'paf\')">PAF (Multi-level)</button>'
            + '<button class="tab" data-tab="bias" onclick="EpiCalcModule.switchTab(\'bias\')">Bias Checklist</button>'
            + '</div>';

        // ============================================================
        // TAB A: 2x2 Table Analyzer
        // ============================================================
        html += '<div class="tab-content active" id="epi-tab-twobytwo">';
        html += '<div class="card-subtitle">Enter cell counts from a 2&times;2 table. All effect measures, CIs, and tests are computed simultaneously.</div>';

        html += '<div class="table-scroll-wrap"><table class="data-table" style="max-width:450px;margin:0 auto 1rem">'
            + '<thead><tr><th></th><th>Disease (+)</th><th>Disease (&minus;)</th></tr></thead>'
            + '<tbody>'
            + '<tr><td><strong>Exposed</strong></td>'
            + '<td><input type="number" class="form-input form-input--small" id="epi_a" name="epi_a" value="30" min="0" style="width:80px"></td>'
            + '<td><input type="number" class="form-input form-input--small" id="epi_b" name="epi_b" value="70" min="0" style="width:80px"></td></tr>'
            + '<tr><td><strong>Unexposed</strong></td>'
            + '<td><input type="number" class="form-input form-input--small" id="epi_c" name="epi_c" value="15" min="0" style="width:80px"></td>'
            + '<td><input type="number" class="form-input form-input--small" id="epi_d" name="epi_d" value="85" min="0" style="width:80px"></td></tr>'
            + '</tbody></table></div>';

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

        html += '<div class="table-scroll-wrap"><table class="data-table" style="max-width:450px;margin:0 auto 1rem">'
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
            + '</tbody></table></div>';

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
        // TAB F: Case-Control Analysis
        // ============================================================
        html += '<div class="tab-content" id="epi-tab-casecontrol">';
        html += '<div class="card-subtitle">Compute matched and unmatched odds ratios for case-control studies with Cornfield exact confidence intervals and conditional logistic regression reference.</div>';

        // Unmatched section
        html += '<div class="card-title mt-2">Unmatched Case-Control</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table" style="max-width:450px;margin:0 auto 1rem">'
            + '<thead><tr><th></th><th>Cases</th><th>Controls</th></tr></thead>'
            + '<tbody>'
            + '<tr><td><strong>Exposed</strong></td>'
            + '<td><input type="number" class="form-input form-input--small" id="epi_cc_a" value="40" min="0" style="width:80px"></td>'
            + '<td><input type="number" class="form-input form-input--small" id="epi_cc_b" value="20" min="0" style="width:80px"></td></tr>'
            + '<tr><td><strong>Unexposed</strong></td>'
            + '<td><input type="number" class="form-input form-input--small" id="epi_cc_c" value="60" min="0" style="width:80px"></td>'
            + '<td><input type="number" class="form-input form-input--small" id="epi_cc_d" value="80" min="0" style="width:80px"></td></tr>'
            + '</tbody></table></div>';

        // Matched section
        html += '<div class="card-title mt-3">Matched Case-Control (1:1 Pairs)</div>';
        html += '<div class="card-subtitle">Enter discordant and concordant pairs for matched analysis.</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table" style="max-width:450px;margin:0 auto 1rem">'
            + '<thead><tr><th></th><th>Control Exposed</th><th>Control Unexposed</th></tr></thead>'
            + '<tbody>'
            + '<tr><td><strong>Case Exposed</strong></td>'
            + '<td><input type="number" class="form-input form-input--small" id="epi_cc_m_a" value="25" min="0" style="width:80px">'
            + '<div class="text-secondary" style="font-size:0.7rem">Concordant (+/+)</div></td>'
            + '<td><input type="number" class="form-input form-input--small" id="epi_cc_m_b" value="35" min="0" style="width:80px">'
            + '<div class="text-secondary" style="font-size:0.7rem">Discordant</div></td></tr>'
            + '<tr><td><strong>Case Unexposed</strong></td>'
            + '<td><input type="number" class="form-input form-input--small" id="epi_cc_m_c" value="10" min="0" style="width:80px">'
            + '<div class="text-secondary" style="font-size:0.7rem">Discordant</div></td>'
            + '<td><input type="number" class="form-input form-input--small" id="epi_cc_m_d" value="30" min="0" style="width:80px">'
            + '<div class="text-secondary" style="font-size:0.7rem">Concordant (-/-)</div></td></tr>'
            + '</tbody></table></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="EpiCalcModule.calcCaseControl()">Analyze Case-Control</button>'
            + '</div>';
        html += '<div id="epi-cc-results"></div>';
        html += '</div>';

        // ============================================================
        // TAB G: Screening Metrics
        // ============================================================
        html += '<div class="tab-content" id="epi-tab-screening">';
        html += '<div class="card-subtitle">Calculate PPV, NPV, and other screening metrics from known sensitivity, specificity, and disease prevalence.</div>';

        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Sensitivity (%) ' + App.tooltip('True positive rate of the screening test') + '</label>'
            + '<input type="number" class="form-input" id="epi_scr_sens" step="0.1" min="0" max="100" value="90"></div>'
            + '<div class="form-group"><label class="form-label">Specificity (%) ' + App.tooltip('True negative rate of the screening test') + '</label>'
            + '<input type="number" class="form-input" id="epi_scr_spec" step="0.1" min="0" max="100" value="95"></div>'
            + '<div class="form-group"><label class="form-label">Prevalence (%) ' + App.tooltip('Disease prevalence in the screened population') + '</label>'
            + '<input type="number" class="form-input" id="epi_scr_prev" step="0.1" min="0.01" max="100" value="5"></div>'
            + '</div>';

        html += '<div class="form-group"><label class="form-label">Population Size (optional, for absolute counts)</label>'
            + '<input type="number" class="form-input" id="epi_scr_n" step="1" min="1" value="10000" style="max-width:200px"></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="EpiCalcModule.calcScreening()">Calculate Screening Metrics</button>'
            + '</div>';
        html += '<div id="epi-scr-results"></div>';
        html += '</div>';

        // ============================================================
        // TAB H: Population Attributable Fraction (Multi-level)
        // ============================================================
        html += '<div class="tab-content" id="epi-tab-paf">';
        html += '<div class="card-subtitle">Calculate population attributable fraction (PAF) with multiple exposure levels. Uses the Levin formula generalized for polytomous exposures.</div>';

        html += '<div class="form-group"><label class="form-label">Number of Exposure Levels (excluding reference)</label>'
            + '<input type="number" class="form-input" id="epi_paf_k" step="1" min="1" max="10" value="3" onchange="EpiCalcModule.buildPAFInputs()" style="max-width:150px"></div>';
        html += '<div id="epi-paf-inputs"></div>';
        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="EpiCalcModule.calcPAF()">Calculate PAF</button>'
            + '</div>';
        html += '<div id="epi-paf-results"></div>';
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
            + '<div><strong>PAF (multi-level):</strong> \u03A3 p\u1D62(RR\u1D62 \u2212 1) / [1 + \u03A3 p\u1D62(RR\u1D62 \u2212 1)]</div>'
            + '<div><strong>Matched OR:</strong> b / c (ratio of discordant pairs)</div>'
            + '<div><strong>Cornfield CI:</strong> Exact CI for OR via iterative solution</div>'
            + '</div>';

        html += '<div class="card-subtitle" style="font-weight:600;">Screening Metrics</div>';
        html += '<div style="background:var(--bg-secondary);padding:12px;border-radius:8px;font-family:var(--font-mono);margin-bottom:12px;">'
            + '<div><strong>PPV:</strong> (Sens \u00D7 Prev) / (Sens \u00D7 Prev + (1 \u2212 Spec) \u00D7 (1 \u2212 Prev))</div>'
            + '<div><strong>NPV:</strong> (Spec \u00D7 (1 \u2212 Prev)) / ((1 \u2212 Sens) \u00D7 Prev + Spec \u00D7 (1 \u2212 Prev))</div>'
            + '</div>';

        html += '<div class="card-subtitle" style="font-weight:600;">Common Pitfalls</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li><strong>Prevalence vs incidence:</strong> Prevalence includes old and new cases; incidence counts only new cases</li>'
            + '<li><strong>OR \u2248 RR only when outcome is rare:</strong> When prevalence >10%, OR overestimates RR</li>'
            + '<li><strong>Person-time denominators:</strong> Require knowing exact follow-up per individual</li>'
            + '<li><strong>PAR depends on prevalence:</strong> A strong association with a rare exposure has small population impact</li>'
            + '<li><strong>Matched analyses require paired methods:</strong> Standard 2x2 analysis is incorrect for matched data</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">References</div>';
        html += '<ul style="margin:0 0 0 16px;font-size:0.85rem;">'
            + '<li>Rothman KJ, et al. <em>Modern Epidemiology</em>. 4th ed. Wolters Kluwer; 2021.</li>'
            + '<li>Szklo M, Nieto FJ. <em>Epidemiology: Beyond the Basics</em>. 4th ed. Jones & Bartlett; 2019.</li>'
            + '<li>Cornfield J. A method of estimating comparative rates. <em>J Am Stat Assoc</em>. 1956;51:276-88.</li>'
            + '</ul>';
        html += '</div></div>';

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);

        // Build dynamic inputs on first render
        setTimeout(function () {
            buildMHInputs();
            buildDRInputs();
            buildPAFInputs();
        }, 30);
    }

    // ================================================================
    // TAB SWITCHING
    // ================================================================

    function switchTab(tabId) {
        document.querySelectorAll('#epi-tabs .tab').forEach(function (t) {
            t.classList.toggle('active', t.dataset.tab === tabId);
        });
        var tabIds = ['twobytwo', 'stratified', 'interaction', 'doseresponse', 'casecontrol', 'screening', 'paf', 'bias'];
        tabIds.forEach(function (id) {
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
        html += '<div class="table-scroll-wrap"><table class="data-table" style="max-width:500px">'
            + '<thead><tr><th></th><th>D+</th><th>D&minus;</th><th>Total</th><th>Risk</th></tr></thead>'
            + '<tbody>'
            + '<tr><td><strong>Exposed</strong></td><td class="num">' + a + '</td><td class="num">' + b + '</td><td class="num">' + n1 + '</td><td class="num highlight">' + (res.p1 * 100).toFixed(1) + '%</td></tr>'
            + '<tr><td><strong>Unexposed</strong></td><td class="num">' + c + '</td><td class="num">' + d + '</td><td class="num">' + n2 + '</td><td class="num highlight">' + (res.p2 * 100).toFixed(1) + '%</td></tr>'
            + '<tr style="border-top:2px solid var(--border)"><td><strong>Total</strong></td><td class="num">' + (a + c) + '</td><td class="num">' + (b + d) + '</td><td class="num">' + n + '</td><td></td></tr>'
            + '</tbody></table></div>';

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

        // Copy + Methods + R Script buttons
        html += '<div class="btn-group mt-3">'
            + '<button class="btn btn-secondary" onclick="EpiCalcModule.copy2x2()">Copy All Results</button>'
            + '<button class="btn btn-secondary" onclick="EpiCalcModule.genMethods2x2()">Generate Methods Text</button>'
            + '<button class="btn btn-sm r-script-btn" '
            + 'onclick="RGenerator.showScript(RGenerator.epiTwoByTwo({a:' + a + ',b:' + b + ',c:' + c + ',d:' + d + '}), \'Epidemiology — 2×2 Table Analysis\')">'
            + '&#129513; Generate R Script</button>'
            + '</div>';
        html += '<div id="epi-2x2-methods" class="mt-2"></div>';

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

    function genMethods2x2() {
        var r = window._epi2x2;
        if (!r) { Export.showToast('Run analysis first', 'error'); return; }
        var s = r.res;
        var n = r.a + r.b + r.c + r.d;
        var text = 'A 2x2 contingency table analysis was performed on ' + n + ' subjects. '
            + 'The risk in the exposed group was ' + (s.p1 * 100).toFixed(1) + '% compared to '
            + (s.p2 * 100).toFixed(1) + '% in the unexposed group. '
            + 'The risk ratio was ' + s.rr.value.toFixed(2) + ' (95% CI, '
            + s.rr.ci.lower.toFixed(2) + ' to ' + s.rr.ci.upper.toFixed(2) + ') '
            + 'and the odds ratio was ' + s.or.value.toFixed(2) + ' (95% CI, '
            + s.or.ci.lower.toFixed(2) + ' to ' + s.or.ci.upper.toFixed(2) + '). '
            + 'The risk difference was ' + (s.rd.value * 100).toFixed(1) + '% '
            + '(Newcombe 95% CI, ' + (s.rd.newcombe.lower * 100).toFixed(1) + '% to ' + (s.rd.newcombe.upper * 100).toFixed(1) + '%). '
            + 'The chi-squared test statistic was ' + s.chi2.chi2.toFixed(2)
            + ' (p ' + Statistics.formatPValue(s.chi2.pValue) + '); '
            + 'Fisher exact p ' + Statistics.formatPValue(s.fisher.pValue) + '. '
            + 'The attributable fraction among the exposed was ' + (s.afExposed * 100).toFixed(1) + '% '
            + 'and the population attributable fraction was ' + (s.paf * 100).toFixed(1) + '%.';
        var el = document.getElementById('epi-2x2-methods');
        if (el) {
            App.setTrustedHTML(el, '<div class="text-output">' + text
                + '<button class="btn btn-xs btn-secondary copy-btn" onclick="Export.copyText(document.getElementById(\'epi-2x2-methods\').querySelector(\'.text-output\').textContent.replace(\'Copy\',\'\').trim())">Copy</button></div>');
        }
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
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Stratum</th><th>a</th><th>b</th><th>c</th><th>d</th><th>' + measure + '</th></tr></thead><tbody>';
        tables.forEach(function (t, i) {
            var est = measure === 'OR' ? (t.a * t.d) / (t.b * t.c) : (t.a / (t.a + t.b)) / (t.c / (t.c + t.d));
            html += '<tr><td>' + (i + 1) + '</td><td class="num">' + t.a + '</td><td class="num">' + t.b + '</td><td class="num">' + t.c + '</td><td class="num">' + t.d + '</td>'
                + '<td class="num highlight">' + est.toFixed(3) + '</td></tr>';
        });
        html += '</tbody></table></div>';

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

        // Copy + Methods
        html += '<div class="btn-group mt-3">'
            + '<button class="btn btn-secondary" onclick="EpiCalcModule.copyMH()">Copy Results</button>'
            + '<button class="btn btn-secondary" onclick="EpiCalcModule.genMethodsMH()">Generate Methods Text</button>'
            + ' <button class="btn btn-sm r-script-btn" onclick="EpiCalcModule.genRScriptMH()">&#129513; R Script</button>'
            + '</div>';
        html += '<div id="epi-mh-methods" class="mt-2"></div>';
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

    function genMethodsMH() {
        var r = window._epiMH;
        if (!r) { Export.showToast('Run analysis first', 'error'); return; }
        var text = 'Stratified analysis using the Mantel-Haenszel method was performed across ' + r.k + ' strata. '
            + 'The crude ' + r.measure + ' was ' + r.crudeEst.toFixed(2)
            + ' and the adjusted ' + r.measure + ' (MH) was ' + r.mh.estimate.toFixed(2)
            + ' (95% CI, ' + r.mh.ci.lower.toFixed(2) + ' to ' + r.mh.ci.upper.toFixed(2) + '), '
            + 'representing a ' + r.pctChange.toFixed(1) + '% change after stratification.';
        if (r.mh.breslowDay) {
            text += ' The Breslow-Day test for homogeneity '
                + (r.mh.breslowDay.pValue < 0.05 ? 'was significant' : 'was not significant')
                + ' (p ' + Statistics.formatPValue(r.mh.breslowDay.pValue) + ').';
        }
        var el = document.getElementById('epi-mh-methods');
        if (el) {
            App.setTrustedHTML(el, '<div class="text-output">' + text
                + '<button class="btn btn-xs btn-secondary copy-btn" onclick="Export.copyText(document.getElementById(\'epi-mh-methods\').querySelector(\'.text-output\').textContent.replace(\'Copy\',\'\').trim())">Copy</button></div>');
        }
    }

    function genRScriptMH() {
        var r = window._epiMH;
        if (!r) { Export.showToast('Run analysis first', 'error'); return; }
        // Reconstruct tables from DOM
        var tables = [];
        for (var i = 0; i < r.k; i++) {
            var a = parseInt(document.getElementById('epi_mh_' + i + '_a').value, 10);
            var b = parseInt(document.getElementById('epi_mh_' + i + '_b').value, 10);
            var c = parseInt(document.getElementById('epi_mh_' + i + '_c').value, 10);
            var d = parseInt(document.getElementById('epi_mh_' + i + '_d').value, 10);
            tables.push({ a: a, b: b, c: c, d: d });
        }
        RGenerator.showScript(
            RGenerator.epiMantelHaenszel({ tables: tables, measure: r.measure }),
            'Mantel-Haenszel Stratified Analysis'
        );
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
        html += '<div class="table-scroll-wrap"><table class="data-table" style="max-width:400px;margin:0 auto 1rem">'
            + '<thead><tr><th></th><th>Factor B +</th><th>Factor B &minus;</th></tr></thead>'
            + '<tbody>'
            + '<tr><td><strong>Factor A +</strong></td><td class="num highlight">' + rr11.toFixed(2) + '</td><td class="num">' + rr10.toFixed(2) + '</td></tr>'
            + '<tr><td><strong>Factor A &minus;</strong></td><td class="num">' + rr01.toFixed(2) + '</td><td class="num">1.00 (ref)</td></tr>'
            + '</tbody></table></div>';

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

        // Copy + Methods
        html += '<div class="btn-group mt-3">'
            + '<button class="btn btn-secondary" onclick="EpiCalcModule.copyInteraction()">Copy Results</button>'
            + '<button class="btn btn-secondary" onclick="EpiCalcModule.genMethodsInteraction()">Generate Methods Text</button>'
            + '</div>';
        html += '<div id="epi-interaction-methods" class="mt-2"></div>';
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

    function genMethodsInteraction() {
        var r = window._epiInteraction;
        if (!r) { Export.showToast('Run analysis first', 'error'); return; }
        var text = 'Interaction between two risk factors was assessed on both additive and multiplicative scales. '
            + 'The stratum-specific relative risks were RR11 = ' + r.rr11.toFixed(2) + ', RR10 = ' + r.rr10.toFixed(2)
            + ', and RR01 = ' + r.rr01.toFixed(2) + '. '
            + 'On the additive scale, the RERI was ' + r.add.reri.toFixed(2) + ', AP was ' + r.add.ap.toFixed(2)
            + ', and the synergy index S was ' + (isFinite(r.add.s) ? r.add.s.toFixed(2) : 'undefined') + '. '
            + 'On the multiplicative scale, the ratio of observed to expected RR was ' + r.multRatio.toFixed(2) + '.';
        var el = document.getElementById('epi-interaction-methods');
        if (el) {
            App.setTrustedHTML(el, '<div class="text-output">' + text
                + '<button class="btn btn-xs btn-secondary copy-btn" onclick="Export.copyText(document.getElementById(\'epi-interaction-methods\').querySelector(\'.text-output\').textContent.replace(\'Copy\',\'\').trim())">Copy</button></div>');
        }
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
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Group</th><th>Score</th><th>Events</th><th>Total</th><th>Rate (%)</th></tr></thead><tbody>';
        for (var i = 0; i < k; i++) {
            var rate = (counts[i] / totals[i] * 100).toFixed(1);
            html += '<tr><td>' + (i + 1) + '</td><td class="num">' + scores[i] + '</td><td class="num">' + counts[i] + '</td><td class="num">' + totals[i] + '</td><td class="num highlight">' + rate + '</td></tr>';
        }
        html += '</tbody></table></div>';

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

        // Copy + Methods
        html += '<div class="btn-group mt-3">'
            + '<button class="btn btn-secondary" onclick="EpiCalcModule.copyDR()">Copy Results</button>'
            + '<button class="btn btn-secondary" onclick="EpiCalcModule.genMethodsDR()">Generate Methods Text</button>'
            + '</div>';
        html += '<div id="epi-dr-methods" class="mt-2"></div>';
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

    function genMethodsDR() {
        var r = window._epiDR;
        if (!r) { Export.showToast('Run analysis first', 'error'); return; }
        var text = 'A Cochran-Armitage trend test was used to assess dose-response across '
            + r.k + ' exposure groups. '
            + 'The test statistic was z = ' + r.result.z.toFixed(2)
            + ' (p ' + Statistics.formatPValue(r.result.pValue) + '), '
            + (r.result.pValue < 0.05 ? 'indicating a statistically significant linear trend.' : 'indicating no statistically significant linear trend.');
        var el = document.getElementById('epi-dr-methods');
        if (el) {
            App.setTrustedHTML(el, '<div class="text-output">' + text
                + '<button class="btn btn-xs btn-secondary copy-btn" onclick="Export.copyText(document.getElementById(\'epi-dr-methods\').querySelector(\'.text-output\').textContent.replace(\'Copy\',\'\').trim())">Copy</button></div>');
        }
    }

    // ================================================================
    // TAB F: CASE-CONTROL ANALYSIS
    // ================================================================

    function calcCaseControl() {
        // Unmatched
        var a = parseInt(document.getElementById('epi_cc_a').value, 10);
        var b = parseInt(document.getElementById('epi_cc_b').value, 10);
        var c = parseInt(document.getElementById('epi_cc_c').value, 10);
        var d = parseInt(document.getElementById('epi_cc_d').value, 10);

        // Matched
        var ma = parseInt(document.getElementById('epi_cc_m_a').value, 10);
        var mb = parseInt(document.getElementById('epi_cc_m_b').value, 10);
        var mc = parseInt(document.getElementById('epi_cc_m_c').value, 10);
        var md = parseInt(document.getElementById('epi_cc_m_d').value, 10);

        var html = '<div class="result-panel animate-in">';

        // --- Unmatched Analysis ---
        if (!isNaN(a) && !isNaN(b) && !isNaN(c) && !isNaN(d) && a >= 0 && b >= 0 && c >= 0 && d >= 0) {
            var orUnmatched = (a * d) / (b * c);
            var lnOR = Math.log(orUnmatched);
            var seLnOR = Math.sqrt(1 / a + 1 / b + 1 / c + 1 / d);
            var z = Statistics.normalQuantile(0.975);

            // Woolf (log-based) CI
            var woolfLower = Math.exp(lnOR - z * seLnOR);
            var woolfUpper = Math.exp(lnOR + z * seLnOR);

            // Cornfield exact CI (iterative)
            var cornfield = cornfieldCI(a, b, c, d);

            // Chi-squared and Fisher
            var chi2 = Statistics.chiSquaredTest2x2(a, b, c, d);
            var fisher = Statistics.fisherExact(a, b, c, d);

            html += '<div class="card-title">Unmatched Case-Control Results</div>';
            html += '<div class="result-grid">';
            html += makeResultItem('OR (unmatched)', orUnmatched.toFixed(3), '');
            html += makeResultItem('95% CI (Woolf)', '', '(' + woolfLower.toFixed(3) + ', ' + woolfUpper.toFixed(3) + ')');
            html += makeResultItem('95% CI (Cornfield)', '', '(' + cornfield.lower.toFixed(3) + ', ' + cornfield.upper.toFixed(3) + ')');
            html += makeResultItem('\u03C7\u00B2', chi2.chi2.toFixed(2), 'p = ' + Statistics.formatPValue(chi2.pValue));
            html += makeResultItem('Fisher exact', '', 'p = ' + Statistics.formatPValue(fisher.pValue));
            html += '</div>';

            window._epiCC_unmatched = { a: a, b: b, c: c, d: d, or: orUnmatched, woolf: { lower: woolfLower, upper: woolfUpper }, cornfield: cornfield, chi2: chi2, fisher: fisher };
        }

        // --- Matched Analysis ---
        if (!isNaN(ma) && !isNaN(mb) && !isNaN(mc) && !isNaN(md) && mb >= 0 && mc >= 0) {
            var totalPairs = ma + mb + mc + md;
            var matchedOR = mc > 0 ? mb / mc : Infinity;
            var matchedORDisplay = isFinite(matchedOR) ? matchedOR.toFixed(3) : '\u221E';

            // McNemar test for matched pairs
            var mcnemar = Statistics.mcNemarTest(mb, mc, false);
            var mcnemarExact = (mb + mc) < 25 ? Statistics.mcNemarTest(mb, mc, true) : null;

            // CI for matched OR (log-based)
            var matchedLnOR = isFinite(matchedOR) && matchedOR > 0 ? Math.log(matchedOR) : 0;
            var matchedSeLnOR = mb > 0 && mc > 0 ? Math.sqrt(1 / mb + 1 / mc) : 0;
            var z2 = Statistics.normalQuantile(0.975);
            var matchedCILower = matchedSeLnOR > 0 ? Math.exp(matchedLnOR - z2 * matchedSeLnOR) : 0;
            var matchedCIUpper = matchedSeLnOR > 0 ? Math.exp(matchedLnOR + z2 * matchedSeLnOR) : Infinity;

            html += '<div class="card-title mt-3">Matched Case-Control Results (1:1 Pairs)</div>';
            html += '<div class="result-grid">';
            html += makeResultItem('Total Pairs', totalPairs.toString(), '');
            html += makeResultItem('Discordant Pairs', (mb + mc).toString(), 'b=' + mb + ', c=' + mc);
            html += makeResultItem('Matched OR', matchedORDisplay, 'b/c = ' + mb + '/' + mc);
            if (isFinite(matchedOR) && matchedSeLnOR > 0) {
                html += makeResultItem('95% CI (Matched)', '', '(' + matchedCILower.toFixed(3) + ', ' + matchedCIUpper.toFixed(3) + ')');
            }
            html += makeResultItem('McNemar \u03C7\u00B2', mcnemar.chi2 !== undefined ? mcnemar.chi2.toFixed(2) : '-', 'p = ' + Statistics.formatPValue(mcnemar.pValue));
            if (mcnemarExact) {
                html += makeResultItem('McNemar exact p', Statistics.formatPValue(mcnemarExact.pValue), 'Binomial exact');
            }
            html += '</div>';

            // Conditional logistic regression note
            html += '<div class="card-title mt-3">Conditional Logistic Regression Reference</div>';
            html += '<div class="text-output" style="font-size:0.85rem;line-height:1.7">'
                + '<strong>For matched case-control studies:</strong> The matched OR from discordant pairs is equivalent to the '
                + 'coefficient from conditional logistic regression (CLR) for a single binary exposure. '
                + 'CLR should be used when:<br>'
                + '&bull; M:N matching (not just 1:1)<br>'
                + '&bull; Multiple exposures require simultaneous adjustment<br>'
                + '&bull; Continuous confounders need to be controlled<br>'
                + '<br><strong>In R/SAS:</strong> <code>clogit(case ~ exposure + strata(match_id), data=d)</code> (survival package) '
                + 'or <code>PROC LOGISTIC ... STRATA match_id</code>'
                + '</div>';

            window._epiCC_matched = { ma: ma, mb: mb, mc: mc, md: md, or: matchedOR, mcnemar: mcnemar };
        }

        // Copy + Methods
        html += '<div class="btn-group mt-3">'
            + '<button class="btn btn-secondary" onclick="EpiCalcModule.copyCaseControl()">Copy Results</button>'
            + '<button class="btn btn-secondary" onclick="EpiCalcModule.genMethodsCC()">Generate Methods Text</button>'
            + '</div>';
        html += '<div id="epi-cc-methods" class="mt-2"></div>';
        html += '</div>';

        App.setTrustedHTML(document.getElementById('epi-cc-results'), html);
        Export.addToHistory(MODULE_ID, { tab: 'caseControl' }, 'Case-control analysis');
    }

    // Cornfield exact CI for OR
    function cornfieldCI(a, b, c, d) {
        var or = (a * d) / (b * c);
        var n = a + b + c + d;
        var r1 = a + b;
        var c1 = a + c;
        var z = Statistics.normalQuantile(0.975);

        // Find lower bound by bisection
        function findBound(target, lo, hi) {
            for (var iter = 0; iter < 100; iter++) {
                var mid = (lo + hi) / 2;
                // Under H0: OR = mid, expected a given margins
                var expected = expectedA(mid, r1, c1, n);
                var varA = expectedVarA(expected, r1, c1, n);
                var zStat = (a - expected) / Math.sqrt(varA);
                if (zStat > target) {
                    lo = mid;
                } else {
                    hi = mid;
                }
                if (hi - lo < 1e-8) break;
            }
            return (lo + hi) / 2;
        }

        function expectedA(orVal, r1val, c1val, nval) {
            // Solve for expected a using Newton's method
            var aExp = Math.min(r1val, c1val) / 2;
            for (var iter = 0; iter < 50; iter++) {
                var bExp = r1val - aExp;
                var cExp = c1val - aExp;
                var dExp = nval - r1val - cExp;
                if (bExp <= 0 || cExp <= 0 || dExp <= 0) {
                    aExp = Math.max(0.5, Math.min(aExp, Math.min(r1val, c1val) - 0.5));
                    continue;
                }
                var currentOR = (aExp * dExp) / (bExp * cExp);
                var f = currentOR - orVal;
                var invVar = 1 / aExp + 1 / bExp + 1 / cExp + 1 / dExp;
                var step = f / (currentOR * invVar);
                aExp -= step;
                aExp = Math.max(0.5, Math.min(aExp, Math.min(r1val, c1val) - 0.5));
                if (Math.abs(step) < 1e-10) break;
            }
            return aExp;
        }

        function expectedVarA(aExp, r1val, c1val, nval) {
            var bExp = r1val - aExp;
            var cExp = c1val - aExp;
            var dExp = nval - r1val - cExp;
            if (aExp <= 0 || bExp <= 0 || cExp <= 0 || dExp <= 0) return 1;
            return 1 / (1 / aExp + 1 / bExp + 1 / cExp + 1 / dExp);
        }

        var lower = findBound(z, 0.001, or);
        var upper = findBound(-z, or, or * 100);

        return { lower: lower, upper: upper };
    }

    function copyCaseControl() {
        var lines = ['=== Case-Control Analysis ==='];
        var u = window._epiCC_unmatched;
        if (u) {
            lines.push('Unmatched OR: ' + u.or.toFixed(4));
            lines.push('Woolf 95% CI: (' + u.woolf.lower.toFixed(4) + ', ' + u.woolf.upper.toFixed(4) + ')');
            lines.push('Cornfield 95% CI: (' + u.cornfield.lower.toFixed(4) + ', ' + u.cornfield.upper.toFixed(4) + ')');
            lines.push('Chi-sq: ' + u.chi2.chi2.toFixed(3) + ', p=' + Statistics.formatPValue(u.chi2.pValue));
        }
        var m = window._epiCC_matched;
        if (m) {
            lines.push('');
            lines.push('Matched OR (b/c): ' + (isFinite(m.or) ? m.or.toFixed(4) : 'Infinity'));
            lines.push('McNemar chi-sq: ' + (m.mcnemar.chi2 !== undefined ? m.mcnemar.chi2.toFixed(3) : '-') + ', p=' + Statistics.formatPValue(m.mcnemar.pValue));
        }
        Export.copyText(lines.join('\n'));
    }

    function genMethodsCC() {
        var u = window._epiCC_unmatched;
        var m = window._epiCC_matched;
        if (!u && !m) { Export.showToast('Run analysis first', 'error'); return; }
        var text = '';
        if (u) {
            text += 'In the unmatched case-control analysis, the odds ratio was ' + u.or.toFixed(2)
                + ' (Cornfield exact 95% CI, ' + u.cornfield.lower.toFixed(2) + ' to ' + u.cornfield.upper.toFixed(2) + '). '
                + 'The chi-squared test gave p ' + Statistics.formatPValue(u.chi2.pValue)
                + ' and Fisher exact test p ' + Statistics.formatPValue(u.fisher.pValue) + '. ';
        }
        if (m) {
            text += 'In the matched analysis (' + (m.ma + m.mb + m.mc + m.md) + ' pairs), '
                + 'the matched odds ratio from discordant pairs was ' + (isFinite(m.or) ? m.or.toFixed(2) : 'undefined') + '. '
                + 'McNemar\'s test p ' + Statistics.formatPValue(m.mcnemar.pValue) + '.';
        }
        var el = document.getElementById('epi-cc-methods');
        if (el) {
            App.setTrustedHTML(el, '<div class="text-output">' + text
                + '<button class="btn btn-xs btn-secondary copy-btn" onclick="Export.copyText(document.getElementById(\'epi-cc-methods\').querySelector(\'.text-output\').textContent.replace(\'Copy\',\'\').trim())">Copy</button></div>');
        }
    }

    // ================================================================
    // TAB G: SCREENING METRICS
    // ================================================================

    function calcScreening() {
        var sens = parseFloat(document.getElementById('epi_scr_sens').value) / 100;
        var spec = parseFloat(document.getElementById('epi_scr_spec').value) / 100;
        var prev = parseFloat(document.getElementById('epi_scr_prev').value) / 100;
        var popN = parseInt(document.getElementById('epi_scr_n').value, 10) || 10000;

        if (isNaN(sens) || isNaN(spec) || isNaN(prev)) { Export.showToast('Enter sensitivity, specificity, and prevalence', 'error'); return; }
        if (sens <= 0 || sens > 1 || spec <= 0 || spec > 1 || prev <= 0 || prev >= 1) {
            Export.showToast('Values must be between 0 and 100%', 'error'); return;
        }

        // Calculate PPV and NPV from Bayes' theorem
        var ppv = (sens * prev) / (sens * prev + (1 - spec) * (1 - prev));
        var npv = (spec * (1 - prev)) / ((1 - sens) * prev + spec * (1 - prev));

        // LR+, LR-
        var plr = sens / (1 - spec);
        var nlr = (1 - sens) / spec;

        // Absolute counts
        var trueD = Math.round(popN * prev);
        var trueND = popN - trueD;
        var tp = Math.round(trueD * sens);
        var fn = trueD - tp;
        var tn = Math.round(trueND * spec);
        var fp = trueND - tn;

        // Pre/post-test odds
        var preOdds = prev / (1 - prev);
        var postOddsPos = preOdds * plr;
        var postOddsNeg = preOdds * nlr;

        var html = '<div class="result-panel animate-in">';

        html += '<div class="card-title">Screening Metrics</div>';
        html += '<div class="result-grid">';
        html += makeResultItem('PPV', (ppv * 100).toFixed(1) + '%', App.tooltip('Probability of disease given positive test'));
        html += makeResultItem('NPV', (npv * 100).toFixed(1) + '%', App.tooltip('Probability of no disease given negative test'));
        html += makeResultItem('+LR', plr.toFixed(2), App.tooltip('Sensitivity / (1 - Specificity)'));
        html += makeResultItem('-LR', nlr.toFixed(4), App.tooltip('(1 - Sensitivity) / Specificity'));
        html += makeResultItem('Accuracy', ((tp + tn) / popN * 100).toFixed(1) + '%', '');
        html += makeResultItem('Youden J', (sens + spec - 1).toFixed(3), '');
        html += '</div>';

        // 2x2 table from screening
        html += '<div class="card-title mt-3">Expected 2&times;2 Table (N = ' + popN.toLocaleString() + ')</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table" style="max-width:500px">'
            + '<thead><tr><th></th><th>Disease +</th><th>Disease &minus;</th><th>Total</th></tr></thead>'
            + '<tbody>'
            + '<tr><td><strong>Test +</strong></td><td class="num">' + tp + '</td><td class="num">' + fp + '</td><td class="num">' + (tp + fp) + '</td></tr>'
            + '<tr><td><strong>Test &minus;</strong></td><td class="num">' + fn + '</td><td class="num">' + tn + '</td><td class="num">' + (fn + tn) + '</td></tr>'
            + '<tr style="border-top:2px solid var(--border)"><td><strong>Total</strong></td><td class="num">' + trueD + '</td><td class="num">' + trueND + '</td><td class="num">' + popN + '</td></tr>'
            + '</tbody></table></div>';

        // Visual bar showing PPV impact of prevalence
        html += '<div class="card-title mt-3">PPV vs Prevalence</div>';
        html += '<div class="card-subtitle">Shows how PPV changes across different disease prevalence values.</div>';
        html += '<div class="chart-container"><canvas id="epi-scr-ppv-chart" width="600" height="300"></canvas></div>';
        html += '<div class="chart-actions"><button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'epi-scr-ppv-chart\'),\'ppv-prevalence.png\')">Export PNG</button></div>';

        // Copy + Methods
        html += '<div class="btn-group mt-3">'
            + '<button class="btn btn-secondary" onclick="EpiCalcModule.copyScreening()">Copy Results</button>'
            + '<button class="btn btn-secondary" onclick="EpiCalcModule.genMethodsScreening()">Generate Methods Text</button>'
            + '</div>';
        html += '<div id="epi-scr-methods" class="mt-2"></div>';
        html += '</div>';

        App.setTrustedHTML(document.getElementById('epi-scr-results'), html);

        // Draw PPV vs prevalence chart
        setTimeout(function () {
            var canvas = document.getElementById('epi-scr-ppv-chart');
            if (!canvas) return;
            var prevValues = [0.001, 0.005, 0.01, 0.02, 0.05, 0.10, 0.15, 0.20, 0.30, 0.40, 0.50];
            var ppvPoints = [];
            var npvPoints = [];
            for (var i = 0; i < prevValues.length; i++) {
                var p = prevValues[i];
                var ppvI = (sens * p) / (sens * p + (1 - spec) * (1 - p));
                var npvI = (spec * (1 - p)) / ((1 - sens) * p + spec * (1 - p));
                ppvPoints.push({ x: p * 100, y: ppvI * 100 });
                npvPoints.push({ x: p * 100, y: npvI * 100 });
            }
            Charts.LineChart(canvas, {
                data: [
                    { label: 'PPV', points: ppvPoints },
                    { label: 'NPV', points: npvPoints }
                ],
                xLabel: 'Prevalence (%)',
                yLabel: 'Predictive Value (%)',
                title: 'PPV and NPV vs Prevalence (Sens=' + (sens * 100).toFixed(0) + '%, Spec=' + (spec * 100).toFixed(0) + '%)',
                yMin: 0, yMax: 100,
                width: 600,
                height: 300
            });
        }, 80);

        window._epiScreening = { sens: sens, spec: spec, prev: prev, ppv: ppv, npv: npv, plr: plr, nlr: nlr, tp: tp, fp: fp, fn: fn, tn: tn, popN: popN };
        Export.addToHistory(MODULE_ID, { tab: 'screening', sens: sens, spec: spec, prev: prev }, 'PPV=' + (ppv * 100).toFixed(1) + '%, NPV=' + (npv * 100).toFixed(1) + '%');
    }

    function copyScreening() {
        var r = window._epiScreening;
        if (!r) return;
        var lines = [
            '=== Screening Metrics ===',
            'Sensitivity: ' + (r.sens * 100).toFixed(1) + '%',
            'Specificity: ' + (r.spec * 100).toFixed(1) + '%',
            'Prevalence: ' + (r.prev * 100).toFixed(2) + '%',
            'PPV: ' + (r.ppv * 100).toFixed(1) + '%',
            'NPV: ' + (r.npv * 100).toFixed(1) + '%',
            '+LR: ' + r.plr.toFixed(2),
            '-LR: ' + r.nlr.toFixed(4),
            '',
            'Expected 2x2 (N=' + r.popN + '): TP=' + r.tp + ' FP=' + r.fp + ' FN=' + r.fn + ' TN=' + r.tn
        ];
        Export.copyText(lines.join('\n'));
    }

    function genMethodsScreening() {
        var r = window._epiScreening;
        if (!r) { Export.showToast('Run analysis first', 'error'); return; }
        var text = 'With a screening test sensitivity of ' + (r.sens * 100).toFixed(0) + '% '
            + 'and specificity of ' + (r.spec * 100).toFixed(0) + '%, '
            + 'at a disease prevalence of ' + (r.prev * 100).toFixed(1) + '%, '
            + 'the positive predictive value (PPV) was ' + (r.ppv * 100).toFixed(1) + '% '
            + 'and the negative predictive value (NPV) was ' + (r.npv * 100).toFixed(1) + '%. '
            + 'The positive likelihood ratio was ' + r.plr.toFixed(1) + ' '
            + 'and the negative likelihood ratio was ' + r.nlr.toFixed(3) + '. '
            + 'In a population of ' + r.popN.toLocaleString() + ', '
            + 'this would yield ' + r.tp + ' true positives, ' + r.fp + ' false positives, '
            + r.fn + ' false negatives, and ' + r.tn + ' true negatives.';
        var el = document.getElementById('epi-scr-methods');
        if (el) {
            App.setTrustedHTML(el, '<div class="text-output">' + text
                + '<button class="btn btn-xs btn-secondary copy-btn" onclick="Export.copyText(document.getElementById(\'epi-scr-methods\').querySelector(\'.text-output\').textContent.replace(\'Copy\',\'\').trim())">Copy</button></div>');
        }
    }

    // ================================================================
    // TAB H: POPULATION ATTRIBUTABLE FRACTION (MULTI-LEVEL)
    // ================================================================

    function buildPAFInputs() {
        var k = parseInt(document.getElementById('epi_paf_k').value, 10) || 3;
        var html = '<table class="data-table mt-2" style="max-width:600px">'
            + '<thead><tr>'
            + '<th>Level</th>'
            + '<th>Prevalence (p\u1D62) ' + App.tooltip('Proportion of the population at this exposure level') + '</th>'
            + '<th>RR\u1D62 ' + App.tooltip('Relative risk at this exposure level vs reference (unexposed)') + '</th>'
            + '</tr></thead><tbody>';
        var defP = [0.20, 0.15, 0.10, 0.08, 0.05, 0.03, 0.02, 0.01, 0.01, 0.005];
        var defRR = [1.5, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0];
        for (var i = 0; i < k; i++) {
            html += '<tr><td>Level ' + (i + 1) + '</td>'
                + '<td><input type="number" class="form-input form-input--small" id="epi_paf_p_' + i + '" value="' + (defP[i] || 0.05) + '" step="0.01" min="0" max="1" style="width:100px"></td>'
                + '<td><input type="number" class="form-input form-input--small" id="epi_paf_rr_' + i + '" value="' + (defRR[i] || 2.0) + '" step="0.1" min="0.1" style="width:100px"></td>'
                + '</tr>';
        }
        html += '</tbody></table>';
        html += '<div class="text-secondary" style="font-size:0.85rem;margin-top:4px;">Reference group (unexposed): prevalence = 1 - \u03A3p\u1D62, RR = 1.0</div>';
        App.setTrustedHTML(document.getElementById('epi-paf-inputs'), html);
    }

    function calcPAF() {
        var k = parseInt(document.getElementById('epi_paf_k').value, 10) || 3;
        var prevs = [], rrs = [];
        var sumPrev = 0;
        for (var i = 0; i < k; i++) {
            var p = parseFloat(document.getElementById('epi_paf_p_' + i).value);
            var rr = parseFloat(document.getElementById('epi_paf_rr_' + i).value);
            if (isNaN(p) || isNaN(rr)) { Export.showToast('Fill all fields for level ' + (i + 1), 'error'); return; }
            prevs.push(p);
            rrs.push(rr);
            sumPrev += p;
        }
        if (sumPrev >= 1) { Export.showToast('Sum of prevalences must be < 1 (reference group needs to have positive prevalence)', 'error'); return; }

        // Generalized Levin formula: PAF = (sum pi*(RRi-1)) / (1 + sum pi*(RRi-1))
        var numerator = 0;
        for (var i = 0; i < k; i++) {
            numerator += prevs[i] * (rrs[i] - 1);
        }
        var denominator = 1 + numerator;
        var paf = numerator / denominator;

        // Level-specific PAF
        var levelPAFs = [];
        for (var i = 0; i < k; i++) {
            var levelPAF = prevs[i] * (rrs[i] - 1) / denominator;
            levelPAFs.push(levelPAF);
        }

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">PAF = ' + (paf * 100).toFixed(1) + '%</div>';
        html += '<div class="result-label">Population Attributable Fraction (all levels combined)</div>';

        // Level-specific table
        html += '<div class="card-title mt-3">Level-Specific Contributions</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Level</th><th>Prevalence</th><th>RR</th><th>Level-Specific PAF</th><th>% of Total PAF</th></tr></thead><tbody>';
        for (var i = 0; i < k; i++) {
            html += '<tr>'
                + '<td>Level ' + (i + 1) + '</td>'
                + '<td class="num">' + (prevs[i] * 100).toFixed(1) + '%</td>'
                + '<td class="num">' + rrs[i].toFixed(2) + '</td>'
                + '<td class="num highlight">' + (levelPAFs[i] * 100).toFixed(2) + '%</td>'
                + '<td class="num">' + (paf > 0 ? (levelPAFs[i] / paf * 100).toFixed(1) : '0') + '%</td>'
                + '</tr>';
        }
        html += '<tr style="border-top:2px solid var(--border);font-weight:600">'
            + '<td>Reference (unexposed)</td>'
            + '<td class="num">' + ((1 - sumPrev) * 100).toFixed(1) + '%</td>'
            + '<td class="num">1.00</td>'
            + '<td class="num">-</td>'
            + '<td class="num">-</td>'
            + '</tr>';
        html += '</tbody></table></div>';

        // Interpretation
        html += '<div class="card-title mt-3">Interpretation</div>';
        html += '<div class="text-output" style="font-size:0.85rem;line-height:1.7">'
            + 'If the exposure were completely eliminated from the population, approximately <strong>'
            + (paf * 100).toFixed(1) + '%</strong> of cases would be prevented. '
            + 'This assumes a causal relationship between the exposure and the outcome. '
            + 'The highest contributing exposure level is Level '
            + (levelPAFs.indexOf(Math.max.apply(null, levelPAFs)) + 1)
            + ' (' + (Math.max.apply(null, levelPAFs) * 100).toFixed(1) + '% PAF contribution).'
            + '</div>';

        // Visualization
        html += '<div class="chart-container"><canvas id="epi-paf-chart" width="600" height="300"></canvas></div>';
        html += '<div class="chart-actions"><button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'epi-paf-chart\'),\'paf-levels.png\')">Export PNG</button></div>';

        // Copy + Methods
        html += '<div class="btn-group mt-3">'
            + '<button class="btn btn-secondary" onclick="EpiCalcModule.copyPAF()">Copy Results</button>'
            + '<button class="btn btn-secondary" onclick="EpiCalcModule.genMethodsPAF()">Generate Methods Text</button>'
            + '</div>';
        html += '<div id="epi-paf-methods" class="mt-2"></div>';
        html += '</div>';

        App.setTrustedHTML(document.getElementById('epi-paf-results'), html);

        // Draw PAF bar chart
        setTimeout(function () {
            var canvas = document.getElementById('epi-paf-chart');
            if (!canvas) return;
            var categories = [];
            var values = [];
            for (var i = 0; i < k; i++) {
                categories.push('Level ' + (i + 1));
                values.push(levelPAFs[i] * 100);
            }
            Charts.BarChart(canvas, {
                categories: categories,
                series: [{ label: 'Level-Specific PAF (%)', values: values }],
                title: 'PAF Contribution by Exposure Level (Total PAF = ' + (paf * 100).toFixed(1) + '%)',
                yLabel: 'PAF (%)',
                width: 600,
                height: 300,
                stacked: false
            });
        }, 80);

        window._epiPAF = { paf: paf, levelPAFs: levelPAFs, prevs: prevs, rrs: rrs, k: k };
        Export.addToHistory(MODULE_ID, { tab: 'PAF', k: k }, 'PAF=' + (paf * 100).toFixed(1) + '%');
    }

    function copyPAF() {
        var r = window._epiPAF;
        if (!r) return;
        var lines = [
            '=== Population Attributable Fraction (Multi-level) ===',
            'Total PAF: ' + (r.paf * 100).toFixed(2) + '%',
            '',
            'Level\tPrevalence\tRR\tLevel PAF'
        ];
        for (var i = 0; i < r.k; i++) {
            lines.push('Level ' + (i + 1) + '\t' + (r.prevs[i] * 100).toFixed(1) + '%\t' + r.rrs[i].toFixed(2) + '\t' + (r.levelPAFs[i] * 100).toFixed(2) + '%');
        }
        Export.copyText(lines.join('\n'));
    }

    function genMethodsPAF() {
        var r = window._epiPAF;
        if (!r) { Export.showToast('Run analysis first', 'error'); return; }
        var text = 'The population attributable fraction was calculated using the generalized Levin formula '
            + 'for ' + r.k + ' exposure levels. '
            + 'The overall PAF was ' + (r.paf * 100).toFixed(1) + '%, '
            + 'indicating that ' + (r.paf * 100).toFixed(1) + '% of cases could theoretically be prevented '
            + 'by complete elimination of the exposure, assuming a causal relationship.';
        var el = document.getElementById('epi-paf-methods');
        if (el) {
            App.setTrustedHTML(el, '<div class="text-output">' + text
                + '<button class="btn btn-xs btn-secondary copy-btn" onclick="Export.copyText(document.getElementById(\'epi-paf-methods\').querySelector(\'.text-output\').textContent.replace(\'Copy\',\'\').trim())">Copy</button></div>');
        }
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
        genMethods2x2: genMethods2x2,
        buildMHInputs: buildMHInputs,
        calcMH: calcMH,
        copyMH: copyMH,
        genMethodsMH: genMethodsMH,
        calcInteraction: calcInteraction,
        copyInteraction: copyInteraction,
        genMethodsInteraction: genMethodsInteraction,
        buildDRInputs: buildDRInputs,
        calcDoseResponse: calcDoseResponse,
        copyDR: copyDR,
        genMethodsDR: genMethodsDR,
        calcCaseControl: calcCaseControl,
        copyCaseControl: copyCaseControl,
        genMethodsCC: genMethodsCC,
        calcScreening: calcScreening,
        copyScreening: copyScreening,
        genMethodsScreening: genMethodsScreening,
        buildPAFInputs: buildPAFInputs,
        calcPAF: calcPAF,
        copyPAF: copyPAF,
        genMethodsPAF: genMethodsPAF,
        genRScriptMH: genRScriptMH
    };
})();
