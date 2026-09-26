import { promises as fs } from "node:fs";
import path from "node:path";

export type Message = {
  id: string;
  text: string;
  createdAt: string;
};

type StoredMessage = Message & { nullifierHash: string };

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "messages.json");

async function readMessages(): Promise<StoredMessage[]> {
  try {
    return JSON.parse(await fs.readFile(dataFile, "utf8")) as StoredMessage[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function listMessages(): Promise<Message[]> {
  const messages = await readMessages();
  return messages
    .map(({ id, text, createdAt }) => ({ id, text, createdAt }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addMessage(text: string, nullifierHash: string): Promise<Message> {
  await fs.mkdir(dataDir, { recursive: true });
  const messages = await readMessages();

  if (messages.some((message) => message.nullifierHash === nullifierHash)) {
    throw new Error("ALREADY_POSTED");
  }

  const message: StoredMessage = {
    id: crypto.randomUUID(),
    text,
    nullifierHash,
    createdAt: new Date().toISOString(),
  };

  messages.push(message);
  await fs.writeFile(dataFile, JSON.stringify(messages, null, 2));
  return { id: message.id, text: message.text, createdAt: message.createdAt };
}
