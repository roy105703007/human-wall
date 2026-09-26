# Human Wall

**One verified human. One message.**

Human Wall is an anonymous guestbook powered by World ID. Every verified human can publish one message, while duplicate users and bots are prevented from posting.

Built for ETHGlobal Tokyo 2026.

## How it works

1. Write a message (up to 180 characters).
2. Verify uniqueness with World ID.
3. The server validates the zero-knowledge proof using World ID's Cloud Verification API.
4. The proof's nullifier can post only once, without revealing the person's identity.

## Architecture

The browser opens the IDKit verification flow and sends the resulting proof with the user's message to a Next.js API route. The server verifies that proof with World ID's Cloud Verification API before saving anything. A successful proof's anonymous nullifier is retained only to enforce the one-person-one-message rule; public API responses never expose it.

```text
IDKit widget → Next.js verification route → World ID Cloud API
                                           ↓
                                  verified message store
```

## ETHGlobal submission

- **Project:** Human Wall
- **Event:** ETHGlobal Tokyo 2026
- **World integration:** IDKit and Cloud Verification API
- **Core mechanic:** one anonymous message per verified human
- **Submission artwork:** [`public/submission`](public/submission)

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Create a staging app in the [World Developer Portal](https://developer.world.org/), add an Incognito Action named `leave-a-message` with a maximum of one verification, and replace the placeholder app ID in `.env.local`. Use the World ID Simulator to test the flow.

## Stack

- Next.js
- TypeScript
- World ID IDKit
- World ID Cloud Verification API
- Local JSON storage for a zero-setup hackathon demo

## Production note

The local JSON store is deliberately optimized for a quick demo. Replace it with a persistent database before deploying to a serverless platform.
