import json
import sys


def plan_workflow(goal: str, preferences: dict):
    """Stub workflow planner for the ApplyFlow/AegisFlow orchestrator.

    In production this will delegate to Google ADK specialist agents and
    return a real workflow plan.
    """
    steps = [
        "Upload and parse resume",
        "Discover job opportunities",
        "Extract structured job requirements",
        "Analyze candidate/job fit",
        "Generate tailored application materials",
        "Quality check",
        "Create draft for approval",
        "Track application state",
    ]
    return {"goal": goal, "preferences": preferences, "steps": steps}


def discover_jobs(goal: str):
    """Stub Discovery Agent."""
    return [
        {
            "id": "job-1",
            "title": "Senior Software Engineer",
            "company": "Company XYZ",
            "location": "Remote",
            "remote": True,
            "requirements": ["Python", "FastAPI", "PostgreSQL"],
            "nice_to_have": ["Kubernetes"],
            "source": "stub",
        },
        {
            "id": "job-2",
            "title": "Backend Engineer",
            "company": "Acme Corp",
            "location": "Remote",
            "remote": True,
            "requirements": ["Python", "TypeScript", "AI Agents"],
            "nice_to_have": ["React"],
            "source": "stub",
        },
    ]


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "discover":
        goal = sys.argv[2] if len(sys.argv) > 2 else "Find software engineering jobs"
        print(json.dumps(discover_jobs(goal)))
    else:
        goal = sys.argv[1] if len(sys.argv) > 1 else "Find software engineering jobs"
        prefs = json.loads(sys.argv[2]) if len(sys.argv) > 2 else {}
        print(json.dumps(plan_workflow(goal, prefs)))
