/**
 * Neuro-Epi — Causal Inference Module
 * Interactive tools for causal reasoning in epidemiological research.
 * Bradford Hill criteria, DAG builder, counterfactual framework, methods comparison.
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
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Core Concepts</div>';
        html += '<ul style="margin:0 0 12px 16px; font-size:0.9rem; line-height:1.7;">'
            + '<li><strong>Confounding:</strong> A common cause of both the exposure and the outcome that distorts the observed association. Must be controlled in design or analysis.</li>'
            + '<li><strong>Collider bias:</strong> Conditioning on (adjusting for) a common effect of two variables creates a spurious association between them. Do NOT adjust for colliders.</li>'
            + '<li><strong>Effect modification &ne; confounding:</strong> Effect modification (interaction) is a biological finding to be reported (stratum-specific estimates differ). Confounding is a nuisance to be removed (crude vs. adjusted estimates differ).</li>'
            + '<li><strong>Mediation:</strong> A variable on the causal pathway between exposure and outcome. Adjusting for mediators blocks the indirect effect.</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Methods Overview</div>';
        html += '<ul style="margin:0 0 12px 16px; font-size:0.9rem; line-height:1.7;">'
            + '<li><strong>Design phase:</strong> Randomization, restriction, matching</li>'
            + '<li><strong>Analysis phase:</strong> Stratification, multivariable regression, IP weighting, standardization</li>'
            + '<li><strong>Quasi-experimental:</strong> Instrumental variables, difference-in-differences, regression discontinuity, interrupted time series</li>'
            + '<li><strong>Advanced:</strong> Marginal structural models, g-estimation, target trial emulation, Mendelian randomization</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">References</div>';
        html += '<ul style="margin:0 0 0 16px; font-size:0.85rem; line-height:1.7;">'
            + '<li>Hern&aacute;n MA, Robins JM. <em>Causal Inference: What If</em>. Chapman &amp; Hall/CRC, 2020.</li>'
            + '<li>Pearl J. <em>Causality: Models, Reasoning, and Inference</em>, 2nd ed. Cambridge University Press, 2009.</li>'
            + '<li>VanderWeele TJ. <em>Explanation in Causal Inference: Methods for Mediation and Interaction</em>. Oxford University Press, 2015.</li>'
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
    // CARD 2: DAG Builder (Text-Based)
    // ================================================================
    function renderDAGBuilder() {
        var html = '<div class="card">';
        html += '<div class="card-title">DAG Builder (Text-Based)</div>';
        html += '<div class="card-subtitle">Build a directed acyclic graph to identify confounders, mediators, and colliders. '
            + 'Define variables, specify directed edges, and get adjustment set recommendations.</div>';

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

        var selectors = ['dag-exposure', 'dag-outcome', 'dag-edge-from', 'dag-edge-to'];
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
        document.getElementById('dag-variables').value = '';
        var selectors = ['dag-exposure', 'dag-outcome', 'dag-edge-from', 'dag-edge-to'];
        for (var s = 0; s < selectors.length; s++) {
            App.setTrustedHTML(document.getElementById(selectors[s]), '<option value="">-- Select --</option>');
        }
        App.setTrustedHTML(document.getElementById('dag-edges-list'), '');
        App.setTrustedHTML(document.getElementById('dag-results'), '');
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
        html += '<table class="data-table"><thead><tr><th>Variable</th><th>Role</th><th>Action</th></tr></thead><tbody>';

        html += '<tr><td><strong>' + dagExposure + '</strong></td><td>Exposure</td><td>-</td></tr>';
        html += '<tr><td><strong>' + dagOutcome + '</strong></td><td>Outcome</td><td>-</td></tr>';

        for (var ci = 0; ci < confounders.length; ci++) {
            html += '<tr style="background:rgba(255,193,7,0.1);"><td>' + confounders[ci] + '</td><td>Confounder</td>'
                + '<td style="color:var(--warning);font-weight:600;">Adjust</td></tr>';
        }
        for (var mi = 0; mi < mediators.length; mi++) {
            html += '<tr style="background:rgba(220,53,69,0.1);"><td>' + mediators[mi] + '</td><td>Mediator</td>'
                + '<td style="color:var(--danger);font-weight:600;">Do NOT adjust (for total effect)</td></tr>';
        }
        for (var co = 0; co < colliders.length; co++) {
            html += '<tr style="background:rgba(220,53,69,0.1);"><td>' + colliders[co] + '</td><td>Collider</td>'
                + '<td style="color:var(--danger);font-weight:600;">Do NOT adjust</td></tr>';
        }
        if (instruments.length > 0) {
            for (var iv = 0; iv < instruments.length; iv++) {
                html += '<tr style="background:rgba(13,110,253,0.1);"><td>' + instruments[iv] + '</td><td>Potential Instrument</td>'
                    + '<td style="color:var(--primary);">Consider for IV analysis</td></tr>';
            }
        }
        html += '</tbody></table></div>';

        // Recommendation
        html += '<div style="background:var(--bg-tertiary);border-radius:8px;padding:16px;margin-top:16px;">';
        html += '<div style="font-weight:700;margin-bottom:8px;">Recommendation</div>';
        html += '<div>To estimate the <strong>total causal effect</strong> of <strong>' + dagExposure + '</strong> on <strong>' + dagOutcome + '</strong>:</div>';

        if (adjustFor.length > 0) {
            html += '<div style="margin-top:8px;"><strong style="color:var(--success);">Adjust for:</strong> ' + adjustFor.join(', ') + '</div>';
        } else {
            html += '<div style="margin-top:8px;"><strong style="color:var(--success);">Adjust for:</strong> No confounders identified in this DAG.</div>';
        }
        if (doNotAdjustUnique.length > 0) {
            html += '<div style="margin-top:4px;"><strong style="color:var(--danger);">Do NOT adjust for:</strong> ' + doNotAdjustUnique.join(', ')
                + ' (adjusting for colliders opens biasing paths; adjusting for mediators blocks the causal path)</div>';
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
    // REGISTER
    // ================================================================
    App.registerModule(MODULE_ID, { render: render });

    window.CausalInference = {
        assessBH: assessBH,
        exportBH: exportBH,
        resetBH: resetBH,
        parseVariables: parseVariables,
        addEdge: addEdge,
        removeEdge: removeEdge,
        analyzeDAG: analyzeDAG,
        clearDAG: clearDAG,
        exportDAG: exportDAG,
        exportMethods: exportMethods
    };
})();
