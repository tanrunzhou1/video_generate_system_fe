import type { TaskLog } from '../types';
import { apiRequest } from './client';

export async function getTaskLog(taskId: string) {
  return apiRequest<TaskLog>(`/api/v1/tasks/${taskId}/logs`, {
    method: 'GET',
  });
}
