'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type Entity = 'missions' | 'workflows' | 'jobs' | 'candidates' | 'applications';

interface EntityConfig {
  label: string;
  singular: string;
  createPath: string;
  listPath: string;
  example: string;
}

const CONFIG: Record<Entity, EntityConfig> = {
  missions: {
    label: 'Missions',
    singular: 'Mission',
    createPath: '/missions',
    listPath: '/missions',
    example: JSON.stringify({
      objective: 'Prepare me for a software engineering interview',
    }, null, 2),
  },
  workflows: {
    label: 'Workflows',
    singular: 'Workflow',
    createPath: '/workflows',
    listPath: '/workflows',
    example: JSON.stringify({
      goal: 'Find strong software engineering jobs',
      preferences: {
        remote: true,
        minimum_fit_score: 75,
        roles: ['Software Engineer', 'Backend Engineer', 'AI Engineer'],
      },
    }, null, 2),
  },
  jobs: {
    label: 'Jobs',
    singular: 'Job',
    createPath: '/jobs',
    listPath: '/jobs',
    example: JSON.stringify({
      workflowId: 'WORKFLOW_ID',
      title: 'Senior Software Engineer',
      company: 'Company XYZ',
      location: 'Remote',
      salary: '$150k - $200k',
      description: 'Build AI systems.',
      requirements: ['Python', 'FastAPI', 'PostgreSQL'],
      niceToHave: ['Kubernetes'],
      remote: true,
      source: 'manual',
    }, null, 2),
  },
  candidates: {
    label: 'Candidates',
    singular: 'Candidate',
    createPath: '/candidates',
    listPath: '/candidates',
    example: JSON.stringify({
      name: 'Jane Doe',
      roles: ['Software Engineer', 'Backend Engineer', 'AI Engineer'],
      skills: ['Python', 'TypeScript', 'FastAPI', 'React', 'AI Agents'],
      experienceLevel: 'mid-level',
      preferences: { remote: true, minimum_fit_score: 75 },
    }, null, 2),
  },
  applications: {
    label: 'Applications',
    singular: 'Application',
    createPath: '/applications',
    listPath: '/applications',
    example: JSON.stringify({
      workflowId: 'WORKFLOW_ID',
      jobId: 'JOB_ID',
      candidateId: 'CANDIDATE_ID',
      status: 'awaiting_approval',
      fitScore: 87,
      matchedSkills: ['Python', 'FastAPI', 'React'],
      missingSkills: ['Kubernetes'],
      coverLetter: 'I am excited about this opportunity.',
    }, null, 2),
  },
};

export default function ApiConsole() {
  const [tab, setTab] = useState<Entity>('workflows');
  const [items, setItems] = useState<unknown[]>([]);
  const [input, setInput] = useState(CONFIG.workflows.example);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    setInput(CONFIG[tab].example);
    setError('');

    const load = async () => {
      try {
        const res = await fetch(`${API_URL}${CONFIG[tab].listPath}`);
        if (!res.ok) throw new Error(await res.text());
        const data = (await res.json()) as Record<string, unknown[]>;
        setItems(data[tab] ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    load();
  }, [tab, refresh]);

  const create = async () => {
    setError('');
    try {
      const body = JSON.parse(input);
      const res = await fetch(`${API_URL}${CONFIG[tab].createPath}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      setRefresh((r) => r + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <main style={{ padding: '2rem' }}>
      <h1>AegisFlow API Console</h1>
      <p>Use the tabs below to create and list Missions, Workflows, Jobs, Candidates, and Applications.</p>

      <div style={{ display: 'flex', gap: '0.5rem', margin: '1.5rem 0', flexWrap: 'wrap' }}>
        {(Object.keys(CONFIG) as Entity[]).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              padding: '0.5rem 1rem',
              fontWeight: tab === key ? 'bold' : 'normal',
              background: tab === key ? '#222' : '#eee',
              color: tab === key ? '#fff' : '#000',
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}
          >
            {CONFIG[key].label}
          </button>
        ))}
      </div>

      <h2>Create {CONFIG[tab].singular}</h2>
      <p style={{ fontSize: '0.9rem', color: '#555' }}>
        Edit the JSON and click Create. Replace WORKFLOW_ID, JOB_ID, or CANDIDATE_ID with real IDs from the list below.
      </p>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={10}
        style={{ width: '100%', maxWidth: 600, padding: '0.5rem', fontFamily: 'monospace' }}
      />
      <br />
      <button onClick={create} style={{ marginTop: '0.5rem', padding: '0.5rem 1rem' }}>
        Create {CONFIG[tab].singular}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2 style={{ marginTop: '2rem' }}>{CONFIG[tab].label}</h2>
      <pre
        style={{
          background: '#f4f4f4',
          padding: '1rem',
          maxHeight: 400,
          overflow: 'auto',
          border: '1px solid #ddd',
        }}
      >
        {JSON.stringify(items, null, 2)}
      </pre>
    </main>
  );
}
