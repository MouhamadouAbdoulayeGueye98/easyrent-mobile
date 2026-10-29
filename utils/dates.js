export const RECENT_DAYS = 7;

// Vrai si la date est dans les `days` derniers jours.
export function isRecent(date, days = RECENT_DAYS) {
  if (!date) return false;

  const createdAt = new Date(date).getTime();

  if (Number.isNaN(createdAt)) return false;

  return Date.now() - createdAt <= days * 24 * 60 * 60 * 1000;
}
