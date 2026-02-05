/**
 * Neuro-Epi — Methods Generator
 * Auto-generates publication-ready statistical methods paragraphs for manuscripts.
 * Includes customizable parameters, common templates, and reporting checklists.
 */
(function() {
    'use strict';
    const MODULE_ID = 'methods-generator';

    /* ================================================================
       DATA: Analysis methods by outcome type, templates, checklists
       ================================================================ */

    var ANALYSIS_METHODS = {
        binary: [
            { value: 'chi2', label: 'Chi-squared test' },
            { value: 'fisher', label: "Fisher's exact test" },
            { value: 'logistic', label: 'Logistic regression' },
            { value: 'log-binomial', label: 'Log-binomial regression (RR)' },
            { value: 'modified-poisson', label: 'Modified Poisson regression (RR)' },
            { value: 'gee-binary', label: 'GEE (binary, clustered data)' },
            { value: 'mixed-logistic', label: 'Mixed-effects logistic regression' },
            { value: 'propensity', label: 'Propensity score-adjusted logistic regression' },
            { value: 'cmh', label: 'Cochran-Mantel-Haenszel test' }
        ],
        continuous: [
            { value: 'ttest', label: 'Independent samples t-test' },
            { value: 'paired-t', label: 'Paired t-test' },
            { value: 'anova', label: 'One-way ANOVA' },
            { value: 'ancova', label: 'ANCOVA' },
            { value: 'linear', label: 'Linear regression' },
            { value: 'mixed-linear', label: 'Linear mixed-effects model' },
            { value: 'wilcoxon', label: 'Wilcoxon rank-sum (Mann-Whitney U)' },
            { value: 'kruskal', label: 'Kruskal-Wallis test' },
            { value: 'gee-continuous', label: 'GEE (continuous, clustered data)' },
            { value: 'rmanova', label: 'Repeated measures ANOVA' }
        ],
        'time-to-event': [
            { value: 'logrank', label: 'Log-rank test' },
            { value: 'cox', label: 'Cox proportional hazards regression' },
            { value: 'km', label: 'Kaplan-Meier with log-rank' },
            { value: 'fine-gray', label: 'Fine-Gray competing risks regression' },
            { value: 'cox-td', label: 'Cox regression with time-dependent covariates' },
            { value: 'frailty', label: 'Shared frailty (clustered survival) model' },
            { value: 'parametric-surv', label: 'Parametric survival model (Weibull/exponential)' },
            { value: 'landmark', label: 'Landmark analysis' }
        ],
        ordinal: [
            { value: 'ordinal-logistic', label: 'Ordinal (proportional odds) logistic regression' },
            { value: 'wilcoxon-ord', label: 'Wilcoxon rank-sum test' },
            { value: 'cmh-ordinal', label: 'CMH test (row mean scores)' },
            { value: 'ordinal-mixed', label: 'Cumulative link mixed model' },
            { value: 'shift', label: 'Shift analysis (common OR)' }
        ],
        count: [
            { value: 'poisson', label: 'Poisson regression' },
            { value: 'negbin', label: 'Negative binomial regression' },
            { value: 'zip', label: 'Zero-inflated Poisson' },
            { value: 'zinb', label: 'Zero-inflated negative binomial' }
        ]
    };

    var MULTIPLICITY_METHODS = [
        { value: 'none', label: 'None (single primary outcome)' },
        { value: 'bonferroni', label: 'Bonferroni correction' },
        { value: 'holm', label: 'Holm step-down procedure' },
        { value: 'hochberg', label: 'Hochberg step-up procedure' },
        { value: 'bh', label: 'Benjamini-Hochberg (FDR)' },
        { value: 'hierarchical', label: 'Hierarchical (gatekeeping) testing' },
        { value: 'alpha-split', label: 'Alpha splitting across co-primary endpoints' }
    ];

    var MISSING_METHODS = [
        { value: 'complete', label: 'Complete case analysis' },
        { value: 'mi', label: 'Multiple imputation (MICE)' },
        { value: 'locf', label: 'Last observation carried forward (LOCF)' },
        { value: 'mmrm', label: 'Mixed model for repeated measures (MMRM)' },
        { value: 'ipw', label: 'Inverse probability weighting' },
        { value: 'pmm', label: 'Pattern mixture models' },
        { value: 'worst-case', label: 'Worst-case imputation (sensitivity)' }
    ];

    var SOFTWARE_OPTIONS = [
        { value: 'r', label: 'R (version 4.x)' },
        { value: 'stata', label: 'Stata (version 18)' },
        { value: 'sas', label: 'SAS (version 9.4)' },
        { value: 'spss', label: 'IBM SPSS (version 29)' },
        { value: 'python', label: 'Python (statsmodels / scipy)' },
        { value: 'prism', label: 'GraphPad Prism' },
        { value: 'jmp', label: 'JMP Pro' }
    ];

    var COMMON_TEMPLATES = {
        'rct-binary': {
            name: 'Two-Arm RCT (Binary Outcome)',
            text: 'The primary analysis compared the proportion of patients achieving [outcome] between the [intervention] and [control] groups using the chi-squared test (or Fisher\'s exact test if expected cell counts were <5). The primary analysis was conducted on the intention-to-treat (ITT) population, defined as all randomized participants analyzed according to their assigned treatment group regardless of adherence. The treatment effect was quantified as the absolute risk difference with its 95% confidence interval, along with the relative risk and number needed to treat (NNT). A pre-specified per-protocol analysis was conducted as a sensitivity analysis, restricted to participants who completed the study without major protocol violations. Subgroup analyses were performed for [pre-specified subgroups] using interaction tests between treatment assignment and subgroup variable in a logistic regression model. A two-sided alpha of 0.05 was used for the primary outcome. No adjustment for multiplicity was applied to secondary endpoints, which are reported as point estimates with 95% confidence intervals and should be interpreted as exploratory.'
        },
        'rct-continuous': {
            name: 'Two-Arm RCT (Continuous Outcome)',
            text: 'The primary outcome, [outcome measure], was compared between treatment groups using analysis of covariance (ANCOVA) with the baseline value as a covariate and treatment group as the independent variable. The treatment effect was estimated as the adjusted mean difference with 95% confidence interval. The primary analysis was based on the ITT population. Normality of residuals was assessed using the Shapiro-Wilk test and visual inspection of Q-Q plots. If the normality assumption was violated, the Wilcoxon rank-sum test was used as a sensitivity analysis, with the Hodges-Lehmann estimate of location shift and its 95% confidence interval. A mixed-effects model for repeated measures (MMRM) was used for longitudinal secondary outcomes, with an unstructured covariance matrix, including terms for treatment, visit, treatment-by-visit interaction, baseline value, and stratification factors. Model-based least squares means and their differences at each time point are reported with 95% confidence intervals.'
        },
        'tte-analysis': {
            name: 'Time-to-Event Analysis',
            text: 'Time-to-event outcomes were analyzed using the Kaplan-Meier method, with survival curves compared between groups using the log-rank test. Median survival times with 95% confidence intervals were estimated for each group. The treatment effect was quantified using a Cox proportional hazards regression model, yielding the hazard ratio (HR) with 95% confidence interval. The proportional hazards assumption was evaluated by examining scaled Schoenfeld residuals and testing for a time-by-treatment interaction; if violated, a time-varying coefficient or restricted mean survival time (RMST) analysis was planned. Participants who were event-free at the end of follow-up or lost to follow-up were censored at their last known alive date. Competing risks were handled using the Fine-Gray subdistribution hazard model, with the subdistribution HR reported alongside the cause-specific HR. Cumulative incidence functions were plotted to visualize the competing events. Multivariable Cox models included pre-specified covariates: [list covariates].'
        },
        'obs-propensity': {
            name: 'Observational Cohort with Propensity Score',
            text: 'To minimize confounding by indication, propensity scores for receipt of [exposure/treatment] were estimated using a multivariable logistic regression model including the following baseline covariates: [list covariates]. The propensity score model\'s discrimination was assessed using the C-statistic. Balance of covariates between groups was evaluated before and after adjustment using standardized mean differences (SMD), with an SMD <0.10 considered indicative of adequate balance. The primary analysis used inverse probability of treatment weighting (IPTW) with stabilized weights, trimmed at the 1st and 99th percentiles to reduce the influence of extreme weights. The average treatment effect (ATE) was estimated using a weighted [Cox / logistic / linear] regression model. Sensitivity analyses included: (1) propensity score matching using nearest-neighbor 1:1 matching with a caliper of 0.2 standard deviations of the logit of the propensity score; (2) doubly robust estimation combining IPTW with outcome regression; (3) the E-value to assess the robustness of findings to unmeasured confounding. A negative control outcome analysis was conducted to detect residual confounding.'
        },
        'meta-analysis-dl': {
            name: 'Meta-Analysis (DerSimonian-Laird)',
            text: 'A random-effects meta-analysis was conducted using the DerSimonian-Laird estimator for between-study variance (tau-squared). The pooled effect estimate was calculated as the weighted mean of study-specific estimates, with weights inversely proportional to the sum of within-study and between-study variance. Heterogeneity was assessed using Cochran\'s Q test (with significance at P<0.10 due to low power) and quantified using the I-squared statistic, interpreted as: <25% low, 25-75% moderate, >75% high heterogeneity. The prediction interval was reported to convey the range of true effects expected in future similar studies. Pre-specified subgroup analyses were conducted using random-effects meta-regression with the Knapp-Hartung adjustment for the confidence interval of the pooled estimate. Publication bias was assessed visually using a funnel plot and statistically using Egger\'s regression test (for continuous outcomes) or the Peters test (for binary outcomes with ORs). If publication bias was suspected, the trim-and-fill method was applied as a sensitivity analysis. A leave-one-out analysis was performed to assess the influence of individual studies. Results are presented as forest plots with study-level and pooled effect estimates and 95% confidence intervals.'
        },
        'diagnostic-accuracy': {
            name: 'Diagnostic Accuracy Study',
            text: 'Diagnostic accuracy was assessed by comparing the index test ([test name]) against the reference standard ([reference standard]) in a cross-sectional design. Sensitivity, specificity, positive predictive value (PPV), negative predictive value (NPV), and their 95% confidence intervals (Wilson method) were calculated from the 2x2 classification table. Positive and negative likelihood ratios with 95% CIs were derived. The area under the receiver operating characteristic (ROC) curve (AUC) was calculated to assess overall discriminative ability, with 95% CI estimated using the DeLong method. The optimal threshold was determined by maximizing the Youden index (J = sensitivity + specificity - 1). For comparison of two diagnostic tests, the difference in AUC was tested using the DeLong test for paired ROC curves. Calibration was assessed using the Hosmer-Lemeshow goodness-of-fit test and calibration plots. The study was designed and reported in accordance with the STARD (Standards for Reporting Diagnostic Accuracy) guidelines.'
        }
    };

    var REPORTING_CHECKLISTS = {
        consort: {
            name: 'CONSORT (RCTs)',
            items: [
                'Title: Identified as randomized trial',
                'Trial design: Description of trial design (parallel, factorial, etc.)',
                'Participants: Eligibility criteria, settings, locations',
                'Interventions: Details of interventions for each group with sufficient detail for replication',
                'Outcomes: Pre-specified primary and secondary outcomes, including how and when assessed',
                'Sample size: How sample size was determined (including interim analyses and stopping rules)',
                'Randomization: Method of generating allocation sequence, type, mechanism of allocation concealment',
                'Blinding: Who was blinded (participants, care providers, outcome assessors); how blinding was ensured',
                'Statistical methods: Methods used to compare groups for primary and secondary outcomes; methods for additional analyses (subgroup, adjusted)',
                'Participant flow: CONSORT flow diagram with numbers at each stage',
                'Baseline data: Table of baseline demographic and clinical characteristics by group',
                'Numbers analyzed: Number in each group included in each analysis and whether ITT',
                'Outcomes and estimation: For each outcome, effect size with CI and p-value',
                'Ancillary analyses: Subgroup and adjusted analyses, distinguishing pre-specified from exploratory',
                'Harms: All important harms or unintended effects in each group',
                'Registration: Registration number and registry name',
                'Protocol: Where full protocol can be accessed',
                'Funding: Sources of funding and role of funders'
            ]
        },
        strobe: {
            name: 'STROBE (Observational Studies)',
            items: [
                'Title/abstract: Indicate study design in title or abstract',
                'Background: Scientific background and rationale; specific objectives/hypotheses',
                'Study design: Present key elements of study design early in the paper',
                'Setting: Describe setting, locations, relevant dates (recruitment, exposure, follow-up, data collection)',
                'Participants: Eligibility criteria, sources, methods of selection, follow-up',
                'Variables: Define outcomes, exposures, predictors, confounders, effect modifiers; give diagnostic criteria',
                'Data sources: Describe measurement methods for each variable of interest',
                'Bias: Describe any efforts to address potential sources of bias',
                'Study size: Explain how the study size was arrived at',
                'Quantitative variables: Explain how quantitative variables were handled; describe groupings and rationale',
                'Statistical methods: Describe all statistical methods; how confounders were handled; how missing data were addressed; sensitivity analyses',
                'Participants: Numbers at each study stage (diagram recommended); reasons for non-participation',
                'Descriptive data: Characteristics of participants; number with missing data for each variable',
                'Outcome data: Numbers of outcome events or summary measures over time',
                'Main results: Unadjusted and adjusted estimates with CI and p-values; category boundaries if continuous variables were categorized',
                'Other analyses: Subgroup, interaction, sensitivity analyses',
                'Key results: Summarize key results with reference to study objectives',
                'Limitations: Discuss sources of bias or imprecision; direction and magnitude of bias',
                'Generalizability: Discuss external validity',
                'Funding: Sources of funding and role of funders'
            ]
        },
        prisma: {
            name: 'PRISMA (Systematic Reviews)',
            items: [
                'Title: Identify the report as a systematic review, meta-analysis, or both',
                'Protocol and registration: Registration info (PROSPERO); protocol access',
                'Eligibility criteria: Inclusion/exclusion criteria with rationale; PICO elements',
                'Information sources: All databases searched with dates; other sources (registries, contact with authors)',
                'Search strategy: Full electronic search strategy for at least one database; replicable',
                'Selection process: Process for selecting studies (screening, eligibility); number of reviewers',
                'Data collection: Process for data extraction; number of reviewers; how disagreements resolved',
                'Data items: List and define all variables for which data were sought',
                'Risk of bias assessment: Tool used (RoB 2, NOS, etc.); how applied; how used in synthesis',
                'Effect measures: Specify effect measures used (RR, OR, MD, SMD)',
                'Synthesis methods: Describe meta-analytic method; handling of heterogeneity; sensitivity/subgroup analyses',
                'Study selection: PRISMA flow diagram with numbers at each stage',
                'Study characteristics: Table of included studies with key characteristics',
                'Risk of bias results: Summary of risk of bias assessments',
                'Results of syntheses: Forest plots; pooled estimates with CI; heterogeneity statistics (I-squared, tau-squared)',
                'Publication bias: Results of publication bias assessment',
                'Certainty of evidence: GRADE assessment for each outcome',
                'Discussion: Summary, limitations of evidence, limitations of review, implications'
            ]
        }
    };

    /* ================================================================
       RENDER
       ================================================================ */

    function render(container) {
        var html = App.createModuleLayout(
            'Methods Generator',
            'Auto-generate publication-ready statistical methods paragraphs for manuscripts. Customize parameters and copy directly into your paper.'
        );

        // ---- Learn & Reference ----
        html += '<div class="card" style="background: var(--bg-secondary); border-left: 4px solid var(--accent-color);">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\')">📚 Learn &amp; Reference <span style="font-size:0.8em; color: var(--text-muted);">(click to expand)</span></div>';
        html += '<div class="learn-body hidden">';

        html += '<div style="margin-bottom:1rem;">';
        html += '<strong style="color:var(--accent);">Writing Principles</strong>';
        html += '<ul style="margin:0.3rem 0 0 1.2rem;font-size:0.85rem;line-height:1.7;">';
        html += '<li>Methods should be reproducible by another researcher</li>';
        html += '<li>Use past tense</li>';
        html += '<li>Report software and version</li>';
        html += '<li>State statistical significance threshold</li>';
        html += '<li>Describe handling of missing data</li>';
        html += '</ul></div>';

        html += '<div style="margin-bottom:1rem;">';
        html += '<strong style="color:var(--accent);">Key Elements</strong>';
        html += '<ul style="margin:0.3rem 0 0 1.2rem;font-size:0.85rem;line-height:1.7;">';
        html += '<li>Study design + setting + timeframe</li>';
        html += '<li>Population + eligibility criteria</li>';
        html += '<li>Intervention/exposure definition</li>';
        html += '<li>Outcome definition + measurement</li>';
        html += '<li>Sample size justification</li>';
        html += '<li>Statistical analysis plan</li>';
        html += '</ul></div>';

        html += '<div style="margin-bottom:1rem;">';
        html += '<strong style="color:var(--accent);">Style Guide</strong>';
        html += '<ul style="margin:0.3rem 0 0 1.2rem;font-size:0.85rem;line-height:1.7;">';
        html += '<li>Follow journal-specific instructions</li>';
        html += '<li>Use active voice for clarity</li>';
        html += '<li>Define abbreviations at first use</li>';
        html += '<li>Report exact p-values (not just &lt; 0.05)</li>';
        html += '<li>Include effect sizes with CIs</li>';
        html += '</ul></div>';

        html += '<div style="margin-bottom:1rem;">';
        html += '<strong style="color:var(--accent);">Common Pitfalls</strong>';
        html += '<ul style="margin:0.3rem 0 0 1.2rem;font-size:0.85rem;line-height:1.7;">';
        html += '<li>Vague analysis descriptions (&ldquo;standard statistical methods&rdquo;)</li>';
        html += '<li>Omitting software versions</li>';
        html += '<li>Not describing intention-to-treat vs per-protocol</li>';
        html += '<li>Insufficient detail on randomization/blinding</li>';
        html += '</ul></div>';

        html += '<div style="margin-bottom:0;">';
        html += '<strong style="color:var(--accent);">References</strong>';
        html += '<ul style="margin:0.3rem 0 0 1.2rem;font-size:0.85rem;line-height:1.7;">';
        html += '<li>ICMJE Recommendations</li>';
        html += '<li>Lang TA &amp; Secic M &mdash; <em>How to Report Statistics in Medicine</em></li>';
        html += '<li>Moher D et al &mdash; CONSORT 2010</li>';
        html += '</ul></div>';

        html += '</div></div>';

        // ---- Card 1: Study Parameters ----
        html += '<div class="card">';
        html += '<div class="card-title">Study Parameters</div>';
        html += '<div class="card-subtitle">Configure your study design and analysis approach. The generator will create a tailored methods paragraph.</div>';

        // Row 1: Design and sample size
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Study Design ' + App.tooltip('Select the overall study design. This shapes the structure of the generated text.') + '</label>';
        html += '<select class="form-select" id="mg_design" name="mg_design">';
        html += '<option value="parallel-rct">Parallel Group RCT</option>';
        html += '<option value="crossover-rct">Crossover RCT</option>';
        html += '<option value="cluster-rct">Cluster Randomized Trial</option>';
        html += '<option value="prospective-cohort">Prospective Cohort</option>';
        html += '<option value="retrospective-cohort">Retrospective Cohort</option>';
        html += '<option value="case-control">Case-Control Study</option>';
        html += '<option value="cross-sectional">Cross-Sectional Study</option>';
        html += '<option value="meta-analysis">Meta-Analysis</option>';
        html += '<option value="diagnostic">Diagnostic Accuracy Study</option>';
        html += '</select></div>';

        html += '<div class="form-group"><label class="form-label">Total Sample Size</label>';
        html += '<input type="number" class="form-input" id="mg_n" name="mg_n" value="200" min="1"></div>';

        html += '<div class="form-group"><label class="form-label">Number of Groups / Arms</label>';
        html += '<input type="number" class="form-input" id="mg_arms" name="mg_arms" value="2" min="1" max="10"></div>';
        html += '</div>';

        // Row 2: Alpha, power, outcome type
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Significance Level (alpha)</label>';
        html += '<select class="form-select" id="mg_alpha" name="mg_alpha">';
        html += '<option value="0.05">0.05 (two-sided)</option>';
        html += '<option value="0.01">0.01 (two-sided)</option>';
        html += '<option value="0.025">0.025 (one-sided)</option>';
        html += '<option value="0.10">0.10 (two-sided)</option>';
        html += '</select></div>';

        html += '<div class="form-group"><label class="form-label">Statistical Power</label>';
        html += '<select class="form-select" id="mg_power" name="mg_power">';
        html += '<option value="0.80">80%</option>';
        html += '<option value="0.85">85%</option>';
        html += '<option value="0.90" selected>90%</option>';
        html += '<option value="0.95">95%</option>';
        html += '</select></div>';

        html += '<div class="form-group"><label class="form-label">Primary Outcome Type ' + App.tooltip('Determines which analysis methods are available.') + '</label>';
        html += '<select class="form-select" id="mg_outcome" name="mg_outcome" onchange="MethodsGen.updateAnalysisMethods()">';
        html += '<option value="binary">Binary (proportion / event)</option>';
        html += '<option value="continuous">Continuous (mean / change score)</option>';
        html += '<option value="time-to-event">Time-to-Event (survival)</option>';
        html += '<option value="ordinal">Ordinal (ranked categories)</option>';
        html += '<option value="count">Count (rate data)</option>';
        html += '</select></div>';
        html += '</div>';

        // Row 3: Analysis method and software
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Primary Analysis Method</label>';
        html += '<select class="form-select" id="mg_analysis" name="mg_analysis">';
        var defaultMethods = ANALYSIS_METHODS['binary'];
        for (var m = 0; m < defaultMethods.length; m++) {
            html += '<option value="' + defaultMethods[m].value + '">' + defaultMethods[m].label + '</option>';
        }
        html += '</select></div>';

        html += '<div class="form-group"><label class="form-label">Statistical Software</label>';
        html += '<select class="form-select" id="mg_software" name="mg_software">';
        for (var sw = 0; sw < SOFTWARE_OPTIONS.length; sw++) {
            html += '<option value="' + SOFTWARE_OPTIONS[sw].value + '">' + SOFTWARE_OPTIONS[sw].label + '</option>';
        }
        html += '</select></div>';

        html += '<div class="form-group"><label class="form-label">Multiplicity Adjustment</label>';
        html += '<select class="form-select" id="mg_multiplicity" name="mg_multiplicity">';
        for (var mu = 0; mu < MULTIPLICITY_METHODS.length; mu++) {
            html += '<option value="' + MULTIPLICITY_METHODS[mu].value + '">' + MULTIPLICITY_METHODS[mu].label + '</option>';
        }
        html += '</select></div>';
        html += '</div>';

        // Row 4: Missing data and sensitivity analyses
        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Missing Data Approach</label>';
        html += '<select class="form-select" id="mg_missing" name="mg_missing">';
        for (var mi = 0; mi < MISSING_METHODS.length; mi++) {
            html += '<option value="' + MISSING_METHODS[mi].value + '">' + MISSING_METHODS[mi].label + '</option>';
        }
        html += '</select></div>';

        html += '<div class="form-group"><label class="form-label">Planned Sensitivity Analyses ' + App.tooltip('Describe additional sensitivity analyses to be included in the methods text.') + '</label>';
        html += '<input type="text" class="form-input" id="mg_sensitivity" name="mg_sensitivity" placeholder="e.g., per-protocol analysis, E-value, tipping point"></div>';
        html += '</div>';

        // Additional free-text inputs
        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Primary Outcome Description</label>';
        html += '<input type="text" class="form-input" id="mg_outcome_desc" name="mg_outcome_desc" placeholder="e.g., mRS 0-2 at 90 days"></div>';

        html += '<div class="form-group"><label class="form-label">Key Covariates / Confounders</label>';
        html += '<input type="text" class="form-input" id="mg_covariates" name="mg_covariates" placeholder="e.g., age, sex, baseline NIHSS, onset-to-treatment time"></div>';
        html += '</div>';

        html += '<div class="btn-group mt-2">';
        html += '<button class="btn btn-primary" onclick="MethodsGen.generate()">Generate Methods Text</button>';
        html += '</div>';
        html += '</div>';

        // ---- Card 2: Generated Methods Section ----
        html += '<div class="card">';
        html += '<div class="card-title">Generated Methods Section</div>';
        html += '<div class="card-subtitle">Review and copy the auto-generated text. Edit the bracketed placeholders with your specific details.</div>';
        html += '<div id="mg-output" class="result-panel" style="min-height:60px">';
        html += '<div class="result-detail">Click "Generate Methods Text" above to create your methods paragraph.</div>';
        html += '</div>';
        html += '<div class="btn-group mt-2">';
        html += '<button class="btn btn-secondary" onclick="MethodsGen.copyOutput()">Copy to Clipboard</button>';
        html += '</div>';
        html += '</div>';

        // ---- Card 3: Common Methods Templates ----
        html += '<div class="card">';
        html += '<div class="card-title">Common Methods Templates</div>';
        html += '<div class="card-subtitle">Pre-written, publication-ready methods paragraphs for common study types. Select a template, review, and customize.</div>';

        html += '<div class="form-group">';
        html += '<label class="form-label">Select Template</label>';
        html += '<select class="form-select" id="mg_template_sel" name="mg_template_sel" onchange="MethodsGen.showCommonTemplate()">';
        html += '<option value="">-- Choose a template --</option>';
        var tmplKeys = Object.keys(COMMON_TEMPLATES);
        for (var tk = 0; tk < tmplKeys.length; tk++) {
            html += '<option value="' + tmplKeys[tk] + '">' + COMMON_TEMPLATES[tmplKeys[tk]].name + '</option>';
        }
        html += '</select></div>';

        html += '<div id="mg-template-display"></div>';
        html += '</div>';

        // ---- Card 4: Reporting Checklist Quick Reference ----
        html += '<div class="card">';
        html += '<div class="card-title">Reporting Checklist Quick Reference</div>';
        html += '<div class="card-subtitle">Key reporting items from CONSORT, STROBE, and PRISMA guidelines. Click a section to expand.</div>';

        var checklistKeys = Object.keys(REPORTING_CHECKLISTS);
        for (var ck = 0; ck < checklistKeys.length; ck++) {
            var cl = REPORTING_CHECKLISTS[checklistKeys[ck]];
            html += '<div class="mb-1">';
            html += '<button class="btn btn-secondary" style="width:100%;text-align:left;font-weight:600" onclick="MethodsGen.toggleChecklist(\'' + checklistKeys[ck] + '\')">';
            html += cl.name + ' (' + cl.items.length + ' items)';
            html += '</button>';
            html += '<div id="mg-checklist-' + checklistKeys[ck] + '" class="hidden" style="padding:0.8em 0">';
            html += '<div style="font-size:0.85rem;line-height:1.8">';
            for (var ci = 0; ci < cl.items.length; ci++) {
                html += '<div style="padding:0.2em 0;border-bottom:1px solid var(--border-color)">';
                html += '<span style="color:var(--text-tertiary);margin-right:6px">' + (ci + 1) + '.</span>';
                html += cl.items[ci];
                html += '</div>';
            }
            html += '</div>';
            html += '<div class="btn-group mt-1">';
            html += '<button class="btn btn-xs btn-secondary" onclick="MethodsGen.copyChecklist(\'' + checklistKeys[ck] + '\')">Copy Checklist</button>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
        }

        html += '</div>';

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);
    }

    /* ================================================================
       ANALYSIS METHOD DROPDOWN UPDATE
       ================================================================ */

    function updateAnalysisMethods() {
        var outcomeType = document.getElementById('mg_outcome').value;
        var methodSelect = document.getElementById('mg_analysis');
        var methods = ANALYSIS_METHODS[outcomeType] || ANALYSIS_METHODS['binary'];

        var optionsHtml = '';
        for (var i = 0; i < methods.length; i++) {
            optionsHtml += '<option value="' + methods[i].value + '">' + methods[i].label + '</option>';
        }
        App.setTrustedHTML(methodSelect, optionsHtml);
    }

    /* ================================================================
       METHODS TEXT GENERATION
       ================================================================ */

    function getLabel(options, value) {
        for (var i = 0; i < options.length; i++) {
            if (options[i].value === value) return options[i].label;
        }
        return value;
    }

    function generate() {
        var design = document.getElementById('mg_design').value;
        var n = document.getElementById('mg_n').value;
        var arms = document.getElementById('mg_arms').value;
        var alpha = document.getElementById('mg_alpha').value;
        var power = document.getElementById('mg_power').value;
        var outcomeType = document.getElementById('mg_outcome').value;
        var analysis = document.getElementById('mg_analysis').value;
        var software = document.getElementById('mg_software').value;
        var multiplicity = document.getElementById('mg_multiplicity').value;
        var missing = document.getElementById('mg_missing').value;
        var sensitivity = document.getElementById('mg_sensitivity').value.trim();
        var outcomeDesc = document.getElementById('mg_outcome_desc').value.trim() || '[primary outcome]';
        var covariates = document.getElementById('mg_covariates').value.trim() || '[pre-specified covariates]';

        var outcomeTypeMethods = ANALYSIS_METHODS[outcomeType] || ANALYSIS_METHODS['binary'];
        var analysisLabel = getLabel(outcomeTypeMethods, analysis);
        var multiplicityLabel = getLabel(MULTIPLICITY_METHODS, multiplicity);
        var softwareLabel = getLabel(SOFTWARE_OPTIONS, software);
        var powerPct = Math.round(parseFloat(power) * 100);
        var perArm = Math.ceil(parseInt(n, 10) / parseInt(arms, 10));

        var text = '';

        // --- Sample Size Justification ---
        text += 'Sample Size Justification\n\n';
        text += 'A total sample size of ' + n + ' participants (' + perArm + ' per group across ' + arms + ' group' + (parseInt(arms) > 1 ? 's' : '') + ') was determined to provide ' + powerPct + '% power to detect a clinically meaningful difference in ' + outcomeDesc;
        text += ' at a two-sided significance level of ' + alpha + '.';

        if (outcomeType === 'binary') {
            text += ' The sample size calculation was based on a two-sample test of proportions, assuming [control event rate] and a minimum clinically important difference of [absolute risk difference].';
        } else if (outcomeType === 'continuous') {
            text += ' The calculation assumed a mean difference of [delta], a common standard deviation of [SD], and used the two-sample t-test formula.';
        } else if (outcomeType === 'time-to-event') {
            text += ' The calculation was based on the log-rank test, assuming an exponential distribution with a median [time] in the control group and a hazard ratio of [HR], with [duration] of accrual and [duration] of additional follow-up (Schoenfeld formula).';
        } else if (outcomeType === 'ordinal') {
            text += ' The sample size was estimated using the proportional odds model, assuming a common odds ratio of [cOR] across ordinal categories, with the expected distribution derived from [source].';
        } else if (outcomeType === 'count') {
            text += ' The sample size was based on a comparison of rates using [Poisson / negative binomial] assumptions, with an expected rate of [rate] in the reference group and a rate ratio of [RR].';
        }
        text += ' The sample size was inflated by [X]% to account for anticipated loss to follow-up.\n\n';

        // --- Statistical Analysis ---
        text += 'Statistical Analysis\n\n';

        // Design-specific opener
        if (design === 'parallel-rct') {
            text += 'The primary analysis was performed on the intention-to-treat (ITT) population, defined as all randomized participants analyzed according to their assigned treatment group regardless of protocol adherence. ';
        } else if (design === 'crossover-rct') {
            text += 'The primary analysis used a mixed-effects model with treatment, period, and sequence as fixed effects and participant nested within sequence as a random effect. A test for carryover was performed as a treatment-by-period interaction. ';
        } else if (design === 'cluster-rct') {
            text += 'The analysis accounted for the clustered design using [GEE with exchangeable correlation / mixed-effects models with a random intercept for cluster]. The intracluster correlation coefficient (ICC) is reported. ';
        } else if (design.indexOf('cohort') !== -1) {
            text += 'The analysis was conducted on all eligible participants meeting inclusion criteria who had complete baseline data. ';
        } else if (design === 'case-control') {
            text += 'Cases and controls were compared using conditional logistic regression to account for matching factors. ';
        } else if (design === 'cross-sectional') {
            text += 'Prevalence estimates with 95% confidence intervals were calculated. Associations between exposure and outcome were assessed using ';
        } else if (design === 'meta-analysis') {
            text += 'A random-effects meta-analysis was conducted using the DerSimonian-Laird estimator. Heterogeneity was quantified using the I-squared statistic and Cochran\'s Q test. ';
        } else if (design === 'diagnostic') {
            text += 'Diagnostic accuracy measures (sensitivity, specificity, positive and negative predictive values, likelihood ratios) were calculated with 95% Wilson confidence intervals. ';
        }

        // Analysis method sentence
        text += 'The primary outcome, ' + outcomeDesc + ', was analyzed using ' + analysisLabel + '. ';

        // Effect measure
        if (outcomeType === 'binary') {
            text += 'The treatment effect was reported as the odds ratio (or risk ratio if using a log-binomial / modified Poisson model) with 95% confidence interval and absolute risk difference. ';
        } else if (outcomeType === 'continuous') {
            text += 'The treatment effect was reported as the adjusted mean difference with 95% confidence interval. ';
        } else if (outcomeType === 'time-to-event') {
            text += 'The treatment effect was reported as the hazard ratio with 95% confidence interval. Kaplan-Meier survival curves were generated. ';
        } else if (outcomeType === 'ordinal') {
            text += 'The treatment effect was reported as the common odds ratio with 95% confidence interval under the proportional odds assumption. The proportional odds assumption was verified using the Brant test. ';
        } else if (outcomeType === 'count') {
            text += 'The treatment effect was reported as the incidence rate ratio with 95% confidence interval. Overdispersion was assessed, and a negative binomial model was used if the Poisson variance assumption was violated. ';
        }

        // Covariates
        if (covariates !== '[pre-specified covariates]') {
            text += 'Multivariable models were adjusted for the following pre-specified covariates: ' + covariates + '. ';
        } else {
            text += 'Multivariable models included pre-specified covariates: ' + covariates + '. ';
        }

        // Multiplicity
        if (multiplicity !== 'none') {
            text += 'To control for multiple comparisons, ' + multiplicityLabel + ' was applied. ';
        } else {
            text += 'No adjustment for multiplicity was applied to secondary endpoints, which should be interpreted as exploratory. ';
        }

        // Subgroup analyses
        text += 'Pre-specified subgroup analyses were conducted using interaction terms between the treatment variable and subgroup indicator in the regression model. Subgroup analyses are considered hypothesis-generating and are presented graphically.\n\n';

        // --- Handling of Missing Data ---
        text += 'Handling of Missing Data\n\n';
        if (missing === 'mi') {
            text += 'Missing data were handled using multiple imputation by chained equations (MICE) with ' + '[M=20]' + ' imputed datasets. The imputation model included the outcome, treatment assignment, and all covariates from the analysis model, along with auxiliary variables predictive of missingness. Rubin\'s rules were used to pool parameter estimates and standard errors across imputed datasets. ';
        } else if (missing === 'complete') {
            text += 'The primary analysis was conducted on complete cases (participants with no missing data for the primary outcome and key covariates). The proportion of missing data is reported, and the missing-at-random assumption was assessed by comparing baseline characteristics of completers and non-completers. ';
        } else if (missing === 'locf') {
            text += 'Missing outcome data were imputed using the last observation carried forward (LOCF) approach. This was complemented by a sensitivity analysis using multiple imputation. ';
        } else if (missing === 'mmrm') {
            text += 'The mixed model for repeated measures (MMRM) approach was used, which implicitly handles missing data under the missing-at-random (MAR) assumption by using all available data. An unstructured covariance matrix was specified. ';
        } else if (missing === 'ipw') {
            text += 'Inverse probability of censoring weights were used to account for informative missing data. Weights were estimated using a logistic regression model for the probability of completing the study, conditional on baseline covariates and treatment assignment. Stabilized weights were used, and extreme weights were truncated at the 1st and 99th percentiles. ';
        } else if (missing === 'pmm') {
            text += 'Pattern mixture models were used to assess the sensitivity of results to different missing data mechanisms, including missing-not-at-random (MNAR) scenarios. ';
        } else if (missing === 'worst-case') {
            text += 'A worst-case imputation sensitivity analysis was performed, assigning unfavorable outcomes to all participants with missing data in the treatment group and favorable outcomes to those in the control group. ';
        }
        text += '\n\n';

        // --- Sensitivity Analyses ---
        text += 'Sensitivity Analyses\n\n';
        text += 'The following sensitivity analyses were planned a priori: ';
        var sensItems = [];
        if (design.indexOf('rct') !== -1) {
            sensItems.push('(1) per-protocol analysis restricted to participants who completed the study without major protocol deviations');
        }
        if (missing !== 'complete') {
            sensItems.push('(' + (sensItems.length + 1) + ') complete case analysis as a comparison to the primary imputation approach');
        }
        if (design.indexOf('cohort') !== -1 || design === 'case-control') {
            sensItems.push('(' + (sensItems.length + 1) + ') E-value calculation to quantify robustness to unmeasured confounding');
            sensItems.push('(' + (sensItems.length + 1) + ') quantitative bias analysis for key potential biases');
        }
        if (sensitivity) {
            sensItems.push('(' + (sensItems.length + 1) + ') ' + sensitivity);
        }
        if (sensItems.length === 0) {
            sensItems.push('(1) analysis with alternate model specifications or distributional assumptions');
        }
        text += sensItems.join('; ') + '.\n\n';

        // --- Software ---
        text += 'Software\n\n';
        text += 'All statistical analyses were performed using ' + softwareLabel + '. ';
        if (software === 'r') {
            text += 'Key packages included [list packages, e.g., survival, lme4, mice, ggplot2]. ';
        } else if (software === 'stata') {
            text += 'Key commands included [list commands, e.g., stcox, melogit, mi impute]. ';
        } else if (software === 'sas') {
            text += 'Key procedures included [list procedures, e.g., PROC PHREG, PROC LOGISTIC, PROC MI]. ';
        }
        text += 'A two-sided P value <' + alpha + ' was considered statistically significant for the primary outcome. All confidence intervals are reported at the 95% level.\n';

        // Store and display
        window._mgGeneratedText = text;
        displayOutput(text);

        Export.showToast('Methods text generated successfully.', 'success');
    }

    function displayOutput(text) {
        var el = document.getElementById('mg-output');
        var html = '<div class="animate-in" style="white-space:pre-wrap;font-size:0.9rem;line-height:1.8;font-family:Georgia,serif">';
        // Bold section headers
        var formatted = text
            .replace(/^(Sample Size Justification)/m, '<strong style="font-size:1rem">$1</strong>')
            .replace(/^(Statistical Analysis)/m, '<strong style="font-size:1rem">$1</strong>')
            .replace(/^(Handling of Missing Data)/m, '<strong style="font-size:1rem">$1</strong>')
            .replace(/^(Sensitivity Analyses)/m, '<strong style="font-size:1rem">$1</strong>')
            .replace(/^(Software)/m, '<strong style="font-size:1rem">$1</strong>')
            .replace(/\[([^\]]+)\]/g, '<span style="background:var(--accent-muted);padding:0 4px;border-radius:3px;font-family:inherit">[$1]</span>');
        html += formatted;
        html += '</div>';
        App.setTrustedHTML(el, html);
    }

    function copyOutput() {
        if (!window._mgGeneratedText) {
            Export.showToast('No methods text generated yet.', 'error');
            return;
        }
        Export.copyText(window._mgGeneratedText);
    }

    /* ================================================================
       COMMON TEMPLATES
       ================================================================ */

    function showCommonTemplate() {
        var sel = document.getElementById('mg_template_sel').value;
        var displayEl = document.getElementById('mg-template-display');
        if (!sel || !COMMON_TEMPLATES[sel]) {
            App.setTrustedHTML(displayEl, '');
            return;
        }

        var t = COMMON_TEMPLATES[sel];
        var html = '<div class="result-panel animate-in mt-2">';
        html += '<div class="card-subtitle">' + t.name + '</div>';
        html += '<div style="white-space:pre-wrap;font-size:0.88rem;line-height:1.8;font-family:Georgia,serif;background:var(--bg-offset);padding:1em;border-radius:8px;margin-top:0.5em">';

        var formatted = t.text.replace(/\[([^\]]+)\]/g, '<span style="background:var(--accent-muted);padding:0 4px;border-radius:3px">[$1]</span>');
        html += formatted;
        html += '</div>';
        html += '<div class="btn-group mt-2">';
        html += '<button class="btn btn-secondary" onclick="MethodsGen.copyCommonTemplate()">Copy Template</button>';
        html += '</div>';
        html += '</div>';

        App.setTrustedHTML(displayEl, html);
    }

    function copyCommonTemplate() {
        var sel = document.getElementById('mg_template_sel').value;
        if (!sel || !COMMON_TEMPLATES[sel]) return;
        Export.copyText(COMMON_TEMPLATES[sel].text);
    }

    /* ================================================================
       CHECKLISTS
       ================================================================ */

    function toggleChecklist(key) {
        var el = document.getElementById('mg-checklist-' + key);
        if (!el) return;
        if (el.classList.contains('hidden')) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    }

    function copyChecklist(key) {
        var cl = REPORTING_CHECKLISTS[key];
        if (!cl) return;
        var text = cl.name + ' Checklist\n\n';
        for (var i = 0; i < cl.items.length; i++) {
            text += (i + 1) + '. ' + cl.items[i] + '\n';
        }
        Export.copyText(text);
    }

    /* ================================================================
       REGISTER
       ================================================================ */

    App.registerModule(MODULE_ID, { render: render });

    window.MethodsGen = {
        updateAnalysisMethods: updateAnalysisMethods,
        generate: generate,
        copyOutput: copyOutput,
        showCommonTemplate: showCommonTemplate,
        copyCommonTemplate: copyCommonTemplate,
        toggleChecklist: toggleChecklist,
        copyChecklist: copyChecklist
    };
})();
