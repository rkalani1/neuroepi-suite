/**
 * Neuro-Epi — Critical Appraisal Module
 * Interactive scored checklists: RoB 2.0, NOS, AMSTAR-2, QUADAS-2, GRADE
 */

(function() {
    'use strict';

    const MODULE_ID = 'critical-appraisal';

    var currentTool = 'rob2';
    var responses = {};

    function render(container) {
        var html = App.createModuleLayout(
            'Critical Appraisal',
            'Interactive risk-of-bias and evidence quality assessment tools with algorithmic judgments.'
        );

        html += '<div class="card">';
        html += '<div class="tabs" id="ca-tabs">'
            + '<button class="tab active" data-tab="rob2" onclick="CritAppraisal.switchTool(\'rob2\')">RCT (RoB 2.0)</button>'
            + '<button class="tab" data-tab="nos" onclick="CritAppraisal.switchTool(\'nos\')">Observational (NOS)</button>'
            + '<button class="tab" data-tab="amstar" onclick="CritAppraisal.switchTool(\'amstar\')">Syst Review (AMSTAR-2)</button>'
            + '<button class="tab" data-tab="quadas" onclick="CritAppraisal.switchTool(\'quadas\')">Diagnostic (QUADAS-2)</button>'
            + '<button class="tab" data-tab="grade" onclick="CritAppraisal.switchTool(\'grade\')">GRADE</button>'
            + '</div>';

        // RoB 2.0
        html += '<div class="tab-content active" id="tab-rob2">';
        html += '<div class="card-subtitle">Cochrane Risk of Bias 2.0 — Assess 5 domains with signaling questions</div>';
        html += '<div class="form-group"><label class="form-label">Study Name</label><input type="text" class="form-input" id="ca-study-name" placeholder="e.g., NINDS 1995"></div>';

        References.rob2.domains.forEach(function(domain) {
            html += '<div class="checklist-domain">';
            html += '<div class="checklist-domain-title"><span class="traffic-dot" id="ca-dot-' + domain.id + '"></span>' + domain.id + ': ' + domain.name + '</div>';

            domain.questions.forEach(function(q, qi) {
                var qId = domain.id + '_q' + qi;
                html += '<div class="checklist-question">';
                html += '<div class="checklist-question-text">' + q + '</div>';
                html += '<div class="radio-group">';
                ['Yes', 'Probably Yes', 'Probably No', 'No', 'No Information'].forEach(function(opt) {
                    html += '<label class="radio-pill"><input type="radio" name="ca-' + qId + '" value="' + opt + '" onchange="CritAppraisal.updateRoB()">' + opt + '</label>';
                });
                html += '</div></div>';
            });

            html += '<div class="flex items-center gap-1 mt-1">'
                + '<span style="font-size:0.8rem;color:var(--text-tertiary)">Domain Judgment:</span>'
                + '<span class="risk-badge" id="ca-judgment-' + domain.id + '">Not assessed</span>'
                + '</div>';
            html += '</div>';
        });

        html += '<div class="result-panel mt-2" id="ca-rob2-overall">'
            + '<div class="card-title">Overall Risk of Bias</div>'
            + '<div class="traffic-light" id="ca-rob2-traffic"></div>'
            + '<div class="result-detail mt-1" id="ca-rob2-summary">Complete all domains to see overall judgment</div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-secondary btn-sm" onclick="CritAppraisal.exportRoB()">Export Assessment</button>'
            + '<button class="btn btn-secondary btn-sm" onclick="CritAppraisal.resetRoB()">Reset</button>'
            + '<button class="btn btn-secondary btn-sm" onclick="CritAppraisal.saveRoB()">Save to Browser</button>'
            + '</div>';
        html += '</div>';

        // NOS
        html += '<div class="tab-content" id="tab-nos">';
        html += '<div class="card-subtitle">Newcastle-Ottawa Scale for Observational Studies</div>';
        html += renderNOS();
        html += '</div>';

        // AMSTAR-2
        html += '<div class="tab-content" id="tab-amstar">';
        html += '<div class="card-subtitle">AMSTAR-2 — Systematic Review Quality Assessment</div>';
        html += renderAMSTAR();
        html += '</div>';

        // QUADAS-2
        html += '<div class="tab-content" id="tab-quadas">';
        html += '<div class="card-subtitle">QUADAS-2 — Diagnostic Accuracy Studies</div>';
        html += renderQUADAS();
        html += '</div>';

        // GRADE
        html += '<div class="tab-content" id="tab-grade">';
        html += '<div class="card-subtitle">GRADE Evidence Assessment — Rate certainty of evidence</div>';
        html += renderGRADE();
        html += '</div>';

        html += '</div>';

        App.setTrustedHTML(container, html);
    }

    function renderNOS() {
        var html = '<div class="form-group"><label class="form-label">Study Name</label><input type="text" class="form-input" id="ca-nos-study"></div>';

        var sections = [
            { name: 'Selection', maxStars: 4, items: [
                'Representativeness of the exposed cohort',
                'Selection of the non-exposed cohort',
                'Ascertainment of exposure',
                'Outcome not present at start'
            ]},
            { name: 'Comparability', maxStars: 2, items: [
                'Comparability based on design or analysis (study controls for most important factor)',
                'Study controls for additional factor'
            ]},
            { name: 'Outcome', maxStars: 3, items: [
                'Assessment of outcome',
                'Adequate follow-up duration',
                'Adequacy of follow-up rate'
            ]}
        ];

        sections.forEach(function(sec) {
            html += '<div class="checklist-domain">';
            html += '<div class="checklist-domain-title">' + sec.name + ' (max ' + sec.maxStars + ' stars)</div>';
            sec.items.forEach(function(item, i) {
                var id = 'nos_' + sec.name.toLowerCase() + '_' + i;
                html += '<div class="checklist-question">'
                    + '<div class="checklist-question-text">' + item + '</div>'
                    + '<div class="radio-group">'
                    + '<label class="radio-pill"><input type="radio" name="ca-' + id + '" value="star" onchange="CritAppraisal.updateNOS()">Star</label>'
                    + '<label class="radio-pill"><input type="radio" name="ca-' + id + '" value="no" onchange="CritAppraisal.updateNOS()">No Star</label>'
                    + '</div></div>';
            });
            html += '</div>';
        });

        html += '<div class="result-panel" id="ca-nos-result"><div class="result-value" id="ca-nos-score">0 / 9</div><div class="result-label">NOS Stars</div>'
            + '<div class="result-detail" id="ca-nos-interp">Complete assessment to see rating</div></div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-secondary btn-sm" onclick="CritAppraisal.exportNOS()">Export</button></div>';
        return html;
    }

    function renderAMSTAR() {
        var html = '';
        References.amstar2.items.forEach(function(item) {
            html += '<div class="checklist-question" style="padding:10px 0;border-bottom:1px solid var(--border)">';
            html += '<div class="checklist-question-text">'
                + (item.critical ? '<span class="risk-badge risk-badge--high" style="font-size:0.6rem;margin-right:4px">CRITICAL</span>' : '')
                + item.id + '. ' + item.text + '</div>';
            html += '<div class="radio-group">';
            ['Yes', 'Partial Yes', 'No'].forEach(function(opt) {
                html += '<label class="radio-pill"><input type="radio" name="ca-amstar-' + item.id + '" value="' + opt + '" onchange="CritAppraisal.updateAMSTAR()">' + opt + '</label>';
            });
            html += '</div></div>';
        });

        html += '<div class="result-panel mt-2" id="ca-amstar-result">'
            + '<div class="result-value" id="ca-amstar-rating">Not Assessed</div>'
            + '<div class="result-label">Overall Confidence</div></div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-secondary btn-sm" onclick="CritAppraisal.exportAMSTAR()">Export</button></div>';
        return html;
    }

    function renderQUADAS() {
        var domains = [
            { name: 'Patient Selection', questions: ['Was a consecutive or random sample of patients enrolled?', 'Was a case-control design avoided?', 'Did the study avoid inappropriate exclusions?'] },
            { name: 'Index Test', questions: ['Were the index test results interpreted without knowledge of the reference standard?', 'Was a pre-specified threshold used?'] },
            { name: 'Reference Standard', questions: ['Is the reference standard likely to correctly classify the target condition?', 'Were the reference standard results interpreted without knowledge of the index test?'] },
            { name: 'Flow and Timing', questions: ['Was there an appropriate interval between index test and reference standard?', 'Did all patients receive the same reference standard?', 'Were all patients included in the analysis?'] }
        ];

        var html = '';
        domains.forEach(function(domain, di) {
            html += '<div class="checklist-domain">';
            html += '<div class="checklist-domain-title">' + domain.name + '</div>';
            domain.questions.forEach(function(q, qi) {
                var id = 'quadas_' + di + '_' + qi;
                html += '<div class="checklist-question"><div class="checklist-question-text">' + q + '</div>';
                html += '<div class="radio-group">';
                ['Yes', 'No', 'Unclear'].forEach(function(opt) {
                    html += '<label class="radio-pill"><input type="radio" name="ca-' + id + '" value="' + opt + '" onchange="CritAppraisal.updateQUADAS()">' + opt + '</label>';
                });
                html += '</div></div>';
            });
            html += '<div class="flex items-center gap-1 mt-1"><span style="font-size:0.8rem">Risk of Bias:</span><span class="risk-badge" id="ca-quadas-' + di + '">--</span>'
                + '<span style="font-size:0.8rem;margin-left:12px">Applicability Concern:</span>'
                + '<select class="form-select" id="ca-quadas-app-' + di + '" style="width:120px;height:28px;font-size:0.75rem">'
                + '<option>Low</option><option>High</option><option>Unclear</option></select></div>';
            html += '</div>';
        });

        html += '<div class="btn-group mt-2"><button class="btn btn-secondary btn-sm" onclick="CritAppraisal.exportQUADAS()">Export</button></div>';
        return html;
    }

    function renderGRADE() {
        var html = '<div class="form-group"><label class="form-label">Study Design Base</label>'
            + '<div class="radio-group">'
            + '<label class="radio-pill"><input type="radio" name="ca-grade-base" value="RCT" checked onchange="CritAppraisal.updateGRADE()">RCT (Start: High)</label>'
            + '<label class="radio-pill"><input type="radio" name="ca-grade-base" value="Observational" onchange="CritAppraisal.updateGRADE()">Observational (Start: Low)</label>'
            + '</div></div>';

        html += '<div class="card-title mt-2">Rate Down</div>';
        References.grade.rateDown.forEach(function(domain, i) {
            html += '<div class="checklist-question"><div class="checklist-question-text">' + domain.domain + ': ' + domain.description + '</div>';
            html += '<div class="radio-group">';
            ['No concern', 'Serious (-1)', 'Very serious (-2)'].forEach(function(opt) {
                html += '<label class="radio-pill"><input type="radio" name="ca-grade-down-' + i + '" value="' + opt + '" onchange="CritAppraisal.updateGRADE()">' + opt + '</label>';
            });
            html += '</div></div>';
        });

        html += '<div class="card-title mt-2">Rate Up</div>';
        References.grade.rateUp.forEach(function(domain, i) {
            html += '<div class="checklist-question"><div class="checklist-question-text">' + domain.domain + ': ' + domain.description + '</div>';
            html += '<div class="radio-group">';
            ['No', 'Yes (+1)', 'Strong (+2)'].forEach(function(opt) {
                html += '<label class="radio-pill"><input type="radio" name="ca-grade-up-' + i + '" value="' + opt + '" onchange="CritAppraisal.updateGRADE()">' + opt + '</label>';
            });
            html += '</div></div>';
        });

        html += '<div class="result-panel mt-2" id="ca-grade-result">'
            + '<div class="result-value" id="ca-grade-level">Not Assessed</div>'
            + '<div class="result-label">GRADE Certainty of Evidence</div></div>';

        html += '<div class="btn-group mt-2"><button class="btn btn-secondary btn-sm" onclick="CritAppraisal.exportGRADE()">Export GRADE Profile</button></div>';
        return html;
    }

    function switchTool(tool) {
        currentTool = tool;
        document.querySelectorAll('#ca-tabs .tab').forEach(function(t) { t.classList.toggle('active', t.dataset.tab === tool); });
        document.querySelectorAll('.tab-content').forEach(function(tc) { tc.classList.toggle('active', tc.id === 'tab-' + tool); });
    }

    function updateRoB() {
        var domainJudgments = {};
        References.rob2.domains.forEach(function(domain) {
            var answers = [];
            domain.questions.forEach(function(q, qi) {
                var qId = domain.id + '_q' + qi;
                var selected = document.querySelector('input[name="ca-' + qId + '"]:checked');
                if (selected) answers.push(selected.value);
            });

            var judgment = 'Not assessed';
            var badgeClass = '';
            if (answers.length === domain.questions.length) {
                var hasNo = answers.some(function(a) { return a === 'No' || a === 'Probably No'; });
                var hasNI = answers.some(function(a) { return a === 'No Information'; });

                if (!hasNo && !hasNI) {
                    judgment = 'Low risk';
                    badgeClass = 'risk-badge--low';
                } else if (hasNo) {
                    judgment = 'High risk';
                    badgeClass = 'risk-badge--high';
                } else {
                    judgment = 'Some concerns';
                    badgeClass = 'risk-badge--some';
                }
            }

            domainJudgments[domain.id] = judgment;
            var badge = document.getElementById('ca-judgment-' + domain.id);
            if (badge) {
                badge.textContent = judgment;
                badge.className = 'risk-badge ' + badgeClass;
            }

            // Traffic dot
            var dot = document.getElementById('ca-dot-' + domain.id);
            if (dot) {
                dot.className = 'traffic-dot';
                if (judgment === 'Low risk') dot.className += ' traffic-dot--low';
                else if (judgment === 'High risk') dot.className += ' traffic-dot--high';
                else if (judgment === 'Some concerns') dot.className += ' traffic-dot--some';
                else dot.className += ' traffic-dot--unclear';
            }
        });

        // Overall judgment
        var values = Object.values(domainJudgments);
        var overall = 'Not assessed';
        if (values.every(function(v) { return v !== 'Not assessed'; })) {
            if (values.some(function(v) { return v === 'High risk'; })) {
                overall = 'High risk of bias';
            } else if (values.every(function(v) { return v === 'Low risk'; })) {
                overall = 'Low risk of bias';
            } else {
                overall = 'Some concerns';
            }
        }

        var summary = document.getElementById('ca-rob2-summary');
        if (summary) summary.textContent = overall;

        // Traffic light display
        var traffic = document.getElementById('ca-rob2-traffic');
        if (traffic) {
            var html = '';
            References.rob2.domains.forEach(function(d) {
                var j = domainJudgments[d.id];
                var cls = j === 'Low risk' ? 'traffic-dot--low' : j === 'High risk' ? 'traffic-dot--high' : j === 'Some concerns' ? 'traffic-dot--some' : 'traffic-dot--unclear';
                html += '<span class="traffic-dot ' + cls + '" title="' + d.id + ': ' + j + '"></span>';
            });
            App.setTrustedHTML(traffic, html);
        }
    }

    function updateNOS() {
        var stars = 0;
        document.querySelectorAll('input[name^="ca-nos_"]:checked').forEach(function(el) {
            if (el.value === 'star') stars++;
        });
        var scoreEl = document.getElementById('ca-nos-score');
        if (scoreEl) scoreEl.textContent = stars + ' / 9';
        var interpEl = document.getElementById('ca-nos-interp');
        if (interpEl) {
            if (stars >= 7) interpEl.textContent = 'Good quality study';
            else if (stars >= 5) interpEl.textContent = 'Fair quality study';
            else interpEl.textContent = 'Poor quality study';
        }
    }

    function updateAMSTAR() {
        var criticalWeaknesses = 0;
        var nonCriticalWeaknesses = 0;

        References.amstar2.items.forEach(function(item) {
            var selected = document.querySelector('input[name="ca-amstar-' + item.id + '"]:checked');
            if (selected && selected.value === 'No') {
                if (item.critical) criticalWeaknesses++;
                else nonCriticalWeaknesses++;
            }
        });

        var rating = 'Not Assessed';
        var color = 'var(--text-secondary)';
        if (criticalWeaknesses === 0 && nonCriticalWeaknesses === 0) {
            rating = 'High'; color = 'var(--success)';
        } else if (criticalWeaknesses === 0 && nonCriticalWeaknesses <= 1) {
            rating = 'Moderate'; color = 'var(--success)';
        } else if (criticalWeaknesses === 1) {
            rating = 'Low'; color = 'var(--warning)';
        } else if (criticalWeaknesses > 1) {
            rating = 'Critically Low'; color = 'var(--danger)';
        }

        var el = document.getElementById('ca-amstar-rating');
        if (el) { el.textContent = rating; el.style.color = color; }
    }

    function updateQUADAS() {
        // Simple assessment per domain
        for (var di = 0; di < 4; di++) {
            var hasNo = false;
            var hasUnclear = false;
            var allAnswered = true;
            var nQ = di === 0 ? 3 : di === 1 ? 2 : di === 2 ? 2 : 3;

            for (var qi = 0; qi < nQ; qi++) {
                var sel = document.querySelector('input[name="ca-quadas_' + di + '_' + qi + '"]:checked');
                if (!sel) { allAnswered = false; continue; }
                if (sel.value === 'No') hasNo = true;
                if (sel.value === 'Unclear') hasUnclear = true;
            }

            var badge = document.getElementById('ca-quadas-' + di);
            if (badge && allAnswered) {
                if (hasNo) { badge.textContent = 'High'; badge.className = 'risk-badge risk-badge--high'; }
                else if (hasUnclear) { badge.textContent = 'Unclear'; badge.className = 'risk-badge risk-badge--some'; }
                else { badge.textContent = 'Low'; badge.className = 'risk-badge risk-badge--low'; }
            }
        }
    }

    function updateGRADE() {
        var base = document.querySelector('input[name="ca-grade-base"]:checked');
        if (!base) return;

        var level = base.value === 'RCT' ? 4 : 2; // High=4, Moderate=3, Low=2, Very Low=1

        for (var i = 0; i < 5; i++) {
            var sel = document.querySelector('input[name="ca-grade-down-' + i + '"]:checked');
            if (sel) {
                if (sel.value.indexOf('-1') > -1) level -= 1;
                if (sel.value.indexOf('-2') > -1) level -= 2;
            }
        }

        for (var j = 0; j < 3; j++) {
            var selUp = document.querySelector('input[name="ca-grade-up-' + j + '"]:checked');
            if (selUp) {
                if (selUp.value.indexOf('+1') > -1) level += 1;
                if (selUp.value.indexOf('+2') > -1) level += 2;
            }
        }

        level = Math.max(1, Math.min(4, level));
        var labels = ['', 'Very Low', 'Low', 'Moderate', 'High'];
        var colors = ['', 'var(--danger)', 'var(--warning)', 'var(--info)', 'var(--success)'];

        var el = document.getElementById('ca-grade-level');
        if (el) {
            el.textContent = labels[level];
            el.style.color = colors[level];
        }
    }

    function exportRoB() {
        var study = document.getElementById('ca-study-name').value || 'Unknown Study';
        var text = 'Risk of Bias 2.0 Assessment: ' + study + '\n\n';
        References.rob2.domains.forEach(function(domain) {
            var badge = document.getElementById('ca-judgment-' + domain.id);
            text += domain.id + ' - ' + domain.name + ': ' + (badge ? badge.textContent : 'Not assessed') + '\n';
        });
        var summary = document.getElementById('ca-rob2-summary');
        text += '\nOverall: ' + (summary ? summary.textContent : 'Not assessed');
        Export.copyText(text);
    }

    function exportNOS() {
        var study = document.getElementById('ca-nos-study').value || 'Unknown Study';
        var score = document.getElementById('ca-nos-score');
        Export.copyText('Newcastle-Ottawa Scale: ' + study + ' — ' + (score ? score.textContent : ''));
    }

    function exportAMSTAR() {
        var rating = document.getElementById('ca-amstar-rating');
        Export.copyText('AMSTAR-2 Rating: ' + (rating ? rating.textContent : 'Not assessed'));
    }

    function exportQUADAS() {
        Export.copyText('QUADAS-2 assessment exported');
    }

    function exportGRADE() {
        var level = document.getElementById('ca-grade-level');
        Export.copyText('GRADE Certainty: ' + (level ? level.textContent : 'Not assessed'));
    }

    function resetRoB() {
        document.querySelectorAll('input[name^="ca-D"]:checked').forEach(function(el) { el.checked = false; });
        updateRoB();
    }

    function saveRoB() {
        var data = {};
        document.querySelectorAll('input[name^="ca-"]:checked').forEach(function(el) {
            data[el.name] = el.value;
        });
        data.studyName = document.getElementById('ca-study-name').value;
        Export.saveCalculation(data.studyName || 'RoB Assessment', MODULE_ID, data);
    }

    App.registerModule(MODULE_ID, { render: render });

    window.CritAppraisal = {
        switchTool: switchTool,
        updateRoB: updateRoB,
        updateNOS: updateNOS,
        updateAMSTAR: updateAMSTAR,
        updateQUADAS: updateQUADAS,
        updateGRADE: updateGRADE,
        exportRoB: exportRoB,
        exportNOS: exportNOS,
        exportAMSTAR: exportAMSTAR,
        exportQUADAS: exportQUADAS,
        exportGRADE: exportGRADE,
        resetRoB: resetRoB,
        saveRoB: saveRoB
    };
})();
