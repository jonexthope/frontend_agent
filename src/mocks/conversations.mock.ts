import type { Conversation } from "@/models/chat/conversation.models";

function isoHoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

export const CONVERSATIONS_MOCK: Conversation[] = [
  {
    id: "c_welcome",
    title: "Nouvelle conversation",
    messages: [],
    status: "active",
    createdAt: isoHoursAgo(0),
    updatedAt: isoHoursAgo(0),
  },
  {
    id: "c_risk",
    title: "Top 3 pays à risque",
    status: "active",
    messages: [],
    createdAt: isoHoursAgo(3),
    updatedAt: isoHoursAgo(2),
  },
  {
    id: "c_brief",
    title: "Brief exécutif du jour",
    status: "active",
    messages: [],
    createdAt: isoHoursAgo(8),
    updatedAt: isoHoursAgo(5),
  },
];
