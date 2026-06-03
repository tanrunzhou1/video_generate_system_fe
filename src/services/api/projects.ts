import type {
  CreateProjectPayload,
  ParseScriptResult,
  Project,
  ProjectListResponse,
  ProjectStatus,
  UploadProjectAssetsResult,
} from '../types';
import { apiRequest } from './client';

export async function listProjects(params?: {
  page?: number;
  page_size?: number;
}) {
  return apiRequest<ProjectListResponse>('/api/v1/projects', {
    method: 'GET',
    params,
  });
}

export async function createProject(body: CreateProjectPayload) {
  return apiRequest<Project>('/api/v1/projects', {
    data: body,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  });
}

export async function getProject(projectId: string) {
  return apiRequest<Project>(`/api/v1/projects/${projectId}`, {
    method: 'GET',
  });
}

export async function getProjectStatus(projectId: string) {
  return apiRequest<ProjectStatus>(`/api/v1/projects/${projectId}/status`, {
    method: 'GET',
  });
}

export async function parseProjectScript(projectId: string) {
  return apiRequest<ParseScriptResult>(
    `/api/v1/projects/${projectId}/parse-script`,
    {
      method: 'POST',
    },
  );
}

export async function uploadProjectAsset(projectId: string, payload: FormData) {
  return apiRequest<UploadProjectAssetsResult>(
    `/api/v1/projects/${projectId}/assets`,
    {
      data: payload,
      method: 'POST',
      requestType: 'form',
    },
  );
}
