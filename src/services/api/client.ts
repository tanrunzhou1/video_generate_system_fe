import { request } from '@umijs/max';
import type { ApiEnvelope } from '../types';

const HTTP_URL_PATTERN = /^https?:\/\//i;
const API_ORIGIN = 'http://localhost:8000';

const isWrappedResponse = (input: unknown): input is ApiEnvelope<unknown> => {
  if (!input || typeof input !== 'object') {
    return false;
  }

  return (
    'code' in input ||
    'data' in input ||
    'message' in input ||
    'detail' in input ||
    'success' in input
  );
};

export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return '请求失败，请稍后重试';
};

export const resolveAssetUrl = (filePath?: string) => {
  if (!filePath) {
    return '';
  }

  if (HTTP_URL_PATTERN.test(filePath)) {
    return filePath;
  }

  if (filePath.startsWith('/')) {
    return `${API_ORIGIN}${filePath}`;
  }

  return `${API_ORIGIN}/${filePath}`;
};

export async function apiRequest<T>(
  url: string,
  options?: Record<string, any>,
): Promise<T> {
  const response = await request<unknown>(url, options);

  if (!isWrappedResponse(response)) {
    return response as T;
  }

  if (response.code !== undefined && response.code !== 0) {
    throw new Error(response.detail || response.message || '请求失败');
  }

  if (response.success === false) {
    throw new Error(
      response.detail ||
        response.errorMessage ||
        response.message ||
        '请求失败',
    );
  }

  if ('data' in response && response.data !== undefined) {
    return response.data as T;
  }

  return response as T;
}
