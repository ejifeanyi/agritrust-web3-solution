# 🌾 Agritrust Web3 Solution

Agritrust is a decentralized platform for verifying and managing agricultural authorities, water rights, and marketplace interactions using smart contracts built on the Stacks blockchain.

## 🚀 Overview

This project uses Clarity smart contracts to manage:

- ✅ Water authority verification
- 🧾 Token governance
- 🛒 Marketplace logic

It includes mock tests for each contract using Vitest and TypeScript for local development.

## 🛠️ Technologies Used

- **Clarity** – Smart contract language for the Stacks blockchain
- **Clarinet** – Local development & testing environment for Clarity
- **Vitest** – Fast unit testing framework for TypeScript
- **TypeScript** – Language for writing contract logic mocks & tests

## 📁 Project Structure

.
├── contracts/ # Clarity smart contracts
│ ├── water-authority.clar
│ ├── token.clar
│ └── marketplace.clar
├── tests/ # Vitest unit tests (mocked logic)
│ ├── water.test.ts
│ ├── token.test.ts
│ └── marketplace.test.ts
├── settings/ # Clarinet Devnet settings
│ └── Devnet.toml
└── README.md

## 🧪 Running Tests

You can run mock tests (no blockchain required) using:

```bash
npm install
npm run test
```

All contract logic is mocked in tests/\*.test.ts to simulate behavior locally.

## 🔧 Devnet (Optional)

To simulate Clarity contracts on a local devnet:

```bash
clarinet devnet start
```

Make sure you have a valid Devnet.toml file inside settings/.

## 📦 Setup Instructions

Clone the repository:

```bash
git clone https://github.com/your-org/agritrust-web3-solution.git
cd agritrust-web3-solution
```

## Install dependencies:

```bash
npm install
```

Run tests:

```bash
npm run test
```

## 🤝 Contributing

Fork the repo

Create your feature branch:

```bash
git checkout -b feat/my-feature
```

Commit your changes:

```bash
git commit -m 'feat: add my feature'
```

Push to the branch:

```bash
git push origin feat/my-feature
```

Open a PR!

## 📄 License

This project is licensed under the MIT License.
