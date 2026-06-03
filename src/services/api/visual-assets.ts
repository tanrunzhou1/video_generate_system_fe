import type {
  GenerateVisualAssetPayload,
  VisualAsset,
  VisualAssetListResult,
} from '../types';
import { apiRequest } from './client';

export async function listVisualAssets(projectId: string, shotId: string) {
  const result = await apiRequest<VisualAssetListResult>(
    `/api/v1/projects/${projectId}/shots/${shotId}/visual-assets`,
    {
      method: 'GET',
    },
  );

  return result.items || [];
}

export async function generateVisualAsset(
  projectId: string,
  shotId: string,
  body: GenerateVisualAssetPayload,
) {
  return apiRequest<VisualAsset>(
    `/api/v1/projects/${projectId}/shots/${shotId}/visual-assets`,
    {
      data: body,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    },
  );
}
