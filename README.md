# OlivIA

## Project Overview and Problem Statement

OlivIA is a revolutionary chat interface that enables users to perform transactions on the Stellar network using natural language. The problem we're solving is the technical complexity that users face when conducting cryptocurrency transactions. Through natural language processing, OlivIA translates plain text instructions like "Send 5 XLM to GABCD..." into technically valid transactions on the Stellar blockchain, eliminating the need for users to understand the underlying technical details.

## Technical Architecture and Implementation Details

The system consists of two main components:

**Backend:**
- Developed with Node.js and TypeScript
- Processes natural language requests using OpenAI API
- Analyzes and extracts critical transaction information (amount, asset, recipient)
- Generates transaction structure compatible with Stellar
- Implements security measures and data validation

**Frontend:**
- Built with React/Next.js and Tailwind CSS
- Intuitive chat interface for interacting with the system
- Integration with Stellar wallets for transaction signing
- Responsive design optimized for mobile and desktop devices

Communication between components is done through RESTful APIs, and transactions are generated using the Stellar SDK + Stellar Wallets Kit + Stellar design system.

## Justification for Technical Decisions and Approaches Taken

**Technology choices:**
- **Node.js/TypeScript:** Provides static typing and better structure for a project that handles financial transactions
- **OpenAI API:** Leverages cutting-edge natural language processing to interpret user intent accurately
- **React/Next.js:** Offers excellent performance, SEO benefits, and a modular approach to UI development
- **Stellar blockchain:** Selected for its low transaction costs, fast settlement times, and robust ecosystem for financial applications


**Architecture decisions:**
- Separation of frontend and backend services for improved scalability and maintenance
- Stateless API design to ensure reliability and consistency
- Error handling and input validation at multiple levels to prevent invalid transactions

## Team's Experience with Development on Stellar
This was our first experience with Stellar, and it's evident that the blockchain is a highly developed project in an advanced and mature phase, with a robust ecosystem behind it that always provided us with support and assistance. The Stellar Development Foundation offers comprehensive documentation, active community forums, and various SDKs that facilitated our development process.

However, we encountered significant challenges when attempting to integrate with specific protocols necessary for our project. Many of these projects lacked comprehensive documentation, and there was a notable absence of straightforward methods to test them on Stellar's testnet. Despite these obstacles, we managed to overcome them through active community support and by leveraging libraries like Stellar Wallets Kit, which substantially simplified the wallet integration process.

Our experience has given us valuable insights into blockchain development on Stellar, and we're excited to continue building on this foundation for future enhancements to OlivIA.

## Deployment and Testing Instructions

### Backend Deployment:
1. Clone the repository
2. Install dependencies with `yarn install`
3. Configure the `.env` file with your OpenAI API key
4. Build the project with `yarn build`
5. Start the server with `yarn start`

### Frontend Deployment:
1. Navigate to the frontend directory
2. Install dependencies with `yarn install`
3. Configure the `.env.local` file with your backend URL:
```
NEXT_PUBLIC_BACKEND_URL=https://chatbotapistellar-production.up.railway.app
```
4. Run the development server with `yarn dev` or build for production with `yarn build`

### Testing:
1. The application can be tested on Stellar Testnet to avoid using real funds
2. Create a test wallet on Stellar Testnet and fund it with the Friendbot
3. Connect your wallet to the application
4. Try natural language commands like "Send 10 XLM to GBABCDEFGHIJKLMNOPQRS"

## Credentials for Testing Private Components

For reviewing the application, you can use the following test credentials:
- Demo environment: https://olivia-stellar.vercel.app
- API endpoint: https://chatbotapistellar-production.up.railway.app


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

