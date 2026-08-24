# Customer Churn & Retention Business Case

A business-focused analytics project that moves from **exploratory analysis -> predictive modeling -> financial recommendation** using the IBM Telco Customer Churn dataset.

**Business question:** Which customers are most likely to churn, why are they at risk, and is a targeted retention offer financially worth testing?

## Executive takeaway

In the dataset, **26.5% of customers churned**. Those churned customers represent roughly **$1.67M of annualized recurring-revenue exposure** when their monthly charges are annualized, and they pay more on average than the customers who stayed.

A logistic-regression model reaches **0.85 test AUC** and concentrates **67% of observed churn into the highest-risk 30% of customers**. Under the stated retention assumptions, targeting that group produces an estimated **~$347K annualized net benefit at 2.7x ROI**.

Recommended actions:

1. Focus retention efforts on the top-30% predicted-risk segment.
2. Move high-risk month-to-month customers toward annual contracts.
3. Strengthen the first six months of the customer lifecycle with onboarding and bundled support/security.
4. Encourage electronic-check customers to move to autopay.
5. Validate the save-rate assumption with an A/B holdout before scaling the offer.

## Key visuals

| Risk concentration | Retention economics |
|---|---|
| ![Risk deciles](figures/risk_deciles.png) | ![ROI waterfall](figures/roi_waterfall.png) |

The model is useful because it does more than rank customers: it creates a practical target population small enough for a retention program while capturing most observed churn.

## What this project demonstrates

- **Business framing:** translates churn into revenue exposure rather than treating it only as a classification problem.
- **Predictive analytics:** logistic regression, train/test evaluation, ROC-AUC, and risk segmentation.
- **Decision support:** converts model output into an actionable targeting strategy.
- **Financial analysis:** estimates offer cost, retained revenue, net benefit, and ROI.
- **Communication:** includes a one-page executive brief and stakeholder presentation in addition to the technical notebook.
- **Analytical judgment:** separates measured dataset results from assumptions that still require experimentation.

## Deliverables

| File | What it is |
|---|---|
| **[`Churn_Executive_Brief.pdf`](Churn_Executive_Brief.pdf)** | One-page executive brief - the "read nothing else" summary |
| **[`Churn_Retention_Readout.pptx`](Churn_Retention_Readout.pptx)** | Seven-slide stakeholder readout deck |
| **[`churn_analysis.ipynb`](churn_analysis.ipynb)** | Full analysis: EDA, churn drivers, model, risk segmentation, and ROI |

## Analysis workflow

1. **Frame the money.** Translate observed churn and monthly charges into annualized recurring-revenue exposure.
2. **Find the drivers.** Examine churn by contract, tenure, internet type, payment method, and add-ons.
3. **Predict churn.** Train a logistic-regression model and evaluate out-of-sample discrimination.
4. **Prioritize customers.** Rank predicted risk and measure how much observed churn falls into the highest-risk segments.
5. **Quantify the play.** Model the economics of a targeted retention offer and test sensitivity to key assumptions.
6. **Communicate the recommendation.** Package the analysis into executive and stakeholder-ready outputs.

## Measured results vs. assumptions

Measured directly from the dataset:

- 7,043 customers
- 26.5% observed churn
- churned customers average $74.44/month vs. $61.27/month for retained customers
- logistic-regression model test AUC: 0.85
- highest-risk 30% of customers contains 67% of observed churn

Business-case assumptions:

- monthly charges are treated as recurring revenue and annualized
- the retention offer costs $60 per targeted customer
- base-case save rate is 30%
- the save-rate assumption should be validated with a randomized holdout before scaling

## Reproduce the analysis

```bash
pip install -r requirements.txt
python make_figures.py
jupyter nbconvert --to notebook --execute churn_analysis.ipynb
node build_deck.js  # requires pptxgenjs
```

## Data

**IBM Telco Customer Churn** - a public dataset of 7,043 customers from Kaggle. It includes tenure, contract type, monthly charges, subscribed services, payment method, and whether each customer churned.

Dollar figures in this project treat listed monthly charges as recurring revenue for business-case modeling.

## Caveats & next steps

The dataset shows which customers churned, but it does not by itself prove the causal effect of any proposed retention action. The retention save rate is an explicit assumption, not an observed causal result. Before scaling the program, the offer should be validated with a randomized **A/B holdout**.

Additional customer-service, product-usage, complaint, and network-quality data could improve the model and help determine whether elevated churn among fiber-optic customers reflects price, service quality, or another underlying factor.
