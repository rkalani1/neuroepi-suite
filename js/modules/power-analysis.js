/**
 * NeuroEpi Suite — Power Analysis Module
 * Reverse of sample size: input N -> compute achieved power
 * Interactive power dashboard with real-time sliders
 */

(function() {
    'use strict';

    const MODULE_ID = 'power-analysis';

    function render(container) {
        var html = App.createModuleLayout(
            'Power Analysis',
            'Calculate achieved power for a given sample size, or explore how power changes across multiple scenarios interactively.'
        );

        // Design selector
        html += '<div class="card">';
        html += '<div class="card-title">Design Type</div>';
        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Outcome Type</label>'
            + '<select class="form-select" id="pa-design" onchange="PowerModule.updateDesign()">'
            + '<option value="proportions">Two Proportions</option>'
            + '<option value="means">Two Means</option>'
            + '<option value="survival">Time-to-Event (HR)</option>'
            + '</select></div>'
            + '</div>';

        // Proportions inputs
        html += '<div id="pa-inputs-proportions">';
        html += '<div class="form-row form-row--4">'
            + '<div class="form-group"><label class="form-label">Control Rate (p\u2081)</label>'
            + '<input type="number" class="form-input" id="pa-p1" step="0.01" value="0.28"></div>'
            + '<div class="form-group"><label class="form-label">Treatment Rate (p\u2082)</label>'
            + '<input type="number" class="form-input" id="pa-p2" step="0.01" value="0.20"></div>'
            + '<div class="form-group"><label class="form-label">N per group</label>'
            + '<input type="number" class="form-input" id="pa-n" step="10" value="500"></div>'
            + '<div class="form-group"><label class="form-label">\u03B1</label>'
            + '<select class="form-select" id="pa-alpha"><option value="0.05" selected>0.05</option><option value="0.01">0.01</option><option value="0.10">0.10</option></select></div>'
            + '</div>';
        html += '</div>';

        // Means inputs
        html += '<div id="pa-inputs-means" class="hidden">';
        html += '<div class="form-row form-row--4">'
            + '<div class="form-group"><label class="form-label">Mean Difference</label>'
            + '<input type="number" class="form-input" id="pa-delta" step="0.5" value="4"></div>'
            + '<div class="form-group"><label class="form-label">Common SD</label>'
            + '<input type="number" class="form-input" id="pa-sd" step="0.5" value="8"></div>'
            + '<div class="form-group"><label class="form-label">N per group</label>'
            + '<input type="number" class="form-input" id="pa-n-means" step="10" value="200"></div>'
            + '<div class="form-group"><label class="form-label">\u03B1</label>'
            + '<input type="number" class="form-input" id="pa-alpha-means" step="0.01" value="0.05"></div>'
            + '</div>';
        html += '</div>';

        // Survival inputs
        html += '<div id="pa-inputs-survival" class="hidden">';
        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Hazard Ratio</label>'
            + '<input type="number" class="form-input" id="pa-hr" step="0.05" value="0.70"></div>'
            + '<div class="form-group"><label class="form-label">Number of Events</label>'
            + '<input type="number" class="form-input" id="pa-events" step="10" value="200"></div>'
            + '<div class="form-group"><label class="form-label">\u03B1</label>'
            + '<input type="number" class="form-input" id="pa-alpha-surv" step="0.01" value="0.05"></div>'
            + '</div>';
        html += '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="PowerModule.calculate()">Calculate Power</button>'
            + '</div>';

        html += '<div id="pa-results"></div>';
        html += '</div>';

        // Interactive Dashboard
        html += '<div class="card">';
        html += '<div class="card-title">Interactive Power Dashboard</div>';
        html += '<div class="card-subtitle">Drag sliders to see power change in real-time</div>';

        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Effect Size (ARR): <span id="pa-slider-eff-val">0.08</span></label>'
            + '<input type="range" id="pa-slider-eff" min="0.01" max="0.20" step="0.005" value="0.08" style="width:100%" oninput="PowerModule.updateDashboard()"></div>'
            + '<div class="form-group"><label class="form-label">Total N: <span id="pa-slider-n-val">500</span></label>'
            + '<input type="range" id="pa-slider-n" min="50" max="5000" step="10" value="500" style="width:100%" oninput="PowerModule.updateDashboard()"></div>'
            + '<div class="form-group"><label class="form-label">\u03B1: <span id="pa-slider-alpha-val">0.05</span></label>'
            + '<input type="range" id="pa-slider-alpha" min="0.01" max="0.10" step="0.005" value="0.05" style="width:100%" oninput="PowerModule.updateDashboard()"></div>'
            + '</div>';

        html += '<div class="result-panel" id="pa-dashboard-result">'
            + '<div class="result-value" id="pa-dashboard-power">--</div>'
            + '<div class="result-label">Achieved Power</div></div>';

        html += '<div class="chart-container"><canvas id="pa-dashboard-chart" width="700" height="350"></canvas></div>';
        html += '<div class="chart-actions"><button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'pa-dashboard-chart\'),\'power-dashboard.png\')">Export PNG</button></div>';
        html += '</div>';

        // Multi-scenario comparison
        html += '<div class="card">';
        html += '<div class="card-title">Multi-Scenario Comparison</div>';
        html += '<div class="card-subtitle">Define up to 5 scenarios and compare power</div>';
        html += '<div id="pa-scenarios">';
        for (var i = 1; i <= 5; i++) {
            html += '<div class="form-row form-row--4 mb-1" style="align-items:end">'
                + '<div class="form-group"><label class="form-label">Scenario ' + i + ' - p\u2081</label>'
                + '<input type="number" class="form-input form-input--small" id="pa-sc' + i + '-p1" step="0.01" value="' + (0.28) + '"></div>'
                + '<div class="form-group"><label class="form-label">p\u2082</label>'
                + '<input type="number" class="form-input form-input--small" id="pa-sc' + i + '-p2" step="0.01" value="' + +(0.28 - 0.02 * i).toFixed(2) + '"></div>'
                + '<div class="form-group"><label class="form-label">N/group</label>'
                + '<input type="number" class="form-input form-input--small" id="pa-sc' + i + '-n" step="10" value="' + (200 + i * 100) + '"></div>'
                + '<div class="form-group"><label class="form-label">Power</label>'
                + '<div class="form-input form-input--small" id="pa-sc' + i + '-power" style="display:flex;align-items:center;font-family:var(--font-mono);color:var(--accent)">--</div></div>'
                + '</div>';
        }
        html += '</div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="PowerModule.compareScenarios()">Compare All</button></div>';
        html += '<div class="chart-container"><canvas id="pa-scenario-chart" width="700" height="350"></canvas></div>';
        html += '</div>';

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);
    }

    function updateDesign() {
        var design = document.getElementById('pa-design').value;
        document.getElementById('pa-inputs-proportions').classList.toggle('hidden', design !== 'proportions');
        document.getElementById('pa-inputs-means').classList.toggle('hidden', design !== 'means');
        document.getElementById('pa-inputs-survival').classList.toggle('hidden', design !== 'survival');
    }

    function calculate() {
        var design = document.getElementById('pa-design').value;
        var power, details;

        if (design === 'proportions') {
            var p1 = parseFloat(document.getElementById('pa-p1').value);
            var p2 = parseFloat(document.getElementById('pa-p2').value);
            var n = parseInt(document.getElementById('pa-n').value);
            var alpha = parseFloat(document.getElementById('pa-alpha').value);
            power = Statistics.powerTwoProportions(p1, p2, n, alpha);
            details = 'p\u2081=' + p1 + ', p\u2082=' + p2 + ', N/group=' + n + ', \u03B1=' + alpha;
        } else if (design === 'means') {
            var delta = parseFloat(document.getElementById('pa-delta').value);
            var sd = parseFloat(document.getElementById('pa-sd').value);
            var nM = parseInt(document.getElementById('pa-n-means').value);
            var alphaM = parseFloat(document.getElementById('pa-alpha-means').value);
            power = Statistics.powerTwoMeans(delta, sd, nM, alphaM);
            details = '\u03B4=' + delta + ', SD=' + sd + ', N/group=' + nM + ', \u03B1=' + alphaM;
        } else {
            var hr = parseFloat(document.getElementById('pa-hr').value);
            var events = parseInt(document.getElementById('pa-events').value);
            var alphaS = parseFloat(document.getElementById('pa-alpha-surv').value);
            power = Statistics.powerSurvival(hr, events, alphaS);
            details = 'HR=' + hr + ', Events=' + events + ', \u03B1=' + alphaS;
        }

        var pct = (power * 100).toFixed(1);
        var color = power >= 0.80 ? 'var(--success)' : power >= 0.60 ? 'var(--warning)' : 'var(--danger)';

        var html = '<div class="result-panel animate-in">'
            + '<div class="result-value" style="color:' + color + '">' + pct + '%</div>'
            + '<div class="result-label">Achieved Power</div>'
            + '<div class="result-detail">' + details + '</div>'
            + '<div class="result-detail mt-1" style="font-size:0.85rem">'
            + (power >= 0.80 ? 'Adequate power (\u226580%). This study is well-powered to detect the specified effect.'
                : power >= 0.60 ? 'Marginal power (60-79%). Consider increasing sample size for more reliable detection.'
                : 'Underpowered (<60%). High risk of Type II error. Strongly consider increasing sample size.')
            + '</div></div>';

        App.setTrustedHTML(document.getElementById('pa-results'), html);
    }

    function updateDashboard() {
        var eff = parseFloat(document.getElementById('pa-slider-eff').value);
        var totalN = parseInt(document.getElementById('pa-slider-n').value);
        var alpha = parseFloat(document.getElementById('pa-slider-alpha').value);

        document.getElementById('pa-slider-eff-val').textContent = eff.toFixed(3);
        document.getElementById('pa-slider-n-val').textContent = totalN;
        document.getElementById('pa-slider-alpha-val').textContent = alpha.toFixed(3);

        var p1 = 0.28;
        var p2 = p1 - eff;
        var nPerGroup = Math.floor(totalN / 2);
        var power = Statistics.powerTwoProportions(p1, p2, nPerGroup, alpha);
        var pct = (power * 100).toFixed(1);
        var color = power >= 0.80 ? 'var(--success)' : power >= 0.60 ? 'var(--warning)' : 'var(--danger)';

        var el = document.getElementById('pa-dashboard-power');
        if (el) {
            el.textContent = pct + '%';
            el.style.color = color;
        }

        // Draw power curve
        var canvas = document.getElementById('pa-dashboard-chart');
        if (!canvas) return;
        var points = [];
        for (var n = 20; n <= Math.max(totalN * 2, 500); n += Math.max(1, Math.floor(totalN / 40))) {
            var pw = Statistics.powerTwoProportions(p1, p2, Math.floor(n / 2), alpha);
            points.push({ x: n, y: pw });
        }

        // Add marker at current N
        Charts.LineChart(canvas, {
            data: [{ label: 'Power', points: points }],
            xLabel: 'Total Sample Size', yLabel: 'Power',
            title: 'Power Curve (ARR = ' + (eff * 100).toFixed(1) + '%, \u03B1 = ' + alpha + ')',
            yMin: 0, yMax: 1,
            width: 700, height: 350
        });
    }

    function compareScenarios() {
        var series = [];
        for (var i = 1; i <= 5; i++) {
            var p1El = document.getElementById('pa-sc' + i + '-p1');
            var p2El = document.getElementById('pa-sc' + i + '-p2');
            var nEl = document.getElementById('pa-sc' + i + '-n');
            if (!p1El || !p2El || !nEl) continue;

            var p1 = parseFloat(p1El.value);
            var p2 = parseFloat(p2El.value);
            var nPG = parseInt(nEl.value);
            if (isNaN(p1) || isNaN(p2) || isNaN(nPG) || nPG <= 0) continue;

            var power = Statistics.powerTwoProportions(p1, p2, nPG, 0.05);
            var powerEl = document.getElementById('pa-sc' + i + '-power');
            if (powerEl) powerEl.textContent = (power * 100).toFixed(1) + '%';

            // Generate power curve for this scenario
            var points = [];
            for (var n = 20; n <= nPG * 3; n += Math.max(1, Math.floor(nPG / 30))) {
                var pw = Statistics.powerTwoProportions(p1, p2, Math.floor(n / 2), 0.05);
                points.push({ x: n * 2, y: pw });
            }
            series.push({ label: 'S' + i + ': ARR=' + ((p1 - p2) * 100).toFixed(1) + '%', points: points });
        }

        if (series.length > 0) {
            var canvas = document.getElementById('pa-scenario-chart');
            if (canvas) {
                Charts.LineChart(canvas, {
                    data: series,
                    xLabel: 'Total Sample Size', yLabel: 'Power',
                    title: 'Multi-Scenario Power Comparison',
                    yMin: 0, yMax: 1,
                    width: 700, height: 350
                });
            }
        }
    }

    App.registerModule(MODULE_ID, { render: render });

    window.PowerModule = {
        updateDesign: updateDesign,
        calculate: calculate,
        updateDashboard: updateDashboard,
        compareScenarios: compareScenarios
    };
})();
