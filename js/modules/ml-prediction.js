/**
 * Neuro-Epi — ML for Clinical Research
 * Educational reference and decision tools for machine learning in clinical research.
 */
(function() {
    'use strict';
    const MODULE_ID = 'ml-prediction';

    var tripodState = {};

    /* ------------------------------------------------------------------ */
    /*  Algorithm reference data                                           */
    /* ------------------------------------------------------------------ */
    var algorithms = [
        {
            name: 'Logistic Regression',
            desc: 'Linear model for binary classification using the logistic function. Gold standard for clinical prediction models.',
            pros: 'Highly interpretable; well-understood coefficients (OR); fast; works well with small samples; supports confidence intervals.',
            cons: 'Assumes linearity of log-odds; may underperform with complex non-linear relationships; sensitive to multicollinearity.',
            hyperparams: 'Regularization strength (C), penalty type (L1/L2/ElasticNet), solver, max iterations.',
            interpretability: 5,
            applications: 'Disease risk prediction, mortality prediction, treatment response classification, diagnostic models.'
        },
        {
            name: 'LASSO / Ridge / Elastic Net',
            desc: 'Regularized regression methods. LASSO (L1) performs feature selection; Ridge (L2) handles multicollinearity; Elastic Net combines both.',
            pros: 'Automatic feature selection (LASSO); handles high-dimensional data; reduces overfitting; stable coefficient estimates.',
            cons: 'Assumes linearity; LASSO may be unstable with correlated features; requires tuning of lambda.',
            hyperparams: 'Lambda (regularization strength), alpha (L1/L2 ratio for Elastic Net), standardization method.',
            interpretability: 4,
            applications: 'Genomic studies, biomarker selection, high-dimensional clinical data, variable selection in EHR data.'
        },
        {
            name: 'Decision Trees',
            desc: 'Non-parametric method that recursively partitions data based on feature thresholds to create interpretable decision rules.',
            pros: 'Highly interpretable; handles non-linearity; no assumptions about data distribution; handles mixed data types.',
            cons: 'Prone to overfitting; unstable (small data changes cause large tree changes); generally lower accuracy.',
            hyperparams: 'Max depth, min samples split, min samples leaf, criterion (Gini/entropy), max features.',
            interpretability: 5,
            applications: 'Clinical decision rules, triage algorithms, treatment selection pathways.'
        },
        {
            name: 'Random Forest',
            desc: 'Ensemble of decision trees trained on bootstrap samples with random feature subsets. Reduces variance through averaging.',
            pros: 'High accuracy; handles non-linearity; robust to outliers; built-in feature importance; OOB error estimation.',
            cons: 'Less interpretable than single trees; computationally heavier; can overfit noisy data; biased feature importance with correlated features.',
            hyperparams: 'Number of trees (n_estimators), max depth, max features (mtry), min samples split, bootstrap.',
            interpretability: 3,
            applications: 'Disease classification, readmission prediction, survival prediction, imaging feature analysis.'
        },
        {
            name: 'Gradient Boosting (XGBoost / LightGBM)',
            desc: 'Sequential ensemble that builds trees to correct errors of previous trees. XGBoost and LightGBM are optimized implementations.',
            pros: 'Often highest accuracy; handles missing data; built-in regularization; feature importance; handles imbalanced data.',
            cons: 'Computationally intensive; many hyperparameters to tune; risk of overfitting; less interpretable.',
            hyperparams: 'Learning rate (eta), n_estimators, max depth, subsample, colsample_bytree, reg_alpha, reg_lambda, min_child_weight.',
            interpretability: 2,
            applications: 'ICU mortality prediction, disease progression, treatment outcome prediction, EHR-based prediction.'
        },
        {
            name: 'Support Vector Machines (SVM)',
            desc: 'Finds optimal hyperplane separating classes with maximum margin. Kernel trick enables non-linear classification.',
            pros: 'Effective in high-dimensional spaces; memory efficient; versatile with kernel functions; good generalization.',
            cons: 'Not directly probabilistic; slow with large datasets; sensitive to feature scaling; kernel choice critical.',
            hyperparams: 'C (regularization), kernel (linear/RBF/poly), gamma, degree (for polynomial kernel).',
            interpretability: 2,
            applications: 'Imaging classification, genomic classification, text classification (clinical notes).'
        },
        {
            name: 'k-Nearest Neighbors (kNN)',
            desc: 'Instance-based learning that classifies samples based on majority vote of k nearest training examples.',
            pros: 'Simple; no training phase; naturally handles multi-class; non-parametric.',
            cons: 'Slow prediction with large datasets; sensitive to irrelevant features and feature scaling; curse of dimensionality.',
            hyperparams: 'k (number of neighbors), distance metric (Euclidean/Manhattan/Minkowski), weighting scheme.',
            interpretability: 3,
            applications: 'Pattern recognition, imputation of missing data, anomaly detection in clinical data.'
        },
        {
            name: 'Naive Bayes',
            desc: 'Probabilistic classifier based on Bayes theorem with the (naive) assumption of feature independence.',
            pros: 'Fast; works well with small samples; handles high-dimensional data; naturally probabilistic; good baseline.',
            cons: 'Strong independence assumption rarely holds; may produce poorly calibrated probabilities.',
            hyperparams: 'Distribution type (Gaussian/Multinomial/Bernoulli), smoothing parameter (alpha).',
            interpretability: 4,
            applications: 'Text classification of clinical notes, diagnostic screening, spam detection in clinical alerts.'
        },
        {
            name: 'Neural Networks (MLP)',
            desc: 'Multi-layer perceptrons with interconnected nodes. Universal function approximators for complex patterns.',
            pros: 'Can model complex non-linear relationships; flexible architecture; good with large datasets.',
            cons: 'Requires large data; many hyperparameters; prone to overfitting; black-box; computationally expensive.',
            hyperparams: 'Hidden layers, neurons per layer, activation function, learning rate, batch size, epochs, dropout, optimizer.',
            interpretability: 1,
            applications: 'Complex disease prediction, multi-modal data integration, drug discovery.'
        },
        {
            name: 'Cox-LASSO',
            desc: 'Cox proportional hazards model with L1 (LASSO) penalty for simultaneous feature selection and survival modeling.',
            pros: 'Feature selection in survival context; handles high-dimensional data; interpretable hazard ratios.',
            cons: 'Assumes proportional hazards; linear log-hazard; may miss complex interactions.',
            hyperparams: 'Lambda (regularization strength), cross-validation folds for lambda selection.',
            interpretability: 4,
            applications: 'Prognostic modeling, time-to-event prediction, cancer survival, cardiovascular risk scores.'
        },
        {
            name: 'Random Survival Forests',
            desc: 'Extension of random forests for right-censored survival data. Ensemble of survival trees.',
            pros: 'Handles non-linear effects; no proportional hazards assumption; variable importance; handles interactions.',
            cons: 'Less interpretable; computationally heavier; requires sufficient events; may not extrapolate well.',
            hyperparams: 'Number of trees, mtry, nodesize, splitrule (logrank/logrankscore/C), nsplit.',
            interpretability: 2,
            applications: 'Cancer prognosis, transplant survival, ICU length of stay, competing risks analysis.'
        },
        {
            name: 'Deep Learning — CNNs (Imaging)',
            desc: 'Convolutional Neural Networks process images through learned filters for feature extraction and classification.',
            pros: 'State-of-the-art image classification; automatic feature learning; transfer learning available.',
            cons: 'Requires large labeled datasets; computationally very expensive; black-box; requires GPUs.',
            hyperparams: 'Architecture (ResNet/VGG/DenseNet/EfficientNet), learning rate, batch size, augmentation strategy, pretrained weights.',
            interpretability: 1,
            applications: 'Medical imaging (X-ray, CT, MRI, pathology), retinal screening, dermatology, radiology.'
        },
        {
            name: 'Deep Learning — RNNs / Transformers (Sequences)',
            desc: 'Recurrent and Transformer architectures for sequential/temporal data. LSTM/GRU handle long-range dependencies.',
            pros: 'Captures temporal patterns; handles variable-length sequences; attention mechanisms aid interpretation.',
            cons: 'Data-hungry; complex to train; RNNs suffer vanishing gradients; Transformers need large compute.',
            hyperparams: 'Architecture (LSTM/GRU/Transformer), hidden size, number of layers, attention heads, sequence length, dropout.',
            interpretability: 1,
            applications: 'EHR trajectory prediction, clinical NLP, time-series vital signs, sepsis early warning.'
        }
    ];

    /* ------------------------------------------------------------------ */
    /*  Validation strategies data                                         */
    /* ------------------------------------------------------------------ */
    var validationStrategies = [
        {
            name: 'Train/Test Split',
            desc: 'Randomly partition data into training (e.g., 70-80%) and test (20-30%) sets. Model is trained on training set and evaluated on test set.',
            when: 'Large datasets (>10,000 samples); quick initial evaluation.',
            pros: 'Simple, fast, computationally efficient.',
            cons: 'High variance in estimate; wastes data; single evaluation point.',
            recommendation: 'Use only for very large datasets or as a quick preliminary check. Always pair with cross-validation.'
        },
        {
            name: 'k-Fold Cross-Validation',
            desc: 'Partition data into k equally-sized folds. Train on k-1 folds, test on the remaining fold. Repeat k times and average performance.',
            when: 'Standard approach for most datasets. k=5 or k=10 are common choices.',
            pros: 'More reliable estimate; uses all data for both training and testing; lower variance than single split.',
            cons: 'Computationally more expensive (k model fits); still has some variance.',
            recommendation: 'Default choice for internal validation. Use stratified k-fold for imbalanced outcomes. Repeat multiple times for stable estimates.'
        },
        {
            name: 'Leave-One-Out Cross-Validation (LOOCV)',
            desc: 'Special case of k-fold where k equals the number of samples. Each sample is used as a single test case.',
            when: 'Very small datasets (<100 samples) where maximizing training data is essential.',
            pros: 'Maximum use of available data; nearly unbiased.',
            cons: 'Computationally expensive; high variance; may overfit.',
            recommendation: 'Consider only for very small datasets. Prefer 10-fold CV or bootstrap for most scenarios.'
        },
        {
            name: 'Bootstrap Validation (.632 / .632+)',
            desc: 'Draw bootstrap samples (with replacement) for training; use out-of-bag samples for testing. .632 and .632+ apply bias corrections.',
            when: 'Small to moderate datasets; when you need optimism-corrected estimates.',
            pros: 'Optimism-corrected; uses all data; .632+ handles overfitting better.',
            cons: 'More complex; .632 can underestimate error with overfit models; computationally intensive.',
            recommendation: 'Excellent for small clinical datasets. .632+ recommended by Harrell for clinical prediction models. Use 200+ bootstrap resamples.'
        },
        {
            name: 'External Validation',
            desc: 'Evaluate model on completely independent dataset from different time, location, or population.',
            when: 'Before clinical deployment; regulatory requirements; generalizability assessment.',
            pros: 'Gold standard for generalizability; detects overfitting to development population.',
            cons: 'Requires separate dataset; may not be available; differences may be too large.',
            recommendation: 'Essential before clinical implementation. Geographic and temporal external validation both important.'
        },
        {
            name: 'Temporal Validation',
            desc: 'Train on historical data, validate on more recent data from the same institution. Tests stability over time.',
            when: 'EHR-based studies; when external data unavailable; assessing temporal stability.',
            pros: 'Tests real-world stability; easy to implement with longitudinal data; tests temporal transportability.',
            cons: 'Confounded by temporal trends; may not represent geographic generalizability.',
            recommendation: 'Highly recommended for EHR-based prediction models. Use at least 1-2 years of temporal gap when possible.'
        }
    ];

    /* ------------------------------------------------------------------ */
    /*  Performance metrics data                                           */
    /* ------------------------------------------------------------------ */
    var classificationMetrics = [
        { name: 'AUC-ROC', desc: 'Area under the Receiver Operating Characteristic curve. Probability that a randomly chosen positive has higher predicted probability than a randomly chosen negative.', range: '0.5 (random) to 1.0 (perfect)', notes: 'Insensitive to class imbalance; threshold-independent. Most common discrimination metric.' },
        { name: 'AUC-PR', desc: 'Area under the Precision-Recall curve. More informative than AUC-ROC for rare outcomes.', range: 'Prevalence (random) to 1.0 (perfect)', notes: 'Preferred when outcome prevalence is low (<5%). Baseline equals the prevalence.' },
        { name: 'Sensitivity (Recall)', desc: 'Proportion of true positives correctly identified. TP / (TP + FN).', range: '0 to 1.0', notes: 'Critical when missing positive cases is costly (e.g., cancer screening).' },
        { name: 'Specificity', desc: 'Proportion of true negatives correctly identified. TN / (TN + FP).', range: '0 to 1.0', notes: 'Important when false positives are costly (e.g., unnecessary surgery).' },
        { name: 'F1 Score', desc: 'Harmonic mean of precision and recall. 2 * (precision * recall) / (precision + recall).', range: '0 to 1.0', notes: 'Useful for imbalanced classes; balances precision and recall.' },
        { name: 'Brier Score', desc: 'Mean squared difference between predicted probabilities and actual outcomes.', range: '0 (perfect) to 1.0 (worst)', notes: 'Combines discrimination and calibration. Decomposable into reliability and resolution.' },
        { name: 'Calibration: Hosmer-Lemeshow', desc: 'Goodness-of-fit test comparing observed and predicted event rates across risk groups.', range: 'p > 0.05 indicates adequate fit', notes: 'Sensitive to sample size and number of groups. Supplement with calibration plots.' },
        { name: 'Calibration Slope', desc: 'Slope of logistic recalibration model (logit of predicted vs. actual). Perfect calibration = 1.0.', range: '<1 indicates overfitting, >1 indicates underfitting', notes: 'More informative than H-L test. Report with calibration-in-the-large (intercept).' }
    ];

    var regressionMetrics = [
        { name: 'RMSE', desc: 'Root Mean Squared Error. Square root of mean squared differences between predicted and actual values.', range: '0 (perfect) to infinity', notes: 'Penalizes large errors more than MAE. Same units as outcome.' },
        { name: 'MAE', desc: 'Mean Absolute Error. Average absolute difference between predicted and actual values.', range: '0 (perfect) to infinity', notes: 'More robust to outliers than RMSE. Easier to interpret.' },
        { name: 'R-squared', desc: 'Proportion of variance in outcome explained by the model.', range: '0 to 1.0 (can be negative for very poor models)', notes: 'Context-dependent interpretation. Can be misleadingly high with large variance.' },
        { name: 'Explained Variance', desc: 'Similar to R2 but accounts for bias in predictions.', range: '0 to 1.0', notes: 'Equals R2 when predictions are unbiased.' }
    ];

    var survivalMetrics = [
        { name: 'C-statistic (Harrell)', desc: 'Concordance probability: proportion of all usable patient pairs where predicted risk correctly ranks patients.', range: '0.5 (random) to 1.0 (perfect)', notes: 'Analogous to AUC for survival data. Standard discrimination metric for Cox models.' },
        { name: 'Time-dependent AUC', desc: 'AUC evaluated at specific time points, accounting for censoring.', range: '0.5 to 1.0', notes: 'Useful when discrimination varies over time. Report at clinically meaningful time points.' },
        { name: 'Calibration Plot (Survival)', desc: 'Plot of predicted vs. observed survival probabilities at a specific time point.', range: 'Perfect: 45-degree line', notes: 'Use bootstrap-corrected calibration. Report at multiple time points.' },
        { name: 'Net Reclassification Index (NRI)', desc: 'Measures improvement in classification when a new predictor or model is added. Sums improvement in event and non-event categories.', range: '-2 to +2', notes: 'Report category-based or continuous NRI. Always report event and non-event components separately.' },
        { name: 'Integrated Discrimination Improvement (IDI)', desc: 'Difference in mean predicted probabilities between events and non-events for new vs. old model.', range: '0 (no improvement) to 1.0', notes: 'Complementary to NRI. Does not require predefined risk categories.' }
    ];

    /* ------------------------------------------------------------------ */
    /*  TRIPOD+AI checklist items                                          */
    /* ------------------------------------------------------------------ */
    var tripodItems = [
        { num: '1',  section: 'Source of Data', text: 'Describe the study design or source of data (e.g., randomized trial, cohort, registry, EHR), separately for development and validation' },
        { num: '2',  section: 'Source of Data', text: 'Specify the key study dates, including start of accrual, end of accrual, and end of follow-up' },
        { num: '3',  section: 'Participants', text: 'Specify key elements of the study setting including number and location of centres and relevant dates' },
        { num: '4',  section: 'Participants', text: 'Describe eligibility criteria for participants' },
        { num: '5',  section: 'Participants', text: 'Give details of treatments received, if relevant' },
        { num: '6',  section: 'Outcome', text: 'Clearly define the outcome that is predicted, including how and when assessed' },
        { num: '7',  section: 'Outcome', text: 'Report any actions to blind assessment of the outcome' },
        { num: '8',  section: 'Predictors', text: 'Clearly define all candidate predictors used, including how and when measured' },
        { num: '9',  section: 'Predictors', text: 'Report any actions to blind assessment of predictors for outcome and other predictors' },
        { num: '10', section: 'Sample Size', text: 'Explain how the study size was arrived at, including events per variable considerations' },
        { num: '11', section: 'Missing Data', text: 'Describe how missing data were handled (e.g., complete-case, imputation) with details of any imputation method' },
        { num: '12', section: 'Statistical Analysis', text: 'Describe how predictors were handled in the analyses (coding, transformations)' },
        { num: '13', section: 'Statistical Analysis', text: 'Specify type of model, all model-building procedures (e.g., variable selection), and method for internal validation' },
        { num: '14', section: 'Statistical Analysis', text: 'Specify all measures used to assess model performance (discrimination and calibration)' },
        { num: '15', section: 'Model Development', text: 'Report the full prediction model to allow predictions for individuals (regression coefficients or equivalent)' },
        { num: '16', section: 'Model Development', text: 'Explain how to use the prediction model' },
        { num: '17', section: 'Model Performance', text: 'Report discrimination measures with confidence intervals (e.g., C-statistic, AUC)' },
        { num: '18', section: 'Model Performance', text: 'Report calibration measures with confidence intervals (e.g., calibration plot, slope, intercept)' },
        { num: '19', section: 'Model Performance', text: 'Report any reclassification measures if comparing models (NRI, IDI)' },
        { num: '20', section: 'Model Updating', text: 'If done, report the results from any model updating (recalibration, revision, extension)' },
        { num: '21', section: 'AI-Specific', text: 'Describe the AI/ML algorithm architecture and implementation details sufficient for reproducibility' },
        { num: '22', section: 'AI-Specific', text: 'Report hyperparameter tuning approach and final values' },
        { num: '23', section: 'AI-Specific', text: 'Describe hardware and software used (libraries, versions, GPU/CPU)' },
        { num: '24', section: 'AI-Specific', text: 'Report any explainability methods used (SHAP, LIME, attention maps, partial dependence plots)' },
        { num: '25', section: 'AI-Specific', text: 'Describe fairness and bias assessment across patient subgroups (age, sex, race/ethnicity)' },
        { num: '26', section: 'AI-Specific', text: 'Provide a data flow diagram showing preprocessing, feature engineering, model training, and evaluation pipeline' },
        { num: '27', section: 'AI-Specific', text: 'Report availability of code, trained models, and data (or reasons for restricted access)' }
    ];

    /* ------------------------------------------------------------------ */
    /*  Common pitfalls data                                               */
    /* ------------------------------------------------------------------ */
    var pitfalls = [
        {
            title: 'Data Leakage',
            content: 'Data leakage occurs when information from outside the training dataset is used to create the model, leading to overly optimistic performance estimates.\n\n'
                + '<strong>Common examples:</strong>\n'
                + '<ul style="margin:0.5rem 0;padding-left:1.5rem;">'
                + '<li>Using future information to predict current outcomes (e.g., using 30-day lab results to predict mortality at admission)</li>'
                + '<li>Performing feature selection or normalization on the full dataset before splitting into train/test</li>'
                + '<li>Including variables that are consequences of the outcome (e.g., using ICU admission as a predictor of in-hospital mortality when ICU admission happens after the outcome)</li>'
                + '<li>Patient-level data appearing in both training and test sets (e.g., multiple visits from the same patient)</li>'
                + '</ul>'
                + '<strong>Prevention:</strong> Always split data before any preprocessing. Use temporal splits when possible. Carefully review each feature for potential causal path to outcome.'
        },
        {
            title: 'Class Imbalance Handling',
            content: 'Clinical outcomes are often rare (e.g., 1-5% event rate), causing models to predict the majority class.\n\n'
                + '<strong>Approaches:</strong>\n'
                + '<ul style="margin:0.5rem 0;padding-left:1.5rem;">'
                + '<li><strong>Resampling:</strong> SMOTE, random oversampling, random undersampling (apply only to training data, never test data)</li>'
                + '<li><strong>Cost-sensitive learning:</strong> Assign higher misclassification costs to the minority class</li>'
                + '<li><strong>Appropriate metrics:</strong> Use AUC-PR instead of AUC-ROC; use F1 instead of accuracy</li>'
                + '<li><strong>Threshold tuning:</strong> Optimize classification threshold for the specific clinical use case</li>'
                + '</ul>'
                + '<strong>Key point:</strong> Do NOT use accuracy as a metric for imbalanced data. A model predicting "no event" always would have 95% accuracy with 5% event rate.'
        },
        {
            title: 'Feature Selection Bias',
            content: 'Performing feature selection on the entire dataset before cross-validation leads to information leakage and optimistic performance.\n\n'
                + '<strong>Wrong approach:</strong> Select top features from full dataset, then cross-validate using only those features.\n\n'
                + '<strong>Correct approach:</strong> Feature selection must be performed within each fold of cross-validation (nested cross-validation).\n\n'
                + '<strong>Impact:</strong> Bias can be substantial -- studies have shown AUC inflation of 0.05-0.15 when feature selection is done outside CV.'
        },
        {
            title: 'Overfitting in Small Datasets',
            content: 'Clinical datasets are often small, making overfitting a major concern.\n\n'
                + '<strong>Rules of thumb:</strong>\n'
                + '<ul style="margin:0.5rem 0;padding-left:1.5rem;">'
                + '<li>Events per variable (EPV): Minimum 10-20 events per predictor for logistic regression (Riley et al. recommend sample size calculations)</li>'
                + '<li>For ML methods: Generally need even more events per feature</li>'
                + '<li>Use penalized methods (LASSO, ridge) for high p/n ratios</li>'
                + '<li>Report optimism-corrected performance (bootstrap .632+ or internal-external CV)</li>'
                + '</ul>'
                + '<strong>Warning signs:</strong> Large gap between training and validation performance; very high training AUC (>0.95); unstable variable selection across bootstrap samples.'
        },
        {
            title: 'Calibration vs. Discrimination',
            content: 'Discrimination (can the model rank patients?) and calibration (are predicted probabilities accurate?) are distinct and both important.\n\n'
                + '<strong>Key points:</strong>\n'
                + '<ul style="margin:0.5rem 0;padding-left:1.5rem;">'
                + '<li>A model can have excellent discrimination (high AUC) but poor calibration (predicted 20% risk when actual risk is 5%)</li>'
                + '<li>Clinical decisions based on predicted probabilities require good calibration</li>'
                + '<li>Always report both: AUC/C-statistic for discrimination AND calibration plot/slope for calibration</li>'
                + '<li>Recalibration can fix calibration without affecting discrimination</li>'
                + '</ul>'
                + '<strong>Clinical impact:</strong> A poorly calibrated model may lead to over-treatment or under-treatment when used for shared decision-making.'
        },
        {
            title: 'Confusing Prediction with Causation',
            content: 'Prediction models identify patterns associated with outcomes, not causal relationships.\n\n'
                + '<strong>Key distinctions:</strong>\n'
                + '<ul style="margin:0.5rem 0;padding-left:1.5rem;">'
                + '<li>A predictor in a model may be a confounder, mediator, collider, or simply correlated</li>'
                + '<li>Feature importance (SHAP, permutation) shows predictive contribution, not causal effect</li>'
                + '<li>Intervening on a predictor identified by an ML model may not change the outcome</li>'
                + '<li>Prediction and causal inference require different frameworks (prediction: maximize fit; causal: minimize confounding)</li>'
                + '</ul>'
                + '<strong>Recommendation:</strong> Clearly state whether the goal is prediction or causal inference. Use appropriate methods for each.'
        },
        {
            title: 'Ignoring Temporal Relationships',
            content: 'In clinical data, the timing of measurements relative to the prediction time point is critical.\n\n'
                + '<strong>Common mistakes:</strong>\n'
                + '<ul style="margin:0.5rem 0;padding-left:1.5rem;">'
                + '<li>Using data collected after the prediction time point (future data leakage)</li>'
                + '<li>Not accounting for concept drift (disease definitions, treatment protocols change over time)</li>'
                + '<li>Ignoring lead-time bias when using screening-detected outcomes</li>'
                + '<li>Not performing temporal validation (training on older data, testing on newer)</li>'
                + '</ul>'
                + '<strong>Best practice:</strong> Define a clear clinical timeline with prediction time point (T0) and ensure all predictors are available at T0.'
        },
        {
            title: 'Not Accounting for Missing Data Properly',
            content: 'Missing data is ubiquitous in clinical datasets and how it is handled profoundly affects results.\n\n'
                + '<strong>Approaches (from worst to best):</strong>\n'
                + '<ul style="margin:0.5rem 0;padding-left:1.5rem;">'
                + '<li><strong>Complete-case analysis:</strong> Deletes rows with missing values. Introduces bias if data is not MCAR; loses statistical power.</li>'
                + '<li><strong>Single imputation (mean/median):</strong> Underestimates variance; introduces bias toward the mean.</li>'
                + '<li><strong>Multiple imputation:</strong> Creates multiple plausible datasets, analyses each, and combines results. Gold standard for statistical models.</li>'
                + '<li><strong>Indicator method:</strong> Adding a "missing" indicator variable. Can sometimes be useful but biased in many settings.</li>'
                + '</ul>'
                + '<strong>Key:</strong> Report the proportion of missing data per variable. Use multiple imputation (e.g., MICE) when possible. Perform sensitivity analyses comparing approaches.'
        }
    ];

    /* ------------------------------------------------------------------ */
    /*  ML Method recommendation logic                                     */
    /* ------------------------------------------------------------------ */
    function getRecommendations(task, dataSize, interpretability, featureType) {
        var recs = [];

        if (task === 'classification') {
            if (interpretability === 'high') {
                recs.push({ method: 'Logistic Regression', reason: 'Gold standard for interpretable classification; produces odds ratios; well-accepted in clinical literature.' });
                recs.push({ method: 'LASSO / Elastic Net', reason: 'Adds automatic feature selection to logistic regression; ideal when many candidate predictors exist.' });
                recs.push({ method: 'Decision Trees', reason: 'Produces intuitive decision rules; easy to explain to clinicians; useful for creating clinical decision algorithms.' });
            }
            if (interpretability === 'medium') {
                recs.push({ method: 'Random Forest', reason: 'Balances accuracy and interpretability; feature importance available; robust to overfitting.' });
                if (dataSize !== 'small') {
                    recs.push({ method: 'Gradient Boosting (XGBoost)', reason: 'Often highest accuracy; built-in handling of missing data; SHAP values for interpretation.' });
                }
                recs.push({ method: 'Naive Bayes', reason: 'Fast, works well with small samples; good baseline model to compare against more complex methods.' });
            }
            if (interpretability === 'low') {
                recs.push({ method: 'Gradient Boosting (XGBoost/LightGBM)', reason: 'State-of-the-art accuracy for tabular data; extensive hyperparameter tuning available.' });
                recs.push({ method: 'Support Vector Machines', reason: 'Excellent for high-dimensional data; kernel methods capture non-linear patterns.' });
                if (dataSize === 'large') {
                    recs.push({ method: 'Neural Networks', reason: 'Can capture complex patterns with sufficient data; flexible architecture.' });
                }
                if (featureType === 'images') {
                    recs.push({ method: 'CNNs (Deep Learning)', reason: 'State-of-the-art for image classification; transfer learning with pretrained models (ResNet, EfficientNet).' });
                }
                if (featureType === 'text') {
                    recs.push({ method: 'RNNs / Transformers', reason: 'Best for sequential/text data; clinical NLP applications; pretrained models (BioBERT, ClinicalBERT) available.' });
                }
            }
        } else if (task === 'regression') {
            if (interpretability === 'high') {
                recs.push({ method: 'Linear Regression with LASSO/Ridge', reason: 'Interpretable coefficients; feature selection; confidence intervals available.' });
            }
            if (interpretability === 'medium' || interpretability === 'low') {
                recs.push({ method: 'Random Forest Regressor', reason: 'Handles non-linearity; robust; feature importance available.' });
                recs.push({ method: 'Gradient Boosting Regressor', reason: 'Often best accuracy; handles mixed feature types well.' });
            }
            if (dataSize === 'large' && interpretability === 'low') {
                recs.push({ method: 'Neural Networks', reason: 'Flexible function approximation for large datasets with complex relationships.' });
            }
        } else if (task === 'survival') {
            recs.push({ method: 'Cox-LASSO', reason: 'Feature selection for survival data; interpretable hazard ratios; handles high-dimensional data.' });
            if (interpretability !== 'high') {
                recs.push({ method: 'Random Survival Forests', reason: 'No proportional hazards assumption; handles non-linear effects and interactions.' });
            }
            if (dataSize === 'large' && interpretability === 'low') {
                recs.push({ method: 'DeepSurv / Deep Learning Survival', reason: 'Neural network-based survival models for complex patterns in large datasets.' });
            }
        } else if (task === 'clustering') {
            recs.push({ method: 'K-Means / K-Medoids', reason: 'Simple and fast; good starting point for identifying patient subgroups.' });
            recs.push({ method: 'Hierarchical Clustering', reason: 'Produces dendrogram; no need to prespecify number of clusters; interpretable.' });
            if (dataSize !== 'small') {
                recs.push({ method: 'DBSCAN', reason: 'Finds clusters of arbitrary shape; handles noise; no need to specify number of clusters.' });
            }
            recs.push({ method: 'Latent Class Analysis', reason: 'Model-based clustering with probabilistic framework; good for mixed data types in clinical studies.' });
        } else if (task === 'dimensionality') {
            recs.push({ method: 'PCA', reason: 'Linear dimensionality reduction; preserves maximum variance; widely understood.' });
            recs.push({ method: 'UMAP / t-SNE', reason: 'Non-linear dimensionality reduction for visualization; preserves local structure.' });
            if (featureType === 'mixed') {
                recs.push({ method: 'Factor Analysis of Mixed Data (FAMD)', reason: 'Handles mixed continuous and categorical variables simultaneously.' });
            }
            recs.push({ method: 'Autoencoders', reason: 'Neural network-based non-linear dimensionality reduction; can capture complex relationships.' });
        }

        if (recs.length === 0) {
            recs.push({ method: 'Logistic Regression / Random Forest', reason: 'Good default starting point. Consider the specific characteristics of your data for further refinement.' });
        }

        return recs;
    }

    /* ------------------------------------------------------------------ */
    /*  Render                                                             */
    /* ------------------------------------------------------------------ */
    function render(container) {
        var html = App.createModuleLayout(
            'ML for Clinical Research',
            'Educational reference and decision tools for applying machine learning methods in clinical and epidemiological research.'
        );

        // Learn & Reference section
        html += '<div class="card" style="background: var(--bg-secondary); border-left: 4px solid var(--accent-color);">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\')">&#128218; Learn &amp; Reference <span style="font-size:0.8em; color: var(--text-muted);">(click to expand)</span></div>';
        html += '<div class="learn-body hidden">';

        html += '<div style="margin-bottom:1.2rem;">';
        html += '<div style="font-weight:700;margin-bottom:0.4rem;color:var(--accent);">Key Concepts</div>';
        html += '<ul style="margin:0;padding-left:1.5rem;font-size:0.9rem;line-height:1.7;">';
        html += '<li>Bias-variance tradeoff</li>';
        html += '<li>Overfitting vs underfitting</li>';
        html += '<li>Feature engineering</li>';
        html += '<li>Cross-validation (k-fold, LOOCV, nested CV)</li>';
        html += '<li>Hyperparameter tuning</li>';
        html += '</ul>';
        html += '</div>';

        html += '<div style="margin-bottom:1.2rem;">';
        html += '<div style="font-weight:700;margin-bottom:0.4rem;color:var(--accent);">Validation Hierarchy</div>';
        html += '<div style="font-size:0.9rem;line-height:1.7;padding-left:0.5rem;">';
        html += 'Internal (cross-validation) &rarr; Temporal validation &rarr; External (different population) &rarr; Clinical impact study.';
        html += '<br><strong>Always split BEFORE any data exploration.</strong>';
        html += '</div>';
        html += '</div>';

        html += '<div style="margin-bottom:1.2rem;">';
        html += '<div style="font-weight:700;margin-bottom:0.4rem;color:var(--accent);">Performance Metrics</div>';
        html += '<ul style="margin:0;padding-left:1.5rem;font-size:0.9rem;line-height:1.7;">';
        html += '<li><strong>Discrimination:</strong> AUC-ROC, c-statistic</li>';
        html += '<li><strong>Calibration:</strong> Hosmer-Lemeshow, calibration plots</li>';
        html += '<li><strong>Net benefit:</strong> Decision curves</li>';
        html += '<li><strong>Clinical utility:</strong> NRI, IDI</li>';
        html += '</ul>';
        html += '</div>';

        html += '<div style="margin-bottom:1.2rem;">';
        html += '<div style="font-weight:700;margin-bottom:0.4rem;color:var(--accent);">Common Pitfalls</div>';
        html += '<ul style="margin:0;padding-left:1.5rem;font-size:0.9rem;line-height:1.7;">';
        html += '<li>Data leakage (using test info during training)</li>';
        html += '<li>Class imbalance &rarr; misleading accuracy</li>';
        html += '<li>Overfitting to training data</li>';
        html += '<li>Ignoring calibration</li>';
        html += '<li>Not reporting confidence intervals</li>';
        html += '</ul>';
        html += '</div>';

        html += '<div>';
        html += '<div style="font-weight:700;margin-bottom:0.4rem;color:var(--accent);">References</div>';
        html += '<ul style="margin:0;padding-left:1.5rem;font-size:0.85rem;line-height:1.7;">';
        html += '<li>Collins GS et al. TRIPOD+AI, 2024</li>';
        html += '<li>Steyerberg EW. Clinical Prediction Models</li>';
        html += '<li>Rajkomar A et al. ML in Medicine, NEJM 2019</li>';
        html += '</ul>';
        html += '</div>';

        html += '</div></div>';

        /* === Card 1: ML Method Selector === */
        html += '<div class="card">';
        html += '<div class="card-title">ML Method Selector</div>';
        html += '<div class="card-subtitle">Answer the questions below to get algorithm recommendations tailored to your research problem.</div>';

        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Task Type</label>';
        html += '<select class="form-select" id="ml-task">';
        html += '<option value="classification">Classification (binary/multi-class)</option>';
        html += '<option value="regression">Regression (continuous outcome)</option>';
        html += '<option value="clustering">Clustering (unsupervised grouping)</option>';
        html += '<option value="dimensionality">Dimensionality Reduction</option>';
        html += '<option value="survival">Survival / Time-to-Event</option>';
        html += '</select></div>';

        html += '<div class="form-group"><label class="form-label">Dataset Size</label>';
        html += '<select class="form-select" id="ml-datasize">';
        html += '<option value="small">Small (&lt;500 samples)</option>';
        html += '<option value="medium" selected>Medium (500 - 10,000)</option>';
        html += '<option value="large">Large (&gt;10,000)</option>';
        html += '</select></div>';
        html += '</div>';

        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Interpretability Needed</label>';
        html += '<select class="form-select" id="ml-interp">';
        html += '<option value="high">High (clinician must understand model)</option>';
        html += '<option value="medium" selected>Medium (feature importance sufficient)</option>';
        html += '<option value="low">Low (performance is priority)</option>';
        html += '</select></div>';

        html += '<div class="form-group"><label class="form-label">Feature Types</label>';
        html += '<select class="form-select" id="ml-features">';
        html += '<option value="continuous">Continuous</option>';
        html += '<option value="categorical">Categorical</option>';
        html += '<option value="mixed" selected>Mixed</option>';
        html += '<option value="text">Text / Clinical Notes</option>';
        html += '<option value="images">Images (radiology, pathology)</option>';
        html += '</select></div>';
        html += '</div>';

        html += '<div class="btn-group mt-1">';
        html += '<button class="btn btn-primary" onclick="MLPrediction.recommend()">Get Recommendations</button>';
        html += '</div>';

        html += '<div id="ml-recommendations" class="mt-2"></div>';
        html += '</div>';

        /* === Card 2: Algorithm Reference === */
        html += '<div class="card">';
        html += '<div class="card-title">Algorithm Reference</div>';
        html += '<div class="card-subtitle">Comprehensive reference for machine learning algorithms commonly used in clinical research.</div>';

        html += '<div class="table-container">';
        html += '<table class="data-table">';
        html += '<thead><tr><th>Algorithm</th><th>Interpretability</th><th>Description</th><th style="min-width:200px">Clinical Applications</th></tr></thead>';
        html += '<tbody>';
        for (var a = 0; a < algorithms.length; a++) {
            var alg = algorithms[a];
            var stars = '';
            for (var si = 0; si < 5; si++) {
                stars += si < alg.interpretability ? '&#9733;' : '&#9734;';
            }
            html += '<tr>';
            html += '<td><strong>' + alg.name + '</strong></td>';
            html += '<td style="white-space:nowrap;">' + stars + ' (' + alg.interpretability + '/5)</td>';
            html += '<td style="font-size:0.85rem;">' + alg.desc + '</td>';
            html += '<td style="font-size:0.85rem;">' + alg.applications + '</td>';
            html += '</tr>';
        }
        html += '</tbody></table>';
        html += '</div>';

        /* Expandable detail cards for each algorithm */
        html += '<div class="card-subtitle mt-2">Detailed Algorithm Information</div>';
        for (var b = 0; b < algorithms.length; b++) {
            var alg2 = algorithms[b];
            html += '<div style="border:1px solid var(--border);border-radius:6px;margin-bottom:0.5rem;overflow:hidden;">';
            html += '<div onclick="MLPrediction.toggleAlgDetail(' + b + ')" style="padding:0.6rem 1rem;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:var(--bg-elevated);">';
            html += '<strong>' + alg2.name + '</strong>';
            html += '<span id="ml-alg-arrow-' + b + '" style="transition:transform 0.2s;">&#9660;</span>';
            html += '</div>';
            html += '<div id="ml-alg-detail-' + b + '" class="hidden" style="padding:0.8rem 1rem;font-size:0.9rem;">';
            html += '<p><strong>Description:</strong> ' + alg2.desc + '</p>';
            html += '<p><strong>Pros:</strong> ' + alg2.pros + '</p>';
            html += '<p><strong>Cons:</strong> ' + alg2.cons + '</p>';
            html += '<p><strong>Key Hyperparameters:</strong> ' + alg2.hyperparams + '</p>';
            html += '<p><strong>Clinical Applications:</strong> ' + alg2.applications + '</p>';
            html += '</div></div>';
        }
        html += '</div>';

        /* === Card 3: Model Validation Guide === */
        html += '<div class="card">';
        html += '<div class="card-title">Model Validation Guide</div>';

        html += '<div class="card-subtitle">Validation Strategies</div>';
        for (var v = 0; v < validationStrategies.length; v++) {
            var vs = validationStrategies[v];
            html += '<div style="border:1px solid var(--border);border-radius:6px;margin-bottom:0.5rem;overflow:hidden;">';
            html += '<div onclick="MLPrediction.toggleValidation(' + v + ')" style="padding:0.6rem 1rem;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:var(--bg-elevated);">';
            html += '<strong>' + vs.name + '</strong>';
            html += '<span id="ml-val-arrow-' + v + '" style="transition:transform 0.2s;">&#9660;</span>';
            html += '</div>';
            html += '<div id="ml-val-detail-' + v + '" class="hidden" style="padding:0.8rem 1rem;font-size:0.9rem;">';
            html += '<p>' + vs.desc + '</p>';
            html += '<p><strong>When to use:</strong> ' + vs.when + '</p>';
            html += '<p><strong>Pros:</strong> ' + vs.pros + '</p>';
            html += '<p><strong>Cons:</strong> ' + vs.cons + '</p>';
            html += '<p style="color:var(--accent);"><strong>Recommendation:</strong> ' + vs.recommendation + '</p>';
            html += '</div></div>';
        }

        /* Classification metrics */
        html += '<div class="card-subtitle mt-2">Classification Metrics</div>';
        html += '<div class="table-container">';
        html += '<table class="data-table">';
        html += '<thead><tr><th>Metric</th><th>Range</th><th>Description</th><th>Notes</th></tr></thead>';
        html += '<tbody>';
        for (var cm = 0; cm < classificationMetrics.length; cm++) {
            var m = classificationMetrics[cm];
            html += '<tr><td><strong>' + m.name + '</strong></td><td style="white-space:nowrap;font-size:0.85rem;">' + m.range + '</td><td style="font-size:0.85rem;">' + m.desc + '</td><td style="font-size:0.85rem;">' + m.notes + '</td></tr>';
        }
        html += '</tbody></table></div>';

        /* Regression metrics */
        html += '<div class="card-subtitle mt-2">Regression Metrics</div>';
        html += '<div class="table-container">';
        html += '<table class="data-table">';
        html += '<thead><tr><th>Metric</th><th>Range</th><th>Description</th><th>Notes</th></tr></thead>';
        html += '<tbody>';
        for (var rm = 0; rm < regressionMetrics.length; rm++) {
            var mr = regressionMetrics[rm];
            html += '<tr><td><strong>' + mr.name + '</strong></td><td style="white-space:nowrap;font-size:0.85rem;">' + mr.range + '</td><td style="font-size:0.85rem;">' + mr.desc + '</td><td style="font-size:0.85rem;">' + mr.notes + '</td></tr>';
        }
        html += '</tbody></table></div>';

        /* Survival metrics */
        html += '<div class="card-subtitle mt-2">Survival / Reclassification Metrics</div>';
        html += '<div class="table-container">';
        html += '<table class="data-table">';
        html += '<thead><tr><th>Metric</th><th>Range</th><th>Description</th><th>Notes</th></tr></thead>';
        html += '<tbody>';
        for (var sm = 0; sm < survivalMetrics.length; sm++) {
            var ms = survivalMetrics[sm];
            html += '<tr><td><strong>' + ms.name + '</strong></td><td style="white-space:nowrap;font-size:0.85rem;">' + ms.range + '</td><td style="font-size:0.85rem;">' + ms.desc + '</td><td style="font-size:0.85rem;">' + ms.notes + '</td></tr>';
        }
        html += '</tbody></table></div>';
        html += '</div>';

        /* === Card 4: TRIPOD+AI Checklist === */
        html += '<div class="card">';
        html += '<div class="card-title">TRIPOD+AI Checklist</div>';
        html += '<div class="card-subtitle">Checklist for reporting prediction model studies with AI/ML components. Based on TRIPOD with AI extensions.</div>';

        /* Progress bar */
        html += '<div style="margin-bottom:1rem;">';
        html += '<div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:0.3rem;">';
        html += '<span id="ml-tripod-progress-text">0 / ' + tripodItems.length + ' items completed</span>';
        html += '<span id="ml-tripod-progress-pct">0%</span>';
        html += '</div>';
        html += '<div style="height:8px;background:var(--bg-elevated);border-radius:4px;overflow:hidden;">';
        html += '<div id="ml-tripod-progress-bar" style="height:100%;width:0%;background:var(--accent);border-radius:4px;transition:width 0.3s;"></div>';
        html += '</div>';
        html += '</div>';

        var lastTripodSection = '';
        for (var t = 0; t < tripodItems.length; t++) {
            var ti = tripodItems[t];
            if (ti.section !== lastTripodSection) {
                if (lastTripodSection !== '') html += '</div>';
                html += '<div style="margin-bottom:0.5rem;">';
                html += '<div style="font-weight:600;font-size:0.95rem;color:var(--accent);margin:0.8rem 0 0.4rem;border-bottom:1px solid var(--border);padding-bottom:0.2rem;">' + ti.section + '</div>';
                lastTripodSection = ti.section;
            }
            var tKey = 'tripod_' + ti.num;
            html += '<label style="display:flex;align-items:flex-start;gap:0.5rem;padding:0.35rem 0;cursor:pointer;font-size:0.9rem;">';
            html += '<input type="checkbox" id="ml-tripod-' + tKey + '" onchange="MLPrediction.toggleTripod(\'' + ti.num + '\')" style="margin-top:3px;flex-shrink:0;">';
            html += '<span><strong>' + ti.num + '.</strong> ' + ti.text + '</span>';
            html += '</label>';
        }
        if (lastTripodSection !== '') html += '</div>';

        html += '<div class="btn-group mt-2">';
        html += '<button class="btn btn-secondary" onclick="MLPrediction.copyTripod()">Copy TRIPOD+AI Checklist</button>';
        html += '<button class="btn btn-secondary" onclick="MLPrediction.resetTripod()">Reset</button>';
        html += '</div>';
        html += '</div>';

        /* === Card 5: Common Pitfalls === */
        html += '<div class="card">';
        html += '<div class="card-title">Common Pitfalls in Clinical ML</div>';
        html += '<div class="card-subtitle">Critical issues to avoid when applying machine learning to clinical research data.</div>';

        for (var p = 0; p < pitfalls.length; p++) {
            var pit = pitfalls[p];
            html += '<div style="border:1px solid var(--border);border-radius:6px;margin-bottom:0.5rem;overflow:hidden;">';
            html += '<div onclick="MLPrediction.togglePitfall(' + p + ')" style="padding:0.6rem 1rem;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:var(--bg-elevated);">';
            html += '<strong style="color:var(--warning,#e67e22);">' + (p + 1) + '. ' + pit.title + '</strong>';
            html += '<span id="ml-pit-arrow-' + p + '" style="transition:transform 0.2s;">&#9660;</span>';
            html += '</div>';
            html += '<div id="ml-pit-detail-' + p + '" class="hidden" style="padding:0.8rem 1rem;font-size:0.9rem;">';
            html += pit.content;
            html += '</div></div>';
        }
        html += '</div>';

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);
    }

    /* ------------------------------------------------------------------ */
    /*  Interaction handlers                                               */
    /* ------------------------------------------------------------------ */
    function recommend() {
        var task = document.getElementById('ml-task').value;
        var dataSize = document.getElementById('ml-datasize').value;
        var interp = document.getElementById('ml-interp').value;
        var features = document.getElementById('ml-features').value;

        var recs = getRecommendations(task, dataSize, interp, features);

        var html = '<div class="result-panel">';
        html += '<div class="card-subtitle">Recommended Methods</div>';

        for (var i = 0; i < recs.length; i++) {
            var rec = recs[i];
            html += '<div style="padding:0.6rem 0;border-bottom:1px solid var(--border);">';
            html += '<div class="result-value" style="font-size:1rem;">' + (i + 1) + '. ' + rec.method + '</div>';
            html += '<div class="result-detail">' + rec.reason + '</div>';
            html += '</div>';
        }

        html += '<div style="margin-top:0.8rem;padding:0.6rem;background:var(--bg-elevated);border-radius:4px;font-size:0.85rem;">';
        html += '<strong>Context:</strong> Task=' + task + ', Data size=' + dataSize + ', Interpretability=' + interp + ', Features=' + features;
        html += '<br><strong>General advice:</strong> Always start with a simple, interpretable baseline (e.g., logistic regression) and only move to complex models if performance improvement justifies the loss of interpretability.';
        html += '</div>';
        html += '</div>';

        var el = document.getElementById('ml-recommendations');
        if (el) App.setTrustedHTML(el, html);
    }

    function toggleAlgDetail(idx) {
        var detail = document.getElementById('ml-alg-detail-' + idx);
        var arrow = document.getElementById('ml-alg-arrow-' + idx);
        if (detail) {
            detail.classList.toggle('hidden');
            if (arrow) arrow.style.transform = detail.classList.contains('hidden') ? '' : 'rotate(180deg)';
        }
    }

    function toggleValidation(idx) {
        var detail = document.getElementById('ml-val-detail-' + idx);
        var arrow = document.getElementById('ml-val-arrow-' + idx);
        if (detail) {
            detail.classList.toggle('hidden');
            if (arrow) arrow.style.transform = detail.classList.contains('hidden') ? '' : 'rotate(180deg)';
        }
    }

    function togglePitfall(idx) {
        var detail = document.getElementById('ml-pit-detail-' + idx);
        var arrow = document.getElementById('ml-pit-arrow-' + idx);
        if (detail) {
            detail.classList.toggle('hidden');
            if (arrow) arrow.style.transform = detail.classList.contains('hidden') ? '' : 'rotate(180deg)';
        }
    }

    function toggleTripod(num) {
        tripodState[num] = !tripodState[num];
        updateTripodProgress();
    }

    function updateTripodProgress() {
        var total = tripodItems.length;
        var done = 0;
        for (var i = 0; i < tripodItems.length; i++) {
            if (tripodState[tripodItems[i].num]) done++;
        }
        var pct = total > 0 ? Math.round((done / total) * 100) : 0;

        var textEl = document.getElementById('ml-tripod-progress-text');
        if (textEl) App.setTrustedHTML(textEl, done + ' / ' + total + ' items completed');

        var pctEl = document.getElementById('ml-tripod-progress-pct');
        if (pctEl) App.setTrustedHTML(pctEl, pct + '%');

        var barEl = document.getElementById('ml-tripod-progress-bar');
        if (barEl) barEl.style.width = pct + '%';
    }

    function copyTripod() {
        var lines = ['TRIPOD+AI Checklist', '='.repeat(40), ''];
        var lastSection = '';
        for (var i = 0; i < tripodItems.length; i++) {
            var item = tripodItems[i];
            if (item.section !== lastSection) {
                if (lastSection !== '') lines.push('');
                lines.push('--- ' + item.section + ' ---');
                lastSection = item.section;
            }
            var mark = tripodState[item.num] ? '[X]' : '[ ]';
            lines.push(mark + ' ' + item.num + '. ' + item.text);
        }
        var done = 0;
        for (var j = 0; j < tripodItems.length; j++) {
            if (tripodState[tripodItems[j].num]) done++;
        }
        lines.push('');
        lines.push('Progress: ' + done + '/' + tripodItems.length + ' (' + Math.round((done / tripodItems.length) * 100) + '%)');
        lines.push('Generated: ' + new Date().toLocaleDateString());
        Export.copyText(lines.join('\n'));
    }

    function resetTripod() {
        tripodState = {};
        var checkboxes = document.querySelectorAll('[id^="ml-tripod-tripod_"]');
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
        }
        updateTripodProgress();
    }

    /* ------------------------------------------------------------------ */
    /*  Register                                                           */
    /* ------------------------------------------------------------------ */
    App.registerModule(MODULE_ID, { render: render });
    window.MLPrediction = {
        recommend: recommend,
        toggleAlgDetail: toggleAlgDetail,
        toggleValidation: toggleValidation,
        togglePitfall: togglePitfall,
        toggleTripod: toggleTripod,
        copyTripod: copyTripod,
        resetTripod: resetTripod
    };
})();
