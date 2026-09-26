# ETHGlobal submission notes

## Short description

Human Wall is an anonymous guestbook where every World ID-verified human can publish exactly one message. It demonstrates bot-resistant participation without accounts or disclosure of personal identity.

## World integration

The client uses IDKit to request a proof of personhood. The server sends that proof to the World ID Cloud Verification API and stores the message only after a successful response. The anonymous nullifier hash enforces the one-person-one-message rule.

## Relevant code

- IDKit interface: [`app/page.tsx`](app/page.tsx)
- Server-side proof verification: [`app/api/messages/verify/route.ts`](app/api/messages/verify/route.ts)
- Duplicate-post prevention: [`lib/messages.ts`](lib/messages.ts)

## Submission assets

- Logo: [`public/submission/human-wall-logo.png`](public/submission/human-wall-logo.png)
- Cover: [`public/submission/human-wall-cover.png`](public/submission/human-wall-cover.png)
- Desktop screenshot: [`public/submission/screenshot-1-desktop.png`](public/submission/screenshot-1-desktop.png)
- Full wall screenshot: [`public/submission/screenshot-2-full-wall.png`](public/submission/screenshot-2-full-wall.png)
- Mobile screenshot: [`public/submission/screenshot-3-mobile.png`](public/submission/screenshot-3-mobile.png)

## Local verification

```bash
npm install
cp .env.example .env.local
npm run lint
npm run build
```
