/**
 * Neuro-Epi — Causal Inference Module
 * Interactive tools for causal reasoning in epidemiological research.
 * Bradford Hill criteria, DAG builder, counterfactual framework, methods comparison,
 * propensity score guide, instrumental variables, Mendelian randomization,
 * difference-in-differences, target trial emulation.
 */
(function() {
    'use strict';

    const MODULE_ID = 'causal-inference';

    // ================================================================
    // STATE
    // ================================================================
    var dagVariables = [];
    var dagEdges = [];
    var dagExposure = '';
    var dagOutcome = '';
    var dagNodeTypes = {};

    // ================================================================
    // RENDER
    // ================================================================
    function render(container) {
        var html = App.createModuleLayout(
            'Causal Inference',
            'Interactive tools for causal reasoning in epidemiological research. Assess Bradford Hill criteria, build DAGs, explore the counterfactual framework, and compare causal inference methods.'
        );

        // ===== LEARN SECTION =====
        html += '<div class="card" style="background: var(--bg-secondary); border-left: 4px solid var(--accent-color);">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\')">&#x1F4DA; Learn &amp; Reference <span style="font-size:0.8em; color: var(--text-muted);">(click to expand)</span></div>';
        html += '<div class="learn-body hidden">';

        html += '<div class="card-subtitle" style="font-weight:600;">Key Frameworks</div>';
        html += '<ul style="margin:0 0 12px 16px; font-size:0.9rem; line-height:1.7;">'
            + '<li><strong>Bradford Hill criteria (1965):</strong> Nine viewpoints for assessing causation (strength, consistency, specificity, temporality, biological gradient, plausibility, coherence, experiment, analogy). These support arguments for association, not definitive proof of causation.</li>'
            + '<li><strong>Counterfactual / potential outcomes (Rubin):</strong> Defines causal effects as the contrast between what happened and what would have happened under an alternative treatment. Individual causal effects are unobservable; we estimate average effects.</li>'
            + '<li><strong>Directed Acyclic Graphs (Pearl, Greenland):</strong> Graphical tools to encode causal assumptions, identify confounders, mediators, and colliders, and determine the correct adjustment set for estimating causal effects.</li>'
            + '<li><strong>Structural Causal Models (Pearl):</strong> Formal mathematical framework that uses structural equations and DAGs together to define causal quantities (interventional and counterfactual) and derive identification results.</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Core Concepts</div>';
        html += '<ul style="margin:0 0 12px 16px; font-size:0.9rem; line-height:1.7;">'
            + '<li><strong>Confounding:</strong> A common cause of both the exposure and the outcome that distorts the observed association. Must be controlled in design or analysis.</li>'
            + '<li><strong>Collider bias:</strong> Conditioning on (adjusting for) a common effect of two variables creates a spurious association between them. Do NOT adjust for colliders.</li>'
            + '<li><strong>Effect modification &ne; confounding:</strong> Effect modification (interaction) is a biological finding to be reported (stratum-specific estimates differ). Confounding is a nuisance to be removed (crude vs. adjusted estimates differ).</li>'
            + '<li><strong>Mediation:</strong> A variable on the causal pathway between exposure and outcome. Adjusting for mediators blocks the indirect effect.</li>'
            + '<li><strong>Selection bias:</strong> Occurs when the selection of subjects into the study (or the analysis) depends on both the exposure and the outcome, often equivalent to conditioning on a collider.</li>'
            + '<li><strong>Immortal time bias:</strong> A period of follow-up during which the outcome cannot occur. Misclassifying this time inflates the apparent benefit of treatment. Addressed by target trial emulation.</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Methods Overview</div>';
        html += '<ul style="margin:0 0 12px 16px; font-size:0.9rem; line-height:1.7;">'
            + '<li><strong>Design phase:</strong> Randomization, restriction, matching</li>'
            + '<li><strong>Analysis phase:</strong> Stratification, multivariable regression, IP weighting, standardization</li>'
            + '<li><strong>Quasi-experimental:</strong> Instrumental variables, difference-in-differences, regression discontinuity, interrupted time series</li>'
            + '<li><strong>Advanced:</strong> Marginal structural models, g-estimation, target trial emulation, Mendelian randomization</li>'
            + '<li><strong>Propensity-based:</strong> Propensity score matching, stratification, IPTW, doubly robust estimation</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Causal Identification Strategies</div>';
        html += '<ul style="margin:0 0 12px 16px; font-size:0.9rem; line-height:1.7;">'
            + '<li><strong>Backdoor criterion (Pearl):</strong> A set Z satisfies the backdoor criterion if (i) no node in Z is a descendant of treatment, and (ii) Z blocks every path between treatment and outcome that contains an arrow into treatment.</li>'
            + '<li><strong>Frontdoor criterion:</strong> When confounders are unmeasured but a mediator M fully mediates the effect of X on Y, and M is not directly confounded with Y given X.</li>'
            + '<li><strong>Instrumental variable identification:</strong> Exploits an exogenous source of variation that affects treatment but has no direct effect on the outcome.</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Target Trial Emulation Framework</div>';
        html += '<ul style="margin:0 0 12px 16px; font-size:0.9rem; line-height:1.7;">'
            + '<li><strong>Step 1:</strong> Specify the protocol of the target trial (eligibility, treatment strategies, assignment, follow-up start, outcomes, causal contrast, analysis plan).</li>'
            + '<li><strong>Step 2:</strong> Emulate each component using observational data.</li>'
            + '<li><strong>Step 3:</strong> Explicitly state which components can and cannot be emulated.</li>'
            + '<li><strong>Key benefit:</strong> Prevents immortal time bias, prevalent user bias, and other common pitfalls by forcing explicit alignment of observational analysis with trial logic.</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">References</div>';
        html += '<ul style="margin:0 0 0 16px; font-size:0.85rem; line-height:1.7;">'
            + '<li>Hern&aacute;n MA, Robins JM. <em>Causal Inference: What If</em>. Chapman &amp; Hall/CRC, 2020.</li>'
            + '<li>Pearl J. <em>Causality: Models, Reasoning, and Inference</em>, 2nd ed. Cambridge University Press, 2009.</li>'
            + '<li>VanderWeele TJ. <em>Explanation in Causal Inference: Methods for Mediation and Interaction</em>. Oxford University Press, 2015.</li>'
            + '<li>Hern&aacute;n MA, Robins JM. Using Big Data to Emulate a Target Trial When a Randomized Trial Is Not Available. Am J Epidemiol. 2016;183(8):758-764.</li>'
            + '<li>Davey Smith G, Hemani G. Mendelian randomization: genetic anchors for causal inference in epidemiological studies. Hum Mol Genet. 2014;23(R1):R89-R98.</li>'
            + '<li>Rosenbaum PR, Rubin DB. The central role of the propensity score in observational studies for causal effects. Biometrika. 1983;70(1):41-55.</li>'
            + '</ul>';

        html += '</div></div>';

        // ===== CARD 1: Bradford Hill Criteria =====
        html += renderBradfordHill();

        // ===== CARD 2: DAG Builder =====
        html += renderDAGBuilder();

        // ===== CARD 3: Counterfactual Framework =====
        html += renderCounterfactual();

        // ===== CARD 4: Causal Methods Comparison =====
        html += renderMethodsComparison();

        // ===== CARD 5: Propensity Score Guide =====
        html += renderPropensityScoreGuide();

        // ===== CARD 6: Instrumental Variables & MR =====
        html += renderIVandMR();

        // ===== CARD 7: Difference-in-Differences =====
        html += renderDiD();

        // ===== CARD 8: Target Trial Emulation =====
        html += renderTargetTrial();

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);
    }

    // ================================================================
    // CARD 1: Bradford Hill Criteria Assessment
    // ================================================================
    function renderBradfordHill() {
        var criteria = [
            {
                id: 'strength',
                name: 'Strength of Association',
                desc: 'A large effect size increases confidence in a causal relationship.',
                input: 'Effect size (e.g., OR, RR, HR)'
            },
            {
                id: 'consistency',
                name: 'Consistency',
                desc: 'The association has been observed repeatedly in different populations, settings, and times.',
                input: 'Number of studies showing the association'
            },
            {
                id: 'specificity',
                name: 'Specificity',
                desc: 'The exposure is specifically associated with the outcome (not multiple unrelated outcomes).',
                input: 'Notes on specificity of association'
            },
            {
                id: 'temporality',
                name: 'Temporality',
                desc: 'The exposure precedes the outcome in time. This is the only criterion considered essential.',
                input: 'Evidence for temporal sequence'
            },
            {
                id: 'gradient',
                name: 'Biological Gradient (Dose-Response)',
                desc: 'Greater exposure leads to a greater effect (or a defined threshold pattern).',
                input: 'Evidence for dose-response relationship'
            },
            {
                id: 'plausibility',
                name: 'Plausibility',
                desc: 'A biologically plausible mechanism exists linking exposure to outcome.',
                input: 'Proposed biological mechanism'
            },
            {
                id: 'coherence',
                name: 'Coherence',
                desc: 'The association is consistent with existing knowledge of the disease/biology.',
                input: 'Coherence with known biology'
            },
            {
                id: 'experiment',
                name: 'Experiment',
                desc: 'Evidence from interventional studies (RCTs, natural experiments) supports the association.',
                input: 'Experimental/interventional evidence'
            },
            {
                id: 'analogy',
                name: 'Analogy',
                desc: 'Similar exposures cause similar outcomes (e.g., if drug A causes defects, drug B might too).',
                input: 'Analogous relationships'
            }
        ];

        var html = '<div class="card">';
        html += '<div class="card-title">Bradford Hill Criteria Assessment</div>';
        html += '<div class="card-subtitle">Evaluate the 9 Bradford Hill criteria to assess the likelihood of a causal relationship. '
            + 'Rate each criterion and provide supporting notes.</div>';

        html += '<div style="background:var(--bg-tertiary);border-radius:8px;padding:12px;margin-bottom:16px;font-size:0.85rem;color:var(--text-secondary);">'
            + '<strong>Important:</strong> The Bradford Hill criteria (1965) are guidelines for assessing causation, not a rigid checklist. '
            + 'Not all criteria need to be met for a causal inference, and meeting all criteria does not guarantee causation. '
            + 'Temporality is the only criterion widely considered necessary. Modern epidemiology emphasizes the counterfactual framework '
            + 'and DAG-based reasoning alongside these considerations (Rothman & Greenland, 2005).'
            + '</div>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Exposure</label>'
            + '<input type="text" class="form-input" id="bh-exposure" name="bh-exposure" placeholder="e.g., Cigarette smoking"></div>'
            + '<div class="form-group"><label class="form-label">Outcome</label>'
            + '<input type="text" class="form-input" id="bh-outcome" name="bh-outcome" placeholder="e.g., Lung cancer"></div>'
            + '</div>';

        for (var i = 0; i < criteria.length; i++) {
            var c = criteria[i];
            html += '<div style="border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:12px;">';
            html += '<div style="font-weight:600;margin-bottom:4px;">' + (i + 1) + '. ' + c.name + '</div>';
            html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">' + c.desc + '</div>';

            html += '<div class="form-row form-row--2">';
            html += '<div class="form-group"><label class="form-label">Rating</label>';
            html += '<div class="radio-group">';
            var options = ['Strong', 'Moderate', 'Weak', 'Not assessed'];
            for (var j = 0; j < options.length; j++) {
                html += '<label class="radio-pill"><input type="radio" name="bh-' + c.id + '" value="' + options[j] + '">' + options[j] + '</label>';
            }
            html += '</div></div>';

            html += '<div class="form-group"><label class="form-label">' + c.input + '</label>'
                + '<input type="text" class="form-input" id="bh-note-' + c.id + '" name="bh-note-' + c.id + '" placeholder="Supporting evidence or notes"></div>';
            html += '</div>';
            html += '</div>';
        }

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="CausalInference.assessBH()">Assess</button>'
            + '<button class="btn btn-secondary" onclick="CausalInference.exportBH()">Export Assessment</button>'
            + '<button class="btn btn-secondary" onclick="CausalInference.resetBH()">Reset</button>'
            + '</div>';

        html += '<div id="bh-results"></div>';
        html += '</div>';

        return html;
    }

    function assessBH() {
        var exposure = document.getElementById('bh-exposure').value || '[Exposure]';
        var outcome = document.getElementById('bh-outcome').value || '[Outcome]';

        var criteriaNames = ['strength', 'consistency', 'specificity', 'temporality',
            'gradient', 'plausibility', 'coherence', 'experiment', 'analogy'];
        var criteriaLabels = ['Strength', 'Consistency', 'Specificity', 'Temporality',
            'Biological Gradient', 'Plausibility', 'Coherence', 'Experiment', 'Analogy'];

        var strong = 0, moderate = 0, weak = 0, notAssessed = 0;
        var details = [];

        for (var i = 0; i < criteriaNames.length; i++) {
            var radios = document.querySelectorAll('input[name="bh-' + criteriaNames[i] + '"]');
            var selected = '';
            for (var j = 0; j < radios.length; j++) {
                if (radios[j].checked) { selected = radios[j].value; break; }
            }
            var note = document.getElementById('bh-note-' + criteriaNames[i]).value || '';

            if (selected === 'Strong') strong++;
            else if (selected === 'Moderate') moderate++;
            else if (selected === 'Weak') weak++;
            else notAssessed++;

            details.push({
                name: criteriaLabels[i],
                rating: selected || 'Not assessed',
                note: note
            });
        }

        var assessed = 9 - notAssessed;
        var met = strong + moderate;

        var overallText = '';
        if (assessed === 0) {
            overallText = 'No criteria have been assessed yet.';
        } else if (strong >= 6) {
            overallText = 'Strong support for a causal relationship between ' + exposure + ' and ' + outcome + '. '
                + 'Multiple Bradford Hill criteria are rated as strong.';
        } else if (met >= 5) {
            overallText = 'Moderate-to-strong support for a causal relationship between ' + exposure + ' and ' + outcome + '. '
                + 'A majority of assessed criteria are met at strong or moderate levels.';
        } else if (met >= 3) {
            overallText = 'Moderate support for a causal relationship between ' + exposure + ' and ' + outcome + '. '
                + 'Some criteria are met, but gaps remain.';
        } else {
            overallText = 'Limited support for a causal relationship between ' + exposure + ' and ' + outcome + '. '
                + 'Few Bradford Hill criteria are met at a strong or moderate level.';
        }

        // Check temporality specifically
        var tempRadios = document.querySelectorAll('input[name="bh-temporality"]');
        var tempRating = '';
        for (var k = 0; k < tempRadios.length; k++) {
            if (tempRadios[k].checked) { tempRating = tempRadios[k].value; break; }
        }
        if (tempRating === 'Weak' || tempRating === 'Not assessed') {
            overallText += ' Note: Temporality is weak or unassessed. Temporality is widely considered the most essential criterion.';
        }

        var html = '<div class="result-panel mt-2">';
        html += '<div class="card-title">Assessment Summary: ' + exposure + ' and ' + outcome + '</div>';
        html += '<div class="form-row form-row--4">';
        html += '<div class="result-value" style="color:var(--success);">' + strong + '<div class="result-label">Strong</div></div>';
        html += '<div class="result-value" style="color:var(--warning);">' + moderate + '<div class="result-label">Moderate</div></div>';
        html += '<div class="result-value" style="color:var(--danger);">' + weak + '<div class="result-label">Weak</div></div>';
        html += '<div class="result-value" style="color:var(--text-tertiary);">' + notAssessed + '<div class="result-label">Not Assessed</div></div>';
        html += '</div>';
        html += '<div class="result-detail mt-1">' + overallText + '</div>';

        // Detail table
        html += '<div class="table-container mt-2">';
        html += '<table class="data-table"><thead><tr><th>Criterion</th><th>Rating</th><th>Notes</th></tr></thead><tbody>';
        for (var d = 0; d < details.length; d++) {
            var color = details[d].rating === 'Strong' ? 'var(--success)' :
                details[d].rating === 'Moderate' ? 'var(--warning)' :
                details[d].rating === 'Weak' ? 'var(--danger)' : 'var(--text-tertiary)';
            html += '<tr><td>' + details[d].name + '</td>'
                + '<td style="color:' + color + ';font-weight:600;">' + details[d].rating + '</td>'
                + '<td>' + (details[d].note || '-') + '</td></tr>';
        }
        html += '</tbody></table></div>';

        html += '<div style="margin-top:12px;font-size:0.8rem;color:var(--text-tertiary);">'
            + 'Reference: Hill AB. The Environment and Disease: Association or Causation? Proc R Soc Med. 1965;58:295-300. '
            + 'See also: Rothman KJ, Greenland S. Causation and causal inference in epidemiology. Am J Public Health. 2005;95(S1):S144-S150.'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('bh-results'), html);
    }

    function exportBH() {
        var exposure = document.getElementById('bh-exposure').value || '[Exposure]';
        var outcome = document.getElementById('bh-outcome').value || '[Outcome]';
        var criteriaNames = ['strength', 'consistency', 'specificity', 'temporality',
            'gradient', 'plausibility', 'coherence', 'experiment', 'analogy'];
        var criteriaLabels = ['Strength', 'Consistency', 'Specificity', 'Temporality',
            'Biological Gradient', 'Plausibility', 'Coherence', 'Experiment', 'Analogy'];

        var lines = ['Bradford Hill Criteria Assessment', '===', 'Exposure: ' + exposure, 'Outcome: ' + outcome, ''];
        for (var i = 0; i < criteriaNames.length; i++) {
            var radios = document.querySelectorAll('input[name="bh-' + criteriaNames[i] + '"]');
            var selected = 'Not assessed';
            for (var j = 0; j < radios.length; j++) {
                if (radios[j].checked) { selected = radios[j].value; break; }
            }
            var note = document.getElementById('bh-note-' + criteriaNames[i]).value || '';
            lines.push((i + 1) + '. ' + criteriaLabels[i] + ': ' + selected + (note ? ' (' + note + ')' : ''));
        }
        Export.copyText(lines.join('\n'));
    }

    function resetBH() {
        var criteriaNames = ['strength', 'consistency', 'specificity', 'temporality',
            'gradient', 'plausibility', 'coherence', 'experiment', 'analogy'];
        for (var i = 0; i < criteriaNames.length; i++) {
            var radios = document.querySelectorAll('input[name="bh-' + criteriaNames[i] + '"]');
            for (var j = 0; j < radios.length; j++) { radios[j].checked = false; }
            document.getElementById('bh-note-' + criteriaNames[i]).value = '';
        }
        document.getElementById('bh-exposure').value = '';
        document.getElementById('bh-outcome').value = '';
        App.setTrustedHTML(document.getElementById('bh-results'), '');
    }

    // ================================================================
    // CARD 2: DAG Builder (Text-Based) with Node Types
    // ================================================================
    function renderDAGBuilder() {
        var html = '<div class="card">';
        html += '<div class="card-title">DAG Builder (Text-Based)</div>';
        html += '<div class="card-subtitle">Build a directed acyclic graph to identify confounders, mediators, and colliders. '
            + 'Define variables with types, specify directed edges, and get adjustment set recommendations.</div>';

        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Variables (one per line)</label>'
            + '<textarea class="form-textarea" id="dag-variables" name="dag-variables" rows="6" '
            + 'placeholder="Smoking\nBlood Pressure\nStroke\nAge\nPhysical Activity"></textarea></div>';
        html += '<div class="form-group">'
            + '<label class="form-label">Exposure Variable</label>'
            + '<select class="form-select" id="dag-exposure" name="dag-exposure"><option value="">-- Parse variables first --</option></select>'
            + '<label class="form-label mt-1">Outcome Variable</label>'
            + '<select class="form-select" id="dag-outcome" name="dag-outcome"><option value="">-- Parse variables first --</option></select>'
            + '<div class="btn-group mt-1"><button class="btn btn-secondary" onclick="CausalInference.parseVariables()">Parse Variables</button></div>'
            + '</div>';
        html += '</div>';

        // Node type assignment
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:12px;">';
        html += '<div style="font-weight:600;margin-bottom:8px;">Assign Node Types (optional)</div>';
        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Variable</label>'
            + '<select class="form-select" id="dag-nodetype-var"><option value="">-- Select --</option></select></div>';
        html += '<div class="form-group"><label class="form-label">Node Type</label>'
            + '<select class="form-select" id="dag-nodetype-type">'
            + '<option value="measured">Measured</option>'
            + '<option value="unmeasured">Unmeasured / Latent</option>'
            + '<option value="time-varying">Time-varying</option>'
            + '<option value="selection">Selection node</option>'
            + '<option value="instrument">Instrument</option>'
            + '</select></div>';
        html += '</div>';
        html += '<div class="btn-group"><button class="btn btn-xs btn-secondary" onclick="CausalInference.assignNodeType()">Assign Type</button></div>';
        html += '<div id="dag-nodetypes-list" style="margin-top:8px;"></div>';
        html += '</div>';

        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:12px;">';
        html += '<div style="font-weight:600;margin-bottom:8px;">Add Edges (Causal Paths)</div>';
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">From</label>'
            + '<select class="form-select" id="dag-edge-from"><option value="">-- Select --</option></select></div>';
        html += '<div class="form-group" style="display:flex;align-items:center;justify-content:center;padding-top:20px;">'
            + '<span style="font-size:1.5rem;font-weight:bold;">&#8594;</span></div>';
        html += '<div class="form-group"><label class="form-label">To</label>'
            + '<select class="form-select" id="dag-edge-to"><option value="">-- Select --</option></select></div>';
        html += '</div>';
        html += '<div class="btn-group"><button class="btn btn-primary btn-xs" onclick="CausalInference.addEdge()">Add Edge</button></div>';
        html += '</div>';

        html += '<div id="dag-edges-list" style="margin-bottom:12px;"></div>';

        // Common DAG templates
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:12px;">';
        html += '<div style="font-weight:600;margin-bottom:8px;">Quick Templates</div>';
        html += '<div class="btn-group">';
        html += '<button class="btn btn-xs btn-secondary" onclick="CausalInference.loadDAGTemplate(\'confounding\')">Confounding</button>';
        html += '<button class="btn btn-xs btn-secondary" onclick="CausalInference.loadDAGTemplate(\'mediation\')">Mediation</button>';
        html += '<button class="btn btn-xs btn-secondary" onclick="CausalInference.loadDAGTemplate(\'collider\')">Collider</button>';
        html += '<button class="btn btn-xs btn-secondary" onclick="CausalInference.loadDAGTemplate(\'iv\')">Instrumental Variable</button>';
        html += '<button class="btn btn-xs btn-secondary" onclick="CausalInference.loadDAGTemplate(\'mdag\')">M-bias</button>';
        html += '</div></div>';

        html += '<div class="btn-group">'
            + '<button class="btn btn-primary" onclick="CausalInference.analyzeDAG()">Analyze DAG</button>'
            + '<button class="btn btn-secondary" onclick="CausalInference.clearDAG()">Clear All</button>'
            + '<button class="btn btn-secondary" onclick="CausalInference.exportDAG()">Export</button>'
            + '</div>';

        html += '<div id="dag-results"></div>';
        html += '</div>';

        return html;
    }

    function parseVariables() {
        var text = document.getElementById('dag-variables').value.trim();
        if (!text) return;

        dagVariables = text.split('\n').map(function(v) { return v.trim(); }).filter(function(v) { return v.length > 0; });

        var selectors = ['dag-exposure', 'dag-outcome', 'dag-edge-from', 'dag-edge-to', 'dag-nodetype-var'];
        for (var s = 0; s < selectors.length; s++) {
            var sel = document.getElementById(selectors[s]);
            var currentVal = sel.value;
            var optionsHtml = '<option value="">-- Select --</option>';
            for (var i = 0; i < dagVariables.length; i++) {
                optionsHtml += '<option value="' + dagVariables[i] + '">' + dagVariables[i] + '</option>';
            }
            App.setTrustedHTML(sel, optionsHtml);
            if (currentVal && dagVariables.indexOf(currentVal) !== -1) {
                sel.value = currentVal;
            }
        }
    }

    function assignNodeType() {
        var varName = document.getElementById('dag-nodetype-var').value;
        var nodeType = document.getElementById('dag-nodetype-type').value;
        if (!varName) return;
        dagNodeTypes[varName] = nodeType;
        renderNodeTypesList();
    }

    function renderNodeTypesList() {
        var el = document.getElementById('dag-nodetypes-list');
        if (!el) return;
        var keys = Object.keys(dagNodeTypes);
        if (keys.length === 0) {
            App.setTrustedHTML(el, '');
            return;
        }
        var html = '';
        var typeColors = {
            'measured': 'var(--success)',
            'unmeasured': 'var(--danger)',
            'time-varying': 'var(--warning)',
            'selection': 'var(--primary)',
            'instrument': '#9b59b6'
        };
        for (var i = 0; i < keys.length; i++) {
            var c = typeColors[dagNodeTypes[keys[i]]] || 'var(--text-secondary)';
            html += '<span style="display:inline-block;margin:2px 4px;padding:2px 8px;border-radius:12px;font-size:0.8rem;'
                + 'border:1px solid ' + c + ';color:' + c + ';">'
                + keys[i] + ' (' + dagNodeTypes[keys[i]] + ')</span>';
        }
        App.setTrustedHTML(el, html);
    }

    function loadDAGTemplate(template) {
        var vars = '';
        dagEdges = [];
        dagNodeTypes = {};

        if (template === 'confounding') {
            vars = 'Exposure\nOutcome\nConfounder';
            dagEdges = [
                { from: 'Confounder', to: 'Exposure' },
                { from: 'Confounder', to: 'Outcome' },
                { from: 'Exposure', to: 'Outcome' }
            ];
        } else if (template === 'mediation') {
            vars = 'Exposure\nMediator\nOutcome';
            dagEdges = [
                { from: 'Exposure', to: 'Mediator' },
                { from: 'Mediator', to: 'Outcome' },
                { from: 'Exposure', to: 'Outcome' }
            ];
        } else if (template === 'collider') {
            vars = 'Exposure\nOutcome\nCollider';
            dagEdges = [
                { from: 'Exposure', to: 'Collider' },
                { from: 'Outcome', to: 'Collider' },
                { from: 'Exposure', to: 'Outcome' }
            ];
        } else if (template === 'iv') {
            vars = 'Instrument\nExposure\nOutcome\nUnmeasured Confounder';
            dagEdges = [
                { from: 'Instrument', to: 'Exposure' },
                { from: 'Exposure', to: 'Outcome' },
                { from: 'Unmeasured Confounder', to: 'Exposure' },
                { from: 'Unmeasured Confounder', to: 'Outcome' }
            ];
            dagNodeTypes['Unmeasured Confounder'] = 'unmeasured';
            dagNodeTypes['Instrument'] = 'instrument';
        } else if (template === 'mdag') {
            vars = 'Exposure\nOutcome\nU1\nU2\nM';
            dagEdges = [
                { from: 'U1', to: 'Exposure' },
                { from: 'U1', to: 'M' },
                { from: 'U2', to: 'Outcome' },
                { from: 'U2', to: 'M' },
                { from: 'Exposure', to: 'Outcome' }
            ];
            dagNodeTypes['U1'] = 'unmeasured';
            dagNodeTypes['U2'] = 'unmeasured';
        }

        document.getElementById('dag-variables').value = vars;
        parseVariables();

        // Set exposure/outcome
        if (dagVariables.indexOf('Exposure') !== -1) {
            document.getElementById('dag-exposure').value = 'Exposure';
        }
        if (dagVariables.indexOf('Outcome') !== -1) {
            document.getElementById('dag-outcome').value = 'Outcome';
        }

        renderEdgesList();
        renderNodeTypesList();
    }

    function addEdge() {
        var from = document.getElementById('dag-edge-from').value;
        var to = document.getElementById('dag-edge-to').value;
        if (!from || !to) return;
        if (from === to) return;

        // Check duplicate
        for (var i = 0; i < dagEdges.length; i++) {
            if (dagEdges[i].from === from && dagEdges[i].to === to) return;
        }

        dagEdges.push({ from: from, to: to });
        renderEdgesList();
    }

    function removeEdge(index) {
        dagEdges.splice(index, 1);
        renderEdgesList();
    }

    function renderEdgesList() {
        var el = document.getElementById('dag-edges-list');
        if (!el) return;

        if (dagEdges.length === 0) {
            App.setTrustedHTML(el, '<div style="color:var(--text-tertiary);font-size:0.85rem;">No edges defined yet.</div>');
            return;
        }

        var html = '<div style="font-weight:600;margin-bottom:8px;">Defined Edges:</div>';
        for (var i = 0; i < dagEdges.length; i++) {
            html += '<div style="display:inline-flex;align-items:center;gap:8px;margin:4px 8px 4px 0;padding:4px 10px;'
                + 'background:var(--bg-tertiary);border-radius:6px;font-size:0.85rem;">'
                + dagEdges[i].from + ' &#8594; ' + dagEdges[i].to
                + ' <button class="btn btn-xs" onclick="CausalInference.removeEdge(' + i + ')" '
                + 'style="padding:2px 6px;font-size:0.75rem;">&#10005;</button></div>';
        }
        App.setTrustedHTML(el, html);
    }

    function clearDAG() {
        dagVariables = [];
        dagEdges = [];
        dagExposure = '';
        dagOutcome = '';
        dagNodeTypes = {};
        document.getElementById('dag-variables').value = '';
        var selectors = ['dag-exposure', 'dag-outcome', 'dag-edge-from', 'dag-edge-to', 'dag-nodetype-var'];
        for (var s = 0; s < selectors.length; s++) {
            App.setTrustedHTML(document.getElementById(selectors[s]), '<option value="">-- Select --</option>');
        }
        App.setTrustedHTML(document.getElementById('dag-edges-list'), '');
        App.setTrustedHTML(document.getElementById('dag-results'), '');
        App.setTrustedHTML(document.getElementById('dag-nodetypes-list'), '');
    }

    function analyzeDAG() {
        dagExposure = document.getElementById('dag-exposure').value;
        dagOutcome = document.getElementById('dag-outcome').value;

        if (!dagExposure || !dagOutcome) {
            App.setTrustedHTML(document.getElementById('dag-results'),
                '<div class="result-panel mt-2" style="color:var(--danger);">Please select both an exposure and an outcome variable.</div>');
            return;
        }
        if (dagEdges.length === 0) {
            App.setTrustedHTML(document.getElementById('dag-results'),
                '<div class="result-panel mt-2" style="color:var(--danger);">Please add at least one edge to the DAG.</div>');
            return;
        }

        // Build adjacency structures
        var children = {};
        var parents = {};
        for (var i = 0; i < dagVariables.length; i++) {
            children[dagVariables[i]] = [];
            parents[dagVariables[i]] = [];
        }
        for (var e = 0; e < dagEdges.length; e++) {
            if (children[dagEdges[e].from]) children[dagEdges[e].from].push(dagEdges[e].to);
            if (parents[dagEdges[e].to]) parents[dagEdges[e].to].push(dagEdges[e].from);
        }

        // Identify node roles
        var confounders = [];
        var mediators = [];
        var colliders = [];
        var instruments = [];

        for (var v = 0; v < dagVariables.length; v++) {
            var node = dagVariables[v];
            if (node === dagExposure || node === dagOutcome) continue;

            var parentList = parents[node] || [];

            // Collider: has 2+ parents (on a path between exposure-relevant and outcome-relevant nodes)
            if (parentList.length >= 2) {
                colliders.push(node);
            }

            // Confounder: is a common cause of exposure and outcome (or ancestor of both)
            var causesExposure = isAncestor(node, dagExposure, children);
            var causesOutcome = isAncestor(node, dagOutcome, children);
            if (causesExposure && causesOutcome) {
                confounders.push(node);
            }

            // Mediator: on causal path from exposure to outcome
            var exposureCausesNode = isAncestor(dagExposure, node, children);
            var nodeCausesOutcome = isAncestor(node, dagOutcome, children);
            if (exposureCausesNode && nodeCausesOutcome) {
                mediators.push(node);
            }

            // Instrumental variable candidate: causes exposure, no direct path to outcome except through exposure
            if (causesExposure && !causesOutcome && !isAncestor(node, dagOutcome, children)) {
                instruments.push(node);
            }
        }

        // Remove overlap: if a node is both a confounder and collider, classify based on primary role
        var adjustFor = confounders.filter(function(c) { return colliders.indexOf(c) === -1; });
        var doNotAdjust = colliders.concat(mediators);
        // Remove duplicates
        var doNotAdjustUnique = [];
        for (var u = 0; u < doNotAdjust.length; u++) {
            if (doNotAdjustUnique.indexOf(doNotAdjust[u]) === -1) doNotAdjustUnique.push(doNotAdjust[u]);
        }

        // Check for unmeasured confounders
        var unmeasuredConfounders = [];
        for (var uc = 0; uc < confounders.length; uc++) {
            if (dagNodeTypes[confounders[uc]] === 'unmeasured') {
                unmeasuredConfounders.push(confounders[uc]);
            }
        }

        // Text-based DAG visualization
        var dagText = generateDAGText();

        // Build results
        var html = '<div class="result-panel mt-2">';
        html += '<div class="card-title">DAG Analysis: ' + dagExposure + ' &#8594; ' + dagOutcome + '</div>';

        // ASCII DAG
        html += '<div style="background:var(--bg-primary);border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;'
            + 'font-family:monospace;font-size:0.85rem;white-space:pre-wrap;line-height:1.6;">' + dagText + '</div>';

        // Variable roles
        html += '<div class="table-container">';
        html += '<table class="data-table"><thead><tr><th>Variable</th><th>Role</th><th>Node Type</th><th>Action</th></tr></thead><tbody>';

        html += '<tr><td><strong>' + dagExposure + '</strong></td><td>Exposure</td><td>' + (dagNodeTypes[dagExposure] || 'measured') + '</td><td>-</td></tr>';
        html += '<tr><td><strong>' + dagOutcome + '</strong></td><td>Outcome</td><td>' + (dagNodeTypes[dagOutcome] || 'measured') + '</td><td>-</td></tr>';

        for (var ci = 0; ci < confounders.length; ci++) {
            var isUnmeas = dagNodeTypes[confounders[ci]] === 'unmeasured';
            html += '<tr style="background:rgba(255,193,7,0.1);"><td>' + confounders[ci] + '</td><td>Confounder' + (isUnmeas ? ' (unmeasured)' : '') + '</td>'
                + '<td>' + (dagNodeTypes[confounders[ci]] || 'measured') + '</td>'
                + '<td style="color:' + (isUnmeas ? 'var(--danger)' : 'var(--warning)') + ';font-weight:600;">'
                + (isUnmeas ? 'Cannot adjust (unmeasured)' : 'Adjust') + '</td></tr>';
        }
        for (var mi = 0; mi < mediators.length; mi++) {
            html += '<tr style="background:rgba(220,53,69,0.1);"><td>' + mediators[mi] + '</td><td>Mediator</td>'
                + '<td>' + (dagNodeTypes[mediators[mi]] || 'measured') + '</td>'
                + '<td style="color:var(--danger);font-weight:600;">Do NOT adjust (for total effect)</td></tr>';
        }
        for (var co = 0; co < colliders.length; co++) {
            html += '<tr style="background:rgba(220,53,69,0.1);"><td>' + colliders[co] + '</td><td>Collider</td>'
                + '<td>' + (dagNodeTypes[colliders[co]] || 'measured') + '</td>'
                + '<td style="color:var(--danger);font-weight:600;">Do NOT adjust</td></tr>';
        }
        if (instruments.length > 0) {
            for (var iv = 0; iv < instruments.length; iv++) {
                html += '<tr style="background:rgba(13,110,253,0.1);"><td>' + instruments[iv] + '</td><td>Potential Instrument</td>'
                    + '<td>' + (dagNodeTypes[instruments[iv]] || 'measured') + '</td>'
                    + '<td style="color:var(--primary);">Consider for IV analysis</td></tr>';
            }
        }
        html += '</tbody></table></div>';

        // Recommendation
        html += '<div style="background:var(--bg-tertiary);border-radius:8px;padding:16px;margin-top:16px;">';
        html += '<div style="font-weight:700;margin-bottom:8px;">Recommendation</div>';
        html += '<div>To estimate the <strong>total causal effect</strong> of <strong>' + dagExposure + '</strong> on <strong>' + dagOutcome + '</strong>:</div>';

        if (adjustFor.length > 0) {
            var measuredAdj = adjustFor.filter(function(a) { return dagNodeTypes[a] !== 'unmeasured'; });
            html += '<div style="margin-top:8px;"><strong style="color:var(--success);">Adjust for:</strong> ' + (measuredAdj.length > 0 ? measuredAdj.join(', ') : 'No measured confounders identified.') + '</div>';
        } else {
            html += '<div style="margin-top:8px;"><strong style="color:var(--success);">Adjust for:</strong> No confounders identified in this DAG.</div>';
        }
        if (doNotAdjustUnique.length > 0) {
            html += '<div style="margin-top:4px;"><strong style="color:var(--danger);">Do NOT adjust for:</strong> ' + doNotAdjustUnique.join(', ')
                + ' (adjusting for colliders opens biasing paths; adjusting for mediators blocks the causal path)</div>';
        }

        // Warn about unmeasured confounding
        if (unmeasuredConfounders.length > 0) {
            html += '<div style="margin-top:12px;padding:10px;background:rgba(220,53,69,0.1);border-radius:6px;border-left:3px solid var(--danger);">'
                + '<strong style="color:var(--danger);">Warning:</strong> Unmeasured confounders detected: ' + unmeasuredConfounders.join(', ')
                + '. The causal effect is not identifiable by standard adjustment. Consider instrumental variables, '
                + 'sensitivity analysis for unmeasured confounding (e.g., E-value), or other approaches.</div>';
        }

        html += '</div>';

        html += '<div style="margin-top:12px;font-size:0.8rem;color:var(--text-tertiary);">'
            + 'References: Greenland S, Pearl J, Robins JM. Causal diagrams for epidemiologic research. Epidemiology. 1999;10(1):37-48. '
            + 'Hernan MA, Robins JM. Causal Inference: What If. Chapman & Hall/CRC, 2020.'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('dag-results'), html);
    }

    function isAncestor(from, to, childrenMap) {
        // BFS: can we reach 'to' from 'from' by following children?
        var visited = {};
        var queue = [from];
        visited[from] = true;
        while (queue.length > 0) {
            var current = queue.shift();
            var kids = childrenMap[current] || [];
            for (var i = 0; i < kids.length; i++) {
                if (kids[i] === to) return true;
                if (!visited[kids[i]]) {
                    visited[kids[i]] = true;
                    queue.push(kids[i]);
                }
            }
        }
        return false;
    }

    function generateDAGText() {
        var lines = [];
        lines.push('Directed Acyclic Graph');
        lines.push('======================');
        lines.push('');
        lines.push('Variables: ' + dagVariables.join(', '));
        lines.push('Exposure:  ' + dagExposure);
        lines.push('Outcome:   ' + dagOutcome);
        lines.push('');
        lines.push('Edges:');
        for (var i = 0; i < dagEdges.length; i++) {
            lines.push('  ' + dagEdges[i].from + ' --> ' + dagEdges[i].to);
        }
        lines.push('');

        // Show node types if any
        var typeKeys = Object.keys(dagNodeTypes);
        if (typeKeys.length > 0) {
            lines.push('Node Types:');
            for (var t = 0; t < typeKeys.length; t++) {
                lines.push('  ' + typeKeys[t] + ': ' + dagNodeTypes[typeKeys[t]]);
            }
            lines.push('');
        }

        // Show adjacency as a simple list
        lines.push('Adjacency:');
        for (var v = 0; v < dagVariables.length; v++) {
            var node = dagVariables[v];
            var targets = [];
            for (var e = 0; e < dagEdges.length; e++) {
                if (dagEdges[e].from === node) targets.push(dagEdges[e].to);
            }
            if (targets.length > 0) {
                lines.push('  ' + node + ' --> { ' + targets.join(', ') + ' }');
            } else {
                lines.push('  ' + node + ' --> { }');
            }
        }
        return lines.join('\n');
    }

    function exportDAG() {
        var text = generateDAGText();
        Export.copyText(text);
    }

    // ================================================================
    // CARD 3: Counterfactual Framework Reference
    // ================================================================
    function renderCounterfactual() {
        var html = '<div class="card">';
        html += '<div class="card-title">Counterfactual Framework Reference</div>';
        html += '<div class="card-subtitle">Educational reference for the potential outcomes framework and key assumptions for causal inference.</div>';

        // Potential Outcomes
        html += '<div style="border-left:4px solid var(--primary);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:700;font-size:1.05rem;margin-bottom:8px;">Potential Outcomes Framework (Rubin Causal Model)</div>';
        html += '<div style="font-size:0.9rem;line-height:1.7;">'
            + '<p>For each individual <em>i</em>, we define two <strong>potential outcomes</strong>:</p>'
            + '<ul style="margin:8px 0 8px 20px;">'
            + '<li><strong>Y<sub>i</sub>(1)</strong> &mdash; The outcome if individual <em>i</em> receives treatment (exposed)</li>'
            + '<li><strong>Y<sub>i</sub>(0)</strong> &mdash; The outcome if individual <em>i</em> does not receive treatment (unexposed)</li>'
            + '</ul>'
            + '<p>The <strong>individual causal effect</strong> is: Y<sub>i</sub>(1) &minus; Y<sub>i</sub>(0)</p>'
            + '<p style="margin-top:8px;">This framework was formalized by Donald Rubin (1974) building on Neyman (1923). '
            + 'It provides a precise mathematical definition of a causal effect independent of statistical models.</p>'
            + '</div></div>';

        // Fundamental Problem
        html += '<div style="border-left:4px solid var(--danger);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:700;font-size:1.05rem;margin-bottom:8px;">Fundamental Problem of Causal Inference</div>';
        html += '<div style="font-size:0.9rem;line-height:1.7;">'
            + '<p>We can <strong>never observe both</strong> potential outcomes for the same individual at the same time. '
            + 'Each person is either exposed or unexposed &mdash; we observe one potential outcome and the other is <strong>counterfactual</strong> (contrary to fact).</p>'
            + '<p style="margin-top:8px;">This is why causal inference requires assumptions to bridge from what we observe to what we want to estimate. '
            + 'Individual causal effects are generally not identifiable; we focus instead on <strong>average causal effects</strong>.</p>'
            + '</div></div>';

        // ATE, ATT, ATU
        html += '<div style="border-left:4px solid var(--success);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:700;font-size:1.05rem;margin-bottom:8px;">Average Treatment Effects</div>';
        html += '<div style="font-size:0.9rem;line-height:1.7;">';
        html += '<div class="table-container"><table class="data-table">';
        html += '<thead><tr><th>Measure</th><th>Definition</th><th>Formula</th><th>Interpretation</th></tr></thead>';
        html += '<tbody>';
        html += '<tr><td><strong>ATE</strong><br>Average Treatment Effect</td>'
            + '<td>Average causal effect across the entire population</td>'
            + '<td>E[Y(1) &minus; Y(0)]</td>'
            + '<td>Expected difference in outcome if everyone was treated vs. no one treated</td></tr>';
        html += '<tr><td><strong>ATT</strong><br>Average Treatment Effect on the Treated</td>'
            + '<td>Average effect among those who actually received treatment</td>'
            + '<td>E[Y(1) &minus; Y(0) | A=1]</td>'
            + '<td>Effect of treatment among those selected for treatment</td></tr>';
        html += '<tr><td><strong>ATU</strong><br>Average Treatment Effect on the Untreated</td>'
            + '<td>Average effect among those who did not receive treatment</td>'
            + '<td>E[Y(1) &minus; Y(0) | A=0]</td>'
            + '<td>What would have happened to the untreated if they had been treated</td></tr>';
        html += '</tbody></table></div>';
        html += '</div></div>';

        // SUTVA
        html += '<div style="border-left:4px solid var(--warning);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:700;font-size:1.05rem;margin-bottom:8px;">SUTVA (Stable Unit Treatment Value Assumption)</div>';
        html += '<div style="font-size:0.9rem;line-height:1.7;">'
            + '<p>SUTVA comprises two components:</p>'
            + '<ol style="margin:8px 0 8px 20px;">'
            + '<li><strong>No interference:</strong> The potential outcome of one individual is not affected by the treatment assignment of others. '
            + '(Violated in infectious disease research, cluster-level interventions, social networks.)</li>'
            + '<li><strong>No hidden variations of treatment:</strong> There is only one version of each treatment level. '
            + '(Violated when treatment is delivered inconsistently or varies in dose/intensity.)</li>'
            + '</ol>'
            + '<p style="margin-top:8px;"><em>Example of violation:</em> In vaccine trials, if unvaccinated individuals benefit from herd immunity, '
            + 'SUTVA is violated because their outcome depends on others\' treatment status.</p>'
            + '</div></div>';

        // Identifiability Conditions
        html += '<div style="border-left:4px solid var(--primary);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:700;font-size:1.05rem;margin-bottom:8px;">Identifiability Conditions</div>';
        html += '<div style="font-size:0.9rem;line-height:1.7;">';
        html += '<p>Three assumptions are required to identify causal effects from observational data:</p>';

        html += '<div style="margin:12px 0;padding:12px;background:var(--bg-secondary);border-radius:8px;">'
            + '<div style="font-weight:600;">1. Exchangeability (No Unmeasured Confounding)</div>'
            + '<div style="margin-top:4px;">Y(a) &#10980; A | L for all a</div>'
            + '<div style="margin-top:4px;">Conditional on measured covariates L, the treatment groups are comparable &mdash; '
            + 'as if treatment was randomly assigned within strata of L. This is untestable from observed data.</div>'
            + '</div>';

        html += '<div style="margin:12px 0;padding:12px;background:var(--bg-secondary);border-radius:8px;">'
            + '<div style="font-weight:600;">2. Positivity (Experimental Treatment Assignment)</div>'
            + '<div style="margin-top:4px;">P(A = a | L = l) > 0 for all a and all l with P(L = l) > 0</div>'
            + '<div style="margin-top:4px;">Within every stratum of covariates, there is a non-zero probability of receiving each treatment level. '
            + 'Violated when certain subgroups always (or never) receive treatment (structural or random non-positivity).</div>'
            + '</div>';

        html += '<div style="margin:12px 0;padding:12px;background:var(--bg-secondary);border-radius:8px;">'
            + '<div style="font-weight:600;">3. Consistency</div>'
            + '<div style="margin-top:4px;">If A<sub>i</sub> = a, then Y<sub>i</sub> = Y<sub>i</sub>(a)</div>'
            + '<div style="margin-top:4px;">The observed outcome under the treatment actually received equals the potential outcome under that treatment. '
            + 'This links the potential outcomes to observable data and requires a well-defined intervention (no ambiguity in what "treatment" means).</div>'
            + '</div>';

        html += '</div></div>';

        html += '<div style="font-size:0.8rem;color:var(--text-tertiary);margin-top:8px;">'
            + 'References: Rubin DB. Estimating causal effects of treatments in randomized and nonrandomized studies. J Educ Psychol. 1974;66(5):688-701. '
            + 'Hernan MA, Robins JM. Causal Inference: What If. Chapman & Hall/CRC, 2020. '
            + 'Greenland S, Robins JM. Identifiability, exchangeability, and epidemiological confounding. Int J Epidemiol. 1986;15(3):413-419.'
            + '</div>';

        html += '</div>';
        return html;
    }

    // ================================================================
    // CARD 4: Causal Inference Methods Comparison
    // ================================================================
    function renderMethodsComparison() {
        var methods = [
            {
                name: 'Propensity Score Matching',
                assumptions: 'No unmeasured confounders (conditional exchangeability); positivity; correct propensity score model specification.',
                strengths: 'Intuitive; reduces confounding to a single score; balances measured covariates; allows visual assessment of balance.',
                limitations: 'Cannot handle unmeasured confounding; may discard unmatched subjects (reducing power/generalizability); model-dependent.',
                when: 'Observational studies with many measured confounders; when RCT-like balance is desired.',
                reference: 'Rosenbaum & Rubin, 1983; Austin, 2011'
            },
            {
                name: 'Inverse Probability Weighting (IPW)',
                assumptions: 'No unmeasured confounding; positivity; correct model for treatment assignment (propensity score).',
                strengths: 'Uses entire sample (no discarding); estimates ATE or ATT; handles time-varying treatments; can create pseudo-populations.',
                limitations: 'Extreme weights cause instability; sensitive to propensity score model misspecification; large variance with near-violations of positivity.',
                when: 'Time-varying exposures; marginal structural models; when matching discards too many subjects.',
                reference: 'Robins, Hernan & Brumback, 2000'
            },
            {
                name: 'Instrumental Variables (IV)',
                assumptions: 'Relevance (instrument predicts exposure); independence (instrument not associated with confounders); exclusion restriction (instrument affects outcome only through exposure).',
                strengths: 'Handles unmeasured confounding; identifies causal effects when confounders are unknown or unmeasurable.',
                limitations: 'Estimates LATE (local average treatment effect), not ATE; weak instruments cause bias; exclusion restriction untestable; often imprecise.',
                when: 'Strong instruments available (e.g., randomization with non-compliance, geographic variation, policy changes).',
                reference: 'Angrist, Imbens & Rubin, 1996'
            },
            {
                name: 'Regression Discontinuity (RD)',
                assumptions: 'Continuous assignment variable with sharp/fuzzy cutoff; no manipulation of assignment near threshold; continuity of potential outcomes at threshold.',
                strengths: 'Strong internal validity near the cutoff (quasi-experimental); transparent and testable; graphically intuitive.',
                limitations: 'Local effect only (at the cutoff); requires large samples near threshold; limited external validity.',
                when: 'Treatment assigned based on a threshold (e.g., biomarker cutoff, eligibility score, policy threshold).',
                reference: 'Thistlethwaite & Campbell, 1960; Lee & Lemieux, 2010'
            },
            {
                name: 'Difference-in-Differences (DiD)',
                assumptions: 'Parallel trends assumption (treatment and control groups would have followed parallel trajectories absent treatment); no anticipation; stable composition.',
                strengths: 'Controls for time-invariant unmeasured confounders; intuitive; widely used in policy evaluation.',
                limitations: 'Parallel trends assumption is strong and often untestable; sensitive to differential trends; requires pre-intervention data.',
                when: 'Policy/program evaluation with pre/post data and control groups; natural experiments.',
                reference: 'Angrist & Pischke, 2009; Wing et al., 2018'
            },
            {
                name: 'Interrupted Time Series (ITS)',
                assumptions: 'No concurrent co-interventions; pre-intervention trend would have continued absent intervention; sufficient pre/post data points.',
                strengths: 'Handles secular trends; does not require a control group (though strengthened with one); visually clear.',
                limitations: 'Confounded by co-occurring events; needs many time points; autocorrelation must be modeled.',
                when: 'Population-level interventions with clear start dates (e.g., policy changes, clinical guideline implementation).',
                reference: 'Wagner et al., 2002; Bernal et al., 2017'
            },
            {
                name: 'Mendelian Randomization (MR)',
                assumptions: 'Relevance (genetic variant associated with exposure); independence (variant not associated with confounders); exclusion restriction (no pleiotropy for effect on outcome).',
                strengths: 'Uses genetic variants as instruments; less susceptible to classical confounding and reverse causation; can leverage large GWAS data.',
                limitations: 'Pleiotropy may bias results; weak instrument bias; canalization; population stratification; estimates lifetime average effect.',
                when: 'Testing causal relationships where confounding is likely; leveraging GWAS summary statistics.',
                reference: 'Davey Smith & Ebrahim, 2003; Lawlor et al., 2008'
            },
            {
                name: 'Target Trial Emulation',
                assumptions: 'All assumptions of the target trial can be emulated from observational data; no unmeasured confounding; well-defined interventions.',
                strengths: 'Makes assumptions explicit; avoids common pitfalls (immortal time bias, selection bias); aligns observational analysis with trial logic.',
                limitations: 'Requires detailed data; may not resolve unmeasured confounding; complexity in time-varying settings.',
                when: 'Any observational study of treatment effects; particularly when the goal is to emulate a pragmatic trial.',
                reference: 'Hernan & Robins, 2016; Hernan, 2018'
            }
        ];

        var html = '<div class="card">';
        html += '<div class="card-title">Causal Inference Methods Comparison</div>';
        html += '<div class="card-subtitle">Comparison of major methods for estimating causal effects from observational data.</div>';

        html += '<div class="table-container">';
        html += '<table class="data-table">';
        html += '<thead><tr>'
            + '<th style="min-width:140px;">Method</th>'
            + '<th style="min-width:180px;">Key Assumptions</th>'
            + '<th style="min-width:160px;">Strengths</th>'
            + '<th style="min-width:160px;">Limitations</th>'
            + '<th style="min-width:140px;">When to Use</th>'
            + '<th style="min-width:120px;">Key Reference</th>'
            + '</tr></thead><tbody>';

        for (var i = 0; i < methods.length; i++) {
            var m = methods[i];
            html += '<tr>'
                + '<td><strong>' + m.name + '</strong></td>'
                + '<td style="font-size:0.8rem;">' + m.assumptions + '</td>'
                + '<td style="font-size:0.8rem;">' + m.strengths + '</td>'
                + '<td style="font-size:0.8rem;">' + m.limitations + '</td>'
                + '<td style="font-size:0.8rem;">' + m.when + '</td>'
                + '<td style="font-size:0.8rem;">' + m.reference + '</td>'
                + '</tr>';
        }

        html += '</tbody></table></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-secondary" onclick="CausalInference.exportMethods()">Copy Table</button>'
            + '</div>';

        html += '</div>';
        return html;
    }

    function exportMethods() {
        var lines = [
            'Causal Inference Methods Comparison',
            '====================================',
            '',
            'Propensity Score Matching - Rosenbaum & Rubin, 1983',
            'Inverse Probability Weighting - Robins, Hernan & Brumback, 2000',
            'Instrumental Variables - Angrist, Imbens & Rubin, 1996',
            'Regression Discontinuity - Lee & Lemieux, 2010',
            'Difference-in-Differences - Angrist & Pischke, 2009',
            'Interrupted Time Series - Bernal et al., 2017',
            'Mendelian Randomization - Davey Smith & Ebrahim, 2003',
            'Target Trial Emulation - Hernan & Robins, 2016'
        ];
        Export.copyText(lines.join('\n'));
    }

    // ================================================================
    // CARD 5: Propensity Score Calculator Guide
    // ================================================================
    function renderPropensityScoreGuide() {
        var html = '<div class="card">';
        html += '<div class="card-title">Propensity Score Analysis Guide</div>';
        html += '<div class="card-subtitle">Step-by-step guide to conducting propensity score analysis for causal inference in observational studies.</div>';

        // Step-by-step guide
        var steps = [
            {
                num: 1,
                title: 'Define the Research Question',
                detail: 'Clearly specify the exposure (treatment), outcome, and the causal contrast of interest (ATE vs ATT). '
                    + 'Consider: What is the target trial you are trying to emulate? What intervention is being compared to what?'
            },
            {
                num: 2,
                title: 'Select Covariates for the Propensity Score Model',
                detail: 'Include all variables that are (a) related to both treatment and outcome (confounders), or (b) related to the outcome only (prognostic factors, which improve precision). '
                    + 'Do NOT include: (a) instruments (related only to treatment), (b) variables on the causal pathway (mediators), (c) colliders. '
                    + 'Use a DAG to guide covariate selection.'
            },
            {
                num: 3,
                title: 'Estimate the Propensity Score',
                detail: 'Fit a logistic regression (or machine learning model: GBM, random forest, LASSO) predicting treatment assignment from selected covariates. '
                    + 'The propensity score PS(X) = P(A=1 | X) is the predicted probability of receiving treatment given covariates X.'
            },
            {
                num: 4,
                title: 'Choose a Propensity Score Method',
                detail: '<strong>Matching:</strong> Match treated to untreated subjects with similar PS (nearest neighbor, caliper, optimal). Estimates ATT. '
                    + '<strong>Stratification:</strong> Divide into PS quintiles and estimate within-stratum effects. '
                    + '<strong>IPTW:</strong> Weight each observation by 1/PS (treated) or 1/(1-PS) (untreated). Estimates ATE. '
                    + '<strong>Covariate adjustment:</strong> Include PS as a covariate in outcome regression. '
                    + '<strong>Doubly robust:</strong> Combine PS weighting with outcome regression for protection against misspecification of either model.'
            },
            {
                num: 5,
                title: 'Assess Covariate Balance',
                detail: 'After PS adjustment, check that covariates are balanced between groups. Use standardized mean differences (SMD). '
                    + 'Threshold: SMD < 0.1 (or < 0.25 for less strict balance). Also compare variance ratios (target: 0.5 to 2.0). '
                    + 'If balance is poor: refit the PS model, add interactions/polynomials, or try a different matching algorithm.'
            },
            {
                num: 6,
                title: 'Estimate the Treatment Effect',
                detail: 'Apply the outcome model to the matched/weighted/stratified sample. Report the point estimate, 95% CI, and p-value. '
                    + 'For IPTW: use robust (sandwich) standard errors or bootstrap. For matching: account for the matched design (paired analysis or cluster-robust SE).'
            },
            {
                num: 7,
                title: 'Sensitivity Analysis',
                detail: 'Assess robustness to unmeasured confounding. Report the <strong>E-value</strong> (VanderWeele & Ding, 2017): the minimum strength of association '
                    + 'an unmeasured confounder would need to have with both treatment and outcome to explain away the observed effect. '
                    + 'Also consider: Rosenbaum bounds, negative control outcomes, quantitative bias analysis.'
            }
        ];

        for (var i = 0; i < steps.length; i++) {
            var s = steps[i];
            html += '<div style="border-left:4px solid var(--primary);padding:12px 16px;margin-bottom:12px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
            html += '<div style="font-weight:700;font-size:0.95rem;margin-bottom:6px;">Step ' + s.num + ': ' + s.title + '</div>';
            html += '<div style="font-size:0.88rem;line-height:1.7;">' + s.detail + '</div>';
            html += '</div>';
        }

        // PS method comparison table
        html += '<div class="card-subtitle mt-2">Propensity Score Methods Comparison</div>';
        html += '<div class="table-container">';
        html += '<table class="data-table"><thead><tr><th>Method</th><th>Estimand</th><th>Pros</th><th>Cons</th></tr></thead><tbody>';
        html += '<tr><td><strong>Matching</strong></td><td>ATT (usually)</td><td>Intuitive; mimics RCT; good balance checking</td>'
            + '<td>Discards unmatched; order-dependent; sensitive to caliper</td></tr>';
        html += '<tr><td><strong>IPTW</strong></td><td>ATE or ATT</td><td>Uses full sample; flexible; handles time-varying</td>'
            + '<td>Extreme weights; variance inflation</td></tr>';
        html += '<tr><td><strong>Stratification</strong></td><td>ATE</td><td>Simple; reduces ~90% of confounding with 5 strata</td>'
            + '<td>Residual confounding within strata; less precise</td></tr>';
        html += '<tr><td><strong>Covariate adjustment</strong></td><td>Conditional effect</td><td>Simple to implement</td>'
            + '<td>Relies on correct outcome model; not marginal effect</td></tr>';
        html += '<tr><td><strong>Doubly robust</strong></td><td>ATE</td><td>Consistent if either PS or outcome model correct</td>'
            + '<td>More complex; still needs at least one model correct</td></tr>';
        html += '</tbody></table></div>';

        html += '<div style="margin-top:12px;font-size:0.8rem;color:var(--text-tertiary);">'
            + 'References: Rosenbaum PR, Rubin DB. Biometrika. 1983;70(1):41-55. Austin PC. Multivariate Behav Res. 2011;46(3):399-424. '
            + 'VanderWeele TJ, Ding P. Sensitivity Analysis in Observational Research. Ann Intern Med. 2017;167(4):268-274.'
            + '</div>';

        html += '</div>';
        return html;
    }

    // ================================================================
    // CARD 6: Instrumental Variables & Mendelian Randomization
    // ================================================================
    function renderIVandMR() {
        var html = '<div class="card">';
        html += '<div class="card-title">Instrumental Variables &amp; Mendelian Randomization</div>';
        html += '<div class="card-subtitle">Guide to using instrumental variables for causal inference when unmeasured confounding is present, '
            + 'including the special case of Mendelian randomization using genetic variants.</div>';

        // IV section
        html += '<div style="border-left:4px solid var(--primary);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:700;font-size:1.05rem;margin-bottom:8px;">Instrumental Variable Assumptions</div>';
        html += '<div style="font-size:0.9rem;line-height:1.7;">';
        html += '<p>An instrumental variable Z for the effect of exposure X on outcome Y must satisfy:</p>';
        html += '<ol style="margin:8px 0 8px 20px;">';
        html += '<li><strong>Relevance:</strong> Z is associated with X (Z &#8594; X). Testable via the first-stage F-statistic. F > 10 suggests adequate instrument strength (Staiger & Stock, 1997).</li>';
        html += '<li><strong>Independence (Exchangeability):</strong> Z is not associated with unmeasured confounders U of the X-Y relationship (Z &#10980; U). Not directly testable but can be supported by design.</li>';
        html += '<li><strong>Exclusion restriction:</strong> Z affects Y only through X (no direct Z &#8594; Y path). Untestable from data; must be argued from subject-matter knowledge.</li>';
        html += '</ol>';
        html += '<p style="margin-top:8px;"><strong>Caution:</strong> IV estimates the Local Average Treatment Effect (LATE) -- the effect among "compliers" '
            + '(those whose treatment status is changed by the instrument). This may differ from the ATE if treatment effects are heterogeneous.</p>';
        html += '</div></div>';

        // Common instruments in epi
        html += '<div style="font-weight:600;margin-bottom:8px;">Common Instruments in Epidemiology</div>';
        html += '<div class="table-container">';
        html += '<table class="data-table"><thead><tr><th>Instrument</th><th>Exposure</th><th>Rationale</th><th>Potential Violations</th></tr></thead><tbody>';
        html += '<tr><td>Physician prescribing preference</td><td>Drug use</td><td>Varies across physicians for non-clinical reasons</td><td>Confounding by indication if not well-defined</td></tr>';
        html += '<tr><td>Distance to specialty center</td><td>Receiving specialized treatment</td><td>Geographic variation in access</td><td>Distance may correlate with SES, urbanicity</td></tr>';
        html += '<tr><td>Calendar time / policy change</td><td>Treatment adoption</td><td>Exogenous change in treatment availability</td><td>Co-occurring temporal trends</td></tr>';
        html += '<tr><td>Randomization with non-compliance</td><td>Actual treatment received</td><td>Intent-to-treat as instrument</td><td>Rarely violated (strongest instrument)</td></tr>';
        html += '<tr><td>Genetic variants (MR)</td><td>Modifiable risk factor</td><td>Randomly allocated at conception</td><td>Pleiotropy, linkage disequilibrium, population stratification</td></tr>';
        html += '</tbody></table></div>';

        // MR section
        html += '<div style="border-left:4px solid var(--success);padding:12px 16px;margin:16px 0;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:700;font-size:1.05rem;margin-bottom:8px;">Mendelian Randomization (MR)</div>';
        html += '<div style="font-size:0.9rem;line-height:1.7;">';
        html += '<p>MR uses genetic variants as instrumental variables. Because genotypes are randomly assigned at meiosis (Mendel\'s second law), '
            + 'they are generally not confounded by environmental/behavioral factors and are not subject to reverse causation.</p>';

        html += '<p style="margin-top:8px;font-weight:600;">Key MR Methods:</p>';
        html += '<ul style="margin:8px 0 8px 20px;">';
        html += '<li><strong>Wald ratio:</strong> Single SNP estimate = beta_ZY / beta_ZX. Simplest MR estimator.</li>';
        html += '<li><strong>Two-stage least squares (2SLS):</strong> Classical IV approach using multiple instruments. First stage: regress X on Z; second stage: regress Y on predicted X.</li>';
        html += '<li><strong>IVW (Inverse-variance weighted):</strong> Meta-analysis of individual Wald ratios across multiple SNPs. Assumes all instruments are valid.</li>';
        html += '<li><strong>MR-Egger:</strong> Tests and corrects for directional pleiotropy (InSIDE assumption). Non-zero intercept suggests pleiotropy.</li>';
        html += '<li><strong>Weighted median:</strong> Consistent if at least 50% of the weight comes from valid instruments. Robust to up to 50% invalid instruments.</li>';
        html += '<li><strong>MR-PRESSO:</strong> Detects and removes outlier SNPs that may be pleiotropic.</li>';
        html += '<li><strong>Multivariable MR:</strong> Estimates direct effects of multiple exposures simultaneously, using genetic variants for each.</li>';
        html += '</ul>';

        html += '<p style="margin-top:8px;font-weight:600;">MR Assumptions and Threats:</p>';
        html += '<ul style="margin:8px 0 8px 20px;">';
        html += '<li><strong>Pleiotropy:</strong> The genetic variant affects the outcome through pathways other than the exposure. Horizontal pleiotropy violates the exclusion restriction.</li>';
        html += '<li><strong>Linkage disequilibrium:</strong> The variant is correlated with another causal variant. Use LD-clumped, independent SNPs.</li>';
        html += '<li><strong>Population stratification:</strong> Allele frequencies correlate with ancestry, which may confound. Control with principal components or use family-based designs.</li>';
        html += '<li><strong>Canalization:</strong> Developmental compensation for lifelong genetic differences may attenuate MR estimates.</li>';
        html += '<li><strong>Weak instruments:</strong> F-statistic < 10 suggests weak instrument bias (toward confounded observational estimate in two-sample MR).</li>';
        html += '</ul>';

        html += '</div></div>';

        html += '<div style="margin-top:12px;font-size:0.8rem;color:var(--text-tertiary);">'
            + 'References: Angrist JD, Imbens GW, Rubin DB. JASA. 1996;91(434):444-455. '
            + 'Davey Smith G, Ebrahim S. Int J Epidemiol. 2003;32(1):1-22. '
            + 'Burgess S, Thompson SG. Mendelian Randomization: Methods for Using Genetic Variants in Causal Estimation. Chapman & Hall/CRC, 2015.'
            + '</div>';

        html += '</div>';
        return html;
    }

    // ================================================================
    // CARD 7: Difference-in-Differences Visual Explainer
    // ================================================================
    function renderDiD() {
        var html = '<div class="card">';
        html += '<div class="card-title">Difference-in-Differences (DiD) Explainer</div>';
        html += '<div class="card-subtitle">Interactive guide to the difference-in-differences design for evaluating the causal effect of interventions.</div>';

        // Visual explanation
        html += '<div style="border-left:4px solid var(--primary);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:700;font-size:1.05rem;margin-bottom:8px;">The DiD Logic</div>';
        html += '<div style="font-size:0.9rem;line-height:1.7;">';
        html += '<p>DiD compares the change in outcomes over time between a group that receives an intervention (treated) and a group that does not (control).</p>';
        html += '<p style="margin-top:8px;font-family:monospace;font-size:0.85rem;">'
            + 'DiD = (Y<sub>treated,post</sub> - Y<sub>treated,pre</sub>) - (Y<sub>control,post</sub> - Y<sub>control,pre</sub>)</p>';
        html += '<p style="margin-top:8px;">The first difference removes time-invariant confounders within each group. '
            + 'The second difference removes common time trends shared by both groups.</p>';
        html += '</div></div>';

        // ASCII visual
        html += '<div style="background:var(--bg-primary);border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;'
            + 'font-family:monospace;font-size:0.82rem;white-space:pre;line-height:1.5;">';
        html += 'Outcome                                              \n';
        html += '  |                                                   \n';
        html += '  |                          * Treated (observed)     \n';
        html += '  |                        /                          \n';
        html += '  |                      /    Causal                  \n';
        html += '  |                    /      Effect                  \n';
        html += '  |                  /        (DiD)                   \n';
        html += '  |                * ........ o Treated (counterfact.)\n';
        html += '  |              / .         /                        \n';
        html += '  |            / .         /  * Control (observed)    \n';
        html += '  |          / .         /  /                         \n';
        html += '  |        *           * /    Parallel trends         \n';
        html += '  |      Treated     Control                          \n';
        html += '  |      (pre)       (pre)                            \n';
        html += '  |__________|_________|____________________________  \n';
        html += '          Pre      Intervention     Post    Time      \n';
        html += '</div>';

        // DiD calculator
        html += '<div class="card-subtitle">DiD Calculator</div>';
        html += '<div class="form-row form-row--4">';
        html += '<div class="form-group"><label class="form-label">Treated Pre</label>'
            + '<input type="number" class="form-input" id="did-t-pre" step="0.1" value="50"></div>';
        html += '<div class="form-group"><label class="form-label">Treated Post</label>'
            + '<input type="number" class="form-input" id="did-t-post" step="0.1" value="65"></div>';
        html += '<div class="form-group"><label class="form-label">Control Pre</label>'
            + '<input type="number" class="form-input" id="did-c-pre" step="0.1" value="48"></div>';
        html += '<div class="form-group"><label class="form-label">Control Post</label>'
            + '<input type="number" class="form-input" id="did-c-post" step="0.1" value="55"></div>';
        html += '</div>';
        html += '<div class="btn-group"><button class="btn btn-primary" onclick="CausalInference.calcDiD()">Calculate DiD</button></div>';
        html += '<div id="did-results"></div>';

        // Assumptions
        html += '<div style="border-left:4px solid var(--warning);padding:12px 16px;margin:16px 0;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:700;margin-bottom:8px;">Key Assumptions</div>';
        html += '<div style="font-size:0.88rem;line-height:1.7;">';
        html += '<ol style="margin:0 0 0 20px;">';
        html += '<li><strong>Parallel trends:</strong> In the absence of treatment, the treated and control groups would have followed the same trend over time. This is the central, untestable assumption. '
            + 'Pre-intervention trends can provide supporting evidence but do not guarantee post-intervention parallel trends.</li>';
        html += '<li><strong>No anticipation:</strong> The treatment group does not change behavior before the intervention begins.</li>';
        html += '<li><strong>Stable composition:</strong> The composition of the treated and control groups does not change differentially over time.</li>';
        html += '<li><strong>No spillover:</strong> The treatment of the treated group does not affect the control group (SUTVA).</li>';
        html += '</ol>';
        html += '</div></div>';

        // Extensions
        html += '<div style="border-left:4px solid var(--success);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:700;margin-bottom:8px;">Modern Extensions</div>';
        html += '<div style="font-size:0.88rem;line-height:1.7;">';
        html += '<ul style="margin:0 0 0 20px;">';
        html += '<li><strong>Staggered DiD:</strong> When different groups receive treatment at different times. Requires care -- TWFE (two-way fixed effects) can give biased estimates. '
            + 'Use methods by Callaway & Sant\'Anna (2021) or Sun & Abraham (2021).</li>';
        html += '<li><strong>Synthetic control:</strong> Constructs a weighted combination of control units to match the treated unit\'s pre-intervention trend. Useful with few treated units.</li>';
        html += '<li><strong>Triple differences (DDD):</strong> Adds a third differencing dimension (e.g., within-group variation) to address potential parallel trends violations.</li>';
        html += '<li><strong>Event study design:</strong> Estimates treatment effects at each time period relative to the intervention, providing a visual test of parallel trends and dynamic effects.</li>';
        html += '</ul>';
        html += '</div></div>';

        html += '<div style="margin-top:12px;font-size:0.8rem;color:var(--text-tertiary);">'
            + 'References: Angrist JD, Pischke J-S. Mostly Harmless Econometrics. Princeton University Press, 2009. '
            + 'Wing C et al. Designing Difference in Difference Studies. Annu Rev Public Health. 2018;39:453-469. '
            + 'Callaway B, Sant\'Anna PHC. J Econometrics. 2021;225(2):200-230.'
            + '</div>';

        html += '</div>';
        return html;
    }

    function calcDiD() {
        var tPre = parseFloat(document.getElementById('did-t-pre').value);
        var tPost = parseFloat(document.getElementById('did-t-post').value);
        var cPre = parseFloat(document.getElementById('did-c-pre').value);
        var cPost = parseFloat(document.getElementById('did-c-post').value);

        if (isNaN(tPre) || isNaN(tPost) || isNaN(cPre) || isNaN(cPost)) return;

        var tChange = tPost - tPre;
        var cChange = cPost - cPre;
        var did = tChange - cChange;
        var counterfactual = tPre + cChange;

        var html = '<div class="result-panel mt-2">';
        html += '<div class="card-title">DiD Estimate</div>';
        html += '<div class="form-row form-row--4">';
        html += '<div class="result-value">' + tChange.toFixed(2) + '<div class="result-label">Treated Change</div></div>';
        html += '<div class="result-value">' + cChange.toFixed(2) + '<div class="result-label">Control Change</div></div>';
        html += '<div class="result-value" style="color:var(--primary);font-weight:700;">' + did.toFixed(2) + '<div class="result-label">DiD Estimate</div></div>';
        html += '<div class="result-value">' + counterfactual.toFixed(2) + '<div class="result-label">Counterfactual (Treated)</div></div>';
        html += '</div>';

        html += '<div class="result-detail mt-1" style="font-size:0.9rem;">';
        html += 'The treated group changed by <strong>' + tChange.toFixed(2) + '</strong> while the control group changed by <strong>' + cChange.toFixed(2) + '</strong>. ';
        html += 'The DiD estimate of the causal effect is <strong>' + did.toFixed(2) + '</strong>. ';
        html += 'The counterfactual outcome for the treated group (absent treatment) is estimated as <strong>' + counterfactual.toFixed(2) + '</strong> vs. observed <strong>' + tPost.toFixed(2) + '</strong>.';
        html += '</div>';
        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs r-script-btn" '
            + 'onclick="RGenerator.showScript(RGenerator.causalInferenceDiD({tPre:' + tPre + ',tPost:' + tPost + ',cPre:' + cPre + ',cPost:' + cPost + '}), &quot;Difference-in-Differences Analysis&quot;)">'
            + '&#129513; Generate R Script</button></div>';
        html += '</div>';

        App.setTrustedHTML(document.getElementById('did-results'), html);
    }

    // ================================================================
    // CARD 8: Target Trial Emulation Framework
    // ================================================================
    function renderTargetTrial() {
        var html = '<div class="card">';
        html += '<div class="card-title">Target Trial Emulation Framework</div>';
        html += '<div class="card-subtitle">Structured framework for designing observational studies that emulate a hypothetical randomized trial, '
            + 'following Hernan &amp; Robins (2016).</div>';

        // Protocol components
        var components = [
            {
                name: 'Eligibility Criteria',
                trial: 'Specify inclusion/exclusion criteria',
                emulation: 'Apply the same criteria to observational data at time zero (baseline). Ensure subjects are eligible at cohort entry.',
                pitfall: 'Including prevalent users who started treatment before time zero leads to prevalent user bias.'
            },
            {
                name: 'Treatment Strategies',
                trial: 'Define treatment arms (e.g., Drug A vs. Drug B)',
                emulation: 'Define the same strategies. Use new-user (incident user) design. Specify grace periods if applicable.',
                pitfall: 'Comparing "ever users" vs "never users" introduces immortal time bias.'
            },
            {
                name: 'Treatment Assignment',
                trial: 'Random assignment at baseline',
                emulation: 'Assign based on treatment received at time zero. Use PS weighting/matching to achieve conditional exchangeability.',
                pitfall: 'Confounding by indication if not properly addressed.'
            },
            {
                name: 'Start of Follow-up (Time Zero)',
                trial: 'Randomization date',
                emulation: 'Must align eligibility, treatment assignment, and start of follow-up at the same time point.',
                pitfall: 'Misalignment creates immortal time bias. This is the single most important design element.'
            },
            {
                name: 'Outcome',
                trial: 'Define primary outcome and timing',
                emulation: 'Same outcome definition. Ensure outcome assessment is comparable.',
                pitfall: 'Different outcome definitions or ascertainment methods between groups.'
            },
            {
                name: 'Causal Contrast',
                trial: 'Intention-to-treat (ITT) or per-protocol',
                emulation: 'ITT: compare groups as assigned at time zero. Per-protocol: use IP-censoring weights to adjust for post-baseline deviations.',
                pitfall: 'Per-protocol analysis without IP-censoring weights introduces selection bias.'
            },
            {
                name: 'Statistical Analysis',
                trial: 'Pre-specified analysis plan',
                emulation: 'Clone-censor-weight approach for per-protocol. Parametric g-formula for complex strategies. IP weighting for time-varying confounding.',
                pitfall: 'Using standard Cox regression for per-protocol analysis without accounting for informative censoring.'
            }
        ];

        html += '<div class="table-container">';
        html += '<table class="data-table"><thead><tr>'
            + '<th>Protocol Component</th><th>Target Trial</th><th>Observational Emulation</th><th>Common Pitfall</th>'
            + '</tr></thead><tbody>';
        for (var i = 0; i < components.length; i++) {
            var c = components[i];
            html += '<tr><td><strong>' + c.name + '</strong></td>'
                + '<td style="font-size:0.82rem;">' + c.trial + '</td>'
                + '<td style="font-size:0.82rem;">' + c.emulation + '</td>'
                + '<td style="font-size:0.82rem;color:var(--danger);">' + c.pitfall + '</td></tr>';
        }
        html += '</tbody></table></div>';

        // Biases prevented
        html += '<div style="border-left:4px solid var(--success);padding:12px 16px;margin:16px 0;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:700;margin-bottom:8px;">Biases Prevented by Target Trial Emulation</div>';
        html += '<div style="font-size:0.88rem;line-height:1.7;">';
        html += '<ul style="margin:0 0 0 20px;">';
        html += '<li><strong>Immortal time bias:</strong> Eliminated by aligning time zero with treatment assignment and eligibility.</li>';
        html += '<li><strong>Prevalent user bias:</strong> Eliminated by using new-user (incident user) design.</li>';
        html += '<li><strong>Selection bias from loss to follow-up:</strong> Addressed by IP-censoring weights in per-protocol analysis.</li>';
        html += '<li><strong>Lead-time bias:</strong> Addressed by aligning the start of follow-up across comparison groups.</li>';
        html += '<li><strong>Depletion of susceptibles:</strong> Mitigated by new-user design and proper time zero alignment.</li>';
        html += '</ul>';
        html += '</div></div>';

        // Interactive template
        html += '<div class="card-subtitle mt-2">Target Trial Protocol Template</div>';
        html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:12px;">'
            + 'Fill in your target trial protocol. This helps structure your observational study design.</div>';

        var fields = [
            { id: 'tte-eligibility', label: 'Eligibility Criteria', placeholder: 'e.g., Adults aged 50+ with new diagnosis of atrial fibrillation, no prior anticoagulation' },
            { id: 'tte-treatment', label: 'Treatment Strategies', placeholder: 'e.g., Strategy A: Initiate DOAC within 30 days. Strategy B: Initiate warfarin within 30 days.' },
            { id: 'tte-assignment', label: 'Treatment Assignment', placeholder: 'e.g., Assign at the date of first prescription (new-user design)' },
            { id: 'tte-followup', label: 'Start of Follow-up', placeholder: 'e.g., Date of first anticoagulant prescription (time zero)' },
            { id: 'tte-outcome', label: 'Outcome', placeholder: 'e.g., First ischemic stroke or systemic embolism within 2 years' },
            { id: 'tte-contrast', label: 'Causal Contrast', placeholder: 'e.g., Per-protocol effect with 60-day grace period' },
            { id: 'tte-analysis', label: 'Analysis Plan', placeholder: 'e.g., Pooled logistic regression with IP weights for confounding and censoring' }
        ];

        for (var f = 0; f < fields.length; f++) {
            html += '<div class="form-group"><label class="form-label">' + fields[f].label + '</label>'
                + '<input type="text" class="form-input" id="' + fields[f].id + '" name="' + fields[f].id + '" placeholder="' + fields[f].placeholder + '"></div>';
        }

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="CausalInference.exportTargetTrial()">Export Protocol</button>'
            + '</div>';

        html += '<div style="margin-top:16px;font-size:0.8rem;color:var(--text-tertiary);">'
            + 'References: Hernan MA, Robins JM. Using Big Data to Emulate a Target Trial When a Randomized Trial Is Not Available. '
            + 'Am J Epidemiol. 2016;183(8):758-764. Hernan MA. The C-Word: Scientific Euphemisms Do Not Improve Causal Inference. '
            + 'Am J Public Health. 2018;108(5):616-619.'
            + '</div>';

        html += '</div>';
        return html;
    }

    function exportTargetTrial() {
        var fields = ['tte-eligibility', 'tte-treatment', 'tte-assignment', 'tte-followup', 'tte-outcome', 'tte-contrast', 'tte-analysis'];
        var labels = ['Eligibility Criteria', 'Treatment Strategies', 'Treatment Assignment', 'Start of Follow-up', 'Outcome', 'Causal Contrast', 'Analysis Plan'];
        var lines = ['Target Trial Emulation Protocol', '================================', ''];
        for (var i = 0; i < fields.length; i++) {
            var val = document.getElementById(fields[i]).value || '[Not specified]';
            lines.push(labels[i] + ': ' + val);
        }
        lines.push('');
        lines.push('Generated: ' + new Date().toLocaleDateString());
        Export.copyText(lines.join('\n'));
    }

    // ================================================================
    // REGISTER
    // ================================================================
    App.registerModule(MODULE_ID, { render: render });

    window.CausalInference = {
        assessBH: assessBH,
        exportBH: exportBH,
        resetBH: resetBH,
        parseVariables: parseVariables,
        assignNodeType: assignNodeType,
        addEdge: addEdge,
        removeEdge: removeEdge,
        analyzeDAG: analyzeDAG,
        clearDAG: clearDAG,
        exportDAG: exportDAG,
        exportMethods: exportMethods,
        loadDAGTemplate: loadDAGTemplate,
        calcDiD: calcDiD,
        exportTargetTrial: exportTargetTrial
    };
})();
