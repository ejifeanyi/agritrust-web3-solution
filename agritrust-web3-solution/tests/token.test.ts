import { describe, it, expect, beforeEach } from "vitest";

// Mock token contract
const mockTokenContract = {
  balances: new Map<string, number>(),
  totalSupply: 0,
  admin: "ST1ADMINADDRESS",

  getBalance(address: string) {
    return this.balances.get(address) || 0;
  },

  mint(caller: string, recipient: string, amount: number) {
    if (caller !== this.admin) return { error: 100 }; // Unauthorized
    const current = this.getBalance(recipient);
    this.balances.set(recipient, current + amount);
    this.totalSupply += amount;
    return { value: true };
  },

  transfer(sender: string, recipient: string, amount: number) {
    const senderBalance = this.getBalance(sender);
    if (senderBalance < amount) return { error: 101 }; // Insufficient balance
    this.balances.set(sender, senderBalance - amount);
    const recipientBalance = this.getBalance(recipient);
    this.balances.set(recipient, recipientBalance + amount);
    return { value: true };
  },
};

describe("Token contract (mocked)", () => {
  const admin = "ST1ADMINADDRESS";
  const user1 = "ST2USER1";
  const user2 = "ST3USER2";

  beforeEach(() => {
    mockTokenContract.totalSupply = 0;
    mockTokenContract.balances = new Map();
  });

  it("should allow admin to mint tokens", () => {
    const result = mockTokenContract.mint(admin, user1, 1000);
    expect(result).toEqual({ value: true });
    expect(mockTokenContract.getBalance(user1)).toBe(1000);
    expect(mockTokenContract.totalSupply).toBe(1000);
  });

  it("should not allow non-admin to mint tokens", () => {
    const result = mockTokenContract.mint(user1, user2, 500);
    expect(result).toEqual({ error: 100 });
    expect(mockTokenContract.getBalance(user2)).toBe(0);
  });

  it("should allow transfer if balance is sufficient", () => {
    mockTokenContract.mint(admin, user1, 1000);
    const result = mockTokenContract.transfer(user1, user2, 300);
    expect(result).toEqual({ value: true });
    expect(mockTokenContract.getBalance(user1)).toBe(700);
    expect(mockTokenContract.getBalance(user2)).toBe(300);
  });

  it("should not allow transfer if balance is insufficient", () => {
    mockTokenContract.mint(admin, user1, 200);
    const result = mockTokenContract.transfer(user1, user2, 500);
    expect(result).toEqual({ error: 101 });
    expect(mockTokenContract.getBalance(user1)).toBe(200);
    expect(mockTokenContract.getBalance(user2)).toBe(0);
  });
});
