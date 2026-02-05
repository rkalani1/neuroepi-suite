/**
 * Neuro-Epi — Epidemiological Measures & Concepts
 * Interactive reference and calculators for epidemiological measures and fundamental concepts.
 * Disease frequency, measures of association, impact measures, screening, and study validity.
 */
(function() {
    'use strict';

    const MODULE_ID = 'epi-concepts';

    // ================================================================
    // RENDER
    // ================================================================
    function render(container) {
        var html = App.createModuleLayout(
            'Epidemiological Measures & Concepts',
            'Interactive reference for epidemiological measures with built-in calculators. Covers disease frequency, association, impact, screening, and validity.'
        );

        // Card 1: Measures of Disease Frequency
        html += renderDiseaseFrequency();

        // Card 2: Measures of Association
        html += renderAssociation();

        // Card 3: Measures of Impact
        html += renderImpact();

        // Card 4: Screening Concepts
        html += renderScreening();

        // Card 5: Study Validity Concepts
        html += renderValidity();

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);
    }

    // ================================================================
    // CARD 1: Measures of Disease Frequency
    // ================================================================
    function renderDiseaseFrequency() {
        var html = '<div class="card">';
        html += '<div class="card-title">Measures of Disease Frequency</div>';
        html += '<div class="card-subtitle">Interactive calculators and reference for common measures of disease occurrence.</div>';

        // Incidence Rate
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:4px;">Incidence Rate (Person-Time)</div>';
        html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">'
            + '<strong>Formula:</strong> IR = Number of new cases / Total person-time at risk<br>'
            + '<strong>Units:</strong> Cases per person-time (e.g., per 1,000 person-years)<br>'
            + '<strong>Interpretation:</strong> Instantaneous rate of developing disease among those still at risk. '
            + 'Unlike cumulative incidence, accounts for variable follow-up time.'
            + '</div>';
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">New Cases</label>'
            + '<input type="number" class="form-input" id="df-ir-cases" min="0" step="1" value="50"></div>';
        html += '<div class="form-group"><label class="form-label">Person-Time at Risk</label>'
            + '<input type="number" class="form-input" id="df-ir-pt" min="0.01" step="0.01" value="10000"></div>';
        html += '<div class="form-group"><label class="form-label">Multiplier</label>'
            + '<select class="form-select" id="df-ir-mult">'
            + '<option value="1">Per 1</option><option value="100">Per 100</option>'
            + '<option value="1000" selected>Per 1,000</option><option value="10000">Per 10,000</option>'
            + '<option value="100000">Per 100,000</option></select></div>';
        html += '</div>';
        html += '<div class="btn-group"><button class="btn btn-primary btn-xs" onclick="EpiConcepts.calcIR()">Calculate</button></div>';
        html += '<div id="df-ir-result" class="mt-1"></div>';
        html += '</div>';

        // Cumulative Incidence
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:4px;">Cumulative Incidence (Risk)</div>';
        html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">'
            + '<strong>Formula:</strong> CI = Number of new cases / Population at risk at start<br>'
            + '<strong>Range:</strong> 0 to 1 (or 0% to 100%)<br>'
            + '<strong>Interpretation:</strong> Probability of developing disease during a specified time period. '
            + 'Requires that the entire population is followed for the full period (or losses are accounted for).'
            + '</div>';
        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">New Cases</label>'
            + '<input type="number" class="form-input" id="df-ci-cases" min="0" step="1" value="50"></div>';
        html += '<div class="form-group"><label class="form-label">Population at Risk (start)</label>'
            + '<input type="number" class="form-input" id="df-ci-pop" min="1" step="1" value="5000"></div>';
        html += '</div>';
        html += '<div class="btn-group"><button class="btn btn-primary btn-xs" onclick="EpiConcepts.calcCI()">Calculate</button></div>';
        html += '<div id="df-ci-result" class="mt-1"></div>';
        html += '</div>';

        // Point Prevalence
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:4px;">Point Prevalence</div>';
        html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">'
            + '<strong>Formula:</strong> PP = Number of existing cases at a point in time / Total population at that time<br>'
            + '<strong>Interpretation:</strong> Proportion of the population with the disease at a single point in time. '
            + 'Affected by both incidence and disease duration.'
            + '</div>';
        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Existing Cases</label>'
            + '<input type="number" class="form-input" id="df-pp-cases" min="0" step="1" value="200"></div>';
        html += '<div class="form-group"><label class="form-label">Total Population</label>'
            + '<input type="number" class="form-input" id="df-pp-pop" min="1" step="1" value="10000"></div>';
        html += '</div>';
        html += '<div class="btn-group"><button class="btn btn-primary btn-xs" onclick="EpiConcepts.calcPP()">Calculate</button></div>';
        html += '<div id="df-pp-result" class="mt-1"></div>';
        html += '</div>';

        // Period Prevalence
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:4px;">Period Prevalence</div>';
        html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">'
            + '<strong>Formula:</strong> Period Prevalence = (Existing cases at start + New cases during period) / Average population during period<br>'
            + '<strong>Interpretation:</strong> Proportion of the population with the disease during an entire time period.'
            + '</div>';
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Cases at Start</label>'
            + '<input type="number" class="form-input" id="df-perp-exist" min="0" step="1" value="100"></div>';
        html += '<div class="form-group"><label class="form-label">New Cases in Period</label>'
            + '<input type="number" class="form-input" id="df-perp-new" min="0" step="1" value="50"></div>';
        html += '<div class="form-group"><label class="form-label">Average Population</label>'
            + '<input type="number" class="form-input" id="df-perp-pop" min="1" step="1" value="10000"></div>';
        html += '</div>';
        html += '<div class="btn-group"><button class="btn btn-primary btn-xs" onclick="EpiConcepts.calcPerP()">Calculate</button></div>';
        html += '<div id="df-perp-result" class="mt-1"></div>';
        html += '</div>';

        // Attack Rate
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:4px;">Attack Rate</div>';
        html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">'
            + '<strong>Formula:</strong> AR = Number of new cases during an outbreak / Population at risk at start of outbreak<br>'
            + '<strong>Interpretation:</strong> Cumulative incidence used during outbreaks. Often expressed as a percentage.'
            + '</div>';
        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Cases in Outbreak</label>'
            + '<input type="number" class="form-input" id="df-ar-cases" min="0" step="1" value="30"></div>';
        html += '<div class="form-group"><label class="form-label">Population at Risk</label>'
            + '<input type="number" class="form-input" id="df-ar-pop" min="1" step="1" value="200"></div>';
        html += '</div>';
        html += '<div class="btn-group"><button class="btn btn-primary btn-xs" onclick="EpiConcepts.calcAR()">Calculate</button></div>';
        html += '<div id="df-ar-result" class="mt-1"></div>';
        html += '</div>';

        // Case Fatality Rate
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:4px;">Case Fatality Rate (CFR)</div>';
        html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">'
            + '<strong>Formula:</strong> CFR = Number of deaths from disease / Number of cases of disease<br>'
            + '<strong>Interpretation:</strong> Proportion of cases who die. Reflects disease severity rather than risk of getting the disease.'
            + '</div>';
        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Deaths from Disease</label>'
            + '<input type="number" class="form-input" id="df-cfr-deaths" min="0" step="1" value="5"></div>';
        html += '<div class="form-group"><label class="form-label">Total Cases</label>'
            + '<input type="number" class="form-input" id="df-cfr-cases" min="1" step="1" value="50"></div>';
        html += '</div>';
        html += '<div class="btn-group"><button class="btn btn-primary btn-xs" onclick="EpiConcepts.calcCFR()">Calculate</button></div>';
        html += '<div id="df-cfr-result" class="mt-1"></div>';
        html += '</div>';

        // Mortality Rate
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:4px;">Mortality Rate</div>';
        html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">'
            + '<strong>Formula:</strong> Mortality Rate = Number of deaths / Total person-time (or mid-year population)<br>'
            + '<strong>Interpretation:</strong> Rate of death in the population. Can be cause-specific or all-cause.'
            + '</div>';
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Deaths</label>'
            + '<input type="number" class="form-input" id="df-mr-deaths" min="0" step="1" value="150"></div>';
        html += '<div class="form-group"><label class="form-label">Population</label>'
            + '<input type="number" class="form-input" id="df-mr-pop" min="1" step="1" value="100000"></div>';
        html += '<div class="form-group"><label class="form-label">Multiplier</label>'
            + '<select class="form-select" id="df-mr-mult">'
            + '<option value="1000">Per 1,000</option><option value="10000">Per 10,000</option>'
            + '<option value="100000" selected>Per 100,000</option></select></div>';
        html += '</div>';
        html += '<div class="btn-group"><button class="btn btn-primary btn-xs" onclick="EpiConcepts.calcMR()">Calculate</button></div>';
        html += '<div id="df-mr-result" class="mt-1"></div>';
        html += '</div>';

        // Proportional Mortality Ratio
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:4px;">Proportional Mortality Ratio (PMR)</div>';
        html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">'
            + '<strong>Formula:</strong> PMR = Deaths from specific cause / Total deaths from all causes<br>'
            + '<strong>Interpretation:</strong> Proportion of deaths attributable to a specific cause. '
            + 'A high PMR does not necessarily mean a high mortality rate (it depends on other causes of death).'
            + '</div>';
        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Deaths from Specific Cause</label>'
            + '<input type="number" class="form-input" id="df-pmr-cause" min="0" step="1" value="30"></div>';
        html += '<div class="form-group"><label class="form-label">Total Deaths (All Causes)</label>'
            + '<input type="number" class="form-input" id="df-pmr-total" min="1" step="1" value="500"></div>';
        html += '</div>';
        html += '<div class="btn-group"><button class="btn btn-primary btn-xs" onclick="EpiConcepts.calcPMR()">Calculate</button></div>';
        html += '<div id="df-pmr-result" class="mt-1"></div>';
        html += '</div>';

        html += '</div>';
        return html;
    }

    // Disease frequency calculators
    function calcIR() {
        var cases = parseFloat(document.getElementById('df-ir-cases').value);
        var pt = parseFloat(document.getElementById('df-ir-pt').value);
        var mult = parseFloat(document.getElementById('df-ir-mult').value);
        if (isNaN(cases) || isNaN(pt) || pt <= 0) return;
        var ir = (cases / pt) * mult;
        var html = '<div class="result-panel"><div class="result-value">' + ir.toFixed(2) + '<div class="result-label">per ' + mult.toLocaleString() + ' person-time</div></div>'
            + '<div class="result-detail">Incidence Rate = ' + cases + ' / ' + pt.toLocaleString() + ' = ' + (cases / pt).toExponential(4)
            + ' per person-time (' + ir.toFixed(2) + ' per ' + mult.toLocaleString() + ')</div></div>';
        App.setTrustedHTML(document.getElementById('df-ir-result'), html);
    }

    function calcCI() {
        var cases = parseFloat(document.getElementById('df-ci-cases').value);
        var pop = parseFloat(document.getElementById('df-ci-pop').value);
        if (isNaN(cases) || isNaN(pop) || pop <= 0) return;
        var ci = cases / pop;
        var html = '<div class="result-panel"><div class="result-value">' + (ci * 100).toFixed(2) + '%<div class="result-label">Cumulative Incidence</div></div>'
            + '<div class="result-detail">Risk = ' + cases + ' / ' + pop.toLocaleString() + ' = ' + ci.toFixed(4)
            + ' (' + (ci * 100).toFixed(2) + '%)</div></div>';
        App.setTrustedHTML(document.getElementById('df-ci-result'), html);
    }

    function calcPP() {
        var cases = parseFloat(document.getElementById('df-pp-cases').value);
        var pop = parseFloat(document.getElementById('df-pp-pop').value);
        if (isNaN(cases) || isNaN(pop) || pop <= 0) return;
        var pp = cases / pop;
        var html = '<div class="result-panel"><div class="result-value">' + (pp * 100).toFixed(2) + '%<div class="result-label">Point Prevalence</div></div>'
            + '<div class="result-detail">Prevalence = ' + cases + ' / ' + pop.toLocaleString() + ' = ' + pp.toFixed(4)
            + ' (' + (pp * 100).toFixed(2) + '%)</div></div>';
        App.setTrustedHTML(document.getElementById('df-pp-result'), html);
    }

    function calcPerP() {
        var exist = parseFloat(document.getElementById('df-perp-exist').value);
        var newCases = parseFloat(document.getElementById('df-perp-new').value);
        var pop = parseFloat(document.getElementById('df-perp-pop').value);
        if (isNaN(exist) || isNaN(newCases) || isNaN(pop) || pop <= 0) return;
        var perp = (exist + newCases) / pop;
        var html = '<div class="result-panel"><div class="result-value">' + (perp * 100).toFixed(2) + '%<div class="result-label">Period Prevalence</div></div>'
            + '<div class="result-detail">Period Prevalence = (' + exist + ' + ' + newCases + ') / ' + pop.toLocaleString() + ' = ' + perp.toFixed(4)
            + ' (' + (perp * 100).toFixed(2) + '%)</div></div>';
        App.setTrustedHTML(document.getElementById('df-perp-result'), html);
    }

    function calcAR() {
        var cases = parseFloat(document.getElementById('df-ar-cases').value);
        var pop = parseFloat(document.getElementById('df-ar-pop').value);
        if (isNaN(cases) || isNaN(pop) || pop <= 0) return;
        var ar = (cases / pop) * 100;
        var html = '<div class="result-panel"><div class="result-value">' + ar.toFixed(1) + '%<div class="result-label">Attack Rate</div></div>'
            + '<div class="result-detail">Attack Rate = ' + cases + ' / ' + pop + ' = ' + ar.toFixed(1) + '%</div></div>';
        App.setTrustedHTML(document.getElementById('df-ar-result'), html);
    }

    function calcCFR() {
        var deaths = parseFloat(document.getElementById('df-cfr-deaths').value);
        var cases = parseFloat(document.getElementById('df-cfr-cases').value);
        if (isNaN(deaths) || isNaN(cases) || cases <= 0) return;
        var cfr = (deaths / cases) * 100;
        var html = '<div class="result-panel"><div class="result-value">' + cfr.toFixed(1) + '%<div class="result-label">Case Fatality Rate</div></div>'
            + '<div class="result-detail">CFR = ' + deaths + ' / ' + cases + ' = ' + cfr.toFixed(1) + '%</div></div>';
        App.setTrustedHTML(document.getElementById('df-cfr-result'), html);
    }

    function calcMR() {
        var deaths = parseFloat(document.getElementById('df-mr-deaths').value);
        var pop = parseFloat(document.getElementById('df-mr-pop').value);
        var mult = parseFloat(document.getElementById('df-mr-mult').value);
        if (isNaN(deaths) || isNaN(pop) || pop <= 0) return;
        var mr = (deaths / pop) * mult;
        var html = '<div class="result-panel"><div class="result-value">' + mr.toFixed(2) + '<div class="result-label">per ' + mult.toLocaleString() + '</div></div>'
            + '<div class="result-detail">Mortality Rate = ' + deaths + ' / ' + pop.toLocaleString() + ' = '
            + mr.toFixed(2) + ' per ' + mult.toLocaleString() + '</div></div>';
        App.setTrustedHTML(document.getElementById('df-mr-result'), html);
    }

    function calcPMR() {
        var cause = parseFloat(document.getElementById('df-pmr-cause').value);
        var total = parseFloat(document.getElementById('df-pmr-total').value);
        if (isNaN(cause) || isNaN(total) || total <= 0) return;
        var pmr = (cause / total) * 100;
        var html = '<div class="result-panel"><div class="result-value">' + pmr.toFixed(1) + '%<div class="result-label">PMR</div></div>'
            + '<div class="result-detail">PMR = ' + cause + ' / ' + total + ' = ' + pmr.toFixed(1) + '% of all deaths</div></div>';
        App.setTrustedHTML(document.getElementById('df-pmr-result'), html);
    }

    // ================================================================
    // CARD 2: Measures of Association
    // ================================================================
    function renderAssociation() {
        var html = '<div class="card">';
        html += '<div class="card-title">Measures of Association</div>';
        html += '<div class="card-subtitle">Calculate measures of association from a 2x2 table. Enter cell values and compute all association measures.</div>';

        // 2x2 Table Input
        html += '<div style="max-width:520px;margin:0 auto 16px;">';
        html += '<table class="data-table" style="text-align:center;">';
        html += '<thead><tr><th></th><th colspan="2" style="text-align:center;">Outcome</th><th></th></tr>'
            + '<tr><th>Exposure</th><th style="text-align:center;">Disease+ (D+)</th><th style="text-align:center;">Disease- (D-)</th><th style="text-align:center;">Total</th></tr></thead>';
        html += '<tbody>'
            + '<tr><td style="font-weight:600;">Exposed (E+)</td>'
            + '<td><input type="number" class="form-input" id="assoc-a" min="0" step="1" value="30" style="width:80px;margin:0 auto;text-align:center;"></td>'
            + '<td><input type="number" class="form-input" id="assoc-b" min="0" step="1" value="70" style="width:80px;margin:0 auto;text-align:center;"></td>'
            + '<td id="assoc-m1" style="font-weight:600;">100</td></tr>'
            + '<tr><td style="font-weight:600;">Unexposed (E-)</td>'
            + '<td><input type="number" class="form-input" id="assoc-c" min="0" step="1" value="10" style="width:80px;margin:0 auto;text-align:center;"></td>'
            + '<td><input type="number" class="form-input" id="assoc-d" min="0" step="1" value="90" style="width:80px;margin:0 auto;text-align:center;"></td>'
            + '<td id="assoc-m0" style="font-weight:600;">100</td></tr>'
            + '<tr><td style="font-weight:600;">Total</td>'
            + '<td id="assoc-n1" style="font-weight:600;">40</td>'
            + '<td id="assoc-n0" style="font-weight:600;">160</td>'
            + '<td id="assoc-n" style="font-weight:600;">200</td></tr>'
            + '</tbody></table>';
        html += '</div>';

        html += '<div class="btn-group" style="justify-content:center;">'
            + '<button class="btn btn-primary" onclick="EpiConcepts.calcAssociation()">Calculate All</button>'
            + '<button class="btn btn-secondary" onclick="EpiConcepts.copyAssociation()">Copy Results</button>'
            + '</div>';

        html += '<div id="assoc-results" class="mt-2"></div>';
        html += '</div>';
        return html;
    }

    function calcAssociation() {
        var a = parseFloat(document.getElementById('assoc-a').value) || 0;
        var b = parseFloat(document.getElementById('assoc-b').value) || 0;
        var c = parseFloat(document.getElementById('assoc-c').value) || 0;
        var d = parseFloat(document.getElementById('assoc-d').value) || 0;

        var m1 = a + b;
        var m0 = c + d;
        var n1 = a + c;
        var n0 = b + d;
        var n = a + b + c + d;

        // Update totals
        App.setTrustedHTML(document.getElementById('assoc-m1'), m1.toString());
        App.setTrustedHTML(document.getElementById('assoc-m0'), m0.toString());
        App.setTrustedHTML(document.getElementById('assoc-n1'), n1.toString());
        App.setTrustedHTML(document.getElementById('assoc-n0'), n0.toString());
        App.setTrustedHTML(document.getElementById('assoc-n'), n.toString());

        if (n === 0 || m1 === 0 || m0 === 0) {
            App.setTrustedHTML(document.getElementById('assoc-results'),
                '<div class="result-panel" style="color:var(--danger);">Please enter valid cell counts (row totals must be > 0).</div>');
            return;
        }

        var riskE = a / m1;
        var riskU = c / m0;

        // Risk Ratio
        var rr = riskE / riskU;
        var lnRR = Math.log(rr);
        var seRR = Math.sqrt((1 / a) - (1 / m1) + (1 / c) - (1 / m0));
        var rrLo = Math.exp(lnRR - 1.96 * seRR);
        var rrHi = Math.exp(lnRR + 1.96 * seRR);

        // Odds Ratio
        var or_val = (a * d) / (b * c);
        var lnOR = Math.log(or_val);
        var seOR = Math.sqrt(1 / a + 1 / b + 1 / c + 1 / d);
        var orLo = Math.exp(lnOR - 1.96 * seOR);
        var orHi = Math.exp(lnOR + 1.96 * seOR);

        // Risk Difference
        var rd = riskE - riskU;
        var seRD = Math.sqrt((riskE * (1 - riskE)) / m1 + (riskU * (1 - riskU)) / m0);
        var rdLo = rd - 1.96 * seRD;
        var rdHi = rd + 1.96 * seRD;

        // AR% (Attributable Risk Percent)
        var arp = ((rr - 1) / rr) * 100;

        // PAR
        var pE = m1 / n;
        var par = (pE * (rr - 1)) / (1 + pE * (rr - 1));

        // PAF
        var paf = par * 100;

        // NNT/NNH
        var nnt = Math.abs(1 / rd);

        var html = '<div class="result-panel">';
        html += '<div class="card-title">Association Measures</div>';
        html += '<div class="table-container"><table class="data-table">';
        html += '<thead><tr><th>Measure</th><th>Value</th><th>95% CI</th><th>Interpretation</th></tr></thead>';
        html += '<tbody>';

        html += '<tr><td><strong>Risk Ratio (RR)</strong></td><td>' + rr.toFixed(3) + '</td><td>' + rrLo.toFixed(3) + ' - ' + rrHi.toFixed(3) + '</td>'
            + '<td>' + interpretRR(rr) + '</td></tr>';

        html += '<tr><td><strong>Odds Ratio (OR)</strong></td><td>' + or_val.toFixed(3) + '</td><td>' + orLo.toFixed(3) + ' - ' + orHi.toFixed(3) + '</td>'
            + '<td>' + interpretOR(or_val) + '</td></tr>';

        html += '<tr><td><strong>Risk Difference (RD)</strong></td><td>' + rd.toFixed(4) + '</td><td>' + rdLo.toFixed(4) + ' - ' + rdHi.toFixed(4) + '</td>'
            + '<td>' + interpretRD(rd) + '</td></tr>';

        html += '<tr><td><strong>AR% (Attributable Risk %)</strong></td><td>' + arp.toFixed(1) + '%</td><td>-</td>'
            + '<td>' + arp.toFixed(1) + '% of cases in the exposed group are attributable to the exposure</td></tr>';

        html += '<tr><td><strong>PAR (Pop. Attr. Risk)</strong></td><td>' + par.toFixed(4) + '</td><td>-</td>'
            + '<td>Proportion of disease in the population attributable to the exposure</td></tr>';

        html += '<tr><td><strong>PAF (Pop. Attr. Fraction)</strong></td><td>' + paf.toFixed(1) + '%</td><td>-</td>'
            + '<td>' + paf.toFixed(1) + '% of disease in the population could be prevented by eliminating the exposure</td></tr>';

        var nntLabel = rd > 0 ? 'NNH (Number Needed to Harm)' : 'NNT (Number Needed to Treat)';
        html += '<tr><td><strong>' + nntLabel + '</strong></td><td>' + (isFinite(nnt) ? Math.ceil(nnt) : 'N/A') + '</td><td>-</td>'
            + '<td>' + (isFinite(nnt) ? (rd > 0 ? 'For every ' + Math.ceil(nnt) + ' exposed, 1 additional case occurs'
            : 'Need to treat ' + Math.ceil(nnt) + ' to prevent 1 case') : 'No difference in risk') + '</td></tr>';

        html += '</tbody></table></div>';

        html += '<div style="margin-top:12px;font-size:0.8rem;color:var(--text-tertiary);">'
            + 'Note: 95% CIs calculated using Wald method (log-transformed for RR and OR). '
            + 'For small cell counts, consider exact methods (Fisher, mid-P).'
            + '</div>';

        html += '</div>';
        App.setTrustedHTML(document.getElementById('assoc-results'), html);
    }

    function interpretRR(rr) {
        if (rr > 1) return 'Exposed group has ' + rr.toFixed(2) + 'x the risk of the unexposed group (increased risk).';
        if (rr < 1) return 'Exposed group has ' + (rr * 100).toFixed(0) + '% the risk of the unexposed (decreased risk; protective).';
        return 'No association (RR = 1).';
    }

    function interpretOR(or_val) {
        if (or_val > 1) return 'The odds of disease are ' + or_val.toFixed(2) + 'x higher in the exposed group.';
        if (or_val < 1) return 'The odds of disease are ' + ((1 - or_val) * 100).toFixed(0) + '% lower in the exposed group (protective).';
        return 'No association (OR = 1).';
    }

    function interpretRD(rd) {
        if (rd > 0) return 'The exposed group has an absolute ' + (rd * 100).toFixed(1) + ' percentage point higher risk.';
        if (rd < 0) return 'The exposed group has an absolute ' + (Math.abs(rd) * 100).toFixed(1) + ' percentage point lower risk.';
        return 'No difference in risk.';
    }

    function copyAssociation() {
        var el = document.getElementById('assoc-results');
        if (el) Export.copyText(el.textContent);
    }

    // ================================================================
    // CARD 3: Measures of Impact
    // ================================================================
    function renderImpact() {
        var html = '<div class="card">';
        html += '<div class="card-title">Measures of Impact</div>';
        html += '<div class="card-subtitle">Population-level measures used to quantify the burden of disease and the potential impact of interventions.</div>';

        var measures = [
            {
                name: 'Attributable Fraction in Exposed (AFe)',
                formula: 'AFe = (RR - 1) / RR',
                alt: 'Also: (Risk in exposed - Risk in unexposed) / Risk in exposed',
                when: 'Quantifies the proportion of disease in the exposed group that is due to the exposure. Used when the exposure is harmful (RR > 1).',
                example: 'If RR = 3.0, then AFe = (3 - 1) / 3 = 0.67. Among exposed individuals who developed disease, 67% of their disease can be attributed to the exposure.'
            },
            {
                name: 'Attributable Fraction in Population (AFp)',
                formula: 'AFp = Pe(RR - 1) / [1 + Pe(RR - 1)]',
                alt: 'Also known as Population Attributable Fraction (PAF). Pe = prevalence of exposure in the population.',
                when: 'Quantifies the proportion of disease in the total population attributable to the exposure. Used for public health planning to estimate potential impact of eliminating an exposure.',
                example: 'If RR = 3.0 and Pe = 0.30, then AFp = 0.30(2) / [1 + 0.30(2)] = 0.375. Eliminating the exposure would reduce disease by 37.5% in the population.'
            },
            {
                name: 'Prevented Fraction (PF)',
                formula: 'PF = 1 - RR (when RR < 1)',
                alt: 'Also: (Risk in unexposed - Risk in exposed) / Risk in unexposed',
                when: 'Used when the exposure is protective (RR < 1), such as vaccination. Quantifies the proportion of potential cases that were prevented.',
                example: 'If RR = 0.40, then PF = 1 - 0.40 = 0.60. The protective exposure prevented 60% of cases that would have occurred.'
            },
            {
                name: 'Years of Potential Life Lost (YPLL)',
                formula: 'YPLL = Sum of (Reference age - Age at death) for each death',
                alt: 'Reference age is typically 65 or 75 years. Only premature deaths are counted.',
                when: 'Measures premature mortality. Gives more weight to deaths at younger ages. Used to set public health priorities by identifying causes of premature death.',
                example: 'A death at age 25 (reference 75) contributes 50 YPLL. A death at age 70 contributes 5 YPLL. Emphasizes conditions killing younger people.'
            },
            {
                name: 'Disability-Adjusted Life Years (DALYs)',
                formula: 'DALYs = YLL + YLD',
                alt: 'YLL = Years of Life Lost (premature mortality). YLD = Years Lived with Disability (morbidity, weighted by disability weight 0-1).',
                when: 'Combines mortality and morbidity into a single measure. 1 DALY = 1 year of healthy life lost. Used by WHO and Global Burden of Disease Study for health priority setting.',
                example: 'Stroke: 5 years lived with disability (weight 0.3) + death 10 years early = YLD(1.5) + YLL(10) = 11.5 DALYs.'
            },
            {
                name: 'Quality-Adjusted Life Years (QALYs)',
                formula: 'QALYs = Sum of (Quality weight x Time in health state)',
                alt: 'Quality weight ranges from 0 (death) to 1 (perfect health). Can be negative for states worse than death.',
                when: 'Used in health economics and cost-effectiveness analyses. 1 QALY = 1 year in perfect health. Combines quantity and quality of life.',
                example: 'Treatment A: 10 years at quality 0.8 = 8 QALYs. Treatment B: 8 years at quality 1.0 = 8 QALYs. Both yield the same QALYs despite different trade-offs.'
            }
        ];

        for (var i = 0; i < measures.length; i++) {
            var m = measures[i];
            html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:12px;">';
            html += '<div style="font-weight:700;font-size:1rem;margin-bottom:4px;">' + m.name + '</div>';
            html += '<div style="font-size:0.9rem;line-height:1.6;">';
            html += '<div style="margin-bottom:4px;"><strong>Formula:</strong> <code style="background:var(--bg-tertiary);padding:2px 6px;border-radius:4px;">' + m.formula + '</code></div>';
            html += '<div style="margin-bottom:4px;font-size:0.85rem;color:var(--text-secondary);">' + m.alt + '</div>';
            html += '<div style="margin-bottom:4px;"><strong>When to use:</strong> ' + m.when + '</div>';
            html += '<div style="background:var(--bg-tertiary);border-radius:6px;padding:8px;font-size:0.85rem;"><strong>Example:</strong> ' + m.example + '</div>';
            html += '</div></div>';
        }

        // Quick impact calculator
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:12px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:8px;">Quick Impact Calculator</div>';
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Relative Risk (RR)</label>'
            + '<input type="number" class="form-input" id="impact-rr" min="0.01" step="0.01" value="2.5"></div>';
        html += '<div class="form-group"><label class="form-label">Prevalence of Exposure (Pe)</label>'
            + '<input type="number" class="form-input" id="impact-pe" min="0" max="1" step="0.01" value="0.25"></div>';
        html += '<div class="form-group"><label class="form-label">&nbsp;</label>'
            + '<button class="btn btn-primary" onclick="EpiConcepts.calcImpact()">Calculate</button></div>';
        html += '</div>';
        html += '<div id="impact-results"></div>';
        html += '</div>';

        html += '</div>';
        return html;
    }

    function calcImpact() {
        var rr = parseFloat(document.getElementById('impact-rr').value);
        var pe = parseFloat(document.getElementById('impact-pe').value);
        if (isNaN(rr) || isNaN(pe) || rr <= 0) return;

        var afe = (rr - 1) / rr;
        var afp = (pe * (rr - 1)) / (1 + pe * (rr - 1));
        var pf = 1 - rr;

        var html = '<div class="result-panel mt-1">';
        html += '<div class="form-row form-row--3">';
        html += '<div><div class="result-value">' + (afe * 100).toFixed(1) + '%<div class="result-label">AFe</div></div></div>';
        html += '<div><div class="result-value">' + (afp * 100).toFixed(1) + '%<div class="result-label">AFp / PAF</div></div></div>';
        if (rr < 1) {
            html += '<div><div class="result-value">' + (pf * 100).toFixed(1) + '%<div class="result-label">Prevented Fraction</div></div></div>';
        } else {
            html += '<div><div class="result-value">N/A<div class="result-label">PF (requires RR &lt; 1)</div></div></div>';
        }
        html += '</div>';

        html += '<div class="result-detail mt-1">';
        if (rr > 1) {
            html += 'Among the exposed, ' + (afe * 100).toFixed(1) + '% of disease is attributable to the exposure. '
                + 'In the total population, ' + (afp * 100).toFixed(1) + '% of disease could be prevented by eliminating the exposure.';
        } else if (rr < 1) {
            html += 'The exposure is protective. ' + (pf * 100).toFixed(1) + '% of potential cases are prevented by the exposure.';
        } else {
            html += 'RR = 1 indicates no association.';
        }
        html += '</div></div>';

        App.setTrustedHTML(document.getElementById('impact-results'), html);
    }

    // ================================================================
    // CARD 4: Screening Concepts
    // ================================================================
    function renderScreening() {
        var html = '<div class="card">';
        html += '<div class="card-title">Screening Concepts</div>';
        html += '<div class="card-subtitle">Calculate screening test properties and explore how prevalence affects predictive values.</div>';

        // 2x2 for screening
        html += '<div style="max-width:520px;margin:0 auto 16px;">';
        html += '<table class="data-table" style="text-align:center;">';
        html += '<thead><tr><th></th><th colspan="2" style="text-align:center;">Disease Status</th></tr>'
            + '<tr><th>Test Result</th><th style="text-align:center;">Disease+</th><th style="text-align:center;">Disease-</th></tr></thead>';
        html += '<tbody>'
            + '<tr><td style="font-weight:600;">Test +</td>'
            + '<td><input type="number" class="form-input" id="scr-tp" min="0" step="1" value="90" style="width:80px;margin:0 auto;text-align:center;">'
            + '<div style="font-size:0.7rem;color:var(--text-tertiary);">TP</div></td>'
            + '<td><input type="number" class="form-input" id="scr-fp" min="0" step="1" value="50" style="width:80px;margin:0 auto;text-align:center;">'
            + '<div style="font-size:0.7rem;color:var(--text-tertiary);">FP</div></td></tr>'
            + '<tr><td style="font-weight:600;">Test -</td>'
            + '<td><input type="number" class="form-input" id="scr-fn" min="0" step="1" value="10" style="width:80px;margin:0 auto;text-align:center;">'
            + '<div style="font-size:0.7rem;color:var(--text-tertiary);">FN</div></td>'
            + '<td><input type="number" class="form-input" id="scr-tn" min="0" step="1" value="850" style="width:80px;margin:0 auto;text-align:center;">'
            + '<div style="font-size:0.7rem;color:var(--text-tertiary);">TN</div></td></tr>'
            + '</tbody></table>';
        html += '</div>';

        html += '<div class="btn-group" style="justify-content:center;">'
            + '<button class="btn btn-primary" onclick="EpiConcepts.calcScreening()">Calculate</button>'
            + '<button class="btn btn-secondary" onclick="EpiConcepts.copyScreening()">Copy Results</button>'
            + '</div>';
        html += '<div id="scr-results" class="mt-2"></div>';

        // Prevalence and predictive values
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-top:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;margin-bottom:8px;">Prevalence and Predictive Values</div>';
        html += '<div style="font-size:0.9rem;line-height:1.7;margin-bottom:12px;">'
            + '<p><strong>Key relationship:</strong> As prevalence <em>increases</em>, PPV <em>increases</em> and NPV <em>decreases</em>. '
            + 'As prevalence <em>decreases</em>, PPV <em>decreases</em> and NPV <em>increases</em>.</p>'
            + '<p style="margin-top:8px;">This means that in low-prevalence populations, even a highly specific test will produce many false positives relative to true positives, '
            + 'resulting in a low PPV. Screening programs must account for this when applied to general populations.</p>'
            + '</div>';
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Sensitivity</label>'
            + '<input type="number" class="form-input" id="scr-prev-sens" min="0" max="100" step="1" value="90"></div>';
        html += '<div class="form-group"><label class="form-label">Specificity</label>'
            + '<input type="number" class="form-input" id="scr-prev-spec" min="0" max="100" step="1" value="95"></div>';
        html += '<div class="form-group"><label class="form-label">Prevalence (%)</label>'
            + '<input type="number" class="form-input" id="scr-prev-prev" min="0.01" max="100" step="0.1" value="5"></div>';
        html += '</div>';
        html += '<div class="btn-group"><button class="btn btn-primary btn-xs" onclick="EpiConcepts.calcPrevPV()">Calculate PPV/NPV</button></div>';
        html += '<div id="scr-prev-results" class="mt-1"></div>';
        html += '</div>';

        // Screening biases
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;margin-bottom:8px;">Biases in Screening</div>';
        html += '<div style="font-size:0.9rem;line-height:1.7;">';

        html += '<div style="margin-bottom:12px;padding:12px;background:var(--bg-tertiary);border-radius:8px;">'
            + '<div style="font-weight:600;">Lead-Time Bias</div>'
            + '<div>Screening detects disease earlier, making survival <em>appear</em> longer even if the patient dies at the same time they would have without screening. '
            + 'The "lead time" is the interval between screening detection and when the disease would have been diagnosed clinically.</div></div>';

        html += '<div style="margin-bottom:12px;padding:12px;background:var(--bg-tertiary);border-radius:8px;">'
            + '<div style="font-weight:600;">Length-Time Bias</div>'
            + '<div>Screening preferentially detects slower-growing, less aggressive disease (which is present in the detectable preclinical phase for longer). '
            + 'This makes screen-detected cases appear to have better prognosis, even if screening has no true benefit.</div></div>';

        html += '<div style="margin-bottom:12px;padding:12px;background:var(--bg-tertiary);border-radius:8px;">'
            + '<div style="font-weight:600;">Overdiagnosis</div>'
            + '<div>Detection of disease that would never have caused symptoms or death during the patient\'s lifetime. '
            + 'These patients are "harmed" by diagnosis (anxiety, unnecessary treatment) with no benefit. '
            + 'Common in cancer screening (e.g., some prostate, thyroid, and breast cancers).</div></div>';

        html += '</div></div>';

        // Wilson & Jungner
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;margin-bottom:8px;">Wilson & Jungner Criteria for Screening Programs (1968)</div>';
        html += '<div style="font-size:0.9rem;line-height:1.7;">';
        html += '<ol style="margin-left:20px;">';
        html += '<li>The condition should be an <strong>important health problem</strong></li>';
        html += '<li>There should be an <strong>accepted treatment</strong> for patients with recognized disease</li>';
        html += '<li>Facilities for <strong>diagnosis and treatment</strong> should be available</li>';
        html += '<li>There should be a <strong>recognizable latent or early symptomatic stage</strong></li>';
        html += '<li>There should be a suitable <strong>test or examination</strong></li>';
        html += '<li>The test should be <strong>acceptable to the population</strong></li>';
        html += '<li>The <strong>natural history</strong> of the condition should be adequately understood</li>';
        html += '<li>There should be an <strong>agreed policy</strong> on whom to treat as patients</li>';
        html += '<li>The cost of case-finding should be <strong>economically balanced</strong> in relation to expenditure on medical care as a whole</li>';
        html += '<li>Case-finding should be a <strong>continuing process</strong>, not a one-time project</li>';
        html += '</ol></div></div>';

        // NNS
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;">';
        html += '<div style="font-weight:700;margin-bottom:8px;">Number Needed to Screen (NNS)</div>';
        html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">'
            + '<strong>Formula:</strong> NNS = 1 / (Absolute risk reduction from screening)<br>'
            + 'Alternatively: NNS = 1 / (Incidence x Sensitivity x Treatment benefit)<br>'
            + '<strong>Interpretation:</strong> The number of people who need to be screened to prevent one adverse outcome.'
            + '</div>';
        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Absolute Risk Reduction from Screening</label>'
            + '<input type="number" class="form-input" id="scr-nns-arr" min="0.0001" step="0.0001" value="0.002"></div>';
        html += '<div class="form-group"><label class="form-label">&nbsp;</label>'
            + '<button class="btn btn-primary btn-xs" onclick="EpiConcepts.calcNNS()">Calculate NNS</button></div>';
        html += '</div>';
        html += '<div id="scr-nns-result"></div>';
        html += '</div>';

        html += '</div>';
        return html;
    }

    function calcScreening() {
        var tp = parseFloat(document.getElementById('scr-tp').value) || 0;
        var fp = parseFloat(document.getElementById('scr-fp').value) || 0;
        var fn = parseFloat(document.getElementById('scr-fn').value) || 0;
        var tn = parseFloat(document.getElementById('scr-tn').value) || 0;

        var n = tp + fp + fn + tn;
        if (n === 0) return;

        var sens = tp / (tp + fn);
        var spec = tn / (tn + fp);
        var ppv = tp / (tp + fp);
        var npv = tn / (tn + fn);
        var prev = (tp + fn) / n;
        var acc = (tp + tn) / n;
        var plr = sens / (1 - spec);
        var nlr = (1 - sens) / spec;
        var youden = sens + spec - 1;

        var html = '<div class="result-panel">';
        html += '<div class="card-title">Screening Test Properties</div>';
        html += '<div class="table-container"><table class="data-table">';
        html += '<thead><tr><th>Measure</th><th>Value</th><th>Interpretation</th></tr></thead>';
        html += '<tbody>';
        html += '<tr><td><strong>Sensitivity</strong></td><td>' + (sens * 100).toFixed(1) + '%</td>'
            + '<td>Probability of a positive test given disease present (SnNOut: sensitive test rules OUT)</td></tr>';
        html += '<tr><td><strong>Specificity</strong></td><td>' + (spec * 100).toFixed(1) + '%</td>'
            + '<td>Probability of a negative test given no disease (SpPIn: specific test rules IN)</td></tr>';
        html += '<tr><td><strong>PPV</strong></td><td>' + (ppv * 100).toFixed(1) + '%</td>'
            + '<td>Probability of disease given a positive test</td></tr>';
        html += '<tr><td><strong>NPV</strong></td><td>' + (npv * 100).toFixed(1) + '%</td>'
            + '<td>Probability of no disease given a negative test</td></tr>';
        html += '<tr><td><strong>Prevalence</strong></td><td>' + (prev * 100).toFixed(1) + '%</td>'
            + '<td>Pre-test probability in this sample</td></tr>';
        html += '<tr><td><strong>Accuracy</strong></td><td>' + (acc * 100).toFixed(1) + '%</td>'
            + '<td>Overall correct classification rate</td></tr>';
        html += '<tr><td><strong>+LR</strong></td><td>' + plr.toFixed(2) + '</td>'
            + '<td>' + interpretLR(plr, true) + '</td></tr>';
        html += '<tr><td><strong>-LR</strong></td><td>' + nlr.toFixed(3) + '</td>'
            + '<td>' + interpretLR(nlr, false) + '</td></tr>';
        html += '<tr><td><strong>Youden Index (J)</strong></td><td>' + youden.toFixed(3) + '</td>'
            + '<td>Overall test performance (0 = useless, 1 = perfect)</td></tr>';
        html += '</tbody></table></div></div>';

        App.setTrustedHTML(document.getElementById('scr-results'), html);
    }

    function interpretLR(lr, positive) {
        if (positive) {
            if (lr > 10) return 'Large increase in post-test probability (strong rule-in)';
            if (lr > 5) return 'Moderate increase in post-test probability';
            if (lr > 2) return 'Small increase in post-test probability';
            return 'Minimal change in post-test probability';
        } else {
            if (lr < 0.1) return 'Large decrease in post-test probability (strong rule-out)';
            if (lr < 0.2) return 'Moderate decrease in post-test probability';
            if (lr < 0.5) return 'Small decrease in post-test probability';
            return 'Minimal change in post-test probability';
        }
    }

    function calcPrevPV() {
        var sens = parseFloat(document.getElementById('scr-prev-sens').value) / 100;
        var spec = parseFloat(document.getElementById('scr-prev-spec').value) / 100;
        var prev = parseFloat(document.getElementById('scr-prev-prev').value) / 100;
        if (isNaN(sens) || isNaN(spec) || isNaN(prev)) return;

        // Bayes theorem
        var ppv = (sens * prev) / (sens * prev + (1 - spec) * (1 - prev));
        var npv = (spec * (1 - prev)) / ((1 - sens) * prev + spec * (1 - prev));

        var html = '<div class="result-panel">';
        html += '<div class="form-row form-row--2">';
        html += '<div><div class="result-value">' + (ppv * 100).toFixed(1) + '%<div class="result-label">PPV</div></div></div>';
        html += '<div><div class="result-value">' + (npv * 100).toFixed(1) + '%<div class="result-label">NPV</div></div></div>';
        html += '</div>';
        html += '<div class="result-detail mt-1">At a prevalence of ' + (prev * 100).toFixed(1) + '% with sensitivity ' + (sens * 100).toFixed(0)
            + '% and specificity ' + (spec * 100).toFixed(0) + '%, the PPV is ' + (ppv * 100).toFixed(1)
            + '% and NPV is ' + (npv * 100).toFixed(1) + '%.</div>';
        html += '</div>';

        App.setTrustedHTML(document.getElementById('scr-prev-results'), html);
    }

    function copyScreening() {
        var el = document.getElementById('scr-results');
        if (el) Export.copyText(el.textContent);
    }

    function calcNNS() {
        var arr = parseFloat(document.getElementById('scr-nns-arr').value);
        if (isNaN(arr) || arr <= 0) return;
        var nns = Math.ceil(1 / arr);
        var html = '<div class="result-panel mt-1"><div class="result-value">' + nns.toLocaleString()
            + '<div class="result-label">Number Needed to Screen</div></div>'
            + '<div class="result-detail">' + nns.toLocaleString() + ' people need to be screened to prevent 1 adverse outcome '
            + '(based on ARR of ' + arr + ').</div></div>';
        App.setTrustedHTML(document.getElementById('scr-nns-result'), html);
    }

    // ================================================================
    // CARD 5: Study Validity Concepts
    // ================================================================
    function renderValidity() {
        var html = '<div class="card">';
        html += '<div class="card-title">Study Validity Concepts</div>';
        html += '<div class="card-subtitle">Reference for key concepts in study validity, bias, and error in epidemiological research.</div>';

        // Internal vs External Validity
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:8px;">Internal Validity vs. External Validity</div>';
        html += '<div class="form-row form-row--2" style="gap:16px;">';
        html += '<div style="padding:12px;background:var(--bg-tertiary);border-radius:8px;">'
            + '<div style="font-weight:600;margin-bottom:4px;">Internal Validity</div>'
            + '<div style="font-size:0.9rem;line-height:1.6;">The degree to which the study results are correct for the study population. '
            + 'A study has high internal validity when the observed association is a true reflection of cause and effect (not due to systematic error). '
            + 'Threats: selection bias, information bias, confounding.</div></div>';
        html += '<div style="padding:12px;background:var(--bg-tertiary);border-radius:8px;">'
            + '<div style="font-weight:600;margin-bottom:4px;">External Validity (Generalizability)</div>'
            + '<div style="font-size:0.9rem;line-height:1.6;">The degree to which study results can be applied to populations beyond the study population. '
            + 'Also called generalizability or applicability. A study can have high internal validity but low external validity '
            + '(e.g., tightly controlled trial in a narrow population). Internal validity is a prerequisite for external validity.</div></div>';
        html += '</div></div>';

        // Types of Bias
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:8px;">Types of Systematic Error (Bias)</div>';

        html += '<div style="margin-bottom:12px;padding:12px;background:var(--bg-tertiary);border-radius:8px;">';
        html += '<div style="font-weight:600;color:var(--danger);margin-bottom:4px;">Selection Bias</div>';
        html += '<div style="font-size:0.9rem;line-height:1.6;">'
            + 'Occurs when the study population is not representative of the target population, or when study participation is related to both exposure and outcome. '
            + 'Results from errors in how participants are selected or retained.'
            + '<ul style="margin:8px 0 0 20px;">'
            + '<li><strong>Berkson\'s bias:</strong> Hospital-based selection where exposure and disease both increase hospitalization probability</li>'
            + '<li><strong>Neyman (prevalence-incidence) bias:</strong> Prevalent cases miss rapidly fatal or quickly resolving cases</li>'
            + '<li><strong>Healthy worker effect:</strong> Workers are generally healthier than the general population</li>'
            + '<li><strong>Self-selection bias:</strong> Participants who volunteer differ from non-volunteers</li>'
            + '<li><strong>Loss to follow-up:</strong> Differential attrition related to exposure and outcome</li>'
            + '<li><strong>Immortal time bias:</strong> Period during which the outcome cannot occur is misclassified</li>'
            + '</ul></div></div>';

        html += '<div style="margin-bottom:12px;padding:12px;background:var(--bg-tertiary);border-radius:8px;">';
        html += '<div style="font-weight:600;color:var(--warning);margin-bottom:4px;">Information Bias (Measurement Bias)</div>';
        html += '<div style="font-size:0.9rem;line-height:1.6;">'
            + 'Occurs when exposure or outcome is measured or classified incorrectly. Can be non-differential (equal in compared groups) or differential.'
            + '<ul style="margin:8px 0 0 20px;">'
            + '<li><strong>Recall bias:</strong> Cases remember/report exposures differently than controls</li>'
            + '<li><strong>Interviewer bias:</strong> Interviewer probes differently based on case/control status</li>'
            + '<li><strong>Misclassification:</strong> Non-differential (random, biases toward null) or differential (biases in either direction)</li>'
            + '<li><strong>Detection/surveillance bias:</strong> Exposed group monitored more closely, leading to more diagnoses</li>'
            + '<li><strong>Social desirability bias:</strong> Participants underreport stigmatized behaviors</li>'
            + '</ul></div></div>';

        html += '<div style="margin-bottom:12px;padding:12px;background:var(--bg-tertiary);border-radius:8px;">';
        html += '<div style="font-weight:600;color:var(--primary);margin-bottom:4px;">Confounding</div>';
        html += '<div style="font-size:0.9rem;line-height:1.6;">'
            + 'A confounder is a variable that is: (1) associated with the exposure, (2) independently associated with the outcome, '
            + 'and (3) not on the causal pathway between exposure and outcome. Confounding distorts the true relationship.'
            + '<div style="margin-top:8px;"><strong>Methods to control confounding:</strong></div>'
            + '<ul style="margin:4px 0 0 20px;">'
            + '<li><strong>Design phase:</strong> Randomization, restriction, matching</li>'
            + '<li><strong>Analysis phase:</strong> Stratification, multivariable regression, propensity scores, IPW</li>'
            + '</ul></div></div>';
        html += '</div>';

        // Random vs Systematic Error
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:8px;">Random Error vs. Systematic Error</div>';
        html += '<div class="form-row form-row--2" style="gap:16px;">';
        html += '<div style="padding:12px;background:var(--bg-tertiary);border-radius:8px;">'
            + '<div style="font-weight:600;margin-bottom:4px;">Random Error</div>'
            + '<div style="font-size:0.9rem;line-height:1.6;">Due to chance. Reduced by increasing sample size. '
            + 'Reflected in confidence intervals and p-values. Cannot be completely eliminated. '
            + 'Affects <strong>precision</strong> (reproducibility of results).</div></div>';
        html += '<div style="padding:12px;background:var(--bg-tertiary);border-radius:8px;">'
            + '<div style="font-weight:600;margin-bottom:4px;">Systematic Error (Bias)</div>'
            + '<div style="font-size:0.9rem;line-height:1.6;">Due to flaws in study design, conduct, or analysis. '
            + 'NOT reduced by increasing sample size (a larger biased study is still biased). '
            + 'Affects <strong>accuracy</strong> (validity, closeness to truth). Must be prevented at the design stage.</div></div>';
        html += '</div></div>';

        // Precision vs Accuracy
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:8px;">Precision vs. Accuracy</div>';
        html += '<div style="font-size:0.9rem;line-height:1.7;">'
            + '<p><strong>Precision</strong> (reliability, reproducibility): How close repeated measurements are to each other. '
            + 'Affected by random error. Increased by larger sample sizes, standardized measurements, repeated measurements.</p>'
            + '<p style="margin-top:8px;"><strong>Accuracy</strong> (validity): How close the measurement is to the true value. '
            + 'Affected by systematic error. Improved by proper study design, validated instruments, blinding, calibration.</p>'
            + '<p style="margin-top:8px;">A study can be <em>precise but inaccurate</em> (narrow CI around a biased estimate), '
            + '<em>accurate but imprecise</em> (wide CI centered on the truth), or ideally <em>both precise and accurate</em>.</p>'
            + '</div></div>';

        // Effect Modification vs Confounding
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:8px;">Effect Modification vs. Confounding</div>';
        html += '<div class="table-container"><table class="data-table">';
        html += '<thead><tr><th>Feature</th><th>Confounding</th><th>Effect Modification (Interaction)</th></tr></thead>';
        html += '<tbody>';
        html += '<tr><td><strong>Definition</strong></td>'
            + '<td>A third variable distorts the association between exposure and outcome</td>'
            + '<td>The effect of exposure on outcome differs across strata of a third variable</td></tr>';
        html += '<tr><td><strong>Is it a bias?</strong></td><td>Yes (a nuisance to remove)</td><td>No (a biologically meaningful finding to report)</td></tr>';
        html += '<tr><td><strong>Assessment</strong></td>'
            + '<td>Compare crude and adjusted estimates; >10% change suggests confounding</td>'
            + '<td>Compare stratum-specific estimates; if they differ meaningfully, effect modification is present</td></tr>';
        html += '<tr><td><strong>What to do</strong></td><td>Control for it (adjust, stratify, match)</td><td>Report stratum-specific estimates; do NOT pool</td></tr>';
        html += '<tr><td><strong>Example</strong></td>'
            + '<td>Age confounds the smoking-stroke association (older people smoke more AND have more strokes)</td>'
            + '<td>Aspirin reduces stroke risk more in men than women (sex modifies the effect)</td></tr>';
        html += '</tbody></table></div></div>';

        // Generalizability and Transportability
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:8px;">Generalizability and Transportability</div>';
        html += '<div style="font-size:0.9rem;line-height:1.7;">'
            + '<p><strong>Generalizability:</strong> Can the results from this study be applied to the source population from which participants were sampled? '
            + 'Requires that the study sample is representative and that effect estimates are not modified by factors that differ between the sample and the source population.</p>'
            + '<p style="margin-top:8px;"><strong>Transportability:</strong> Can the results be transported to a different target population? '
            + 'A more demanding criterion than generalizability. Requires assessing whether effect modifiers differ between the study population and the target population. '
            + 'Formal methods for transportability use inverse odds weighting or standardization (Westreich et al., 2017; Bareinboim & Pearl, 2013).</p>'
            + '<p style="margin-top:8px;"><strong>Key question:</strong> "Would the treatment effect estimated in the trial apply to <em>my</em> patient population?" '
            + 'Consider: age distribution, comorbidities, healthcare context, severity, adherence patterns, and concurrent treatments.</p>'
            + '</div></div>';

        html += '</div>';
        return html;
    }

    // ================================================================
    // REGISTER
    // ================================================================
    App.registerModule(MODULE_ID, { render: render });

    window.EpiConcepts = {
        calcIR: calcIR,
        calcCI: calcCI,
        calcPP: calcPP,
        calcPerP: calcPerP,
        calcAR: calcAR,
        calcCFR: calcCFR,
        calcMR: calcMR,
        calcPMR: calcPMR,
        calcAssociation: calcAssociation,
        copyAssociation: copyAssociation,
        calcImpact: calcImpact,
        calcScreening: calcScreening,
        calcPrevPV: calcPrevPV,
        copyScreening: copyScreening,
        calcNNS: calcNNS
    };
})();
