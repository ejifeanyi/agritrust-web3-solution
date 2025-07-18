import { describe, it, expect, beforeEach } from "vitest";

const insurance = {
  admin: "STBOSSADMIN123",
  premiums: new Map<string, number>(),

  isAdmin(caller: string): boolean {
    return caller === this.admin;
  },

  payPremium(
    caller: string,
    amount: number
  ): { value?: boolean; error?: number } {
    if (amount <= 0) return { error: 101 }; // ERR-INVALID-AMOUNT

    const prev = this.premiums.get(caller) || 0;
    this.premiums.set(caller, prev + amount);
    return { value: true };
  },

  getPremium(user: string): number {
    return this.premiums.get(user) || 0;
  },

  transferAdmin(
    caller: string,
    newAdmin: string
  ): { value?: boolean; error?: number } {
    if (!this.isAdmin(caller)) return { error: 100 }; // ERR-NOT-AUTHORIZED
    this.admin = newAdmin;
    return { value: true };
  },
};

describe("Insurance Contract", () => {
  beforeEach(() => {
    insurance.admin = "STBOSSADMIN123";
    insurance.premiums = new Map();
  });

  it("should allow valid premium payments", () => {
    const result = insurance.payPremium("STUSER1", 100);
    expect(result).toEqual({ value: true });
    expect(insurance.getPremium("STUSER1")).toBe(100);
  });

  it("should reject zero or negative premium payments", () => {
    const result = insurance.payPremium("STUSER1", 0);
    expect(result).toEqual({ error: 101 });
  });

  it("should accumulate premiums per user", () => {
    insurance.payPremium("STUSER1", 100);
    insurance.payPremium("STUSER1", 50);
    expect(insurance.getPremium("STUSER1")).toBe(150);
  });

  it("should allow admin to transfer rights", () => {
    const result = insurance.transferAdmin("STBOSSADMIN123", "STNEWADMIN");
    expect(result).toEqual({ value: true });
    expect(insurance.admin).toBe("STNEWADMIN");
  });

  it("should prevent non-admin from transferring admin rights", () => {
    const result = insurance.transferAdmin("STNOTADMIN", "STNEWADMIN");
    expect(result).toEqual({ error: 100 });
    expect(insurance.admin).toBe("STBOSSADMIN123");
  });
});
