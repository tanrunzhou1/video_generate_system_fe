import type {
  CharacterListResult,
  CharacterProfile,
  CreateCharacterPayload,
} from '../types';
import { apiRequest } from './client';

export async function listCharacters(projectId: string) {
  const result = await apiRequest<CharacterListResult>(
    `/api/v1/projects/${projectId}/characters`,
    {
      method: 'GET',
    },
  );

  return result.items || [];
}

export async function createCharacter(
  projectId: string,
  body: CreateCharacterPayload,
) {
  return apiRequest<CharacterProfile>(
    `/api/v1/projects/${projectId}/characters`,
    {
      data: body,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    },
  );
}

export async function getCharacter(projectId: string, characterId: string) {
  return apiRequest<CharacterProfile>(
    `/api/v1/projects/${projectId}/characters/${characterId}`,
    {
      method: 'GET',
    },
  );
}
