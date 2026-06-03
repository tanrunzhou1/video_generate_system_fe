import { history } from '@umijs/max';
import { message } from 'antd';

export const parseNumericRouteParam = (
  value: string | undefined,
  label: string,
) => {
  if (!value || !/^\d+$/.test(value)) {
    message.error(`${label} 必须是数字 ID`);
    return null;
  }

  return value;
};

export const guardNumericRouteParams = (
  entries: Array<[string | undefined, string]>,
  fallbackPath: string,
) => {
  const normalized: string[] = [];

  for (const [value, label] of entries) {
    const parsed = parseNumericRouteParam(value, label);
    if (!parsed) {
      history.replace(fallbackPath);
      return null;
    }
    normalized.push(parsed);
  }

  return normalized;
};
