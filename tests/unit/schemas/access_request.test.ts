import { describe, expect, it } from "vitest";
import { accessRequestSchema } from "@/schemas/access_request";

describe("accessRequestSchema", () => {
  it("accepts a valid access request", () => {
    const result = accessRequestSchema.safeParse({
      email: "ops@entreprise.com",
      role: "Analyste",
      message: "Besoin pour le reporting mensuel",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = accessRequestSchema.safeParse({
      email: "bad",
      role: "Direction",
      message: "Message valide",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing role", () => {
    const result = accessRequestSchema.safeParse({
      email: "ops@entreprise.com",
      role: "",
      message: "Message valide",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown role", () => {
    const result = accessRequestSchema.safeParse({
      email: "ops@entreprise.com",
      role: "Inconnu",
      message: "Message valide",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a whitespace-only message", () => {
    const result = accessRequestSchema.safeParse({
      email: "ops@entreprise.com",
      role: "Lecture seule",
      message: "   ",
    });
    expect(result.success).toBe(false);
  });
});
