from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import identity, verification, documents, coverage, auth, dashboard, feed

app = FastAPI(title="Touchstone Backend", description="Independent verification and compliance API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(identity.router)
app.include_router(verification.router)
app.include_router(documents.router)
app.include_router(coverage.router)
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(feed.router)

@app.get("/")
def root():
    return {"status": "API is running"}
