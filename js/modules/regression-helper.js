/**
 * Neuro-Epi — Regression Planning Helper Module
 * Features: Regression Wizard, EPV Calculator, DAG Builder, Model Building Strategy Guide
 */

(function() {
    'use strict';

    const MODULE_ID = 'regression-helper';

    // DAG state
    var dagNodes = [];
    var dagEdges = [];
    var nodeIdCounter = 0;

    function render(container) {
        var html = App.createModuleLayout(
            'Regression Planning',
            'Tools for choosing the right regression model, checking sample size adequacy, building directed acyclic graphs, and planning model building strategies.'
        );

        html += '<div class="card">';
        html += '<div class="tabs" id="rh-tabs">'
            + '<button class="tab active" data-tab="wizard" onclick="RegressionHelper.switchTab(\'wizard\')">Regression Wizard</button>'
            + '<button class="tab" data-tab="epv" onclick="RegressionHelper.switchTab(\'epv\')">EPV Calculator</button>'
            + '<button class="tab" data-tab="dag" onclick="RegressionHelper.switchTab(\'dag\')">DAG Builder</button>'
            + '<button class="tab" data-tab="strategy" onclick="RegressionHelper.switchTab(\'strategy\')">Model Building</button>'
            + '</div>';

        // ===== TAB A: Regression Wizard =====
        html += '<div class="tab-content active" id="tab-wizard">';
        html += '<div class="card-subtitle">Answer a few questions to find the most appropriate regression model for your analysis.</div>';

        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Outcome Type ' + App.tooltip('What is the nature of your dependent variable?') + '</label>'
            + '<select class="form-select" id="rh-outcome-type">'
            + '<option value="">-- Select --</option>'
            + '<option value="binary">Binary (e.g., mRS 0-2 vs 3-6)</option>'
            + '<option value="continuous">Continuous (e.g., NIHSS score change)</option>'
            + '<option value="count">Count (e.g., number of lesions)</option>'
            + '<option value="time">Time-to-Event (e.g., time to event/relapse)</option>'
            + '<option value="ordinal">Ordinal (e.g., full mRS shift)</option>'
            + '</select></div>'
            + '<div class="form-group"><label class="form-label">Clustering? ' + App.tooltip('Are observations grouped (e.g., patients within hospitals)?') + '</label>'
            + '<select class="form-select" id="rh-clustering">'
            + '<option value="no">No</option>'
            + '<option value="yes">Yes (e.g., multicenter)</option>'
            + '</select></div>'
            + '<div class="form-group"><label class="form-label">Repeated Measures? ' + App.tooltip('Multiple measurements per subject over time?') + '</label>'
            + '<select class="form-select" id="rh-repeated">'
            + '<option value="no">No</option>'
            + '<option value="yes">Yes</option>'
            + '</select></div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="RegressionHelper.recommend()">Recommend Model</button>'
            + '</div>';

        html += '<div id="rh-wizard-results"></div>';
        html += '</div>';

        // ===== TAB B: EPV Calculator =====
        html += '<div class="tab-content" id="tab-epv">';
        html += '<div class="card-subtitle">Events Per Variable (EPV) determines if your sample size is adequate for the number of covariates in your regression model.</div>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Number of Events (or total N for continuous) ' + App.tooltip('For logistic regression: number of events in the smaller outcome group. For Cox: number of events. For linear: total N.') + '</label>'
            + '<input type="number" class="form-input" id="rh-events" step="1" min="1" value="100"></div>'
            + '<div class="form-group"><label class="form-label">Number of Covariates (candidate predictors)</label>'
            + '<input type="number" class="form-input" id="rh-covariates" step="1" min="1" value="8"></div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="RegressionHelper.calculateEPV()">Calculate EPV</button>'
            + '</div>';

        html += '<div id="rh-epv-results"></div>';

        html += '<div class="card-title mt-3">EPV Reference Guide</div>';
        html += '<table class="data-table"><thead><tr><th>EPV</th><th>Interpretation</th><th>Recommendation</th></tr></thead><tbody>'
            + '<tr><td class="num" style="color:var(--danger)">&lt; 5</td><td>Severely inadequate</td><td>Model will be highly unstable; reduce covariates or increase sample</td></tr>'
            + '<tr><td class="num" style="color:var(--danger)">5 - 9</td><td>Inadequate</td><td>High risk of overfitting; coefficient estimates unreliable</td></tr>'
            + '<tr><td class="num" style="color:var(--warning)">10 - 20</td><td>Marginal</td><td>Traditional minimum; may be adequate for simple models</td></tr>'
            + '<tr><td class="num" style="color:var(--success)">20 - 50</td><td>Adequate</td><td>Good for most models; reliable coefficient estimates</td></tr>'
            + '<tr><td class="num" style="color:var(--success)">&gt; 50</td><td>Excellent</td><td>Supports complex models with interactions and nonlinearity</td></tr>'
            + '</tbody></table>';

        html += '</div>';

        // ===== TAB C: DAG Builder =====
        html += '<div class="tab-content" id="tab-dag">';
        html += '<div class="card-subtitle">Build a simplified Directed Acyclic Graph (DAG) for your study. Add nodes (variables) and edges (causal paths) to visualize relationships and identify the adjustment set.</div>';

        html += '<div class="card-title">Add Node</div>';
        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Variable Name</label>'
            + '<input type="text" class="form-input" id="rh-node-name" placeholder="e.g., Disease Severity, Age, BMI"></div>'
            + '<div class="form-group"><label class="form-label">Type</label>'
            + '<select class="form-select" id="rh-node-type">'
            + '<option value="exposure">Exposure</option>'
            + '<option value="outcome">Outcome</option>'
            + '<option value="confounder">Confounder</option>'
            + '<option value="mediator">Mediator</option>'
            + '<option value="collider">Collider</option>'
            + '</select></div>'
            + '<div class="form-group" style="display:flex;align-items:flex-end">'
            + '<button class="btn btn-primary" onclick="RegressionHelper.addNode()">Add Node</button></div>'
            + '</div>';

        html += '<div class="card-title mt-2">Add Edge (Causal Path)</div>';
        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">From</label>'
            + '<select class="form-select" id="rh-edge-from"></select></div>'
            + '<div class="form-group"><label class="form-label">To</label>'
            + '<select class="form-select" id="rh-edge-to"></select></div>'
            + '<div class="form-group" style="display:flex;align-items:flex-end">'
            + '<button class="btn btn-primary" onclick="RegressionHelper.addEdge()">Add Edge</button></div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-secondary" onclick="RegressionHelper.clearDAG()">Clear DAG</button>'
            + '<button class="btn btn-secondary" onclick="RegressionHelper.loadExampleDAG()">Load Example</button>'
            + '</div>';

        html += '<div class="chart-container mt-2"><canvas id="rh-dag-canvas" width="700" height="400"></canvas></div>';
        html += '<div class="chart-actions">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'rh-dag-canvas\'),\'dag-diagram.png\')">Export PNG</button>'
            + '</div>';

        html += '<div id="rh-dag-info"></div>';
        html += '</div>';

        // ===== TAB D: Model Building Strategy Guide =====
        html += '<div class="tab-content" id="tab-strategy">';
        html += '<div class="card-subtitle">Guidance on variable selection strategies, collinearity diagnostics, and model building best practices.</div>';

        html += buildStrategyContent();
        html += '</div>';

        html += '</div>'; // end card

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);

        // Reset DAG state
        dagNodes = [];
        dagEdges = [];
        nodeIdCounter = 0;
    }

    function buildStrategyContent() {
        var html = '';

        // Strategy cards
        var strategies = [
            {
                title: 'Purposeful Selection (Hosmer-Lemeshow)',
                description: 'Begin with univariable analysis of each candidate variable. Include variables with p < 0.25 in multivariable model. Remove variables one at a time; keep if removal changes any remaining coefficient by >15-20%. Recheck excluded variables by adding them back. Include clinically important variables regardless of statistical significance.',
                pros: 'Clinically driven; balances parsimony with confounding control; recommended for epidemiologic research',
                cons: 'Subjective choice of significance threshold; labor-intensive; may not scale well with many variables',
                bestFor: 'Etiologic studies where confounding control is primary goal'
            },
            {
                title: 'Change-in-Estimate (10% Rule)',
                description: 'Include a variable in the model if its removal changes the exposure-outcome coefficient by more than 10%. This method focuses purely on confounding control rather than statistical significance. Apply iteratively, removing one confounder at a time.',
                pros: 'Objective criterion; focuses on bias reduction; not dependent on sample size',
                cons: 'Arbitrary 10% threshold; does not account for precision; may retain irrelevant variables in small samples',
                bestFor: 'Observational studies focused on estimating a single exposure effect'
            },
            {
                title: 'Backward Elimination',
                description: 'Start with all candidate variables in the model. Remove the variable with the largest p-value above the threshold (e.g., p > 0.10). Repeat until all remaining variables meet the criterion. Consider using a liberal threshold (p = 0.157 corresponds to AIC).',
                pros: 'Simple; automated; tends to produce stable models',
                cons: 'May drop confounders; order-dependent; multiple testing issues; p-values unreliable after selection',
                bestFor: 'Prediction models where parsimony is prioritized'
            },
            {
                title: 'Forward Selection',
                description: 'Start with no variables. Add the variable that most improves model fit (lowest p-value or highest likelihood ratio test statistic). Continue adding variables until no further improvement meets the threshold.',
                pros: 'Simple; works with many candidate variables',
                cons: 'Tends to miss important variables; sensitive to collinearity; order-dependent; less stable than backward',
                bestFor: 'Exploratory analysis when number of candidates greatly exceeds what can be included'
            }
        ];

        strategies.forEach(function(s) {
            html += '<div class="result-panel mb-2">'
                + '<div class="card-title">' + s.title + '</div>'
                + '<p style="margin:8px 0;color:var(--text-secondary);font-size:0.9rem">' + s.description + '</p>'
                + '<div class="form-row form-row--3">'
                + '<div><strong style="color:var(--success);font-size:0.8rem">Strengths:</strong><br><span style="font-size:0.8rem;color:var(--text-secondary)">' + s.pros + '</span></div>'
                + '<div><strong style="color:var(--danger);font-size:0.8rem">Limitations:</strong><br><span style="font-size:0.8rem;color:var(--text-secondary)">' + s.cons + '</span></div>'
                + '<div><strong style="color:var(--accent);font-size:0.8rem">Best For:</strong><br><span style="font-size:0.8rem;color:var(--text-secondary)">' + s.bestFor + '</span></div>'
                + '</div></div>';
        });

        // Collinearity / VIF Table
        html += '<div class="card-title mt-3">Collinearity Diagnostics: VIF Interpretation ' + App.tooltip('Variance Inflation Factor quantifies how much the variance of a coefficient is inflated due to collinearity with other predictors.') + '</div>';
        html += '<table class="data-table"><thead><tr><th>VIF Range</th><th>Tolerance (1/VIF)</th><th>Interpretation</th><th>Action</th></tr></thead><tbody>'
            + '<tr><td class="num" style="color:var(--success)">1.0 - 2.5</td><td class="num">0.40 - 1.00</td><td>No significant collinearity</td><td>No action needed</td></tr>'
            + '<tr><td class="num" style="color:var(--warning)">2.5 - 5.0</td><td class="num">0.20 - 0.40</td><td>Moderate collinearity</td><td>Monitor; consider combining or dropping one variable</td></tr>'
            + '<tr><td class="num" style="color:var(--danger)">5.0 - 10.0</td><td class="num">0.10 - 0.20</td><td>High collinearity</td><td>SEs unreliable; combine variables or remove one</td></tr>'
            + '<tr><td class="num" style="color:var(--danger)">&gt; 10.0</td><td class="num">&lt; 0.10</td><td>Severe collinearity</td><td>Model unstable; must address before interpreting coefficients</td></tr>'
            + '</tbody></table>';

        // Additional tips
        html += '<div class="card-title mt-3">Model Checking Checklist</div>';
        html += '<div class="result-panel">'
            + '<ul style="margin:0;padding-left:20px;color:var(--text-secondary);font-size:0.9rem;line-height:1.8">'
            + '<li><strong>Proportional odds assumption</strong> (ordinal logistic): Test with Brant test or partial proportional odds model</li>'
            + '<li><strong>Proportional hazards</strong> (Cox): Check Schoenfeld residuals and log-log plots</li>'
            + '<li><strong>Linearity</strong> (all models): Check continuous predictors with fractional polynomials or restricted cubic splines</li>'
            + '<li><strong>Influential observations</strong>: Check dfbetas, Cook\'s distance, leverage values</li>'
            + '<li><strong>Goodness of fit</strong>: Hosmer-Lemeshow test (logistic), C-statistic / AUC, calibration plots</li>'
            + '<li><strong>Model specification</strong>: Link test (logistic), Pregibon test, information criteria (AIC, BIC)</li>'
            + '<li><strong>Overdispersion</strong> (Poisson): Compare deviance to df; use negative binomial if overdispersed</li>'
            + '<li><strong>Missing data</strong>: Document missingness pattern; consider multiple imputation for MAR data</li>'
            + '</ul></div>';

        html += '<div class="card-title mt-3">Clinical Research Best Practices</div>';
        html += '<div class="result-panel">'
            + '<ul style="margin:0;padding-left:20px;color:var(--text-secondary);font-size:0.9rem;line-height:1.8">'
            + '<li>Use <strong>ordinal logistic regression</strong> for mRS as the primary analysis (preserves statistical power)</li>'
            + '<li>Always test the <strong>proportional odds assumption</strong> when using ordinal logistic regression</li>'
            + '<li>Pre-specify the adjustment set based on a <strong>DAG</strong>, not on statistical significance</li>'
            + '<li>For multicenter studies, account for center effects using <strong>mixed-effects models</strong> or <strong>GEE</strong></li>'
            + '<li>Report both <strong>adjusted and unadjusted</strong> estimates in observational studies</li>'
            + '<li>Include <strong>disease severity</strong> and <strong>age</strong> as minimum adjustment variables</li>'
            + '<li>Consider <strong>treatment-by-subgroup interactions</strong> for key pre-specified subgroups</li>'
            + '<li>Account for <strong>time-varying confounders</strong> (e.g., blood pressure) with marginal structural models or g-estimation</li>'
            + '</ul></div>';

        return html;
    }

    function switchTab(tabId) {
        document.querySelectorAll('#rh-tabs .tab').forEach(function(t) { t.classList.toggle('active', t.dataset.tab === tabId); });
        document.querySelectorAll('.tab-content').forEach(function(tc) {
            var tcId = tc.id.replace('tab-', '');
            tc.classList.toggle('active', tcId === tabId);
        });
    }

    // ===== Regression Wizard =====
    function recommend() {
        var outcomeType = document.getElementById('rh-outcome-type').value;
        var clustering = document.getElementById('rh-clustering').value;
        var repeated = document.getElementById('rh-repeated').value;

        if (!outcomeType) {
            Export.showToast('Please select an outcome type', 'error');
            return;
        }

        // Build lookup key
        var typeMap = { binary: 'binary', continuous: 'continuous', count: 'count', time: 'time', ordinal: 'ordinal' };
        var suffix = '_independent';
        if (clustering === 'yes' || repeated === 'yes') suffix = '_clustered';
        if (repeated === 'yes') suffix = '_repeated';

        var key = typeMap[outcomeType] + suffix;
        var model = References.regressionModels[key];

        // Fallback: if exact key not found, try independent
        if (!model) {
            key = typeMap[outcomeType] + '_independent';
            model = References.regressionModels[key];
        }

        if (!model) {
            Export.showToast('No model recommendation found for this combination', 'error');
            return;
        }

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + model.model + '</div>';
        html += '<div class="result-label">Recommended Regression Model</div>';

        html += '<div class="result-grid mt-2">'
            + '<div class="result-item" style="grid-column:span 2"><div class="result-item-label">Formula</div>'
            + '<div style="font-family:var(--font-mono);font-size:0.95rem;color:var(--accent);margin-top:4px">' + model.formula + '</div></div>'
            + '</div>';

        html += '<div class="mt-2"><strong style="color:var(--text-secondary);font-size:0.85rem">Key Assumptions:</strong>'
            + '<p style="color:var(--text-secondary);font-size:0.85rem;margin:4px 0">' + model.assumptions + '</p></div>';

        html += '<div class="mt-1"><strong style="color:var(--accent);font-size:0.85rem">Domain-Specific Notes:</strong>'
            + '<p style="color:var(--text-secondary);font-size:0.85rem;margin:4px 0">' + model.notes + '</p></div>';

        // Additional contextual guidance
        if (outcomeType === 'binary') {
            html += '<div class="mt-2" style="border-top:1px solid var(--border);padding-top:12px">'
                + '<strong style="color:var(--text-secondary);font-size:0.85rem">Additional Guidance for Binary Outcomes:</strong>'
                + '<ul style="margin:4px 0;padding-left:16px;color:var(--text-secondary);font-size:0.85rem;line-height:1.6">'
                + '<li>Report odds ratios with 95% CIs and p-values</li>'
                + '<li>If baseline risk is high (>10%), OR overestimates RR. Consider log-binomial or modified Poisson for RR estimation.</li>'
                + '<li>For rare outcomes (prevalence &lt;5%), OR approximates RR well</li>'
                + '<li>Check calibration (Hosmer-Lemeshow) and discrimination (C-statistic)</li>'
                + '</ul></div>';
        }

        if (outcomeType === 'ordinal') {
            html += '<div class="mt-2" style="border-top:1px solid var(--border);padding-top:12px">'
                + '<strong style="color:var(--accent);font-size:0.85rem">mRS Shift Analysis (Preferred for Stroke Trials):</strong>'
                + '<ul style="margin:4px 0;padding-left:16px;color:var(--text-secondary);font-size:0.85rem;line-height:1.6">'
                + '<li>Report the <strong>common OR</strong> (aka shift OR or adjusted common OR)</li>'
                + '<li>Always test proportional odds assumption (Brant test or Score test)</li>'
                + '<li>If PO violated, consider partial proportional odds or dichotomized analyses as sensitivity</li>'
                + '<li>Visualize with a stacked mRS distribution bar chart (butterfly plot)</li>'
                + '</ul></div>';
        }

        if (outcomeType === 'time') {
            html += '<div class="mt-2" style="border-top:1px solid var(--border);padding-top:12px">'
                + '<strong style="color:var(--text-secondary);font-size:0.85rem">Time-to-Event Guidance:</strong>'
                + '<ul style="margin:4px 0;padding-left:16px;color:var(--text-secondary);font-size:0.85rem;line-height:1.6">'
                + '<li>Report hazard ratios with 95% CIs</li>'
                + '<li>Check PH assumption with Schoenfeld residuals and log(-log(S(t))) plots</li>'
                + '<li>If PH violated: consider restricted mean survival time (RMST), time-dependent coefficients, or stratified Cox</li>'
                + '<li>For competing risks (e.g., death preventing outcome occurrence), use Fine-Gray subdistribution hazard or cause-specific hazards</li>'
                + '</ul></div>';
        }

        html += '<div class="mt-2">'
            + '<button class="btn btn-xs btn-secondary" onclick="RegressionHelper.copyRecommendation()">Copy Recommendation</button>'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('rh-wizard-results'), html);
        Export.addToHistory(MODULE_ID, { outcome: outcomeType, clustering: clustering, repeated: repeated }, model.model);
    }

    function copyRecommendation() {
        var outcomeType = document.getElementById('rh-outcome-type').value;
        var clustering = document.getElementById('rh-clustering').value;
        var repeated = document.getElementById('rh-repeated').value;
        var typeMap = { binary: 'binary', continuous: 'continuous', count: 'count', time: 'time', ordinal: 'ordinal' };
        var suffix = '_independent';
        if (clustering === 'yes' || repeated === 'yes') suffix = '_clustered';
        if (repeated === 'yes') suffix = '_repeated';
        var key = typeMap[outcomeType] + suffix;
        var model = References.regressionModels[key] || References.regressionModels[typeMap[outcomeType] + '_independent'];
        if (model) {
            Export.copyText('Recommended model: ' + model.model + '\nFormula: ' + model.formula + '\nAssumptions: ' + model.assumptions + '\nNotes: ' + model.notes);
        }
    }

    // ===== EPV Calculator =====
    function calculateEPV() {
        var events = parseInt(document.getElementById('rh-events').value);
        var covariates = parseInt(document.getElementById('rh-covariates').value);

        if (isNaN(events) || isNaN(covariates) || events <= 0 || covariates <= 0) {
            Export.showToast('Please enter valid positive numbers', 'error');
            return;
        }

        var epv = events / covariates;
        var color, level, advice;

        if (epv < 5) {
            color = 'var(--danger)';
            level = 'Severely Inadequate';
            advice = 'Your model is severely underpowered. Coefficient estimates will be unreliable and overfitting is very likely. Reduce the number of covariates to at most ' + Math.floor(events / 10) + ' (for EPV >= 10) or increase your sample size.';
        } else if (epv < 10) {
            color = 'var(--danger)';
            level = 'Inadequate';
            advice = 'Below the traditional minimum of 10 EPV. Estimates may be biased and confidence intervals inaccurate. Consider reducing covariates to ' + Math.floor(events / 10) + ' or fewer.';
        } else if (epv < 20) {
            color = 'var(--warning)';
            level = 'Marginal';
            advice = 'Meets the traditional minimum (EPV >= 10) but modern guidance suggests EPV >= 20 for reliable estimates. Adequate for simple main-effects models.';
        } else if (epv < 50) {
            color = 'var(--success)';
            level = 'Adequate';
            advice = 'Good sample size relative to model complexity. Reliable for most regression models including some interactions.';
        } else {
            color = 'var(--success)';
            level = 'Excellent';
            advice = 'Excellent EPV. Supports complex models with interactions, nonlinear terms, and subgroup analyses.';
        }

        var maxCovariatesAt10 = Math.floor(events / 10);
        var maxCovariatesAt20 = Math.floor(events / 20);
        var eventsNeededFor10 = covariates * 10;
        var eventsNeededFor20 = covariates * 20;

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value" style="color:' + color + '">' + epv.toFixed(1) + ' EPV</div>';
        html += '<div class="result-label">' + level + '</div>';
        html += '<div class="result-detail" style="margin-top:8px">' + advice + '</div>';

        html += '<div class="result-grid mt-2">'
            + '<div class="result-item"><div class="result-item-value">' + events + '</div><div class="result-item-label">Events</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + covariates + '</div><div class="result-item-label">Covariates</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + maxCovariatesAt10 + '</div><div class="result-item-label">Max Covariates (EPV=10)</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + maxCovariatesAt20 + '</div><div class="result-item-label">Max Covariates (EPV=20)</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + eventsNeededFor10 + '</div><div class="result-item-label">Events Needed (EPV=10)</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + eventsNeededFor20 + '</div><div class="result-item-label">Events Needed (EPV=20)</div></div>'
            + '</div>';

        // Sensitivity table
        html += '<div class="card-title mt-3">EPV by Number of Covariates</div>';
        html += '<table class="data-table"><thead><tr><th>Covariates</th><th>EPV</th><th>Adequacy</th></tr></thead><tbody>';
        var covList = [3, 5, 8, 10, 12, 15, 20, 25, 30];
        covList.forEach(function(c) {
            var e = events / c;
            var clr = e < 10 ? 'var(--danger)' : e < 20 ? 'var(--warning)' : 'var(--success)';
            var isCurrent = c === covariates;
            html += '<tr' + (isCurrent ? ' style="background:var(--accent-muted)"' : '') + '>'
                + '<td class="num">' + c + '</td>'
                + '<td class="num" style="color:' + clr + '">' + e.toFixed(1) + '</td>'
                + '<td>' + (e < 10 ? 'Inadequate' : e < 20 ? 'Marginal' : 'Adequate') + '</td></tr>';
        });
        html += '</tbody></table>';

        html += '<div class="mt-2">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.copyText(\'EPV = ' + epv.toFixed(1) + ' (' + events + ' events, ' + covariates + ' covariates). ' + level + '.\')">Copy Result</button>'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('rh-epv-results'), html);
        Export.addToHistory(MODULE_ID, { events: events, covariates: covariates }, 'EPV = ' + epv.toFixed(1));
    }

    // ===== DAG Builder =====
    function addNode() {
        var nameEl = document.getElementById('rh-node-name');
        var typeEl = document.getElementById('rh-node-type');
        var name = nameEl.value.trim();
        var type = typeEl.value;

        if (!name) {
            Export.showToast('Please enter a variable name', 'error');
            return;
        }

        // Check duplicate
        if (dagNodes.some(function(n) { return n.label === name; })) {
            Export.showToast('Variable already exists', 'error');
            return;
        }

        nodeIdCounter++;
        var nodeId = 'n' + nodeIdCounter;

        // Auto-position nodes
        var typePositions = { exposure: { x: 100, baseY: 200 }, outcome: { x: 600, baseY: 200 }, confounder: { x: 350, baseY: 60 }, mediator: { x: 350, baseY: 300 }, collider: { x: 350, baseY: 380 } };
        var pos = typePositions[type] || { x: 350, baseY: 200 };
        var sameTypeCount = dagNodes.filter(function(n) { return n.type === type; }).length;
        var x = pos.x + sameTypeCount * 120;
        var y = pos.baseY + sameTypeCount * 40;

        // Keep within canvas
        if (x > 650) x = pos.x;
        if (y > 370) y = pos.baseY;

        dagNodes.push({ id: nodeId, label: name, type: type, x: x, y: y });
        nameEl.value = '';

        updateEdgeDropdowns();
        renderDAG();
    }

    function addEdge() {
        var from = document.getElementById('rh-edge-from').value;
        var to = document.getElementById('rh-edge-to').value;

        if (!from || !to) {
            Export.showToast('Please select both From and To nodes', 'error');
            return;
        }

        if (from === to) {
            Export.showToast('Cannot create self-loop', 'error');
            return;
        }

        // Check duplicate
        if (dagEdges.some(function(e) { return e.from === from && e.to === to; })) {
            Export.showToast('Edge already exists', 'error');
            return;
        }

        dagEdges.push({ from: from, to: to });
        renderDAG();
    }

    function updateEdgeDropdowns() {
        var fromEl = document.getElementById('rh-edge-from');
        var toEl = document.getElementById('rh-edge-to');
        if (!fromEl || !toEl) return;

        var opts = '<option value="">-- Select --</option>';
        dagNodes.forEach(function(n) {
            opts += '<option value="' + n.id + '">' + n.label + ' (' + n.type + ')</option>';
        });
        App.setTrustedHTML(fromEl, opts);
        App.setTrustedHTML(toEl, opts);
    }

    function renderDAG() {
        var canvas = document.getElementById('rh-dag-canvas');
        if (!canvas || dagNodes.length === 0) return;

        Charts.DAGDiagram(canvas, {
            nodes: dagNodes,
            edges: dagEdges,
            width: 700,
            height: 400
        });

        // Build info panel
        var html = '<div class="result-panel animate-in mt-2">';
        html += '<div class="card-title">DAG Summary</div>';

        // Variables by type
        var types = ['exposure', 'outcome', 'confounder', 'mediator', 'collider'];
        types.forEach(function(type) {
            var vars = dagNodes.filter(function(n) { return n.type === type; });
            if (vars.length > 0) {
                var typeColors = { exposure: 'var(--accent)', outcome: 'var(--success)', confounder: 'var(--warning)', mediator: 'var(--info)', collider: 'var(--danger)' };
                html += '<div style="margin:4px 0"><strong style="color:' + typeColors[type] + ';text-transform:capitalize;font-size:0.85rem">' + type + ':</strong> '
                    + '<span style="color:var(--text-secondary);font-size:0.85rem">' + vars.map(function(v) { return v.label; }).join(', ') + '</span></div>';
            }
        });

        // Edges
        if (dagEdges.length > 0) {
            html += '<div style="margin:8px 0"><strong style="color:var(--text-secondary);font-size:0.85rem">Causal Paths:</strong></div>';
            html += '<ul style="margin:0;padding-left:16px;color:var(--text-secondary);font-size:0.85rem">';
            dagEdges.forEach(function(e) {
                var fromNode = dagNodes.find(function(n) { return n.id === e.from; });
                var toNode = dagNodes.find(function(n) { return n.id === e.to; });
                if (fromNode && toNode) {
                    html += '<li>' + fromNode.label + ' &rarr; ' + toNode.label + '</li>';
                }
            });
            html += '</ul>';
        }

        // Adjustment set recommendation
        var confounders = dagNodes.filter(function(n) { return n.type === 'confounder'; });
        var mediators = dagNodes.filter(function(n) { return n.type === 'mediator'; });
        var colliders = dagNodes.filter(function(n) { return n.type === 'collider'; });

        html += '<div class="card-title mt-2">Adjustment Set Recommendation</div>';
        if (confounders.length > 0) {
            html += '<div style="margin:4px 0;color:var(--success);font-size:0.85rem"><strong>Adjust for (confounders):</strong> '
                + confounders.map(function(c) { return c.label; }).join(', ') + '</div>';
        } else {
            html += '<div style="margin:4px 0;color:var(--text-tertiary);font-size:0.85rem">No confounders identified. Add confounders to build the adjustment set.</div>';
        }

        if (mediators.length > 0) {
            html += '<div style="margin:4px 0;color:var(--warning);font-size:0.85rem"><strong>Do NOT adjust for (mediators):</strong> '
                + mediators.map(function(m) { return m.label; }).join(', ')
                + '<br><span style="color:var(--text-tertiary)">Adjusting for mediators blocks part of the causal effect and biases the total effect estimate.</span></div>';
        }

        if (colliders.length > 0) {
            html += '<div style="margin:4px 0;color:var(--danger);font-size:0.85rem"><strong>Do NOT adjust for (colliders):</strong> '
                + colliders.map(function(c) { return c.label; }).join(', ')
                + '<br><span style="color:var(--text-tertiary)">Adjusting for colliders opens a biasing pathway (collider bias).</span></div>';
        }

        html += '</div>';

        App.setTrustedHTML(document.getElementById('rh-dag-info'), html);
    }

    function clearDAG() {
        dagNodes = [];
        dagEdges = [];
        nodeIdCounter = 0;
        updateEdgeDropdowns();
        var canvas = document.getElementById('rh-dag-canvas');
        if (canvas) {
            var ctx = canvas.getContext('2d');
            var dpr = window.devicePixelRatio || 1;
            ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        }
        App.setTrustedHTML(document.getElementById('rh-dag-info'), '');
    }

    function loadExampleDAG() {
        dagNodes = [
            { id: 'n1', label: 'EVT Treatment', type: 'exposure', x: 100, y: 200 },
            { id: 'n2', label: 'mRS at 90 days', type: 'outcome', x: 600, y: 200 },
            { id: 'n3', label: 'Age', type: 'confounder', x: 250, y: 60 },
            { id: 'n4', label: 'NIHSS', type: 'confounder', x: 450, y: 60 },
            { id: 'n5', label: 'Reperfusion', type: 'mediator', x: 350, y: 300 },
            { id: 'n6', label: 'Hospitalization', type: 'collider', x: 350, y: 380 }
        ];
        dagEdges = [
            { from: 'n1', to: 'n2' },
            { from: 'n3', to: 'n1' },
            { from: 'n3', to: 'n2' },
            { from: 'n4', to: 'n1' },
            { from: 'n4', to: 'n2' },
            { from: 'n1', to: 'n5' },
            { from: 'n5', to: 'n2' },
            { from: 'n1', to: 'n6' },
            { from: 'n2', to: 'n6' }
        ];
        nodeIdCounter = 6;
        updateEdgeDropdowns();
        renderDAG();
    }

    // Register module
    App.registerModule(MODULE_ID, {
        render: render,
        onThemeChange: function() {
            if (dagNodes.length > 0) renderDAG();
        }
    });

    // Expose functions globally for onclick handlers
    window.RegressionHelper = {
        switchTab: switchTab,
        recommend: recommend,
        copyRecommendation: copyRecommendation,
        calculateEPV: calculateEPV,
        addNode: addNode,
        addEdge: addEdge,
        clearDAG: clearDAG,
        loadExampleDAG: loadExampleDAG
    };
})();
