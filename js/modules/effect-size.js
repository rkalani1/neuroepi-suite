/**
 * NeuroEpi Suite — Effect Size Converter Module
 * Input any effect measure with CI -> compute all others.
 * Conversions: OR <-> RR <-> RD <-> Cohen's d <-> Hedge's g <-> log-OR <-> log-RR
 * Interpretive labels, common OR shift visualization, copy buttons.
 *
 * Note: All HTML content is generated from trusted internal sources only.
 */
(function () {
    'use strict';

    var MODULE_ID = 'effect-size';

    // ================================================================
    // RENDER
    // ================================================================

    function render(container) {
        var html = App.createModuleLayout(
            'Effect Size Converter',
            'Convert between effect size measures. Input any one measure with its confidence interval and derive all others. Includes Cohen and stroke-specific benchmarks.'
        );

        html += '<div class="card">';
        html += '<div class="card-subtitle">Select the effect measure you have, enter the value and CI, then click Convert.</div>';

        // Input measure selector
        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Input Measure</label>'
            + '<select class="form-select" id="es_input_type" name="es_input_type" onchange="EffectSizeModule.onMeasureChange()">'
            + '<option value="or">Odds Ratio (OR)</option>'
            + '<option value="rr">Relative Risk (RR)</option>'
            + '<option value="rd">Risk Difference (RD)</option>'
            + '<option value="d">Cohen\'s d</option>'
            + '<option value="g">Hedge\'s g</option>'
            + '<option value="lnor">log(OR)</option>'
            + '<option value="lnrr">log(RR)</option>'
            + '</select></div>'
            + '<div class="form-group" id="es-baseline-group"><label class="form-label">Baseline Risk (P\u2080) '
            + App.tooltip('Required for OR\u2194RR conversion (Zhang & Yu) and for RD calculations. Enter the event rate in the unexposed/control group.') + '</label>'
            + '<input type="number" class="form-input" id="es_p0" name="es_p0" step="0.01" min="0.001" max="0.999" value="0.20"></div>'
            + '</div>';

        // Value + CI
        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Point Estimate</label>'
            + '<input type="number" class="form-input" id="es_val" name="es_val" step="0.01" value="1.50"></div>'
            + '<div class="form-group"><label class="form-label">95% CI Lower</label>'
            + '<input type="number" class="form-input" id="es_lo" name="es_lo" step="0.01" value="1.10"></div>'
            + '<div class="form-group"><label class="form-label">95% CI Upper</label>'
            + '<input type="number" class="form-input" id="es_hi" name="es_hi" step="0.01" value="2.05"></div>'
            + '</div>';

        // Optional sample sizes for Hedge's g correction
        html += '<div class="form-row form-row--2" id="es-n-row">'
            + '<div class="form-group"><label class="form-label">N group 1 (for Hedge\'s g correction) ' + App.tooltip('Optional. Used to compute the small-sample correction factor for Hedge\'s g.') + '</label>'
            + '<input type="number" class="form-input" id="es_n1" name="es_n1" step="1" min="2" value="100"></div>'
            + '<div class="form-group"><label class="form-label">N group 2</label>'
            + '<input type="number" class="form-input" id="es_n2" name="es_n2" step="1" min="2" value="100"></div>'
            + '</div>';

        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="EffectSizeModule.convert()">Convert All</button></div>';

        // Results
        html += '<div id="es-results"></div>';

        html += '</div>'; // card

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);
    }

    function onMeasureChange() {
        // Always show baseline risk and N fields
    }

    // ================================================================
    // CORE CONVERSION ENGINE
    // ================================================================

    function convertValue(type, val, p0) {
        // Returns {or, rr, rd, d, g, lnor, lnrr} from any input type
        var orVal, rrVal, rdVal, dVal;

        switch (type) {
            case 'or':
                orVal = val;
                rrVal = Statistics.orToRR(orVal, p0);
                rdVal = rrVal * p0 - p0; // EER - CER = RR*p0 - p0
                dVal = Statistics.orToD(orVal);
                break;
            case 'rr':
                rrVal = val;
                orVal = Statistics.rrToOR(rrVal, p0);
                rdVal = rrVal * p0 - p0;
                dVal = Statistics.orToD(orVal);
                break;
            case 'rd':
                rdVal = val;
                var eer = p0 + val;
                eer = Math.max(0.0001, Math.min(0.9999, eer));
                rrVal = eer / p0;
                orVal = Statistics.rrToOR(rrVal, p0);
                dVal = Statistics.orToD(orVal);
                break;
            case 'd':
                dVal = val;
                orVal = Statistics.dToOR(dVal);
                rrVal = Statistics.orToRR(orVal, p0);
                rdVal = rrVal * p0 - p0;
                break;
            case 'g':
                // g ≈ d * correction. Reverse: d = g / correction. Need n1,n2.
                var n1g = parseInt(document.getElementById('es_n1').value, 10) || 100;
                var n2g = parseInt(document.getElementById('es_n2').value, 10) || 100;
                var dfg = n1g + n2g - 2;
                var corr = 1 - 3 / (4 * dfg - 1);
                dVal = corr > 0 ? val / corr : val;
                orVal = Statistics.dToOR(dVal);
                rrVal = Statistics.orToRR(orVal, p0);
                rdVal = rrVal * p0 - p0;
                break;
            case 'lnor':
                orVal = Math.exp(val);
                rrVal = Statistics.orToRR(orVal, p0);
                rdVal = rrVal * p0 - p0;
                dVal = Statistics.orToD(orVal);
                break;
            case 'lnrr':
                rrVal = Math.exp(val);
                orVal = Statistics.rrToOR(rrVal, p0);
                rdVal = rrVal * p0 - p0;
                dVal = Statistics.orToD(orVal);
                break;
            default:
                return null;
        }

        // Hedge's g
        var n1 = parseInt(document.getElementById('es_n1').value, 10) || 100;
        var n2 = parseInt(document.getElementById('es_n2').value, 10) || 100;
        var gVal = Statistics.dToHedgesG(dVal, n1, n2);

        return {
            or: orVal,
            rr: rrVal,
            rd: rdVal,
            d: dVal,
            g: gVal,
            lnor: Math.log(orVal),
            lnrr: Math.log(rrVal)
        };
    }

    // ================================================================
    // INTERPRETATION
    // ================================================================

    function cohenLabel(d) {
        var abs = Math.abs(d);
        if (abs < 0.2) return 'Negligible';
        if (abs < 0.5) return 'Small';
        if (abs < 0.8) return 'Medium';
        return 'Large';
    }

    function strokeLabel(d) {
        var abs = Math.abs(d);
        // Stroke-specific benchmarks (empirical from stroke rehabilitation literature)
        if (abs < 0.15) return 'Below clinically meaningful threshold';
        if (abs < 0.4) return 'Small / exploratory benefit';
        if (abs < 0.7) return 'Moderate / clinically relevant';
        return 'Large / robust treatment effect';
    }

    function orInterpretation(or) {
        if (or >= 0.9 && or <= 1.1) return 'Negligible association';
        if ((or > 1.1 && or <= 1.5) || (or >= 0.67 && or < 0.9)) return 'Weak association';
        if ((or > 1.5 && or <= 3.0) || (or >= 0.33 && or < 0.67)) return 'Moderate association';
        return 'Strong association';
    }

    function rrInterpretation(rr) {
        if (rr >= 0.9 && rr <= 1.1) return 'Negligible';
        if ((rr > 1.1 && rr <= 1.5) || (rr >= 0.67 && rr < 0.9)) return 'Weak';
        if ((rr > 1.5 && rr <= 2.0) || (rr >= 0.5 && rr < 0.67)) return 'Moderate';
        return 'Strong';
    }

    // ================================================================
    // CONVERT
    // ================================================================

    function convert() {
        var type = document.getElementById('es_input_type').value;
        var val = parseFloat(document.getElementById('es_val').value);
        var lo = parseFloat(document.getElementById('es_lo').value);
        var hi = parseFloat(document.getElementById('es_hi').value);
        var p0 = parseFloat(document.getElementById('es_p0').value);

        if (isNaN(val)) { Export.showToast('Enter a point estimate', 'error'); return; }
        if (isNaN(p0) || p0 <= 0 || p0 >= 1) { Export.showToast('Baseline risk must be between 0 and 1', 'error'); return; }

        var main = convertValue(type, val, p0);
        var ciLow = !isNaN(lo) ? convertValue(type, lo, p0) : null;
        var ciHigh = !isNaN(hi) ? convertValue(type, hi, p0) : null;

        if (!main) { Export.showToast('Conversion error', 'error'); return; }

        var html = '<div class="result-panel animate-in">';

        // Results table
        html += '<div class="card-title mt-2">Converted Effect Sizes</div>';
        html += '<table class="data-table">';
        html += '<thead><tr><th>Measure</th><th>Estimate</th><th>95% CI</th><th>Interpretation</th><th></th></tr></thead>';
        html += '<tbody>';

        var rows = [
            { label: 'Odds Ratio (OR)', key: 'or', dec: 3, interp: orInterpretation(main.or) },
            { label: 'Relative Risk (RR)', key: 'rr', dec: 3, interp: rrInterpretation(main.rr) },
            { label: 'Risk Difference (RD)', key: 'rd', dec: 4, interp: '' },
            { label: 'Cohen\'s d', key: 'd', dec: 3, interp: cohenLabel(main.d) },
            { label: 'Hedge\'s g', key: 'g', dec: 3, interp: cohenLabel(main.g) },
            { label: 'log(OR)', key: 'lnor', dec: 4, interp: '' },
            { label: 'log(RR)', key: 'lnrr', dec: 4, interp: '' }
        ];

        rows.forEach(function (r) {
            var est = main[r.key];
            var ciStr = '';
            if (ciLow && ciHigh) {
                var a = ciLow[r.key];
                var b = ciHigh[r.key];
                var lower = Math.min(a, b);
                var upper = Math.max(a, b);
                ciStr = '(' + lower.toFixed(r.dec) + ', ' + upper.toFixed(r.dec) + ')';
            }
            var copyVal = est.toFixed(r.dec) + (ciStr ? ' ' + ciStr : '');
            html += '<tr>'
                + '<td>' + r.label + '</td>'
                + '<td class="num highlight">' + est.toFixed(r.dec) + '</td>'
                + '<td class="num">' + ciStr + '</td>'
                + '<td>' + r.interp + '</td>'
                + '<td><button class="btn btn-xs btn-secondary" onclick="Export.copyText(\'' + copyVal.replace(/'/g, "\\'") + '\')">Copy</button></td>'
                + '</tr>';
        });

        html += '</tbody></table>';

        // Interpretive benchmarks
        html += '<div class="card-title mt-3">Interpretation Benchmarks</div>';
        html += '<table class="data-table" style="max-width:600px">';
        html += '<thead><tr><th>Framework</th><th>Small</th><th>Medium</th><th>Large</th></tr></thead>';
        html += '<tbody>';
        html += '<tr><td>Cohen\'s d</td><td>0.2</td><td>0.5</td><td>0.8</td></tr>';
        html += '<tr><td>OR</td><td>1.5 / 0.67</td><td>2.5 / 0.4</td><td>4.3 / 0.23</td></tr>';
        html += '<tr><td>RR</td><td>1.22 / 0.82</td><td>1.86 / 0.54</td><td>3.00 / 0.33</td></tr>';
        html += '<tr style="background:var(--accent-muted)"><td><strong>Stroke-specific</strong></td><td>d &lt; 0.4</td><td>d 0.4-0.7</td><td>d &gt; 0.7</td></tr>';
        html += '</tbody></table>';

        // Formula reference
        html += '<div class="card-title mt-3">Conversion Formulas</div>';
        html += '<div class="text-output" style="font-family:monospace;font-size:0.85rem;line-height:1.8">'
            + 'd = ln(OR) / 1.81<br>'
            + 'OR = exp(1.81 &times; d)<br>'
            + 'RR = OR / (1 - P\u2080 + P\u2080 &times; OR)  &mdash; Zhang &amp; Yu<br>'
            + 'OR = RR &times; (1 - P\u2080) / (1 - RR &times; P\u2080)<br>'
            + 'RD = RR &times; P\u2080 - P\u2080<br>'
            + 'g = d &times; (1 - 3/(4(n\u2081+n\u2082-2) - 1))  &mdash; Hedge\'s correction'
            + '</div>';

        // Common OR shift visualization
        html += '<div class="card-title mt-3">Common OR to mRS Shift Visualization</div>';
        html += '<div class="card-subtitle">Shows how different common ORs shift a typical LVO control mRS distribution.</div>';
        html += '<div class="chart-container"><canvas id="es-shift-chart" width="700" height="350"></canvas></div>';
        html += '<div class="chart-actions">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'es-shift-chart\'),\'or-shift.png\')">Export PNG</button></div>';

        // Copy all
        html += '<div class="btn-group mt-3">'
            + '<button class="btn btn-secondary" onclick="EffectSizeModule.copyAll()">Copy All Results</button></div>';

        html += '</div>'; // result-panel

        App.setTrustedHTML(document.getElementById('es-results'), html);

        // Draw OR shift chart
        setTimeout(function () {
            drawShiftChart(main.or);
        }, 80);

        // Store for copy
        window._esCurrentRows = rows.map(function (r) {
            var est = main[r.key];
            var ciStr = '';
            if (ciLow && ciHigh) {
                var a = ciLow[r.key];
                var b = ciHigh[r.key];
                ciStr = '(' + Math.min(a, b).toFixed(r.dec) + ', ' + Math.max(a, b).toFixed(r.dec) + ')';
            }
            return r.label + ': ' + est.toFixed(r.dec) + ' ' + ciStr + (r.interp ? ' [' + r.interp + ']' : '');
        });

        Export.addToHistory(MODULE_ID, { type: type, val: val, p0: p0 }, 'OR=' + main.or.toFixed(2) + ', d=' + main.d.toFixed(2));
    }

    // ================================================================
    // SHIFT CHART
    // ================================================================

    function drawShiftChart(inputOR) {
        var canvas = document.getElementById('es-shift-chart');
        if (!canvas) return;

        // Use typical LVO control distribution
        var ctrl = [0.05, 0.07, 0.10, 0.10, 0.18, 0.20, 0.30];

        function shiftDist(dist, commonOR) {
            // Under proportional odds, cumulative probability shifts
            var cum = [];
            var s = 0;
            for (var i = 0; i < dist.length; i++) {
                s += dist[i];
                cum.push(s);
            }
            // Apply OR to cumulative odds: odds_new = OR * odds_old
            var newCum = [];
            for (var i = 0; i < cum.length - 1; i++) {
                var odds = cum[i] / (1 - cum[i]);
                var newOdds = commonOR * odds;
                newCum.push(newOdds / (1 + newOdds));
            }
            newCum.push(1.0);
            // Back to probabilities
            var newDist = [newCum[0]];
            for (var i = 1; i < newCum.length; i++) {
                newDist.push(Math.max(0, newCum[i] - newCum[i - 1]));
            }
            return newDist;
        }

        var ors = [1.0, 1.5, 2.0, 2.5];
        // If input OR is not close to any preset, add it
        var found = false;
        for (var i = 0; i < ors.length; i++) {
            if (Math.abs(ors[i] - inputOR) < 0.1) { found = true; break; }
        }
        if (!found && inputOR > 0.3 && inputOR < 10) {
            ors.push(inputOR);
            ors.sort(function (a, b) { return a - b; });
        }

        var series = ors.map(function (or) {
            var d = or === 1.0 ? ctrl : shiftDist(ctrl, or);
            return {
                label: 'OR = ' + or.toFixed(1),
                values: d.map(function (v) { return v * 100; })
            };
        });

        Charts.BarChart(canvas, {
            categories: ['mRS 0', 'mRS 1', 'mRS 2', 'mRS 3', 'mRS 4', 'mRS 5', 'mRS 6'],
            series: series,
            title: 'mRS Distribution by Common OR (Proportional Odds Shift)',
            yLabel: 'Proportion (%)',
            width: 700,
            height: 350,
            stacked: false
        });
    }

    // ================================================================
    // COPY ALL
    // ================================================================

    function copyAll() {
        if (!window._esCurrentRows || window._esCurrentRows.length === 0) {
            Export.showToast('No results to copy', 'error');
            return;
        }
        Export.copyText('=== Effect Size Conversions ===\n' + window._esCurrentRows.join('\n'));
    }

    // ================================================================
    // REGISTER
    // ================================================================

    App.registerModule(MODULE_ID, { render: render });

    window.EffectSizeModule = {
        onMeasureChange: onMeasureChange,
        convert: convert,
        copyAll: copyAll
    };
})();
