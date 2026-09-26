from fastapi import APIRouter
import json
from pathlib import Path
from app.routers.verification import STORED_RESULTS

router = APIRouter(prefix="/coverage", tags=["Coverage Map"])

with open(Path(__file__).parent.parent / "data" / "clusters.json") as f:
    CLUSTERS = json.load(f)

@router.get("/clusters")
def get_cluster_stats():
    # Dynamically compute stats based on STORED_RESULTS
    stats = []
    for c in CLUSTERS:
        active = sum(1 for r in STORED_RESULTS if r.request.cluster == c["name"] and r.outcome_category == "discrepancy_flagged")
        verified = sum(1 for r in STORED_RESULTS if r.request.cluster == c["name"] and r.outcome_category == "verified_clean")
        c_copy = c.copy()
        c_copy["active_cases_count"] = active
        c_copy["verified_companies_count"] = verified
        stats.append(c_copy)
    return stats
