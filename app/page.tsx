"use client";

import { IDKitWidget, ISuccessResult, VerificationLevel } from "@worldcoin/idkit";
import { useCallback, useEffect, useState } from "react";
import type { Message } from "@/lib/messages";

const appId = process.env.NEXT_PUBLIC_WORLD_APP_ID as `app_${string}`;
const action = process.env.NEXT_PUBLIC_WORLD_ACTION ?? "leave-a-message";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("");

  const loadMessages = useCallback(async () => {
    const response = await fetch("/api/messages", { cache: "no-store" });
    setMessages(await response.json());
  }, []);

  useEffect(() => {
    fetch("/api/messages", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: Message[]) => setMessages(data));
  }, []);

  async function verifyAndPost(proof: ISuccessResult) {
    setStatus("Verifying your proof…");
    const response = await fetch("/api/messages/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proof, message: draft }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "Could not post your message.");
    setDraft("");
    setStatus("Your message is now on the wall.");
    await loadMessages();
  }

  return (
    <main>
      <section className="hero">
        <div className="orb" aria-hidden="true" />
        <p className="eyebrow">WORLD ID × ETHGLOBAL TOKYO</p>
        <h1>One human.<br />One message.</h1>
        <p className="intro">An anonymous wall where every voice is real and every person gets exactly one post.</p>

        <div className="composer">
          <label htmlFor="message">What do you want the world to remember?</label>
          <textarea
            id="message"
            maxLength={180}
            placeholder="Leave your mark…"
            value={draft}
            onChange={(event) => { setDraft(event.target.value); setStatus(""); }}
          />
          <div className="composerFooter">
            <span>{draft.length}/180</span>
            {appId ? (
              <IDKitWidget
                app_id={appId}
                action={action}
                verification_level={VerificationLevel.Device}
                handleVerify={verifyAndPost}
                onSuccess={() => undefined}
                onError={(error) => setStatus(error.message ?? "World ID verification failed.")}
              >
                {({ open }) => (
                  <button disabled={!draft.trim()} onClick={open}>Verify & post</button>
                )}
              </IDKitWidget>
            ) : (
              <button disabled>Configure World ID first</button>
            )}
          </div>
          {status && <p className="status" role="status">{status}</p>}
        </div>
      </section>

      <section className="wall">
        <div className="wallHeader">
          <h2>The Human Wall</h2>
          <span>{messages.length} verified {messages.length === 1 ? "human" : "humans"}</span>
        </div>
        <div className="grid">
          {messages.length ? messages.map((message, index) => (
            <article className={`note note${index % 4}`} key={message.id}>
              <p>“{message.text}”</p>
              <footer>
                <span className="verified">● Verified human</span>
                <time>{new Date(message.createdAt).toLocaleDateString()}</time>
              </footer>
            </article>
          )) : (
            <div className="empty">Be the first verified human on the wall.</div>
          )}
        </div>
      </section>
    </main>
  );
}
