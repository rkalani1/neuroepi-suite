/**
 * NeuroEpi Suite — Grant Assistant Module
 * Specific Aims builder, Study Design generator, Power justification,
 * Timeline (Gantt), Human Subjects template, Budget helper
 */

(function() {
    'use strict';

    const MODULE_ID = 'grant-assistant';

    function render(container) {
        var html = App.createModuleLayout(
            'Grant Assistant',
            'Tools for NIH grant preparation: Specific Aims page builder, study design section generator, Gantt timeline, human subjects template, and budget justification.'
        );

        html += '<div class="card">';
        html += '<div class="tabs" id="ga-tabs">'
            + '<button class="tab active" data-tab="aims" onclick="GrantAssist.switchTab(\'aims\')">Specific Aims</button>'
            + '<button class="tab" data-tab="design" onclick="GrantAssist.switchTab(\'design\')">Study Design</button>'
            + '<button class="tab" data-tab="power" onclick="GrantAssist.switchTab(\'power\')">Power Justification</button>'
            + '<button class="tab" data-tab="timeline" onclick="GrantAssist.switchTab(\'timeline\')">Timeline</button>'
            + '<button class="tab" data-tab="human" onclick="GrantAssist.switchTab(\'human\')">Human Subjects</button>'
            + '<button class="tab" data-tab="budget" onclick="GrantAssist.switchTab(\'budget\')">Budget</button>'
            + '</div>';

        // ===== Specific Aims =====
        html += '<div class="tab-content active" id="tab-aims">';
        html += '<div class="card-subtitle">Build an NIH-style Specific Aims page (~1 page, ~500 words). Fill in each section and generate formatted text.</div>';

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

        // ===== Timeline (Gantt) =====
        html += '<div class="tab-content" id="tab-timeline">';
        html += '<div class="card-subtitle">Create a project timeline Gantt chart. Add milestones with start/end months.</div>';

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

        defaultMilestones.forEach(function(m, i) {
            html += '<div class="form-row form-row--3 mb-1" style="align-items:end">'
                + '<div class="form-group"><label class="form-label">' + (i === 0 ? 'Milestone' : '') + '</label>'
                + '<input type="text" class="form-input form-input--small" id="ga-ms-label-' + i + '" value="' + m.label + '"></div>'
                + '<div class="form-group"><label class="form-label">' + (i === 0 ? 'Start (month)' : '') + '</label>'
                + '<input type="number" class="form-input form-input--small" id="ga-ms-start-' + i + '" value="' + m.start + '"></div>'
                + '<div class="form-group"><label class="form-label">' + (i === 0 ? 'End (month)' : '') + '</label>'
                + '<input type="number" class="form-input form-input--small" id="ga-ms-end-' + i + '" value="' + m.end + '"></div>'
                + '</div>';
        });
        html += '</div>';

        html += '<div class="form-group"><label class="form-label">Total Duration (months)</label>'
            + '<input type="number" class="form-input" id="ga-total-months" value="60" style="width:120px"></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="GrantAssist.generateTimeline()">Generate Gantt Chart</button>'
            + '</div>';

        html += '<div class="chart-container"><canvas id="ga-gantt" width="800" height="300"></canvas></div>';
        html += '<div class="chart-actions"><button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'ga-gantt\'),\'timeline.png\')">Export PNG</button></div>';
        html += '</div>';

        // ===== Human Subjects =====
        html += '<div class="tab-content" id="tab-human">';
        html += '<div class="card-subtitle">Structured template for Human Subjects protection plan.</div>';

        var hsFields = [
            { id: 'risks', label: 'Risks to Participants', placeholder: 'Describe physical, psychological, social, legal, and economic risks...' },
            { id: 'benefits', label: 'Potential Benefits', placeholder: 'Describe direct benefits to participants and general knowledge benefits...' },
            { id: 'recruitment', label: 'Recruitment Plan', placeholder: 'Describe recruitment methods, settings, and strategies for adequate enrollment...' },
            { id: 'consent', label: 'Informed Consent Process', placeholder: 'Describe consent procedures, including emergency consent waiver if applicable...' },
            { id: 'privacy', label: 'Privacy and Confidentiality', placeholder: 'Describe data storage, de-identification, access controls...' },
            { id: 'safety', label: 'Data Safety Monitoring', placeholder: 'Describe DSMB composition, stopping rules, SAE reporting...' },
            { id: 'inclusion', label: 'Inclusion of Women and Minorities', placeholder: 'Describe plans for including women, minorities, and children...' }
        ];

        hsFields.forEach(function(field) {
            html += '<div class="form-group"><label class="form-label">' + field.label + '</label>'
                + '<textarea class="form-input" id="ga-hs-' + field.id + '" rows="3" placeholder="' + field.placeholder + '"></textarea></div>';
        });

        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="GrantAssist.generateHumanSubjects()">Generate Human Subjects Section</button></div>';
        html += '<div id="ga-hs-output"></div>';
        html += '</div>';

        // ===== Budget =====
        html += '<div class="tab-content" id="tab-budget">';
        html += '<div class="card-subtitle">Budget justification helper for common clinical research line items.</div>';

        html += '<div class="card-title">Personnel Effort Calculator</div>';
        html += '<div class="form-row form-row--4 mb-2">'
            + '<div class="form-group"><label class="form-label">Role</label><input type="text" class="form-input form-input--small" id="ga-role" placeholder="PI"></div>'
            + '<div class="form-group"><label class="form-label">Annual Salary ($)</label><input type="number" class="form-input form-input--small" id="ga-salary" value="250000"></div>'
            + '<div class="form-group"><label class="form-label">% Effort</label><input type="number" class="form-input form-input--small" id="ga-effort" value="25"></div>'
            + '<div class="form-group"><label class="form-label">Annual Cost</label><div class="form-input form-input--small" id="ga-cost" style="display:flex;align-items:center;font-family:var(--font-mono);color:var(--accent)">$62,500</div></div>'
            + '</div>';
        html += '<button class="btn btn-sm btn-secondary mb-2" onclick="GrantAssist.calcEffort()">Calculate</button>';

        html += '<div class="card-title">Common Line Items with Justification Templates</div>';
        var lineItems = [
            { item: 'Coordinator Salary', template: '[Name], [degree], will serve as the study coordinator at [X]% effort ($[Y]/year). [He/She] will be responsible for participant screening, enrollment, data collection, regulatory compliance, and coordination across study sites.' },
            { item: 'Biostatistician', template: '[Name], [degree], will serve as the study biostatistician at [X]% effort. [He/She] will oversee the statistical analysis plan, conduct interim and final analyses, and provide statistical support for manuscripts.' },
            { item: 'Research Assistant', template: 'A research assistant will support data entry, IRB submissions, and regulatory documentation at [X]% effort.' },
            { item: 'Imaging Core', template: 'The imaging core lab at [institution] will provide centralized, blinded adjudication of [CT/MRI] studies. Cost: $[X] per scan, estimated [N] scans.' },
            { item: 'Data Management', template: 'REDCap electronic data capture will be used for data management. Costs include database design, hosting, and 24/7 support ($[X]/year).' },
            { item: 'DSMB', template: 'An independent Data Safety Monitoring Board comprising [X] members will meet [quarterly/semi-annually] to review safety and efficacy data. Cost includes honoraria and meeting logistics.' },
            { item: 'Patient Travel', template: 'Patient travel reimbursement for study visits at $[X] per visit x [N] visits x [N] participants.' }
        ];

        lineItems.forEach(function(li) {
            html += '<div class="expandable-header" onclick="this.classList.toggle(\'open\')">' + li.item + '</div>';
            html += '<div class="expandable-body"><div class="text-output" style="font-size:0.82rem">' + li.template
                + '<button class="btn btn-xs btn-secondary copy-btn" onclick="Export.copyText(this.parentElement.textContent.replace(\'Copy\',\'\').trim())">Copy</button></div></div>';
        });

        html += '</div>';

        html += '</div>'; // end card

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);
    }

    function switchTab(tabId) {
        document.querySelectorAll('#ga-tabs .tab').forEach(function(t) { t.classList.toggle('active', t.dataset.tab === tabId); });
        document.querySelectorAll('.tab-content').forEach(function(tc) { tc.classList.toggle('active', tc.id === 'tab-' + tabId); });
    }

    function generateAims() {
        var ltgoal = document.getElementById('ga-ltgoal').value;
        var objective = document.getElementById('ga-objective').value;
        var hypothesis = document.getElementById('ga-hypothesis').value;
        var premise = document.getElementById('ga-premise').value;

        var text = 'SPECIFIC AIMS\n\n';
        if (ltgoal) text += ltgoal + ' ';
        if (objective) text += objective + ' ';
        if (hypothesis) text += hypothesis + '\n\n';
        if (premise) text += premise + '\n\n';

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
            text += 'Sample size calculations were performed using NeuroEpi Suite.';
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
        for (var i = 0; i < 7; i++) {
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

        var totalMonths = parseInt(document.getElementById('ga-total-months').value) || 60;
        var canvas = document.getElementById('ga-gantt');
        if (canvas && tasks.length > 0) {
            Charts.GanttChart(canvas, {
                tasks: tasks,
                totalMonths: totalMonths,
                title: 'Project Timeline',
                width: 800,
                height: 50 + tasks.length * 35
            });
        }
    }

    function generateHumanSubjects() {
        var fields = ['risks', 'benefits', 'recruitment', 'consent', 'privacy', 'safety', 'inclusion'];
        var labels = ['Risks to Participants', 'Potential Benefits', 'Recruitment Plan', 'Informed Consent', 'Privacy and Confidentiality', 'Data Safety Monitoring', 'Inclusion of Women and Minorities'];

        var text = 'PROTECTION OF HUMAN SUBJECTS\n\n';
        fields.forEach(function(f, i) {
            var val = document.getElementById('ga-hs-' + f).value;
            if (val) {
                text += labels[i] + ': ' + val + '\n\n';
            }
        });

        var outputHtml = '<div class="text-output mt-2" style="white-space:pre-wrap">' + text
            + '<button class="btn btn-xs btn-secondary copy-btn" onclick="Export.copyText(this.parentElement.textContent.replace(\'Copy\',\'\').trim())">Copy</button></div>';
        App.setTrustedHTML(document.getElementById('ga-hs-output'), outputHtml);
    }

    function calcEffort() {
        var salary = parseFloat(document.getElementById('ga-salary').value);
        var effort = parseFloat(document.getElementById('ga-effort').value);
        var cost = salary * effort / 100;
        var el = document.getElementById('ga-cost');
        if (el) el.textContent = '$' + cost.toLocaleString();
    }

    App.registerModule(MODULE_ID, { render: render });

    window.GrantAssist = {
        switchTab: switchTab,
        generateAims: generateAims,
        generateDesign: generateDesign,
        generatePower: generatePower,
        generateTimeline: generateTimeline,
        generateHumanSubjects: generateHumanSubjects,
        calcEffort: calcEffort
    };
})();
