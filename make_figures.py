"""Regenerate the charts used in the deck and executive brief.

Computes every value from data/telco_churn.csv (nothing hard-coded), then
writes the four figures into figures/. Run:  python make_figures.py
"""
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

INK, BLUE, RED, GREEN, MUT, GRID = "#1f2733", "#2563eb", "#dc2626", "#16a34a", "#94a3b8", "#e6e9ef"
plt.rcParams.update({"figure.facecolor": "white", "axes.facecolor": "white",
    "savefig.facecolor": "white", "text.color": INK, "axes.labelcolor": INK,
    "xtick.color": INK, "ytick.color": INK, "font.size": 12, "axes.edgecolor": GRID,
    "axes.grid": True, "grid.color": GRID, "axes.axisbelow": True})
FIG = Path("figures"); FIG.mkdir(exist_ok=True)


def load():
    df = pd.read_csv("data/telco_churn.csv")
    df["TotalCharges"] = pd.to_numeric(df["TotalCharges"], errors="coerce").fillna(0)
    df["churn"] = (df["Churn"] == "Yes").astype(int)
    return df


def score(df):
    num = ["tenure", "MonthlyCharges", "TotalCharges", "SeniorCitizen"]
    cat = [c for c in df.columns if df[c].dtype == object and c not in ("customerID", "Churn")]
    pre = ColumnTransformer([("n", StandardScaler(), num),
                             ("c", OneHotEncoder(handle_unknown="ignore"), cat)])
    model = Pipeline([("pre", pre), ("lr", LogisticRegression(max_iter=1000, class_weight="balanced"))])
    model.fit(df[num + cat], df["churn"])
    df["risk"] = model.predict_proba(df[num + cat])[:, 1]
    df["decile"] = pd.qcut(df["risk"], 10, labels=False) + 1
    return df


def bare(ax):
    ax.spines[["top", "right"]].set_visible(False)
    ax.grid(axis="x", visible=False)


def main():
    df = score(load())

    # 1. Churn by contract
    order = ["Month-to-month", "One year", "Two year"]
    vals = [df.loc[df.Contract == c, "churn"].mean() * 100 for c in order]
    fig, ax = plt.subplots(figsize=(7, 4))
    ax.bar(order, vals, color=[RED, MUT, MUT], width=0.6)
    for i, v in enumerate(vals):
        ax.text(i, v + 1, f"{v:.1f}%", ha="center", fontweight="bold")
    ax.set_title("Churn rate by contract type", loc="left", fontweight="bold", pad=12)
    ax.set_ylabel("Churn rate"); ax.set_ylim(0, 50); bare(ax)
    fig.tight_layout(); fig.savefig(FIG / "churn_by_contract.png", dpi=150); plt.close(fig)

    # 2. Tenure curve
    df["tb"] = pd.cut(df.tenure, [-1, 6, 12, 24, 48, 72],
                      labels=["0-6mo", "7-12mo", "1-2yr", "2-4yr", "4-6yr"])
    curve = df.groupby("tb", observed=True)["churn"].mean() * 100
    fig, ax = plt.subplots(figsize=(7, 4))
    ax.plot(curve.index.astype(str), curve.values, color=BLUE, marker="o", markersize=8, linewidth=2.5)
    ax.fill_between(curve.index.astype(str), curve.values, color=BLUE, alpha=0.1)
    for x, y in zip(curve.index.astype(str), curve.values):
        ax.text(x, y + 2, f"{y:.1f}%", ha="center", fontweight="bold", color=BLUE)
    ax.set_title("Churn is front-loaded: new customers leave fastest", loc="left", fontweight="bold", pad=12)
    ax.set_ylabel("Churn rate"); ax.set_ylim(0, 60); bare(ax)
    fig.tight_layout(); fig.savefig(FIG / "tenure_curve.png", dpi=150); plt.close(fig)

    # 3. Risk deciles
    dec = (df.groupby("decile")["churn"].mean() * 100).sort_index(ascending=False)
    fig, ax = plt.subplots(figsize=(7, 4))
    cols = [RED if d >= 8 else BLUE for d in dec.index]
    ax.bar(dec.index.astype(str), dec.values, color=cols, width=0.7)
    ax.set_title("Model concentrates risk: top 3 deciles hold most churn", loc="left", fontweight="bold", pad=12)
    ax.set_xlabel("Risk decile (10 = highest)"); ax.set_ylabel("Actual churn rate"); bare(ax)
    fig.tight_layout(); fig.savefig(FIG / "risk_deciles.png", dpi=150); plt.close(fig)

    # 4. ROI waterfall
    target = df[df.decile >= 8]
    annual_value = target["MonthlyCharges"].mean() * 12
    saved = target["risk"].sum() * 0.30
    saved_rev = saved * annual_value
    cost = len(target) * 60
    net = saved_rev - cost
    fig, ax = plt.subplots(figsize=(7, 4))
    ax.bar("Saved\nrevenue", saved_rev, color=GREEN, width=0.6)
    ax.bar("Campaign\ncost", cost, bottom=net, color=RED, width=0.6)
    ax.bar("Net\nbenefit", net, color=BLUE, width=0.6)
    for x, val, base in [("Saved\nrevenue", saved_rev, 0), ("Campaign\ncost", cost, net), ("Net\nbenefit", net, 0)]:
        ax.text(x, base + val / 2, f"${val/1000:.0f}K", ha="center", color="white", fontweight="bold")
    ax.set_title(f"Retention play on top-30% risk: {net/cost:.1f}x ROI", loc="left", fontweight="bold", pad=12)
    ax.yaxis.set_major_formatter(FuncFormatter(lambda x, _: f"${x/1000:.0f}K"))
    ax.set_ylabel("Annual"); bare(ax)
    fig.tight_layout(); fig.savefig(FIG / "roi_waterfall.png", dpi=150); plt.close(fig)
    print("Wrote 4 figures to figures/")


if __name__ == "__main__":
    main()
