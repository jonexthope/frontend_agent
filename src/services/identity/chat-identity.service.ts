/** Temporary identity until JWT auth is available. Not a secure auth mechanism. */
const TEMPORARY_EXTERNAL_ID = "frontend-agent-temporary-user";

export function getChatExternalId(): string {
  return TEMPORARY_EXTERNAL_ID;
}
