import type { FastifyInstance } from 'fastify';

export interface WorkflowPreferences {
  remote?: boolean;
  minimum_fit_score?: number;
  roles?: string[];
}

export interface Workflow {
  id: string;
  goal: string;
  preferences: WorkflowPreferences;
  status: 'queued' | 'discovering' | 'analyzing' | 'generating' | 'quality_check' | 'awaiting_approval' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  workflowId: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  requirements: string[];
  niceToHave?: string[];
  remote: boolean;
  fitScore?: number;
  status: 'discovered' | 'qualified' | 'archived';
  source: string;
  discoveredAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  roles: string[];
  skills: string[];
  experienceLevel: string;
  preferences: WorkflowPreferences;
}

export interface Application {
  id: string;
  workflowId: string;
  jobId: string;
  candidateId: string;
  status: 'draft' | 'awaiting_approval' | 'applied' | 'interview' | 'offer' | 'rejected';
  fitScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  coverLetter: string;
  createdAt: string;
  updatedAt: string;
}

const workflows = new Map<string, Workflow>();
const jobs = new Map<string, Job>();
const candidates = new Map<string, Candidate>();
const applications = new Map<string, Application>();

function now(): string {
  return new Date().toISOString();
}

export function createWorkflow(goal: string, preferences: WorkflowPreferences = {}): Workflow {
  const id = `wf-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const workflow: Workflow = {
    id,
    goal,
    preferences,
    status: 'queued',
    createdAt: now(),
    updatedAt: now(),
  };
  workflows.set(id, workflow);
  return workflow;
}

export function getWorkflow(id: string): Workflow | undefined {
  return workflows.get(id);
}

export function updateWorkflow(id: string, patch: Partial<Workflow>): Workflow | undefined {
  const workflow = workflows.get(id);
  if (!workflow) return undefined;
  Object.assign(workflow, patch, { updatedAt: now() });
  workflows.set(id, workflow);
  return workflow;
}

export function listWorkflows(): Workflow[] {
  return Array.from(workflows.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createJob(workflowId: string, data: Omit<Job, 'id' | 'workflowId' | 'discoveredAt'>): Job {
  const id = `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const job: Job = {
    id,
    workflowId,
    discoveredAt: now(),
    ...data,
  };
  jobs.set(id, job);
  return job;
}

export function listJobs(workflowId?: string): Job[] {
  const all = Array.from(jobs.values()).sort((a, b) => b.discoveredAt.localeCompare(a.discoveredAt));
  return workflowId ? all.filter((j) => j.workflowId === workflowId) : all;
}

export function createCandidate(data: Omit<Candidate, 'id'>): Candidate {
  const id = `cand-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const candidate: Candidate = { id, ...data };
  candidates.set(id, candidate);
  return candidate;
}

export function listCandidates(): Candidate[] {
  return Array.from(candidates.values());
}

export function createApplication(data: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>): Application {
  const id = `app-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const application: Application = {
    id,
    ...data,
    createdAt: now(),
    updatedAt: now(),
  };
  applications.set(id, application);
  return application;
}

export function listApplications(workflowId?: string): Application[] {
  const all = Array.from(applications.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return workflowId ? all.filter((a) => a.workflowId === workflowId) : all;
}

export function registerApplyFlowRoutes(app: FastifyInstance) {
  app.addSchema({
    $id: 'Workflow',
    type: 'object',
    additionalProperties: true,
    properties: {
      id: { type: 'string' },
      goal: { type: 'string' },
      preferences: {
        type: 'object',
        additionalProperties: true,
        properties: {
          remote: { type: 'boolean' },
          minimum_fit_score: { type: 'number' },
          roles: { type: 'array', items: { type: 'string' } },
        },
      },
      status: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  });

  app.addSchema({
    $id: 'Job',
    type: 'object',
    additionalProperties: true,
    properties: {
      id: { type: 'string' },
      workflowId: { type: 'string' },
      title: { type: 'string' },
      company: { type: 'string' },
      location: { type: 'string' },
      salary: { type: 'string' },
      description: { type: 'string' },
      requirements: { type: 'array', items: { type: 'string' } },
      niceToHave: { type: 'array', items: { type: 'string' } },
      remote: { type: 'boolean' },
      fitScore: { type: 'number' },
      status: { type: 'string' },
      source: { type: 'string' },
      discoveredAt: { type: 'string' },
    },
  });

  app.addSchema({
    $id: 'Candidate',
    type: 'object',
    additionalProperties: true,
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      roles: { type: 'array', items: { type: 'string' } },
      skills: { type: 'array', items: { type: 'string' } },
      experienceLevel: { type: 'string' },
      preferences: { $ref: 'Workflow#/properties/preferences' },
    },
  });

  app.addSchema({
    $id: 'Application',
    type: 'object',
    additionalProperties: true,
    properties: {
      id: { type: 'string' },
      workflowId: { type: 'string' },
      jobId: { type: 'string' },
      candidateId: { type: 'string' },
      status: { type: 'string' },
      fitScore: { type: 'number' },
      matchedSkills: { type: 'array', items: { type: 'string' } },
      missingSkills: { type: 'array', items: { type: 'string' } },
      coverLetter: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  });

  app.post<{ Body: { goal: string; preferences?: WorkflowPreferences } }>('/workflows', {
    schema: {
      description: 'Create a new job-search workflow',
      tags: ['Workflows'],
      body: {
        type: 'object',
        additionalProperties: true,
        required: ['goal'],
        properties: {
          goal: { type: 'string' },
          preferences: {
            type: 'object',
            additionalProperties: true,
            properties: {
              remote: { type: 'boolean' },
              minimum_fit_score: { type: 'number' },
              roles: { type: 'array', items: { type: 'string' } },
            },
          },
        },
        examples: [
          {
            goal: 'Find strong software engineering jobs',
            preferences: { remote: true, minimum_fit_score: 75, roles: ['Software Engineer', 'Backend Engineer', 'AI Engineer'] },
          },
        ],
      },
      response: {
        400: { type: 'object', additionalProperties: true, properties: { error: { type: 'string' } } },
        404: { type: 'object', additionalProperties: true, properties: { error: { type: 'string' } } },
        200: {
          description: 'Workflow created and discovery started',
          type: 'object',
          additionalProperties: true,
          properties: {
            workflow: { $ref: 'Workflow#' },
          },
          examples: [
            {
              workflow: {
                id: 'wf-1787417381390-873',
                goal: 'Find strong software engineering jobs',
                preferences: { remote: true, minimum_fit_score: 75, roles: ['Software Engineer', 'Backend Engineer', 'AI Engineer'] },
                status: 'discovering',
                createdAt: '2026-08-22T16:49:41.390Z',
                updatedAt: '2026-08-22T16:49:41.390Z',
              },
            },
          ],
        },
      },
    },
  }, async (request, reply) => {
    const { goal, preferences = {} } = request.body || {};
    if (!goal || typeof goal !== 'string') {
      return reply.status(400).send({ error: 'goal is required' });
    }
    const workflow = createWorkflow(goal, preferences);
    // In a real implementation this would publish to Pub/Sub and invoke the Discovery Agent.
    updateWorkflow(workflow.id, { status: 'discovering' });
    return { workflow };
  });

  app.get('/workflows', {
    schema: {
      description: 'List all workflows',
      tags: ['Workflows'],
      response: {
        400: { type: 'object', additionalProperties: true, properties: { error: { type: 'string' } } },
        404: { type: 'object', additionalProperties: true, properties: { error: { type: 'string' } } },
        200: {
          type: 'object',
          additionalProperties: true,
          properties: {
            workflows: { type: 'array', items: { $ref: 'Workflow#' } },
          },
        },
      },
    },
  }, async () => ({ workflows: listWorkflows() }));

  app.get('/workflows/:id', {
    schema: {
      description: 'Get a workflow by ID with related jobs and applications',
      tags: ['Workflows'],
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string' } },
      },
      response: {
        400: { type: 'object', additionalProperties: true, properties: { error: { type: 'string' } } },
        404: { type: 'object', additionalProperties: true, properties: { error: { type: 'string' } } },
        200: {
          type: 'object',
          additionalProperties: true,
          properties: {
            workflow: { $ref: 'Workflow#' },
            jobs: { type: 'array', items: { $ref: 'Job#' } },
            applications: { type: 'array', items: { $ref: 'Application#' } },
          },
        },
      },
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const workflow = getWorkflow(id);
    if (!workflow) {
      return reply.status(404).send({ error: 'workflow not found' });
    }
    return { workflow, jobs: listJobs(id), applications: listApplications(id) };
  });

  app.post<{ Body: Partial<Job> }>('/jobs', {
    schema: {
      description: 'Add a discovered job to a workflow',
      tags: ['Jobs'],
      body: {
        type: 'object',
        additionalProperties: true,
        required: ['workflowId', 'title', 'company'],
        properties: {
          workflowId: { type: 'string' },
          title: { type: 'string' },
          company: { type: 'string' },
          location: { type: 'string' },
          salary: { type: 'string' },
          description: { type: 'string' },
          requirements: { type: 'array', items: { type: 'string' } },
          niceToHave: { type: 'array', items: { type: 'string' } },
          remote: { type: 'boolean' },
          fitScore: { type: 'number' },
          status: { type: 'string' },
          source: { type: 'string' },
        },
        examples: [
          {
            workflowId: 'wf-1787417381390-873',
            title: 'Senior Software Engineer',
            company: 'Company XYZ',
            location: 'Remote',
            description: 'Build AI systems',
            requirements: ['Python', 'FastAPI', 'PostgreSQL'],
            niceToHave: ['Kubernetes'],
            remote: true,
            source: 'stub',
          },
        ],
      },
      response: {
        400: { type: 'object', additionalProperties: true, properties: { error: { type: 'string' } } },
        404: { type: 'object', additionalProperties: true, properties: { error: { type: 'string' } } },
        200: {
          type: 'object',
          additionalProperties: true,
          properties: {
            job: { $ref: 'Job#' },
          },
          examples: [
            {
              job: {
                id: 'job-1787417381397-417',
                workflowId: 'wf-1787417381390-873',
                title: 'Senior Software Engineer',
                company: 'Company XYZ',
                location: 'Remote',
                description: 'Build AI systems',
                requirements: ['Python', 'FastAPI', 'PostgreSQL'],
                niceToHave: ['Kubernetes'],
                remote: true,
                fitScore: 87,
                status: 'discovered',
                source: 'stub',
                discoveredAt: '2026-08-22T16:49:41.398Z',
              },
            },
          ],
        },
      },
    },
  }, async (request, reply) => {
    const body = request.body || {};
    if (!body.workflowId || !body.title || !body.company) {
      return reply.status(400).send({ error: 'workflowId, title, and company are required' });
    }
    const job = createJob(body.workflowId as string, body as Omit<Job, 'id' | 'workflowId' | 'discoveredAt'>);
    return { job };
  });

  app.get('/jobs', {
    schema: {
      description: 'List jobs, optionally filtered by workflowId',
      tags: ['Jobs'],
      querystring: {
        type: 'object',
        additionalProperties: true,
        properties: { workflowId: { type: 'string' } },
      },
      response: {
        400: { type: 'object', additionalProperties: true, properties: { error: { type: 'string' } } },
        404: { type: 'object', additionalProperties: true, properties: { error: { type: 'string' } } },
        200: {
          type: 'object',
          additionalProperties: true,
          properties: {
            jobs: { type: 'array', items: { $ref: 'Job#' } },
          },
        },
      },
    },
  }, async (request) => {
    const { workflowId } = request.query as { workflowId?: string };
    return { jobs: listJobs(workflowId) };
  });

  app.post<{ Body: Omit<Candidate, 'id'> }>('/candidates', {
    schema: {
      description: 'Create a candidate profile',
      tags: ['Candidates'],
      body: {
        type: 'object',
        additionalProperties: true,
        required: ['name'],
        properties: {
          name: { type: 'string' },
          roles: { type: 'array', items: { type: 'string' } },
          skills: { type: 'array', items: { type: 'string' } },
          experienceLevel: { type: 'string' },
          preferences: {
            type: 'object',
            additionalProperties: true,
            properties: {
              remote: { type: 'boolean' },
              minimum_fit_score: { type: 'number' },
              roles: { type: 'array', items: { type: 'string' } },
            },
          },
        },
        examples: [
          {
            name: 'Jane Doe',
            roles: ['Software Engineer', 'Backend Engineer', 'AI Engineer'],
            skills: ['Python', 'TypeScript', 'FastAPI', 'React', 'AI Agents'],
            experienceLevel: 'mid-level',
            preferences: { remote: true, minimum_fit_score: 75 },
          },
        ],
      },
      response: {
        400: { type: 'object', additionalProperties: true, properties: { error: { type: 'string' } } },
        404: { type: 'object', additionalProperties: true, properties: { error: { type: 'string' } } },
        200: {
          type: 'object',
          additionalProperties: true,
          properties: {
            candidate: { $ref: 'Candidate#' },
          },
          examples: [
            {
              candidate: {
                id: 'cand-1787417381400-123',
                name: 'Jane Doe',
                roles: ['Software Engineer', 'Backend Engineer', 'AI Engineer'],
                skills: ['Python', 'TypeScript', 'FastAPI', 'React', 'AI Agents'],
                experienceLevel: 'mid-level',
                preferences: { remote: true, minimum_fit_score: 75 },
              },
            },
          ],
        },
      },
    },
  }, async (request, reply) => {
    const body = request.body || {};
    if (!body.name) {
      return reply.status(400).send({ error: 'name is required' });
    }
    return { candidate: createCandidate(body as Omit<Candidate, 'id'>) };
  });

  app.get('/candidates', {
    schema: {
      description: 'List all candidates',
      tags: ['Candidates'],
      response: {
        400: { type: 'object', additionalProperties: true, properties: { error: { type: 'string' } } },
        404: { type: 'object', additionalProperties: true, properties: { error: { type: 'string' } } },
        200: {
          type: 'object',
          additionalProperties: true,
          properties: {
            candidates: { type: 'array', items: { $ref: 'Candidate#' } },
          },
        },
      },
    },
  }, async () => ({ candidates: listCandidates() }));

  app.post<{ Body: Omit<Application, 'id' | 'createdAt' | 'updatedAt'> }>('/applications', {
    schema: {
      description: 'Create a job application draft',
      tags: ['Applications'],
      body: {
        type: 'object',
        additionalProperties: true,
        required: ['workflowId', 'jobId', 'candidateId'],
        properties: {
          workflowId: { type: 'string' },
          jobId: { type: 'string' },
          candidateId: { type: 'string' },
          status: { type: 'string' },
          fitScore: { type: 'number' },
          matchedSkills: { type: 'array', items: { type: 'string' } },
          missingSkills: { type: 'array', items: { type: 'string' } },
          coverLetter: { type: 'string' },
        },
        examples: [
          {
            workflowId: 'wf-1787417381390-873',
            jobId: 'job-1787417381397-417',
            candidateId: 'cand-1787417381400-123',
            status: 'awaiting_approval',
            fitScore: 91,
            matchedSkills: ['Python', 'FastAPI', 'React'],
            missingSkills: ['Kubernetes'],
            coverLetter: 'I am excited about this opportunity...',
          },
        ],
      },
      response: {
        400: { type: 'object', additionalProperties: true, properties: { error: { type: 'string' } } },
        404: { type: 'object', additionalProperties: true, properties: { error: { type: 'string' } } },
        200: {
          type: 'object',
          additionalProperties: true,
          properties: {
            application: { $ref: 'Application#' },
          },
          examples: [
            {
              application: {
                id: 'app-1787417381405-456',
                workflowId: 'wf-1787417381390-873',
                jobId: 'job-1787417381397-417',
                candidateId: 'cand-1787417381400-123',
                status: 'awaiting_approval',
                fitScore: 91,
                matchedSkills: ['Python', 'FastAPI', 'React'],
                missingSkills: ['Kubernetes'],
                coverLetter: 'I am excited about this opportunity...',
                createdAt: '2026-08-22T16:49:41.405Z',
                updatedAt: '2026-08-22T16:49:41.405Z',
              },
            },
          ],
        },
      },
    },
  }, async (request, reply) => {
    const body = request.body || {};
    if (!body.workflowId || !body.jobId || !body.candidateId) {
      return reply.status(400).send({ error: 'workflowId, jobId, and candidateId are required' });
    }
    const application = createApplication(body as Omit<Application, 'id' | 'createdAt' | 'updatedAt'>);
    return { application };
  });

  app.get('/applications', {
    schema: {
      description: 'List applications, optionally filtered by workflowId',
      tags: ['Applications'],
      querystring: {
        type: 'object',
        additionalProperties: true,
        properties: { workflowId: { type: 'string' } },
      },
      response: {
        400: { type: 'object', additionalProperties: true, properties: { error: { type: 'string' } } },
        404: { type: 'object', additionalProperties: true, properties: { error: { type: 'string' } } },
        200: {
          type: 'object',
          additionalProperties: true,
          properties: {
            applications: { type: 'array', items: { $ref: 'Application#' } },
          },
        },
      },
    },
  }, async (request) => {
    const { workflowId } = request.query as { workflowId?: string };
    return { applications: listApplications(workflowId) };
  });
}
