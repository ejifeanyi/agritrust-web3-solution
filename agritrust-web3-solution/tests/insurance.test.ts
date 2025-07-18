import { describe, it, expect, beforeEach } from "vitest"

const mockInsuranceContract = {
  admin: "ST1ADMINADDRESS000000000000000000000000000",
  farmers: new Map(),

  isAdmin(caller: string) {
    return caller === this.admin
  },

  registerFarmer(caller: string, farmer: string) {
    if (!this.isAdmin(caller)) return { error: 100 } // ERR-NOT-ADMIN
    if (this.farmers.has(farmer)) return { error: 101 } // ERR-ALREADY-REGISTERED

    this.farmers.set(farmer, { premiumPaid: 0, hasClaimed: false })
    return { value: true }
  },

  payPremium(caller: string, amount: number) {
    const farmer = this.farmers.get(caller)
    if (!farmer) return { error: 102 } // ERR-NOT-REGISTERED

    farmer.premiumPaid += amount
    return { value: true }
  },

  claimInsurance(caller: string) {
    const farmer = this.farmers.get(caller)
    if (!farmer) return { error: 102 }
    if (farmer.hasClaimed) return { error: 103 }
    if (farmer.premiumPaid === 0) return { error: 104 }

    farmer.premiumPaid = 0
    farmer.hasClaimed = true
    return { value: true }
  },

  approvePayout(caller: string, farmerAddr: string) {
    if (!this.isAdmin(caller)) return { error: 100 }
    const farmer = this.farmers.get(farmerAddr)
    if (!farmer) return { error: 102 }

    return { value: { farmer: farmerAddr, payout: farmer.premiumPaid } }
  },
}

describe("Insurance Contract (Mocked)", () => {
  const admin = mockInsuranceContract.admin
  const farmer = "ST2FARMER0000000000000000000000000000000000"
  const stranger = "ST3STRANGER000000000000000000000000000000"

  beforeEach(() => {
    mockInsuranceContract.farmers = new Map()
  })

  it("admin can register a farmer", () => {
    const result = mockInsuranceContract.registerFarmer(admin, farmer)
    expect(result).toEqual({ value: true })
  })

  it("non-admin cannot register a farmer", () => {
    const result = mockInsuranceContract.registerFarmer(stranger, farmer)
    expect(result).toEqual({ error: 100 })
  })

  it("farmer can pay premium after registration", () => {
    mockInsuranceContract.registerFarmer(admin, farmer)
    const result = mockInsuranceContract.payPremium(farmer, 50)
    expect(result).toEqual({ value: true })
  })

  it("unregistered user cannot pay premium", () => {
    const result = mockInsuranceContract.payPremium(stranger, 20)
    expect(result).toEqual({ error: 102 })
  })

  it("farmer can claim insurance if premium is paid", () => {
    mockInsuranceContract.registerFarmer(admin, farmer)
    mockInsuranceContract.payPremium(farmer, 100)
    const result = mockInsuranceContract.claimInsurance(farmer)
    expect(result).toEqual({ value: true })
  })

  it("farmer cannot claim twice", () => {
    mockInsuranceContract.registerFarmer(admin, farmer)
    mockInsuranceContract.payPremium(farmer, 100)
    mockInsuranceContract.claimInsurance(farmer)

    const result = mockInsuranceContract.claimInsurance(farmer)
    expect(result).toEqual({ error: 103 }) // Already claimed
  })

  it("cannot claim if no premium paid", () => {
    mockInsuranceContract.registerFarmer(admin, farmer)
    const result = mockInsuranceContract.claimInsurance(farmer)
    expect(result).toEqual({ error: 104 }) // No premium paid
  })

  it("admin can approve payout for farmer", () => {
    mockInsuranceContract.registerFarmer(admin, farmer)
    mockInsuranceContract.payPremium(farmer, 120)

    const result = mockInsuranceContract.approvePayout(admin, farmer)
    expect(result).toEqual({
      value: { farmer: farmer, payout: 120 },
    })
  })

  it("non-admin cannot approve payout", () => {
    mockInsuranceContract.registerFarmer(admin, farmer)
    mockInsuranceContract.payPremium(farmer, 120)

    const result = mockInsuranceContract.approvePayout(stranger, farmer)
    expect(result).toEqual({ error: 100 })
  })
})
