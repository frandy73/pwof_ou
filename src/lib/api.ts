import { Message } from "../types";

export async function sendMessage(message: string, history: Message[]) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, history }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Yon pwoblèm ki pase");
  }

  return response.json() as Promise<{ text: string }>;
}

export async function sendMessageStream(
  message: string,
  history: Message[],
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (error: string) => void
) {
  const response = await fetch("/api/chat/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });

  if (!response.ok) {
    const error = await response.json();
    onError(error.error || "Yon pwoblèm ki pase");
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    onError("Imposible konekte ak sèvè a.");
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6);
      if (data === "[DONE]") {
        onDone();
        return;
      }
      try {
        const parsed = JSON.parse(data);
        if (parsed.error) {
          onError(parsed.error);
          return;
        }
        onChunk(parsed.text);
      } catch {}
    }
  }
  onDone();
}
