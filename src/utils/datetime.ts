const beijingDateTimeFormatter = new Intl.DateTimeFormat('zh-CN', {
  day: '2-digit',
  hour: '2-digit',
  hour12: false,
  minute: '2-digit',
  month: '2-digit',
  second: '2-digit',
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
});

export const formatBeijingDateTime = (value?: string | null) => {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const parts = beijingDateTimeFormatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value || '';

  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get(
    'minute',
  )}:${get('second')}`;
};
