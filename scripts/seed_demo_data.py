#!/usr/bin/env python3
"""Seed AegisFlow with demo workflow, candidate, jobs, and application data."""

import json
import urllib.request
import urllib.error

BASE_URL = "http://localhost:3001"


def post(path, payload):
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        f"{BASE_URL}{path}",
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=5) as resp:
        return json.loads(resp.read().decode())


def main():
    print("Seeding AegisFlow with demo data...")

    workflow = post(
        "/workflows",
        {
            "goal": "Find strong software engineering jobs",
            "preferences": {
                "remote": True,
                "minimum_fit_score": 75,
                "roles": ["Software Engineer", "Backend Engineer", "AI Engineer"],
            },
        },
    )
    workflow_id = workflow["workflow"]["id"]
    print("Created workflow:", workflow_id)

    candidate = post(
        "/candidates",
        {
            "name": "Jane Doe",
            "roles": ["Software Engineer", "Backend Engineer", "AI Engineer"],
            "skills": ["Python", "TypeScript", "FastAPI", "React", "AI Agents"],
            "experienceLevel": "mid-level",
            "preferences": {"remote": True, "minimum_fit_score": 75},
        },
    )
    candidate_id = candidate["candidate"]["id"]
    print("Created candidate:", candidate_id)

    job1 = post(
        "/jobs",
        {
            "workflowId": workflow_id,
            "title": "Senior Software Engineer",
            "company": "Company XYZ",
            "location": "Remote",
            "salary": "$150k - $200k",
            "description": "Build AI-powered agentic systems.",
            "requirements": ["Python", "FastAPI", "PostgreSQL"],
            "niceToHave": ["Kubernetes", "LLMs"],
            "remote": True,
            "fitScore": 87,
            "status": "qualified",
            "source": "stub",
        },
    )
    job1_id = job1["job"]["id"]
    print("Created job 1:", job1_id)

    job2 = post(
        "/jobs",
        {
            "workflowId": workflow_id,
            "title": "Backend Engineer",
            "company": "Acme Corp",
            "location": "Remote",
            "salary": "$120k - $160k",
            "description": "Scale distributed backend services.",
            "requirements": ["Python", "TypeScript", "AI Agents"],
            "niceToHave": ["React"],
            "remote": True,
            "fitScore": 91,
            "status": "qualified",
            "source": "stub",
        },
    )
    job2_id = job2["job"]["id"]
    print("Created job 2:", job2_id)

    application = post(
        "/applications",
        {
            "workflowId": workflow_id,
            "jobId": job1_id,
            "candidateId": candidate_id,
            "status": "awaiting_approval",
            "fitScore": 87,
            "matchedSkills": ["Python", "FastAPI", "React"],
            "missingSkills": ["Kubernetes"],
            "coverLetter": "I am excited about this opportunity because it aligns with my experience in Python and AI systems.",
        },
    )
    print("Created application:", application["application"]["id"])

    print("\nSeed complete. API now has demo workflow, candidate, jobs, and application.")
    print(f"Visit http://localhost:3001/documentation for the Swagger UI.")


if __name__ == "__main__":
    try:
        main()
    except urllib.error.HTTPError as e:
        print("HTTP error:", e.code, e.read().decode())
        raise
