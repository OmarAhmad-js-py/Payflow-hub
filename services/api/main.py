from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Literal
from datetime import datetime, timedelta
import random

app = FastAPI()

class Application(BaseModel):
    id: str
    createdAt: str
    applicantName: str
    country: str
    amount: float
    status: Literal["PENDING", "APPROVED", "REJECTED", "REVIEW"]
    riskScore: int

class ListApplicationsResponse(BaseModel):
    items: List[Application]
    total: int
    page: int
    pageSize: int

@app.get("/applications", response_model=ListApplicationsResponse)
def list_applications(page: int = 1, pageSize: int = 20):
    total = 120
    items = []
    for i in range(pageSize):
        idx = (page - 1) * pageSize + i + 1
        if idx > total:
            break
        risk = random.randint(5, 95)
        status = "PENDING" if risk < 70 else "REVIEW"
        items.append(Application(
            id=f"app_{idx}",
            createdAt=datetime.utcnow().isoformat(),
            applicantName=f"Applicant {idx}",
            country=random.choice(["SE","NO","FI","DK","DE","UK"]),
            amount=float(random.choice([5000, 12000, 25000, 50000, 80000])),
            status=status,
            riskScore=risk
        ))
    return ListApplicationsResponse(items=items, total=total, page=page, pageSize=pageSize)

class Insight(BaseModel):
    type: str
    severity: Literal["LOW","MEDIUM","HIGH"]
    message: str

class Recommendation(BaseModel):
    title: str
    details: str

class InsightsResponse(BaseModel):
    windowDays: int
    anomalies: List[Insight]
    recommendations: List[Recommendation]

@app.get("/insights", response_model=InsightsResponse)
def insights(windowDays: int = 14):
    anomalies = [
        Insight(type="RISK_CLUSTER", severity="HIGH", message="Unusual concentration of high-risk applications in the last 48h."),
        Insight(type="VOLUME_SPIKE", severity="MEDIUM", message="Application volume increased 32% compared to the previous window."),
    ]
    recs = [
        Recommendation(title="Tighten review threshold", details="Temporarily route riskScore >= 65 to REVIEW for manual verification."),
        Recommendation(title="Add partner callback monitoring", details="Track webhook delays and alert when latency exceeds 5 minutes."),
    ]
    return InsightsResponse(windowDays=windowDays, anomalies=anomalies, recommendations=recs)
