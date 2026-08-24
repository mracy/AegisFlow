import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { createMission, getMission, listMissions } from './store.js';
import { registerApplyFlowRoutes } from './applyflow.js';

const app = Fastify({ logger: true });

await app.register(swagger, {
  openapi: {
    info: {
      title: 'AegisFlow API',
      description: 'Autonomous Work Execution Network — merged with ApplyFlow job application domain',
      version: '0.1.0',
    },
    tags: [
      { name: 'Health', description: 'Health check' },
      { name: 'Missions', description: 'Generic missions' },
      { name: 'Workflows', description: 'ApplyFlow job-search workflows' },
      { name: 'Jobs', description: 'Discovered jobs' },
      { name: 'Candidates', description: 'Candidate profiles' },
      { name: 'Applications', description: 'Job applications' },
    ],
  },
});

await app.register(swaggerUi, {
  routePrefix: '/documentation',
});

app.addHook('onRequest', async (request, reply) => {
  reply.header('Access-Control-Allow-Origin', '*');
  reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  reply.header('Access-Control-Allow-Headers', 'Content-Type');
  if (request.method === 'OPTIONS') {
    return reply.send();
  }
});

app.get('/health', { schema: { tags: ['Health'], description: 'Service health check' } }, async () => ({
  status: 'ok',
}));

app.post<{ Body: { objective: string } }>('/missions', {
  schema: {
    tags: ['Missions'],
    description: 'Create a generic AegisFlow mission',
    body: {
      type: 'object',
      additionalProperties: true,
      required: ['objective'],
      properties: {
        objective: { type: 'string' },
      },
      examples: [{ objective: 'Prepare me for a software engineering interview' }],
    },
    response: {
      400: { type: 'object', additionalProperties: true, properties: { error: { type: 'string' } } },
      404: { type: 'object', additionalProperties: true, properties: { error: { type: 'string' } } },
      200: {
        type: 'object',
        additionalProperties: true,
        properties: {
          mission: {
            type: 'object',
            additionalProperties: true,
            properties: {
              id: { type: 'string' },
              objective: { type: 'string' },
              status: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
        },
        examples: [
          {
            mission: {
              id: 'af-1787416120120-521',
              objective: 'Test docker mission',
              status: 'planning',
              createdAt: '2026-08-22T16:28:40.120Z',
              updatedAt: '2026-08-22T16:28:40.121Z',
            },
          },
        ],
      },
    },
  },
}, async (request, reply) => {
  const { objective } = request.body || {};
  if (!objective || typeof objective !== 'string') {
    return reply.status(400).send({ error: 'objective is required' });
  }
  const mission = createMission(objective);
  return { mission };
});

app.get('/missions', { schema: { tags: ['Missions'], description: 'List generic missions' } }, async () => ({
  missions: listMissions(),
}));

app.get('/missions/:id', { schema: { tags: ['Missions'], description: 'Get a mission by ID' } }, async (request, reply) => {
  const { id } = request.params as { id: string };
  const mission = getMission(id);
  if (!mission) {
    return reply.status(404).send({ error: 'mission not found' });
  }
  return { mission };
});

registerApplyFlowRoutes(app);

const start = async () => {
  try {
    await app.listen({ port: 3001, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
