/**
 * Neuro-Epi — Project Planner
 * Research project planning: timeline builder, milestone tracker, budget calculator,
 * regulatory checklist, and sample size quick estimator.
 */
(function() {
    'use strict';
    const MODULE_ID = 'project-planner';

    /* ------------------------------------------------------------------ */
    /*  State                                                              */
    /* ------------------------------------------------------------------ */
    var phases = [
        { name: 'Protocol Development', startMonth: 1, duration: 3, status: 'not-started', notes: '' },
        { name: 'IRB / Ethics Review',  startMonth: 3, duration: 2, status: 'not-started', notes: '' },
        { name: 'Recruitment',           startMonth: 5, duration: 12, status: 'not-started', notes: '' },
        { name: 'Data Collection',       startMonth: 5, duration: 18, status: 'not-started', notes: '' },
        { name: 'Data Analysis',         startMonth: 20, duration: 4, status: 'not-started', notes: '' },
        { name: 'Manuscript Writing',    startMonth: 23, duration: 3, status: 'not-started', notes: '' },
        { name: 'Submission / Revision', startMonth: 26, duration: 6, status: 'not-started', notes: '' }
    ];

    var milestones = [];
    var regulatoryState = {};

    /* ------------------------------------------------------------------ */
    /*  Milestone templates                                                */
    /* ------------------------------------------------------------------ */
    var milestoneTemplates = {
        'clinical-trial': [
            { name: 'IND/IDE Submission', targetDate: '', status: 'not-started', priority: 'high' },
            { name: 'IND/IDE Approval', targetDate: '', status: 'not-started', priority: 'high' },
            { name: 'IRB Initial Approval', targetDate: '', status: 'not-started', priority: 'high' },
            { name: 'ClinicalTrials.gov Registration', targetDate: '', status: 'not-started', priority: 'high' },
            { name: 'DSMB Charter Approved', targetDate: '', status: 'not-started', priority: 'high' },
            { name: 'Site Initiation Visit', targetDate: '', status: 'not-started', priority: 'medium' },
            { name: 'First Patient Enrolled', targetDate: '', status: 'not-started', priority: 'high' },
            { name: '25% Enrollment Target', targetDate: '', status: 'not-started', priority: 'medium' },
            { name: '50% Enrollment Target', targetDate: '', status: 'not-started', priority: 'medium' },
            { name: '75% Enrollment Target', targetDate: '', status: 'not-started', priority: 'medium' },
            { name: 'Enrollment Complete', targetDate: '', status: 'not-started', priority: 'high' },
            { name: 'Interim Analysis', targetDate: '', status: 'not-started', priority: 'medium' },
            { name: 'Last Patient Last Visit', targetDate: '', status: 'not-started', priority: 'high' },
            { name: 'Database Lock', targetDate: '', status: 'not-started', priority: 'high' },
            { name: 'Primary Analysis Complete', targetDate: '', status: 'not-started', priority: 'high' },
            { name: 'Manuscript Submitted', targetDate: '', status: 'not-started', priority: 'medium' }
        ],
        'observational': [
            { name: 'Protocol Finalized', targetDate: '', status: 'not-started', priority: 'high' },
            { name: 'IRB Approval', targetDate: '', status: 'not-started', priority: 'high' },
            { name: 'Data Use Agreement Executed', targetDate: '', status: 'not-started', priority: 'high' },
            { name: 'Data Extraction Complete', targetDate: '', status: 'not-started', priority: 'medium' },
            { name: 'Cohort Definition Finalized', targetDate: '', status: 'not-started', priority: 'high' },
            { name: 'Variable Coding Complete', targetDate: '', status: 'not-started', priority: 'medium' },
            { name: 'Data Cleaning Complete', targetDate: '', status: 'not-started', priority: 'medium' },
            { name: 'Statistical Analysis Plan Finalized', targetDate: '', status: 'not-started', priority: 'high' },
            { name: 'Primary Analysis Complete', targetDate: '', status: 'not-started', priority: 'high' },
            { name: 'Sensitivity Analyses Complete', targetDate: '', status: 'not-started', priority: 'medium' },
            { name: 'Manuscript Draft Complete', targetDate: '', status: 'not-started', priority: 'medium' },
            { name: 'Manuscript Submitted', targetDate: '', status: 'not-started', priority: 'high' }
        ],
        'systematic-review': [
            { name: 'PROSPERO Registration', targetDate: '', status: 'not-started', priority: 'high' },
            { name: 'Protocol Published/Finalized', targetDate: '', status: 'not-started', priority: 'high' },
            { name: 'Search Strategy Validated', targetDate: '', status: 'not-started', priority: 'high' },
            { name: 'Database Searches Complete', targetDate: '', status: 'not-started', priority: 'high' },
            { name: 'Title/Abstract Screening Complete', targetDate: '', status: 'not-started', priority: 'medium' },
            { name: 'Full-Text Screening Complete', targetDate: '', status: 'not-started', priority: 'medium' },
            { name: 'Data Extraction Complete', targetDate: '', status: 'not-started', priority: 'medium' },
            { name: 'Risk of Bias Assessment Complete', targetDate: '', status: 'not-started', priority: 'medium' },
            { name: 'Meta-Analysis Complete', targetDate: '', status: 'not-started', priority: 'high' },
            { name: 'GRADE Assessment Complete', targetDate: '', status: 'not-started', priority: 'medium' },
            { name: 'Manuscript Draft Complete', targetDate: '', status: 'not-started', priority: 'medium' },
            { name: 'Manuscript Submitted', targetDate: '', status: 'not-started', priority: 'high' }
        ]
    };

    /* ------------------------------------------------------------------ */
    /*  Regulatory checklist items                                         */
    /* ------------------------------------------------------------------ */
    var regulatoryItems = {
        irb: [
            { id: 'irb-protocol', text: 'Study protocol (complete, current version)' },
            { id: 'irb-consent', text: 'Informed consent form(s)' },
            { id: 'irb-assent', text: 'Assent form (if minors involved)' },
            { id: 'irb-hipaa', text: 'HIPAA authorization form' },
            { id: 'irb-instruments', text: 'Data collection instruments (CRFs, questionnaires)' },
            { id: 'irb-brochure', text: 'Investigator\'s Brochure (for drug/device trials)' },
            { id: 'irb-ind', text: 'IND/IDE number (if applicable)' },
            { id: 'irb-dsmb', text: 'DSMB/DMC charter' },
            { id: 'irb-dmp', text: 'Data management plan' },
            { id: 'irb-sap', text: 'Statistical analysis plan' },
            { id: 'irb-coc', text: 'Certificate of confidentiality' },
            { id: 'irb-citi', text: 'CITI training certificates (all key personnel)' },
            { id: 'irb-cv', text: 'CV/biosketch for PI and key personnel' },
            { id: 'irb-conflict', text: 'Conflict of interest disclosures' },
            { id: 'irb-recruit', text: 'Recruitment materials (flyers, ads, scripts)' },
            { id: 'irb-budget', text: 'Study budget (if participant compensation involved)' },
            { id: 'irb-reliance', text: 'Reliance agreement (for multi-site studies)' },
            { id: 'irb-letter', text: 'Department/division approval letter' }
        ],
        ctgov: [
            { id: 'ct-responsible', text: 'Responsible Party designated' },
            { id: 'ct-title', text: 'Official title and brief title' },
            { id: 'ct-summary', text: 'Brief summary and detailed description' },
            { id: 'ct-design', text: 'Study design details (type, allocation, masking, etc.)' },
            { id: 'ct-arms', text: 'Arms/groups and interventions described' },
            { id: 'ct-primary', text: 'Primary outcome measure(s) with time frame' },
            { id: 'ct-secondary', text: 'Secondary outcome measure(s) with time frame' },
            { id: 'ct-eligibility', text: 'Eligibility criteria (inclusion/exclusion)' },
            { id: 'ct-contacts', text: 'Contact information and facility locations' },
            { id: 'ct-irb', text: 'IRB/Ethics committee information' },
            { id: 'ct-sponsor', text: 'Sponsor and collaborator information' },
            { id: 'ct-dates', text: 'Anticipated start/completion dates' },
            { id: 'ct-enrollment', text: 'Target enrollment number' },
            { id: 'ct-prs', text: 'Protocol Registration System (PRS) account set up' }
        ],
        fda: [
            { id: 'fda-form1571', text: 'FDA Form 1571 (IND application)' },
            { id: 'fda-form1572', text: 'FDA Form 1572 (Statement of Investigator)' },
            { id: 'fda-form3674', text: 'FDA Form 3674 (Certification of Compliance with ClinicalTrials.gov)' },
            { id: 'fda-protocol', text: 'Clinical protocol with amendments' },
            { id: 'fda-brochure', text: 'Investigator\'s Brochure (current version)' },
            { id: 'fda-cmc', text: 'Chemistry, Manufacturing, and Controls (CMC) information' },
            { id: 'fda-pharma', text: 'Pharmacology and toxicology data' },
            { id: 'fda-previous', text: 'Previous human experience with the investigational product' },
            { id: 'fda-dsur', text: 'Development Safety Update Report (DSUR) plan' },
            { id: 'fda-sae', text: 'Serious Adverse Event (SAE) reporting procedures' },
            { id: 'fda-gmp', text: 'GMP compliance documentation for study drug/device' },
            { id: 'fda-labeling', text: 'Labeling for investigational product' },
            { id: 'fda-environ', text: 'Environmental assessment or claim for exemption' }
        ]
    };

    /* ------------------------------------------------------------------ */
    /*  Sample size quick reference data                                   */
    /* ------------------------------------------------------------------ */
    var sampleSizeBinary = [
        { effect: '0.05 (5% vs 10%)', power80: 474, power90: 632 },
        { effect: '0.10 (10% vs 20%)', power80: 199, power90: 266 },
        { effect: '0.10 (20% vs 30%)', power80: 294, power90: 393 },
        { effect: '0.15 (10% vs 25%)', power80: 98, power90: 131 },
        { effect: '0.15 (30% vs 45%)', power80: 176, power90: 236 },
        { effect: '0.20 (20% vs 40%)', power80: 91, power90: 121 },
        { effect: '0.20 (40% vs 60%)', power80: 97, power90: 130 },
        { effect: '0.30 (10% vs 40%)', power80: 39, power90: 52 },
        { effect: '0.30 (30% vs 60%)', power80: 49, power90: 66 }
    ];

    var sampleSizeContinuous = [
        { effect: '0.20 (small)', power80: 394, power90: 527 },
        { effect: '0.30', power80: 176, power90: 234 },
        { effect: '0.40', power80: 100, power90: 133 },
        { effect: '0.50 (medium)', power80: 64, power90: 86 },
        { effect: '0.60', power80: 45, power90: 60 },
        { effect: '0.80 (large)', power80: 26, power90: 34 },
        { effect: '1.00', power80: 17, power90: 23 }
    ];

    var sampleSizeSurvival = [
        { hr: '0.50', events80: 34, events90: 46, note: 'Large effect' },
        { hr: '0.60', events80: 64, events90: 86, note: 'Moderate-large' },
        { hr: '0.70', events80: 121, events90: 162, note: 'Moderate' },
        { hr: '0.75', events80: 191, events90: 256, note: '' },
        { hr: '0.80', events80: 325, events90: 435, note: 'Small-moderate' },
        { hr: '0.85', events80: 630, events90: 844, note: '' },
        { hr: '0.90', events80: 1503, events90: 2013, note: 'Small effect' }
    ];

    /* ------------------------------------------------------------------ */
    /*  Render                                                             */
    /* ------------------------------------------------------------------ */
    function render(container) {
        var html = App.createModuleLayout(
            'Project Planner',
            'Research project planning tools: timeline builder, milestone tracking, budget calculation, regulatory checklists, and sample size reference.'
        );

        /* === Card 1: Research Timeline Builder === */
        html += '<div class="card">';
        html += '<div class="card-title">Research Timeline Builder</div>';
        html += '<div class="card-subtitle">Plan your project phases. Adjust start months and durations to build a visual timeline.</div>';

        html += '<div class="table-container">';
        html += '<table class="data-table" id="pp-phase-table">';
        html += '<thead><tr><th>Phase</th><th>Start Month</th><th>Duration (mo)</th><th>Status</th><th>Notes</th><th></th></tr></thead>';
        html += '<tbody>';
        for (var i = 0; i < phases.length; i++) {
            html += renderPhaseRow(i);
        }
        html += '</tbody></table>';
        html += '</div>';

        html += '<div class="btn-group mt-1">';
        html += '<button class="btn btn-secondary btn-xs" onclick="ProjectPlanner.addPhase()">+ Add Phase</button>';
        html += '<button class="btn btn-primary" onclick="ProjectPlanner.buildGantt()">Build Timeline</button>';
        html += '<button class="btn btn-secondary" onclick="ProjectPlanner.copyTimeline()">Copy Timeline</button>';
        html += '</div>';

        html += '<div id="pp-gantt" class="mt-2"></div>';
        html += '<div id="pp-total-duration" class="mt-1" style="font-size:0.9rem;color:var(--text-secondary);"></div>';
        html += '</div>';

        /* === Card 2: Milestone Tracker === */
        html += '<div class="card">';
        html += '<div class="card-title">Milestone Tracker</div>';

        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Load Template</label>';
        html += '<select class="form-select" id="pp-milestone-template">';
        html += '<option value="">-- Select Template --</option>';
        html += '<option value="clinical-trial">Clinical Trial</option>';
        html += '<option value="observational">Observational Study</option>';
        html += '<option value="systematic-review">Systematic Review</option>';
        html += '</select></div>';
        html += '<div class="form-group" style="display:flex;align-items:flex-end;">';
        html += '<button class="btn btn-secondary" onclick="ProjectPlanner.loadMilestoneTemplate()">Load Template</button>';
        html += '</div>';
        html += '</div>';

        /* Add milestone form */
        html += '<div class="card-subtitle mt-1">Add Custom Milestone</div>';
        html += '<div class="form-row form-row--4">';
        html += '<div class="form-group"><label class="form-label">Name</label>';
        html += '<input type="text" class="form-input" id="pp-ms-name" placeholder="Milestone name"></div>';
        html += '<div class="form-group"><label class="form-label">Target Date</label>';
        html += '<input type="date" class="form-input" id="pp-ms-date"></div>';
        html += '<div class="form-group"><label class="form-label">Priority</label>';
        html += '<select class="form-select" id="pp-ms-priority">';
        html += '<option value="high">High</option>';
        html += '<option value="medium" selected>Medium</option>';
        html += '<option value="low">Low</option>';
        html += '</select></div>';
        html += '<div class="form-group" style="display:flex;align-items:flex-end;">';
        html += '<button class="btn btn-secondary" onclick="ProjectPlanner.addMilestone()">Add</button>';
        html += '</div>';
        html += '</div>';

        html += '<div id="pp-milestones" class="mt-1"></div>';
        html += '</div>';

        /* === Card 3: Budget Calculator === */
        html += '<div class="card">';
        html += '<div class="card-title">Budget Calculator</div>';
        html += '<div class="card-subtitle">Estimate your research project budget. All values in USD.</div>';

        /* Personnel */
        html += '<div class="card-subtitle mt-1">Personnel</div>';
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">PI Salary ($)</label>';
        html += '<input type="number" class="form-input" id="pp-pi-salary" value="200000" placeholder="Annual salary"></div>';
        html += '<div class="form-group"><label class="form-label">PI % Effort</label>';
        html += '<input type="number" class="form-input" id="pp-pi-effort" value="20" min="0" max="100" placeholder="%"></div>';
        html += '<div class="form-group"><label class="form-label">PI Fringe Rate (%)</label>';
        html += '<input type="number" class="form-input" id="pp-pi-fringe" value="30" placeholder="%"></div>';
        html += '</div>';

        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Co-I Salary ($)</label>';
        html += '<input type="number" class="form-input" id="pp-coi-salary" value="180000" placeholder="Annual salary"></div>';
        html += '<div class="form-group"><label class="form-label">Co-I % Effort</label>';
        html += '<input type="number" class="form-input" id="pp-coi-effort" value="10" min="0" max="100" placeholder="%"></div>';
        html += '<div class="form-group"><label class="form-label">Co-I Fringe Rate (%)</label>';
        html += '<input type="number" class="form-input" id="pp-coi-fringe" value="30" placeholder="%"></div>';
        html += '</div>';

        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Coordinator Salary ($)</label>';
        html += '<input type="number" class="form-input" id="pp-coord-salary" value="55000" placeholder="Annual salary"></div>';
        html += '<div class="form-group"><label class="form-label">Coordinator % Effort</label>';
        html += '<input type="number" class="form-input" id="pp-coord-effort" value="100" min="0" max="100" placeholder="%"></div>';
        html += '<div class="form-group"><label class="form-label">Coordinator Fringe (%)</label>';
        html += '<input type="number" class="form-input" id="pp-coord-fringe" value="35" placeholder="%"></div>';
        html += '</div>';

        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Statistician Salary ($)</label>';
        html += '<input type="number" class="form-input" id="pp-stat-salary" value="120000" placeholder="Annual salary"></div>';
        html += '<div class="form-group"><label class="form-label">Statistician % Effort</label>';
        html += '<input type="number" class="form-input" id="pp-stat-effort" value="10" min="0" max="100" placeholder="%"></div>';
        html += '<div class="form-group"><label class="form-label">Statistician Fringe (%)</label>';
        html += '<input type="number" class="form-input" id="pp-stat-fringe" value="30" placeholder="%"></div>';
        html += '</div>';

        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Research Assistants (# FTE)</label>';
        html += '<input type="number" class="form-input" id="pp-ra-count" value="1" min="0" step="0.5"></div>';
        html += '<div class="form-group"><label class="form-label">RA Salary per FTE ($)</label>';
        html += '<input type="number" class="form-input" id="pp-ra-salary" value="45000" placeholder="Annual"></div>';
        html += '<div class="form-group"><label class="form-label">RA Fringe Rate (%)</label>';
        html += '<input type="number" class="form-input" id="pp-ra-fringe" value="25" placeholder="%"></div>';
        html += '</div>';

        /* Equipment / Supplies */
        html += '<div class="card-subtitle mt-2">Equipment & Supplies</div>';
        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Equipment ($)</label>';
        html += '<input type="number" class="form-input" id="pp-equipment" value="0" placeholder="Total equipment costs"></div>';
        html += '<div class="form-group"><label class="form-label">Supplies ($)</label>';
        html += '<input type="number" class="form-input" id="pp-supplies" value="5000" placeholder="Annual supplies"></div>';
        html += '</div>';

        /* Participant costs */
        html += '<div class="card-subtitle mt-2">Participant Costs</div>';
        html += '<div class="form-row form-row--4">';
        html += '<div class="form-group"><label class="form-label"># Participants</label>';
        html += '<input type="number" class="form-input" id="pp-n-participants" value="100"></div>';
        html += '<div class="form-group"><label class="form-label">Screening Cost ($)</label>';
        html += '<input type="number" class="form-input" id="pp-screen-cost" value="50"></div>';
        html += '<div class="form-group"><label class="form-label">Enrollment Cost ($)</label>';
        html += '<input type="number" class="form-input" id="pp-enroll-cost" value="100"></div>';
        html += '<div class="form-group"><label class="form-label">Follow-up Visit ($)</label>';
        html += '<input type="number" class="form-input" id="pp-visit-cost" value="75"></div>';
        html += '</div>';
        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label"># Follow-up Visits per Participant</label>';
        html += '<input type="number" class="form-input" id="pp-n-visits" value="4"></div>';
        html += '<div class="form-group"><label class="form-label">Participant Compensation ($)</label>';
        html += '<input type="number" class="form-input" id="pp-compensation" value="25" placeholder="Per visit"></div>';
        html += '</div>';

        /* Travel and publication */
        html += '<div class="card-subtitle mt-2">Travel & Publication</div>';
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Travel ($)</label>';
        html += '<input type="number" class="form-input" id="pp-travel" value="3000" placeholder="Annual"></div>';
        html += '<div class="form-group"><label class="form-label">Publication Costs ($)</label>';
        html += '<input type="number" class="form-input" id="pp-publication" value="3000" placeholder="Total"></div>';
        html += '<div class="form-group"><label class="form-label">Other Costs ($)</label>';
        html += '<input type="number" class="form-input" id="pp-other" value="0"></div>';
        html += '</div>';

        /* Indirect costs and grant amount */
        html += '<div class="card-subtitle mt-2">Indirect Costs & Grant</div>';
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">F&A Rate (%)</label>';
        html += '<input type="number" class="form-input" id="pp-fa-rate" value="55" placeholder="Indirect cost rate"></div>';
        html += '<div class="form-group"><label class="form-label">Project Duration (years)</label>';
        html += '<input type="number" class="form-input" id="pp-duration-years" value="3" min="1" max="10"></div>';
        html += '<div class="form-group"><label class="form-label">Total Grant Amount ($)</label>';
        html += '<input type="number" class="form-input" id="pp-grant-amount" value="500000" placeholder="Total available"></div>';
        html += '</div>';

        html += '<div class="btn-group mt-1">';
        html += '<button class="btn btn-primary" onclick="ProjectPlanner.calculateBudget()">Calculate Budget</button>';
        html += '<button class="btn btn-secondary" onclick="ProjectPlanner.copyBudget()">Copy Budget Summary</button>';
        html += '</div>';

        html += '<div id="pp-budget-result" class="mt-2"></div>';
        html += '</div>';

        /* === Card 4: Regulatory Checklist === */
        html += '<div class="card">';
        html += '<div class="card-title">Regulatory Checklist</div>';

        /* IRB */
        html += '<div class="card-subtitle">IRB / Ethics Submission Checklist</div>';
        html += renderRegChecklist(regulatoryItems.irb, 'irb');

        /* ClinicalTrials.gov */
        html += '<div class="card-subtitle mt-2">ClinicalTrials.gov Registration</div>';
        html += renderRegChecklist(regulatoryItems.ctgov, 'ctgov');

        /* FDA */
        html += '<div class="card-subtitle mt-2">FDA IND/IDE Checklist (if applicable)</div>';
        html += renderRegChecklist(regulatoryItems.fda, 'fda');

        html += '<div class="btn-group mt-2">';
        html += '<button class="btn btn-secondary" onclick="ProjectPlanner.copyRegChecklist()">Copy Regulatory Checklist</button>';
        html += '<button class="btn btn-secondary" onclick="ProjectPlanner.resetRegChecklist()">Reset All</button>';
        html += '</div>';
        html += '</div>';

        /* === Card 5: Power/Sample Size Quick Estimator === */
        html += '<div class="card">';
        html += '<div class="card-title">Power / Sample Size Quick Estimator</div>';
        html += '<div class="card-subtitle">Pre-calculated sample sizes for common clinical research scenarios. For formal calculations, use the dedicated Sample Size or Power Analysis modules.</div>';

        /* Binary outcome */
        html += '<div class="card-subtitle mt-1">Binary Outcome (Two-Sample Proportions, Two-Sided Alpha = 0.05)</div>';
        html += '<div class="table-container">';
        html += '<table class="data-table">';
        html += '<thead><tr><th>Effect Size (p1 vs p2)</th><th>n per Group (80% Power)</th><th>n per Group (90% Power)</th></tr></thead>';
        html += '<tbody>';
        for (var bi = 0; bi < sampleSizeBinary.length; bi++) {
            var br = sampleSizeBinary[bi];
            html += '<tr><td>' + br.effect + '</td><td>' + br.power80.toLocaleString() + '</td><td>' + br.power90.toLocaleString() + '</td></tr>';
        }
        html += '</tbody></table></div>';

        /* Continuous outcome */
        html += '<div class="card-subtitle mt-2">Continuous Outcome (Two-Sample t-test, Cohen\'s d, Two-Sided Alpha = 0.05)</div>';
        html += '<div class="table-container">';
        html += '<table class="data-table">';
        html += '<thead><tr><th>Effect Size (Cohen\'s d)</th><th>n per Group (80% Power)</th><th>n per Group (90% Power)</th></tr></thead>';
        html += '<tbody>';
        for (var ci = 0; ci < sampleSizeContinuous.length; ci++) {
            var cr = sampleSizeContinuous[ci];
            html += '<tr><td>' + cr.effect + '</td><td>' + cr.power80.toLocaleString() + '</td><td>' + cr.power90.toLocaleString() + '</td></tr>';
        }
        html += '</tbody></table></div>';

        /* Survival outcome */
        html += '<div class="card-subtitle mt-2">Survival Outcome (Log-Rank Test, Two-Sided Alpha = 0.05)</div>';
        html += '<div class="table-container">';
        html += '<table class="data-table">';
        html += '<thead><tr><th>Hazard Ratio</th><th>Events Needed (80% Power)</th><th>Events Needed (90% Power)</th><th>Notes</th></tr></thead>';
        html += '<tbody>';
        for (var si = 0; si < sampleSizeSurvival.length; si++) {
            var sr = sampleSizeSurvival[si];
            html += '<tr><td>' + sr.hr + '</td><td>' + sr.events80.toLocaleString() + '</td><td>' + sr.events90.toLocaleString() + '</td><td>' + sr.note + '</td></tr>';
        }
        html += '</tbody></table></div>';

        html += '<div class="result-panel mt-2">';
        html += '<div class="result-detail"><strong>Notes:</strong></div>';
        html += '<div class="result-detail">- Sample sizes shown are <em>per group</em>; multiply by 2 for total.</div>';
        html += '<div class="result-detail">- These assume equal group sizes. Unequal allocation requires larger total N.</div>';
        html += '<div class="result-detail">- Survival event counts assume 1:1 randomization with equal follow-up.</div>';
        html += '<div class="result-detail">- Add 10-20% for anticipated loss-to-follow-up or non-compliance.</div>';
        html += '<div class="result-detail">- For adjusted analyses, increase sample size by ~10-15% per additional covariate.</div>';
        html += '<div class="result-detail">- Events per variable (EPV) rule: minimum 10-20 events per predictor in multivariable models.</div>';
        html += '</div>';
        html += '</div>';

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);
    }

    /* ------------------------------------------------------------------ */
    /*  Helper: render phase row                                           */
    /* ------------------------------------------------------------------ */
    function renderPhaseRow(idx) {
        var p = phases[idx];
        var html = '<tr>';
        html += '<td><input type="text" class="form-input" style="min-width:150px" value="' + escHtml(p.name) + '" onchange="ProjectPlanner.updatePhase(' + idx + ',\'name\',this.value)"></td>';
        html += '<td><input type="number" class="form-input" style="width:70px" value="' + p.startMonth + '" min="1" onchange="ProjectPlanner.updatePhase(' + idx + ',\'startMonth\',parseInt(this.value))"></td>';
        html += '<td><input type="number" class="form-input" style="width:70px" value="' + p.duration + '" min="1" onchange="ProjectPlanner.updatePhase(' + idx + ',\'duration\',parseInt(this.value))"></td>';
        html += '<td><select class="form-select" style="min-width:110px" onchange="ProjectPlanner.updatePhase(' + idx + ',\'status\',this.value)">';
        var statuses = [
            { val: 'not-started', label: 'Not Started' },
            { val: 'in-progress', label: 'In Progress' },
            { val: 'complete', label: 'Complete' }
        ];
        for (var s = 0; s < statuses.length; s++) {
            var sel = (p.status === statuses[s].val) ? ' selected' : '';
            html += '<option value="' + statuses[s].val + '"' + sel + '>' + statuses[s].label + '</option>';
        }
        html += '</select></td>';
        html += '<td><input type="text" class="form-input" style="min-width:120px" value="' + escHtml(p.notes) + '" onchange="ProjectPlanner.updatePhase(' + idx + ',\'notes\',this.value)" placeholder="Notes"></td>';
        html += '<td><button class="btn btn-xs" onclick="ProjectPlanner.removePhase(' + idx + ')" title="Remove">&times;</button></td>';
        html += '</tr>';
        return html;
    }

    /* ------------------------------------------------------------------ */
    /*  Helper: render regulatory checklist                                */
    /* ------------------------------------------------------------------ */
    function renderRegChecklist(items) {
        var html = '';
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var checked = regulatoryState[item.id] ? ' checked' : '';
            html += '<label style="display:flex;align-items:flex-start;gap:0.5rem;padding:0.35rem 0;cursor:pointer;font-size:0.9rem;">';
            html += '<input type="checkbox" id="pp-reg-' + item.id + '"' + checked + ' onchange="ProjectPlanner.toggleReg(\'' + item.id + '\')" style="margin-top:3px;flex-shrink:0;">';
            html += '<span>' + item.text + '</span>';
            html += '</label>';
        }
        return html;
    }

    /* ------------------------------------------------------------------ */
    /*  Helper: escape HTML                                                */
    /* ------------------------------------------------------------------ */
    function escHtml(str) {
        if (!str) return '';
        return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    /* ------------------------------------------------------------------ */
    /*  Phase management                                                   */
    /* ------------------------------------------------------------------ */
    function updatePhase(idx, field, value) {
        if (idx >= 0 && idx < phases.length) {
            phases[idx][field] = value;
        }
    }

    function addPhase() {
        var lastPhase = phases[phases.length - 1];
        var newStart = lastPhase ? (lastPhase.startMonth + lastPhase.duration) : 1;
        phases.push({ name: 'New Phase', startMonth: newStart, duration: 3, status: 'not-started', notes: '' });
        refreshPhaseTable();
    }

    function removePhase(idx) {
        if (phases.length > 1) {
            phases.splice(idx, 1);
            refreshPhaseTable();
        }
    }

    function refreshPhaseTable() {
        var tbody = document.querySelector('#pp-phase-table tbody');
        if (!tbody) return;
        var html = '';
        for (var i = 0; i < phases.length; i++) {
            html += renderPhaseRow(i);
        }
        App.setTrustedHTML(tbody, html);
    }

    /* ------------------------------------------------------------------ */
    /*  Build Gantt chart                                                   */
    /* ------------------------------------------------------------------ */
    function buildGantt() {
        var maxMonth = 0;
        for (var i = 0; i < phases.length; i++) {
            var end = phases[i].startMonth + phases[i].duration - 1;
            if (end > maxMonth) maxMonth = end;
        }

        var totalDuration = maxMonth;
        var totalEl = document.getElementById('pp-total-duration');
        if (totalEl) {
            App.setTrustedHTML(totalEl, '<strong>Total Project Duration:</strong> ' + totalDuration + ' months (' + (totalDuration / 12).toFixed(1) + ' years)');
        }

        /* Build HTML Gantt */
        var colWidth = Math.max(20, Math.min(40, Math.floor(700 / maxMonth)));
        var html = '<div style="overflow-x:auto;">';
        html += '<table style="border-collapse:collapse;font-size:0.8rem;width:100%;">';

        /* Header row - months */
        html += '<tr><td style="min-width:160px;padding:4px 8px;font-weight:600;">Phase</td>';
        for (var m = 1; m <= maxMonth; m++) {
            html += '<td style="width:' + colWidth + 'px;text-align:center;padding:2px;border:1px solid var(--border);font-size:0.7rem;color:var(--text-secondary);">' + m + '</td>';
        }
        html += '</tr>';

        /* Phase rows */
        var statusColors = {
            'not-started': 'var(--text-tertiary, #888)',
            'in-progress': 'var(--accent, #3b82f6)',
            'complete': 'var(--success, #22c55e)'
        };

        for (var p = 0; p < phases.length; p++) {
            var phase = phases[p];
            html += '<tr>';
            html += '<td style="padding:4px 8px;white-space:nowrap;font-size:0.85rem;">' + escHtml(phase.name) + '</td>';
            for (var mc = 1; mc <= maxMonth; mc++) {
                var inRange = mc >= phase.startMonth && mc < (phase.startMonth + phase.duration);
                var bgColor = inRange ? statusColors[phase.status] || statusColors['not-started'] : 'transparent';
                var opacity = inRange ? '0.8' : '1';
                html += '<td style="border:1px solid var(--border);background:' + bgColor + ';opacity:' + opacity + ';"></td>';
            }
            html += '</tr>';
        }

        html += '</table></div>';

        /* Legend */
        html += '<div style="display:flex;gap:1.5rem;margin-top:0.5rem;font-size:0.8rem;">';
        html += '<span><span style="display:inline-block;width:12px;height:12px;background:var(--text-tertiary, #888);border-radius:2px;vertical-align:middle;margin-right:4px;"></span>Not Started</span>';
        html += '<span><span style="display:inline-block;width:12px;height:12px;background:var(--accent, #3b82f6);border-radius:2px;vertical-align:middle;margin-right:4px;"></span>In Progress</span>';
        html += '<span><span style="display:inline-block;width:12px;height:12px;background:var(--success, #22c55e);border-radius:2px;vertical-align:middle;margin-right:4px;"></span>Complete</span>';
        html += '</div>';

        var ganttEl = document.getElementById('pp-gantt');
        if (ganttEl) App.setTrustedHTML(ganttEl, html);
    }

    function copyTimeline() {
        var lines = ['Research Project Timeline', '='.repeat(40), ''];
        var maxMonth = 0;
        for (var i = 0; i < phases.length; i++) {
            var end = phases[i].startMonth + phases[i].duration - 1;
            if (end > maxMonth) maxMonth = end;
            var statusLabel = phases[i].status === 'not-started' ? 'Not Started' : (phases[i].status === 'in-progress' ? 'In Progress' : 'Complete');
            lines.push(phases[i].name + ': Month ' + phases[i].startMonth + '-' + end + ' (' + phases[i].duration + ' months) [' + statusLabel + ']');
            if (phases[i].notes) lines.push('  Notes: ' + phases[i].notes);
        }
        lines.push('');
        lines.push('Total Duration: ' + maxMonth + ' months (' + (maxMonth / 12).toFixed(1) + ' years)');

        /* ASCII Gantt */
        lines.push('');
        lines.push('Gantt Chart:');
        var nameWidth = 25;
        var header = 'Phase'.padEnd(nameWidth) + '|';
        for (var h = 1; h <= maxMonth; h++) {
            header += (h % 3 === 0) ? String(h).padStart(2) : '..';
        }
        lines.push(header);
        lines.push('-'.repeat(header.length));

        for (var p = 0; p < phases.length; p++) {
            var row = phases[p].name.substring(0, nameWidth - 1).padEnd(nameWidth) + '|';
            for (var mc = 1; mc <= maxMonth; mc++) {
                var inRange = mc >= phases[p].startMonth && mc < (phases[p].startMonth + phases[p].duration);
                row += inRange ? '##' : '  ';
            }
            lines.push(row);
        }

        lines.push('');
        lines.push('Generated: ' + new Date().toLocaleDateString());
        Export.copyText(lines.join('\n'));
    }

    /* ------------------------------------------------------------------ */
    /*  Milestone management                                               */
    /* ------------------------------------------------------------------ */
    function addMilestone() {
        var name = document.getElementById('pp-ms-name');
        var date = document.getElementById('pp-ms-date');
        var priority = document.getElementById('pp-ms-priority');
        if (!name || !name.value.trim()) return;

        milestones.push({
            name: name.value.trim(),
            targetDate: date ? date.value : '',
            status: 'not-started',
            priority: priority ? priority.value : 'medium'
        });

        name.value = '';
        if (date) date.value = '';
        renderMilestones();
    }

    function loadMilestoneTemplate() {
        var sel = document.getElementById('pp-milestone-template');
        if (!sel || !sel.value) return;

        var template = milestoneTemplates[sel.value];
        if (!template) return;

        for (var i = 0; i < template.length; i++) {
            milestones.push({
                name: template[i].name,
                targetDate: template[i].targetDate,
                status: template[i].status,
                priority: template[i].priority
            });
        }
        renderMilestones();
    }

    function updateMilestoneStatus(idx, status) {
        if (idx >= 0 && idx < milestones.length) {
            milestones[idx].status = status;
            renderMilestones();
        }
    }

    function removeMilestone(idx) {
        milestones.splice(idx, 1);
        renderMilestones();
    }

    function renderMilestones() {
        var el = document.getElementById('pp-milestones');
        if (!el) return;

        if (milestones.length === 0) {
            App.setTrustedHTML(el, '<p style="color:var(--text-secondary);font-size:0.9rem;">No milestones added yet. Use the form above or load a template.</p>');
            return;
        }

        /* Sort by date (empty dates last), then priority */
        var sorted = milestones.map(function(m, idx) { return { m: m, idx: idx }; });
        sorted.sort(function(a, b) {
            if (a.m.targetDate && b.m.targetDate) return a.m.targetDate.localeCompare(b.m.targetDate);
            if (a.m.targetDate && !b.m.targetDate) return -1;
            if (!a.m.targetDate && b.m.targetDate) return 1;
            var prio = { high: 0, medium: 1, low: 2 };
            return (prio[a.m.priority] || 1) - (prio[b.m.priority] || 1);
        });

        var priorityColors = {
            high: 'color:var(--danger, #ef4444);',
            medium: 'color:var(--warning, #f59e0b);',
            low: 'color:var(--text-secondary);'
        };

        var statusIcons = {
            'not-started': '&#9744;',
            'in-progress': '&#9881;',
            'complete': '&#9745;'
        };

        var html = '<div class="table-container">';
        html += '<table class="data-table">';
        html += '<thead><tr><th>Milestone</th><th>Target Date</th><th>Priority</th><th>Status</th><th></th></tr></thead>';
        html += '<tbody>';

        for (var i = 0; i < sorted.length; i++) {
            var ms = sorted[i].m;
            var origIdx = sorted[i].idx;

            html += '<tr>';
            html += '<td>' + escHtml(ms.name) + '</td>';
            html += '<td>' + (ms.targetDate || '<span style="color:var(--text-tertiary)">Not set</span>') + '</td>';
            html += '<td><span style="' + (priorityColors[ms.priority] || '') + 'font-weight:600;text-transform:uppercase;font-size:0.8rem;">' + ms.priority + '</span></td>';
            html += '<td>';
            html += '<select class="form-select" style="font-size:0.85rem;padding:0.2rem 0.4rem;" onchange="ProjectPlanner.updateMilestoneStatus(' + origIdx + ',this.value)">';
            var msStatuses = [
                { val: 'not-started', label: 'Not Started' },
                { val: 'in-progress', label: 'In Progress' },
                { val: 'complete', label: 'Complete' }
            ];
            for (var s = 0; s < msStatuses.length; s++) {
                var msSel = (ms.status === msStatuses[s].val) ? ' selected' : '';
                html += '<option value="' + msStatuses[s].val + '"' + msSel + '>' + statusIcons[msStatuses[s].val] + ' ' + msStatuses[s].label + '</option>';
            }
            html += '</select>';
            html += '</td>';
            html += '<td><button class="btn btn-xs" onclick="ProjectPlanner.removeMilestone(' + origIdx + ')" title="Remove">&times;</button></td>';
            html += '</tr>';
        }

        html += '</tbody></table></div>';
        App.setTrustedHTML(el, html);
    }

    /* ------------------------------------------------------------------ */
    /*  Budget calculator                                                  */
    /* ------------------------------------------------------------------ */
    function getVal(id) {
        var el = document.getElementById(id);
        return el ? (parseFloat(el.value) || 0) : 0;
    }

    function calculateBudget() {
        var years = getVal('pp-duration-years') || 1;

        /* Personnel (annual then total) */
        var piAnnual = getVal('pp-pi-salary') * (getVal('pp-pi-effort') / 100);
        var piFringe = piAnnual * (getVal('pp-pi-fringe') / 100);

        var coiAnnual = getVal('pp-coi-salary') * (getVal('pp-coi-effort') / 100);
        var coiFringe = coiAnnual * (getVal('pp-coi-fringe') / 100);

        var coordAnnual = getVal('pp-coord-salary') * (getVal('pp-coord-effort') / 100);
        var coordFringe = coordAnnual * (getVal('pp-coord-fringe') / 100);

        var statAnnual = getVal('pp-stat-salary') * (getVal('pp-stat-effort') / 100);
        var statFringe = statAnnual * (getVal('pp-stat-fringe') / 100);

        var raAnnual = getVal('pp-ra-count') * getVal('pp-ra-salary');
        var raFringe = raAnnual * (getVal('pp-ra-fringe') / 100);

        var totalPersonnelAnnual = piAnnual + coiAnnual + coordAnnual + statAnnual + raAnnual;
        var totalFringeAnnual = piFringe + coiFringe + coordFringe + statFringe + raFringe;
        var totalPersonnel = (totalPersonnelAnnual + totalFringeAnnual) * years;

        /* Other direct costs */
        var equipment = getVal('pp-equipment');
        var suppliesTotal = getVal('pp-supplies') * years;

        var nParticipants = getVal('pp-n-participants');
        var screenCost = nParticipants * getVal('pp-screen-cost');
        var enrollCost = nParticipants * getVal('pp-enroll-cost');
        var visitCost = nParticipants * getVal('pp-n-visits') * getVal('pp-visit-cost');
        var compensation = nParticipants * getVal('pp-n-visits') * getVal('pp-compensation');
        var participantTotal = screenCost + enrollCost + visitCost + compensation;

        var travelTotal = getVal('pp-travel') * years;
        var publicationTotal = getVal('pp-publication');
        var otherTotal = getVal('pp-other') * years;

        var totalDirectCosts = totalPersonnel + equipment + suppliesTotal + participantTotal + travelTotal + publicationTotal + otherTotal;

        /* Indirect (F&A) -- typically on MTDC (excludes equipment, participant support, tuition, subcontract >25k) */
        var faRate = getVal('pp-fa-rate') / 100;
        var mtdc = totalDirectCosts - equipment; /* simplified MTDC */
        var indirectCosts = mtdc * faRate;

        var totalBudget = totalDirectCosts + indirectCosts;
        var grantAmount = getVal('pp-grant-amount');

        var fits = totalBudget <= grantAmount;

        /* Build result HTML */
        var fmt = function(n) { return '$' + Math.round(n).toLocaleString(); };

        var html = '<div class="result-panel">';
        html += '<div class="card-subtitle">Budget Summary (' + years + '-Year Project)</div>';

        html += '<div class="table-container">';
        html += '<table class="data-table">';
        html += '<thead><tr><th>Category</th><th>Annual</th><th>Total (' + years + ' yr)</th></tr></thead>';
        html += '<tbody>';

        html += '<tr><td colspan="3" style="font-weight:600;background:var(--bg-elevated);">Personnel</td></tr>';
        html += '<tr><td>&nbsp;&nbsp;PI (' + getVal('pp-pi-effort') + '% effort)</td><td>' + fmt(piAnnual + piFringe) + '</td><td>' + fmt((piAnnual + piFringe) * years) + '</td></tr>';
        html += '<tr><td>&nbsp;&nbsp;Co-I (' + getVal('pp-coi-effort') + '% effort)</td><td>' + fmt(coiAnnual + coiFringe) + '</td><td>' + fmt((coiAnnual + coiFringe) * years) + '</td></tr>';
        html += '<tr><td>&nbsp;&nbsp;Coordinator (' + getVal('pp-coord-effort') + '% effort)</td><td>' + fmt(coordAnnual + coordFringe) + '</td><td>' + fmt((coordAnnual + coordFringe) * years) + '</td></tr>';
        html += '<tr><td>&nbsp;&nbsp;Statistician (' + getVal('pp-stat-effort') + '% effort)</td><td>' + fmt(statAnnual + statFringe) + '</td><td>' + fmt((statAnnual + statFringe) * years) + '</td></tr>';
        html += '<tr><td>&nbsp;&nbsp;Research Assistants (' + getVal('pp-ra-count') + ' FTE)</td><td>' + fmt(raAnnual + raFringe) + '</td><td>' + fmt((raAnnual + raFringe) * years) + '</td></tr>';
        html += '<tr style="font-weight:600;"><td>&nbsp;&nbsp;Subtotal Personnel (incl. fringe)</td><td>' + fmt(totalPersonnelAnnual + totalFringeAnnual) + '</td><td>' + fmt(totalPersonnel) + '</td></tr>';

        html += '<tr><td colspan="3" style="font-weight:600;background:var(--bg-elevated);">Other Direct Costs</td></tr>';
        html += '<tr><td>&nbsp;&nbsp;Equipment</td><td>—</td><td>' + fmt(equipment) + '</td></tr>';
        html += '<tr><td>&nbsp;&nbsp;Supplies</td><td>' + fmt(getVal('pp-supplies')) + '</td><td>' + fmt(suppliesTotal) + '</td></tr>';
        html += '<tr><td>&nbsp;&nbsp;Participant Costs (n=' + nParticipants + ')</td><td>—</td><td>' + fmt(participantTotal) + '</td></tr>';
        html += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;Screening</td><td>—</td><td>' + fmt(screenCost) + '</td></tr>';
        html += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;Enrollment</td><td>—</td><td>' + fmt(enrollCost) + '</td></tr>';
        html += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;Follow-up Visits</td><td>—</td><td>' + fmt(visitCost) + '</td></tr>';
        html += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;Compensation</td><td>—</td><td>' + fmt(compensation) + '</td></tr>';
        html += '<tr><td>&nbsp;&nbsp;Travel</td><td>' + fmt(getVal('pp-travel')) + '</td><td>' + fmt(travelTotal) + '</td></tr>';
        html += '<tr><td>&nbsp;&nbsp;Publication</td><td>—</td><td>' + fmt(publicationTotal) + '</td></tr>';
        html += '<tr><td>&nbsp;&nbsp;Other</td><td>' + fmt(getVal('pp-other')) + '</td><td>' + fmt(otherTotal) + '</td></tr>';

        html += '<tr style="font-weight:600;border-top:2px solid var(--border);"><td>Total Direct Costs</td><td></td><td>' + fmt(totalDirectCosts) + '</td></tr>';
        html += '<tr><td>Indirect Costs (F&A ' + getVal('pp-fa-rate') + '% on MTDC)</td><td></td><td>' + fmt(indirectCosts) + '</td></tr>';
        html += '<tr style="font-weight:700;font-size:1.05rem;border-top:2px solid var(--border);"><td>TOTAL BUDGET</td><td></td><td>' + fmt(totalBudget) + '</td></tr>';
        html += '</tbody></table></div>';

        /* Grant fit check */
        if (grantAmount > 0) {
            var diff = grantAmount - totalBudget;
            var color = fits ? 'var(--success, #22c55e)' : 'var(--danger, #ef4444)';
            html += '<div style="margin-top:0.8rem;padding:0.6rem;background:var(--bg-elevated);border-radius:6px;border-left:4px solid ' + color + ';">';
            html += '<strong>Grant Amount:</strong> ' + fmt(grantAmount) + '<br>';
            html += '<strong>Budget ' + (fits ? 'Under' : 'Over') + ' by:</strong> <span style="color:' + color + ';font-weight:700;">' + fmt(Math.abs(diff)) + '</span>';
            if (!fits) {
                html += '<br><span style="font-size:0.85rem;color:var(--text-secondary);">Consider reducing effort percentages, participant numbers, or project duration to fit within the available grant amount.</span>';
            }
            html += '</div>';
        }

        html += '</div>';

        var resultEl = document.getElementById('pp-budget-result');
        if (resultEl) App.setTrustedHTML(resultEl, html);
    }

    function copyBudget() {
        /* Recalculate and produce text version */
        var years = getVal('pp-duration-years') || 1;
        var fmt = function(n) { return '$' + Math.round(n).toLocaleString(); };

        var piAnnual = getVal('pp-pi-salary') * (getVal('pp-pi-effort') / 100);
        var piFringe = piAnnual * (getVal('pp-pi-fringe') / 100);
        var coiAnnual = getVal('pp-coi-salary') * (getVal('pp-coi-effort') / 100);
        var coiFringe = coiAnnual * (getVal('pp-coi-fringe') / 100);
        var coordAnnual = getVal('pp-coord-salary') * (getVal('pp-coord-effort') / 100);
        var coordFringe = coordAnnual * (getVal('pp-coord-fringe') / 100);
        var statAnnual = getVal('pp-stat-salary') * (getVal('pp-stat-effort') / 100);
        var statFringe = statAnnual * (getVal('pp-stat-fringe') / 100);
        var raAnnual = getVal('pp-ra-count') * getVal('pp-ra-salary');
        var raFringe = raAnnual * (getVal('pp-ra-fringe') / 100);

        var totalPA = piAnnual + coiAnnual + coordAnnual + statAnnual + raAnnual;
        var totalFA = piFringe + coiFringe + coordFringe + statFringe + raFringe;
        var totalPersonnel = (totalPA + totalFA) * years;

        var equipment = getVal('pp-equipment');
        var suppliesTotal = getVal('pp-supplies') * years;
        var nP = getVal('pp-n-participants');
        var participantTotal = nP * getVal('pp-screen-cost') + nP * getVal('pp-enroll-cost') + nP * getVal('pp-n-visits') * getVal('pp-visit-cost') + nP * getVal('pp-n-visits') * getVal('pp-compensation');
        var travelTotal = getVal('pp-travel') * years;
        var pubTotal = getVal('pp-publication');
        var otherTotal = getVal('pp-other') * years;

        var totalDirect = totalPersonnel + equipment + suppliesTotal + participantTotal + travelTotal + pubTotal + otherTotal;
        var indirect = (totalDirect - equipment) * (getVal('pp-fa-rate') / 100);
        var total = totalDirect + indirect;

        var lines = [
            'BUDGET SUMMARY (' + years + '-Year Project)',
            '='.repeat(40),
            '',
            'PERSONNEL (incl. fringe):',
            '  PI: ' + fmt((piAnnual + piFringe) * years),
            '  Co-I: ' + fmt((coiAnnual + coiFringe) * years),
            '  Coordinator: ' + fmt((coordAnnual + coordFringe) * years),
            '  Statistician: ' + fmt((statAnnual + statFringe) * years),
            '  Research Assistants: ' + fmt((raAnnual + raFringe) * years),
            '  Subtotal Personnel: ' + fmt(totalPersonnel),
            '',
            'OTHER DIRECT COSTS:',
            '  Equipment: ' + fmt(equipment),
            '  Supplies: ' + fmt(suppliesTotal),
            '  Participant Costs (n=' + nP + '): ' + fmt(participantTotal),
            '  Travel: ' + fmt(travelTotal),
            '  Publication: ' + fmt(pubTotal),
            '  Other: ' + fmt(otherTotal),
            '',
            'Total Direct Costs: ' + fmt(totalDirect),
            'Indirect Costs (F&A ' + getVal('pp-fa-rate') + '%): ' + fmt(indirect),
            '',
            'TOTAL BUDGET: ' + fmt(total),
            '',
            'Generated: ' + new Date().toLocaleDateString()
        ];
        Export.copyText(lines.join('\n'));
    }

    /* ------------------------------------------------------------------ */
    /*  Regulatory checklist                                               */
    /* ------------------------------------------------------------------ */
    function toggleReg(id) {
        regulatoryState[id] = !regulatoryState[id];
    }

    function copyRegChecklist() {
        var lines = ['REGULATORY CHECKLIST', '='.repeat(40), ''];

        var groups = [
            { name: 'IRB / Ethics Submission', items: regulatoryItems.irb },
            { name: 'ClinicalTrials.gov Registration', items: regulatoryItems.ctgov },
            { name: 'FDA IND/IDE', items: regulatoryItems.fda }
        ];

        for (var g = 0; g < groups.length; g++) {
            lines.push('--- ' + groups[g].name + ' ---');
            for (var i = 0; i < groups[g].items.length; i++) {
                var item = groups[g].items[i];
                var mark = regulatoryState[item.id] ? '[X]' : '[ ]';
                lines.push(mark + ' ' + item.text);
            }
            lines.push('');
        }
        lines.push('Generated: ' + new Date().toLocaleDateString());
        Export.copyText(lines.join('\n'));
    }

    function resetRegChecklist() {
        regulatoryState = {};
        var checkboxes = document.querySelectorAll('[id^="pp-reg-"]');
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
        }
    }

    /* ------------------------------------------------------------------ */
    /*  Register                                                           */
    /* ------------------------------------------------------------------ */
    App.registerModule(MODULE_ID, { render: render });
    window.ProjectPlanner = {
        updatePhase: updatePhase,
        addPhase: addPhase,
        removePhase: removePhase,
        buildGantt: buildGantt,
        copyTimeline: copyTimeline,
        addMilestone: addMilestone,
        loadMilestoneTemplate: loadMilestoneTemplate,
        updateMilestoneStatus: updateMilestoneStatus,
        removeMilestone: removeMilestone,
        calculateBudget: calculateBudget,
        copyBudget: copyBudget,
        toggleReg: toggleReg,
        copyRegChecklist: copyRegChecklist,
        resetRegChecklist: resetRegChecklist
    };
})();
