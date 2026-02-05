/**
 * NeuroEpi Suite — Risk Calculators Module
 * Tabs: Incidence Rate, Rate Ratio, Prevalence, SMR,
 *       Age Standardization, Attributable Risk, Life Years Lost / DALY
 */

(function() {
    'use strict';

    const MODULE_ID = 'risk-calculators';

    // Age-standardization row state
    var ageRows = [];
    var ageRowIdCounter = 0;

    function render(container) {
        var html = App.createModuleLayout(
            'Risk Calculators',
            'Compute epidemiological rates, ratios, and population-level measures with exact confidence intervals. Includes standardization, attributable risk, and DALY calculations.'
        );

        html += '<div class="card">';
        html += '<div class="tabs" id="rc-tabs">'
            + '<button class="tab active" data-tab="incidence" onclick="RiskCalc.switchTab(\'incidence\')">Incidence Rate</button>'
            + '<button class="tab" data-tab="rateratio" onclick="RiskCalc.switchTab(\'rateratio\')">Rate Ratio</button>'
            + '<button class="tab" data-tab="prevalence" onclick="RiskCalc.switchTab(\'prevalence\')">Prevalence</button>'
            + '<button class="tab" data-tab="smr" onclick="RiskCalc.switchTab(\'smr\')">SMR</button>'
            + '<button class="tab" data-tab="agestd" onclick="RiskCalc.switchTab(\'agestd\')">Age Standardization</button>'
            + '<button class="tab" data-tab="ar" onclick="RiskCalc.switchTab(\'ar\')">Attributable Risk</button>'
            + '<button class="tab" data-tab="daly" onclick="RiskCalc.switchTab(\'daly\')">DALY / YLL</button>'
            + '</div>';

        // ===== TAB A: Incidence Rate =====
        html += '<div class="tab-content active" id="tab-incidence">';
        html += '<div class="card-subtitle">Calculate incidence rate (events per person-time) with Poisson exact confidence interval.</div>';

        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Number of Events ' + App.tooltip('Total number of new cases or events observed') + '</label>'
            + '<input type="number" class="form-input" id="rc-ir-events" name="rc_ir_events" step="1" min="0" value="45"></div>'
            + '<div class="form-group"><label class="form-label">Person-Time ' + App.tooltip('Total observation time (e.g., person-years)') + '</label>'
            + '<input type="number" class="form-input" id="rc-ir-pt" name="rc_ir_pt" step="1" min="1" value="10000"></div>'
            + '<div class="form-group"><label class="form-label">Multiplier ' + App.tooltip('Express rate per X (e.g., 100000 for per 100,000)') + '</label>'
            + '<select class="form-select" id="rc-ir-multiplier" name="rc_ir_multiplier">'
            + '<option value="1">Per 1</option>'
            + '<option value="1000">Per 1,000</option>'
            + '<option value="10000">Per 10,000</option>'
            + '<option value="100000" selected>Per 100,000</option>'
            + '</select></div>'
            + '</div>';

        html += '<div class="form-group"><label class="form-label">Confidence Level</label>'
            + '<select class="form-select" id="rc-ir-alpha" name="rc_ir_alpha" style="max-width:200px">'
            + '<option value="0.05" selected>95% CI</option>'
            + '<option value="0.01">99% CI</option>'
            + '<option value="0.10">90% CI</option>'
            + '</select></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="RiskCalc.calcIncidence()">Calculate</button>'
            + '</div>';

        html += '<div id="rc-incidence-results"></div>';
        html += '</div>';

        // ===== TAB B: Rate Ratio =====
        html += '<div class="tab-content" id="tab-rateratio">';
        html += '<div class="card-subtitle">Compare two incidence rates and compute the incidence rate ratio with confidence interval.</div>';

        html += '<div class="card-title">Exposed Group</div>';
        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Events (Exposed)</label>'
            + '<input type="number" class="form-input" id="rc-rr-events1" name="rc_rr_events1" step="1" min="0" value="30"></div>'
            + '<div class="form-group"><label class="form-label">Person-Time (Exposed)</label>'
            + '<input type="number" class="form-input" id="rc-rr-pt1" name="rc_rr_pt1" step="1" min="1" value="5000"></div>'
            + '</div>';

        html += '<div class="card-title mt-1">Unexposed Group</div>';
        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Events (Unexposed)</label>'
            + '<input type="number" class="form-input" id="rc-rr-events2" name="rc_rr_events2" step="1" min="0" value="15"></div>'
            + '<div class="form-group"><label class="form-label">Person-Time (Unexposed)</label>'
            + '<input type="number" class="form-input" id="rc-rr-pt2" name="rc_rr_pt2" step="1" min="1" value="8000"></div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="RiskCalc.calcRateRatio()">Calculate</button>'
            + '</div>';

        html += '<div id="rc-rateratio-results"></div>';
        html += '</div>';

        // ===== TAB C: Prevalence =====
        html += '<div class="tab-content" id="tab-prevalence">';
        html += '<div class="card-subtitle">Calculate prevalence (proportion) with exact Clopper-Pearson confidence interval.</div>';

        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Number of Cases ' + App.tooltip('Number with the condition') + '</label>'
            + '<input type="number" class="form-input" id="rc-prev-x" name="rc_prev_x" step="1" min="0" value="120"></div>'
            + '<div class="form-group"><label class="form-label">Total Population</label>'
            + '<input type="number" class="form-input" id="rc-prev-n" name="rc_prev_n" step="1" min="1" value="5000"></div>'
            + '<div class="form-group"><label class="form-label">Confidence Level</label>'
            + '<select class="form-select" id="rc-prev-alpha" name="rc_prev_alpha">'
            + '<option value="0.05" selected>95% CI</option>'
            + '<option value="0.01">99% CI</option>'
            + '<option value="0.10">90% CI</option>'
            + '</select></div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="RiskCalc.calcPrevalence()">Calculate</button>'
            + '</div>';

        html += '<div id="rc-prevalence-results"></div>';
        html += '</div>';

        // ===== TAB D: SMR =====
        html += '<div class="tab-content" id="tab-smr">';
        html += '<div class="card-subtitle">Standardized Mortality (or Morbidity) Ratio: observed / expected with exact Poisson confidence interval.</div>';

        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Observed Events ' + App.tooltip('Number of events actually observed in the study population') + '</label>'
            + '<input type="number" class="form-input" id="rc-smr-obs" name="rc_smr_obs" step="1" min="0" value="35"></div>'
            + '<div class="form-group"><label class="form-label">Expected Events ' + App.tooltip('Number expected based on reference population rates') + '</label>'
            + '<input type="number" class="form-input" id="rc-smr-exp" name="rc_smr_exp" step="0.1" min="0.1" value="25"></div>'
            + '<div class="form-group"><label class="form-label">Confidence Level</label>'
            + '<select class="form-select" id="rc-smr-alpha" name="rc_smr_alpha">'
            + '<option value="0.05" selected>95% CI</option>'
            + '<option value="0.01">99% CI</option>'
            + '</select></div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="RiskCalc.calcSMR()">Calculate</button>'
            + '</div>';

        html += '<div id="rc-smr-results"></div>';
        html += '</div>';

        // ===== TAB E: Age Standardization =====
        html += '<div class="tab-content" id="tab-agestd">';
        html += '<div class="card-subtitle">Direct age standardization: apply age-specific rates to a standard population to compute an age-adjusted rate.</div>';

        html += '<div class="form-group"><label class="form-label">Standard Population Preset</label>'
            + '<select class="form-select" id="rc-std-pop" name="rc_std_pop" onchange="RiskCalc.loadStdPop()" style="max-width:300px">'
            + '<option value="">-- Select preset or enter manually --</option>';
        Object.keys(References.standardPopulations).forEach(function(key) {
            html += '<option value="' + key + '">' + key + '</option>';
        });
        html += '</select></div>';

        html += '<div class="card-title mt-1">Age-Specific Data</div>';
        html += '<div style="font-size:0.8rem;color:var(--text-tertiary);margin-bottom:8px">Enter events, study population, and standard population weight for each age group.</div>';

        html += '<div id="rc-age-rows"></div>';

        html += '<div class="btn-group mt-1">'
            + '<button class="btn btn-xs btn-secondary" onclick="RiskCalc.addAgeRow()">+ Add Age Group</button>'
            + '<button class="btn btn-xs btn-secondary" onclick="RiskCalc.clearAgeRows()">Clear All</button>'
            + '</div>';

        html += '<div class="form-group mt-2"><label class="form-label">Multiplier</label>'
            + '<select class="form-select" id="rc-agestd-multiplier" name="rc_agestd_multiplier" style="max-width:200px">'
            + '<option value="100000" selected>Per 100,000</option>'
            + '<option value="10000">Per 10,000</option>'
            + '<option value="1000">Per 1,000</option>'
            + '<option value="1">Per 1</option>'
            + '</select></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="RiskCalc.calcAgeStd()">Calculate Standardized Rate</button>'
            + '</div>';

        html += '<div id="rc-agestd-results"></div>';
        html += '</div>';

        // ===== TAB F: Attributable Risk =====
        html += '<div class="tab-content" id="tab-ar">';
        html += '<div class="card-subtitle">Calculate attributable risk measures: absolute risk difference, attributable fraction in the exposed, and population attributable fraction.</div>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Rate in Exposed (R<sub>e</sub>) ' + App.tooltip('Incidence rate or risk in the exposed group') + '</label>'
            + '<input type="number" class="form-input" id="rc-ar-re" name="rc_ar_re" step="0.001" min="0" value="0.06"></div>'
            + '<div class="form-group"><label class="form-label">Rate in Unexposed (R<sub>u</sub>)</label>'
            + '<input type="number" class="form-input" id="rc-ar-ru" name="rc_ar_ru" step="0.001" min="0" value="0.02"></div>'
            + '</div>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Prevalence of Exposure (P<sub>e</sub>) ' + App.tooltip('Proportion of the population that is exposed. Needed for PAF calculation.') + '</label>'
            + '<input type="number" class="form-input" id="rc-ar-pe" name="rc_ar_pe" step="0.01" min="0" max="1" value="0.30"></div>'
            + '<div class="form-group"><label class="form-label">Sample Sizes (optional, for CI)</label>'
            + '<div class="form-row form-row--2">'
            + '<input type="number" class="form-input" id="rc-ar-ne" name="rc_ar_ne" placeholder="N exposed" step="1" min="1" value="1000">'
            + '<input type="number" class="form-input" id="rc-ar-nu" name="rc_ar_nu" placeholder="N unexposed" step="1" min="1" value="2000">'
            + '</div></div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="RiskCalc.calcAR()">Calculate</button>'
            + '</div>';

        html += '<div id="rc-ar-results"></div>';
        html += '</div>';

        // ===== TAB G: DALY / YLL =====
        html += '<div class="tab-content" id="tab-daly">';
        html += '<div class="card-subtitle">Calculate Years of Life Lost (YLL), Years Lived with Disability (YLD), and Disability-Adjusted Life Years (DALY = YLL + YLD).</div>';

        html += '<div class="card-title">Years of Life Lost (YLL)</div>';
        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Number of Deaths ' + App.tooltip('Deaths attributable to the condition') + '</label>'
            + '<input type="number" class="form-input" id="rc-yll-deaths" name="rc_yll_deaths" step="1" min="0" value="150"></div>'
            + '<div class="form-group"><label class="form-label">Average Age at Death (years)</label>'
            + '<input type="number" class="form-input" id="rc-yll-age" name="rc_yll_age" step="0.1" value="72"></div>'
            + '<div class="form-group"><label class="form-label">Life Expectancy at Age of Death ' + App.tooltip('Remaining life expectancy at average age of death. Default uses standard GBD reference (86.6 years at birth).') + '</label>'
            + '<input type="number" class="form-input" id="rc-yll-le" name="rc_yll_le" step="0.1" value="14.6"></div>'
            + '</div>';

        html += '<div class="card-title mt-2">Years Lived with Disability (YLD)</div>';
        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Number of Incident Cases</label>'
            + '<input type="number" class="form-input" id="rc-yld-cases" name="rc_yld_cases" step="1" min="0" value="500"></div>'
            + '<div class="form-group"><label class="form-label">Average Duration of Disability (years) ' + App.tooltip('Average time lived with the condition. For stroke: remaining life with disability.') + '</label>'
            + '<input type="number" class="form-input" id="rc-yld-duration" name="rc_yld_duration" step="0.1" min="0" value="8.5"></div>'
            + '<div class="form-group"><label class="form-label">Disability Weight (0-1) ' + App.tooltip('GBD disability weight. Stroke: mild=0.019, moderate=0.070, severe=0.552, long-term=0.316') + '</label>'
            + '<input type="number" class="form-input" id="rc-yld-dw" name="rc_yld_dw" step="0.001" min="0" max="1" value="0.316"></div>'
            + '</div>';

        html += '<div class="card-subtitle mt-1">Common Stroke Disability Weights (GBD 2019)</div>';
        html += '<div class="preset-group">'
            + '<button class="preset-btn" onclick="RiskCalc.setDW(0.019)">Mild (0.019)</button>'
            + '<button class="preset-btn" onclick="RiskCalc.setDW(0.070)">Moderate (0.070)</button>'
            + '<button class="preset-btn" onclick="RiskCalc.setDW(0.316)">Long-term (0.316)</button>'
            + '<button class="preset-btn" onclick="RiskCalc.setDW(0.552)">Severe (0.552)</button>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="RiskCalc.calcDALY()">Calculate DALY</button>'
            + '</div>';

        html += '<div id="rc-daly-results"></div>';
        html += '</div>';

        html += '</div>'; // end card

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);

        // Initialize age rows with a few defaults
        ageRows = [];
        ageRowIdCounter = 0;
        addDefaultAgeRows();
    }

    function switchTab(tabId) {
        document.querySelectorAll('#rc-tabs .tab').forEach(function(t) { t.classList.toggle('active', t.dataset.tab === tabId); });
        document.querySelectorAll('.tab-content').forEach(function(tc) {
            var tcId = tc.id.replace('tab-', '');
            tc.classList.toggle('active', tcId === tabId);
        });
    }

    // ===== TAB A: Incidence Rate =====
    function calcIncidence() {
        var events = parseInt(document.getElementById('rc-ir-events').value);
        var pt = parseFloat(document.getElementById('rc-ir-pt').value);
        var multiplier = parseInt(document.getElementById('rc-ir-multiplier').value);
        var alpha = parseFloat(document.getElementById('rc-ir-alpha').value);

        if (isNaN(events) || isNaN(pt) || pt <= 0) {
            Export.showToast('Please enter valid numbers', 'error');
            return;
        }

        var result = Statistics.incidenceRate(events, pt, alpha);
        var rate = result.rate * multiplier;
        var ciLower = result.ci.lower * multiplier;
        var ciUpper = result.ci.upper * multiplier;

        var perLabel = 'per ' + multiplier.toLocaleString();

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + rate.toFixed(2) + ' ' + perLabel + '</div>';
        html += '<div class="result-label">Incidence Rate</div>';
        html += '<div class="result-detail">' + ((1 - alpha) * 100).toFixed(0) + '% CI: (' + ciLower.toFixed(2) + ', ' + ciUpper.toFixed(2) + ') ' + perLabel + '</div>';

        html += '<div class="result-grid mt-2">'
            + '<div class="result-item"><div class="result-item-value">' + events + '</div><div class="result-item-label">Events</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + pt.toLocaleString() + '</div><div class="result-item-label">Person-Time</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + result.rate.toExponential(3) + '</div><div class="result-item-label">Raw Rate</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + ciLower.toFixed(2) + '</div><div class="result-item-label">Lower CI</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + ciUpper.toFixed(2) + '</div><div class="result-item-label">Upper CI</div></div>'
            + '<div class="result-item"><div class="result-item-value">Poisson Exact</div><div class="result-item-label">CI Method</div></div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.copyText(\'Incidence rate: ' + rate.toFixed(2) + ' ' + perLabel + ' (' + ((1 - alpha) * 100).toFixed(0) + '% CI: ' + ciLower.toFixed(2) + ' to ' + ciUpper.toFixed(2) + ')\')">Copy Result</button>'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('rc-incidence-results'), html);
        Export.addToHistory(MODULE_ID, { events: events, pt: pt }, 'IR: ' + rate.toFixed(2) + ' ' + perLabel);
    }

    // ===== TAB B: Rate Ratio =====
    function calcRateRatio() {
        var events1 = parseInt(document.getElementById('rc-rr-events1').value);
        var pt1 = parseFloat(document.getElementById('rc-rr-pt1').value);
        var events2 = parseInt(document.getElementById('rc-rr-events2').value);
        var pt2 = parseFloat(document.getElementById('rc-rr-pt2').value);

        if (isNaN(events1) || isNaN(pt1) || isNaN(events2) || isNaN(pt2) || pt1 <= 0 || pt2 <= 0 || events2 === 0) {
            Export.showToast('Please enter valid numbers. Unexposed events must be > 0.', 'error');
            return;
        }

        var result = Statistics.rateRatio(events1, pt1, events2, pt2);

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + result.ratio.toFixed(3) + '</div>';
        html += '<div class="result-label">Incidence Rate Ratio (IRR)</div>';
        html += '<div class="result-detail">95% CI: (' + result.ci.lower.toFixed(3) + ', ' + result.ci.upper.toFixed(3) + ')</div>';

        var significant = result.ci.lower > 1 || result.ci.upper < 1;
        html += '<div class="result-detail mt-1" style="color:' + (significant ? 'var(--accent)' : 'var(--text-tertiary)') + '">'
            + (result.ratio > 1
                ? 'The exposed group has a ' + ((result.ratio - 1) * 100).toFixed(1) + '% higher rate than the unexposed group.'
                : 'The exposed group has a ' + ((1 - result.ratio) * 100).toFixed(1) + '% lower rate than the unexposed group.')
            + (significant ? '' : ' (Not statistically significant at the 5% level.)')
            + '</div>';

        html += '<div class="result-grid mt-2">'
            + '<div class="result-item"><div class="result-item-value">' + (events1 / pt1 * 100000).toFixed(1) + '</div><div class="result-item-label">Rate (Exposed) per 100K</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + (events2 / pt2 * 100000).toFixed(1) + '</div><div class="result-item-label">Rate (Unexposed) per 100K</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + result.ratio.toFixed(3) + '</div><div class="result-item-label">IRR</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + Math.log(result.ratio).toFixed(4) + '</div><div class="result-item-label">ln(IRR)</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + Math.sqrt(1 / events1 + 1 / events2).toFixed(4) + '</div><div class="result-item-label">SE of ln(IRR)</div></div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.copyText(\'IRR: ' + result.ratio.toFixed(3) + ' (95% CI: ' + result.ci.lower.toFixed(3) + ' to ' + result.ci.upper.toFixed(3) + ')\')">Copy Result</button>'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('rc-rateratio-results'), html);
        Export.addToHistory(MODULE_ID, { events1: events1, pt1: pt1, events2: events2, pt2: pt2 }, 'IRR: ' + result.ratio.toFixed(3));
    }

    // ===== TAB C: Prevalence =====
    function calcPrevalence() {
        var x = parseInt(document.getElementById('rc-prev-x').value);
        var n = parseInt(document.getElementById('rc-prev-n').value);
        var alpha = parseFloat(document.getElementById('rc-prev-alpha').value);

        if (isNaN(x) || isNaN(n) || n <= 0 || x < 0 || x > n) {
            Export.showToast('Cases must be between 0 and total population', 'error');
            return;
        }

        var p = x / n;
        var cpCI = Statistics.clopperPearsonCI(x, n, alpha);
        var waldResult = Statistics.waldCI(p, n, Statistics.normalQuantile(1 - alpha / 2));
        var wilsonResult = Statistics.wilsonCI(p, n, Statistics.normalQuantile(1 - alpha / 2));

        var confLevel = ((1 - alpha) * 100).toFixed(0);

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + (p * 100).toFixed(2) + '%</div>';
        html += '<div class="result-label">Prevalence</div>';
        html += '<div class="result-detail">' + confLevel + '% Clopper-Pearson Exact CI: (' + (cpCI.lower * 100).toFixed(2) + '%, ' + (cpCI.upper * 100).toFixed(2) + '%)</div>';

        html += '<div class="result-grid mt-2">'
            + '<div class="result-item"><div class="result-item-value">' + x + ' / ' + n + '</div><div class="result-item-label">Cases / Total</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + (p * 100).toFixed(2) + '%</div><div class="result-item-label">Point Estimate</div></div>'
            + '</div>';

        // Compare CI methods
        html += '<div class="card-title mt-2">Confidence Interval Methods</div>';
        html += '<table class="data-table"><thead><tr><th>Method</th><th>Lower</th><th>Upper</th><th>Width</th></tr></thead><tbody>';
        html += '<tr style="background:var(--accent-muted)"><td>Clopper-Pearson (Exact)</td><td class="num">' + (cpCI.lower * 100).toFixed(3) + '%</td><td class="num">' + (cpCI.upper * 100).toFixed(3) + '%</td><td class="num">' + ((cpCI.upper - cpCI.lower) * 100).toFixed(3) + '%</td></tr>';
        html += '<tr><td>Wald</td><td class="num">' + (waldResult.lower * 100).toFixed(3) + '%</td><td class="num">' + (waldResult.upper * 100).toFixed(3) + '%</td><td class="num">' + ((waldResult.upper - waldResult.lower) * 100).toFixed(3) + '%</td></tr>';
        html += '<tr><td>Wilson Score</td><td class="num">' + (wilsonResult.lower * 100).toFixed(3) + '%</td><td class="num">' + (wilsonResult.upper * 100).toFixed(3) + '%</td><td class="num">' + ((wilsonResult.upper - wilsonResult.lower) * 100).toFixed(3) + '%</td></tr>';
        html += '</tbody></table>';

        html += '<div style="font-size:0.8rem;color:var(--text-tertiary);margin-top:4px">Clopper-Pearson exact CI is recommended, especially for small samples and extreme proportions. Wilson score is preferred by some for moderate samples.</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.copyText(\'Prevalence: ' + (p * 100).toFixed(2) + '% (' + confLevel + '% CI: ' + (cpCI.lower * 100).toFixed(2) + '% to ' + (cpCI.upper * 100).toFixed(2) + '%; Clopper-Pearson exact)\')">Copy Result</button>'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('rc-prevalence-results'), html);
        Export.addToHistory(MODULE_ID, { x: x, n: n }, 'Prevalence: ' + (p * 100).toFixed(2) + '%');
    }

    // ===== TAB D: SMR =====
    function calcSMR() {
        var observed = parseInt(document.getElementById('rc-smr-obs').value);
        var expected = parseFloat(document.getElementById('rc-smr-exp').value);
        var alpha = parseFloat(document.getElementById('rc-smr-alpha').value);

        if (isNaN(observed) || isNaN(expected) || expected <= 0 || observed < 0) {
            Export.showToast('Please enter valid numbers', 'error');
            return;
        }

        var result = Statistics.smr(observed, expected, alpha);
        var confLevel = ((1 - alpha) * 100).toFixed(0);

        var color = result.smr > 1.0 ? 'var(--danger)' : result.smr < 1.0 ? 'var(--success)' : 'var(--text)';
        var significant = result.ci.lower > 1 || result.ci.upper < 1;

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value" style="color:' + color + '">' + result.smr.toFixed(3) + '</div>';
        html += '<div class="result-label">Standardized Mortality Ratio</div>';
        html += '<div class="result-detail">' + confLevel + '% CI: (' + result.ci.lower.toFixed(3) + ', ' + result.ci.upper.toFixed(3) + ')</div>';

        html += '<div class="result-detail mt-1">'
            + (result.smr > 1
                ? 'There were ' + ((result.smr - 1) * 100).toFixed(1) + '% more events than expected based on the reference population.'
                : result.smr < 1
                ? 'There were ' + ((1 - result.smr) * 100).toFixed(1) + '% fewer events than expected based on the reference population.'
                : 'Observed equals expected.')
            + (significant ? ' This is statistically significant.' : ' This is not statistically significant at the ' + (alpha * 100).toFixed(0) + '% level.')
            + '</div>';

        html += '<div class="result-grid mt-2">'
            + '<div class="result-item"><div class="result-item-value">' + observed + '</div><div class="result-item-label">Observed</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + expected.toFixed(1) + '</div><div class="result-item-label">Expected</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + result.smr.toFixed(3) + '</div><div class="result-item-label">SMR</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + (observed - expected).toFixed(1) + '</div><div class="result-item-label">Excess Events</div></div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.copyText(\'SMR: ' + result.smr.toFixed(3) + ' (' + confLevel + '% CI: ' + result.ci.lower.toFixed(3) + ' to ' + result.ci.upper.toFixed(3) + '); Observed=' + observed + ', Expected=' + expected.toFixed(1) + '\')">Copy Result</button>'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('rc-smr-results'), html);
        Export.addToHistory(MODULE_ID, { observed: observed, expected: expected }, 'SMR: ' + result.smr.toFixed(3));
    }

    // ===== TAB E: Age Standardization =====
    function addDefaultAgeRows() {
        var defaultGroups = [
            { ageGroup: '0-44', events: 5, population: 50000, weight: 59490 },
            { ageGroup: '45-54', events: 20, population: 15000, weight: 13458 },
            { ageGroup: '55-64', events: 45, population: 12000, weight: 8723 },
            { ageGroup: '65-74', events: 80, population: 8000, weight: 6601 },
            { ageGroup: '75-84', events: 110, population: 5000, weight: 4445 },
            { ageGroup: '85+', events: 60, population: 2000, weight: 1688 }
        ];
        defaultGroups.forEach(function(g) {
            ageRowIdCounter++;
            ageRows.push({ id: ageRowIdCounter, ageGroup: g.ageGroup, events: g.events, population: g.population, weight: g.weight });
        });
        renderAgeRows();
    }

    function addAgeRow() {
        ageRowIdCounter++;
        ageRows.push({ id: ageRowIdCounter, ageGroup: '', events: 0, population: 0, weight: 0 });
        renderAgeRows();
    }

    function removeAgeRow(id) {
        ageRows = ageRows.filter(function(r) { return r.id !== id; });
        renderAgeRows();
    }

    function clearAgeRows() {
        ageRows = [];
        ageRowIdCounter = 0;
        renderAgeRows();
    }

    function renderAgeRows() {
        var el = document.getElementById('rc-age-rows');
        if (!el) return;

        if (ageRows.length === 0) {
            App.setTrustedHTML(el, '<div style="color:var(--text-tertiary);font-size:0.85rem;padding:8px">No age groups. Add rows or load a preset.</div>');
            return;
        }

        var html = '<table class="data-table"><thead><tr>'
            + '<th>Age Group</th><th>Events</th><th>Study Population</th><th>Standard Pop Weight</th><th>Crude Rate</th><th></th>'
            + '</tr></thead><tbody>';

        ageRows.forEach(function(row) {
            var crudeRate = row.population > 0 ? (row.events / row.population * 100000).toFixed(1) : '--';
            html += '<tr>'
                + '<td><input type="text" class="form-input form-input--small" value="' + row.ageGroup + '" onchange="RiskCalc.updateAgeRow(' + row.id + ', \'ageGroup\', this.value)" style="width:80px"></td>'
                + '<td><input type="number" class="form-input form-input--small" value="' + row.events + '" onchange="RiskCalc.updateAgeRow(' + row.id + ', \'events\', this.value)" style="width:80px"></td>'
                + '<td><input type="number" class="form-input form-input--small" value="' + row.population + '" onchange="RiskCalc.updateAgeRow(' + row.id + ', \'population\', this.value)" style="width:100px"></td>'
                + '<td><input type="number" class="form-input form-input--small" value="' + row.weight + '" onchange="RiskCalc.updateAgeRow(' + row.id + ', \'weight\', this.value)" style="width:100px"></td>'
                + '<td class="num">' + crudeRate + '</td>'
                + '<td><button class="btn btn-xs btn-secondary" onclick="RiskCalc.removeAgeRow(' + row.id + ')">X</button></td>'
                + '</tr>';
        });

        html += '</tbody></table>';
        App.setTrustedHTML(el, html);
    }

    function updateAgeRow(id, field, value) {
        var row = ageRows.find(function(r) { return r.id === id; });
        if (!row) return;
        if (field === 'ageGroup') {
            row.ageGroup = value;
        } else {
            row[field] = parseFloat(value) || 0;
        }
        renderAgeRows();
    }

    function loadStdPop() {
        var key = document.getElementById('rc-std-pop').value;
        if (!key) return;

        var stdPop = References.standardPopulations[key];
        if (!stdPop) return;

        // Replace age rows with preset
        ageRows = [];
        ageRowIdCounter = 0;
        stdPop.forEach(function(ag) {
            ageRowIdCounter++;
            ageRows.push({ id: ageRowIdCounter, ageGroup: ag.ageGroup, events: 0, population: 0, weight: ag.weight });
        });
        renderAgeRows();
        Export.showToast('Loaded ' + key + ' standard population weights');
    }

    function calcAgeStd() {
        if (ageRows.length === 0) {
            Export.showToast('Add age groups first', 'error');
            return;
        }

        var multiplier = parseInt(document.getElementById('rc-agestd-multiplier').value);

        // Check for valid data
        var validRows = ageRows.filter(function(r) { return r.population > 0 && r.weight > 0; });
        if (validRows.length === 0) {
            Export.showToast('Please enter population and weight for at least one age group', 'error');
            return;
        }

        // Prepare data for Statistics.directStandardization
        var ageRates = validRows.map(function(r) {
            return { events: r.events, population: r.population, standardPop: r.weight };
        });

        var result = Statistics.directStandardization(ageRates);

        var adjustedRate = result.rate * multiplier;
        var adjustedSE = result.se * multiplier;
        var adjustedCILower = result.ci.lower * multiplier;
        var adjustedCIUpper = result.ci.upper * multiplier;

        // Crude rate
        var totalEvents = validRows.reduce(function(s, r) { return s + r.events; }, 0);
        var totalPop = validRows.reduce(function(s, r) { return s + r.population; }, 0);
        var crudeRate = (totalEvents / totalPop) * multiplier;

        var perLabel = 'per ' + multiplier.toLocaleString();

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + adjustedRate.toFixed(2) + ' ' + perLabel + '</div>';
        html += '<div class="result-label">Age-Standardized Rate (Direct Method)</div>';
        html += '<div class="result-detail">95% CI: (' + adjustedCILower.toFixed(2) + ', ' + adjustedCIUpper.toFixed(2) + ') ' + perLabel + '</div>';

        html += '<div class="result-grid mt-2">'
            + '<div class="result-item"><div class="result-item-value">' + crudeRate.toFixed(2) + '</div><div class="result-item-label">Crude Rate ' + perLabel + '</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + adjustedRate.toFixed(2) + '</div><div class="result-item-label">Standardized Rate</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + totalEvents + '</div><div class="result-item-label">Total Events</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + totalPop.toLocaleString() + '</div><div class="result-item-label">Total Population</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + validRows.length + '</div><div class="result-item-label">Age Strata</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + adjustedSE.toFixed(3) + '</div><div class="result-item-label">SE ' + perLabel + '</div></div>'
            + '</div>';

        // Detail table
        html += '<div class="card-title mt-2">Age-Specific Rates</div>';
        html += '<table class="data-table"><thead><tr><th>Age Group</th><th>Events</th><th>Population</th><th>Crude Rate</th><th>Weight</th><th>Weighted Rate</th></tr></thead><tbody>';
        var totalWeight = validRows.reduce(function(s, r) { return s + r.weight; }, 0);
        validRows.forEach(function(r) {
            var cr = r.events / r.population * multiplier;
            var wr = (r.events / r.population) * r.weight;
            html += '<tr>'
                + '<td>' + r.ageGroup + '</td>'
                + '<td class="num">' + r.events + '</td>'
                + '<td class="num">' + r.population.toLocaleString() + '</td>'
                + '<td class="num">' + cr.toFixed(1) + '</td>'
                + '<td class="num">' + r.weight + '</td>'
                + '<td class="num">' + (wr / totalWeight * multiplier).toFixed(2) + '</td>'
                + '</tr>';
        });
        html += '</tbody></table>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.copyText(\'Age-standardized rate: ' + adjustedRate.toFixed(2) + ' ' + perLabel + ' (95% CI: ' + adjustedCILower.toFixed(2) + ' to ' + adjustedCIUpper.toFixed(2) + '). Crude rate: ' + crudeRate.toFixed(2) + ' ' + perLabel + '.\')">Copy Result</button>'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('rc-agestd-results'), html);
        Export.addToHistory(MODULE_ID, { ageGroups: validRows.length, totalEvents: totalEvents }, 'Age-std rate: ' + adjustedRate.toFixed(2) + ' ' + perLabel);
    }

    // ===== TAB F: Attributable Risk =====
    function calcAR() {
        var re = parseFloat(document.getElementById('rc-ar-re').value);
        var ru = parseFloat(document.getElementById('rc-ar-ru').value);
        var pe = parseFloat(document.getElementById('rc-ar-pe').value);
        var ne = parseInt(document.getElementById('rc-ar-ne').value) || null;
        var nu = parseInt(document.getElementById('rc-ar-nu').value) || null;

        if (isNaN(re) || isNaN(ru) || isNaN(pe) || re < 0 || ru < 0) {
            Export.showToast('Please enter valid rates', 'error');
            return;
        }

        // Attributable Risk (AR) = Risk difference
        var ar = re - ru;

        // Relative Risk
        var rr = ru > 0 ? re / ru : Infinity;

        // Attributable Fraction in Exposed (AFe)
        var afe = rr > 0 ? (rr - 1) / rr : 0;

        // Population Attributable Fraction (PAF) using Levin's formula
        var paf = (pe * (rr - 1)) / (1 + pe * (rr - 1));

        // Population Attributable Risk (PAR)
        var totalRate = pe * re + (1 - pe) * ru;
        var par = totalRate - ru;

        // CIs for AR if sample sizes available
        var arCILower = null, arCIUpper = null;
        if (ne && nu && ne > 0 && nu > 0) {
            var seAR = Math.sqrt(re * (1 - re) / ne + ru * (1 - ru) / nu);
            var z = Statistics.normalQuantile(0.975);
            arCILower = ar - z * seAR;
            arCIUpper = ar + z * seAR;
        }

        var html = '<div class="result-panel animate-in">';
        html += '<div class="card-title">Attributable Risk Measures</div>';

        html += '<div class="result-grid mt-1">'
            + '<div class="result-item"><div class="result-item-value">' + (ar * 100).toFixed(2) + '%</div><div class="result-item-label">Attributable Risk (AR)</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + rr.toFixed(3) + '</div><div class="result-item-label">Relative Risk (RR)</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + (afe * 100).toFixed(1) + '%</div><div class="result-item-label">AF<sub>exposed</sub></div></div>'
            + '<div class="result-item"><div class="result-item-value">' + (paf * 100).toFixed(1) + '%</div><div class="result-item-label">PAF</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + (par * 100).toFixed(3) + '%</div><div class="result-item-label">Population AR</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + (ar !== 0 ? Math.round(1 / Math.abs(ar)) : '--') + '</div><div class="result-item-label">' + (ar > 0 ? 'NNH' : 'NNT') + '</div></div>'
            + '</div>';

        if (arCILower !== null) {
            html += '<div class="result-detail mt-1">AR 95% CI: (' + (arCILower * 100).toFixed(2) + '%, ' + (arCIUpper * 100).toFixed(2) + '%)</div>';
        }

        // Interpretation
        html += '<div class="card-title mt-2">Interpretation</div>';
        html += '<table class="data-table"><thead><tr><th>Measure</th><th>Value</th><th>Interpretation</th></tr></thead><tbody>';
        html += '<tr><td>AR</td><td class="num">' + (ar * 100).toFixed(2) + '%</td>'
            + '<td>The excess risk in the exposed group attributable to the exposure is ' + (Math.abs(ar) * 100).toFixed(2) + ' per 100 persons.</td></tr>';
        html += '<tr><td>AF<sub>e</sub></td><td class="num">' + (afe * 100).toFixed(1) + '%</td>'
            + '<td>' + (afe * 100).toFixed(1) + '% of cases among the exposed can be attributed to the exposure.</td></tr>';
        html += '<tr><td>PAF</td><td class="num">' + (paf * 100).toFixed(1) + '%</td>'
            + '<td>' + (paf * 100).toFixed(1) + '% of all cases in the population could theoretically be prevented by eliminating the exposure.</td></tr>';
        html += '<tr><td>PAR</td><td class="num">' + (par * 100).toFixed(3) + '%</td>'
            + '<td>The absolute excess rate in the population attributable to the exposure.</td></tr>';
        html += '</tbody></table>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.copyText(\'Attributable Risk: ' + (ar * 100).toFixed(2) + '%; RR=' + rr.toFixed(3) + '; AF(exposed)=' + (afe * 100).toFixed(1) + '%; PAF=' + (paf * 100).toFixed(1) + '%\')">Copy Result</button>'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('rc-ar-results'), html);
        Export.addToHistory(MODULE_ID, { re: re, ru: ru, pe: pe }, 'PAF: ' + (paf * 100).toFixed(1) + '%');
    }

    // ===== TAB G: DALY / YLL =====
    function setDW(value) {
        var el = document.getElementById('rc-yld-dw');
        if (el) el.value = value;
    }

    function calcDALY() {
        var deaths = parseInt(document.getElementById('rc-yll-deaths').value);
        var ageAtDeath = parseFloat(document.getElementById('rc-yll-age').value);
        var lifeExpectancy = parseFloat(document.getElementById('rc-yll-le').value);

        var cases = parseInt(document.getElementById('rc-yld-cases').value);
        var duration = parseFloat(document.getElementById('rc-yld-duration').value);
        var dw = parseFloat(document.getElementById('rc-yld-dw').value);

        if (isNaN(deaths) || isNaN(lifeExpectancy) || isNaN(cases) || isNaN(duration) || isNaN(dw)) {
            Export.showToast('Please enter valid numbers', 'error');
            return;
        }

        // YLL = Number of deaths x Remaining life expectancy at age of death
        var yll = deaths * lifeExpectancy;

        // YLD = Number of cases x Duration x Disability weight
        var yld = cases * duration * dw;

        // DALY = YLL + YLD
        var daly = yll + yld;

        // Per-death and per-case metrics
        var yllPerDeath = deaths > 0 ? lifeExpectancy : 0;
        var yldPerCase = cases > 0 ? duration * dw : 0;
        var dalyPerCase = cases > 0 ? daly / cases : 0;

        // Proportion
        var yllPct = daly > 0 ? (yll / daly * 100) : 0;
        var yldPct = daly > 0 ? (yld / daly * 100) : 0;

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + daly.toFixed(1) + ' DALYs</div>';
        html += '<div class="result-label">Disability-Adjusted Life Years</div>';

        html += '<div class="result-grid mt-2">'
            + '<div class="result-item"><div class="result-item-value" style="color:var(--danger)">' + yll.toFixed(1) + '</div><div class="result-item-label">YLL (Years of Life Lost)</div></div>'
            + '<div class="result-item"><div class="result-item-value" style="color:var(--warning)">' + yld.toFixed(1) + '</div><div class="result-item-label">YLD (Years Lived with Disability)</div></div>'
            + '<div class="result-item"><div class="result-item-value" style="color:var(--accent)">' + daly.toFixed(1) + '</div><div class="result-item-label">DALY (YLL + YLD)</div></div>'
            + '</div>';

        // Detail table
        html += '<div class="card-title mt-2">Calculation Details</div>';
        html += '<table class="data-table"><thead><tr><th>Component</th><th>Formula</th><th>Value</th><th>% of DALY</th></tr></thead><tbody>';
        html += '<tr><td>YLL</td><td class="num">' + deaths + ' deaths x ' + lifeExpectancy.toFixed(1) + ' years</td><td class="num" style="color:var(--danger)">' + yll.toFixed(1) + '</td><td class="num">' + yllPct.toFixed(1) + '%</td></tr>';
        html += '<tr><td>YLD</td><td class="num">' + cases + ' cases x ' + duration.toFixed(1) + ' years x ' + dw.toFixed(3) + '</td><td class="num" style="color:var(--warning)">' + yld.toFixed(1) + '</td><td class="num">' + yldPct.toFixed(1) + '%</td></tr>';
        html += '<tr style="font-weight:bold"><td>DALY</td><td class="num">YLL + YLD</td><td class="num" style="color:var(--accent)">' + daly.toFixed(1) + '</td><td class="num">100%</td></tr>';
        html += '</tbody></table>';

        // Per-case metrics
        html += '<div class="result-grid mt-2">'
            + '<div class="result-item"><div class="result-item-value">' + yllPerDeath.toFixed(1) + '</div><div class="result-item-label">YLL per Death</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + yldPerCase.toFixed(2) + '</div><div class="result-item-label">YLD per Case</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + dalyPerCase.toFixed(2) + '</div><div class="result-item-label">DALY per Case</div></div>'
            + '</div>';

        // Stroke context
        html += '<div class="card-title mt-2">Stroke Burden Context</div>';
        html += '<div style="padding:12px;background:var(--surface);border-radius:8px;color:var(--text-secondary);font-size:0.85rem;line-height:1.6">'
            + '<ul style="margin:0;padding-left:16px">'
            + '<li>Stroke is the 2nd leading cause of death and 3rd leading cause of disability worldwide (GBD 2019).</li>'
            + '<li>Global stroke DALYs: ~116 million in 2019, with ischemic stroke contributing ~63%.</li>'
            + '<li>YLL typically dominates in low-income settings; YLD contributes more in high-income countries due to better acute survival.</li>'
            + '<li>In this calculation, YLL accounts for <strong>' + yllPct.toFixed(0) + '%</strong> of total DALYs.</li>'
            + '</ul></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.copyText(\'DALY: ' + daly.toFixed(1) + ' (YLL=' + yll.toFixed(1) + ', YLD=' + yld.toFixed(1) + '). Deaths=' + deaths + ', Cases=' + cases + ', DW=' + dw.toFixed(3) + '.\')">Copy Result</button>'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('rc-daly-results'), html);
        Export.addToHistory(MODULE_ID, { deaths: deaths, cases: cases, dw: dw }, 'DALY: ' + daly.toFixed(1));
    }

    // Register module
    App.registerModule(MODULE_ID, { render: render });

    // Expose functions globally for onclick handlers
    window.RiskCalc = {
        switchTab: switchTab,
        calcIncidence: calcIncidence,
        calcRateRatio: calcRateRatio,
        calcPrevalence: calcPrevalence,
        calcSMR: calcSMR,
        addAgeRow: addAgeRow,
        removeAgeRow: removeAgeRow,
        clearAgeRows: clearAgeRows,
        updateAgeRow: updateAgeRow,
        loadStdPop: loadStdPop,
        calcAgeStd: calcAgeStd,
        calcAR: calcAR,
        setDW: setDW,
        calcDALY: calcDALY
    };
})();
