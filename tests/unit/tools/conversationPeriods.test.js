import { describe, expect, it } from "vitest";
import {
  getHistoryStartDate,
  groupConversationsByPeriod,
  startOfCurrentMonth,
  startOfCurrentWeek,
  startOfLocalDay,
  startOfYesterday,
} from "@/tools/conversationPeriods.js";

function isoAtLocal(year, monthIndex, day, hour = 12, minute = 0) {
  return new Date(year, monthIndex, day, hour, minute, 0, 0).toISOString();
}

function conversation(id, lastActivityAt, extras = {}) {
  return {
    id,
    sessionId: id,
    title: extras.title ?? `Conversation ${id}`,
    lastActivityAt,
    ...extras,
  };
}

describe("conversationPeriods", () => {
  // Fixed Wednesday 2026-08-05 local noon
  const wednesday = new Date(2026, 7, 5, 12, 0, 0, 0);

  it("places a conversation from today in today", () => {
    const items = [
      conversation("t1", isoAtLocal(2026, 7, 5, 10)),
    ];
    const groups = groupConversationsByPeriod(items, wednesday);
    expect(groups.today.map((c) => c.id)).toEqual(["t1"]);
    expect(groups.yesterday).toEqual([]);
    expect(groups.thisWeek).toEqual([]);
    expect(groups.thisMonth).toEqual([]);
  });

  it("places a conversation from yesterday in yesterday", () => {
    const items = [
      conversation("y1", isoAtLocal(2026, 7, 4, 18)),
    ];
    const groups = groupConversationsByPeriod(items, wednesday);
    expect(groups.yesterday.map((c) => c.id)).toEqual(["y1"]);
    expect(groups.today).toEqual([]);
  });

  it("places an earlier weekday conversation in thisWeek", () => {
    const items = [
      conversation("w1", isoAtLocal(2026, 7, 3, 9)), // Monday of same week
    ];
    const groups = groupConversationsByPeriod(items, wednesday);
    expect(groups.thisWeek.map((c) => c.id)).toEqual(["w1"]);
    expect(groups.today).toEqual([]);
    expect(groups.yesterday).toEqual([]);
    expect(groups.thisMonth).toEqual([]);
  });

  it("places an earlier month conversation in thisMonth", () => {
    const items = [
      conversation("m1", isoAtLocal(2026, 7, 1, 12)), // Saturday Aug 1, before week
    ];
    const groups = groupConversationsByPeriod(items, wednesday);
    expect(groups.thisMonth.map((c) => c.id)).toEqual(["m1"]);
    expect(groups.thisWeek).toEqual([]);
  });

  it("excludes conversations from the previous month", () => {
    const items = [
      conversation("old", isoAtLocal(2026, 6, 29, 12)), // July 29
    ];
    const groups = groupConversationsByPeriod(items, wednesday);
    expect(groups.today).toEqual([]);
    expect(groups.yesterday).toEqual([]);
    expect(groups.thisWeek).toEqual([]);
    expect(groups.thisMonth).toEqual([]);
  });

  it("on Monday, previous Sunday goes to yesterday", () => {
    const monday = new Date(2026, 7, 3, 12, 0, 0, 0); // Monday Aug 3
    const items = [
      conversation("sun", isoAtLocal(2026, 7, 2, 15)), // Sunday Aug 2
      conversation("mon", isoAtLocal(2026, 7, 3, 9)),
    ];
    const groups = groupConversationsByPeriod(items, monday);
    expect(groups.today.map((c) => c.id)).toEqual(["mon"]);
    expect(groups.yesterday.map((c) => c.id)).toEqual(["sun"]);
    expect(groups.thisWeek).toEqual([]);
  });

  it("treats current Sunday as today and Saturday as yesterday", () => {
    const sunday = new Date(2026, 7, 9, 12, 0, 0, 0); // Sunday Aug 9
    const items = [
      conversation("sun", isoAtLocal(2026, 7, 9, 11)),
      conversation("sat", isoAtLocal(2026, 7, 8, 11)),
      conversation("fri", isoAtLocal(2026, 7, 7, 11)),
    ];
    const groups = groupConversationsByPeriod(items, sunday);
    expect(groups.today.map((c) => c.id)).toEqual(["sun"]);
    expect(groups.yesterday.map((c) => c.id)).toEqual(["sat"]);
    expect(groups.thisWeek.map((c) => c.id)).toEqual(["fri"]);
  });

  it("keeps early-week days from previous month in thisWeek", () => {
    const wednesdaySep = new Date(2026, 8, 2, 12, 0, 0, 0); // Wed Sep 2
    const items = [
      conversation("aug31", isoAtLocal(2026, 7, 31, 10)), // Mon Aug 31
      conversation("sep1", isoAtLocal(2026, 8, 1, 10)), // Tue Sep 1 → yesterday
    ];
    const groups = groupConversationsByPeriod(items, wednesdaySep);
    expect(groups.thisWeek.map((c) => c.id)).toEqual(["aug31"]);
    expect(groups.yesterday.map((c) => c.id)).toEqual(["sep1"]);
    expect(groups.thisMonth).toEqual([]);
  });

  it("ignores invalid activity dates", () => {
    const items = [
      conversation("bad", "not-a-date"),
      conversation("ok", isoAtLocal(2026, 7, 5, 8)),
    ];
    const groups = groupConversationsByPeriod(items, wednesday);
    expect(groups.today.map((c) => c.id)).toEqual(["ok"]);
  });

  it("sorts each group by last_activity_at descending", () => {
    const items = [
      conversation("a", isoAtLocal(2026, 7, 5, 8)),
      conversation("b", isoAtLocal(2026, 7, 5, 16)),
      conversation("c", isoAtLocal(2026, 7, 5, 12)),
    ];
    const groups = groupConversationsByPeriod(items, wednesday);
    expect(groups.today.map((c) => c.id)).toEqual(["b", "c", "a"]);
  });

  it("returns empty groups when there are no conversations", () => {
    const groups = groupConversationsByPeriod([], wednesday);
    expect(groups).toEqual({
      today: [],
      yesterday: [],
      thisWeek: [],
      thisMonth: [],
    });
  });

  it("getHistoryStartDate returns start of current month mid-month", () => {
    const start = getHistoryStartDate(wednesday);
    expect(start.getTime()).toBe(startOfCurrentMonth(wednesday).getTime());
    expect(start.getTime()).toBe(startOfLocalDay(new Date(2026, 7, 1)).getTime());
  });

  it("getHistoryStartDate spans previous month when week starts earlier", () => {
    const wednesdaySep = new Date(2026, 8, 2, 15, 30, 0, 0);
    const start = getHistoryStartDate(wednesdaySep);
    expect(start.getTime()).toBe(startOfCurrentWeek(wednesdaySep).getTime());
    expect(start.getTime()).toBeLessThan(
      startOfCurrentMonth(wednesdaySep).getTime(),
    );
  });

  it("getHistoryStartDate on Monday includes previous Sunday when needed", () => {
    const monday = new Date(2026, 7, 3, 15, 30, 0, 0);
    const start = getHistoryStartDate(monday);
    expect(start.getTime()).toBe(startOfCurrentMonth(monday).getTime());
    expect(start.getTime()).toBeLessThanOrEqual(
      startOfYesterday(monday).getTime(),
    );
  });
});
