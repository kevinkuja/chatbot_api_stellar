# OlivIA

# Backend Documentation

## Description
This project is a backend for a chatbot API developed with Node.js and TypeScript, possibly related to the Stellar network.

## Project Structure

```
backend/
├── config/         - Configuration files
├── handlers/       - Route handlers and controllers
├── helpers/        - Helper functions and utilities
├── types/          - TypeScript type definitions
├── .env            - Environment variables
├── index.ts        - Application entry point
├── package.json    - Project configuration and dependencies
├── tsconfig.json   - TypeScript configuration
```

## Prerequisites
- Node.js (recommended version: 14.x or higher)
- Yarn or npm
- Environment variables configured (see configuration section)

## Installation

1. Install dependencies:
```bash
yarn install
# or with npm
npm install
```

2. Configure environment variables by creating or modifying the `.env` file in the project root.

## Commands

### Build
To compile TypeScript code to JavaScript:
```bash
yarn build
# or with npm
npm run build
```

### Production
To run the server in production mode:
```bash
yarn start
# or with npm
npm start
```

To automatically format code:
```bash
yarn format
# or with npm
npm run format
```

## Configuration
The project uses an `.env` file for environment variables. Make sure to configure the following variables:

```
OPEN_AI_API_KEY=...                # OpenAI API key for authentication
```

## Additional Notes
- The project uses TypeScript for static typing
- ESLint and Prettier are used to maintain code consistency
- The folder structure follows a modular pattern for easier maintenance

## Contribution
1. Fork the repository
2. Create a branch for your feature (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

# Frontend Documentation

_Chat-based transaction builder (Phase 1: Transfers Only)_

The frontend is a React/Next.js application that enables natural language cryptocurrency transfers on the Stellar network. Users can describe transfers in plain English (e.g. "Send 1 XLM to...") and the system will handle the transaction details.

## Features

1. Parses amount/recipient
2. Generates Token Transfer tx
3. Triggers Wallet for approval

## 🚀 Current Features

- **Natural Language Transfers**:
  - "Pay 100 USDC to xxxxx"
  - "Send 0.3 XLM to xxxxx" (direct address support)
- **Wallet Integration**: Stellar Wallet
- **Network Support**: Stellar Mainnet (Testnet in demo)

## How to run the frontend

1. Install packages
yarn
2. Enter endpoint in .env.local
NEXT_PUBLIC_BACKEND_URL=https://chatbotapistellar-production.up.railway.app
3. Run
yarn dev