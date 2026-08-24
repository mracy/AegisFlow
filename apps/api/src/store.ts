import type { Mission } from './types.js';

const missions = new Map<string, Mission>();

export function createMission(objective: string): Mission {
  const id = `af-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const now = new Date().toISOString();
  const mission: Mission = {
    id,
    objective,
    status: 'created',
    createdAt: now,
    updatedAt: now,
  };
  missions.set(id, mission);
  return mission;
}

export function getMission(id: string): Mission | undefined {
  return missions.get(id);
}

export function updateMission(id: string, patch: Partial<Mission>): Mission | undefined {
  const mission = missions.get(id);
  if (!mission) return undefined;
  Object.assign(mission, patch, { updatedAt: new Date().toISOString() });
  missions.set(id, mission);
  return mission;
}

export function listMissions(): Mission[] {
  return Array.from(missions.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
