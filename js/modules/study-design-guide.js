/**
 * Neuro-Epi — Study Design Guide
 * Interactive decision tree and comprehensive reference for selecting
 * the right epidemiological study design. Includes design templates,
 * bias reference, and Oxford CEBM evidence levels.
 */
(function() {
    'use strict';
    const MODULE_ID = 'study-design-guide';

    /* ================================================================
       DATA: Study designs, biases, templates
       ================================================================ */

    var DESIGNS = [
        {
            name: 'Meta-Analysis',
            level: '1a',
            strengths: 'Highest statistical power; quantitative synthesis of multiple studies; can resolve conflicting results; identifies overall effect with precision',
            limitations: 'Garbage-in-garbage-out; heterogeneity can limit conclusions; publication bias; requires comparable studies; ecological fallacy at study level',
            when: 'Multiple studies exist on the same question and need quantitative synthesis',
            example: 'Meta-analysis of thrombectomy RCTs (HERMES collaboration) pooling individual patient data from 5 trials'
        },
        {
            name: 'Systematic Review',
            level: '1a',
            strengths: 'Comprehensive; reproducible methodology; reduces bias in study selection; transparent search and appraisal',
            limitations: 'Time-intensive; limited by quality of included studies; publication bias; may not be feasible for all questions',
            when: 'Need to comprehensively summarize evidence on a clinical question',
            example: 'Cochrane review of anticoagulation for secondary stroke prevention in atrial fibrillation'
        },
        {
            name: 'Randomized Controlled Trial (RCT)',
            level: '1b',
            strengths: 'Strongest causal inference; controls for known and unknown confounders; randomization eliminates selection bias; blinding reduces information bias',
            limitations: 'Expensive; time-consuming; ethical constraints; may lack external validity; volunteer bias; intention-to-treat may dilute effect',
            when: 'Testing efficacy of a treatment/intervention; ethical equipoise exists; adequate sample size is feasible',
            example: 'MR CLEAN: RCT of intra-arterial treatment for acute ischemic stroke due to proximal intracranial occlusion'
        },
        {
            name: 'Cohort (Prospective)',
            level: '2b',
            strengths: 'Establishes temporal sequence; can calculate incidence and RR; good for rare exposures; multiple outcomes from one exposure',
            limitations: 'Expensive and time-consuming; attrition bias; not efficient for rare outcomes; confounding possible',
            when: 'Studying the effect of an exposure on multiple outcomes over time; RCT not feasible or ethical',
            example: 'Framingham Heart Study: prospective follow-up of stroke risk factors over decades'
        },
        {
            name: 'Cohort (Retrospective)',
            level: '2b',
            strengths: 'Faster and cheaper than prospective; can calculate RR; good for rare exposures; uses existing data',
            limitations: 'Dependent on data quality; cannot control data collection; recall and information bias; confounding',
            when: 'Studying exposure-outcome relationships using existing records; time constraints prevent prospective design',
            example: 'Retrospective cohort study of statin use and hemorrhagic transformation after tPA using hospital records'
        },
        {
            name: 'Case-Control',
            level: '3b',
            strengths: 'Efficient for rare diseases; relatively quick and inexpensive; can study multiple exposures; calculates OR',
            limitations: 'Cannot calculate incidence or RR directly; recall bias; selection bias in control choice; temporal ambiguity',
            when: 'Studying rare outcomes; hypothesis generation; limited time/budget; multiple exposures of interest',
            example: 'Case-control study of oral contraceptive use and young-onset ischemic stroke'
        },
        {
            name: 'Cross-Sectional',
            level: '4',
            strengths: 'Quick; inexpensive; generates prevalence data; good for planning; can study multiple outcomes and exposures simultaneously',
            limitations: 'Cannot establish temporal sequence or causation; prevalence not incidence; survivor bias; susceptible to confounding',
            when: 'Estimating disease prevalence; needs assessment; hypothesis generation; resource-limited settings',
            example: 'NHANES survey estimating prevalence of undiagnosed atrial fibrillation in the US population'
        },
        {
            name: 'Ecological',
            level: '5',
            strengths: 'Uses readily available data; inexpensive; can study population-level exposures (e.g., policy, pollution); generates hypotheses',
            limitations: 'Ecological fallacy; cannot make individual-level inferences; confounding at group level; data quality varies',
            when: 'Studying population-level exposures; comparing geographic regions; hypothesis generation',
            example: 'Ecological study of regional stroke mortality rates and air pollution levels across US counties'
        },
        {
            name: 'Case Series',
            level: '4',
            strengths: 'Simple to conduct; useful for rare diseases; generates hypotheses; describes clinical spectrum; no control group needed',
            limitations: 'No comparison group; no causal inference; selection bias; reporting bias; cannot calculate rates',
            when: 'Describing unusual presentations; early characterization of a new condition; rare disease descriptions',
            example: 'Case series of 12 patients with COVID-19-associated large vessel occlusion stroke'
        },
        {
            name: 'Case Report',
            level: '5',
            strengths: 'First signal of new diseases/adverse effects; educational value; rapid publication; clinically detailed',
            limitations: 'No generalizability; no statistical analysis; publication bias; anecdotal evidence only',
            when: 'Reporting novel or unusual clinical findings; rare adverse events; unique therapeutic approaches',
            example: 'Case report of reversible cerebral vasoconstriction syndrome mimicking aneurysmal SAH'
        }
    ];

    var BIASES = [
        { phase: 'Selection', name: 'Selection Bias (general)', definition: 'Systematic error arising from the way participants are selected or retained in a study, leading to a sample that is not representative of the target population.', direction: 'Can bias in either direction depending on mechanism.', strategies: 'Random sampling; clearly defined eligibility criteria; high participation rates; compare responders vs. non-responders.' },
        { phase: 'Selection', name: "Berkson's Bias", definition: 'Selection bias specific to hospital-based case-control studies. Hospitalized patients have different exposure profiles than the general population because hospital admission itself is related to both exposure and disease.', direction: 'Often creates a spurious inverse association.', strategies: 'Use population-based controls; avoid hospital-based case-control designs when possible; use multiple control groups.' },
        { phase: 'Selection', name: 'Healthy Worker Effect', definition: 'Workers tend to be healthier than the general population, leading to underestimation of occupational risk when comparing to general population rates.', direction: 'Biases toward the null (underestimates risk).', strategies: 'Use employed comparison groups; internal comparisons within the workforce; standardize by employment status.' },
        { phase: 'Selection', name: 'Volunteer/Self-Selection Bias', definition: 'People who volunteer for studies differ systematically from those who do not (healthier, more educated, more compliant).', direction: 'Variable; often biases toward healthier outcomes.', strategies: 'Maximize recruitment from target population; use population-based registries; assess representativeness.' },
        { phase: 'Selection', name: 'Immortal Time Bias', definition: 'A period of follow-up during which the outcome cannot occur by definition is misclassified, artificially inflating survival in the exposed group.', direction: 'Biases toward a protective effect of exposure.', strategies: 'Time-dependent exposure modeling; landmark analysis; exclude immortal time from analysis; use proper cohort entry definitions.' },
        { phase: 'Information', name: 'Recall Bias', definition: 'Cases may recall exposures differently (usually more completely) than controls, particularly in case-control studies.', direction: 'Usually overestimates association.', strategies: 'Use objective exposure measures; blinded assessment; validated questionnaires; prospective data collection; use records rather than self-report.' },
        { phase: 'Information', name: 'Measurement/Misclassification Bias', definition: 'Errors in measuring exposure or outcome. Differential misclassification depends on the other variable; non-differential does not.', direction: 'Non-differential usually biases toward null; differential can bias in either direction.', strategies: 'Standardized, validated instruments; blinded assessors; calibration; training protocols; duplicate measurements.' },
        { phase: 'Information', name: 'Detection/Surveillance Bias', definition: 'More intensive monitoring of exposed individuals leads to greater detection of outcomes compared to unexposed.', direction: 'Overestimates association.', strategies: 'Equal follow-up protocols for all groups; blinded outcome assessment; standardized surveillance intensity.' },
        { phase: 'Information', name: 'Lead-Time Bias', definition: 'Earlier detection through screening appears to increase survival time, even if the true time of death is unchanged.', direction: 'Overestimates survival benefit of screening.', strategies: 'Use mortality as endpoint rather than survival from diagnosis; use disease-specific mortality; randomize screening assignment.' },
        { phase: 'Information', name: 'Length-Time Bias', definition: 'Screening preferentially detects slow-growing, less aggressive disease, making screened cases appear to have better prognosis.', direction: 'Overestimates screening benefit.', strategies: 'Use RCT design for screening studies; analyze by intention-to-screen; compare mortality rates rather than case fatality.' },
        { phase: 'Confounding', name: 'Confounding', definition: 'A third variable is associated with both the exposure and the outcome, distorting the observed association. Must be a common cause (or proxy) of both.', direction: 'Can bias in either direction.', strategies: 'Randomization; restriction; matching; stratification; multivariable regression; propensity scores; instrumental variables; DAG-guided analysis.' },
        { phase: 'Confounding', name: 'Confounding by Indication', definition: 'In observational studies, the indication for treatment is itself a risk factor for the outcome, confounding the treatment-outcome relationship.', direction: 'Usually biases against treatment (sicker patients receive treatment).', strategies: 'Propensity score methods; instrumental variables; active comparator designs; restriction to narrow indication.' },
        { phase: 'Confounding', name: 'Collider Bias', definition: 'Conditioning on a common effect (collider) of exposure and outcome (or their causes) creates a spurious association.', direction: 'Variable; can create associations where none exist.', strategies: 'DAG-based analysis planning; avoid conditioning on post-treatment variables; sensitivity analyses.' },
        { phase: 'Attrition', name: 'Attrition/Loss-to-Follow-Up Bias', definition: 'Systematic differences between those who complete the study and those who drop out, particularly if dropout is related to both exposure and outcome.', direction: 'Variable direction depending on mechanism.', strategies: 'Minimize dropout; ITT analysis; sensitivity analyses (worst-case, best-case); multiple imputation; inverse probability weighting.' },
        { phase: 'Attrition', name: 'Differential Attrition', definition: 'Dropout rates differ between study groups, and reasons for dropout are related to the outcome.', direction: 'Usually biases toward or away from null depending on direction of dropout.', strategies: 'Monitor dropout by group; per-protocol and ITT analyses; CACE estimation; pattern mixture models.' }
    ];

    var DECISION_QUESTIONS = [
        {
            id: 'q_goal',
            text: 'What is the primary goal of your study?',
            options: [
                { value: 'prevalence', label: 'Estimate disease/condition prevalence' },
                { value: 'etiology', label: 'Identify risk factors or causes' },
                { value: 'treatment', label: 'Evaluate a treatment or intervention' },
                { value: 'prognosis', label: 'Determine prognosis or natural history' },
                { value: 'diagnosis', label: 'Evaluate a diagnostic test' },
                { value: 'synthesize', label: 'Synthesize existing evidence' }
            ]
        },
        {
            id: 'q_timing',
            text: 'What is the temporal relationship between exposure/intervention and outcome measurement?',
            options: [
                { value: 'simultaneous', label: 'Exposure and outcome measured at the same time' },
                { value: 'forward', label: 'Start with exposure, follow forward to outcome' },
                { value: 'backward', label: 'Start with outcome (cases), look back for exposure' },
                { value: 'na', label: 'Not applicable (synthesis or diagnostic study)' }
            ]
        },
        {
            id: 'q_randomize',
            text: 'Is randomization of the exposure/intervention feasible and ethical?',
            options: [
                { value: 'yes', label: 'Yes - randomization is feasible and ethical' },
                { value: 'no_ethical', label: 'No - would be unethical (e.g., smoking, harmful exposure)' },
                { value: 'no_feasible', label: 'No - logistically infeasible' },
                { value: 'na', label: 'Not applicable' }
            ]
        },
        {
            id: 'q_outcome_freq',
            text: 'How common is the outcome of interest?',
            options: [
                { value: 'common', label: 'Common (>10% in population)' },
                { value: 'uncommon', label: 'Uncommon (1-10%)' },
                { value: 'rare', label: 'Rare (<1%)' },
                { value: 'na', label: 'Not applicable' }
            ]
        },
        {
            id: 'q_data',
            text: 'What data sources are available?',
            options: [
                { value: 'new', label: 'Will collect new primary data prospectively' },
                { value: 'existing', label: 'Existing records, databases, or registries' },
                { value: 'published', label: 'Published literature / existing studies' },
                { value: 'both', label: 'Both new and existing data' }
            ]
        }
    ];

    var TEMPLATES = {
        'parallel-rct': {
            name: 'Parallel Group RCT',
            pico: 'P: [Target population with condition]\nI: [Intervention, dose, duration]\nC: [Control/placebo, dose, duration]\nO: [Primary outcome, measurement timepoint]',
            endpoint: 'Binary: proportion achieving favorable outcome at [timepoint]\nOR Continuous: mean change in [scale] at [timepoint]',
            sampleSize: 'Two-sample test of proportions (or means). Use alpha=0.05, power=0.80-0.90. Inflate by 10-20% for dropout. Consider adaptive designs for uncertain effect sizes.',
            analysis: '1. Primary: Intention-to-treat (ITT) analysis\n2. Test: Chi-squared or Fisher exact (binary); t-test or ANCOVA (continuous)\n3. Effect measure: Absolute risk difference + 95% CI; NNT\n4. Sensitivity: Per-protocol analysis; multiple imputation for missing data\n5. Subgroup: Pre-specified, limited in number, interaction tests',
            timeline: 'Protocol development: 3-6 months\nIRB/regulatory: 3-6 months\nRecruitment: 12-36 months\nFollow-up: per protocol\nAnalysis & publication: 6-12 months\nTotal: 2-5 years typical'
        },
        'crossover-rct': {
            name: 'Crossover RCT',
            pico: 'P: [Stable chronic condition; patients serve as own controls]\nI: [Intervention, dose, duration per period]\nC: [Control/placebo, dose, duration per period]\nO: [Outcome measured at end of each period]',
            endpoint: 'Within-subject difference in [outcome] between treatment periods',
            sampleSize: 'Paired analysis reduces required N substantially. Key: adequate washout period. Use paired t-test or mixed model. Account for period and carryover effects.',
            analysis: '1. Primary: Mixed-effects model with treatment, period, sequence, subject(sequence)\n2. Test for carryover effect (treatment x period interaction)\n3. If carryover significant, analyze period 1 only\n4. Effect measure: Mean difference with 95% CI\n5. Account for within-subject correlation',
            timeline: 'Shorter recruitment but longer per-patient duration.\nWashout period: typically 5 half-lives of intervention\nTotal: 1-3 years typical'
        },
        'cluster-rct': {
            name: 'Cluster Randomized Trial',
            pico: 'P: [Clusters: hospitals/clinics/communities]\nI: [Cluster-level or individual-level intervention]\nC: [Usual care or alternative at cluster level]\nO: [Individual-level outcome measured within clusters]',
            endpoint: 'Proportion or mean at individual level, accounting for clustering',
            sampleSize: 'Inflate individual-level N by design effect = 1 + (m-1)*ICC, where m = cluster size, ICC = intracluster correlation. Typical ICC for clinical outcomes: 0.01-0.05. Need adequate number of clusters (minimum 6-8 per arm).',
            analysis: '1. Primary: GEE or mixed-effects model accounting for clustering\n2. Report ICC and design effect\n3. Adjust for cluster-level and individual-level covariates\n4. Consider informative cluster size\n5. Sensitivity: varying correlation structure',
            timeline: 'Protocol: 3-6 months\nCluster recruitment: 6-12 months\nIndividual enrollment: 12-24 months\nTotal: 2-4 years typical'
        },
        'prospective-cohort': {
            name: 'Prospective Cohort Study',
            pico: 'P: [Defined cohort free of outcome at baseline]\nE: [Exposure of interest, measurement method]\nC: [Unexposed or different exposure level]\nO: [Incident outcome(s), ascertainment method, follow-up duration]',
            endpoint: 'Incidence rate or cumulative incidence of [outcome] by exposure status',
            sampleSize: 'Based on expected incidence in unexposed, minimum detectable RR, alpha, power. For rare outcomes, consider person-time approach. Account for loss to follow-up (typically 5-15% per year).',
            analysis: '1. Primary: Cox proportional hazards (time-to-event) or Poisson/log-binomial regression\n2. Effect: Hazard ratio or incidence rate ratio with 95% CI\n3. Confounding: DAG-guided covariate selection; multivariable models; propensity scores\n4. Missing data: Multiple imputation\n5. Sensitivity: E-value for unmeasured confounding; negative control outcomes',
            timeline: 'Setup: 6-12 months\nRecruitment: 12-36 months\nFollow-up: 2-20+ years\nTotal: highly variable, often 5+ years'
        },
        'retrospective-cohort': {
            name: 'Retrospective Cohort Study',
            pico: 'P: [Historical cohort identified from records/registries]\nE: [Exposure, ascertained from existing data]\nC: [Unexposed comparator]\nO: [Outcome(s) ascertained from records]',
            endpoint: 'Same as prospective cohort but using historical data',
            sampleSize: 'Often determined by available data. Power calculation based on available N, expected effect size, and event rate. May need to demonstrate adequate power post-hoc.',
            analysis: '1. Primary: Cox PH or logistic regression\n2. Address time-related biases: immortal time, time-varying exposures\n3. Active comparator preferred over non-user comparator\n4. New-user design to avoid prevalent-user bias\n5. Sensitivity: High-dimensional propensity scores; quantitative bias analysis',
            timeline: 'Data access/agreements: 1-6 months\nData cleaning/preparation: 1-3 months\nAnalysis: 2-6 months\nTotal: 6-18 months typical'
        },
        'nested-cc': {
            name: 'Nested Case-Control Study',
            pico: 'P: [Cases and controls sampled from within a defined cohort]\nE: [Exposure measured from stored specimens or detailed records]\nC: [Controls matched on time/risk-set sampling from same cohort]\nO: [Incident outcome that defines case status]',
            endpoint: 'Odds ratio approximating incidence rate ratio (with incidence density sampling)',
            sampleSize: 'Cases: all incident cases in cohort. Controls: 2-4 per case typically. Power depends on case count, control ratio, and expected OR.',
            analysis: '1. Primary: Conditional logistic regression (matched analysis)\n2. Incidence density sampling yields OR = IRR\n3. Control for matching factors and confounders\n4. Efficient for expensive biomarker measurements\n5. Sensitivity: vary control-to-case ratio; unmeasured confounding assessment',
            timeline: 'Depends on parent cohort timeline.\nNested analysis: 3-12 months\nBiomarker assays: 1-6 months\nTotal from initiation: 6-18 months'
        },
        'pop-cc': {
            name: 'Population-Based Case-Control Study',
            pico: 'P: [Cases from population-based registry; controls from same source population]\nE: [Exposure(s) measured by interview, records, or biomarkers]\nC: [Population controls (random digit dialing, registry-based)]\nO: [Case status (the disease/condition)]',
            endpoint: 'Odds ratio for association between exposure and disease',
            sampleSize: 'Based on expected prevalence of exposure in controls, minimum detectable OR, case-to-control ratio (1:1 to 1:4), alpha, power.',
            analysis: '1. Primary: Unconditional or conditional logistic regression\n2. Multiple control groups to assess selection bias\n3. Matched analysis if frequency or individual matching used\n4. Stratified analysis for effect modification\n5. Sensitivity: vary case/control definitions; assess recall bias impact',
            timeline: 'Protocol/IRB: 3-6 months\nCase ascertainment: 12-36 months\nControl recruitment: concurrent\nAnalysis: 3-6 months\nTotal: 2-4 years typical'
        },
        'cross-sectional': {
            name: 'Cross-Sectional Survey',
            pico: 'P: [Defined target population at a specific time]\nE: [Exposure/characteristic of interest]\nC: [Unexposed/different characteristic level]\nO: [Prevalence of outcome at the survey time]',
            endpoint: 'Prevalence of [condition/outcome]; prevalence ratio or prevalence OR',
            sampleSize: 'Based on expected prevalence, desired precision (CI width), population size (if finite), design effect (if cluster sampling).',
            analysis: '1. Descriptive: Prevalence with 95% CI (Wilson or Clopper-Pearson)\n2. Analytic: Log-binomial for prevalence ratios; logistic regression for prevalence OR\n3. Account for survey design: weighting, stratification, clustering\n4. Cannot establish causation - association only\n5. Assess non-response bias',
            timeline: 'Protocol/IRB: 2-4 months\nSurvey development/piloting: 2-4 months\nData collection: 1-6 months\nAnalysis: 2-4 months\nTotal: 6-18 months typical'
        }
    };

    /* ================================================================
       RENDER
       ================================================================ */

    function render(container) {
        var html = App.createModuleLayout(
            'Study Design Guide',
            'Interactive decision support for selecting the optimal epidemiological study design. Includes evidence hierarchy, design templates, and a comprehensive bias reference.'
        );

        // ---- Card 1: Decision Tree ----
        html += '<div class="card">';
        html += '<div class="card-title">Study Design Decision Tree</div>';
        html += '<div class="card-subtitle">Answer the questions below and receive a tailored study design recommendation with reasoning.</div>';

        for (var i = 0; i < DECISION_QUESTIONS.length; i++) {
            var q = DECISION_QUESTIONS[i];
            html += '<div class="form-group">';
            html += '<label class="form-label">' + (i + 1) + '. ' + q.text + '</label>';
            html += '<select class="form-select" id="sdg_' + q.id + '" name="sdg_' + q.id + '">';
            html += '<option value="">-- Select --</option>';
            for (var j = 0; j < q.options.length; j++) {
                html += '<option value="' + q.options[j].value + '">' + q.options[j].label + '</option>';
            }
            html += '</select>';
            html += '</div>';
        }

        html += '<div class="btn-group mt-2">';
        html += '<button class="btn btn-primary" onclick="StudyDesignGuide.recommend()">Get Recommendation</button>';
        html += '<button class="btn btn-secondary" onclick="StudyDesignGuide.resetDecision()">Reset</button>';
        html += '</div>';

        html += '<div id="sdg-recommendation"></div>';
        html += '</div>';

        // ---- Card 2: Study Design Reference Table ----
        html += '<div class="card">';
        html += '<div class="card-title">Study Design Reference Table</div>';
        html += '<div class="card-subtitle">Comprehensive comparison of study designs with Oxford Centre for Evidence-Based Medicine (CEBM) evidence levels.</div>';

        html += '<div class="table-container">';
        html += '<table class="data-table">';
        html += '<thead><tr>';
        html += '<th>Design</th><th>CEBM Level</th><th>Strengths</th><th>Limitations</th><th>When to Use</th><th>Example</th>';
        html += '</tr></thead>';
        html += '<tbody>';

        for (var d = 0; d < DESIGNS.length; d++) {
            var ds = DESIGNS[d];
            html += '<tr>';
            html += '<td><strong>' + ds.name + '</strong></td>';
            html += '<td style="text-align:center;font-weight:600;color:var(--accent)">' + ds.level + '</td>';
            html += '<td style="font-size:0.82rem">' + ds.strengths + '</td>';
            html += '<td style="font-size:0.82rem">' + ds.limitations + '</td>';
            html += '<td style="font-size:0.82rem">' + ds.when + '</td>';
            html += '<td style="font-size:0.82rem;font-style:italic">' + ds.example + '</td>';
            html += '</tr>';
        }

        html += '</tbody></table>';
        html += '</div>';

        // Evidence pyramid text
        html += '<div class="result-panel mt-2">';
        html += '<div class="card-subtitle">Oxford CEBM Levels of Evidence (2011)</div>';
        html += '<div style="font-size:0.85rem;line-height:1.7">';
        html += '<strong>Level 1a:</strong> Systematic reviews of RCTs (with homogeneity)<br>';
        html += '<strong>Level 1b:</strong> Individual RCT (with narrow CI)<br>';
        html += '<strong>Level 1c:</strong> All-or-none studies<br>';
        html += '<strong>Level 2a:</strong> Systematic reviews of cohort studies<br>';
        html += '<strong>Level 2b:</strong> Individual cohort study or low-quality RCT<br>';
        html += '<strong>Level 2c:</strong> Outcomes research; ecological studies<br>';
        html += '<strong>Level 3a:</strong> Systematic review of case-control studies<br>';
        html += '<strong>Level 3b:</strong> Individual case-control study<br>';
        html += '<strong>Level 4:</strong> Case series, cross-sectional studies<br>';
        html += '<strong>Level 5:</strong> Expert opinion, bench research, case reports<br>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        // ---- Card 3: Design Templates ----
        html += '<div class="card">';
        html += '<div class="card-title">Study Design Templates</div>';
        html += '<div class="card-subtitle">Pre-built templates with PICO/PECO structure, endpoints, sample size approach, analysis plan, and typical timeline. Select a design to view and copy.</div>';

        html += '<div class="form-group">';
        html += '<label class="form-label">Select Study Design Template</label>';
        html += '<select class="form-select" id="sdg_template_select" name="sdg_template_select" onchange="StudyDesignGuide.showTemplate()">';
        html += '<option value="">-- Choose a template --</option>';
        var tKeys = Object.keys(TEMPLATES);
        for (var t = 0; t < tKeys.length; t++) {
            html += '<option value="' + tKeys[t] + '">' + TEMPLATES[tKeys[t]].name + '</option>';
        }
        html += '</select>';
        html += '</div>';

        html += '<div id="sdg-template-display"></div>';
        html += '</div>';

        // ---- Card 4: Bias & Confounding Quick Reference ----
        html += '<div class="card">';
        html += '<div class="card-title">Bias &amp; Confounding Quick Reference</div>';
        html += '<div class="card-subtitle">Common biases organized by study phase. Includes definition, direction of bias, and strategies to minimize each.</div>';

        // Phase filter
        html += '<div class="form-group">';
        html += '<label class="form-label">Filter by Phase</label>';
        html += '<select class="form-select" id="sdg_bias_filter" name="sdg_bias_filter" onchange="StudyDesignGuide.filterBiases()">';
        html += '<option value="all">All Phases</option>';
        html += '<option value="Selection">Selection</option>';
        html += '<option value="Information">Information / Measurement</option>';
        html += '<option value="Confounding">Confounding</option>';
        html += '<option value="Attrition">Attrition / Follow-up</option>';
        html += '</select>';
        html += '</div>';

        html += '<div class="table-container" id="sdg-bias-table-container">';
        html += buildBiasTable('all');
        html += '</div>';

        // Key principles
        html += '<div class="result-panel mt-2">';
        html += '<div class="card-subtitle">Key Principles for Minimizing Bias</div>';
        html += '<div style="font-size:0.85rem;line-height:1.8">';
        html += '<strong>1. Internal Validity:</strong> The degree to which results are free from systematic error. Randomization, blinding, and rigorous protocols are the primary tools.<br>';
        html += '<strong>2. External Validity:</strong> Generalizability. Broad eligibility, pragmatic designs, and multi-site recruitment improve it.<br>';
        html += '<strong>3. Directed Acyclic Graphs (DAGs):</strong> Use causal diagrams to identify confounders, mediators, and colliders before analysis. Tools: DAGitty, ggdag.<br>';
        html += '<strong>4. E-value:</strong> Quantifies the minimum strength of unmeasured confounding needed to explain away an observed association. Always report for observational studies.<br>';
        html += '<strong>5. Quantitative Bias Analysis (QBA):</strong> Formally model the impact of selection bias, misclassification, and confounding. Consider for all observational studies.<br>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);
    }

    /* ================================================================
       DECISION TREE LOGIC
       ================================================================ */

    function recommend() {
        var goal = document.getElementById('sdg_q_goal').value;
        var timing = document.getElementById('sdg_q_timing').value;
        var randomize = document.getElementById('sdg_q_randomize').value;
        var outcomeFreq = document.getElementById('sdg_q_outcome_freq').value;
        var data = document.getElementById('sdg_q_data').value;

        if (!goal) {
            Export.showToast('Please answer at least the first question (study goal).', 'error');
            return;
        }

        var recommendations = [];
        var reasoning = [];

        // Synthesis
        if (goal === 'synthesize') {
            recommendations.push('Meta-Analysis', 'Systematic Review');
            reasoning.push('Your goal is to synthesize existing evidence. A systematic review provides a comprehensive, reproducible summary. If studies are sufficiently homogeneous, a meta-analysis provides a quantitative pooled estimate.');
            if (data === 'published') {
                reasoning.push('You indicated published literature is your data source, which is consistent with a synthesis design.');
            }
        }
        // Diagnosis
        else if (goal === 'diagnosis') {
            recommendations.push('Cross-Sectional (Diagnostic Accuracy)');
            reasoning.push('Diagnostic accuracy studies are cross-sectional in nature: the index test and reference standard are applied at approximately the same time. Follow STARD guidelines.');
            if (data === 'existing') {
                recommendations.push('Retrospective Diagnostic Accuracy Study');
                reasoning.push('Using existing data, a retrospective diagnostic accuracy study is feasible. Ensure consecutive or random sampling of patients.');
            }
        }
        // Prevalence
        else if (goal === 'prevalence') {
            recommendations.push('Cross-Sectional Survey');
            reasoning.push('Cross-sectional designs are the standard for estimating disease prevalence at a specific point in time.');
            if (timing === 'simultaneous') {
                reasoning.push('Simultaneous measurement of exposure and outcome confirms the cross-sectional approach.');
            }
        }
        // Treatment evaluation
        else if (goal === 'treatment') {
            if (randomize === 'yes') {
                recommendations.push('Randomized Controlled Trial (RCT)');
                reasoning.push('Randomization is feasible and ethical. An RCT provides the strongest evidence for treatment efficacy by controlling for both known and unknown confounders.');
                if (outcomeFreq === 'rare') {
                    reasoning.push('Note: With a rare outcome, you will need a large sample size. Consider a multi-center trial or adaptive design.');
                }
            } else if (randomize === 'no_ethical' || randomize === 'no_feasible') {
                if (timing === 'forward') {
                    recommendations.push('Prospective Cohort Study');
                    reasoning.push('Randomization is not feasible/ethical, but you can follow participants forward in time. A prospective cohort study is the next strongest design.');
                    reasoning.push('Use propensity score methods or instrumental variables to address confounding by indication.');
                } else if (timing === 'backward') {
                    recommendations.push('Case-Control Study');
                    reasoning.push('Starting from the outcome and looking back at exposure is a case-control design. Consider a nested case-control within an existing cohort for greater validity.');
                } else {
                    recommendations.push('Retrospective Cohort Study', 'Propensity-Score Matched Cohort');
                    reasoning.push('Without the ability to randomize, and using existing data, a retrospective cohort with advanced confounding adjustment (propensity scores, IPTW) is recommended.');
                }
                if (outcomeFreq === 'rare') {
                    recommendations.push('Case-Control Study');
                    reasoning.push('For rare outcomes, case-control designs are more efficient than cohort studies because you over-sample cases.');
                }
            }
        }
        // Etiology / risk factors
        else if (goal === 'etiology') {
            if (timing === 'forward' && data === 'new') {
                recommendations.push('Prospective Cohort Study');
                reasoning.push('Prospective follow-up from exposure to outcome establishes temporal sequence and allows incidence rate calculation. This is ideal for studying etiology.');
            } else if (timing === 'forward' && (data === 'existing' || data === 'both')) {
                recommendations.push('Retrospective Cohort Study');
                reasoning.push('Using existing records, a retrospective cohort preserves the temporal sequence of exposure preceding outcome.');
            } else if (timing === 'backward') {
                recommendations.push('Case-Control Study');
                reasoning.push('Starting from disease status and looking back at exposures is efficient, especially for rare diseases or multiple exposures.');
            } else if (timing === 'simultaneous') {
                recommendations.push('Cross-Sectional Study');
                reasoning.push('Measuring exposure and outcome simultaneously can identify associations but cannot establish causation. This is useful for hypothesis generation.');
            }
            if (outcomeFreq === 'rare') {
                if (recommendations.indexOf('Case-Control Study') === -1) {
                    recommendations.push('Case-Control Study');
                }
                reasoning.push('For rare outcomes, case-control studies are the most efficient design because they guarantee adequate case numbers.');
            }
        }
        // Prognosis
        else if (goal === 'prognosis') {
            recommendations.push('Prospective Cohort Study');
            reasoning.push('Prognosis studies require following patients over time from a defined inception point. A prospective cohort is the gold standard for prognostic research.');
            if (data === 'existing') {
                recommendations.push('Retrospective Cohort Study');
                reasoning.push('Using existing records, a retrospective cohort can also address prognostic questions, though data quality may be limited.');
            }
        }

        // Fallback
        if (recommendations.length === 0) {
            recommendations.push('Prospective Cohort Study', 'Cross-Sectional Study');
            reasoning.push('Based on your responses, a cohort or cross-sectional design may be appropriate. Consider the specific research question and available resources to refine this recommendation.');
        }

        // Deduplicate recommendations
        var uniqueRecs = [];
        for (var r = 0; r < recommendations.length; r++) {
            if (uniqueRecs.indexOf(recommendations[r]) === -1) {
                uniqueRecs.push(recommendations[r]);
            }
        }

        // Build output
        var out = '<div class="result-panel animate-in mt-2">';
        out += '<div class="card-title">Recommended Study Design' + (uniqueRecs.length > 1 ? 's' : '') + '</div>';

        for (var k = 0; k < uniqueRecs.length; k++) {
            var rank = k === 0 ? 'Primary Recommendation' : 'Alternative Option';
            out += '<div class="result-value" style="font-size:1.3rem">' + (k + 1) + '. ' + uniqueRecs[k] + '</div>';
            out += '<div class="result-label">' + rank + '</div>';
        }

        out += '<div class="card-subtitle mt-2">Reasoning</div>';
        out += '<div style="font-size:0.9rem;line-height:1.7">';
        for (var p = 0; p < reasoning.length; p++) {
            out += '<p style="margin:0.4em 0">' + reasoning[p] + '</p>';
        }
        out += '</div>';

        // Text-based flowchart explanation
        out += '<div class="card-subtitle mt-2">Decision Pathway</div>';
        out += '<div style="font-family:monospace;font-size:0.82rem;line-height:1.6;padding:1em;background:var(--bg-offset);border-radius:8px">';
        out += 'START<br>';
        out += '  |<br>';
        out += '  +-- Goal: ' + (goal || '?') + '<br>';
        if (goal === 'synthesize') {
            out += '  |     +-- Published literature available? -> Systematic Review / Meta-Analysis<br>';
        } else if (goal === 'diagnosis') {
            out += '  |     +-- Diagnostic test evaluation -> Cross-sectional accuracy study (STARD)<br>';
        } else if (goal === 'prevalence') {
            out += '  |     +-- Prevalence estimation -> Cross-sectional survey<br>';
        } else {
            out += '  |<br>';
            out += '  +-- Randomization feasible? ' + (randomize || '?') + '<br>';
            if (randomize === 'yes') {
                out += '  |     +-- YES -> RCT<br>';
            } else {
                out += '  |     +-- NO -> Observational design<br>';
                out += '  |         |<br>';
                out += '  |         +-- Timing: ' + (timing || '?') + '<br>';
                if (timing === 'forward') {
                    out += '  |         |    +-- Forward -> Cohort study<br>';
                } else if (timing === 'backward') {
                    out += '  |         |    +-- Backward -> Case-control<br>';
                } else {
                    out += '  |         |    +-- Simultaneous -> Cross-sectional<br>';
                }
                out += '  |         |<br>';
                out += '  |         +-- Outcome frequency: ' + (outcomeFreq || '?') + '<br>';
                if (outcomeFreq === 'rare') {
                    out += '  |              +-- Rare -> Case-control preferred<br>';
                }
            }
        }
        out += '  |<br>';
        out += '  END -> ' + uniqueRecs[0] + '<br>';
        out += '</div>';

        out += '</div>';

        App.setTrustedHTML(document.getElementById('sdg-recommendation'), out);
    }

    function resetDecision() {
        for (var i = 0; i < DECISION_QUESTIONS.length; i++) {
            var el = document.getElementById('sdg_' + DECISION_QUESTIONS[i].id);
            if (el) el.value = '';
        }
        App.setTrustedHTML(document.getElementById('sdg-recommendation'), '');
    }

    /* ================================================================
       TEMPLATES
       ================================================================ */

    function showTemplate() {
        var sel = document.getElementById('sdg_template_select').value;
        var displayEl = document.getElementById('sdg-template-display');
        if (!sel || !TEMPLATES[sel]) {
            App.setTrustedHTML(displayEl, '');
            return;
        }

        var t = TEMPLATES[sel];
        var html = '<div class="result-panel animate-in mt-2">';
        html += '<div class="card-title">' + t.name + ' Template</div>';

        var sections = [
            { label: 'PICO / PECO Framework', content: t.pico },
            { label: 'Suggested Primary Endpoint', content: t.endpoint },
            { label: 'Sample Size Approach', content: t.sampleSize },
            { label: 'Analysis Plan', content: t.analysis },
            { label: 'Typical Timeline', content: t.timeline }
        ];

        for (var s = 0; s < sections.length; s++) {
            html += '<div class="card-subtitle mt-2">' + sections[s].label + '</div>';
            html += '<div style="font-size:0.88rem;line-height:1.7;white-space:pre-line;background:var(--bg-offset);padding:0.8em 1em;border-radius:6px;margin-top:0.3em">';
            html += sections[s].content;
            html += '</div>';
        }

        html += '<div class="btn-group mt-2">';
        html += '<button class="btn btn-secondary" onclick="StudyDesignGuide.copyTemplate()">Copy Template to Clipboard</button>';
        html += '</div>';
        html += '</div>';

        App.setTrustedHTML(displayEl, html);
    }

    function copyTemplate() {
        var sel = document.getElementById('sdg_template_select').value;
        if (!sel || !TEMPLATES[sel]) return;
        var t = TEMPLATES[sel];
        var text = '=== ' + t.name + ' Template ===\n\n';
        text += 'PICO / PECO:\n' + t.pico + '\n\n';
        text += 'Primary Endpoint:\n' + t.endpoint + '\n\n';
        text += 'Sample Size Approach:\n' + t.sampleSize + '\n\n';
        text += 'Analysis Plan:\n' + t.analysis + '\n\n';
        text += 'Timeline:\n' + t.timeline + '\n';
        Export.copyText(text);
    }

    /* ================================================================
       BIAS TABLE
       ================================================================ */

    function buildBiasTable(phase) {
        var html = '<table class="data-table">';
        html += '<thead><tr>';
        html += '<th>Phase</th><th>Bias Type</th><th>Definition</th><th>Direction</th><th>Mitigation Strategies</th>';
        html += '</tr></thead>';
        html += '<tbody>';

        for (var b = 0; b < BIASES.length; b++) {
            var bias = BIASES[b];
            if (phase !== 'all' && bias.phase !== phase) continue;

            var phaseColor = '';
            if (bias.phase === 'Selection') phaseColor = '#4e79a7';
            else if (bias.phase === 'Information') phaseColor = '#e15759';
            else if (bias.phase === 'Confounding') phaseColor = '#f28e2b';
            else if (bias.phase === 'Attrition') phaseColor = '#76b7b2';

            html += '<tr>';
            html += '<td><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + phaseColor + ';margin-right:6px"></span>' + bias.phase + '</td>';
            html += '<td><strong>' + bias.name + '</strong></td>';
            html += '<td style="font-size:0.82rem">' + bias.definition + '</td>';
            html += '<td style="font-size:0.82rem">' + bias.direction + '</td>';
            html += '<td style="font-size:0.82rem">' + bias.strategies + '</td>';
            html += '</tr>';
        }

        html += '</tbody></table>';
        return html;
    }

    function filterBiases() {
        var phase = document.getElementById('sdg_bias_filter').value;
        var cont = document.getElementById('sdg-bias-table-container');
        App.setTrustedHTML(cont, buildBiasTable(phase));
    }

    /* ================================================================
       REGISTER
       ================================================================ */

    App.registerModule(MODULE_ID, { render: render });

    window.StudyDesignGuide = {
        recommend: recommend,
        resetDecision: resetDecision,
        showTemplate: showTemplate,
        copyTemplate: copyTemplate,
        filterBiases: filterBiases
    };
})();
