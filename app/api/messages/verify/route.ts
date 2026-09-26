import { NextRequest, NextResponse } from "next/server";
import { addMessage } from "@/lib/messages";

type Proof = {
  nullifier_hash: string;
  merkle_root: string;
  proof: string;
  verification_level: string;
};

type VerificationResponse = {
  success?: boolean;
  detail?: string;
};

export async function POST(request: NextRequest) {
  try {
    const { proof, message } = (await request.json()) as { proof: Proof; message: string };
    const appId = process.env.NEXT_PUBLIC_WORLD_APP_ID;
    const action = process.env.NEXT_PUBLIC_WORLD_ACTION ?? "leave-a-message";
    const cleanMessage = message?.trim();

    if (!appId) {
      return NextResponse.json({ error: "World App ID is not configured." }, { status: 500 });
    }
    if (!cleanMessage || cleanMessage.length > 180) {
      return NextResponse.json({ error: "Message must be between 1 and 180 characters." }, { status: 400 });
    }
    if (!proof?.nullifier_hash || !proof.proof || !proof.merkle_root || !proof.verification_level) {
      return NextResponse.json({ error: "A complete World ID proof is required." }, { status: 400 });
    }

    const verification = await fetch(`https://developer.worldcoin.org/api/v2/verify/${appId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "human-wall/1.0" },
      body: JSON.stringify({ ...proof, action }),
    });

    const result = (await verification.json().catch(() => ({}))) as VerificationResponse;
    if (!verification.ok || !result.success) {
      return NextResponse.json({ error: result.detail ?? "World ID verification failed." }, { status: 400 });
    }

    return NextResponse.json(await addMessage(cleanMessage, proof.nullifier_hash), { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "ALREADY_POSTED") {
      return NextResponse.json({ error: "This human has already posted." }, { status: 409 });
    }
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
