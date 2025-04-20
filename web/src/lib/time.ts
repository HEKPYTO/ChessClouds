export function getLastTime(createdat: Date | null): string {
  if (!createdat) return 'recently';

  const now = new Date();
  const moveTime = new Date(createdat);
  const diffMs = now.getTime() - moveTime.getTime();

  const diffMins = Math.round(diffMs / 60000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
