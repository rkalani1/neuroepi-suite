/**
 * Neuro-Epi — Results Interpreter Module
 * Paste statistical results and get plain-English interpretation.
 * P-values, confidence intervals, effect sizes, regression output, and quick reference.
 */
(function() {
    'use strict';

    const MODULE_ID = 'results-interpreter';

    // ================================================================
    // RENDER
    // ================================================================
    function render(container) {
        var html = App.createModuleLayout(
            'Results Interpreter',
            'Paste statistical results and get plain-English interpretation. Covers p-values, confidence intervals, effect sizes, regression output, and common statistics.'
        );

        // Card 1: P-value Interpreter
        html += renderPValue();

        // Card 2: Confidence Interval Interpreter
        html += renderCI();

        // Card 3: Effect Size Interpreter
        html += renderEffectSize();

        // Card 4: Regression Output Interpreter
        html += renderRegression();

        // Card 5: Quick Reference Cards
        html += renderQuickReference();

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);
    }

    // ================================================================
    // CARD 1: P-value Interpreter
    // ================================================================
    function renderPValue() {
        var html = '<div class="card">';
        html += '<div class="card-title">P-value Interpreter</div>';
        html += '<div class="card-subtitle">Enter a p-value and get a plain-English interpretation with context about what it does and does not mean.</div>';

        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">P-value</label>'
            + '<input type="number" class="form-input" id="pv-value" name="pv-value" min="0" max="1" step="0.001" value="0.03"></div>';
        html += '<div class="form-group"><label class="form-label">Alpha Level</label>'
            + '<input type="number" class="form-input" id="pv-alpha" name="pv-alpha" min="0.001" max="0.5" step="0.01" value="0.05"></div>';
        html += '<div class="form-group"><label class="form-label">Test Type</label>'
            + '<select class="form-select" id="pv-type" name="pv-type">'
            + '<option value="two-sided">Two-sided</option>'
            + '<option value="one-sided">One-sided</option>'
            + '</select></div>';
        html += '</div>';

        html += '<div class="btn-group">'
            + '<button class="btn btn-primary" onclick="ResultsInterp.interpretPValue()">Interpret</button>'
            + '<button class="btn btn-secondary" onclick="ResultsInterp.copyPValue()">Copy</button>'
            + '</div>';

        html += '<div id="pv-results"></div>';
        html += '</div>';
        return html;
    }

    function interpretPValue() {
        var p = parseFloat(document.getElementById('pv-value').value);
        var alpha = parseFloat(document.getElementById('pv-alpha').value);
        var testType = document.getElementById('pv-type').value;

        if (isNaN(p) || isNaN(alpha)) return;

        var significant = p < alpha;
        var pDisplay = p < 0.001 ? '< 0.001' : p.toFixed(4);

        var html = '<div class="result-panel mt-2">';
        html += '<div class="card-title">P-value Interpretation</div>';

        // Plain English
        html += '<div style="border-left:4px solid var(--primary);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Plain English</div>';
        html += '<div style="font-size:0.95rem;line-height:1.6;">';
        html += 'The probability of observing data this extreme or more extreme, <em>assuming the null hypothesis is true</em>, is <strong>'
            + pDisplay + '</strong>.';
        if (testType === 'two-sided') {
            html += ' This is a two-sided test, so it considers deviations in either direction.';
        } else {
            html += ' This is a one-sided test, so it only considers deviations in one direction.';
        }
        html += '</div></div>';

        // Statistical conclusion
        html += '<div style="border-left:4px solid ' + (significant ? 'var(--success)' : 'var(--warning)') + ';padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Statistical Conclusion</div>';
        html += '<div style="font-size:0.95rem;line-height:1.6;">';
        if (significant) {
            html += 'At alpha = ' + alpha + ', this result is <strong style="color:var(--success);">statistically significant</strong>. '
                + 'We reject the null hypothesis (p = ' + pDisplay + ' < ' + alpha + ').';
        } else {
            html += 'At alpha = ' + alpha + ', this result is <strong style="color:var(--warning);">not statistically significant</strong>. '
                + 'We fail to reject the null hypothesis (p = ' + pDisplay + ' >= ' + alpha + ').';
        }
        html += '</div></div>';

        // Context
        html += '<div style="border-left:4px solid var(--warning);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Important Context</div>';
        html += '<div style="font-size:0.95rem;line-height:1.6;">';
        html += '<strong>Statistical significance does not imply clinical significance.</strong> '
            + 'A very large study can detect trivially small differences as "statistically significant." '
            + 'Always consider the effect size and clinical relevance alongside the p-value.';
        if (!significant) {
            html += '<br><br><strong>Absence of evidence is not evidence of absence.</strong> '
                + 'A non-significant p-value does not prove the null hypothesis is true. The study may have been underpowered (insufficient sample size) to detect a meaningful effect.';
        }
        html += '</div></div>';

        // Strength of evidence
        html += '<div style="border-left:4px solid var(--text-tertiary);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Strength of Evidence (informal)</div>';
        html += '<div style="font-size:0.95rem;">';
        if (p < 0.001) html += 'p < 0.001: Very strong evidence against the null hypothesis.';
        else if (p < 0.01) html += 'p < 0.01: Strong evidence against the null hypothesis.';
        else if (p < 0.05) html += 'p < 0.05: Moderate evidence against the null hypothesis.';
        else if (p < 0.10) html += 'p < 0.10: Weak evidence against the null hypothesis (sometimes considered "marginal" or "trending").';
        else html += 'p >= 0.10: Little to no evidence against the null hypothesis.';
        html += '</div></div>';

        // Common misinterpretations
        html += '<div style="border:1px solid var(--danger);border-radius:8px;padding:16px;margin-top:16px;">';
        html += '<div style="font-weight:700;color:var(--danger);margin-bottom:8px;">Common Misinterpretations to Avoid</div>';
        html += '<div style="font-size:0.85rem;line-height:1.7;">';
        html += '<ul style="margin-left:16px;">';
        html += '<li><strong>Wrong:</strong> "There is a ' + (p * 100).toFixed(1) + '% probability that the null hypothesis is true."<br>'
            + '<strong>Correct:</strong> The p-value is the probability of the data (or more extreme data) given the null is true, not the probability of the null being true.</li>';
        html += '<li style="margin-top:8px;"><strong>Wrong:</strong> "The result is ' + (significant ? '' : 'not ') + 'significant, so the effect is ' + (significant ? 'real.' : 'zero."') + '<br>'
            + '<strong>Correct:</strong> P-values are continuous measures of evidence. The 0.05 threshold is arbitrary. A p-value of 0.049 is not meaningfully different from 0.051.</li>';
        html += '<li style="margin-top:8px;"><strong>Wrong:</strong> "The p-value tells us the size of the effect."<br>'
            + '<strong>Correct:</strong> P-values conflate effect size and sample size. A tiny effect with a large N can yield a small p-value.</li>';
        html += '<li style="margin-top:8px;"><strong>Wrong:</strong> "A significant p-value means the study is well-designed."<br>'
            + '<strong>Correct:</strong> A biased study can produce a significant p-value. Significance does not validate the methodology.</li>';
        html += '</ul></div></div>';

        html += '</div>';
        App.setTrustedHTML(document.getElementById('pv-results'), html);
    }

    function copyPValue() {
        var el = document.getElementById('pv-results');
        if (el) Export.copyText(el.textContent);
    }

    // ================================================================
    // CARD 2: Confidence Interval Interpreter
    // ================================================================
    function renderCI() {
        var html = '<div class="card">';
        html += '<div class="card-title">Confidence Interval Interpreter</div>';
        html += '<div class="card-subtitle">Enter a point estimate with its confidence interval for a plain-English interpretation.</div>';

        html += '<div class="form-row form-row--4">';
        html += '<div class="form-group"><label class="form-label">Point Estimate</label>'
            + '<input type="number" class="form-input" id="ci-point" name="ci-point" step="0.01" value="1.85"></div>';
        html += '<div class="form-group"><label class="form-label">Lower Bound</label>'
            + '<input type="number" class="form-input" id="ci-lower" name="ci-lower" step="0.01" value="1.20"></div>';
        html += '<div class="form-group"><label class="form-label">Upper Bound</label>'
            + '<input type="number" class="form-input" id="ci-upper" name="ci-upper" step="0.01" value="2.85"></div>';
        html += '<div class="form-group"><label class="form-label">Confidence Level (%)</label>'
            + '<input type="number" class="form-input" id="ci-level" name="ci-level" step="1" min="80" max="99" value="95"></div>';
        html += '</div>';

        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Type of Measure</label>'
            + '<select class="form-select" id="ci-measure" name="ci-measure">'
            + '<option value="mean_diff">Mean Difference</option>'
            + '<option value="rr" selected>Risk Ratio (RR)</option>'
            + '<option value="or">Odds Ratio (OR)</option>'
            + '<option value="hr">Hazard Ratio (HR)</option>'
            + '<option value="rd">Risk Difference</option>'
            + '<option value="correlation">Correlation (r)</option>'
            + '</select></div>';
        html += '<div class="form-group"><label class="form-label">MCID (optional, for clinical significance)</label>'
            + '<input type="number" class="form-input" id="ci-mcid" name="ci-mcid" step="0.01" placeholder="e.g., 1.5 for RR or 5 for mean diff"></div>';
        html += '</div>';

        html += '<div class="btn-group">'
            + '<button class="btn btn-primary" onclick="ResultsInterp.interpretCI()">Interpret</button>'
            + '<button class="btn btn-secondary" onclick="ResultsInterp.copyCI()">Copy</button>'
            + '</div>';

        html += '<div id="ci-results"></div>';
        html += '</div>';
        return html;
    }

    function interpretCI() {
        var point = parseFloat(document.getElementById('ci-point').value);
        var lower = parseFloat(document.getElementById('ci-lower').value);
        var upper = parseFloat(document.getElementById('ci-upper').value);
        var level = parseFloat(document.getElementById('ci-level').value);
        var measure = document.getElementById('ci-measure').value;
        var mcid = parseFloat(document.getElementById('ci-mcid').value);

        if (isNaN(point) || isNaN(lower) || isNaN(upper)) return;

        var width = upper - lower;
        var nullValue = (measure === 'mean_diff' || measure === 'rd' || measure === 'correlation') ? 0 : 1;
        var nullLabel = nullValue === 0 ? '0' : '1';
        var excludesNull = (lower > nullValue) || (upper < nullValue);

        var measureLabel = {
            'mean_diff': 'mean difference',
            'rr': 'risk ratio',
            'or': 'odds ratio',
            'hr': 'hazard ratio',
            'rd': 'risk difference',
            'correlation': 'correlation coefficient'
        }[measure] || measure;

        var html = '<div class="result-panel mt-2">';
        html += '<div class="card-title">Confidence Interval Interpretation</div>';

        // Plain English
        html += '<div style="border-left:4px solid var(--primary);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Plain English</div>';
        html += '<div style="font-size:0.95rem;line-height:1.6;">';
        html += 'The ' + measureLabel + ' is <strong>' + point.toFixed(2) + '</strong> (' + level + '% CI: ' + lower.toFixed(2) + ' to ' + upper.toFixed(2) + '). ';
        html += 'We are ' + level + '% confident that the true ' + measureLabel + ' in the population lies between ' + lower.toFixed(2) + ' and ' + upper.toFixed(2) + '. ';
        html += 'If this study were repeated many times, ' + level + '% of the computed confidence intervals would contain the true value.';
        html += '</div></div>';

        // Null value assessment
        html += '<div style="border-left:4px solid ' + (excludesNull ? 'var(--success)' : 'var(--warning)') + ';padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Null Value Assessment</div>';
        html += '<div style="font-size:0.95rem;line-height:1.6;">';
        if (excludesNull) {
            html += 'The ' + level + '% CI <strong style="color:var(--success);">excludes the null value (' + nullLabel + ')</strong>. '
                + 'This is consistent with statistical significance at alpha = ' + (1 - level / 100).toFixed(2) + '. ';
            if (measure === 'rr' || measure === 'or' || measure === 'hr') {
                if (lower > 1) {
                    html += 'The entire CI is above 1, suggesting an <strong>increased risk</strong> (harmful association).';
                } else if (upper < 1) {
                    html += 'The entire CI is below 1, suggesting a <strong>decreased risk</strong> (protective association).';
                }
            } else if (measure === 'mean_diff' || measure === 'rd') {
                if (lower > 0) {
                    html += 'The entire CI is above 0, suggesting a <strong>positive effect</strong>.';
                } else if (upper < 0) {
                    html += 'The entire CI is below 0, suggesting a <strong>negative effect</strong>.';
                }
            }
        } else {
            html += 'The ' + level + '% CI <strong style="color:var(--warning);">includes the null value (' + nullLabel + ')</strong>. '
                + 'This is consistent with the result not being statistically significant at alpha = ' + (1 - level / 100).toFixed(2) + '. '
                + 'However, the point estimate of ' + point.toFixed(2) + ' may still be clinically meaningful.';
        }
        html += '</div></div>';

        // Precision
        html += '<div style="border-left:4px solid var(--text-tertiary);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Precision Assessment</div>';
        html += '<div style="font-size:0.95rem;line-height:1.6;">';
        html += 'CI width: ' + width.toFixed(2) + '. ';
        if (measure === 'rr' || measure === 'or' || measure === 'hr') {
            var ratio = upper / lower;
            if (ratio < 2) html += 'The CI is relatively <strong>narrow</strong>, indicating good precision.';
            else if (ratio < 4) html += 'The CI is <strong>moderately wide</strong>. The estimate has moderate precision.';
            else html += 'The CI is <strong>wide</strong>, indicating substantial uncertainty in the estimate. Consider whether the study had adequate sample size.';
        } else {
            if (width < Math.abs(point) * 0.5) html += 'The CI is relatively <strong>narrow</strong> relative to the point estimate, indicating good precision.';
            else if (width < Math.abs(point) * 1.5) html += 'The CI is <strong>moderately wide</strong> relative to the point estimate.';
            else html += 'The CI is <strong>wide</strong> relative to the point estimate, indicating substantial uncertainty.';
        }
        html += '</div></div>';

        // Clinical significance (if MCID provided)
        if (!isNaN(mcid)) {
            html += '<div style="border-left:4px solid var(--success);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
            html += '<div style="font-weight:600;margin-bottom:4px;">Clinical Significance</div>';
            html += '<div style="font-size:0.95rem;line-height:1.6;">';
            html += 'Minimum clinically important difference (MCID): <strong>' + mcid + '</strong>. ';
            if (measure === 'rr' || measure === 'or' || measure === 'hr') {
                if (lower >= mcid) {
                    html += 'The entire CI exceeds the MCID. The result is likely <strong>clinically significant</strong>.';
                } else if (point >= mcid) {
                    html += 'The point estimate exceeds the MCID, but the lower bound (' + lower.toFixed(2) + ') does not. '
                        + 'Clinical significance is <strong>possible but uncertain</strong>.';
                } else {
                    html += 'The point estimate is below the MCID. The result is unlikely to be <strong>clinically significant</strong>.';
                }
            } else {
                if (lower >= mcid || (mcid < 0 && upper <= mcid)) {
                    html += 'The entire CI exceeds the MCID. The result is likely <strong>clinically significant</strong>.';
                } else if (Math.abs(point) >= Math.abs(mcid)) {
                    html += 'The point estimate exceeds the MCID, but the CI includes values below the MCID. '
                        + 'Clinical significance is <strong>possible but uncertain</strong>.';
                } else {
                    html += 'The point estimate does not reach the MCID. The result may not be <strong>clinically significant</strong>.';
                }
            }
            html += '</div></div>';
        }

        html += '</div>';
        App.setTrustedHTML(document.getElementById('ci-results'), html);
    }

    function copyCI() {
        var el = document.getElementById('ci-results');
        if (el) Export.copyText(el.textContent);
    }

    // ================================================================
    // CARD 3: Effect Size Interpreter
    // ================================================================
    function renderEffectSize() {
        var html = '<div class="card">';
        html += '<div class="card-title">Effect Size Interpreter</div>';
        html += '<div class="card-subtitle">Enter an effect size and its type for a plain-English interpretation with magnitude classification.</div>';

        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Effect Size Value</label>'
            + '<input type="number" class="form-input" id="es-value" name="es-value" step="0.01" value="0.50"></div>';
        html += '<div class="form-group"><label class="form-label">Effect Size Type</label>'
            + '<select class="form-select" id="es-type" name="es-type" onchange="ResultsInterp.updateESLabels()">'
            + '<option value="cohens_d" selected>Cohen\'s d</option>'
            + '<option value="or">Odds Ratio</option>'
            + '<option value="rr">Risk Ratio</option>'
            + '<option value="hr">Hazard Ratio</option>'
            + '<option value="r2">R-squared</option>'
            + '<option value="r">Correlation (r)</option>'
            + '<option value="nnt">Number Needed to Treat (NNT)</option>'
            + '<option value="rd">Risk Difference</option>'
            + '</select></div>';
        html += '</div>';

        html += '<div class="btn-group">'
            + '<button class="btn btn-primary" onclick="ResultsInterp.interpretES()">Interpret</button>'
            + '<button class="btn btn-secondary" onclick="ResultsInterp.copyES()">Copy</button>'
            + '</div>';

        html += '<div id="es-results"></div>';
        html += '</div>';
        return html;
    }

    function updateESLabels() {
        // placeholder for future dynamic label updates
    }

    function interpretES() {
        var value = parseFloat(document.getElementById('es-value').value);
        var type = document.getElementById('es-type').value;
        if (isNaN(value)) return;

        var magnitude = '';
        var plainEnglish = '';
        var benchmark = '';
        var barWidth = 0;
        var barColor = '';

        switch (type) {
            case 'cohens_d':
                var absD = Math.abs(value);
                if (absD < 0.2) { magnitude = 'Negligible'; barWidth = 10; barColor = 'var(--text-tertiary)'; }
                else if (absD < 0.5) { magnitude = 'Small'; barWidth = 25; barColor = 'var(--warning)'; }
                else if (absD < 0.8) { magnitude = 'Medium'; barWidth = 50; barColor = 'var(--primary)'; }
                else if (absD < 1.2) { magnitude = 'Large'; barWidth = 75; barColor = 'var(--success)'; }
                else { magnitude = 'Very Large'; barWidth = 95; barColor = 'var(--danger)'; }
                plainEnglish = 'A Cohen\'s d of ' + value.toFixed(2) + ' means the treatment group scored ' + Math.abs(value).toFixed(2)
                    + ' standard deviations ' + (value > 0 ? 'higher' : 'lower') + ' than the control group.';
                benchmark = 'Cohen (1988): Small = 0.2, Medium = 0.5, Large = 0.8. '
                    + 'In stroke rehabilitation: d = 0.2 may represent a meaningful clinical change.';
                break;

            case 'or':
                if (value >= 0.8 && value <= 1.25) { magnitude = 'Negligible'; barWidth = 10; barColor = 'var(--text-tertiary)'; }
                else if ((value > 1.25 && value <= 2) || (value >= 0.5 && value < 0.8)) { magnitude = 'Small'; barWidth = 25; barColor = 'var(--warning)'; }
                else if ((value > 2 && value <= 4) || (value >= 0.25 && value < 0.5)) { magnitude = 'Medium'; barWidth = 50; barColor = 'var(--primary)'; }
                else { magnitude = 'Large'; barWidth = 75; barColor = 'var(--success)'; }
                if (value > 1) {
                    plainEnglish = 'An odds ratio of ' + value.toFixed(2) + ' means the odds of the outcome are '
                        + value.toFixed(2) + ' times higher in the exposed/treatment group compared to the reference group.';
                } else if (value < 1) {
                    plainEnglish = 'An odds ratio of ' + value.toFixed(2) + ' means the odds of the outcome are '
                        + ((1 - value) * 100).toFixed(0) + '% lower in the exposed/treatment group (protective).';
                } else {
                    plainEnglish = 'An odds ratio of 1.00 means no difference in odds between groups.';
                }
                benchmark = 'Chen et al. (2010): OR 1.5 ~ d=0.2 (small), OR 2.5 ~ d=0.5 (medium), OR 4.3 ~ d=0.8 (large). '
                    + 'In stroke: OR > 2 for major risk factors is common.';
                break;

            case 'rr':
                if (value >= 0.9 && value <= 1.1) { magnitude = 'Negligible'; barWidth = 10; barColor = 'var(--text-tertiary)'; }
                else if ((value > 1.1 && value <= 1.5) || (value >= 0.67 && value < 0.9)) { magnitude = 'Small'; barWidth = 25; barColor = 'var(--warning)'; }
                else if ((value > 1.5 && value <= 3) || (value >= 0.33 && value < 0.67)) { magnitude = 'Medium'; barWidth = 50; barColor = 'var(--primary)'; }
                else { magnitude = 'Large'; barWidth = 75; barColor = 'var(--success)'; }
                if (value > 1) {
                    plainEnglish = 'A risk ratio of ' + value.toFixed(2) + ' means the exposed group has '
                        + value.toFixed(2) + ' times the risk compared to the unexposed group (a '
                        + ((value - 1) * 100).toFixed(0) + '% increased risk).';
                } else if (value < 1) {
                    plainEnglish = 'A risk ratio of ' + value.toFixed(2) + ' means the exposed group has '
                        + ((1 - value) * 100).toFixed(0) + '% lower risk compared to the unexposed group (protective).';
                } else {
                    plainEnglish = 'A risk ratio of 1.00 means no difference in risk between groups.';
                }
                benchmark = 'In stroke epidemiology: RR 1.5-2.0 for modifiable risk factors is common. '
                    + 'RR > 3 is considered strong (e.g., atrial fibrillation and stroke).';
                break;

            case 'hr':
                if (value >= 0.9 && value <= 1.1) { magnitude = 'Negligible'; barWidth = 10; barColor = 'var(--text-tertiary)'; }
                else if ((value > 1.1 && value <= 1.5) || (value >= 0.67 && value < 0.9)) { magnitude = 'Small'; barWidth = 25; barColor = 'var(--warning)'; }
                else if ((value > 1.5 && value <= 3) || (value >= 0.33 && value < 0.67)) { magnitude = 'Medium'; barWidth = 50; barColor = 'var(--primary)'; }
                else { magnitude = 'Large'; barWidth = 75; barColor = 'var(--success)'; }
                if (value > 1) {
                    plainEnglish = 'A hazard ratio of ' + value.toFixed(2) + ' means the event rate is '
                        + value.toFixed(2) + ' times higher in the treatment/exposed group at any given time point. '
                        + 'The risk of the event is ' + ((value - 1) * 100).toFixed(0) + '% higher.';
                } else if (value < 1) {
                    plainEnglish = 'A hazard ratio of ' + value.toFixed(2) + ' means the event rate is '
                        + ((1 - value) * 100).toFixed(0) + '% lower in the treatment/exposed group at any given time point (protective).';
                } else {
                    plainEnglish = 'A hazard ratio of 1.00 means no difference in event rates between groups.';
                }
                benchmark = 'Interpreted similarly to RR in the context of time-to-event analyses. '
                    + 'HR assumes proportional hazards (constant ratio over time).';
                break;

            case 'r2':
                if (value < 0.02) { magnitude = 'Negligible'; barWidth = 5; barColor = 'var(--text-tertiary)'; }
                else if (value < 0.13) { magnitude = 'Small'; barWidth = 25; barColor = 'var(--warning)'; }
                else if (value < 0.26) { magnitude = 'Medium'; barWidth = 50; barColor = 'var(--primary)'; }
                else { magnitude = 'Large'; barWidth = 75; barColor = 'var(--success)'; }
                plainEnglish = 'An R-squared of ' + value.toFixed(3) + ' means that ' + (value * 100).toFixed(1)
                    + '% of the variance in the outcome is explained by the predictor(s) in the model.';
                benchmark = 'Cohen (1988): Small = 0.02, Medium = 0.13, Large = 0.26. '
                    + 'In clinical research, R-squared values of 0.20-0.40 are often considered meaningful.';
                break;

            case 'r':
                var absR = Math.abs(value);
                if (absR < 0.1) { magnitude = 'Negligible'; barWidth = 5; barColor = 'var(--text-tertiary)'; }
                else if (absR < 0.3) { magnitude = 'Small'; barWidth = 25; barColor = 'var(--warning)'; }
                else if (absR < 0.5) { magnitude = 'Medium'; barWidth = 50; barColor = 'var(--primary)'; }
                else { magnitude = 'Large'; barWidth = 75; barColor = 'var(--success)'; }
                plainEnglish = 'A correlation of ' + value.toFixed(2) + ' indicates a ' + magnitude.toLowerCase()
                    + ' ' + (value >= 0 ? 'positive' : 'negative') + ' linear relationship. '
                    + 'It explains ' + (value * value * 100).toFixed(1) + '% of the variance (r-squared = ' + (value * value).toFixed(3) + ').';
                benchmark = 'Cohen (1988): Small = 0.10, Medium = 0.30, Large = 0.50. '
                    + 'In clinical correlations: r > 0.70 often needed for measurement agreement.';
                break;

            case 'nnt':
                var absNNT = Math.abs(value);
                if (absNNT <= 5) { magnitude = 'Very effective'; barWidth = 90; barColor = 'var(--success)'; }
                else if (absNNT <= 20) { magnitude = 'Moderately effective'; barWidth = 60; barColor = 'var(--primary)'; }
                else if (absNNT <= 50) { magnitude = 'Somewhat effective'; barWidth = 35; barColor = 'var(--warning)'; }
                else { magnitude = 'Minimally effective'; barWidth = 15; barColor = 'var(--danger)'; }
                plainEnglish = 'An NNT of ' + Math.round(absNNT) + ' means you need to treat ' + Math.round(absNNT)
                    + ' patients with the intervention to prevent 1 additional adverse outcome compared to the control.';
                benchmark = 'Context-dependent. Stroke thrombolysis NNT ~ 7-8 for good outcome. '
                    + 'Statin primary prevention NNT ~ 50-100 over 5 years.';
                break;

            case 'rd':
                var absRD = Math.abs(value);
                if (absRD < 0.01) { magnitude = 'Negligible'; barWidth = 5; barColor = 'var(--text-tertiary)'; }
                else if (absRD < 0.05) { magnitude = 'Small'; barWidth = 25; barColor = 'var(--warning)'; }
                else if (absRD < 0.15) { magnitude = 'Medium'; barWidth = 50; barColor = 'var(--primary)'; }
                else { magnitude = 'Large'; barWidth = 75; barColor = 'var(--success)'; }
                plainEnglish = 'A risk difference of ' + value.toFixed(3) + ' (' + (value * 100).toFixed(1) + ' percentage points) means '
                    + (value > 0 ? 'the exposed group has an absolute ' + (value * 100).toFixed(1) + ' percentage point higher risk.'
                    : 'the exposed group has an absolute ' + (Math.abs(value) * 100).toFixed(1) + ' percentage point lower risk.');
                benchmark = 'Absolute measures are essential for clinical decision-making. '
                    + 'NNT = 1 / |RD|. A RD of 0.05 corresponds to an NNT of 20.';
                break;
        }

        var html = '<div class="result-panel mt-2">';
        html += '<div class="card-title">Effect Size Interpretation</div>';

        // Magnitude badge
        html += '<div style="text-align:center;margin-bottom:16px;">';
        html += '<div style="display:inline-block;padding:8px 24px;border-radius:20px;font-weight:700;font-size:1.1rem;'
            + 'background:' + barColor + ';color:white;">' + magnitude + '</div>';
        html += '</div>';

        // Bar chart visualization
        html += '<div style="margin-bottom:16px;padding:0 20px;">';
        html += '<div style="background:var(--bg-tertiary);border-radius:8px;height:32px;overflow:hidden;position:relative;">';
        html += '<div style="background:' + barColor + ';height:100%;width:' + barWidth + '%;border-radius:8px;transition:width 0.5s;"></div>';
        html += '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-weight:600;font-size:0.85rem;">'
            + type.replace('_', ' ').toUpperCase() + ' = ' + value.toFixed(2) + '</div>';
        html += '</div>';
        html += '<div style="display:flex;justify-content:space-between;font-size:0.75rem;color:var(--text-tertiary);margin-top:4px;">'
            + '<span>Negligible</span><span>Small</span><span>Medium</span><span>Large</span></div>';
        html += '</div>';

        // Plain English
        html += '<div style="border-left:4px solid var(--primary);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Plain English</div>';
        html += '<div style="font-size:0.95rem;line-height:1.6;">' + plainEnglish + '</div>';
        html += '</div>';

        // Benchmarks
        html += '<div style="border-left:4px solid var(--text-tertiary);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Context & Benchmarks</div>';
        html += '<div style="font-size:0.9rem;line-height:1.6;">' + benchmark + '</div>';
        html += '</div>';

        html += '</div>';
        App.setTrustedHTML(document.getElementById('es-results'), html);
    }

    function copyES() {
        var el = document.getElementById('es-results');
        if (el) Export.copyText(el.textContent);
    }

    // ================================================================
    // CARD 4: Regression Output Interpreter
    // ================================================================
    function renderRegression() {
        var html = '<div class="card">';
        html += '<div class="card-title">Regression Output Interpreter</div>';
        html += '<div class="card-subtitle">Enter regression coefficients and get a plain-English interpretation.</div>';

        html += '<div class="form-group"><label class="form-label">Regression Type</label>'
            + '<select class="form-select" id="reg-type" name="reg-type" onchange="ResultsInterp.updateRegFields()">'
            + '<option value="linear">Linear Regression</option>'
            + '<option value="logistic">Logistic Regression</option>'
            + '<option value="cox">Cox Proportional Hazards</option>'
            + '<option value="poisson">Poisson Regression</option>'
            + '</select></div>';

        // Linear regression fields
        html += '<div id="reg-fields-linear">';
        html += '<div class="form-row form-row--4">';
        html += '<div class="form-group"><label class="form-label">Coefficient (B)</label>'
            + '<input type="number" class="form-input" id="reg-lin-coef" step="0.01" value="2.50"></div>';
        html += '<div class="form-group"><label class="form-label">Std Error (SE)</label>'
            + '<input type="number" class="form-input" id="reg-lin-se" step="0.01" value="0.80"></div>';
        html += '<div class="form-group"><label class="form-label">t-statistic</label>'
            + '<input type="number" class="form-input" id="reg-lin-t" step="0.01" value="3.13"></div>';
        html += '<div class="form-group"><label class="form-label">P-value</label>'
            + '<input type="number" class="form-input" id="reg-lin-p" step="0.001" value="0.002"></div>';
        html += '</div>';
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">R-squared</label>'
            + '<input type="number" class="form-input" id="reg-lin-r2" step="0.01" min="0" max="1" value="0.35"></div>';
        html += '<div class="form-group"><label class="form-label">Predictor Name</label>'
            + '<input type="text" class="form-input" id="reg-lin-pred" value="Age"></div>';
        html += '<div class="form-group"><label class="form-label">Outcome Name</label>'
            + '<input type="text" class="form-input" id="reg-lin-out" value="NIHSS score"></div>';
        html += '</div>';
        html += '</div>';

        // Logistic regression fields
        html += '<div id="reg-fields-logistic" class="hidden">';
        html += '<div class="form-row form-row--4">';
        html += '<div class="form-group"><label class="form-label">Coefficient (log-OR)</label>'
            + '<input type="number" class="form-input" id="reg-log-coef" step="0.01" value="0.65"></div>';
        html += '<div class="form-group"><label class="form-label">Std Error (SE)</label>'
            + '<input type="number" class="form-input" id="reg-log-se" step="0.01" value="0.20"></div>';
        html += '<div class="form-group"><label class="form-label">OR</label>'
            + '<input type="number" class="form-input" id="reg-log-or" step="0.01" value="1.92"></div>';
        html += '<div class="form-group"><label class="form-label">P-value</label>'
            + '<input type="number" class="form-input" id="reg-log-p" step="0.001" value="0.001"></div>';
        html += '</div>';
        html += '<div class="form-row form-row--4">';
        html += '<div class="form-group"><label class="form-label">95% CI Lower</label>'
            + '<input type="number" class="form-input" id="reg-log-ci-lo" step="0.01" value="1.30"></div>';
        html += '<div class="form-group"><label class="form-label">95% CI Upper</label>'
            + '<input type="number" class="form-input" id="reg-log-ci-hi" step="0.01" value="2.83"></div>';
        html += '<div class="form-group"><label class="form-label">Predictor Name</label>'
            + '<input type="text" class="form-input" id="reg-log-pred" value="Hypertension"></div>';
        html += '<div class="form-group"><label class="form-label">Outcome Name</label>'
            + '<input type="text" class="form-input" id="reg-log-out" value="Stroke"></div>';
        html += '</div>';
        html += '</div>';

        // Cox regression fields
        html += '<div id="reg-fields-cox" class="hidden">';
        html += '<div class="form-row form-row--4">';
        html += '<div class="form-group"><label class="form-label">Coefficient (log-HR)</label>'
            + '<input type="number" class="form-input" id="reg-cox-coef" step="0.01" value="0.47"></div>';
        html += '<div class="form-group"><label class="form-label">Std Error (SE)</label>'
            + '<input type="number" class="form-input" id="reg-cox-se" step="0.01" value="0.15"></div>';
        html += '<div class="form-group"><label class="form-label">HR</label>'
            + '<input type="number" class="form-input" id="reg-cox-hr" step="0.01" value="1.60"></div>';
        html += '<div class="form-group"><label class="form-label">P-value</label>'
            + '<input type="number" class="form-input" id="reg-cox-p" step="0.001" value="0.002"></div>';
        html += '</div>';
        html += '<div class="form-row form-row--4">';
        html += '<div class="form-group"><label class="form-label">95% CI Lower</label>'
            + '<input type="number" class="form-input" id="reg-cox-ci-lo" step="0.01" value="1.19"></div>';
        html += '<div class="form-group"><label class="form-label">95% CI Upper</label>'
            + '<input type="number" class="form-input" id="reg-cox-ci-hi" step="0.01" value="2.15"></div>';
        html += '<div class="form-group"><label class="form-label">Predictor Name</label>'
            + '<input type="text" class="form-input" id="reg-cox-pred" value="Diabetes"></div>';
        html += '<div class="form-group"><label class="form-label">Outcome Name</label>'
            + '<input type="text" class="form-input" id="reg-cox-out" value="Mortality"></div>';
        html += '</div>';
        html += '</div>';

        // Poisson regression fields
        html += '<div id="reg-fields-poisson" class="hidden">';
        html += '<div class="form-row form-row--4">';
        html += '<div class="form-group"><label class="form-label">Coefficient (log-IRR)</label>'
            + '<input type="number" class="form-input" id="reg-poi-coef" step="0.01" value="0.30"></div>';
        html += '<div class="form-group"><label class="form-label">Std Error (SE)</label>'
            + '<input type="number" class="form-input" id="reg-poi-se" step="0.01" value="0.10"></div>';
        html += '<div class="form-group"><label class="form-label">IRR</label>'
            + '<input type="number" class="form-input" id="reg-poi-irr" step="0.01" value="1.35"></div>';
        html += '<div class="form-group"><label class="form-label">P-value</label>'
            + '<input type="number" class="form-input" id="reg-poi-p" step="0.001" value="0.003"></div>';
        html += '</div>';
        html += '<div class="form-row form-row--4">';
        html += '<div class="form-group"><label class="form-label">95% CI Lower</label>'
            + '<input type="number" class="form-input" id="reg-poi-ci-lo" step="0.01" value="1.11"></div>';
        html += '<div class="form-group"><label class="form-label">95% CI Upper</label>'
            + '<input type="number" class="form-input" id="reg-poi-ci-hi" step="0.01" value="1.64"></div>';
        html += '<div class="form-group"><label class="form-label">Predictor Name</label>'
            + '<input type="text" class="form-input" id="reg-poi-pred" value="Smoking"></div>';
        html += '<div class="form-group"><label class="form-label">Outcome Name</label>'
            + '<input type="text" class="form-input" id="reg-poi-out" value="Seizure episodes"></div>';
        html += '</div>';
        html += '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="ResultsInterp.interpretReg()">Interpret</button>'
            + '<button class="btn btn-secondary" onclick="ResultsInterp.copyReg()">Copy</button>'
            + '</div>';

        html += '<div id="reg-results"></div>';
        html += '</div>';
        return html;
    }

    function updateRegFields() {
        var type = document.getElementById('reg-type').value;
        var types = ['linear', 'logistic', 'cox', 'poisson'];
        for (var i = 0; i < types.length; i++) {
            var el = document.getElementById('reg-fields-' + types[i]);
            if (el) {
                if (types[i] === type) {
                    el.classList.remove('hidden');
                } else {
                    el.classList.add('hidden');
                }
            }
        }
    }

    function interpretReg() {
        var type = document.getElementById('reg-type').value;
        var html = '';

        if (type === 'linear') {
            html = interpretLinearReg();
        } else if (type === 'logistic') {
            html = interpretLogisticReg();
        } else if (type === 'cox') {
            html = interpretCoxReg();
        } else if (type === 'poisson') {
            html = interpretPoissonReg();
        }

        App.setTrustedHTML(document.getElementById('reg-results'), html);
    }

    function interpretLinearReg() {
        var coef = parseFloat(document.getElementById('reg-lin-coef').value);
        var se = parseFloat(document.getElementById('reg-lin-se').value);
        var t = parseFloat(document.getElementById('reg-lin-t').value);
        var p = parseFloat(document.getElementById('reg-lin-p').value);
        var r2 = parseFloat(document.getElementById('reg-lin-r2').value);
        var pred = document.getElementById('reg-lin-pred').value || 'Predictor';
        var out = document.getElementById('reg-lin-out').value || 'Outcome';

        var ciLo = coef - 1.96 * se;
        var ciHi = coef + 1.96 * se;
        var significant = p < 0.05;

        var html = '<div class="result-panel mt-2">';
        html += '<div class="card-title">Linear Regression Interpretation</div>';

        html += '<div style="border-left:4px solid var(--primary);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Coefficient Interpretation</div>';
        html += '<div style="font-size:0.95rem;line-height:1.6;">';
        html += 'For each one-unit increase in <strong>' + pred + '</strong>, the <strong>' + out + '</strong> changes by '
            + '<strong>' + coef.toFixed(2) + '</strong> units (95% CI: ' + ciLo.toFixed(2) + ' to ' + ciHi.toFixed(2) + '), '
            + 'holding all other variables constant.';
        html += '</div></div>';

        html += '<div style="border-left:4px solid ' + (significant ? 'var(--success)' : 'var(--warning)') + ';padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Statistical Significance</div>';
        html += '<div style="font-size:0.95rem;">t = ' + t.toFixed(2) + ', p = ' + (p < 0.001 ? '< 0.001' : p.toFixed(4))
            + '. This association is <strong>' + (significant ? 'statistically significant' : 'not statistically significant') + '</strong> at alpha = 0.05.</div>';
        html += '</div>';

        if (!isNaN(r2)) {
            html += '<div style="border-left:4px solid var(--text-tertiary);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
            html += '<div style="font-weight:600;margin-bottom:4px;">Model Fit</div>';
            html += '<div style="font-size:0.95rem;">R-squared = ' + r2.toFixed(3) + '. The model explains ' + (r2 * 100).toFixed(1)
                + '% of the variance in ' + out + '. ';
            if (r2 < 0.1) html += 'This is a low R-squared, suggesting the model has limited explanatory power.';
            else if (r2 < 0.3) html += 'This is a moderate R-squared.';
            else if (r2 < 0.5) html += 'This is a moderately good R-squared.';
            else html += 'This is a good R-squared, suggesting strong explanatory power.';
            html += '</div></div>';
        }

        html += '</div>';
        return html;
    }

    function interpretLogisticReg() {
        var coef = parseFloat(document.getElementById('reg-log-coef').value);
        var se = parseFloat(document.getElementById('reg-log-se').value);
        var or_val = parseFloat(document.getElementById('reg-log-or').value);
        var p = parseFloat(document.getElementById('reg-log-p').value);
        var ciLo = parseFloat(document.getElementById('reg-log-ci-lo').value);
        var ciHi = parseFloat(document.getElementById('reg-log-ci-hi').value);
        var pred = document.getElementById('reg-log-pred').value || 'Predictor';
        var out = document.getElementById('reg-log-out').value || 'Outcome';

        // If OR not provided, compute from coefficient
        if (isNaN(or_val) && !isNaN(coef)) or_val = Math.exp(coef);
        if (isNaN(ciLo) && !isNaN(coef) && !isNaN(se)) ciLo = Math.exp(coef - 1.96 * se);
        if (isNaN(ciHi) && !isNaN(coef) && !isNaN(se)) ciHi = Math.exp(coef + 1.96 * se);

        var significant = p < 0.05;

        var html = '<div class="result-panel mt-2">';
        html += '<div class="card-title">Logistic Regression Interpretation</div>';

        html += '<div style="border-left:4px solid var(--primary);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Odds Ratio Interpretation</div>';
        html += '<div style="font-size:0.95rem;line-height:1.6;">';
        if (or_val > 1) {
            html += 'For each one-unit increase in <strong>' + pred + '</strong>, the odds of <strong>' + out + '</strong> increase by a factor of '
                + '<strong>' + or_val.toFixed(2) + '</strong> (95% CI: ' + ciLo.toFixed(2) + ' to ' + ciHi.toFixed(2) + '). '
                + 'This represents a <strong>' + ((or_val - 1) * 100).toFixed(0) + '% increase</strong> in odds.';
        } else if (or_val < 1) {
            html += 'For each one-unit increase in <strong>' + pred + '</strong>, the odds of <strong>' + out + '</strong> decrease by '
                + '<strong>' + ((1 - or_val) * 100).toFixed(0) + '%</strong> (OR = ' + or_val.toFixed(2)
                + ', 95% CI: ' + ciLo.toFixed(2) + ' to ' + ciHi.toFixed(2) + '). This is a protective association.';
        } else {
            html += 'OR = 1.00. No association between <strong>' + pred + '</strong> and <strong>' + out + '</strong>.';
        }
        html += '</div></div>';

        html += '<div style="border-left:4px solid ' + (significant ? 'var(--success)' : 'var(--warning)') + ';padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Statistical Significance</div>';
        html += '<div style="font-size:0.95rem;">p = ' + (p < 0.001 ? '< 0.001' : p.toFixed(4))
            + '. This is <strong>' + (significant ? 'statistically significant' : 'not statistically significant') + '</strong> at alpha = 0.05.';
        var excludesNull = ciLo > 1 || ciHi < 1;
        html += ' The 95% CI ' + (excludesNull ? 'excludes' : 'includes') + ' 1.0.</div>';
        html += '</div>';

        html += '<div style="border-left:4px solid var(--text-tertiary);padding:12px 16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Note</div>';
        html += '<div style="font-size:0.85rem;">The log-odds coefficient is ' + coef.toFixed(3) + ' (SE = ' + se.toFixed(3)
            + '). The OR is the exponentiated coefficient: exp(' + coef.toFixed(3) + ') = ' + Math.exp(coef).toFixed(2)
            + '. Note that the OR approximates the RR only when the outcome is rare (&lt;10%).</div>';
        html += '</div>';

        html += '</div>';
        return html;
    }

    function interpretCoxReg() {
        var coef = parseFloat(document.getElementById('reg-cox-coef').value);
        var se = parseFloat(document.getElementById('reg-cox-se').value);
        var hr = parseFloat(document.getElementById('reg-cox-hr').value);
        var p = parseFloat(document.getElementById('reg-cox-p').value);
        var ciLo = parseFloat(document.getElementById('reg-cox-ci-lo').value);
        var ciHi = parseFloat(document.getElementById('reg-cox-ci-hi').value);
        var pred = document.getElementById('reg-cox-pred').value || 'Predictor';
        var out = document.getElementById('reg-cox-out').value || 'Outcome';

        if (isNaN(hr) && !isNaN(coef)) hr = Math.exp(coef);
        if (isNaN(ciLo) && !isNaN(coef) && !isNaN(se)) ciLo = Math.exp(coef - 1.96 * se);
        if (isNaN(ciHi) && !isNaN(coef) && !isNaN(se)) ciHi = Math.exp(coef + 1.96 * se);

        var significant = p < 0.05;

        var html = '<div class="result-panel mt-2">';
        html += '<div class="card-title">Cox Regression Interpretation</div>';

        html += '<div style="border-left:4px solid var(--primary);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Hazard Ratio Interpretation</div>';
        html += '<div style="font-size:0.95rem;line-height:1.6;">';
        if (hr > 1) {
            html += '<strong>' + pred + '</strong> is associated with a <strong>' + ((hr - 1) * 100).toFixed(0) + '% increase</strong> in the instantaneous rate (hazard) of '
                + '<strong>' + out + '</strong> (HR = ' + hr.toFixed(2) + ', 95% CI: ' + ciLo.toFixed(2) + ' to ' + ciHi.toFixed(2) + ').';
        } else if (hr < 1) {
            html += '<strong>' + pred + '</strong> is associated with a <strong>' + ((1 - hr) * 100).toFixed(0) + '% decrease</strong> in the hazard of '
                + '<strong>' + out + '</strong> (HR = ' + hr.toFixed(2) + ', 95% CI: ' + ciLo.toFixed(2) + ' to ' + ciHi.toFixed(2) + '). Protective effect.';
        } else {
            html += 'HR = 1.00. No association between <strong>' + pred + '</strong> and the hazard of <strong>' + out + '</strong>.';
        }
        html += '</div></div>';

        html += '<div style="border-left:4px solid ' + (significant ? 'var(--success)' : 'var(--warning)') + ';padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Statistical Significance</div>';
        html += '<div style="font-size:0.95rem;">p = ' + (p < 0.001 ? '< 0.001' : p.toFixed(4))
            + '. This is <strong>' + (significant ? 'statistically significant' : 'not statistically significant') + '</strong> at alpha = 0.05.</div>';
        html += '</div>';

        html += '<div style="border-left:4px solid var(--warning);padding:12px 16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Assumption</div>';
        html += '<div style="font-size:0.85rem;">The Cox model assumes proportional hazards: the HR remains constant over time. '
            + 'If this assumption is violated (check with Schoenfeld residuals or log-log plot), the HR represents a time-averaged effect and may be misleading.</div>';
        html += '</div>';

        html += '</div>';
        return html;
    }

    function interpretPoissonReg() {
        var coef = parseFloat(document.getElementById('reg-poi-coef').value);
        var se = parseFloat(document.getElementById('reg-poi-se').value);
        var irr = parseFloat(document.getElementById('reg-poi-irr').value);
        var p = parseFloat(document.getElementById('reg-poi-p').value);
        var ciLo = parseFloat(document.getElementById('reg-poi-ci-lo').value);
        var ciHi = parseFloat(document.getElementById('reg-poi-ci-hi').value);
        var pred = document.getElementById('reg-poi-pred').value || 'Predictor';
        var out = document.getElementById('reg-poi-out').value || 'Outcome';

        if (isNaN(irr) && !isNaN(coef)) irr = Math.exp(coef);
        if (isNaN(ciLo) && !isNaN(coef) && !isNaN(se)) ciLo = Math.exp(coef - 1.96 * se);
        if (isNaN(ciHi) && !isNaN(coef) && !isNaN(se)) ciHi = Math.exp(coef + 1.96 * se);

        var significant = p < 0.05;

        var html = '<div class="result-panel mt-2">';
        html += '<div class="card-title">Poisson Regression Interpretation</div>';

        html += '<div style="border-left:4px solid var(--primary);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Incidence Rate Ratio Interpretation</div>';
        html += '<div style="font-size:0.95rem;line-height:1.6;">';
        if (irr > 1) {
            html += 'For each one-unit increase in <strong>' + pred + '</strong>, the incidence rate of <strong>' + out + '</strong> increases by a factor of '
                + '<strong>' + irr.toFixed(2) + '</strong> (95% CI: ' + ciLo.toFixed(2) + ' to ' + ciHi.toFixed(2) + '). '
                + 'This is a <strong>' + ((irr - 1) * 100).toFixed(0) + '% increase</strong> in the rate.';
        } else if (irr < 1) {
            html += 'For each one-unit increase in <strong>' + pred + '</strong>, the incidence rate of <strong>' + out + '</strong> decreases by '
                + '<strong>' + ((1 - irr) * 100).toFixed(0) + '%</strong> (IRR = ' + irr.toFixed(2)
                + ', 95% CI: ' + ciLo.toFixed(2) + ' to ' + ciHi.toFixed(2) + ').';
        } else {
            html += 'IRR = 1.00. No association between <strong>' + pred + '</strong> and the rate of <strong>' + out + '</strong>.';
        }
        html += '</div></div>';

        html += '<div style="border-left:4px solid ' + (significant ? 'var(--success)' : 'var(--warning)') + ';padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Statistical Significance</div>';
        html += '<div style="font-size:0.95rem;">p = ' + (p < 0.001 ? '< 0.001' : p.toFixed(4))
            + '. This is <strong>' + (significant ? 'statistically significant' : 'not statistically significant') + '</strong> at alpha = 0.05.</div>';
        html += '</div>';

        html += '<div style="border-left:4px solid var(--warning);padding:12px 16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Assumption</div>';
        html += '<div style="font-size:0.85rem;">Poisson regression assumes the mean equals the variance (equidispersion). '
            + 'If overdispersion is present (variance > mean), consider negative binomial regression or quasi-Poisson. '
            + 'Check with a dispersion test or compare deviance to degrees of freedom.</div>';
        html += '</div>';

        html += '</div>';
        return html;
    }

    function copyReg() {
        var el = document.getElementById('reg-results');
        if (el) Export.copyText(el.textContent);
    }

    // ================================================================
    // CARD 5: Quick Reference Cards
    // ================================================================
    function renderQuickReference() {
        var html = '<div class="card">';
        html += '<div class="card-title">Quick Reference: What Does This Statistic Mean?</div>';
        html += '<div class="card-subtitle">Click any statistic to expand its definition, interpretation, and common pitfalls.</div>';

        var refs = [
            {
                id: 'ref-pvalue',
                title: 'P-value',
                content: '<strong>Definition:</strong> The probability of observing data as extreme as (or more extreme than) the observed data, assuming the null hypothesis is true.<br><br>'
                    + '<strong>Range:</strong> 0 to 1.<br><br>'
                    + '<strong>Key point:</strong> A small p-value indicates the data are unlikely under the null hypothesis. It does NOT indicate the probability that the null is true, '
                    + 'nor does it measure effect size. P-values are affected by sample size: a large study can produce a significant p-value for a trivially small effect.<br><br>'
                    + '<strong>Common threshold:</strong> alpha = 0.05 (arbitrary, proposed by Fisher as a guide, not a bright line).'
            },
            {
                id: 'ref-ci',
                title: 'Confidence Interval (CI)',
                content: '<strong>Definition:</strong> A range of values within which the true population parameter is expected to lie with a specified probability (typically 95%).<br><br>'
                    + '<strong>Interpretation:</strong> If the study were repeated many times, 95% of the computed 95% CIs would contain the true value. '
                    + 'A narrower CI indicates greater precision (often from larger sample size).<br><br>'
                    + '<strong>Key point:</strong> The CI provides more information than a p-value alone: it shows both the direction and magnitude of the effect, plus the uncertainty.'
            },
            {
                id: 'ref-se',
                title: 'Standard Error (SE)',
                content: '<strong>Definition:</strong> The standard deviation of a sampling distribution (i.e., the estimated variability of a statistic across repeated samples).<br><br>'
                    + '<strong>Relationship:</strong> SE = SD / sqrt(n). Decreases with larger sample sizes.<br><br>'
                    + '<strong>Use:</strong> Used to compute confidence intervals (estimate +/- z * SE) and test statistics (estimate / SE). '
                    + 'Do not confuse with standard deviation (SD), which describes variability in the data, not variability of the estimate.'
            },
            {
                id: 'ref-sd',
                title: 'Standard Deviation (SD)',
                content: '<strong>Definition:</strong> A measure of the spread (variability) of individual observations around the mean.<br><br>'
                    + '<strong>Interpretation:</strong> In a normal distribution, ~68% of observations fall within +/- 1 SD, ~95% within +/- 2 SD, and ~99.7% within +/- 3 SD of the mean.<br><br>'
                    + '<strong>Key point:</strong> SD describes the data; SE describes the precision of the estimate. Reporting SE instead of SD makes data appear less variable (a common trick to watch for).'
            },
            {
                id: 'ref-or',
                title: 'Odds Ratio (OR)',
                content: '<strong>Definition:</strong> The ratio of the odds of the outcome in the exposed group to the odds in the unexposed group.<br><br>'
                    + '<strong>Range:</strong> 0 to infinity. OR = 1 means no association. OR > 1 means increased odds. OR < 1 means decreased odds.<br><br>'
                    + '<strong>Key point:</strong> The OR approximates the RR only when the outcome is rare (<10%). In common outcomes, the OR exaggerates the RR. '
                    + 'The OR is the native measure from logistic regression and case-control studies.'
            },
            {
                id: 'ref-rr',
                title: 'Risk Ratio (Relative Risk, RR)',
                content: '<strong>Definition:</strong> The ratio of the risk (probability) of the outcome in the exposed group to the risk in the unexposed group.<br><br>'
                    + '<strong>Range:</strong> 0 to infinity. RR = 1 means no association. RR > 1 means increased risk. RR < 1 means decreased risk (protective).<br><br>'
                    + '<strong>Key point:</strong> More intuitive than OR. Can be estimated directly from cohort studies and RCTs. '
                    + 'Relative measures (RR) tend to be more stable across populations; absolute measures (RD) are more useful for clinical decisions.'
            },
            {
                id: 'ref-hr',
                title: 'Hazard Ratio (HR)',
                content: '<strong>Definition:</strong> The ratio of the hazard (instantaneous event rate) in one group to the hazard in another group, from a Cox proportional hazards model.<br><br>'
                    + '<strong>Interpretation:</strong> HR = 1.5 means the event rate is 50% higher in the exposed group at any given time point.<br><br>'
                    + '<strong>Assumption:</strong> Proportional hazards (the HR is constant over time). If violated, the HR represents a weighted average and may not be meaningful. '
                    + 'Unlike RR, the HR accounts for censoring and time-to-event data.'
            },
            {
                id: 'ref-nnt',
                title: 'Number Needed to Treat (NNT)',
                content: '<strong>Definition:</strong> The number of patients who need to be treated to prevent one additional adverse outcome, compared to the control.<br><br>'
                    + '<strong>Formula:</strong> NNT = 1 / ARR (absolute risk reduction).<br><br>'
                    + '<strong>Interpretation:</strong> NNT = 10 means 10 patients must be treated to prevent 1 event. Lower NNT = more effective treatment. '
                    + 'Always specify the time frame and baseline risk. NNT depends on baseline risk: the same RR yields different NNTs in different populations.'
            },
            {
                id: 'ref-auc',
                title: 'AUC (Area Under the ROC Curve)',
                content: '<strong>Definition:</strong> The probability that a randomly chosen positive case has a higher predicted risk than a randomly chosen negative case (c-statistic).<br><br>'
                    + '<strong>Range:</strong> 0.5 (no discrimination) to 1.0 (perfect discrimination).<br><br>'
                    + '<strong>Benchmarks:</strong> 0.5-0.6 = fail, 0.6-0.7 = poor, 0.7-0.8 = acceptable, 0.8-0.9 = excellent, >0.9 = outstanding.<br><br>'
                    + '<strong>Key point:</strong> AUC measures discrimination (ability to rank) but not calibration (accuracy of predicted probabilities). A well-calibrated model with AUC=0.75 may be more useful than a poorly calibrated model with AUC=0.85.'
            },
            {
                id: 'ref-sensitivity',
                title: 'Sensitivity',
                content: '<strong>Definition:</strong> The proportion of true positives correctly identified by the test. P(Test+ | Disease+).<br><br>'
                    + '<strong>Also known as:</strong> True positive rate, recall.<br><br>'
                    + '<strong>Clinical rule:</strong> SnNOut - A highly Sensitive test, when Negative, rules OUT the disease. '
                    + 'High sensitivity means few false negatives. Useful for screening (you don\'t want to miss cases).'
            },
            {
                id: 'ref-specificity',
                title: 'Specificity',
                content: '<strong>Definition:</strong> The proportion of true negatives correctly identified by the test. P(Test- | Disease-).<br><br>'
                    + '<strong>Also known as:</strong> True negative rate.<br><br>'
                    + '<strong>Clinical rule:</strong> SpPIn - A highly Specific test, when Positive, rules IN the disease. '
                    + 'High specificity means few false positives. Useful for confirmatory testing.'
            },
            {
                id: 'ref-r2',
                title: 'R-squared (Coefficient of Determination)',
                content: '<strong>Definition:</strong> The proportion of variance in the dependent variable explained by the independent variable(s).<br><br>'
                    + '<strong>Range:</strong> 0 to 1 (in linear regression; adjusted R-squared can be negative).<br><br>'
                    + '<strong>Benchmarks (Cohen):</strong> 0.02 = small, 0.13 = medium, 0.26 = large.<br><br>'
                    + '<strong>Key point:</strong> R-squared always increases when adding predictors (use adjusted R-squared for model comparison). '
                    + 'A high R-squared does not imply causation, nor does a low R-squared mean the predictor is unimportant.'
            },
            {
                id: 'ref-cohensd',
                title: 'Cohen\'s d',
                content: '<strong>Definition:</strong> Standardized mean difference between two groups. d = (M1 - M2) / pooled SD.<br><br>'
                    + '<strong>Benchmarks (Cohen 1988):</strong> 0.2 = small, 0.5 = medium, 0.8 = large.<br><br>'
                    + '<strong>Key point:</strong> Unit-free, allowing comparison across studies with different scales. '
                    + 'Used extensively in meta-analysis. Hedge\'s g applies a small-sample correction.'
            },
            {
                id: 'ref-i2',
                title: 'I-squared (I\u00B2) - Heterogeneity',
                content: '<strong>Definition:</strong> The percentage of variability across studies in a meta-analysis that is due to true heterogeneity rather than chance.<br><br>'
                    + '<strong>Range:</strong> 0% to 100%.<br><br>'
                    + '<strong>Benchmarks (Higgins):</strong> 0-25% = low, 25-50% = moderate, 50-75% = substantial, >75% = considerable heterogeneity.<br><br>'
                    + '<strong>Key point:</strong> I-squared does not tell you the magnitude of heterogeneity, only the proportion due to real differences. '
                    + 'Use alongside the prediction interval and Cochran\'s Q test.'
            },
            {
                id: 'ref-fragility',
                title: 'Fragility Index',
                content: '<strong>Definition:</strong> The minimum number of patients whose outcome would need to change from a non-event to an event (or vice versa) to change a statistically significant result to non-significant.<br><br>'
                    + '<strong>Interpretation:</strong> A low fragility index (e.g., 0-3) means the statistical significance is fragile and could be overturned by a small number of different outcomes. '
                    + 'Many landmark RCTs in stroke and cardiology have fragility indices of 0-5.<br><br>'
                    + '<strong>Key point:</strong> Provides an intuitive complement to p-values. A trial with p=0.04 and fragility index=1 should be interpreted more cautiously than one with p=0.04 and fragility index=20.'
            }
        ];

        for (var i = 0; i < refs.length; i++) {
            var r = refs[i];
            html += '<div style="border:1px solid var(--border);border-radius:8px;margin-bottom:8px;">';
            html += '<div onclick="ResultsInterp.toggleRef(\'' + r.id + '\')" '
                + 'style="padding:12px 16px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;'
                + 'font-weight:600;font-size:0.95rem;user-select:none;">'
                + r.title
                + '<span id="' + r.id + '-icon" style="font-size:1.2rem;transition:transform 0.2s;">&#9656;</span></div>';
            html += '<div id="' + r.id + '" class="hidden" style="padding:0 16px 16px 16px;font-size:0.9rem;line-height:1.7;">'
                + r.content + '</div>';
            html += '</div>';
        }

        html += '</div>';
        return html;
    }

    function toggleRef(id) {
        var el = document.getElementById(id);
        var icon = document.getElementById(id + '-icon');
        if (!el) return;
        if (el.classList.contains('hidden')) {
            el.classList.remove('hidden');
            if (icon) icon.style.transform = 'rotate(90deg)';
        } else {
            el.classList.add('hidden');
            if (icon) icon.style.transform = 'rotate(0deg)';
        }
    }

    // ================================================================
    // REGISTER
    // ================================================================
    App.registerModule(MODULE_ID, { render: render });

    window.ResultsInterp = {
        interpretPValue: interpretPValue,
        copyPValue: copyPValue,
        interpretCI: interpretCI,
        copyCI: copyCI,
        interpretES: interpretES,
        updateESLabels: updateESLabels,
        copyES: copyES,
        interpretReg: interpretReg,
        updateRegFields: updateRegFields,
        copyReg: copyReg,
        toggleRef: toggleRef
    };
})();
