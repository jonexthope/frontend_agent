export interface InlinePart {
  type: "text" | "bold" | "code";
  value: string;
}

export interface MessageBlockParagraph {
  type: "paragraph";
  parts: InlinePart[];
}

export interface MessageBlockList {
  type: "list";
  items: InlinePart[][];
}

export interface MessageBlockKpi {
  type: "kpi";
  label: string;
  value: string;
  trend?: string;
  trendDirection?: "up" | "down";
}

export type MessageBlock = MessageBlockParagraph | MessageBlockList | MessageBlockKpi;

const INLINE_PATTERN = /(\*\*[^*]+\*\*|`[^`]+`)/g;

function parseInline(text: string): InlinePart[] {
  const parts: InlinePart[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(INLINE_PATTERN)) {
    const raw = match[0];
    const index = match.index ?? 0;
    if (index > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, index) });
    }
    if (raw.startsWith("**")) {
      parts.push({ type: "bold", value: raw.slice(2, -2) });
    } else {
      parts.push({ type: "code", value: raw.slice(1, -1) });
    }
    lastIndex = index + raw.length;
  }
  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) });
  }
  return parts.length === 0 ? [{ type: "text", value: text }] : parts;
}

function parseKpiLine(line: string): MessageBlockKpi | null {
  if (!line.startsWith("[kpi]")) return null;
  const payload = line.replace("[kpi]", "");
  const [label = "", value = "", trend = ""] = payload.split("|");
  const normalizedTrend = trend.trim();
  const direction = normalizedTrend.startsWith("down")
    ? "down"
    : normalizedTrend.startsWith("up")
      ? "up"
      : undefined;
  return {
    type: "kpi",
    label: label.trim(),
    value: value.trim(),
    trend: normalizedTrend.replace(/^(up|down)\s*/i, "").trim() || undefined,
    trendDirection: direction,
  };
}

export function formatMessageContent(content: string): MessageBlock[] {
  const sections = content
    .split("\n\n")
    .map((section) => section.trim())
    .filter(Boolean);

  const blocks: MessageBlock[] = [];
  sections.forEach((section) => {
    const lines = section.split("\n").map((line) => line.trim());
    const kpis = lines.map(parseKpiLine).filter((line): line is MessageBlockKpi => Boolean(line));
    if (kpis.length === lines.length && kpis.length > 0) {
      blocks.push(...kpis);
      return;
    }

    const listLines = lines.filter((line) => /^([-*]|\d+\.)\s/.test(line));
    if (listLines.length === lines.length && listLines.length > 0) {
      blocks.push({
        type: "list",
        items: listLines.map((line) => parseInline(line.replace(/^([-*]|\d+\.)\s/, ""))),
      });
      return;
    }

    blocks.push({ type: "paragraph", parts: parseInline(section) });
  });
  return blocks;
}
