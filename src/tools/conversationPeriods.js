/** Local calendar helpers for conversation history grouping (week starts Monday). */

export function startOfLocalDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function startOfYesterday(now = new Date()) {
  const d = startOfLocalDay(now);
  d.setDate(d.getDate() - 1);
  return d;
}

/** Monday 00:00 local of the week containing `now`. */
export function startOfCurrentWeek(now = new Date()) {
  const d = startOfLocalDay(now);
  const day = d.getDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - daysSinceMonday);
  return d;
}

/**
 * Earliest date needed for the sidebar window.
 * On Monday, includes previous Sunday (Hier) via min(weekStart, yesterdayStart).
 */
export function getHistoryStartDate(now = new Date()) {
  const weekStart = startOfCurrentWeek(now);
  const yesterdayStart = startOfYesterday(now);
  return yesterdayStart < weekStart ? yesterdayStart : weekStart;
}

function parseActivityDate(item) {
  const raw = item?.lastActivityAt ?? item?.last_activity_at;
  if (raw == null || raw === "") return null;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function isSameLocalDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function activityTimestamp(item) {
  const date = parseActivityDate(item);
  return date ? date.getTime() : 0;
}

export function sortByLastActivityDesc(conversations) {
  return [...conversations].sort(
    (a, b) => activityTimestamp(b) - activityTimestamp(a),
  );
}

/**
 * Groups conversations for the sidebar. Older items are omitted.
 * @returns {{ today: object[], yesterday: object[], thisWeek: object[] }}
 */
export function groupConversationsByPeriod(conversations, now = new Date()) {
  const todayAnchor = startOfLocalDay(now);
  const yesterdayAnchor = startOfYesterday(now);
  const weekStart = startOfCurrentWeek(now);

  const today = [];
  const yesterday = [];
  const thisWeek = [];

  for (const item of conversations ?? []) {
    const activity = parseActivityDate(item);
    if (!activity) continue;

    if (isSameLocalDay(activity, todayAnchor)) {
      today.push(item);
      continue;
    }
    if (isSameLocalDay(activity, yesterdayAnchor)) {
      yesterday.push(item);
      continue;
    }
    if (activity >= weekStart) {
      thisWeek.push(item);
    }
  }

  return {
    today: sortByLastActivityDesc(today),
    yesterday: sortByLastActivityDesc(yesterday),
    thisWeek: sortByLastActivityDesc(thisWeek),
  };
}
