/**
 * NeuroEpi Suite — NNT / NNH Calculator Module
 * Input modes: Event rates, 2x2 table, Published RR/OR + baseline risk
 * Outputs: ARR, RR, RRR, OR, NNT/NNH with CIs, chi-squared, Fisher exact,
 *          fragility index, Cates plot, PEER-adjusted NNT, patient explanation,
 *          methods/results text generators.
 *
 * Note: All HTML content is generated from trusted internal sources only.
 */
(function () {
    'use strict';

    var MODULE_ID = 'nnt-calculator';

    // ================================================================
    // RENDER
    // ================================================================

    function render(container) {
        var html = App.createModuleLayout(
            'NNT / NNH Calculator',
            'Calculate Number Needed to Treat (NNT) or Number Needed to Harm (NNH) with full supporting statistics, fragility index, Cates visual, and publication-ready text.'
        );

        html += '<div class="card">';

        // Input mode selector
        html += '<div class="form-label">Input Mode ' + App.tooltip('Choose how you want to enter your data. All modes produce identical output.') + '</div>';
        html += '<div class="tabs" id="nnt-input-tabs">'
            + '<button class="tab active" data-tab="rates" onclick="NNTModule.switchInputMode(\'rates\')">Event Rates + N</button>'
            + '<button class="tab" data-tab="table" onclick="NNTModule.switchInputMode(\'table\')">2&times;2 Table</button>'
            + '<button class="tab" data-tab="published" onclick="NNTModule.switchInputMode(\'published\')">Published RR/OR</button>'
            + '</div>';

        // --- Mode A: Event rates ---
        html += '<div class="tab-content active" id="nnt-tab-rates">';
        html += '<div class="card-subtitle">Enter event rates and sample sizes for each group.</div>';
        html += '<div class="form-row form-row--4">'
            + '<div class="form-group"><label class="form-label">Control Event Rate (CER)</label>'
            + '<input type="number" class="form-input" name="nnt_cer" id="nnt_cer" step="0.001" min="0" max="1" value="0.28"></div>'
            + '<div class="form-group"><label class="form-label">Experimental Event Rate (EER)</label>'
            + '<input type="number" class="form-input" name="nnt_eer" id="nnt_eer" step="0.001" min="0" max="1" value="0.20"></div>'
            + '<div class="form-group"><label class="form-label">N Control</label>'
            + '<input type="number" class="form-input" name="nnt_nc" id="nnt_nc" step="1" min="1" value="300"></div>'
            + '<div class="form-group"><label class="form-label">N Experimental</label>'
            + '<input type="number" class="form-input" name="nnt_ne" id="nnt_ne" step="1" min="1" value="300"></div>'
            + '</div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="NNTModule.calculateFromRates()">Calculate All</button></div>';
        html += '</div>';

        // --- Mode B: 2x2 table ---
        html += '<div class="tab-content" id="nnt-tab-table">';
        html += '<div class="card-subtitle">Enter cell counts directly from a 2&times;2 contingency table.</div>';
        html += '<table class="data-table" style="max-width:400px;margin:0 auto 1rem">'
            + '<thead><tr><th></th><th>Event (+)</th><th>No Event (&minus;)</th></tr></thead>'
            + '<tbody>'
            + '<tr><td><strong>Exposed / Treatment</strong></td>'
            + '<td><input type="number" class="form-input form-input--small" name="nnt_a" id="nnt_a" value="60" min="0" style="width:80px"></td>'
            + '<td><input type="number" class="form-input form-input--small" name="nnt_b" id="nnt_b" value="240" min="0" style="width:80px"></td></tr>'
            + '<tr><td><strong>Control</strong></td>'
            + '<td><input type="number" class="form-input form-input--small" name="nnt_c" id="nnt_c" value="84" min="0" style="width:80px"></td>'
            + '<td><input type="number" class="form-input form-input--small" name="nnt_d" id="nnt_d" value="216" min="0" style="width:80px"></td></tr>'
            + '</tbody></table>';
        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="NNTModule.calculateFromTable()">Calculate All</button></div>';
        html += '</div>';

        // --- Mode C: Published RR/OR ---
        html += '<div class="tab-content" id="nnt-tab-published">';
        html += '<div class="card-subtitle">Convert a published RR or OR to NNT using an assumed baseline risk.</div>';
        html += '<div class="form-row form-row--4">'
            + '<div class="form-group"><label class="form-label">Measure</label>'
            + '<select class="form-select" name="nnt_pub_measure" id="nnt_pub_measure">'
            + '<option value="rr">Relative Risk (RR)</option>'
            + '<option value="or">Odds Ratio (OR)</option></select></div>'
            + '<div class="form-group"><label class="form-label">Point Estimate</label>'
            + '<input type="number" class="form-input" name="nnt_pub_est" id="nnt_pub_est" step="0.01" min="0.01" value="0.71"></div>'
            + '<div class="form-group"><label class="form-label">95% CI Lower</label>'
            + '<input type="number" class="form-input" name="nnt_pub_lo" id="nnt_pub_lo" step="0.01" value="0.56"></div>'
            + '<div class="form-group"><label class="form-label">95% CI Upper</label>'
            + '<input type="number" class="form-input" name="nnt_pub_hi" id="nnt_pub_hi" step="0.01" value="0.90"></div>'
            + '</div>';
        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Baseline Risk (CER) ' + App.tooltip('Control event rate in your population of interest') + '</label>'
            + '<input type="number" class="form-input" name="nnt_pub_cer" id="nnt_pub_cer" step="0.01" min="0.001" max="0.999" value="0.28"></div>'
            + '<div class="form-group"><label class="form-label">Total N (optional, for chi-sq / Fisher)</label>'
            + '<input type="number" class="form-input" name="nnt_pub_n" id="nnt_pub_n" step="1" min="0" value=""></div>'
            + '</div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="NNTModule.calculateFromPublished()">Calculate All</button></div>';
        html += '</div>';

        // Results container
        html += '<div id="nnt-results"></div>';

        html += '</div>'; // end card

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);
    }

    // ================================================================
    // TAB SWITCHING
    // ================================================================

    function switchInputMode(tabId) {
        document.querySelectorAll('#nnt-input-tabs .tab').forEach(function (t) {
            t.classList.toggle('active', t.dataset.tab === tabId);
        });
        document.querySelectorAll('#nnt-tab-rates, #nnt-tab-table, #nnt-tab-published').forEach(function (tc) {
            tc.classList.toggle('active', tc.id === 'nnt-tab-' + tabId);
        });
    }

    // ================================================================
    // INPUT -> CANONICAL 2x2
    // ================================================================

    function ratesTo2x2(cer, eer, nc, ne) {
        var a = Math.round(eer * ne);
        var b = ne - a;
        var c = Math.round(cer * nc);
        var d = nc - c;
        return { a: a, b: b, c: c, d: d };
    }

    function publishedTo2x2(measure, est, cer, totalN) {
        // Derive EER from published measure + baseline CER
        var eer;
        if (measure === 'rr') {
            eer = est * cer;
        } else {
            // OR -> RR via Zhang & Yu then RR -> EER
            var rr = Statistics.orToRR(est, cer);
            eer = rr * cer;
        }
        eer = Math.max(0.0001, Math.min(0.9999, eer));
        var n = totalN && totalN > 0 ? Math.round(totalN / 2) : 500;
        return ratesTo2x2(cer, eer, n, n);
    }

    // ================================================================
    // MAIN CALCULATE
    // ================================================================

    function calculateFromRates() {
        var cer = parseFloat(document.getElementById('nnt_cer').value);
        var eer = parseFloat(document.getElementById('nnt_eer').value);
        var nc = parseInt(document.getElementById('nnt_nc').value, 10);
        var ne = parseInt(document.getElementById('nnt_ne').value, 10);
        if (isNaN(cer) || isNaN(eer) || isNaN(nc) || isNaN(ne)) { Export.showToast('Please fill all fields', 'error'); return; }
        var t = ratesTo2x2(cer, eer, nc, ne);
        showResults(t.a, t.b, t.c, t.d);
    }

    function calculateFromTable() {
        var a = parseInt(document.getElementById('nnt_a').value, 10);
        var b = parseInt(document.getElementById('nnt_b').value, 10);
        var c = parseInt(document.getElementById('nnt_c').value, 10);
        var d = parseInt(document.getElementById('nnt_d').value, 10);
        if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) { Export.showToast('Please fill all cells', 'error'); return; }
        showResults(a, b, c, d);
    }

    function calculateFromPublished() {
        var measure = document.getElementById('nnt_pub_measure').value;
        var est = parseFloat(document.getElementById('nnt_pub_est').value);
        var lo = parseFloat(document.getElementById('nnt_pub_lo').value);
        var hi = parseFloat(document.getElementById('nnt_pub_hi').value);
        var cer = parseFloat(document.getElementById('nnt_pub_cer').value);
        var totalN = parseInt(document.getElementById('nnt_pub_n').value, 10);
        if (isNaN(est) || isNaN(cer)) { Export.showToast('Estimate and baseline risk are required', 'error'); return; }
        var t = publishedTo2x2(measure, est, cer, totalN);
        showResults(t.a, t.b, t.c, t.d, { pubMeasure: measure, pubEst: est, pubLo: lo, pubHi: hi, pubCER: cer });
    }

    // ================================================================
    // RESULTS
    // ================================================================

    function formatNNTCI(rdLower, rdUpper) {
        // Altman notation: when CI for RD spans zero the NNT CI goes through infinity
        // i.e. NNT = NNTB lower to infinity to NNTH upper
        if (rdLower <= 0 && rdUpper >= 0) {
            // CI spans null
            var nntFromLo = rdLower !== 0 ? Math.ceil(1 / Math.abs(rdLower)) : Infinity;
            var nntFromHi = rdUpper !== 0 ? Math.ceil(1 / Math.abs(rdUpper)) : Infinity;
            var labelLo = rdLower < 0 ? 'NNTH ' + nntFromLo : (rdLower === 0 ? '\u221E' : 'NNTB ' + nntFromLo);
            var labelHi = rdUpper > 0 ? 'NNTH ' + nntFromHi : (rdUpper === 0 ? '\u221E' : 'NNTB ' + nntFromHi);
            // Correct ordering: the RD CI is (lower, upper). If both same side: straightforward.
            // If crossing zero: NNT_lower to ∞ to NNT_upper (Altman-Andersen notation)
            if (rdLower < 0 && rdUpper > 0) {
                return 'NNTB ' + Math.ceil(1 / Math.abs(rdLower)) + ' to \u221E to NNTH ' + Math.ceil(1 / rdUpper);
            }
            if (rdLower < 0 && rdUpper === 0) {
                return 'NNTB ' + Math.ceil(1 / Math.abs(rdLower)) + ' to \u221E';
            }
            if (rdLower === 0 && rdUpper > 0) {
                return '\u221E to NNTH ' + Math.ceil(1 / rdUpper);
            }
            return '\u221E';
        }
        // Both sides same sign
        var nntLo = Math.ceil(1 / Math.abs(rdUpper)); // wider RD gives smaller NNT
        var nntHi = Math.ceil(1 / Math.abs(rdLower));
        var prefix = rdLower > 0 ? 'NNTH' : 'NNTB';
        return prefix + ' ' + nntLo + ' to ' + nntHi;
    }

    function showResults(a, b, c, d, pubInfo) {
        var res = Statistics.twoByTwo(a, b, c, d);
        var z = Statistics.normalQuantile(0.975);

        // Recalculate with Newcombe CI
        var n1 = a + b;
        var n2 = c + d;
        var p1 = a / n1; // EER (exposed / treatment row)
        var p2 = c / n2; // CER (control row)

        var arr = p2 - p1; // positive = benefit
        var newcombe = Statistics.newcombeCI(p2, n2, p1, n1, z);
        var rr = p1 / p2;
        var rrr = 1 - rr;
        var or = res.or.value;

        // Fragility index
        var frag = Statistics.fragilityIndex(a, b, c, d);

        // NNT core
        var nntVal = arr !== 0 ? 1 / Math.abs(arr) : Infinity;
        var isNNH = arr < 0;
        var nntLabel = isNNH ? 'NNH' : 'NNT';
        var nntDisplay = nntVal === Infinity ? '\u221E' : Math.ceil(nntVal);
        var nntCIStr = formatNNTCI(newcombe.lower, newcombe.upper);

        // Build output
        var html = '<div class="result-panel animate-in">';

        // Headline
        html += '<div class="result-value">' + nntLabel + ' = ' + nntDisplay + '</div>';
        html += '<div class="result-label">95% CI: ' + nntCIStr + '</div>';

        // 2x2 table visual
        html += '<div class="card-title mt-3">2&times;2 Table</div>';
        html += '<table class="data-table" style="max-width:420px">'
            + '<thead><tr><th></th><th>Event</th><th>No Event</th><th>Total</th></tr></thead>'
            + '<tbody>'
            + '<tr><td><strong>Treatment</strong></td><td class="num">' + a + '</td><td class="num">' + b + '</td><td class="num">' + n1 + '</td></tr>'
            + '<tr><td><strong>Control</strong></td><td class="num">' + c + '</td><td class="num">' + d + '</td><td class="num">' + n2 + '</td></tr>'
            + '<tr style="border-top:2px solid var(--border)"><td><strong>Total</strong></td><td class="num">' + (a + c) + '</td><td class="num">' + (b + d) + '</td><td class="num">' + (a + b + c + d) + '</td></tr>'
            + '</tbody></table>';

        // All measures grid
        html += '<div class="card-title mt-3">Effect Measures (95% CI)</div>';
        html += '<div class="result-grid">';

        // ARR
        html += '<div class="result-item"><div class="result-item-value">' + (arr * 100).toFixed(2) + '%</div>'
            + '<div class="result-item-label">ARR ' + App.tooltip('Absolute Risk Reduction = CER - EER. Newcombe hybrid CI.') + '<br>'
            + '(' + (newcombe.lower * 100).toFixed(2) + '% to ' + (newcombe.upper * 100).toFixed(2) + '%)</div></div>';

        // RR
        html += '<div class="result-item"><div class="result-item-value">' + rr.toFixed(3) + '</div>'
            + '<div class="result-item-label">RR<br>' + Statistics.formatCI(res.rr.ci.lower, res.rr.ci.upper, 3) + '</div></div>';

        // RRR
        html += '<div class="result-item"><div class="result-item-value">' + (rrr * 100).toFixed(1) + '%</div>'
            + '<div class="result-item-label">RRR<br>(1 &minus; RR)</div></div>';

        // OR
        html += '<div class="result-item"><div class="result-item-value">' + or.toFixed(3) + '</div>'
            + '<div class="result-item-label">OR<br>' + Statistics.formatCI(res.or.ci.lower, res.or.ci.upper, 3) + '</div></div>';

        // NNT / NNH
        html += '<div class="result-item"><div class="result-item-value">' + nntDisplay + '</div>'
            + '<div class="result-item-label">' + nntLabel + '<br>' + nntCIStr + '</div></div>';

        // Chi-squared
        html += '<div class="result-item"><div class="result-item-value">' + res.chi2.chi2.toFixed(2) + '</div>'
            + '<div class="result-item-label">\u03C7\u00B2 (p = ' + Statistics.formatPValue(res.chi2.pValue) + ')</div></div>';

        // Fisher exact
        html += '<div class="result-item"><div class="result-item-value">' + Statistics.formatPValue(res.fisher.pValue) + '</div>'
            + '<div class="result-item-label">Fisher exact p</div></div>';

        // Fragility index
        html += '<div class="result-item"><div class="result-item-value">' + frag.index + '</div>'
            + '<div class="result-item-label">Fragility Index ' + App.tooltip('Number of events to reclassify to make p > 0.05') + '</div></div>';

        html += '</div>'; // end result-grid

        // ---- Cates plot ----
        html += '<div class="card-title mt-3">Cates Plot (Icon Array) ' + App.tooltip('Visual depiction of treatment effect per 100 patients') + '</div>';
        html += '<div class="chart-container"><canvas id="nnt-cates-canvas" width="520" height="420"></canvas></div>';
        html += '<div class="chart-actions">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'nnt-cates-canvas\'),\'cates-plot.png\')">Export PNG</button></div>';

        // ---- PEER-adjusted NNT ----
        html += '<div class="card-title mt-3">PEER-Adjusted NNT ' + App.tooltip('Apply the RRR to a different baseline risk (Patient Expected Event Rate)') + '</div>';
        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Your Patient\'s Baseline Risk</label>'
            + '<input type="number" class="form-input" id="nnt_peer" step="0.01" min="0.001" max="0.999" value="' + p2.toFixed(3) + '"></div>'
            + '<div class="form-group" style="display:flex;align-items:flex-end"><button class="btn btn-secondary" onclick="NNTModule.calcPEER()">Recalculate</button></div>'
            + '<div class="form-group" id="nnt-peer-result" style="display:flex;align-items:flex-end"><span class="text-secondary">Enter baseline risk and click Recalculate</span></div>'
            + '</div>';

        // ---- Patient explanation ----
        html += '<div class="card-title mt-3">Patient Explanation</div>';
        var explanation = generatePatientExplanation(p2, p1, nntDisplay, nntLabel);
        html += '<div class="text-output" id="nnt-patient-text">' + explanation
            + '<button class="btn btn-xs btn-secondary copy-btn" onclick="Export.copyText(document.getElementById(\'nnt-patient-text\').textContent.replace(\'Copy\',\'\').trim())">Copy</button></div>';

        // ---- Methods text ----
        html += '<div class="mt-3"><div class="expandable-header" onclick="this.classList.toggle(\'open\')">Methods / Results Text</div>'
            + '<div class="expandable-body"><div class="text-output" id="nnt-methods-text">'
            + generateMethodsResults(a, b, c, d, res, arr, newcombe, rr, or, nntDisplay, nntLabel, nntCIStr, frag)
            + '<button class="btn btn-xs btn-secondary copy-btn" onclick="Export.copyText(document.getElementById(\'nnt-methods-text\').textContent.replace(\'Copy\',\'\').trim())">Copy</button></div></div></div>';

        // ---- Copy all button ----
        html += '<div class="btn-group mt-3">'
            + '<button class="btn btn-secondary" onclick="NNTModule.copyAll()">Copy All Results to Clipboard</button></div>';

        html += '</div>'; // end result-panel

        App.setTrustedHTML(document.getElementById('nnt-results'), html);

        // Draw Cates plot
        setTimeout(function () {
            var canvas = document.getElementById('nnt-cates-canvas');
            if (!canvas) return;
            Charts.IconArray(canvas, {
                cer: p2,
                eer: p1,
                n: 100,
                title: 'Treatment Effect per 100 Patients',
                width: 520,
                height: 420
            });
        }, 80);

        // Store current results for copy-all and PEER
        window._nntCurrentResults = {
            a: a, b: b, c: c, d: d,
            p1: p1, p2: p2, arr: arr, rr: rr, rrr: rrr, or: or,
            newcombe: newcombe, nntDisplay: nntDisplay, nntLabel: nntLabel,
            nntCIStr: nntCIStr, frag: frag, res: res
        };

        Export.addToHistory(MODULE_ID, { a: a, b: b, c: c, d: d }, nntLabel + ' = ' + nntDisplay);
    }

    // ================================================================
    // PEER
    // ================================================================

    function calcPEER() {
        var r = window._nntCurrentResults;
        if (!r) return;
        var peer = parseFloat(document.getElementById('nnt_peer').value);
        if (isNaN(peer) || peer <= 0 || peer >= 1) { Export.showToast('Enter a valid baseline risk (0-1)', 'error'); return; }
        var peerARR = peer * r.rrr;
        var peerNNT = peerARR !== 0 ? Math.ceil(1 / Math.abs(peerARR)) : Infinity;
        var label = peerARR > 0 ? 'NNT' : 'NNH';
        var display = peerNNT === Infinity ? '\u221E' : peerNNT;
        App.setTrustedHTML(document.getElementById('nnt-peer-result'),
            '<span><strong>' + label + ' = ' + display + '</strong> (ARR = ' + (peerARR * 100).toFixed(2) + '%, baseline = ' + (peer * 100).toFixed(1) + '%)</span>');
    }

    // ================================================================
    // TEXT GENERATORS
    // ================================================================

    function generatePatientExplanation(cer, eer, nntDisplay, nntLabel) {
        var cerPct = (cer * 100).toFixed(0);
        var eerPct = (eer * 100).toFixed(0);
        if (nntLabel === 'NNT') {
            return 'Out of 100 patients like you, about ' + cerPct + ' would have this outcome without the treatment, '
                + 'and about ' + eerPct + ' would have it with the treatment. That means for every '
                + nntDisplay + ' patients treated, one additional patient is spared the outcome. '
                + 'The remaining ' + (100 - parseInt(cerPct, 10)) + ' out of 100 would not have had the outcome regardless.';
        }
        return 'Out of 100 patients like you, about ' + cerPct + ' would have this outcome without the treatment, '
            + 'and about ' + eerPct + ' would have it with the treatment. That means for every '
            + nntDisplay + ' patients treated, one additional patient experiences the harm. '
            + 'This treatment appears to increase the risk of this outcome.';
    }

    function generateMethodsResults(a, b, c, d, res, arr, newcombe, rr, or, nntDisplay, nntLabel, nntCIStr, frag) {
        var n = a + b + c + d;
        var n1 = a + b;
        var n2 = c + d;
        var text = 'Among ' + n + ' participants (' + n1 + ' treatment, ' + n2 + ' control), '
            + 'the event rate was ' + ((a / n1) * 100).toFixed(1) + '% in the treatment group and '
            + ((c / n2) * 100).toFixed(1) + '% in the control group. '
            + 'The absolute risk reduction was ' + (arr * 100).toFixed(2) + '% (95% Newcombe CI: '
            + (newcombe.lower * 100).toFixed(2) + '% to ' + (newcombe.upper * 100).toFixed(2) + '%). '
            + 'The relative risk was ' + rr.toFixed(2) + ' ' + Statistics.formatCI(res.rr.ci.lower, res.rr.ci.upper, 2) + ', '
            + 'odds ratio ' + or.toFixed(2) + ' ' + Statistics.formatCI(res.or.ci.lower, res.or.ci.upper, 2) + '. '
            + 'The ' + nntLabel + ' was ' + nntDisplay + ' (' + nntCIStr + '). '
            + 'The chi-squared test statistic was ' + res.chi2.chi2.toFixed(2) + ' (p ' + Statistics.formatPValue(res.chi2.pValue) + '); '
            + 'Fisher\'s exact p ' + Statistics.formatPValue(res.fisher.pValue) + '. '
            + 'The fragility index was ' + frag.index + '.';
        return text;
    }

    // ================================================================
    // COPY ALL
    // ================================================================

    function copyAll() {
        var r = window._nntCurrentResults;
        if (!r) { Export.showToast('No results to copy', 'error'); return; }
        var lines = [
            '=== NNT / NNH Calculator Results ===',
            '2x2 Table: a=' + r.a + ', b=' + r.b + ', c=' + r.c + ', d=' + r.d,
            'EER: ' + (r.p1 * 100).toFixed(2) + '%  CER: ' + (r.p2 * 100).toFixed(2) + '%',
            'ARR: ' + (r.arr * 100).toFixed(2) + '% (Newcombe CI: ' + (r.newcombe.lower * 100).toFixed(2) + '% to ' + (r.newcombe.upper * 100).toFixed(2) + '%)',
            'RR: ' + r.rr.toFixed(4) + ' ' + Statistics.formatCI(r.res.rr.ci.lower, r.res.rr.ci.upper, 4),
            'RRR: ' + (r.rrr * 100).toFixed(2) + '%',
            'OR: ' + r.or.toFixed(4) + ' ' + Statistics.formatCI(r.res.or.ci.lower, r.res.or.ci.upper, 4),
            r.nntLabel + ': ' + r.nntDisplay + ' (' + r.nntCIStr + ')',
            'Chi-squared: ' + r.res.chi2.chi2.toFixed(3) + ', p = ' + Statistics.formatPValue(r.res.chi2.pValue),
            'Fisher exact p = ' + Statistics.formatPValue(r.res.fisher.pValue),
            'Fragility Index: ' + r.frag.index
        ];
        Export.copyText(lines.join('\n'));
    }

    // ================================================================
    // REGISTER
    // ================================================================

    App.registerModule(MODULE_ID, { render: render });

    window.NNTModule = {
        switchInputMode: switchInputMode,
        calculateFromRates: calculateFromRates,
        calculateFromTable: calculateFromTable,
        calculateFromPublished: calculateFromPublished,
        calcPEER: calcPEER,
        copyAll: copyAll
    };
})();
