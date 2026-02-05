/**
 * Neuro-Epi — Hypothesis Builder Module
 * Features: PICO/PECO Builder, Study Design Decision Tree, Variable Classification Tool
 */

(function() {
    'use strict';

    const MODULE_ID = 'hypothesis-builder';

    // Variable classification state
    var classifiedVars = [];
    var varIdCounter = 0;

    function render(container) {
        var html = App.createModuleLayout(
            'Hypothesis Builder',
            'Formulate structured research questions, select optimal study designs, and classify variables for analysis planning.'
        );

        html += '<div class="card">';
        html += '<div class="tabs" id="hb-tabs">'
            + '<button class="tab active" data-tab="pico" onclick="HypothesisBuilder.switchTab(\'pico\')">PICO/PECO Builder</button>'
            + '<button class="tab" data-tab="design" onclick="HypothesisBuilder.switchTab(\'design\')">Study Design Tree</button>'
            + '<button class="tab" data-tab="variables" onclick="HypothesisBuilder.switchTab(\'variables\')">Variable Classification</button>'
            + '</div>';

        // ===== TAB A: PICO/PECO Builder =====
        html += '<div class="tab-content active" id="tab-pico">';
        html += '<div class="card-subtitle">Build a structured research question using the PICO (intervention) or PECO (exposure) framework. Generates formatted hypothesis statements and suggests study designs.</div>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Framework</label>'
            + '<select class="form-select" id="hb-framework" onchange="HypothesisBuilder.updateFramework()">'
            + '<option value="pico">PICO (Intervention study)</option>'
            + '<option value="peco">PECO (Exposure/observational study)</option>'
            + '</select></div>'
            + '<div class="form-group"><label class="form-label">Clinical Domain</label>'
            + '<select class="form-select" id="hb-domain">'
            + '<option value="acute_stroke">Acute Ischemic Stroke</option>'
            + '<option value="ich">Intracerebral Hemorrhage</option>'
            + '<option value="secondary_prevention">Secondary Prevention</option>'
            + '<option value="rehabilitation">Stroke Rehabilitation</option>'
            + '<option value="neurovascular">Neurovascular (Carotid / Aneurysm)</option>'
            + '<option value="cardiology">Cardiology</option>'
            + '<option value="oncology">Oncology</option>'
            + '<option value="infectious_disease">Infectious Disease</option>'
            + '<option value="critical_care">Critical Care / ICU</option>'
            + '<option value="surgery">Surgery</option>'
            + '<option value="psychiatry">Psychiatry</option>'
            + '<option value="primary_care">Primary Care / Family Medicine</option>'
            + '<option value="other">Other</option>'
            + '</select></div>'
            + '</div>';

        html += '<div class="form-group"><label class="form-label">P - Population ' + App.tooltip('Who are the patients? Include age, sex, condition, setting.') + '</label>'
            + '<input type="text" class="form-input" id="hb-population" name="hb_population" placeholder="e.g., Adults with [condition] presenting within [timeframe] of [event]"></div>';

        html += '<div class="form-group"><label class="form-label" id="hb-ie-label">I - Intervention</label>'
            + '<input type="text" class="form-input" id="hb-intervention" name="hb_intervention" placeholder="e.g., [Intervention] plus standard of care"></div>';

        html += '<div class="form-group"><label class="form-label">C - Comparison ' + App.tooltip('What is the control or reference group?') + '</label>'
            + '<input type="text" class="form-input" id="hb-comparison" name="hb_comparison" placeholder="e.g., Medical therapy alone (standard of care)"></div>';

        html += '<div class="form-group"><label class="form-label">O - Outcome ' + App.tooltip('What is the primary outcome being measured?') + '</label>'
            + '<input type="text" class="form-input" id="hb-outcome" name="hb_outcome" placeholder="e.g., Functional independence (mRS 0-2) at 90 days"></div>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Outcome Type</label>'
            + '<select class="form-select" id="hb-outcome-type">'
            + '<option value="binary">Binary (yes/no)</option>'
            + '<option value="continuous">Continuous (score)</option>'
            + '<option value="ordinal">Ordinal (mRS shift)</option>'
            + '<option value="time_to_event">Time-to-event</option>'
            + '<option value="rate">Rate (events per time)</option>'
            + '</select></div>'
            + '<div class="form-group"><label class="form-label">Direction of Expected Effect</label>'
            + '<select class="form-select" id="hb-direction">'
            + '<option value="superiority">Superiority (treatment better)</option>'
            + '<option value="noninferiority">Non-inferiority (not worse)</option>'
            + '<option value="equivalence">Equivalence (same)</option>'
            + '<option value="harm">Potential harm (risk association)</option>'
            + '</select></div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="HypothesisBuilder.generateHypothesis()">Generate Research Question &amp; Hypotheses</button>'
            + '</div>';

        html += '<div id="hb-pico-results"></div>';
        html += '</div>';

        // ===== TAB B: Study Design Decision Tree =====
        html += '<div class="tab-content" id="tab-design">';
        html += '<div class="card-subtitle">Select your research question type to see the optimal study design, hierarchy of evidence, and practical guidance for clinical research.</div>';

        html += '<div class="form-group"><label class="form-label">What type of question are you asking?</label>'
            + '<select class="form-select" id="hb-question-type" onchange="HypothesisBuilder.showDesignTree()">'
            + '<option value="">-- Select question type --</option>'
            + '<option value="therapy">Therapy / Prevention (Does an intervention work?)</option>'
            + '<option value="diagnosis">Diagnosis (How accurate is a test?)</option>'
            + '<option value="prognosis">Prognosis (What will happen over time?)</option>'
            + '<option value="etiology">Etiology / Harm (What causes the condition?)</option>'
            + '</select></div>';

        html += '<div id="hb-design-results"></div>';
        html += '</div>';

        // ===== TAB C: Variable Classification Tool =====
        html += '<div class="tab-content" id="tab-variables">';
        html += '<div class="card-subtitle">Classify study variables to generate an analysis plan outline and check for methodological pitfalls.</div>';

        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Variable Name</label>'
            + '<input type="text" class="form-input" id="hb-var-name" placeholder="e.g., NIHSS at baseline"></div>'
            + '<div class="form-group"><label class="form-label">Classification</label>'
            + '<select class="form-select" id="hb-var-class">'
            + '<option value="independent">Independent Variable (Exposure)</option>'
            + '<option value="dependent">Dependent Variable (Outcome)</option>'
            + '<option value="confounder">Confounder</option>'
            + '<option value="mediator">Mediator</option>'
            + '<option value="moderator">Effect Modifier / Moderator</option>'
            + '<option value="precision">Precision Variable</option>'
            + '</select></div>'
            + '<div class="form-group" style="display:flex;align-items:flex-end">'
            + '<button class="btn btn-primary" onclick="HypothesisBuilder.addVariable()">Add Variable</button></div>'
            + '</div>';

        html += '<div id="hb-var-table"></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-secondary" onclick="HypothesisBuilder.clearVariables()">Clear All</button>'
            + '<button class="btn btn-primary" onclick="HypothesisBuilder.generateAnalysisPlan()">Generate Analysis Plan</button>'
            + '</div>';

        html += '<div id="hb-analysis-plan"></div>';
        html += '</div>';

        html += '</div>'; // end card

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);

        // Reset variable state
        classifiedVars = [];
        varIdCounter = 0;
    }

    function switchTab(tabId) {
        document.querySelectorAll('#hb-tabs .tab').forEach(function(t) { t.classList.toggle('active', t.dataset.tab === tabId); });
        document.querySelectorAll('.tab-content').forEach(function(tc) {
            var tcId = tc.id.replace('tab-', '');
            tc.classList.toggle('active', tcId === tabId);
        });
    }

    function updateFramework() {
        var fw = document.getElementById('hb-framework').value;
        var label = document.getElementById('hb-ie-label');
        if (label) {
            label.textContent = fw === 'pico' ? 'I - Intervention' : 'E - Exposure';
        }
        var input = document.getElementById('hb-intervention');
        if (input) {
            input.placeholder = fw === 'pico'
                ? 'e.g., Endovascular thrombectomy plus medical therapy'
                : 'e.g., Exposure to air pollution (PM2.5 > 25 ug/m3)';
        }
    }

    // ===== PICO/PECO Generator =====
    function generateHypothesis() {
        var framework = document.getElementById('hb-framework').value;
        var domain = document.getElementById('hb-domain').value;
        var population = document.getElementById('hb-population').value.trim();
        var intervention = document.getElementById('hb-intervention').value.trim();
        var comparison = document.getElementById('hb-comparison').value.trim();
        var outcome = document.getElementById('hb-outcome').value.trim();
        var outcomeType = document.getElementById('hb-outcome-type').value;
        var direction = document.getElementById('hb-direction').value;

        if (!population || !intervention || !comparison || !outcome) {
            Export.showToast('Please fill in all PICO/PECO fields', 'error');
            return;
        }

        // Generate research question
        var ieLabel = framework === 'pico' ? 'receiving' : 'exposed to';
        var cLabel = framework === 'pico' ? 'compared to' : 'compared with';

        var researchQuestion = 'Among ' + population + ', '
            + (direction === 'harm' ? 'is ' : 'does ')
            + intervention.toLowerCase()
            + (direction === 'harm' ? ' associated with ' : ' result in ')
            + (direction === 'superiority' ? 'improved ' : direction === 'noninferiority' ? 'non-inferior ' : direction === 'equivalence' ? 'equivalent ' : 'increased risk of ')
            + outcome.toLowerCase()
            + ' ' + cLabel + ' ' + comparison.toLowerCase() + '?';

        // Generate hypotheses
        var h0, h1;
        var outcomeTypeLabel = { binary: 'proportion', continuous: 'mean', ordinal: 'odds of improvement', time_to_event: 'hazard', rate: 'rate' };
        var measureLabel = outcomeTypeLabel[outcomeType] || 'outcome measure';

        if (direction === 'superiority') {
            h0 = 'There is no difference in ' + outcome.toLowerCase() + ' between patients ' + ieLabel + ' ' + intervention.toLowerCase() + ' and those ' + ieLabel + ' ' + comparison.toLowerCase() + '.';
            h1 = 'Patients ' + ieLabel + ' ' + intervention.toLowerCase() + ' have a significantly better ' + measureLabel + ' of ' + outcome.toLowerCase() + ' compared to those ' + ieLabel + ' ' + comparison.toLowerCase() + '.';
        } else if (direction === 'noninferiority') {
            h0 = intervention + ' is inferior to ' + comparison.toLowerCase() + ' in ' + outcome.toLowerCase() + ' by more than the pre-specified non-inferiority margin.';
            h1 = intervention + ' is non-inferior to ' + comparison.toLowerCase() + ' in ' + outcome.toLowerCase() + ', with the lower bound of the CI above the non-inferiority margin.';
        } else if (direction === 'equivalence') {
            h0 = 'The difference in ' + outcome.toLowerCase() + ' between ' + intervention.toLowerCase() + ' and ' + comparison.toLowerCase() + ' exceeds the equivalence margin.';
            h1 = intervention + ' and ' + comparison.toLowerCase() + ' produce equivalent ' + outcome.toLowerCase() + ', with the CI falling entirely within the equivalence margin.';
        } else {
            h0 = 'There is no association between ' + intervention.toLowerCase() + ' and ' + outcome.toLowerCase() + '.';
            h1 = intervention + ' is associated with an increased risk of ' + outcome.toLowerCase() + ' compared to ' + comparison.toLowerCase() + '.';
        }

        // Suggest study design
        var designSuggestion = '';
        var designNote = '';
        if (framework === 'pico') {
            if (direction === 'superiority' || direction === 'noninferiority' || direction === 'equivalence') {
                designSuggestion = 'Randomized Controlled Trial (RCT)';
                designNote = 'A parallel-group RCT is the gold standard for intervention questions. Consider adaptive designs for trials where recruitment is challenging.';
            }
        } else {
            if (direction === 'harm') {
                designSuggestion = 'Cohort Study or Case-Control Study';
                designNote = 'For etiology/harm questions, prospective cohort or nested case-control designs minimize bias. Consider population-based registries.';
            } else {
                designSuggestion = 'Prospective Cohort Study';
                designNote = 'Observational cohorts are most appropriate for exposure-outcome associations. Use propensity score methods to control confounding.';
            }
        }

        if (outcomeType === 'ordinal' && domain === 'acute_stroke') {
            designNote += ' For acute stroke trials using mRS, ordinal shift analysis (proportional odds model) is the preferred primary analysis, as recommended by regulatory guidance.';
        }

        // Build results HTML
        var html = '<div class="result-panel animate-in">';

        html += '<div class="card-title">Structured Research Question</div>';
        html += '<div style="font-size:1rem;color:var(--text);line-height:1.6;margin:8px 0;padding:12px;background:var(--surface);border-radius:8px;border-left:3px solid var(--accent)">'
            + researchQuestion + '</div>';

        // PICO/PECO table
        html += '<div class="card-title mt-2">' + framework.toUpperCase() + ' Components</div>';
        html += '<table class="data-table"><tbody>'
            + '<tr><td style="font-weight:bold;color:var(--accent);width:140px">P - Population</td><td>' + population + '</td></tr>'
            + '<tr><td style="font-weight:bold;color:var(--accent)">' + (framework === 'pico' ? 'I - Intervention' : 'E - Exposure') + '</td><td>' + intervention + '</td></tr>'
            + '<tr><td style="font-weight:bold;color:var(--accent)">C - Comparison</td><td>' + comparison + '</td></tr>'
            + '<tr><td style="font-weight:bold;color:var(--accent)">O - Outcome</td><td>' + outcome + '</td></tr>'
            + '</tbody></table>';

        // Hypotheses
        html += '<div class="card-title mt-2">Hypotheses</div>';
        html += '<div style="margin:8px 0">'
            + '<div style="padding:10px;background:var(--surface);border-radius:8px;margin-bottom:8px">'
            + '<strong style="color:var(--text-secondary);font-size:0.85rem">H<sub>0</sub> (Null Hypothesis):</strong><br>'
            + '<span style="color:var(--text-secondary);font-size:0.9rem">' + h0 + '</span></div>'
            + '<div style="padding:10px;background:var(--surface);border-radius:8px">'
            + '<strong style="color:var(--accent);font-size:0.85rem">H<sub>1</sub> (Alternative Hypothesis):</strong><br>'
            + '<span style="color:var(--text-secondary);font-size:0.9rem">' + h1 + '</span></div>'
            + '</div>';

        // Suggested design
        html += '<div class="card-title mt-2">Suggested Study Design</div>';
        html += '<div style="padding:12px;background:var(--surface);border-radius:8px">'
            + '<div style="font-size:1rem;color:var(--accent);font-weight:600">' + designSuggestion + '</div>'
            + '<div style="font-size:0.85rem;color:var(--text-secondary);margin-top:4px">' + designNote + '</div>'
            + '</div>';

        // Action buttons
        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs btn-secondary" onclick="HypothesisBuilder.copyPICO()">Copy All</button>'
            + '<button class="btn btn-xs btn-primary" onclick="App.navigate(\'sample-size\')">Go to Sample Size Calculator</button>'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('hb-pico-results'), html);
        Export.addToHistory(MODULE_ID, { population: population, intervention: intervention }, researchQuestion);
    }

    function copyPICO() {
        var population = document.getElementById('hb-population').value.trim();
        var intervention = document.getElementById('hb-intervention').value.trim();
        var comparison = document.getElementById('hb-comparison').value.trim();
        var outcome = document.getElementById('hb-outcome').value.trim();
        var framework = document.getElementById('hb-framework').value;

        var text = framework.toUpperCase() + ' Framework\n'
            + 'P: ' + population + '\n'
            + (framework === 'pico' ? 'I' : 'E') + ': ' + intervention + '\n'
            + 'C: ' + comparison + '\n'
            + 'O: ' + outcome;
        Export.copyText(text);
    }

    // ===== Study Design Decision Tree =====
    function showDesignTree() {
        var type = document.getElementById('hb-question-type').value;
        if (!type) {
            App.setTrustedHTML(document.getElementById('hb-design-results'), '');
            return;
        }

        var data = getDesignData(type);
        var html = '<div class="result-panel animate-in">';

        // Hierarchy of evidence
        html += '<div class="card-title">Hierarchy of Evidence: ' + data.title + '</div>';
        html += '<div style="margin:8px 0">';
        data.hierarchy.forEach(function(level, idx) {
            var opacity = 1 - idx * 0.12;
            var width = 100 - idx * 8;
            html += '<div style="margin:4px auto;padding:10px 16px;background:var(--accent);opacity:' + opacity + ';border-radius:8px;text-align:center;width:' + width + '%;color:var(--bg);font-size:0.85rem;font-weight:600">'
                + (idx + 1) + '. ' + level + '</div>';
        });
        html += '</div>';

        // Recommended design
        html += '<div class="card-title mt-2">Recommended Design</div>';
        html += '<div style="padding:16px;background:var(--surface);border-radius:12px;border-left:3px solid var(--accent)">'
            + '<div style="font-size:1.1rem;color:var(--accent);font-weight:700">' + data.recommended + '</div>'
            + '<p style="margin:8px 0;color:var(--text-secondary);font-size:0.9rem">' + data.explanation + '</p>'
            + '</div>';

        // Threats to validity
        html += '<div class="card-title mt-2">Key Threats to Validity</div>';
        html += '<table class="data-table"><thead><tr><th>Threat</th><th>Description</th><th>Mitigation</th></tr></thead><tbody>';
        data.threats.forEach(function(t) {
            html += '<tr><td style="font-weight:600;color:var(--warning)">' + t.name + '</td>'
                + '<td style="color:var(--text-secondary);font-size:0.85rem">' + t.description + '</td>'
                + '<td style="color:var(--text-secondary);font-size:0.85rem">' + t.mitigation + '</td></tr>';
        });
        html += '</tbody></table>';

        // Research context
        html += '<div class="card-title mt-2">Research Context</div>';
        html += '<div class="result-grid">'
            + '<div class="result-item"><div class="result-item-value">' + data.typicalN + '</div><div class="result-item-label">Typical Sample Size</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + data.timeline + '</div><div class="result-item-label">Typical Timeline</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + data.budget + '</div><div class="result-item-label">Budget Range</div></div>'
            + '</div>';

        // Example studies
        if (data.examples && data.examples.length > 0) {
            html += '<div class="card-title mt-2">Landmark Examples</div>';
            html += '<ul style="margin:0;padding-left:20px;color:var(--text-secondary);font-size:0.85rem;line-height:1.8">';
            data.examples.forEach(function(ex) {
                html += '<li><strong>' + ex.name + '</strong>: ' + ex.description + '</li>';
            });
            html += '</ul>';
        }

        html += '</div>';

        App.setTrustedHTML(document.getElementById('hb-design-results'), html);
    }

    function getDesignData(type) {
        var designs = {
            therapy: {
                title: 'Therapy / Prevention',
                hierarchy: [
                    'Systematic Review of RCTs',
                    'Randomized Controlled Trial (RCT)',
                    'Controlled Trial without Randomization',
                    'Cohort Study with Comparison',
                    'Case-Control Study',
                    'Case Series / Case Reports',
                    'Expert Opinion'
                ],
                recommended: 'Randomized Controlled Trial (RCT)',
                explanation: 'RCTs are the gold standard for therapy questions because randomization eliminates confounding by indication and ensures balance of measured and unmeasured confounders. In stroke research, key design considerations include: adaptive enrichment designs, ordinal outcomes (mRS shift), pragmatic vs explanatory trial designs, and futility stopping rules.',
                threats: [
                    { name: 'Selection Bias', description: 'Non-random allocation or failure of randomization', mitigation: 'Central randomization, allocation concealment, stratification by key prognostic factors (NIHSS, age)' },
                    { name: 'Performance Bias', description: 'Differences in care beyond the intervention', mitigation: 'Blinding of participants and care providers when possible; standardized protocols' },
                    { name: 'Attrition Bias', description: 'Differential dropout between arms', mitigation: 'ITT analysis, multiple imputation for missing outcomes, sensitivity analyses' },
                    { name: 'Detection Bias', description: 'Biased outcome assessment', mitigation: 'Blinded outcome assessment (mRS by certified assessor); central adjudication' }
                ],
                typicalN: '200-5000',
                timeline: '3-7 years',
                budget: '$2M-$50M+',
                examples: [
                    { name: 'MR CLEAN (2015)', description: 'First positive EVT trial; n=500; pragmatic design' },
                    { name: 'ESCAPE (2015)', description: 'EVT with imaging selection; n=316; stopped early for efficacy' },
                    { name: 'DAWN (2018)', description: 'Late-window EVT; n=206; Bayesian adaptive design' },
                    { name: 'CHANCE (2013)', description: 'DAPT for minor stroke/TIA; n=5170; large pragmatic RCT' }
                ]
            },
            diagnosis: {
                title: 'Diagnosis',
                hierarchy: [
                    'Systematic Review of Cross-Sectional Studies',
                    'Cross-Sectional Study with Gold Standard',
                    'Non-Consecutive Cohort Study',
                    'Case-Control Diagnostic Study',
                    'Case Series with Reference Standard',
                    'Expert Opinion'
                ],
                recommended: 'Cross-Sectional Diagnostic Accuracy Study',
                explanation: 'Enroll a consecutive or random sample of patients suspected of the condition. Apply both the index test and reference standard to all patients. Report sensitivity, specificity, predictive values, and likelihood ratios with CIs. Use STARD reporting guidelines.',
                threats: [
                    { name: 'Spectrum Bias', description: 'Testing in extreme cases inflates accuracy', mitigation: 'Consecutive enrollment; include borderline cases' },
                    { name: 'Verification Bias', description: 'Only test-positive patients receive gold standard', mitigation: 'Apply reference standard to all patients regardless of index test result' },
                    { name: 'Incorporation Bias', description: 'Index test is part of the reference standard', mitigation: 'Ensure index test and reference are independent' },
                    { name: 'Review Bias', description: 'Knowledge of one test influences reading of another', mitigation: 'Blind interpreters to the other test result' }
                ],
                typicalN: '100-500',
                timeline: '1-3 years',
                budget: '$100K-$2M',
                examples: [
                    { name: 'CTA for LVO Detection', description: 'Sensitivity/specificity of CTA vs DSA for large vessel occlusion' },
                    { name: 'NIHSS for LVO Prediction', description: 'Diagnostic accuracy of NIHSS cutpoints for predicting LVO on CTA' },
                    { name: 'RAPID for Core Volume', description: 'Automated perfusion software vs manual measurement of infarct core' }
                ]
            },
            prognosis: {
                title: 'Prognosis',
                hierarchy: [
                    'Systematic Review of Inception Cohorts',
                    'Inception Cohort Study',
                    'Cohort Study (non-inception)',
                    'Case-Control Study (nested)',
                    'Case Series',
                    'Expert Opinion'
                ],
                recommended: 'Prospective Inception Cohort Study',
                explanation: 'Enroll patients at a common, well-defined time point (inception cohort) and follow them forward in time. Measure potential prognostic factors at baseline. Use Kaplan-Meier for survival outcomes and multivariable regression to identify independent prognostic factors. Report hazard ratios, cumulative incidence, and calibrated prediction models.',
                threats: [
                    { name: 'Survivor Bias', description: 'Prevalent cases overrepresent long survivors', mitigation: 'Use inception cohort (enroll at disease onset)' },
                    { name: 'Loss to Follow-up', description: 'Differential attrition biases prognostic estimates', mitigation: 'Minimize dropout; use inverse probability weighting; sensitivity analyses' },
                    { name: 'Confounding', description: 'Unmeasured factors associated with both predictor and outcome', mitigation: 'Measure and adjust for known prognostic factors; use DAGs to identify confounders' },
                    { name: 'Lead Time Bias', description: 'Earlier detection creates apparent survival benefit', mitigation: 'Time-zero alignment; use disease onset as index date' }
                ],
                typicalN: '500-10000',
                timeline: '2-5 years',
                budget: '$500K-$5M',
                examples: [
                    { name: 'Framingham Heart Study', description: 'Prospective cohort; stroke incidence and risk factors over decades' },
                    { name: 'SITS Registry', description: 'Observational registry of IV thrombolysis outcomes in stroke' },
                    { name: 'ICAS Study', description: 'Prognosis of intracranial atherosclerotic stenosis in stroke/TIA patients' }
                ]
            },
            etiology: {
                title: 'Etiology / Harm',
                hierarchy: [
                    'Systematic Review of Cohort Studies',
                    'Prospective Cohort Study',
                    'Retrospective Cohort Study',
                    'Case-Control Study',
                    'Cross-Sectional Study',
                    'Ecological Study',
                    'Case Reports / Expert Opinion'
                ],
                recommended: 'Prospective Cohort Study or Nested Case-Control Study',
                explanation: 'For etiology and harm questions, RCTs are typically not feasible (unethical to randomize exposure). Prospective cohorts provide the best observational evidence with temporality established. Nested case-control designs within cohorts are efficient for rare outcomes. Use multivariable models with DAG-based confounding control.',
                threats: [
                    { name: 'Confounding', description: 'Observed association due to common cause', mitigation: 'DAG-based adjustment set; propensity scores; instrumental variables; Mendelian randomization' },
                    { name: 'Reverse Causation', description: 'Outcome causes the exposure, not vice versa', mitigation: 'Temporal separation of exposure and outcome measurement; prospective design' },
                    { name: 'Information Bias', description: 'Misclassification of exposure or outcome', mitigation: 'Validated exposure assessment; blinded outcome ascertainment; sensitivity analyses' },
                    { name: 'Healthy Worker Effect', description: 'Selection of healthier individuals into exposed group', mitigation: 'Internal comparisons; appropriate reference group; consider bias direction' }
                ],
                typicalN: '1000-100000+',
                timeline: '3-10 years',
                budget: '$1M-$20M',
                examples: [
                    { name: 'INTERSTROKE', description: 'Case-control study of stroke risk factors across 32 countries; n=26,919' },
                    { name: 'Air Pollution & Stroke', description: 'Cohort studies linking PM2.5 exposure to stroke incidence' },
                    { name: 'REGARDS', description: 'Prospective cohort study of racial disparities in stroke; n=30,239' }
                ]
            }
        };

        return designs[type];
    }

    // ===== Variable Classification Tool =====
    function addVariable() {
        var nameEl = document.getElementById('hb-var-name');
        var classEl = document.getElementById('hb-var-class');
        var name = nameEl.value.trim();
        var classification = classEl.value;

        if (!name) {
            Export.showToast('Please enter a variable name', 'error');
            return;
        }

        varIdCounter++;
        classifiedVars.push({ id: varIdCounter, name: name, classification: classification });
        nameEl.value = '';

        renderVarTable();
    }

    function removeVariable(id) {
        classifiedVars = classifiedVars.filter(function(v) { return v.id !== id; });
        renderVarTable();
    }

    function clearVariables() {
        classifiedVars = [];
        varIdCounter = 0;
        renderVarTable();
        App.setTrustedHTML(document.getElementById('hb-analysis-plan'), '');
    }

    function renderVarTable() {
        var el = document.getElementById('hb-var-table');
        if (!el) return;

        if (classifiedVars.length === 0) {
            App.setTrustedHTML(el, '<div style="color:var(--text-tertiary);font-size:0.85rem;padding:12px">No variables added yet. Add variables above to build your analysis framework.</div>');
            return;
        }

        var classColors = {
            independent: 'var(--accent)',
            dependent: 'var(--success)',
            confounder: 'var(--warning)',
            mediator: 'var(--info)',
            moderator: '#a78bfa',
            precision: 'var(--text-tertiary)'
        };

        var classLabels = {
            independent: 'Independent (Exposure)',
            dependent: 'Dependent (Outcome)',
            confounder: 'Confounder',
            mediator: 'Mediator',
            moderator: 'Effect Modifier',
            precision: 'Precision Variable'
        };

        var html = '<table class="data-table mt-2"><thead><tr><th>Variable</th><th>Classification</th><th>Action</th></tr></thead><tbody>';
        classifiedVars.forEach(function(v) {
            html += '<tr>'
                + '<td>' + v.name + '</td>'
                + '<td><span style="color:' + classColors[v.classification] + ';font-weight:600">' + classLabels[v.classification] + '</span></td>'
                + '<td><button class="btn btn-xs btn-secondary" onclick="HypothesisBuilder.removeVariable(' + v.id + ')">Remove</button></td>'
                + '</tr>';
        });
        html += '</tbody></table>';

        App.setTrustedHTML(el, html);
    }

    function generateAnalysisPlan() {
        if (classifiedVars.length === 0) {
            Export.showToast('Please add variables first', 'error');
            return;
        }

        var exposures = classifiedVars.filter(function(v) { return v.classification === 'independent'; });
        var outcomes = classifiedVars.filter(function(v) { return v.classification === 'dependent'; });
        var confounders = classifiedVars.filter(function(v) { return v.classification === 'confounder'; });
        var mediators = classifiedVars.filter(function(v) { return v.classification === 'mediator'; });
        var moderators = classifiedVars.filter(function(v) { return v.classification === 'moderator'; });
        var precision = classifiedVars.filter(function(v) { return v.classification === 'precision'; });

        var html = '<div class="result-panel animate-in mt-2">';
        html += '<div class="card-title">Analysis Plan Outline</div>';

        // Summary
        html += '<div style="margin:8px 0;padding:12px;background:var(--surface);border-radius:8px">'
            + '<strong style="color:var(--text-secondary);font-size:0.85rem">Variable Summary:</strong>'
            + '<div style="font-size:0.85rem;color:var(--text-secondary);margin-top:4px">'
            + (exposures.length > 0 ? '<span style="color:var(--accent)">Exposures:</span> ' + exposures.map(function(v) { return v.name; }).join(', ') + '<br>' : '')
            + (outcomes.length > 0 ? '<span style="color:var(--success)">Outcomes:</span> ' + outcomes.map(function(v) { return v.name; }).join(', ') + '<br>' : '')
            + (confounders.length > 0 ? '<span style="color:var(--warning)">Confounders:</span> ' + confounders.map(function(v) { return v.name; }).join(', ') + '<br>' : '')
            + (mediators.length > 0 ? '<span style="color:var(--info)">Mediators:</span> ' + mediators.map(function(v) { return v.name; }).join(', ') + '<br>' : '')
            + (moderators.length > 0 ? '<span style="color:#a78bfa">Effect Modifiers:</span> ' + moderators.map(function(v) { return v.name; }).join(', ') + '<br>' : '')
            + (precision.length > 0 ? '<span style="color:var(--text-tertiary)">Precision Variables:</span> ' + precision.map(function(v) { return v.name; }).join(', ') : '')
            + '</div></div>';

        // Analysis plan
        html += '<div class="card-title mt-2">Recommended Analysis Steps</div>';
        html += '<ol style="margin:0;padding-left:20px;color:var(--text-secondary);font-size:0.9rem;line-height:1.8">';

        html += '<li><strong>Descriptive analysis:</strong> Report baseline characteristics of all ' + classifiedVars.length + ' variables by exposure group.</li>';

        if (confounders.length > 0) {
            html += '<li><strong>Unadjusted analysis:</strong> Estimate the association between '
                + (exposures.length > 0 ? exposures[0].name : 'exposure')
                + ' and '
                + (outcomes.length > 0 ? outcomes[0].name : 'outcome')
                + ' without adjustment.</li>';
            html += '<li><strong>Adjusted analysis:</strong> Include confounders in the multivariable model: '
                + confounders.map(function(v) { return v.name; }).join(', ')
                + '. EPV check: ' + confounders.length + ' confounders require at least '
                + (confounders.length * 10) + ' events (EPV=10) or ideally '
                + (confounders.length * 20) + ' events (EPV=20).</li>';
        } else {
            html += '<li><strong>Primary analysis:</strong> Estimate the association between '
                + (exposures.length > 0 ? exposures[0].name : 'exposure')
                + ' and '
                + (outcomes.length > 0 ? outcomes[0].name : 'outcome')
                + '.</li>';
        }

        if (precision.length > 0) {
            html += '<li><strong>Precision variables:</strong> Include ' + precision.map(function(v) { return v.name; }).join(', ') + ' in the model to improve precision of the exposure-outcome estimate.</li>';
        }

        if (moderators.length > 0) {
            html += '<li><strong>Effect modification:</strong> Test interaction terms between '
                + (exposures.length > 0 ? exposures[0].name : 'exposure')
                + ' and each effect modifier ('
                + moderators.map(function(v) { return v.name; }).join(', ')
                + '). Report stratified estimates if interaction p &lt; 0.10.</li>';
        }

        if (mediators.length > 0) {
            html += '<li><strong>Mediation analysis (optional):</strong> If total and direct effects are of interest, conduct formal mediation analysis (e.g., causal mediation analysis) for '
                + mediators.map(function(v) { return v.name; }).join(', ') + '.</li>';
        }

        html += '<li><strong>Sensitivity analyses:</strong> Include alternative adjustment sets, complete-case analysis vs multiple imputation, and E-value for unmeasured confounding.</li>';
        html += '</ol>';

        // Methodological warnings
        var warnings = [];

        if (mediators.length > 0 && confounders.length > 0) {
            // Check if any mediator is also being adjusted for
            warnings.push({
                type: 'Mediator Adjustment',
                message: 'You have identified mediators (' + mediators.map(function(v) { return v.name; }).join(', ') + '). Do NOT include these in your primary multivariable model for the total effect. Adjusting for a mediator blocks part of the causal pathway and will attenuate your total effect estimate toward the null.',
                severity: 'danger'
            });
        }

        if (moderators.length > 0) {
            warnings.push({
                type: 'Interaction Testing',
                message: 'Effect modification tests typically require 4x the sample size of main effect tests. Ensure adequate power before pre-specifying interaction analyses. Consider reporting interaction results as exploratory unless the study was specifically powered for subgroup effects.',
                severity: 'warning'
            });
        }

        var totalModelVars = confounders.length + precision.length + (moderators.length > 0 ? moderators.length + exposures.length : 0);
        if (totalModelVars > 15) {
            warnings.push({
                type: 'Model Complexity',
                message: 'Your model includes ' + totalModelVars + ' variables (plus interactions). This requires at least ' + (totalModelVars * 10) + ' events for EPV=10. Consider reducing model complexity or using penalized regression (LASSO, ridge).',
                severity: 'warning'
            });
        }

        if (outcomes.length > 1) {
            warnings.push({
                type: 'Multiple Outcomes',
                message: 'You have ' + outcomes.length + ' outcomes. Consider multiplicity adjustments (Bonferroni, Holm) or pre-specifying a primary outcome with others as secondary/exploratory.',
                severity: 'info'
            });
        }

        if (warnings.length > 0) {
            html += '<div class="card-title mt-2">Methodological Warnings</div>';
            warnings.forEach(function(w) {
                var colors = { danger: 'var(--danger)', warning: 'var(--warning)', info: 'var(--info)' };
                html += '<div style="padding:10px;background:var(--surface);border-left:3px solid ' + colors[w.severity] + ';border-radius:0 8px 8px 0;margin:6px 0">'
                    + '<strong style="color:' + colors[w.severity] + ';font-size:0.85rem">' + w.type + ':</strong><br>'
                    + '<span style="color:var(--text-secondary);font-size:0.85rem">' + w.message + '</span>'
                    + '</div>';
            });
        }

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs btn-secondary" onclick="HypothesisBuilder.copyAnalysisPlan()">Copy Analysis Plan</button>'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('hb-analysis-plan'), html);
    }

    function copyAnalysisPlan() {
        var exposures = classifiedVars.filter(function(v) { return v.classification === 'independent'; });
        var outcomes = classifiedVars.filter(function(v) { return v.classification === 'dependent'; });
        var confounders = classifiedVars.filter(function(v) { return v.classification === 'confounder'; });
        var mediators = classifiedVars.filter(function(v) { return v.classification === 'mediator'; });
        var moderators = classifiedVars.filter(function(v) { return v.classification === 'moderator'; });

        var text = 'Analysis Plan\n'
            + 'Exposure(s): ' + exposures.map(function(v) { return v.name; }).join(', ') + '\n'
            + 'Outcome(s): ' + outcomes.map(function(v) { return v.name; }).join(', ') + '\n'
            + 'Confounders: ' + confounders.map(function(v) { return v.name; }).join(', ') + '\n'
            + (mediators.length > 0 ? 'Mediators (do not adjust for total effect): ' + mediators.map(function(v) { return v.name; }).join(', ') + '\n' : '')
            + (moderators.length > 0 ? 'Effect Modifiers: ' + moderators.map(function(v) { return v.name; }).join(', ') + '\n' : '')
            + 'Minimum events needed (EPV=10): ' + (confounders.length * 10);
        Export.copyText(text);
    }

    // Register module
    App.registerModule(MODULE_ID, { render: render });

    // Expose functions globally for onclick handlers
    window.HypothesisBuilder = {
        switchTab: switchTab,
        updateFramework: updateFramework,
        generateHypothesis: generateHypothesis,
        copyPICO: copyPICO,
        showDesignTree: showDesignTree,
        addVariable: addVariable,
        removeVariable: removeVariable,
        clearVariables: clearVariables,
        generateAnalysisPlan: generateAnalysisPlan,
        copyAnalysisPlan: copyAnalysisPlan
    };
})();
