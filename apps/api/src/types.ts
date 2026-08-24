export interface Mission {
  id: string;
  objective: string;
  status: 'created' | 'planning' | 'running' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowPlan {
  missionId: string;
  steps: string[];
}
