/**
 * Neuro-Epi — Diagnostic Accuracy Module
 * 2x2 diagnostic table, sensitivity/specificity/LR/DOR with Wilson CIs,
 * Fagan nomogram (canvas), ROC curve, SPIN/SNOUT, two-test comparison.
 */
(function() {
    'use strict';

    var MODULE_ID = 'diagnostic-accuracy';

    // ============================================================
    // STATE
    // ============================================================
    var preTestProb = 0.30;
    var rocPoints = [];
    var lastDiagResults = null;

    // ============================================================
    // RENDER
    // ============================================================
    function render(container) {
        var html = App.createModuleLayout(
            'Diagnostic Accuracy',
            'Calculate sensitivity, specificity, predictive values, likelihood ratios with confidence intervals. Includes Fagan nomogram, ROC curve analysis, and two-test comparison.'
        );

        // ===== TAB NAV =====
        html += '<div class="card">';
        html += '<div class="tabs" id="da-tabs">'
            + '<button class="tab active" data-tab="accuracy" onclick="DiagAccuracyModule.switchTab(\'accuracy\')">Diagnostic Accuracy</button>'
            + '<button class="tab" data-tab="nomogram" onclick="DiagAccuracyModule.switchTab(\'nomogram\')">Fagan Nomogram</button>'
            + '<button class="tab" data-tab="roc" onclick="DiagAccuracyModule.switchTab(\'roc\')">ROC Curve</button>'
            + '<button class="tab" data-tab="compare" onclick="DiagAccuracyModule.switchTab(\'compare\')">Compare Two Tests</button>'
            + '</div>';

        // ===== TAB A: Diagnostic Accuracy =====
        html += '<div class="tab-content active" id="tab-accuracy">';
        html += '<div class="card-subtitle">Enter the 2x2 contingency table from your diagnostic study.</div>';

        // 2x2 visual table
        html += '<div style="max-width:500px;margin:0 auto 16px;">';
        html += '<table class="data-table" style="text-align:center;">';
        html += '<thead><tr><th></th><th colspan="2" style="text-align:center;">Disease Status (Reference)</th></tr>'
            + '<tr><th>Test Result</th><th style="text-align:center;">Positive (D+)</th><th style="text-align:center;">Negative (D-)</th></tr></thead>';
        html += '<tbody>'
            + '<tr><td style="font-weight:600;">Test Positive</td>'
            + '<td><input type="number" class="form-input form-input--small text-center" id="da-tp" min="0" step="1" value="80" style="width:80px;margin:0 auto;" onchange="DiagAccuracyModule.calculate()">'
            + '<div class="text-secondary" style="font-size:0.7rem;">TP</div></td>'
            + '<td><input type="number" class="form-input form-input--small text-center" id="da-fp" min="0" step="1" value="10" style="width:80px;margin:0 auto;" onchange="DiagAccuracyModule.calculate()">'
            + '<div class="text-secondary" style="font-size:0.7rem;">FP</div></td></tr>'
            + '<tr><td style="font-weight:600;">Test Negative</td>'
            + '<td><input type="number" class="form-input form-input--small text-center" id="da-fn" min="0" step="1" value="20" style="width:80px;margin:0 auto;" onchange="DiagAccuracyModule.calculate()">'
            + '<div class="text-secondary" style="font-size:0.7rem;">FN</div></td>'
            + '<td><input type="number" class="form-input form-input--small text-center" id="da-tn" min="0" step="1" value="190" style="width:80px;margin:0 auto;" onchange="DiagAccuracyModule.calculate()">'
            + '<div class="text-secondary" style="font-size:0.7rem;">TN</div></td></tr>'
            + '</tbody></table>';
        html += '</div>';

        html += '<div class="btn-group" style="justify-content:center;">'
            + '<button class="btn btn-primary" onclick="DiagAccuracyModule.calculate()">Calculate</button>'
            + '<button class="btn btn-secondary" onclick="DiagAccuracyModule.copyDiagResults()">Copy All Results</button>'
            + '</div>';

        html += '<div id="da-results"></div>';
        html += '</div>'; // tab-accuracy

        // ===== TAB B: Fagan Nomogram =====
        html += '<div class="tab-content" id="tab-nomogram">';
        html += '<div class="card-subtitle">Interactive Fagan nomogram. Adjust pre-test probability to see post-test probabilities.</div>';

        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Pre-test Probability (%) ' + App.tooltip('Prevalence or prior probability before testing') + '</label>'
            + '<input type="range" id="da-pretest-slider" min="1" max="99" value="' + Math.round(preTestProb * 100) + '" oninput="DiagAccuracyModule.updateNomogram()" style="width:100%;">'
            + '<div class="text-center" id="da-pretest-display" style="font-size:1.2rem;font-weight:600;">' + Math.round(preTestProb * 100) + '%</div></div>'
            + '<div class="form-group"><label class="form-label">Positive LR (+LR)</label>'
            + '<input type="number" class="form-input" id="da-plr-input" step="0.1" min="0.01" value="8.0" onchange="DiagAccuracyModule.updateNomogram()"></div>'
            + '<div class="form-group"><label class="form-label">Negative LR (-LR)</label>'
            + '<input type="number" class="form-input" id="da-nlr-input" step="0.01" min="0.001" max="1" value="0.11" onchange="DiagAccuracyModule.updateNomogram()"></div>'
            + '</div>';

        html += '<div class="result-grid" id="da-nomogram-results"></div>';
        html += '<div class="chart-container"><canvas id="da-nomogram-canvas"></canvas></div>';
        html += '<div class="chart-actions">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'da-nomogram-canvas\'),\'fagan-nomogram.png\')">Export PNG</button></div>';
        html += '</div>'; // tab-nomogram

        // ===== TAB C: ROC Curve =====
        html += '<div class="tab-content" id="tab-roc">';
        html += '<div class="card-subtitle">Enter sensitivity and specificity at multiple thresholds to plot the ROC curve and compute AUC.</div>';

        html += '<div class="btn-group">'
            + '<button class="btn btn-secondary" onclick="DiagAccuracyModule.addROCPoint()">+ Add Threshold Point</button>'
            + '<button class="btn btn-secondary" onclick="DiagAccuracyModule.loadROCExample()">Load Example</button>'
            + '<button class="btn btn-primary" onclick="DiagAccuracyModule.plotROC()">Plot ROC & Compute AUC</button>'
            + '</div>';

        html += '<div id="da-roc-table" class="mt-2"></div>';
        html += '<div id="da-roc-results"></div>';
        html += '</div>'; // tab-roc

        // ===== TAB D: Compare Two Tests =====
        html += '<div class="tab-content" id="tab-compare">';
        html += '<div class="card-subtitle">Compare two diagnostic tests on the same subjects using McNemar\'s test for paired data.</div>';

        html += '<div style="max-width:450px;margin:0 auto 16px;">';
        html += '<div class="form-label text-center" style="font-weight:600;">Test 2 Result</div>';
        html += '<table class="data-table" style="text-align:center;">';
        html += '<thead><tr><th>Test 1 \\ Test 2</th><th>Positive</th><th>Negative</th></tr></thead>';
        html += '<tbody>'
            + '<tr><td style="font-weight:600;">Positive</td>'
            + '<td><input type="number" class="form-input form-input--small text-center" id="da-mc-a" min="0" step="1" value="40" style="width:70px;margin:0 auto;">'
            + '<div class="text-secondary" style="font-size:0.7rem;">Both +</div></td>'
            + '<td><input type="number" class="form-input form-input--small text-center" id="da-mc-b" min="0" step="1" value="15" style="width:70px;margin:0 auto;">'
            + '<div class="text-secondary" style="font-size:0.7rem;">T1+, T2-</div></td></tr>'
            + '<tr><td style="font-weight:600;">Negative</td>'
            + '<td><input type="number" class="form-input form-input--small text-center" id="da-mc-c" min="0" step="1" value="5" style="width:70px;margin:0 auto;">'
            + '<div class="text-secondary" style="font-size:0.7rem;">T1-, T2+</div></td>'
            + '<td><input type="number" class="form-input form-input--small text-center" id="da-mc-d" min="0" step="1" value="140" style="width:70px;margin:0 auto;">'
            + '<div class="text-secondary" style="font-size:0.7rem;">Both -</div></td></tr>'
            + '</tbody></table>';
        html += '</div>';

        html += '<div class="btn-group" style="justify-content:center;">'
            + '<button class="btn btn-primary" onclick="DiagAccuracyModule.compareMcNemar()">Run McNemar\'s Test</button>'
            + '</div>';
        html += '<div id="da-compare-results"></div>';
        html += '</div>'; // tab-compare

        html += '</div>'; // card

        App.setTrustedHTML(container, html);
        renderROCTable();
    }

    // ============================================================
    // TAB SWITCHING
    // ============================================================
    function switchTab(tabId) {
        document.querySelectorAll('#da-tabs .tab').forEach(function(t) {
            t.classList.toggle('active', t.dataset.tab === tabId);
        });
        document.querySelectorAll('.tab-content').forEach(function(tc) {
            tc.classList.toggle('active', tc.id === 'tab-' + tabId);
        });

        if (tabId === 'nomogram') {
            setTimeout(function() { updateNomogram(); }, 50);
        }
    }

    // ============================================================
    // DIAGNOSTIC ACCURACY CALCULATION
    // ============================================================
    function calculate() {
        var tp = parseInt(document.getElementById('da-tp').value) || 0;
        var fp = parseInt(document.getElementById('da-fp').value) || 0;
        var fn = parseInt(document.getElementById('da-fn').value) || 0;
        var tn = parseInt(document.getElementById('da-tn').value) || 0;
        var n = tp + fp + fn + tn;

        if (n === 0) {
            Export.showToast('Enter values in the 2x2 table', 'error');
            return;
        }

        var da = Statistics.diagnosticAccuracy(tp, fp, fn, tn);
        lastDiagResults = da;

        // Update nomogram inputs
        var plrInput = document.getElementById('da-plr-input');
        var nlrInput = document.getElementById('da-nlr-input');
        if (plrInput && isFinite(da.plr)) plrInput.value = da.plr.toFixed(2);
        if (nlrInput && isFinite(da.nlr)) nlrInput.value = da.nlr.toFixed(3);

        var html = '<div class="result-panel animate-in mt-3">';

        // Main metrics table
        html += '<div class="card-title">Diagnostic Accuracy Metrics (Wilson 95% CI)</div>';
        html += '<table class="data-table"><thead><tr>'
            + '<th>Metric</th><th>Value</th><th>95% CI</th></tr></thead><tbody>';

        html += metricRow('Sensitivity', da.sensitivity.value, da.sensitivity.ci);
        html += metricRow('Specificity', da.specificity.value, da.specificity.ci);
        html += metricRow('PPV (Positive Predictive Value)', da.ppv.value, da.ppv.ci);
        html += metricRow('NPV (Negative Predictive Value)', da.npv.value, da.npv.ci);
        html += metricRowPlain('Positive Likelihood Ratio (+LR)', da.plr);
        html += metricRowPlain('Negative Likelihood Ratio (-LR)', da.nlr);
        html += metricRowPlain('Diagnostic Odds Ratio (DOR)', da.dor);
        html += metricRow('Accuracy', da.accuracy, null);
        html += metricRow('Prevalence', da.prevalence, null);
        html += metricRowPlain('Youden\'s J Index', da.youdenJ);

        html += '</tbody></table>';

        // Summary grid
        html += '<div class="result-grid mt-2">';
        html += '<div class="result-item"><div class="result-item-value">' + (da.sensitivity.value * 100).toFixed(1) + '%</div>'
            + '<div class="result-item-label">Sensitivity</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + (da.specificity.value * 100).toFixed(1) + '%</div>'
            + '<div class="result-item-label">Specificity</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + da.plr.toFixed(2) + '</div>'
            + '<div class="result-item-label">+LR</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + da.nlr.toFixed(3) + '</div>'
            + '<div class="result-item-label">-LR</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + da.dor.toFixed(1) + '</div>'
            + '<div class="result-item-label">DOR</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + da.youdenJ.toFixed(3) + '</div>'
            + '<div class="result-item-label">Youden\'s J</div></div>';
        html += '</div>';

        // SPIN / SNOUT interpretation
        html += '<div class="card-title mt-3">Clinical Interpretation</div>';
        html += '<div style="font-size:0.9rem;line-height:1.6;">';

        // SpPIn
        if (da.specificity.value >= 0.95) {
            html += '<div style="margin-bottom:8px;"><strong style="color:var(--success);">SpPIn (Specificity ' + (da.specificity.value * 100).toFixed(0) + '%):</strong> '
                + 'A highly specific test — when positive, it effectively rules IN disease. '
                + 'A positive result has a high +LR of ' + da.plr.toFixed(1) + ', meaning disease is '
                + da.plr.toFixed(1) + 'x more likely in those who test positive.</div>';
        } else if (da.specificity.value >= 0.90) {
            html += '<div style="margin-bottom:8px;"><strong>SpPIn (Specificity ' + (da.specificity.value * 100).toFixed(0) + '%):</strong> '
                + 'Moderately specific test. A positive result increases disease probability (+LR = ' + da.plr.toFixed(1) + ') '
                + 'but does not definitively rule in disease.</div>';
        } else {
            html += '<div style="margin-bottom:8px;"><strong>SpPIn:</strong> '
                + 'Specificity is ' + (da.specificity.value * 100).toFixed(0) + '% — not high enough for reliable rule-in. '
                + '+LR = ' + da.plr.toFixed(1) + '.</div>';
        }

        // SnNOut
        if (da.sensitivity.value >= 0.95) {
            html += '<div style="margin-bottom:8px;"><strong style="color:var(--success);">SnNOut (Sensitivity ' + (da.sensitivity.value * 100).toFixed(0) + '%):</strong> '
                + 'A highly sensitive test — when negative, it effectively rules OUT disease. '
                + 'A negative result has a low -LR of ' + da.nlr.toFixed(3) + ', making disease very unlikely.</div>';
        } else if (da.sensitivity.value >= 0.90) {
            html += '<div style="margin-bottom:8px;"><strong>SnNOut (Sensitivity ' + (da.sensitivity.value * 100).toFixed(0) + '%):</strong> '
                + 'Moderately sensitive. A negative result reduces disease probability (-LR = ' + da.nlr.toFixed(3) + ') '
                + 'but does not definitively rule out disease.</div>';
        } else {
            html += '<div style="margin-bottom:8px;"><strong>SnNOut:</strong> '
                + 'Sensitivity is ' + (da.sensitivity.value * 100).toFixed(0) + '% — not high enough for reliable rule-out. '
                + '-LR = ' + da.nlr.toFixed(3) + '.</div>';
        }

        // LR interpretation
        var plrLevel = da.plr >= 10 ? 'large and often conclusive' : (da.plr >= 5 ? 'moderate' : (da.plr >= 2 ? 'small' : 'negligible'));
        var nlrLevel = da.nlr <= 0.1 ? 'large and often conclusive' : (da.nlr <= 0.2 ? 'moderate' : (da.nlr <= 0.5 ? 'small' : 'negligible'));
        html += '<div style="margin-bottom:8px;">The shift in probability from a positive test is <strong>' + plrLevel + '</strong> (+LR = ' + da.plr.toFixed(2) + '). '
            + 'The shift from a negative test is <strong>' + nlrLevel + '</strong> (-LR = ' + da.nlr.toFixed(3) + ').</div>';

        html += '</div>';

        html += '</div>'; // result-panel

        App.setTrustedHTML(document.getElementById('da-results'), html);
    }

    function metricRow(label, value, ci) {
        var valStr = typeof value === 'number' ? (value * 100).toFixed(1) + '%' : value;
        var ciStr = ci ? '[' + (ci.lower * 100).toFixed(1) + '%, ' + (ci.upper * 100).toFixed(1) + '%]' : '-';
        return '<tr><td>' + label + '</td><td class="num">' + valStr + '</td><td class="num">' + ciStr + '</td></tr>';
    }

    function metricRowPlain(label, value) {
        var valStr = isFinite(value) ? value.toFixed(3) : (value > 0 ? 'Inf' : '0');
        return '<tr><td>' + label + '</td><td class="num">' + valStr + '</td><td class="num">-</td></tr>';
    }

    // ============================================================
    // COPY RESULTS
    // ============================================================
    function copyDiagResults() {
        if (!lastDiagResults) {
            Export.showToast('Run calculation first', 'error');
            return;
        }
        var da = lastDiagResults;
        var lines = [
            'Diagnostic Accuracy Results',
            'Sensitivity: ' + (da.sensitivity.value * 100).toFixed(1) + '% [' + (da.sensitivity.ci.lower * 100).toFixed(1) + ', ' + (da.sensitivity.ci.upper * 100).toFixed(1) + ']',
            'Specificity: ' + (da.specificity.value * 100).toFixed(1) + '% [' + (da.specificity.ci.lower * 100).toFixed(1) + ', ' + (da.specificity.ci.upper * 100).toFixed(1) + ']',
            'PPV: ' + (da.ppv.value * 100).toFixed(1) + '% [' + (da.ppv.ci.lower * 100).toFixed(1) + ', ' + (da.ppv.ci.upper * 100).toFixed(1) + ']',
            'NPV: ' + (da.npv.value * 100).toFixed(1) + '% [' + (da.npv.ci.lower * 100).toFixed(1) + ', ' + (da.npv.ci.upper * 100).toFixed(1) + ']',
            '+LR: ' + da.plr.toFixed(2),
            '-LR: ' + da.nlr.toFixed(3),
            'DOR: ' + da.dor.toFixed(1),
            'Accuracy: ' + (da.accuracy * 100).toFixed(1) + '%',
            'Prevalence: ' + (da.prevalence * 100).toFixed(1) + '%',
            'Youden\'s J: ' + da.youdenJ.toFixed(3)
        ];
        Export.copyText(lines.join('\n'));
    }

    // ============================================================
    // FAGAN NOMOGRAM
    // ============================================================
    function updateNomogram() {
        var slider = document.getElementById('da-pretest-slider');
        var display = document.getElementById('da-pretest-display');
        if (!slider) return;

        preTestProb = parseInt(slider.value) / 100;
        if (display) display.textContent = Math.round(preTestProb * 100) + '%';

        var plr = parseFloat(document.getElementById('da-plr-input').value) || 1;
        var nlr = parseFloat(document.getElementById('da-nlr-input').value) || 1;

        var fagan = Statistics.faganNomogram(preTestProb, plr, nlr);

        // Update results
        var resEl = document.getElementById('da-nomogram-results');
        if (resEl) {
            var html = '<div class="result-item"><div class="result-item-value">' + (fagan.preTestProb * 100).toFixed(1) + '%</div>'
                + '<div class="result-item-label">Pre-test Probability</div></div>';
            html += '<div class="result-item"><div class="result-item-value" style="color:var(--danger);">' + (fagan.postTestProbPos * 100).toFixed(1) + '%</div>'
                + '<div class="result-item-label">Post-test Prob (Test +)</div></div>';
            html += '<div class="result-item"><div class="result-item-value" style="color:var(--success);">' + (fagan.postTestProbNeg * 100).toFixed(1) + '%</div>'
                + '<div class="result-item-label">Post-test Prob (Test -)</div></div>';
            App.setTrustedHTML(resEl, html);
        }

        // Draw nomogram
        drawNomogram(fagan, plr, nlr);
    }

    function drawNomogram(fagan, plr, nlr) {
        var canvas = document.getElementById('da-nomogram-canvas');
        if (!canvas) return;

        var width = 500;
        var height = 500;
        var theme = Charts.getTheme();
        var ctx = Charts.setupCanvas(canvas, width, height);

        // Background
        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = theme.text;
        ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Fagan Nomogram', width / 2, 22);

        var leftX = 80;
        var midX = width / 2;
        var rightX = width - 80;
        var topY = 50;
        var botY = height - 40;
        var scaleH = botY - topY;

        // Probability to Y-position (log-odds scale)
        function probToY(p) {
            if (p <= 0.001) p = 0.001;
            if (p >= 0.999) p = 0.999;
            var logOdds = Math.log(p / (1 - p));
            // Map log-odds range [-6, 6] to [botY, topY]
            var t = (logOdds + 6) / 12;
            return botY - t * scaleH;
        }

        // LR to Y-position (log scale)
        function lrToY(lr) {
            if (lr <= 0.001) lr = 0.001;
            if (lr > 1000) lr = 1000;
            var logLR = Math.log10(lr);
            // Map log10 LR range [-3, 3] to [botY, topY]
            var t = (logLR + 3) / 6;
            return botY - t * scaleH;
        }

        // Draw axes
        ctx.strokeStyle = theme.border;
        ctx.lineWidth = 1.5;

        // Left axis: pre-test probability
        ctx.beginPath();
        ctx.moveTo(leftX, topY);
        ctx.lineTo(leftX, botY);
        ctx.stroke();

        // Middle axis: likelihood ratio
        ctx.beginPath();
        ctx.moveTo(midX, topY);
        ctx.lineTo(midX, botY);
        ctx.stroke();

        // Right axis: post-test probability
        ctx.beginPath();
        ctx.moveTo(rightX, topY);
        ctx.lineTo(rightX, botY);
        ctx.stroke();

        // Tick marks and labels
        ctx.font = '10px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = theme.textSecondary;

        // Pre-test / Post-test probability ticks
        var probTicks = [0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 0.95, 0.99];
        var probLabels = ['0.1', '0.2', '0.5', '1', '2', '5', '10', '20', '30', '40', '50', '60', '70', '80', '90', '95', '99'];

        probTicks.forEach(function(p, i) {
            var y = probToY(p);
            // Left
            ctx.beginPath();
            ctx.moveTo(leftX - 4, y);
            ctx.lineTo(leftX, y);
            ctx.stroke();
            ctx.textAlign = 'right';
            ctx.fillText(probLabels[i], leftX - 7, y + 3);

            // Right
            ctx.beginPath();
            ctx.moveTo(rightX, y);
            ctx.lineTo(rightX + 4, y);
            ctx.stroke();
            ctx.textAlign = 'left';
            ctx.fillText(probLabels[i], rightX + 7, y + 3);
        });

        // LR ticks (center)
        var lrTicks = [0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 1000];
        var lrLabels = ['0.001', '0.002', '0.005', '0.01', '0.02', '0.05', '0.1', '0.2', '0.5', '1', '2', '5', '10', '20', '50', '100', '1000'];

        lrTicks.forEach(function(lr, i) {
            var y = lrToY(lr);
            ctx.beginPath();
            ctx.moveTo(midX - 4, y);
            ctx.lineTo(midX + 4, y);
            ctx.stroke();
            ctx.textAlign = 'center';
            ctx.fillText(lrLabels[i], midX, y - 5);
        });

        // Axis labels
        ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = theme.text;
        ctx.fillText('Pre-test', leftX, topY - 15);
        ctx.fillText('Prob (%)', leftX, topY - 4);
        ctx.fillText('Likelihood', midX, topY - 15);
        ctx.fillText('Ratio', midX, topY - 4);
        ctx.fillText('Post-test', rightX, topY - 15);
        ctx.fillText('Prob (%)', rightX, topY - 4);

        // Draw lines for positive test
        var preY = probToY(fagan.preTestProb);
        var plrY = lrToY(plr);
        var postPosY = probToY(fagan.postTestProbPos);

        ctx.strokeStyle = theme.danger;
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(leftX, preY);
        ctx.lineTo(midX, plrY);
        ctx.lineTo(rightX, postPosY);
        ctx.stroke();

        // Draw line for negative test
        var nlrY = lrToY(nlr);
        var postNegY = probToY(fagan.postTestProbNeg);

        ctx.strokeStyle = theme.success;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 3]);
        ctx.beginPath();
        ctx.moveTo(leftX, preY);
        ctx.lineTo(midX, nlrY);
        ctx.lineTo(rightX, postNegY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Markers
        // Pre-test dot
        ctx.beginPath();
        ctx.arc(leftX, preY, 5, 0, 2 * Math.PI);
        ctx.fillStyle = theme.accent;
        ctx.fill();

        // Post-test positive dot
        ctx.beginPath();
        ctx.arc(rightX, postPosY, 5, 0, 2 * Math.PI);
        ctx.fillStyle = theme.danger;
        ctx.fill();

        // Post-test negative dot
        ctx.beginPath();
        ctx.arc(rightX, postNegY, 5, 0, 2 * Math.PI);
        ctx.fillStyle = theme.success;
        ctx.fill();

        // Legend
        ctx.font = '11px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillStyle = theme.danger;
        ctx.fillRect(leftX + 20, botY + 10, 16, 3);
        ctx.fillText('Test Positive: ' + (fagan.postTestProbPos * 100).toFixed(1) + '%', leftX + 40, botY + 15);
        ctx.fillStyle = theme.success;
        ctx.fillRect(leftX + 20, botY + 25, 16, 3);
        ctx.fillText('Test Negative: ' + (fagan.postTestProbNeg * 100).toFixed(1) + '%', leftX + 40, botY + 30);
    }

    // ============================================================
    // ROC CURVE
    // ============================================================
    var ROC_EXAMPLE = [
        { threshold: 0.1, sens: 0.98, spec: 0.20 },
        { threshold: 0.2, sens: 0.95, spec: 0.40 },
        { threshold: 0.3, sens: 0.90, spec: 0.58 },
        { threshold: 0.4, sens: 0.82, spec: 0.72 },
        { threshold: 0.5, sens: 0.75, spec: 0.82 },
        { threshold: 0.6, sens: 0.65, spec: 0.90 },
        { threshold: 0.7, sens: 0.50, spec: 0.95 },
        { threshold: 0.8, sens: 0.35, spec: 0.97 },
        { threshold: 0.9, sens: 0.15, spec: 0.99 }
    ];

    function renderROCTable() {
        var el = document.getElementById('da-roc-table');
        if (!el) return;

        if (rocPoints.length === 0) {
            App.setTrustedHTML(el, '<div class="text-secondary">No threshold points. Add points or load example.</div>');
            return;
        }

        var html = '<table class="data-table"><thead><tr>'
            + '<th>#</th><th>Threshold</th><th>Sensitivity</th><th>Specificity</th>'
            + '<th>1-Specificity (FPR)</th><th>Youden J</th><th></th>'
            + '</tr></thead><tbody>';

        rocPoints.forEach(function(p, i) {
            var fpr = (1 - p.spec).toFixed(3);
            var yJ = (p.sens + p.spec - 1).toFixed(3);
            html += '<tr>'
                + '<td>' + (i + 1) + '</td>'
                + '<td><input type="number" class="form-input form-input--small" step="any" value="' + p.threshold + '" onchange="DiagAccuracyModule.updateROCPoint(' + i + ',\'threshold\',this.value)"></td>'
                + '<td><input type="number" class="form-input form-input--small" step="0.01" min="0" max="1" value="' + p.sens + '" onchange="DiagAccuracyModule.updateROCPoint(' + i + ',\'sens\',this.value)"></td>'
                + '<td><input type="number" class="form-input form-input--small" step="0.01" min="0" max="1" value="' + p.spec + '" onchange="DiagAccuracyModule.updateROCPoint(' + i + ',\'spec\',this.value)"></td>'
                + '<td class="num">' + fpr + '</td>'
                + '<td class="num">' + yJ + '</td>'
                + '<td><button class="btn btn-xs btn-danger" onclick="DiagAccuracyModule.removeROCPoint(' + i + ')">x</button></td>'
                + '</tr>';
        });
        html += '</tbody></table>';
        App.setTrustedHTML(el, html);
    }

    function addROCPoint() {
        rocPoints.push({ threshold: '', sens: '', spec: '' });
        renderROCTable();
    }

    function removeROCPoint(i) {
        rocPoints.splice(i, 1);
        renderROCTable();
    }

    function updateROCPoint(i, field, value) {
        rocPoints[i][field] = value === '' ? '' : parseFloat(value);
    }

    function loadROCExample() {
        rocPoints = ROC_EXAMPLE.map(function(d) {
            return { threshold: d.threshold, sens: d.sens, spec: d.spec };
        });
        renderROCTable();
        Export.showToast('Loaded 9 ROC threshold points');
    }

    function plotROC() {
        var validPoints = rocPoints.filter(function(p) {
            return !isNaN(p.sens) && !isNaN(p.spec) && p.sens >= 0 && p.sens <= 1 && p.spec >= 0 && p.spec <= 1;
        });

        if (validPoints.length < 2) {
            Export.showToast('Need at least 2 valid threshold points', 'error');
            return;
        }

        // Add corner points for complete ROC
        var allPoints = [{ fpr: 0, tpr: 0, threshold: null }];
        validPoints.forEach(function(p) {
            allPoints.push({ fpr: 1 - p.spec, tpr: p.sens, threshold: p.threshold });
        });
        allPoints.push({ fpr: 1, tpr: 1, threshold: null });
        allPoints.sort(function(a, b) { return a.fpr - b.fpr; });

        // AUC
        var sens = validPoints.map(function(p) { return p.sens; });
        var spec = validPoints.map(function(p) { return p.spec; });
        var aucResult = Statistics.aucTrapezoidal(sens, spec);

        // Find optimal threshold (Youden's J)
        var bestJ = -1;
        var optimal = null;
        validPoints.forEach(function(p) {
            var j = p.sens + p.spec - 1;
            if (j > bestJ) {
                bestJ = j;
                optimal = { fpr: 1 - p.spec, tpr: p.sens, threshold: p.threshold, youdenJ: j };
            }
        });

        // Results HTML
        var resEl = document.getElementById('da-roc-results');
        var html = '<div class="result-panel animate-in mt-3">';
        html += '<div class="result-grid">';
        html += '<div class="result-item"><div class="result-item-value">' + aucResult.auc.toFixed(3) + '</div>'
            + '<div class="result-item-label">AUC</div></div>';
        html += '<div class="result-item"><div class="result-item-value">[' + aucResult.ci.lower.toFixed(3) + ', ' + aucResult.ci.upper.toFixed(3) + ']</div>'
            + '<div class="result-item-label">AUC 95% CI</div></div>';

        if (optimal) {
            html += '<div class="result-item"><div class="result-item-value">' + optimal.threshold + '</div>'
                + '<div class="result-item-label">Optimal Threshold (Youden)</div></div>';
            html += '<div class="result-item"><div class="result-item-value">' + optimal.youdenJ.toFixed(3) + '</div>'
                + '<div class="result-item-label">Max Youden\'s J</div></div>';
            html += '<div class="result-item"><div class="result-item-value">' + (optimal.tpr * 100).toFixed(1) + '%</div>'
                + '<div class="result-item-label">Sensitivity at Optimal</div></div>';
            html += '<div class="result-item"><div class="result-item-value">' + ((1 - optimal.fpr) * 100).toFixed(1) + '%</div>'
                + '<div class="result-item-label">Specificity at Optimal</div></div>';
        }
        html += '</div>';

        // AUC interpretation
        var aucInterp = aucResult.auc >= 0.9 ? 'excellent' : (aucResult.auc >= 0.8 ? 'good' : (aucResult.auc >= 0.7 ? 'fair' : (aucResult.auc >= 0.6 ? 'poor' : 'fail')));
        html += '<div class="text-secondary" style="margin-top:8px;">AUC interpretation: <strong>' + aucInterp + '</strong> discriminative ability.</div>';

        // ROC plot
        html += '<div class="chart-container"><canvas id="da-roc-canvas"></canvas></div>';
        html += '<div class="chart-actions">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'da-roc-canvas\'),\'roc-curve.png\')">Export PNG</button></div>';

        html += '</div>'; // result-panel

        App.setTrustedHTML(resEl, html);

        // Draw ROC
        setTimeout(function() {
            var canvas = document.getElementById('da-roc-canvas');
            if (!canvas) return;
            Charts.ROCCurve(canvas, {
                points: allPoints,
                auc: aucResult.auc,
                optimalThreshold: optimal,
                title: 'ROC Curve (AUC = ' + aucResult.auc.toFixed(3) + ')',
                width: 500,
                height: 500
            });
        }, 50);
    }

    // ============================================================
    // COMPARE TWO TESTS (McNemar)
    // ============================================================
    function compareMcNemar() {
        var a = parseInt(document.getElementById('da-mc-a').value) || 0;
        var b = parseInt(document.getElementById('da-mc-b').value) || 0;
        var c = parseInt(document.getElementById('da-mc-c').value) || 0;
        var d = parseInt(document.getElementById('da-mc-d').value) || 0;
        var n = a + b + c + d;

        if (n === 0 || (b + c) === 0) {
            Export.showToast('Enter discordant pairs (b and c must be > 0)', 'error');
            return;
        }

        var mcResult = Statistics.mcNemarTest(b, c, false);
        var mcExact = (b + c) < 25 ? Statistics.mcNemarTest(b, c, true) : null;

        // Proportions for each test
        var pTest1 = (a + b) / n;
        var pTest2 = (a + c) / n;
        var diff = pTest1 - pTest2;

        var html = '<div class="result-panel animate-in mt-3">';
        html += '<div class="card-title">McNemar\'s Test for Paired Proportions</div>';

        html += '<div class="result-grid">';
        html += '<div class="result-item"><div class="result-item-value">' + (pTest1 * 100).toFixed(1) + '%</div>'
            + '<div class="result-item-label">Test 1 Positive Rate</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + (pTest2 * 100).toFixed(1) + '%</div>'
            + '<div class="result-item-label">Test 2 Positive Rate</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + (diff * 100).toFixed(1) + '%</div>'
            + '<div class="result-item-label">Difference</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + b + ' / ' + c + '</div>'
            + '<div class="result-item-label">Discordant Pairs (b / c)</div></div>';

        if (mcResult.chi2 !== undefined) {
            html += '<div class="result-item"><div class="result-item-value">' + mcResult.chi2.toFixed(3) + '</div>'
                + '<div class="result-item-label">McNemar Chi-squared</div></div>';
        }
        html += '<div class="result-item"><div class="result-item-value">' + Statistics.formatPValue(mcResult.pValue) + '</div>'
            + '<div class="result-item-label">P-value (asymptotic)</div></div>';

        if (mcExact) {
            html += '<div class="result-item"><div class="result-item-value">' + Statistics.formatPValue(mcExact.pValue) + '</div>'
                + '<div class="result-item-label">P-value (exact binomial)</div></div>';
        }
        html += '</div>';

        // Interpretation
        var sig = mcResult.pValue < 0.05;
        html += '<div class="text-secondary" style="margin-top:8px;font-size:0.9rem;">'
            + (sig ? 'The two tests have significantly different positive rates (P ' + Statistics.formatPValue(mcResult.pValue) + '). '
                    + 'Test 1 has a ' + (diff > 0 ? 'higher' : 'lower') + ' positive rate by ' + Math.abs(diff * 100).toFixed(1) + ' percentage points.'
                 : 'There is no significant difference between the two tests\' positive rates (P ' + Statistics.formatPValue(mcResult.pValue) + ').')
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('da-compare-results'), html);
    }

    // ============================================================
    // REGISTER MODULE
    // ============================================================
    App.registerModule(MODULE_ID, {
        render: render,
        onThemeChange: function() {
            // Redraw nomogram if visible
            var canvas = document.getElementById('da-nomogram-canvas');
            if (canvas && canvas.offsetParent !== null) {
                setTimeout(function() { updateNomogram(); }, 50);
            }
        }
    });

    window.DiagAccuracyModule = {
        switchTab: switchTab,
        calculate: calculate,
        copyDiagResults: copyDiagResults,
        updateNomogram: updateNomogram,
        addROCPoint: addROCPoint,
        removeROCPoint: removeROCPoint,
        updateROCPoint: updateROCPoint,
        loadROCExample: loadROCExample,
        plotROC: plotROC,
        compareMcNemar: compareMcNemar
    };
})();
