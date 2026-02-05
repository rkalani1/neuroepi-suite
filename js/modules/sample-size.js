/**
 * Neuro-Epi — Sample Size Calculator Module
 * Tabs: Two Proportions, Two Means, Time-to-Event, mRS Ordinal Shift,
 *       Non-Inferiority, Cluster RCT, Stepped-Wedge, Multi-Arm
 */

(function() {
    'use strict';

    const MODULE_ID = 'sample-size';

    function render(container) {
        var html = App.createModuleLayout(
            'Sample Size Calculator',
            'Calculate required sample sizes for clinical trials and observational studies. Includes presets for common clinical scenarios and publication-ready methods text.'
        );

        html += '<div class="card">';
        html += '<div class="tabs" id="ss-tabs">'
            + '<button class="tab active" data-tab="proportions" onclick="SampleSizeModule.switchTab(\'proportions\')">Two Proportions</button>'
            + '<button class="tab" data-tab="means" onclick="SampleSizeModule.switchTab(\'means\')">Two Means</button>'
            + '<button class="tab" data-tab="survival" onclick="SampleSizeModule.switchTab(\'survival\')">Time-to-Event</button>'
            + '<button class="tab" data-tab="ordinal" onclick="SampleSizeModule.switchTab(\'ordinal\')">mRS Ordinal Shift</button>'
            + '<button class="tab" data-tab="noninf" onclick="SampleSizeModule.switchTab(\'noninf\')">Non-Inferiority</button>'
            + '<button class="tab" data-tab="cluster" onclick="SampleSizeModule.switchTab(\'cluster\')">Cluster RCT</button>'
            + '<button class="tab" data-tab="stepped" onclick="SampleSizeModule.switchTab(\'stepped\')">Stepped-Wedge</button>'
            + '<button class="tab" data-tab="multiarm" onclick="SampleSizeModule.switchTab(\'multiarm\')">Multi-Arm</button>'
            + '</div>';

        // ===== TAB A: Two Proportions =====
        html += '<div class="tab-content active" id="tab-proportions">';
        html += '<div class="card-subtitle">Most commonly used design in clinical trials. Compare event rates between two groups.</div>';

        html += '<div class="form-label">Presets ' + App.tooltip('Load common clinical trial scenarios with typical event rates') + '</div>';
        html += '<div class="preset-group">'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadPreset(\'lvo\')">Stroke: LVO mRS 0-2 (28% vs 46%)</button>'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadPreset(\'mortality\')">Mortality Trial (20% vs 14%)</button>'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadPreset(\'sich\')">AE Rate (6% vs 3%)</button>'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadPreset(\'recurrent\')">Event Prevention (5% vs 3.5%)</button>'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadPreset(\'ich\')">Moderate Effect (38% vs 30%)</button>'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadPreset(\'cardio\')">CV Events (12% vs 8%)</button>'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadPreset(\'onc\')">Oncology Response (30% vs 45%)</button>'
            + '</div>';

        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Control Event Rate (p\u2081) ' + App.tooltip('Expected proportion with outcome in control group') + '</label>'
            + '<input type="number" class="form-input" name="ss_p1" id="ss_p1" step="0.01" min="0" max="1" value="0.28" onchange="SampleSizeModule.syncRates(\'p1\')"></div>'
            + '<div class="form-group"><label class="form-label">Treatment Event Rate (p\u2082)</label>'
            + '<input type="number" class="form-input" name="ss_p2" id="ss_p2" step="0.01" min="0" max="1" value="0.20" onchange="SampleSizeModule.syncRates(\'p2\')"></div>'
            + '<div class="form-group"><label class="form-label">Absolute Risk Reduction</label>'
            + '<input type="number" class="form-input" name="ss_arr" id="ss_arr" step="0.01" value="0.08" onchange="SampleSizeModule.syncRates(\'arr\')"></div>'
            + '</div>';

        html += '<div class="form-row form-row--4">'
            + '<div class="form-group"><label class="form-label">Significance Level (\u03B1)</label>'
            + '<select class="form-select" name="ss_alpha" id="ss_alpha"><option value="0.05" selected>0.05 (two-sided)</option><option value="0.01">0.01</option><option value="0.10">0.10</option></select></div>'
            + '<div class="form-group"><label class="form-label">Power (1-\u03B2)</label>'
            + '<select class="form-select" name="ss_power" id="ss_power"><option value="0.80" selected>80%</option><option value="0.85">85%</option><option value="0.90">90%</option><option value="0.95">95%</option></select></div>'
            + '<div class="form-group"><label class="form-label">Allocation Ratio ' + App.tooltip('Ratio of treatment to control (1 = equal)') + '</label>'
            + '<input type="number" class="form-input" name="ss_ratio" id="ss_ratio" step="0.5" min="0.5" max="4" value="1"></div>'
            + '<div class="form-group"><label class="form-label">Dropout Rate (%)</label>'
            + '<input type="number" class="form-input" name="ss_dropout" id="ss_dropout" step="1" min="0" max="50" value="10"></div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="SampleSizeModule.calculateProportions()">Calculate Sample Size</button>'
            + '</div>';

        html += '<div id="ss-proportions-results"></div>';
        html += '</div>';

        // ===== TAB B: Two Means =====
        html += '<div class="tab-content" id="tab-means">';
        html += '<div class="card-subtitle">Compare continuous outcomes between two groups (e.g., NIHSS change, blood pressure).</div>';
        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Mean Difference (\u03B4)</label>'
            + '<input type="number" class="form-input" name="ss_delta" id="ss_delta" step="0.1" value="4"></div>'
            + '<div class="form-group"><label class="form-label">SD (Group 1)</label>'
            + '<input type="number" class="form-input" name="ss_sd1" id="ss_sd1" step="0.1" min="0.1" value="8"></div>'
            + '<div class="form-group"><label class="form-label">SD (Group 2)</label>'
            + '<input type="number" class="form-input" name="ss_sd2" id="ss_sd2" step="0.1" min="0.1" value="8"></div>'
            + '</div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="SampleSizeModule.calculateMeans()">Calculate</button></div>';
        html += '<div id="ss-means-results"></div>';
        html += '</div>';

        // ===== TAB C: Time-to-Event =====
        html += '<div class="tab-content" id="tab-survival">';
        html += '<div class="card-subtitle">For trials with time-to-event primary outcomes (e.g., survival, time to event).</div>';
        html += '<div class="form-row form-row--4">'
            + '<div class="form-group"><label class="form-label">Hazard Ratio ' + App.tooltip('Expected HR. <1 favors treatment.') + '</label>'
            + '<input type="number" class="form-input" name="ss_hr" id="ss_hr" step="0.05" min="0.1" value="0.70"></div>'
            + '<div class="form-group"><label class="form-label">Median Survival (Control, months)</label>'
            + '<input type="number" class="form-input" name="ss_medsurv" id="ss_medsurv" step="1" value="24"></div>'
            + '<div class="form-group"><label class="form-label">Accrual Period (months)</label>'
            + '<input type="number" class="form-input" name="ss_accrual" id="ss_accrual" step="1" value="24"></div>'
            + '<div class="form-group"><label class="form-label">Follow-up (months)</label>'
            + '<input type="number" class="form-input" name="ss_followup" id="ss_followup" step="1" value="12"></div>'
            + '</div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="SampleSizeModule.calculateSurvival()">Calculate</button></div>';
        html += '<div id="ss-survival-results"></div>';
        html += '</div>';

        // ===== TAB D: mRS Ordinal Shift =====
        html += '<div class="tab-content" id="tab-ordinal">';
        html += '<div class="card-subtitle">Ordinal shift analysis using proportional odds model (Whitehead formula). Common for mRS in stroke trials and other ordinal outcomes.</div>';

        html += '<div class="form-label">Load Distribution Preset</div>';
        html += '<div class="preset-group">';
        Object.keys(References.mrsDistributions).forEach(function(key) {
            var d = References.mrsDistributions[key];
            if (key.indexOf('Control') > -1) {
                html += '<button class="preset-btn" onclick="SampleSizeModule.loadMRSPreset(\'' + key + '\')">' + d.trial + ' Control</button>';
            }
        });
        html += '</div>';

        html += '<div class="form-label mt-2">Control Group mRS Distribution (must sum to 1.0)</div>';
        html += '<div class="form-row" style="grid-template-columns:repeat(7,1fr)">';
        for (var i = 0; i <= 6; i++) {
            html += '<div class="form-group"><label class="form-label text-center">mRS ' + i + '</label>'
                + '<input type="number" class="form-input form-input--small text-center" name="ss_mrs_ctrl_' + i + '" id="ss_mrs_ctrl_' + i + '" step="0.01" min="0" max="1" value="' + [0.05, 0.07, 0.10, 0.10, 0.18, 0.20, 0.30][i] + '"></div>';
        }
        html += '</div>';
        html += '<div class="text-secondary" style="font-size:0.8rem" id="ss-mrs-sum">Sum: 1.00</div>';

        html += '<div class="form-row form-row--2 mt-2">'
            + '<div class="form-group"><label class="form-label">Common Odds Ratio ' + App.tooltip('The shift in odds across all mRS levels. ESCAPE~2.6, DAWN~2.0, realistic for new trial~1.5') + '</label>'
            + '<input type="number" class="form-input" name="ss_common_or" id="ss_common_or" step="0.1" min="1.1" value="1.5"></div>'
            + '<div class="form-group"><label class="form-label">Reference Effect Sizes</label>'
            + '<div style="font-size:0.8rem;color:var(--text-tertiary);margin-top:8px">ESCAPE: OR 2.6 | DAWN: OR 2.0 | MR CLEAN: OR 1.67</div></div>'
            + '</div>';

        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="SampleSizeModule.calculateOrdinal()">Calculate</button></div>';
        html += '<div id="ss-ordinal-results"></div>';
        html += '</div>';

        // ===== TAB E: Non-Inferiority =====
        html += '<div class="tab-content" id="tab-noninf">';
        html += '<div class="card-subtitle">Non-inferiority and equivalence designs. Uses one-sided alpha (default 0.025).</div>';
        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Expected Rate (both groups)</label>'
            + '<input type="number" class="form-input" name="ss_ni_p" id="ss_ni_p" step="0.01" value="0.30"></div>'
            + '<div class="form-group"><label class="form-label">Non-Inferiority Margin ' + App.tooltip('Maximum acceptable difference. Positive value.') + '</label>'
            + '<input type="number" class="form-input" name="ss_ni_margin" id="ss_ni_margin" step="0.01" value="0.05"></div>'
            + '<div class="form-group"><label class="form-label">Design</label>'
            + '<select class="form-select" name="ss_ni_type" id="ss_ni_type"><option value="noninf">Non-Inferiority</option><option value="equiv">Equivalence</option></select></div>'
            + '</div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="SampleSizeModule.calculateNonInf()">Calculate</button></div>';
        html += '<div id="ss-noninf-results"></div>';
        html += '</div>';

        // ===== TAB F: Cluster RCT =====
        html += '<div class="tab-content" id="tab-cluster">';
        html += '<div class="card-subtitle">Adjust sample size for cluster-randomized designs using the design effect.</div>';
        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Individual N (from standard calc)</label>'
            + '<input type="number" class="form-input" name="ss_cl_n" id="ss_cl_n" step="1" value="500"></div>'
            + '<div class="form-group"><label class="form-label">ICC ' + App.tooltip('Intracluster correlation coefficient. Typically 0.01-0.05 in clinical research.') + '</label>'
            + '<input type="number" class="form-input" name="ss_cl_icc" id="ss_cl_icc" step="0.005" min="0" max="1" value="0.03"></div>'
            + '<div class="form-group"><label class="form-label">Cluster Size</label>'
            + '<input type="number" class="form-input" name="ss_cl_size" id="ss_cl_size" step="5" min="2" value="30"></div>'
            + '</div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="SampleSizeModule.calculateCluster()">Calculate</button></div>';
        html += '<div id="ss-cluster-results"></div>';
        html += '</div>';

        // ===== TAB G: Stepped-Wedge =====
        html += '<div class="tab-content" id="tab-stepped">';
        html += '<div class="card-subtitle">Stepped-wedge cluster randomized design (Hussey-Hughes framework).</div>';
        html += '<div class="form-row form-row--4">'
            + '<div class="form-group"><label class="form-label">Individual N (parallel)</label>'
            + '<input type="number" class="form-input" name="ss_sw_n" id="ss_sw_n" step="1" value="500"></div>'
            + '<div class="form-group"><label class="form-label">Number of Steps</label>'
            + '<input type="number" class="form-input" name="ss_sw_steps" id="ss_sw_steps" step="1" min="2" value="5"></div>'
            + '<div class="form-group"><label class="form-label">Clusters per Step</label>'
            + '<input type="number" class="form-input" name="ss_sw_cps" id="ss_sw_cps" step="1" min="1" value="4"></div>'
            + '<div class="form-group"><label class="form-label">ICC</label>'
            + '<input type="number" class="form-input" name="ss_sw_icc" id="ss_sw_icc" step="0.005" min="0" max="1" value="0.03"></div>'
            + '</div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="SampleSizeModule.calculateStepped()">Calculate</button></div>';
        html += '<div id="ss-stepped-results"></div>';
        html += '</div>';

        // ===== TAB H: Multi-Arm =====
        html += '<div class="tab-content" id="tab-multiarm">';
        html += '<div class="card-subtitle">Multi-arm trials with multiplicity correction. Also includes group sequential boundaries.</div>';
        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">N per Group (2-arm design)</label>'
            + '<input type="number" class="form-input" name="ss_ma_n" id="ss_ma_n" step="1" value="400"></div>'
            + '<div class="form-group"><label class="form-label">Number of Arms</label>'
            + '<input type="number" class="form-input" name="ss_ma_arms" id="ss_ma_arms" step="1" min="2" max="10" value="3"></div>'
            + '<div class="form-group"><label class="form-label">Correction Method</label>'
            + '<select class="form-select" name="ss_ma_corr" id="ss_ma_corr"><option value="bonferroni">Bonferroni</option><option value="dunnett">Dunnett (approx)</option></select></div>'
            + '</div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="SampleSizeModule.calculateMultiArm()">Calculate</button></div>';
        html += '<div id="ss-multiarm-results"></div>';

        html += '<div class="card-title mt-3">Group Sequential Boundaries</div>';
        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Number of Interim Looks</label>'
            + '<input type="number" class="form-input" name="ss_gs_looks" id="ss_gs_looks" step="1" min="2" max="10" value="3"></div>'
            + '<div class="form-group"><label class="form-label">Boundary Type</label>'
            + '<select class="form-select" name="ss_gs_type" id="ss_gs_type"><option value="obf">O\'Brien-Fleming</option><option value="pocock">Pocock</option></select></div>'
            + '</div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="SampleSizeModule.calculateGS()">Calculate Boundaries</button></div>';
        html += '<div id="ss-gs-results"></div>';
        html += '</div>';

        html += '</div>'; // end card

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);
    }

    function switchTab(tabId) {
        document.querySelectorAll('#ss-tabs .tab').forEach(function(t) { t.classList.toggle('active', t.dataset.tab === tabId); });
        document.querySelectorAll('.tab-content').forEach(function(tc) { tc.classList.toggle('active', tc.id === 'tab-' + tabId); });
    }

    function syncRates(source) {
        var p1 = parseFloat(document.getElementById('ss_p1').value);
        var p2 = parseFloat(document.getElementById('ss_p2').value);
        if (source === 'p1' || source === 'p2') {
            document.getElementById('ss_arr').value = (p1 - p2).toFixed(3);
        } else if (source === 'arr') {
            var arr = parseFloat(document.getElementById('ss_arr').value);
            document.getElementById('ss_p2').value = (p1 - arr).toFixed(3);
        }
    }

    function loadPreset(name) {
        var presets = {
            lvo: { p1: 0.28, p2: 0.46 },
            mortality: { p1: 0.20, p2: 0.14 },
            sich: { p1: 0.06, p2: 0.03 },
            recurrent: { p1: 0.05, p2: 0.035 },
            ich: { p1: 0.38, p2: 0.30 },
            cardio: { p1: 0.12, p2: 0.08 },
            onc: { p1: 0.30, p2: 0.45 }
        };
        var p = presets[name];
        if (p) {
            document.getElementById('ss_p1').value = p.p1;
            document.getElementById('ss_p2').value = p.p2;
            document.getElementById('ss_arr').value = (p.p1 - p.p2).toFixed(3);
        }
    }

    function loadMRSPreset(key) {
        var d = References.mrsDistributions[key];
        if (d) {
            for (var i = 0; i <= 6; i++) {
                document.getElementById('ss_mrs_ctrl_' + i).value = d.dist[i].toFixed(2);
            }
            updateMRSSum();
        }
    }

    function updateMRSSum() {
        var sum = 0;
        for (var i = 0; i <= 6; i++) {
            sum += parseFloat(document.getElementById('ss_mrs_ctrl_' + i).value) || 0;
        }
        var el = document.getElementById('ss-mrs-sum');
        if (el) {
            el.textContent = 'Sum: ' + sum.toFixed(2);
            el.style.color = Math.abs(sum - 1) < 0.01 ? 'var(--success)' : 'var(--danger)';
        }
    }

    function getCommonParams() {
        return {
            alpha: parseFloat(document.getElementById('ss_alpha').value),
            power: parseFloat(document.getElementById('ss_power').value),
            ratio: parseFloat(document.getElementById('ss_ratio').value),
            dropout: parseFloat(document.getElementById('ss_dropout').value) / 100
        };
    }

    function calculateProportions() {
        var p1 = parseFloat(document.getElementById('ss_p1').value);
        var p2 = parseFloat(document.getElementById('ss_p2').value);
        var params = getCommonParams();

        var normal = Statistics.sampleSizeTwoProportions(p1, p2, params.alpha, params.power, params.ratio, 'normal');
        var fleiss = Statistics.sampleSizeTwoProportions(p1, p2, params.alpha, params.power, params.ratio, 'fleiss');
        var arcsine = Statistics.sampleSizeTwoProportions(p1, p2, params.alpha, params.power, params.ratio, 'arcsine');

        var recommended = fleiss;
        var dropoutN = Math.ceil(recommended.total / (1 - params.dropout));

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + recommended.total + ' participants</div>';
        html += '<div class="result-label">Recommended sample size (Fleiss continuity correction)</div>';
        html += '<div class="result-detail">' + recommended.n1 + ' per control group, ' + recommended.n2 + ' per treatment group';
        if (params.dropout > 0) html += '<br>Dropout-adjusted: <strong class="text-accent">' + dropoutN + '</strong> total (' + (params.dropout * 100).toFixed(0) + '% dropout)';
        html += '</div>';

        html += '<div class="result-grid">'
            + '<div class="result-item"><div class="result-item-value">' + normal.total + '</div><div class="result-item-label">Normal Approximation</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + fleiss.total + '</div><div class="result-item-label">Fleiss (corrected)</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + arcsine.total + '</div><div class="result-item-label">Arcsine Transform</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + ((p1 - p2) * 100).toFixed(1) + '%</div><div class="result-item-label">ARR</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + (p2 / p1).toFixed(2) + '</div><div class="result-item-label">RR</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + Math.round(1 / Math.abs(p1 - p2)) + '</div><div class="result-item-label">NNT</div></div>'
            + '</div>';

        // Sensitivity table
        html += '<div class="card-title mt-3">Sensitivity Analysis</div>';
        var offsets = [-0.03, -0.02, -0.01, 0, 0.01, 0.02, 0.03];
        html += '<table class="data-table"><thead><tr><th>p\u2082</th><th>ARR</th><th>N (Fleiss)</th><th>N/group</th></tr></thead><tbody>';
        offsets.forEach(function(off) {
            var p2v = Math.max(0.001, Math.min(0.999, p2 + off));
            var r = Statistics.sampleSizeTwoProportions(p1, p2v, params.alpha, params.power, params.ratio, 'fleiss');
            var isBase = off === 0;
            html += '<tr' + (isBase ? ' style="background:var(--accent-muted)"' : '') + '>'
                + '<td class="num">' + p2v.toFixed(3) + '</td>'
                + '<td class="num">' + ((p1 - p2v) * 100).toFixed(1) + '%</td>'
                + '<td class="num' + (isBase ? ' highlight' : '') + '">' + r.total + '</td>'
                + '<td class="num">' + r.n1 + '</td></tr>';
        });
        html += '</tbody></table>';

        // Power curve
        html += '<div class="chart-container"><canvas id="ss-power-chart" width="700" height="350"></canvas></div>';
        html += '<div class="chart-actions"><button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'ss-power-chart\'),\'power-curve.png\')">Export PNG</button></div>';

        // Methods text
        var methodsText = 'Sample size was calculated for a two-group comparison of proportions '
            + 'with a control group event rate of ' + (p1 * 100).toFixed(1) + '% and a treatment group event rate of '
            + (p2 * 100).toFixed(1) + '%, corresponding to an absolute risk reduction of '
            + ((p1 - p2) * 100).toFixed(1) + ' percentage points. Using a two-sided significance level of '
            + params.alpha + ' and ' + (params.power * 100).toFixed(0) + '% power'
            + (params.ratio !== 1 ? ' with a ' + params.ratio + ':1 allocation ratio' : '')
            + ', the Fleiss formula with continuity correction yields ' + recommended.n1 + ' participants per group '
            + '(' + recommended.total + ' total).'
            + (params.dropout > 0 ? ' Accounting for ' + (params.dropout * 100).toFixed(0) + '% dropout, a total of ' + dropoutN + ' participants will be enrolled.' : '');

        html += '<div class="mt-3"><div class="expandable-header" onclick="this.classList.toggle(\'open\')">Methods Text for Manuscript</div>'
            + '<div class="expandable-body"><div class="text-output">' + methodsText
            + '<button class="btn btn-xs btn-secondary copy-btn" onclick="Export.copyText(this.parentElement.textContent.replace(\'Copy\',\'\').trim())">Copy</button></div></div></div>';

        // Grant justification
        var grantText = Export.formatGrantJustification({
            n: recommended.total,
            nPerGroup: recommended.n1,
            ratio: params.ratio,
            power: params.power,
            alpha: params.alpha,
            designType: 'proportions',
            p1: p1, p2: p2,
            test: 'two-sided z-test for two proportions with Fleiss continuity correction',
            dropoutRate: params.dropout > 0 ? (params.dropout * 100).toFixed(0) : null,
            dropoutAdjusted: dropoutN
        });

        html += '<div class="expandable-header" onclick="this.classList.toggle(\'open\')">Grant Justification Text</div>'
            + '<div class="expandable-body"><div class="text-output">' + grantText
            + '<button class="btn btn-xs btn-secondary copy-btn" onclick="Export.copyText(this.parentElement.textContent.replace(\'Copy\',\'\').trim())">Copy</button></div></div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('ss-proportions-results'), html);

        // Draw power curve
        setTimeout(function() {
            var canvas = document.getElementById('ss-power-chart');
            if (!canvas) return;
            var points = [];
            for (var n = 20; n <= recommended.n1 * 3; n += Math.max(1, Math.floor(recommended.n1 / 50))) {
                var pwr = Statistics.powerTwoProportions(p1, p2, n, params.alpha, params.ratio);
                points.push({ x: n * (1 + params.ratio), y: pwr });
            }
            Charts.LineChart(canvas, {
                data: [{ label: 'Power', points: points }],
                xLabel: 'Total Sample Size', yLabel: 'Power',
                title: 'Power vs Sample Size',
                yMin: 0, yMax: 1,
                width: 700, height: 350
            });
        }, 100);

        Export.addToHistory(MODULE_ID, { p1: p1, p2: p2, alpha: params.alpha, power: params.power }, recommended.total + ' participants');
    }

    function calculateMeans() {
        var delta = parseFloat(document.getElementById('ss_delta').value);
        var sd1 = parseFloat(document.getElementById('ss_sd1').value);
        var sd2 = parseFloat(document.getElementById('ss_sd2').value);
        var params = getCommonParams();

        var result = Statistics.sampleSizeTwoMeans(delta, sd1, sd2, params.alpha, params.power, params.ratio);
        var dropoutN = Math.ceil(result.total / (1 - params.dropout));

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + result.total + ' participants</div>';
        html += '<div class="result-label">Required sample size (two-sample t-test)</div>';
        html += '<div class="result-detail">' + result.n1 + ' per group. Cohen\'s d = ' + (delta / sd1).toFixed(2);
        if (params.dropout > 0) html += '. Dropout-adjusted: <strong class="text-accent">' + dropoutN + '</strong>';
        html += '</div></div>';
        App.setTrustedHTML(document.getElementById('ss-means-results'), html);
    }

    function calculateSurvival() {
        var hr = parseFloat(document.getElementById('ss_hr').value);
        var params = getCommonParams();

        var schoenfeld = Statistics.sampleSizeSchoenfeld(hr, params.alpha, params.power, params.ratio);
        var freedman = Statistics.sampleSizeFreedman(hr, params.alpha, params.power, params.ratio);

        var accrual = parseFloat(document.getElementById('ss_accrual').value);
        var followup = parseFloat(document.getElementById('ss_followup').value);
        var medSurv = parseFloat(document.getElementById('ss_medsurv').value);

        // Estimate event probability
        var lambda = Math.log(2) / medSurv;
        var avgFollowup = accrual / 2 + followup;
        var pEvent = 1 - Math.exp(-lambda * avgFollowup);
        var totalN = Math.ceil(schoenfeld.events / pEvent);
        var dropoutN = Math.ceil(totalN / (1 - params.dropout));

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + schoenfeld.events + ' events needed</div>';
        html += '<div class="result-label">Schoenfeld formula</div>';
        html += '<div class="result-grid">'
            + '<div class="result-item"><div class="result-item-value">' + schoenfeld.events + '</div><div class="result-item-label">Events (Schoenfeld)</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + freedman.events + '</div><div class="result-item-label">Events (Freedman)</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + (pEvent * 100).toFixed(1) + '%</div><div class="result-item-label">Est. Event Probability</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + totalN + '</div><div class="result-item-label">Total N Required</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + dropoutN + '</div><div class="result-item-label">Dropout-Adjusted</div></div>'
            + '</div></div>';

        // Sensitivity by HR
        html += '<div class="card-title mt-3">Sensitivity: Events by HR</div>';
        html += '<table class="data-table"><thead><tr><th>HR</th><th>Events (Schoenfeld)</th><th>Total N</th></tr></thead><tbody>';
        [0.50, 0.60, 0.65, 0.70, 0.75, 0.80, 0.85, 0.90].forEach(function(h) {
            var r = Statistics.sampleSizeSchoenfeld(h, params.alpha, params.power, params.ratio);
            var isBase = Math.abs(h - hr) < 0.01;
            html += '<tr' + (isBase ? ' style="background:var(--accent-muted)"' : '') + '>'
                + '<td class="num">' + h.toFixed(2) + '</td>'
                + '<td class="num' + (isBase ? ' highlight' : '') + '">' + r.events + '</td>'
                + '<td class="num">' + Math.ceil(r.events / pEvent) + '</td></tr>';
        });
        html += '</tbody></table>';

        App.setTrustedHTML(document.getElementById('ss-survival-results'), html);
    }

    function calculateOrdinal() {
        var controlDist = [];
        for (var i = 0; i <= 6; i++) {
            controlDist.push(parseFloat(document.getElementById('ss_mrs_ctrl_' + i).value) || 0);
        }
        var commonOR = parseFloat(document.getElementById('ss_common_or').value);
        var params = getCommonParams();

        // Normalize distribution
        var sum = controlDist.reduce(function(a, b) { return a + b; }, 0);
        if (Math.abs(sum - 1) > 0.05) {
            Export.showToast('Distribution must sum to 1.0', 'error');
            return;
        }

        var result = Statistics.sampleSizeOrdinalShift(controlDist, null, commonOR, params.alpha, params.power);
        var dropoutN = Math.ceil(result.total / (1 - params.dropout));

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + result.total + ' participants</div>';
        html += '<div class="result-label">Proportional odds model (Whitehead formula), common OR = ' + commonOR + '</div>';
        html += '<div class="result-detail">' + result.nPerGroup + ' per group';
        if (params.dropout > 0) html += '. Dropout-adjusted: <strong class="text-accent">' + dropoutN + '</strong>';
        html += '</div></div>';

        // mRS distribution chart
        html += '<div class="chart-container"><canvas id="ss-mrs-chart" width="600" height="300"></canvas></div>';

        // Sensitivity by common OR
        html += '<div class="card-title mt-3">Sensitivity: N by Common OR</div>';
        html += '<table class="data-table"><thead><tr><th>Common OR</th><th>N per Group</th><th>Total N</th></tr></thead><tbody>';
        [1.2, 1.3, 1.4, 1.5, 1.6, 1.8, 2.0, 2.5, 3.0].forEach(function(or) {
            var r = Statistics.sampleSizeOrdinalShift(controlDist, null, or, params.alpha, params.power);
            var isBase = Math.abs(or - commonOR) < 0.01;
            html += '<tr' + (isBase ? ' style="background:var(--accent-muted)"' : '') + '>'
                + '<td class="num">' + or.toFixed(1) + '</td>'
                + '<td class="num' + (isBase ? ' highlight' : '') + '">' + r.nPerGroup + '</td>'
                + '<td class="num">' + r.total + '</td></tr>';
        });
        html += '</tbody></table>';

        // Methods text
        var methodsText = 'The primary analysis will use an ordinal shift analysis of the modified Rankin Scale '
            + 'at 90 days using a proportional odds model. Assuming a common odds ratio of ' + commonOR
            + ', a two-sided significance level of ' + params.alpha + ', and ' + (params.power * 100).toFixed(0)
            + '% power, the Whitehead formula yields a required sample size of ' + result.nPerGroup
            + ' per group (' + result.total + ' total).'
            + (params.dropout > 0 ? ' After adjusting for ' + (params.dropout * 100).toFixed(0) + '% dropout, ' + dropoutN + ' participants will be enrolled.' : '');

        html += '<div class="mt-3"><div class="expandable-header" onclick="this.classList.toggle(\'open\')">Methods Text</div>'
            + '<div class="expandable-body"><div class="text-output">' + methodsText
            + '<button class="btn btn-xs btn-secondary copy-btn" onclick="Export.copyText(this.parentElement.textContent.replace(\'Copy\',\'\').trim())">Copy</button></div></div></div>';

        App.setTrustedHTML(document.getElementById('ss-ordinal-results'), html);

        // Draw mRS chart
        setTimeout(function() {
            var canvas = document.getElementById('ss-mrs-chart');
            if (!canvas) return;
            Charts.BarChart(canvas, {
                categories: ['mRS 0', 'mRS 1', 'mRS 2', 'mRS 3', 'mRS 4', 'mRS 5', 'mRS 6'],
                series: [
                    { label: 'Control', values: controlDist.map(function(v) { return v * 100; }) }
                ],
                title: 'Control Group mRS Distribution',
                yLabel: 'Proportion (%)',
                width: 600, height: 300,
                stacked: false
            });
        }, 100);
    }

    function calculateNonInf() {
        var p = parseFloat(document.getElementById('ss_ni_p').value);
        var margin = parseFloat(document.getElementById('ss_ni_margin').value);
        var type = document.getElementById('ss_ni_type').value;
        var params = getCommonParams();

        var result;
        if (type === 'noninf') {
            result = Statistics.sampleSizeNonInferiority(p, p, margin, 0.025, params.power, params.ratio);
        } else {
            result = Statistics.sampleSizeEquivalence(p, margin, 0.025, params.power);
        }

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + result.total + ' participants</div>';
        html += '<div class="result-label">' + (type === 'noninf' ? 'Non-inferiority' : 'Equivalence') + ' design, margin = ' + margin + ', one-sided \u03B1 = 0.025</div>';
        html += '<div class="result-detail">' + result.n1 + ' per group</div></div>';
        App.setTrustedHTML(document.getElementById('ss-noninf-results'), html);
    }

    function calculateCluster() {
        var n = parseInt(document.getElementById('ss_cl_n').value);
        var icc = parseFloat(document.getElementById('ss_cl_icc').value);
        var clusterSize = parseInt(document.getElementById('ss_cl_size').value);

        var result = Statistics.sampleSizeCluster(n, icc, clusterSize);

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + result.totalN + ' participants</div>';
        html += '<div class="result-label">Design effect = ' + result.deff.toFixed(2) + '</div>';
        html += '<div class="result-grid">'
            + '<div class="result-item"><div class="result-item-value">' + result.deff.toFixed(2) + '</div><div class="result-item-label">Design Effect</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + result.nClusters + '</div><div class="result-item-label">Clusters per Arm</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + (result.nClusters * 2) + '</div><div class="result-item-label">Total Clusters</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + result.totalN + '</div><div class="result-item-label">Total Participants</div></div>'
            + '</div></div>';
        App.setTrustedHTML(document.getElementById('ss-cluster-results'), html);
    }

    function calculateStepped() {
        var n = parseInt(document.getElementById('ss_sw_n').value);
        var steps = parseInt(document.getElementById('ss_sw_steps').value);
        var cps = parseInt(document.getElementById('ss_sw_cps').value);
        var icc = parseFloat(document.getElementById('ss_sw_icc').value);

        var result = Statistics.sampleSizeSteppedWedge(n, steps, cps, icc);

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + result.totalN + ' participants</div>';
        html += '<div class="result-label">' + result.totalClusters + ' clusters, ' + steps + ' steps, correction factor = ' + result.correctionFactor.toFixed(3) + '</div>';
        html += '</div>';
        App.setTrustedHTML(document.getElementById('ss-stepped-results'), html);
    }

    function calculateMultiArm() {
        var n = parseInt(document.getElementById('ss_ma_n').value);
        var arms = parseInt(document.getElementById('ss_ma_arms').value);
        var corr = document.getElementById('ss_ma_corr').value;

        var result = Statistics.sampleSizeMultiArm(n, arms, corr);

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + result.totalN + ' total</div>';
        html += '<div class="result-label">' + result.nPerArm + ' per arm (' + arms + ' arms), ' + corr + ' correction, adjusted \u03B1 = ' + result.adjustedAlpha.toFixed(4) + '</div>';
        html += '</div>';
        App.setTrustedHTML(document.getElementById('ss-multiarm-results'), html);
    }

    function calculateGS() {
        var nLooks = parseInt(document.getElementById('ss_gs_looks').value);
        var type = document.getElementById('ss_gs_type').value;

        var boundaries = Statistics.groupSequentialBoundaries(nLooks, 0.05, type);

        var html = '<div class="result-panel animate-in">';
        html += '<table class="data-table"><thead><tr><th>Look</th><th>Info Fraction</th><th>Z Boundary</th><th>Nominal \u03B1</th></tr></thead><tbody>';
        boundaries.forEach(function(b) {
            html += '<tr><td>' + b.look + '</td><td class="num">' + b.fraction.toFixed(2) + '</td>'
                + '<td class="num highlight">' + b.z.toFixed(3) + '</td>'
                + '<td class="num">' + b.nominalAlpha.toFixed(4) + '</td></tr>';
        });
        html += '</tbody></table></div>';

        App.setTrustedHTML(document.getElementById('ss-gs-results'), html);
    }

    // Register module
    var moduleObj = {
        render: render,
        onThemeChange: function() {
            // Re-render charts if visible
        }
    };

    App.registerModule(MODULE_ID, moduleObj);

    // Expose functions globally for onclick handlers
    window.SampleSizeModule = {
        switchTab: switchTab,
        syncRates: syncRates,
        loadPreset: loadPreset,
        loadMRSPreset: loadMRSPreset,
        calculateProportions: calculateProportions,
        calculateMeans: calculateMeans,
        calculateSurvival: calculateSurvival,
        calculateOrdinal: calculateOrdinal,
        calculateNonInf: calculateNonInf,
        calculateCluster: calculateCluster,
        calculateStepped: calculateStepped,
        calculateMultiArm: calculateMultiArm,
        calculateGS: calculateGS
    };
})();
