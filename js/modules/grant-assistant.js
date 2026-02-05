/**
 * Neuro-Epi — Grant Assistant Module
 * Specific Aims builder, Study Design generator, Power justification,
 * Timeline (Gantt) with milestone markers, Human Subjects template,
 * Budget helper with justification generator, Biosketch helper,
 * Letter of Support template generator
 */

(function() {
    'use strict';

    const MODULE_ID = 'grant-assistant';

    // Milestone state for dynamic management
    var milestoneCount = 7;
    var milestoneMarkers = [];

    function render(container) {
        var html = App.createModuleLayout(
            'Grant Assistant',
            'Tools for NIH grant preparation: Specific Aims page builder, study design section generator, Gantt timeline, human subjects template, budget justification, biosketch helper, and letter of support generator.'
        );

        html += '<div class="card">';
        html += '<div class="tabs" id="ga-tabs">'
            + '<button class="tab active" data-tab="aims" onclick="GrantAssist.switchTab(\'aims\')">Specific Aims</button>'
            + '<button class="tab" data-tab="design" onclick="GrantAssist.switchTab(\'design\')">Study Design</button>'
            + '<button class="tab" data-tab="power" onclick="GrantAssist.switchTab(\'power\')">Power Justification</button>'
            + '<button class="tab" data-tab="timeline" onclick="GrantAssist.switchTab(\'timeline\')">Timeline</button>'
            + '<button class="tab" data-tab="human" onclick="GrantAssist.switchTab(\'human\')">Human Subjects</button>'
            + '<button class="tab" data-tab="budget" onclick="GrantAssist.switchTab(\'budget\')">Budget</button>'
            + '<button class="tab" data-tab="biosketch" onclick="GrantAssist.switchTab(\'biosketch\')">Biosketch</button>'
            + '<button class="tab" data-tab="letters" onclick="GrantAssist.switchTab(\'letters\')">Letters</button>'
            + '<button class="tab" data-tab="budgetjust" onclick="GrantAssist.switchTab(\'budgetjust\')">Budget Justification</button>'
            + '</div>';

        // ===== Specific Aims (Enhanced with structured template) =====
        html += '<div class="tab-content active" id="tab-aims">';
        html += '<div class="card-subtitle">Build an NIH-style Specific Aims page (~1 page, ~500 words). Structured sections: Background/Gap, Innovation, Long-term Goal, Hypothesis, and Aims.</div>';

        // Structured NIH-style template
        html += '<div class="card mt-2" style="background:var(--bg-elevated);border-left:3px solid var(--accent)">';
        html += '<div class="card-title">Opening Paragraph (Hook + Background + Gap)</div>';
        html += '<div class="form-group"><label class="form-label">Opening Hook (1-2 sentences)</label>'
            + '<textarea class="form-input" id="ga-hook" rows="2" placeholder="[Disease/condition] affects [X million] people annually, resulting in [consequences]..."></textarea></div>';
        html += '<div class="form-group"><label class="form-label">Background / What is Known</label>'
            + '<textarea class="form-input" id="ga-background" rows="3" placeholder="Current evidence suggests that... Multiple studies have demonstrated..."></textarea></div>';
        html += '<div class="form-group"><label class="form-label">Knowledge Gap / Barrier</label>'
            + '<textarea class="form-input" id="ga-gap" rows="2" placeholder="However, a critical barrier to progress is... What remains unknown is..."></textarea></div>';
        html += '<div class="form-group"><label class="form-label">Innovation Statement</label>'
            + '<textarea class="form-input" id="ga-innovation" rows="2" placeholder="Our approach is innovative because... This project is the first to..."></textarea></div>';
        html += '</div>';

        html += '<div class="form-group"><label class="form-label">Long-Term Goal</label>'
            + '<textarea class="form-input" id="ga-ltgoal" rows="2" placeholder="The long-term goal of this research program is to..."></textarea></div>';

        html += '<div class="form-group"><label class="form-label">Overall Objective</label>'
            + '<textarea class="form-input" id="ga-objective" rows="2" placeholder="The overall objective of this application is to..."></textarea></div>';

        html += '<div class="form-group"><label class="form-label">Central Hypothesis</label>'
            + '<textarea class="form-input" id="ga-hypothesis" rows="2" placeholder="Our central hypothesis is that..."></textarea></div>';

        html += '<div class="form-group"><label class="form-label">Scientific Premise / Rationale</label>'
            + '<textarea class="form-input" id="ga-premise" rows="3" placeholder="The rationale for the proposed research is..."></textarea></div>';

        for (var i = 1; i <= 3; i++) {
            html += '<div class="card mt-2" style="background:var(--bg-elevated)">';
            html += '<div class="card-title">Specific Aim ' + i + '</div>';
            html += '<div class="form-group"><label class="form-label">Aim Statement</label>'
                + '<textarea class="form-input" id="ga-aim' + i + '" rows="2" placeholder="Aim ' + i + ': To determine whether..."></textarea></div>';
            html += '<div class="form-group"><label class="form-label">Hypothesis</label>'
                + '<input type="text" class="form-input" id="ga-aim' + i + '-hyp" placeholder="We hypothesize that..."></div>';
            html += '<div class="form-group"><label class="form-label">Approach (brief)</label>'
                + '<textarea class="form-input" id="ga-aim' + i + '-approach" rows="2" placeholder="We will use..."></textarea></div>';
            html += '</div>';
        }

        html += '<div class="form-group"><label class="form-label">Closing / Expected Outcomes / Impact</label>'
            + '<textarea class="form-input" id="ga-impact" rows="2" placeholder="At the completion of this project, we expect to have... These results are expected to have a positive impact because..."></textarea></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="GrantAssist.generateAims()">Generate Specific Aims</button>'
            + '</div>';

        html += '<div id="ga-aims-output"></div>';
        html += '<div id="ga-aims-wordcount" class="text-secondary mt-1" style="font-size:0.8rem"></div>';
        html += '</div>';

        // ===== Study Design Section =====
        html += '<div class="tab-content" id="tab-design">';
        html += '<div class="card-subtitle">Generate a structured Study Design / Approach section.</div>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Study Type</label>'
            + '<select class="form-select" id="ga-studytype"><option>Randomized Controlled Trial</option><option>Prospective Cohort</option><option>Retrospective Cohort</option><option>Case-Control</option><option>Cross-Sectional</option><option>Pragmatic Trial</option></select></div>'
            + '<div class="form-group"><label class="form-label">Setting</label>'
            + '<input type="text" class="form-input" id="ga-setting" placeholder="e.g., 20 comprehensive stroke centers"></div>'
            + '</div>';

        html += '<div class="form-group"><label class="form-label">Population</label>'
            + '<textarea class="form-input" id="ga-pop" rows="2" placeholder="Adult patients (age >= 18) with..."></textarea></div>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Intervention / Exposure</label>'
            + '<textarea class="form-input" id="ga-intervention" rows="2" placeholder=""></textarea></div>'
            + '<div class="form-group"><label class="form-label">Comparator</label>'
            + '<textarea class="form-input" id="ga-comparator" rows="2" placeholder=""></textarea></div>'
            + '</div>';

        html += '<div class="form-group"><label class="form-label">Primary Outcome</label>'
            + '<input type="text" class="form-input" id="ga-primary-outcome" placeholder="e.g., mRS at 90 days (ordinal shift)"></div>';

        html += '<div class="form-group"><label class="form-label">Key Secondary Outcomes (comma-separated)</label>'
            + '<input type="text" class="form-input" id="ga-secondary-outcomes" placeholder="e.g., mortality, sICH, quality of life"></div>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Follow-up Duration</label>'
            + '<input type="text" class="form-input" id="ga-followup" placeholder="e.g., 90 days"></div>'
            + '<div class="form-group"><label class="form-label">Analysis Plan (brief)</label>'
            + '<input type="text" class="form-input" id="ga-analysis" placeholder="e.g., Ordinal logistic regression, ITT"></div>'
            + '</div>';

        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="GrantAssist.generateDesign()">Generate Design Section</button></div>';
        html += '<div id="ga-design-output"></div>';
        html += '</div>';

        // ===== Power Justification =====
        html += '<div class="tab-content" id="tab-power">';
        html += '<div class="card-subtitle">Generate a grant-ready power analysis paragraph. Set parameters and generate text.</div>';

        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Design</label>'
            + '<select class="form-select" id="ga-pwr-design"><option value="proportions">Two Proportions</option><option value="ordinal">Ordinal Shift (mRS)</option><option value="survival">Time-to-Event</option></select></div>'
            + '<div class="form-group"><label class="form-label">p\u2081 / Common OR / HR</label>'
            + '<input type="number" class="form-input" id="ga-pwr-param1" step="0.01" value="0.28"></div>'
            + '<div class="form-group"><label class="form-label">p\u2082 (if proportions)</label>'
            + '<input type="number" class="form-input" id="ga-pwr-param2" step="0.01" value="0.20"></div>'
            + '</div>';

        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">\u03B1</label><input type="number" class="form-input" id="ga-pwr-alpha" value="0.05" step="0.01"></div>'
            + '<div class="form-group"><label class="form-label">Power</label><input type="number" class="form-input" id="ga-pwr-power" value="0.80" step="0.05"></div>'
            + '<div class="form-group"><label class="form-label">Dropout %</label><input type="number" class="form-input" id="ga-pwr-dropout" value="10" step="1"></div>'
            + '</div>';

        html += '<div class="form-group"><label class="form-label">Justification for Effect Size Assumption</label>'
            + '<textarea class="form-input" id="ga-pwr-just" rows="2" placeholder="e.g., Based on ESCAPE trial (common OR 2.6), we conservatively estimate..."></textarea></div>';

        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="GrantAssist.generatePower()">Generate Power Text</button></div>';
        html += '<div id="ga-power-output"></div>';
        html += '</div>';

        // ===== Timeline (Gantt) — Enhanced with milestone markers =====
        html += '<div class="tab-content" id="tab-timeline">';
        html += '<div class="card-subtitle">Create a project timeline Gantt chart with milestone markers. Add/remove tasks dynamically.</div>';

        html += '<div id="ga-milestones">';
        var defaultMilestones = [
            { label: 'IRB Approval & Setup', start: 0, end: 6 },
            { label: 'Recruitment & Enrollment', start: 3, end: 36 },
            { label: 'Data Collection', start: 3, end: 42 },
            { label: 'Interim Analysis', start: 24, end: 26 },
            { label: 'Final Data Lock', start: 42, end: 44 },
            { label: 'Analysis & Manuscripts', start: 42, end: 54 },
            { label: 'Dissemination', start: 48, end: 60 }
        ];

        defaultMilestones.forEach(function(m, idx) {
            html += '<div class="form-row form-row--3 mb-1" style="align-items:end" id="ga-ms-row-' + idx + '">'
                + '<div class="form-group"><label class="form-label">' + (idx === 0 ? 'Milestone / Task' : '') + '</label>'
                + '<input type="text" class="form-input form-input--small" id="ga-ms-label-' + idx + '" value="' + m.label + '"></div>'
                + '<div class="form-group"><label class="form-label">' + (idx === 0 ? 'Start (month)' : '') + '</label>'
                + '<input type="number" class="form-input form-input--small" id="ga-ms-start-' + idx + '" value="' + m.start + '"></div>'
                + '<div class="form-group"><label class="form-label">' + (idx === 0 ? 'End (month)' : '') + '</label>'
                + '<input type="number" class="form-input form-input--small" id="ga-ms-end-' + idx + '" value="' + m.end + '"></div>'
                + '</div>';
        });
        html += '</div>';

        // Milestone markers
        html += '<div class="card-title mt-2">Key Milestones (Diamond Markers on Chart)</div>';
        html += '<div id="ga-milestone-markers">';
        html += '<div class="form-row form-row--2 mb-1">'
            + '<div class="form-group"><label class="form-label">Milestone Label</label>'
            + '<input type="text" class="form-input form-input--small" id="ga-mkr-label-0" value="DSMB Meeting 1" placeholder="Milestone name"></div>'
            + '<div class="form-group"><label class="form-label">Month</label>'
            + '<input type="number" class="form-input form-input--small" id="ga-mkr-month-0" value="24"></div></div>';
        html += '<div class="form-row form-row--2 mb-1">'
            + '<div class="form-group"><input type="text" class="form-input form-input--small" id="ga-mkr-label-1" value="DSMB Meeting 2" placeholder="Milestone name"></div>'
            + '<div class="form-group"><input type="number" class="form-input form-input--small" id="ga-mkr-month-1" value="42"></div></div>';
        html += '<div class="form-row form-row--2 mb-1">'
            + '<div class="form-group"><input type="text" class="form-input form-input--small" id="ga-mkr-label-2" value="Final Report" placeholder="Milestone name"></div>'
            + '<div class="form-group"><input type="number" class="form-input form-input--small" id="ga-mkr-month-2" value="58"></div></div>';
        html += '</div>';

        html += '<div class="form-group"><label class="form-label">Total Duration (months)</label>'
            + '<input type="number" class="form-input" id="ga-total-months" value="60" style="width:120px"></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="GrantAssist.generateTimeline()">Generate Gantt Chart</button>'
            + '</div>';

        html += '<div class="chart-container"><canvas id="ga-gantt" width="800" height="350"></canvas></div>';
        html += '<div class="chart-actions"><button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'ga-gantt\'),\'timeline.png\')">Export PNG</button></div>';
        html += '</div>';

        // ===== Human Subjects (Enhanced with standard IRB language) =====
        html += '<div class="tab-content" id="tab-human">';
        html += '<div class="card-subtitle">Structured template for Human Subjects protection plan with standard IRB language. Fill in study-specific details, then generate a formatted section.</div>';

        var hsFields = [
            { id: 'risks', label: 'Risks to Participants', placeholder: 'Describe physical, psychological, social, legal, and economic risks...',
              template: 'The risks associated with this study are [minimal/moderate]. Physical risks include [describe]. The probability of these risks is [low/moderate] and their severity is [mild/moderate/severe]. Psychological risks include [describe, e.g., distress from discussing stroke symptoms]. There are no anticipated social, legal, or economic risks beyond [describe].' },
            { id: 'benefits', label: 'Potential Benefits', placeholder: 'Describe direct benefits to participants and general knowledge benefits...',
              template: 'Participants may benefit directly through [describe direct benefits, or state "there are no direct benefits to participants"]. The knowledge gained from this study may benefit future patients with [condition] by [describe anticipated knowledge contribution].' },
            { id: 'recruitment', label: 'Recruitment Plan', placeholder: 'Describe recruitment methods, settings, and strategies for adequate enrollment...',
              template: 'Participants will be recruited from [settings]. Potential participants will be identified through [screening logs/EMR review/physician referral]. Study personnel will approach eligible patients to discuss participation. We will use [flyers/direct approach/database screening] as recruitment strategies. To ensure adequate enrollment of [target N] participants over [timeframe], we will [describe enrollment strategies]. We will recruit [X participants per month] based on historical volumes.' },
            { id: 'consent', label: 'Informed Consent Process', placeholder: 'Describe consent procedures, including emergency consent waiver if applicable...',
              template: 'Written informed consent will be obtained from all participants (or their legally authorized representative) prior to any study-specific procedures. The consent process will include a discussion of the study purpose, procedures, risks, benefits, alternatives, and the voluntary nature of participation. Participants will have adequate time to consider participation and ask questions. [For emergency research: We request a waiver of informed consent under 21 CFR 50.24 (exception from informed consent for emergency research) because: (1) participants are in a life-threatening situation, (2) available treatments are unproven or unsatisfactory, (3) it is not feasible to obtain prospective consent, and (4) community consultation and public disclosure have been conducted.]' },
            { id: 'privacy', label: 'Privacy and Confidentiality', placeholder: 'Describe data storage, de-identification, access controls...',
              template: 'All study data will be stored in a password-protected, encrypted REDCap database hosted on [institution] servers. Paper records will be stored in locked cabinets in a secure research office. All data will be de-identified using a unique study ID; the linking key will be stored separately with restricted access. Only authorized study personnel will have access to identifiable data. Data will be retained for [X years] after study completion per [institutional/NIH] requirements. A Certificate of Confidentiality has been [obtained/will be obtained] from NIH.' },
            { id: 'safety', label: 'Data Safety Monitoring', placeholder: 'Describe DSMB composition, stopping rules, SAE reporting...',
              template: 'An independent Data Safety Monitoring Board (DSMB) will be established consisting of [X] members including [a biostatistician, clinical experts in [field], and an ethicist]. The DSMB will meet [every 6 months/after every X enrollments] to review safety data, including serious adverse events, protocol deviations, and interim efficacy data. Pre-specified stopping rules include: (1) O\'Brien-Fleming boundaries for efficacy, (2) conditional power futility boundary (<10%), and (3) safety boundary if [specific safety threshold]. Serious adverse events will be reported to the IRB within [24-48 hours] and to the DSMB and NIH program officer per regulatory requirements.' },
            { id: 'inclusion', label: 'Inclusion of Women, Minorities, and Children', placeholder: 'Describe plans for including women, minorities, and children...',
              template: 'This study will include both men and women. Based on the demographics of [condition] and our catchment area, we anticipate enrolling approximately [X]% women and [X]% underrepresented minorities. We will actively monitor enrollment demographics and implement targeted recruitment strategies if disparities are identified. [Children are/are not] included in this study because [justification]. The expected enrollment table is provided in the NIH Inclusion Enrollment Report (IER) form.' }
        ];

        hsFields.forEach(function(field) {
            html += '<div class="form-group"><label class="form-label">' + field.label
                + ' <button class="btn btn-xs btn-secondary" style="margin-left:8px;font-size:0.7rem;" onclick="GrantAssist.insertHSTemplate(\'' + field.id + '\')">Insert Template</button></label>'
                + '<textarea class="form-input" id="ga-hs-' + field.id + '" rows="4" placeholder="' + field.placeholder + '"></textarea></div>';
        });

        // Store templates for insertion
        window._hsTemplates = {};
        hsFields.forEach(function(f) { window._hsTemplates[f.id] = f.template; });

        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="GrantAssist.generateHumanSubjects()">Generate Human Subjects Section</button></div>';
        html += '<div id="ga-hs-output"></div>';
        html += '</div>';

        // ===== Budget (Enhanced with more justification items) =====
        html += '<div class="tab-content" id="tab-budget">';
        html += '<div class="card-subtitle">Budget justification helper with standard language for common clinical research line items.</div>';

        html += '<div class="card-title">Personnel Effort Calculator</div>';
        html += '<div id="ga-personnel-rows">';
        html += renderPersonnelRow(0, 'PI', 250000, 25);
        html += renderPersonnelRow(1, 'Co-I', 200000, 10);
        html += renderPersonnelRow(2, 'Coordinator', 65000, 100);
        html += renderPersonnelRow(3, 'Biostatistician', 180000, 15);
        html += '</div>';

        html += '<div class="btn-group mt-1 mb-2">'
            + '<button class="btn btn-sm btn-secondary" onclick="GrantAssist.calcAllEffort()">Calculate All</button>'
            + '</div>';

        html += '<div class="card-title">Fringe Benefits and Indirect Costs</div>';
        html += '<div class="form-row form-row--3 mb-2">'
            + '<div class="form-group"><label class="form-label">Fringe Rate (%)</label>'
            + '<input type="number" class="form-input form-input--small" id="ga-fringe" value="30"></div>'
            + '<div class="form-group"><label class="form-label">F&A (Indirect) Rate (%)</label>'
            + '<input type="number" class="form-input form-input--small" id="ga-indirect" value="55"></div>'
            + '<div class="form-group"><label class="form-label">F&A Base</label>'
            + '<select class="form-select" id="ga-fa-base"><option>MTDC</option><option>TDC</option><option>Salary + Wages</option></select></div>'
            + '</div>';

        html += '<div class="card-title">Common Line Items with Justification Templates</div>';
        var lineItems = [
            { item: 'Coordinator Salary', template: '[Name], [degree], will serve as the study coordinator at [X]% effort ($[Y]/year). [He/She] will be responsible for participant screening, enrollment, data collection, regulatory compliance, and coordination across study sites.' },
            { item: 'Biostatistician', template: '[Name], [degree], will serve as the study biostatistician at [X]% effort. [He/She] will oversee the statistical analysis plan, conduct interim and final analyses, and provide statistical support for manuscripts.' },
            { item: 'Research Assistant', template: 'A research assistant will support data entry, IRB submissions, and regulatory documentation at [X]% effort.' },
            { item: 'Equipment', template: '[Equipment name] ($[amount]) is requested for [purpose]. This equipment is not available through the institution and is essential for [specific study procedure]. The equipment will be used exclusively for study-related activities.' },
            { item: 'Imaging Core', template: 'The imaging core lab at [institution] will provide centralized, blinded adjudication of [CT/MRI] studies. Cost: $[X] per scan, estimated [N] scans.' },
            { item: 'Data Management (REDCap)', template: 'REDCap electronic data capture will be used for data management. Costs include database design ($[X]), hosting and maintenance ($[Y]/year), and 24/7 technical support. REDCap is HIPAA-compliant and FDA 21 CFR Part 11 compliant.' },
            { item: 'DSMB', template: 'An independent Data Safety Monitoring Board comprising [X] members will meet [quarterly/semi-annually] to review safety and efficacy data. Budget includes member honoraria ($[X] per meeting x [Y] meetings = $[Z]), teleconference costs, and meeting logistics.' },
            { item: 'Patient Travel/Reimbursement', template: 'Patient travel reimbursement for study visits at $[X] per visit x [N] visits x [N] participants = $[total]. This amount covers parking, transportation, and meal costs.' },
            { item: 'Investigator Travel', template: 'Travel funds are requested for [X] trips per year to [purpose: site visits, scientific meetings, steering committee meetings]. Estimated cost: $[X] per trip including airfare ($[Y]), hotel ($[Z] x [N] nights), per diem ($[W] x [N] days), and ground transportation ($[V]).' },
            { item: 'Consortium/Subcontract', template: '[Institution name] will serve as a consortium site and will be responsible for [specific role]. [PI name] at [institution] will oversee [activities]. The subcontract budget includes [personnel, supplies, etc.] totaling $[X] in direct costs per year.' },
            { item: 'Lab Analyses / Biomarkers', template: 'Blood samples will be analyzed for [biomarker(s)] using [assay/platform]. Cost per sample: $[X]. Total samples: [N participants] x [Y timepoints] = [Z samples]. Total cost: $[total].' },
            { item: 'Publication Costs', template: 'Publication costs are estimated at $[X] per manuscript for [N] anticipated publications. This includes page charges, color figure charges, and open-access fees where required by NIH public access policy.' }
        ];

        lineItems.forEach(function(li) {
            html += '<div class="expandable-header" onclick="this.classList.toggle(\'open\')">' + li.item + '</div>';
            html += '<div class="expandable-body"><div class="text-output" style="font-size:0.82rem">' + li.template
                + '<button class="btn btn-xs btn-secondary copy-btn" onclick="Export.copyText(this.parentElement.textContent.replace(\'Copy\',\'\').trim())">Copy</button></div></div>';
        });

        html += '</div>';

        // ===== Biosketch Helper =====
        html += '<div class="tab-content" id="tab-biosketch">';
        html += '<div class="card-subtitle">Format entries for NIH biosketch. Enter details and generate formatted text for each section.</div>';

        // Personal Statement
        html += '<div class="card-title">A. Personal Statement</div>';
        html += '<div class="form-group"><label class="form-label">Personal Statement (1 paragraph, relevant to this project)</label>'
            + '<textarea class="form-input" id="ga-bio-statement" rows="4" placeholder="Describe your qualifications, experience, and why you are well-suited to lead this project..."></textarea></div>';

        // Positions and Honors
        html += '<div class="card-title mt-2">B. Positions, Scientific Appointments, and Honors</div>';
        html += '<div class="form-group"><label class="form-label">Enter positions (one per line: Year-Year, Title, Institution)</label>'
            + '<textarea class="form-input" id="ga-bio-positions" rows="5" placeholder="2020-present, Associate Professor of Neurology, University of Washington\n2015-2020, Assistant Professor of Neurology, University of Washington\n2012-2015, Clinical Fellow, Massachusetts General Hospital"></textarea></div>';

        // Publications
        html += '<div class="card-title mt-2">C. Contributions to Science</div>';
        html += '<div class="form-group"><label class="form-label">Contribution Description (each contribution = 1 paragraph + up to 4 publications)</label>'
            + '<textarea class="form-input" id="ga-bio-contrib1-desc" rows="3" placeholder="My early work established that... This line of research demonstrated..."></textarea></div>';
        html += '<div class="form-group"><label class="form-label">Key Publications (up to 4, one per line in Vancouver format)</label>'
            + '<textarea class="form-input" id="ga-bio-contrib1-pubs" rows="4" placeholder="1. Author A, Author B, et al. Title. Journal. Year;Vol:Pages. PMID: XXXXX\n2. ..."></textarea></div>';

        // Grants
        html += '<div class="card-title mt-2">D. Additional Information: Research Support</div>';
        html += '<div class="form-group"><label class="form-label">Active Grants (one per line: Agency Number, PI, Title, Dates, Role)</label>'
            + '<textarea class="form-input" id="ga-bio-active" rows="4" placeholder="R01 NS123456 (PI: LastName) 07/01/2023-06/30/2028\nTitle of Grant\nRole: PI\nOverlap: None with current application"></textarea></div>';
        html += '<div class="form-group"><label class="form-label">Completed Grants</label>'
            + '<textarea class="form-input" id="ga-bio-completed" rows="3" placeholder="K23 NS098765 (PI: LastName) 07/01/2018-06/30/2023\nTitle of Grant\nRole: PI"></textarea></div>';

        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="GrantAssist.generateBiosketch()">Generate Formatted Biosketch</button></div>';
        html += '<div id="ga-bio-output"></div>';
        html += '</div>';

        // ===== Letter of Support =====
        html += '<div class="tab-content" id="tab-letters">';
        html += '<div class="card-subtitle">Generate template letters of support for collaborators, consultants, and institutional resources.</div>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Letter Type</label>'
            + '<select class="form-select" id="ga-letter-type">'
            + '<option value="collaborator">Collaborator Letter of Support</option>'
            + '<option value="consultant">Consultant Letter</option>'
            + '<option value="institution">Institutional Support Letter</option>'
            + '<option value="department">Department Chair Letter</option>'
            + '<option value="dsmb">DSMB Member Agreement</option>'
            + '</select></div>'
            + '<div class="form-group"><label class="form-label">PI Name</label>'
            + '<input type="text" class="form-input" id="ga-letter-pi" placeholder="Dr. Jane Smith"></div></div>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Signatory Name</label>'
            + '<input type="text" class="form-input" id="ga-letter-signatory" placeholder="Dr. John Doe"></div>'
            + '<div class="form-group"><label class="form-label">Signatory Title/Institution</label>'
            + '<input type="text" class="form-input" id="ga-letter-title" placeholder="Chief, Division of Stroke, University Hospital"></div></div>';

        html += '<div class="form-group"><label class="form-label">Project Title</label>'
            + '<input type="text" class="form-input" id="ga-letter-project" placeholder="Novel Biomarkers for Stroke Prognosis: A Multicenter Prospective Study"></div>';

        html += '<div class="form-group"><label class="form-label">Grant Mechanism</label>'
            + '<input type="text" class="form-input" id="ga-letter-mechanism" placeholder="R01, NIH/NINDS"></div>';

        html += '<div class="form-group"><label class="form-label">Specific Contribution / Resource Commitment</label>'
            + '<textarea class="form-input" id="ga-letter-contribution" rows="3" placeholder="e.g., I will provide access to our biobank of 10,000 stroke samples and serve as site PI for enrollment of 200 participants..."></textarea></div>';

        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="GrantAssist.generateLetter()">Generate Letter Template</button></div>';
        html += '<div id="ga-letter-output"></div>';
        html += '</div>';

        // ===== Budget Justification Helper =====
        html += '<div class="tab-content" id="tab-budgetjust">';
        html += '<div class="card-subtitle">Select an NIH grant mechanism to see budget parameters, then generate a structured budget justification outline.</div>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Grant Mechanism</label>'
            + '<select class="form-select" id="ga-bj-mechanism" onchange="GrantAssist.showMechanismInfo()">'
            + '<option value="">-- Select --</option>'
            + '<option value="R01">R01 (Research Project Grant)</option>'
            + '<option value="R21">R21 (Exploratory/Developmental)</option>'
            + '<option value="R03">R03 (Small Grant)</option>'
            + '<option value="K23">K23 (Mentored Patient-Oriented Research)</option>'
            + '<option value="K08">K08 (Mentored Clinical Scientist)</option>'
            + '<option value="F31">F31 (Predoctoral Fellowship)</option>'
            + '<option value="F32">F32 (Postdoctoral Fellowship)</option>'
            + '<option value="T32">T32 (Institutional Training Grant)</option>'
            + '</select></div>'
            + '<div class="form-group"><label class="form-label">Mechanism Details</label>'
            + '<div class="form-input" id="ga-bj-info" style="background:var(--bg-elevated);min-height:60px;font-size:0.85rem;line-height:1.6;white-space:pre-wrap">Select a mechanism to see details</div>'
            + '</div></div>';

        html += '<div class="form-group"><label class="form-label">Budget Justification Text (optional notes for template)</label>'
            + '<textarea class="form-input" id="ga-bj-notes" rows="3" placeholder="Enter any specific budget items, personnel, or notes to incorporate into the justification..."></textarea></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="GrantAssist.generateBudgetJustification()">Generate Template</button>'
            + '</div>';

        html += '<div id="ga-bj-output"></div>';
        html += '</div>';

        html += '</div>'; // end card

        // ===== LEARN SECTION =====
        html += '<div class="card">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\');">'
            + '\u25B6 Learn: Grant Writing Essentials</div>';
        html += '<div class="learn-body hidden" style="font-size:0.9rem;line-height:1.7;">';

        html += '<div class="card-subtitle" style="font-weight:600;">NIH Grant Structure</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li><strong>Specific Aims (1 page):</strong> The most critical page -- hook, gap, hypothesis, aims</li>'
            + '<li><strong>Significance:</strong> Why does this matter? What gap does it fill?</li>'
            + '<li><strong>Innovation:</strong> What is new about your approach?</li>'
            + '<li><strong>Approach:</strong> Detailed methods, preliminary data, timeline, pitfalls</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Specific Aims Page Architecture</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li><strong>Opening paragraph:</strong> Hook + Background + Gap + Innovation (3-5 sentences)</li>'
            + '<li><strong>Middle paragraph:</strong> Long-term goal + Objective + Central hypothesis + Rationale</li>'
            + '<li><strong>Aims (3):</strong> Each aim = statement + hypothesis + brief approach</li>'
            + '<li><strong>Closing:</strong> Expected outcomes + Impact + How this supports next steps</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Budget Tips</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li>Justify every line item with specific study tasks</li>'
            + '<li>Use institutional fringe benefit rates (verify annually)</li>'
            + '<li>Include 3-4% annual escalation for salary</li>'
            + '<li>R01 modular budget: request in $25K modules</li>'
            + '<li>Total direct costs for modular R01: up to $250K/year</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Common Pitfalls</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li><strong>Aims not independent:</strong> If Aim 1 fails, Aims 2-3 should still be doable</li>'
            + '<li><strong>Overpromising:</strong> Be realistic about scope and timeline</li>'
            + '<li><strong>Weak preliminary data:</strong> Show feasibility for each aim</li>'
            + '<li><strong>Ignoring reviewers:</strong> Address potential criticisms proactively in "Pitfalls & Alternatives"</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">References</div>';
        html += '<ul style="margin:0 0 0 16px;font-size:0.85rem;">'
            + '<li>Inouye SK, Fiellin DA. An evidence-based guide to writing grant proposals. <em>Ann Intern Med</em>. 2005;142:274-82.</li>'
            + '<li>NIH Office of Extramural Research. <a href="https://grants.nih.gov/grants/how-to-apply-application-guide.html" target="_blank" rel="noopener">Application Guide</a></li>'
            + '</ul>';
        html += '</div></div>';

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);
    }

    function renderPersonnelRow(idx, role, salary, effort) {
        return '<div class="form-row form-row--4 mb-1" id="ga-pers-row-' + idx + '">'
            + '<div class="form-group"><label class="form-label">' + (idx === 0 ? 'Role' : '') + '</label>'
            + '<input type="text" class="form-input form-input--small" id="ga-role-' + idx + '" value="' + role + '"></div>'
            + '<div class="form-group"><label class="form-label">' + (idx === 0 ? 'Annual Salary ($)' : '') + '</label>'
            + '<input type="number" class="form-input form-input--small" id="ga-salary-' + idx + '" value="' + salary + '"></div>'
            + '<div class="form-group"><label class="form-label">' + (idx === 0 ? '% Effort' : '') + '</label>'
            + '<input type="number" class="form-input form-input--small" id="ga-effort-' + idx + '" value="' + effort + '"></div>'
            + '<div class="form-group"><label class="form-label">' + (idx === 0 ? 'Annual Cost' : '') + '</label>'
            + '<div class="form-input form-input--small" id="ga-cost-' + idx + '" style="display:flex;align-items:center;font-family:var(--font-mono);color:var(--accent)">$' + (salary * effort / 100).toLocaleString() + '</div></div></div>';
    }

    function switchTab(tabId) {
        document.querySelectorAll('#ga-tabs .tab').forEach(function(t) { t.classList.toggle('active', t.dataset.tab === tabId); });
        document.querySelectorAll('.tab-content').forEach(function(tc) { tc.classList.toggle('active', tc.id === 'tab-' + tabId); });
    }

    function generateAims() {
        var hook = document.getElementById('ga-hook') ? document.getElementById('ga-hook').value : '';
        var background = document.getElementById('ga-background') ? document.getElementById('ga-background').value : '';
        var gap = document.getElementById('ga-gap') ? document.getElementById('ga-gap').value : '';
        var innovation = document.getElementById('ga-innovation') ? document.getElementById('ga-innovation').value : '';
        var ltgoal = document.getElementById('ga-ltgoal').value;
        var objective = document.getElementById('ga-objective').value;
        var hypothesis = document.getElementById('ga-hypothesis').value;
        var premise = document.getElementById('ga-premise').value;
        var impact = document.getElementById('ga-impact') ? document.getElementById('ga-impact').value : '';

        var text = 'SPECIFIC AIMS\n\n';

        // Opening paragraph
        if (hook || background || gap) {
            if (hook) text += hook + ' ';
            if (background) text += background + ' ';
            if (gap) text += gap + ' ';
            if (innovation) text += innovation + ' ';
            text += '\n\n';
        }

        // Middle paragraph
        if (ltgoal) text += ltgoal + ' ';
        if (objective) text += objective + ' ';
        if (hypothesis) text += hypothesis + '\n\n';
        if (premise) text += premise + '\n\n';

        // Aims
        for (var i = 1; i <= 3; i++) {
            var aim = document.getElementById('ga-aim' + i).value;
            var hyp = document.getElementById('ga-aim' + i + '-hyp').value;
            var approach = document.getElementById('ga-aim' + i + '-approach').value;
            if (aim) {
                text += aim + '\n';
                if (hyp) text += '  ' + hyp + '\n';
                if (approach) text += '  ' + approach + '\n';
                text += '\n';
            }
        }

        // Closing
        if (impact) text += impact + '\n';

        var outputHtml = '<div class="text-output mt-2" style="white-space:pre-wrap">' + text
            + '<button class="btn btn-xs btn-secondary copy-btn" onclick="Export.copyText(this.parentElement.textContent.replace(\'Copy\',\'\').trim())">Copy</button></div>';
        App.setTrustedHTML(document.getElementById('ga-aims-output'), outputHtml);

        var wordCount = text.split(/\s+/).filter(function(w) { return w.length > 0; }).length;
        var wcEl = document.getElementById('ga-aims-wordcount');
        if (wcEl) {
            wcEl.textContent = wordCount + ' words (R01 guideline: ~500 words / 1 page)';
            wcEl.style.color = wordCount > 550 ? 'var(--warning)' : 'var(--text-tertiary)';
        }
    }

    function generateDesign() {
        var type = document.getElementById('ga-studytype').value;
        var setting = document.getElementById('ga-setting').value;
        var pop = document.getElementById('ga-pop').value;
        var intervention = document.getElementById('ga-intervention').value;
        var comparator = document.getElementById('ga-comparator').value;
        var primary = document.getElementById('ga-primary-outcome').value;
        var secondary = document.getElementById('ga-secondary-outcomes').value;
        var followup = document.getElementById('ga-followup').value;
        var analysis = document.getElementById('ga-analysis').value;

        var text = 'STUDY DESIGN AND METHODS\n\n';
        text += 'Study Design: This is a ' + type.toLowerCase() + ' conducted at ' + (setting || '[setting]') + '.\n\n';
        text += 'Study Population: ' + (pop || '[population description]') + '\n\n';
        text += 'Intervention: ' + (intervention || '[intervention]') + '\n';
        text += 'Comparator: ' + (comparator || '[comparator]') + '\n\n';
        text += 'Outcomes:\n';
        text += '  Primary: ' + (primary || '[primary outcome]') + '\n';
        if (secondary) {
            text += '  Secondary: ' + secondary + '\n';
        }
        text += '\nFollow-up: ' + (followup || '[duration]') + '\n';
        text += '\nStatistical Analysis: ' + (analysis || '[analysis plan]') + '\n';

        var outputHtml = '<div class="text-output mt-2" style="white-space:pre-wrap">' + text
            + '<button class="btn btn-xs btn-secondary copy-btn" onclick="Export.copyText(this.parentElement.textContent.replace(\'Copy\',\'\').trim())">Copy</button></div>';
        App.setTrustedHTML(document.getElementById('ga-design-output'), outputHtml);
    }

    function generatePower() {
        var design = document.getElementById('ga-pwr-design').value;
        var param1 = parseFloat(document.getElementById('ga-pwr-param1').value);
        var param2 = parseFloat(document.getElementById('ga-pwr-param2').value);
        var alpha = parseFloat(document.getElementById('ga-pwr-alpha').value);
        var power = parseFloat(document.getElementById('ga-pwr-power').value);
        var dropout = parseFloat(document.getElementById('ga-pwr-dropout').value) / 100;
        var justification = document.getElementById('ga-pwr-just').value;

        var result, text;

        if (design === 'proportions') {
            result = Statistics.sampleSizeTwoProportions(param1, param2, alpha, power, 1, 'fleiss');
            var dropoutN = Math.ceil(result.total / (1 - dropout));

            text = 'Power Analysis and Sample Size Justification\n\n';
            text += 'The primary outcome is a binary endpoint comparing event rates between treatment and control groups. ';
            text += 'Based on ' + (justification || 'prior literature') + ', we assume a control group event rate of '
                + (param1 * 100).toFixed(1) + '% and a treatment group event rate of ' + (param2 * 100).toFixed(1)
                + '% (absolute risk reduction: ' + ((param1 - param2) * 100).toFixed(1) + ' percentage points). ';
            text += 'Using a two-sided significance level of ' + alpha + ' and ' + (power * 100).toFixed(0)
                + '% power with the Fleiss formula (continuity correction), we require '
                + result.n1 + ' participants per group (' + result.total + ' total). ';
            text += 'Accounting for ' + (dropout * 100).toFixed(0) + '% dropout, we plan to enroll '
                + dropoutN + ' participants. ';
            text += 'Sample size calculations were performed using Neuro-Epi.';
        } else if (design === 'ordinal') {
            var ctrlDist = [0.05, 0.07, 0.10, 0.10, 0.18, 0.20, 0.30];
            result = Statistics.sampleSizeOrdinalShift(ctrlDist, null, param1, alpha, power);
            var dropoutN2 = Math.ceil(result.total / (1 - dropout));

            text = 'Power Analysis and Sample Size Justification\n\n';
            text += 'The primary analysis will use an ordinal shift analysis of the modified Rankin Scale (mRS) at 90 days '
                + 'using a proportional odds model. ';
            text += 'Based on ' + (justification || 'prior EVT trials') + ', we assume a common odds ratio of '
                + param1 + '. ';
            text += 'Using the Whitehead formula with a two-sided significance level of ' + alpha + ' and '
                + (power * 100).toFixed(0) + '% power, we require ' + result.nPerGroup + ' participants per group ('
                + result.total + ' total). ';
            text += 'After adjusting for ' + (dropout * 100).toFixed(0) + '% dropout, ' + dropoutN2 + ' participants will be enrolled.';
        } else {
            var schoenfeld = Statistics.sampleSizeSchoenfeld(param1, alpha, power, 1);
            text = 'Power Analysis\n\n';
            text += 'Using the Schoenfeld formula for log-rank test with HR = ' + param1 + ', '
                + 'alpha = ' + alpha + ', and ' + (power * 100).toFixed(0) + '% power, '
                + schoenfeld.events + ' events are required.';
        }

        var outputHtml = '<div class="text-output mt-2" style="white-space:pre-wrap">' + text
            + '<button class="btn btn-xs btn-secondary copy-btn" onclick="Export.copyText(this.parentElement.textContent.replace(\'Copy\',\'\').trim())">Copy</button></div>';
        App.setTrustedHTML(document.getElementById('ga-power-output'), outputHtml);
    }

    function generateTimeline() {
        var tasks = [];
        for (var i = 0; i < 20; i++) {
            var labelEl = document.getElementById('ga-ms-label-' + i);
            var startEl = document.getElementById('ga-ms-start-' + i);
            var endEl = document.getElementById('ga-ms-end-' + i);
            if (labelEl && labelEl.value && startEl && endEl) {
                tasks.push({
                    label: labelEl.value,
                    start: parseInt(startEl.value),
                    end: parseInt(endEl.value)
                });
            }
        }

        // Collect milestone markers
        var markers = [];
        for (var m = 0; m < 10; m++) {
            var mkrLabel = document.getElementById('ga-mkr-label-' + m);
            var mkrMonth = document.getElementById('ga-mkr-month-' + m);
            if (mkrLabel && mkrLabel.value && mkrMonth && mkrMonth.value) {
                markers.push({ label: mkrLabel.value, month: parseInt(mkrMonth.value) });
            }
        }

        var totalMonths = parseInt(document.getElementById('ga-total-months').value) || 60;
        var canvas = document.getElementById('ga-gantt');
        if (canvas && tasks.length > 0) {
            var chartHeight = 50 + tasks.length * 35 + (markers.length > 0 ? 40 : 0);
            Charts.GanttChart(canvas, {
                tasks: tasks,
                totalMonths: totalMonths,
                title: 'Project Timeline',
                width: 800,
                height: chartHeight
            });

            // Draw milestone markers on top of Gantt
            if (markers.length > 0) {
                drawMilestoneMarkers(canvas, markers, totalMonths, tasks.length);
            }
        }
    }

    function drawMilestoneMarkers(canvas, markers, totalMonths, nTasks) {
        var ctx = canvas.getContext('2d');
        var dpr = window.devicePixelRatio || 1;
        var labelW = 200;
        var headerH = 50;
        var plotW = 800 - labelW - 30;
        var monthW = plotW / totalMonths;
        var bottomY = headerH + nTasks * 32;

        ctx.save();
        markers.forEach(function(mkr) {
            var x = (labelW + mkr.month * monthW) * dpr;
            var y1 = headerH * dpr;
            var y2 = bottomY * dpr;

            // Dashed vertical line
            ctx.setLineDash([4 * dpr, 3 * dpr]);
            ctx.strokeStyle = '#f87171';
            ctx.lineWidth = 1.5 * dpr;
            ctx.beginPath();
            ctx.moveTo(x, y1);
            ctx.lineTo(x, y2);
            ctx.stroke();
            ctx.setLineDash([]);

            // Diamond marker
            var dSize = 6 * dpr;
            ctx.fillStyle = '#f87171';
            ctx.beginPath();
            ctx.moveTo(x, y2);
            ctx.lineTo(x - dSize, y2 + dSize);
            ctx.lineTo(x, y2 + 2 * dSize);
            ctx.lineTo(x + dSize, y2 + dSize);
            ctx.closePath();
            ctx.fill();

            // Label
            ctx.fillStyle = '#f87171';
            ctx.font = (9 * dpr) + 'px system-ui, -apple-system, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(mkr.label, x, y2 + 2.5 * dSize + 6 * dpr);
        });
        ctx.restore();
    }

    function generateHumanSubjects() {
        var fields = ['risks', 'benefits', 'recruitment', 'consent', 'privacy', 'safety', 'inclusion'];
        var labels = ['Risks to Participants', 'Potential Benefits', 'Recruitment Plan', 'Informed Consent', 'Privacy and Confidentiality', 'Data Safety Monitoring', 'Inclusion of Women, Minorities, and Children'];

        var text = 'PROTECTION OF HUMAN SUBJECTS\n\n';
        fields.forEach(function(f, i) {
            var val = document.getElementById('ga-hs-' + f).value;
            if (val) {
                text += labels[i] + '\n' + val + '\n\n';
            }
        });

        var outputHtml = '<div class="text-output mt-2" style="white-space:pre-wrap">' + text
            + '<button class="btn btn-xs btn-secondary copy-btn" onclick="Export.copyText(this.parentElement.textContent.replace(\'Copy\',\'\').trim())">Copy</button></div>';
        App.setTrustedHTML(document.getElementById('ga-hs-output'), outputHtml);
    }

    function insertHSTemplate(fieldId) {
        var el = document.getElementById('ga-hs-' + fieldId);
        if (el && window._hsTemplates && window._hsTemplates[fieldId]) {
            el.value = window._hsTemplates[fieldId];
        }
    }

    function calcAllEffort() {
        var totalSalary = 0;
        for (var i = 0; i < 10; i++) {
            var salaryEl = document.getElementById('ga-salary-' + i);
            var effortEl = document.getElementById('ga-effort-' + i);
            var costEl = document.getElementById('ga-cost-' + i);
            if (salaryEl && effortEl && costEl) {
                var salary = parseFloat(salaryEl.value) || 0;
                var effort = parseFloat(effortEl.value) || 0;
                var cost = salary * effort / 100;
                costEl.textContent = '$' + cost.toLocaleString();
                totalSalary += cost;
            }
        }
        Export.showToast('Total personnel: $' + totalSalary.toLocaleString());
    }

    function calcEffort() {
        calcAllEffort();
    }

    function generateBiosketch() {
        var statement = document.getElementById('ga-bio-statement') ? document.getElementById('ga-bio-statement').value : '';
        var positions = document.getElementById('ga-bio-positions') ? document.getElementById('ga-bio-positions').value : '';
        var contrib1Desc = document.getElementById('ga-bio-contrib1-desc') ? document.getElementById('ga-bio-contrib1-desc').value : '';
        var contrib1Pubs = document.getElementById('ga-bio-contrib1-pubs') ? document.getElementById('ga-bio-contrib1-pubs').value : '';
        var active = document.getElementById('ga-bio-active') ? document.getElementById('ga-bio-active').value : '';
        var completed = document.getElementById('ga-bio-completed') ? document.getElementById('ga-bio-completed').value : '';

        var text = 'BIOGRAPHICAL SKETCH\n';
        text += '=====================================\n\n';

        if (statement) {
            text += 'A. Personal Statement\n\n';
            text += statement + '\n\n';
        }

        if (positions) {
            text += 'B. Positions, Scientific Appointments, and Honors\n\n';
            text += 'Positions and Employment\n';
            positions.split('\n').forEach(function(line) {
                if (line.trim()) text += '  ' + line.trim() + '\n';
            });
            text += '\n';
        }

        if (contrib1Desc || contrib1Pubs) {
            text += 'C. Contributions to Science\n\n';
            if (contrib1Desc) text += '1. ' + contrib1Desc + '\n\n';
            if (contrib1Pubs) {
                contrib1Pubs.split('\n').forEach(function(line) {
                    if (line.trim()) text += '   ' + line.trim() + '\n';
                });
                text += '\n';
            }
        }

        if (active || completed) {
            text += 'D. Additional Information: Research Support\n\n';
            if (active) {
                text += 'Active Support\n';
                active.split('\n').forEach(function(line) {
                    if (line.trim()) text += '  ' + line.trim() + '\n';
                });
                text += '\n';
            }
            if (completed) {
                text += 'Completed Support\n';
                completed.split('\n').forEach(function(line) {
                    if (line.trim()) text += '  ' + line.trim() + '\n';
                });
            }
        }

        var outputHtml = '<div class="text-output mt-2" style="white-space:pre-wrap;font-size:0.85rem;">' + text
            + '<button class="btn btn-xs btn-secondary copy-btn" onclick="Export.copyText(this.parentElement.textContent.replace(\'Copy\',\'\').trim())">Copy</button></div>';
        App.setTrustedHTML(document.getElementById('ga-bio-output'), outputHtml);
    }

    function generateLetter() {
        var type = document.getElementById('ga-letter-type').value;
        var pi = document.getElementById('ga-letter-pi').value || '[PI Name]';
        var signatory = document.getElementById('ga-letter-signatory').value || '[Signatory Name]';
        var title = document.getElementById('ga-letter-title').value || '[Title, Institution]';
        var project = document.getElementById('ga-letter-project').value || '[Project Title]';
        var mechanism = document.getElementById('ga-letter-mechanism').value || '[Grant Mechanism]';
        var contribution = document.getElementById('ga-letter-contribution').value || '[specific contributions/resources]';

        var text = '';
        var date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        text += date + '\n\n';

        if (type === 'collaborator') {
            text += 'Dear Members of the Review Panel,\n\n';
            text += 'I am writing to express my enthusiastic support for the ' + mechanism + ' application entitled "'
                + project + '" submitted by ' + pi + '.\n\n';
            text += 'As a collaborator on this project, I am committed to providing the following: ' + contribution + '\n\n';
            text += 'I have reviewed the specific aims and research plan and believe this study addresses an important '
                + 'scientific question with rigorous methodology. I am confident that the proposed research will generate '
                + 'impactful findings that advance our understanding of [disease/condition].\n\n';
            text += 'I confirm my willingness to participate in this project as described in the application. '
                + 'I look forward to a productive collaboration.\n\n';
            text += 'Sincerely,\n\n' + signatory + '\n' + title;
        } else if (type === 'consultant') {
            text += 'Dear Review Panel,\n\n';
            text += 'I am pleased to serve as a consultant on the ' + mechanism + ' application "'
                + project + '" led by ' + pi + '.\n\n';
            text += 'I will provide expertise in ' + contribution + '. Specifically, I will be available for '
                + '[X hours per month/quarterly consultation calls] to advise on [specific aspects of the project]. '
                + 'My consulting rate is $[X] per hour, consistent with my institutional rate.\n\n';
            text += 'I have reviewed the research plan and confirm my availability for the duration of the project.\n\n';
            text += 'Sincerely,\n\n' + signatory + '\n' + title;
        } else if (type === 'institution') {
            text += 'To Whom It May Concern,\n\n';
            text += 'On behalf of [Institution], I am writing to confirm our institutional support for the '
                + mechanism + ' application entitled "' + project + '" submitted by ' + pi + '.\n\n';
            text += 'Our institution will provide the following resources and support: ' + contribution + '\n\n';
            text += 'Additionally, we commit to providing [protected research time / laboratory space / '
                + 'clinical research unit access / IRB oversight / other institutional resources] for the duration of this project.\n\n';
            text += '[Institution] has a strong track record in clinical research with [X] active clinical trials '
                + 'and robust research infrastructure including [describe key resources].\n\n';
            text += 'Sincerely,\n\n' + signatory + '\n' + title;
        } else if (type === 'department') {
            text += 'Dear Review Panel,\n\n';
            text += 'As Chair of the Department of [Department] at [Institution], I am writing to express my '
                + 'strong support for the ' + mechanism + ' application by ' + pi + ' entitled "' + project + '".\n\n';
            text += pi + ' is an outstanding investigator who has [describe track record]. I am committed to ensuring '
                + '[his/her] success by providing [X]% protected time for research, mentoring support, and access to '
                + 'departmental resources including [describe resources].\n\n';
            text += contribution + '\n\n';
            text += 'I strongly endorse this application and am confident it will be successful.\n\n';
            text += 'Sincerely,\n\n' + signatory + '\n' + title;
        } else if (type === 'dsmb') {
            text += 'Dear ' + pi + ',\n\n';
            text += 'I am writing to confirm my willingness to serve as a member of the Data Safety Monitoring Board '
                + '(DSMB) for the study entitled "' + project + '" funded by ' + mechanism + '.\n\n';
            text += 'I understand that my responsibilities will include reviewing interim safety data, assessing the '
                + 'risk-benefit profile, monitoring recruitment progress, and making recommendations regarding study continuation, '
                + 'modification, or termination.\n\n';
            text += 'I confirm that I have no significant conflicts of interest with the study investigators, sponsors, '
                + 'or the intervention being studied. ' + contribution + '\n\n';
            text += 'I am available to attend [quarterly/semi-annual] DSMB meetings as scheduled.\n\n';
            text += 'Sincerely,\n\n' + signatory + '\n' + title;
        }

        var outputHtml = '<div class="text-output mt-2" style="white-space:pre-wrap;font-size:0.88rem;">' + text
            + '<button class="btn btn-xs btn-secondary copy-btn" onclick="Export.copyText(this.parentElement.textContent.replace(\'Copy\',\'\').trim())">Copy</button></div>';
        App.setTrustedHTML(document.getElementById('ga-letter-output'), outputHtml);
    }

    // ===== Budget Justification Helper Data & Functions =====
    var MECHANISM_INFO = {
        'R01': { duration: '3-5 years', budget: 'Modular: up to $250K direct costs/year (in $25K modules). Non-modular if >$500K any year.', categories: ['Senior/Key Personnel', 'Other Personnel', 'Equipment (>$5K)', 'Travel (domestic + international)', 'Other Direct Costs (supplies, publication, consultant)', 'Consortium/Contractual Costs'] },
        'R21': { duration: '2 years (max)', budget: 'Up to $275K total direct costs over the entire project period. No more than $200K in any single year.', categories: ['Senior/Key Personnel', 'Other Personnel', 'Equipment', 'Travel', 'Other Direct Costs'] },
        'R03': { duration: '2 years (max)', budget: 'Up to $50K direct costs/year ($100K total).', categories: ['Senior/Key Personnel', 'Other Personnel', 'Travel', 'Other Direct Costs'] },
        'K23': { duration: '3-5 years', budget: 'Salary up to NIH salary cap with 75% protected time. Research support up to $50K/year.', categories: ['Candidate Salary + Fringe', 'Research Costs', 'Travel (training-related)', 'Other Direct Costs'] },
        'K08': { duration: '3-5 years', budget: 'Salary up to NIH salary cap with 75% protected time. Research support up to $50K/year.', categories: ['Candidate Salary + Fringe', 'Research Costs', 'Travel (training-related)', 'Other Direct Costs'] },
        'F31': { duration: '1-5 years (typically 3-4)', budget: 'Stipend per NIH NRSA scale. Tuition/fees + institutional allowance.', categories: ['Stipend', 'Tuition and Fees', 'Institutional Allowance'] },
        'F32': { duration: '1-3 years', budget: 'Stipend per NIH NRSA scale (based on years of postdoc experience). Institutional allowance.', categories: ['Stipend', 'Institutional Allowance'] },
        'T32': { duration: '5 years (renewable)', budget: 'Stipend per NRSA scale per trainee. Tuition/fees, training-related expenses per trainee.', categories: ['Trainee Stipends', 'Tuition and Fees', 'Training-Related Expenses', 'Participant/Trainee Support Costs'] }
    };

    function showMechanismInfo() {
        var mech = document.getElementById('ga-bj-mechanism').value;
        var el = document.getElementById('ga-bj-info');
        if (!mech || !MECHANISM_INFO[mech]) {
            el.textContent = 'Select a mechanism to see details';
            return;
        }
        var info = MECHANISM_INFO[mech];
        el.textContent = 'Duration: ' + info.duration + '\nBudget: ' + info.budget + '\nCategories: ' + info.categories.join(', ');
    }

    function generateBudgetJustification() {
        var mech = document.getElementById('ga-bj-mechanism').value;
        var notes = document.getElementById('ga-bj-notes').value.trim();
        if (!mech || !MECHANISM_INFO[mech]) {
            Export.showToast('Please select a grant mechanism.', 'error');
            return;
        }
        var info = MECHANISM_INFO[mech];
        var isK = (mech === 'K23' || mech === 'K08');
        var isF = (mech === 'F31' || mech === 'F32');
        var isT = (mech === 'T32');

        var text = 'BUDGET JUSTIFICATION\n';
        text += 'Grant Mechanism: ' + mech + ' (' + info.duration + ')\n';
        text += 'Budget Parameters: ' + info.budget + '\n\n';

        if (isF) {
            text += 'STIPEND\n';
            text += '[Fellow Name] will be supported at the NIH NRSA stipend level for Year [X] of postdoctoral/predoctoral training ($[amount]/year per NIH guidelines).\n\n';
            text += 'TUITION AND FEES\n';
            text += 'Tuition and fees are requested at the institutional rate of $[amount]/year as allowed under NIH policy.\n\n';
            text += 'INSTITUTIONAL ALLOWANCE\n';
            text += 'The institutional allowance of $[amount] will be used for research supplies ($[X]), travel to scientific meetings ($[Y]), health insurance ($[Z]), and other training-related expenses.\n\n';
        } else if (isT) {
            text += 'PARTICIPANT/TRAINEE SUPPORT COSTS\n';
            text += 'Stipends: [N] predoctoral trainees at $[amount]/year and [N] postdoctoral trainees at $[amount]/year per NIH NRSA stipend levels.\n\n';
            text += 'Tuition and Fees: Requested at institutional rate of $[amount] per predoctoral trainee and $[amount] per postdoctoral trainee.\n\n';
            text += 'Training-Related Expenses: $[amount] per trainee for research supplies, travel to one scientific meeting, and professional development activities.\n\n';
        } else {
            text += 'A. SENIOR/KEY PERSONNEL\n\n';
            if (isK) {
                text += '[Candidate Name], [Degree], [Title] (Candidate)\n';
                text += '[He/She] will devote 75% of [his/her] research effort to this award. Salary is requested at $[amount] ([X]% of institutional base salary of $[Y], consistent with NIH salary cap). [He/She] will be responsible for all aspects of the proposed research including [specific activities].\n\n';
            } else {
                text += '[PI Name], [Degree], [Title] (PI, [X]% effort)\n';
                text += '[He/She] will devote [X]% of [his/her] research effort to this project. Salary is requested at $[amount] ([X]% of institutional base salary of $[Y]). As PI, [he/she] will provide overall scientific direction, oversee data collection and analysis, and lead manuscript preparation.\n\n';
                text += '[Co-I Name], [Degree], [Title] (Co-Investigator, [X]% effort)\n';
                text += '[He/She] will devote [X]% effort ($[amount]/year) to provide expertise in [area]. Responsibilities include [specific tasks].\n\n';
            }

            text += 'B. OTHER PERSONNEL\n\n';
            text += 'Research Coordinator ([X]% effort): $[amount]/year. [He/She] will coordinate participant recruitment, data collection, regulatory submissions, and multi-site communication.\n\n';
            text += 'Data Analyst/Biostatistician ([X]% effort): $[amount]/year. Will implement the statistical analysis plan, conduct interim and final analyses, and prepare tables and figures.\n\n';

            if (mech === 'R01' || mech === 'R21') {
                text += 'C. EQUIPMENT (items >$5,000)\n\n';
                text += '[Equipment name]: $[amount]. Justification: [This equipment is essential for (purpose) and is not available through the institution.]\n\n';
            }

            text += (mech === 'R01' || mech === 'R21' ? 'D' : 'C') + '. TRAVEL\n\n';
            text += 'Domestic Travel: $[amount]/year for [X] trip(s) to [scientific meetings/site visits]. Includes airfare ($[X]), hotel ($[X] x [N] nights), per diem ($[X] x [N] days), ground transportation ($[X]).\n\n';

            if (mech === 'R01') {
                text += 'E. PARTICIPANT/TRAINEE SUPPORT COSTS\n\n';
                text += '[If applicable: Participant compensation of $[amount] per study visit x [N] visits x [N] participants = $[total]. This covers time and travel costs for study participation.]\n\n';

                text += 'F. OTHER DIRECT COSTS\n\n';
            } else {
                text += (isK ? 'D' : (mech === 'R21' ? 'E' : 'D')) + '. OTHER DIRECT COSTS\n\n';
            }
            text += 'Research Supplies: $[amount]/year for [describe supplies, e.g., lab reagents, data storage, printing].\n\n';
            text += 'Publication Costs: $[amount] for [N] anticipated open-access publications per NIH public access policy.\n\n';
            text += 'Consultant Costs: [Name], [expertise], $[rate]/hour x [N] hours = $[amount] for [specific consultation purpose].\n\n';

            if (mech === 'R01') {
                text += 'G. CONSORTIUM/CONTRACTUAL COSTS\n\n';
                text += '[Consortium Institution Name]\n';
                text += 'Direct Costs: $[amount]/year. [Site PI Name] ([X]% effort) will oversee [activities] at [institution]. Budget includes personnel ($[X]), supplies ($[Y]), and [other items].\n';
                text += 'F&A Costs: $[amount]/year (based on [institution]\'s negotiated rate of [X]%).\n\n';
            }
        }

        if (notes) {
            text += 'ADDITIONAL NOTES\n\n' + notes + '\n';
        }

        var outputHtml = '<div class="text-output mt-2" style="white-space:pre-wrap;font-size:0.85rem;">' + text
            + '<button class="btn btn-xs btn-secondary copy-btn" onclick="Export.copyText(this.parentElement.textContent.replace(\'Copy\',\'\').trim())">Copy</button></div>';
        App.setTrustedHTML(document.getElementById('ga-bj-output'), outputHtml);
        Export.showToast('Budget justification template generated.', 'success');
    }

    App.registerModule(MODULE_ID, { render: render });

    window.GrantAssist = {
        switchTab: switchTab,
        generateAims: generateAims,
        generateDesign: generateDesign,
        generatePower: generatePower,
        generateTimeline: generateTimeline,
        generateHumanSubjects: generateHumanSubjects,
        insertHSTemplate: insertHSTemplate,
        calcEffort: calcEffort,
        calcAllEffort: calcAllEffort,
        generateBiosketch: generateBiosketch,
        generateLetter: generateLetter,
        showMechanismInfo: showMechanismInfo,
        generateBudgetJustification: generateBudgetJustification
    };
})();
