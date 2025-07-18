import { describe, it, expect, beforeEach } from "vitest";

// Mock contract logic
const mockMarketplaceContract = {
  admin: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  verifiedSellers: new Map(),

  isAdmin(caller: string) {
    return caller === this.admin;
  },

  addSeller(caller: string, seller: string) {
    if (!this.isAdmin(caller)) return { error: 100 }; // Not authorized
    if (this.verifiedSellers.has(seller)) return { error: 101 }; // Already verified
    this.verifiedSellers.set(seller, true);
    return { value: true };
  },

  removeSeller(caller: string, seller: string) {
    if (!this.isAdmin(caller)) return { error: 100 };
    if (!this.verifiedSellers.has(seller)) return { error: 102 };
    this.verifiedSellers.delete(seller);
    return { value: true };
  },

  isVerifiedSeller(seller: string) {
    return this.verifiedSellers.has(seller);
  },

  transferAdmin(caller: string, newAdmin: string) {
    if (!this.isAdmin(caller)) return { error: 100 };
    this.admin = newAdmin;
    return { value: true };
  },
};

// Tests
describe("Marketplace contract (mocked)", () => {
  beforeEach(() => {
    mockMarketplaceContract.admin = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
    mockMarketplaceContract.verifiedSellers = new Map();
  });

  it("should add seller if called by admin", () => {
    const result = mockMarketplaceContract.addSeller(
      "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      "ST2EXAMPLESELLER"
    );
    expect(result).toEqual({ value: true });
    expect(mockMarketplaceContract.isVerifiedSeller("ST2EXAMPLESELLER")).toBe(
      true
    );
  });

  it("should not add seller if called by non-admin", () => {
    const result = mockMarketplaceContract.addSeller(
      "ST2NONADMIN",
      "ST2EXAMPLESELLER"
    );
    expect(result).toEqual({ error: 100 });
  });

  it("should not add the same seller twice", () => {
    const caller = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
    mockMarketplaceContract.addSeller(caller, "ST2SELLER");
    const result = mockMarketplaceContract.addSeller(caller, "ST2SELLER");
    expect(result).toEqual({ error: 101 });
  });

  it("should remove seller if admin", () => {
    const caller = mockMarketplaceContract.admin;
    mockMarketplaceContract.addSeller(caller, "ST2SELLER");
    const result = mockMarketplaceContract.removeSeller(caller, "ST2SELLER");
    expect(result).toEqual({ value: true });
    expect(mockMarketplaceContract.isVerifiedSeller("ST2SELLER")).toBe(false);
  });

  it("should transfer admin", () => {
    const oldAdmin = mockMarketplaceContract.admin;
    const newAdmin = "ST2NEWADMIN";
    const result = mockMarketplaceContract.transferAdmin(oldAdmin, newAdmin);
    expect(result).toEqual({ value: true });
    expect(mockMarketplaceContract.admin).toBe(newAdmin);
  });
});
