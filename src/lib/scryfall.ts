import { ScryfallCard, ScryfallSet } from "./types";

const BASE_URL = "https://api.scryfall.com";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scryfallFetch<T>(path: string, retries = 3): Promise<T> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (res.status === 429) {
      await delay(1000 * (attempt + 1));
      continue;
    }

    if (!res.ok) {
      throw new Error(`Scryfall API error: ${res.status}`);
    }
    return res.json();
  }
  throw new Error("Scryfall API error: 429 (rate limited after retries)");
}

export async function getRandomCards(count: number = 10, setCode?: string): Promise<ScryfallCard[]> {
  const query = setCode ? `q=set%3A${encodeURIComponent(setCode)}` : "";
  const cards: ScryfallCard[] = [];
  for (let i = 0; i < count; i++) {
    const sep = query ? "&" : "?";
    const base = `/cards/random${query ? `?${query}` : ""}`;
    const card = await scryfallFetch<ScryfallCard>(`${base}${sep}_=${Date.now()}-${i}`);
    cards.push(card);
    if (i < count - 1) {
      await delay(100);
    }
  }
  return cards;
}

export async function getSets(): Promise<ScryfallSet[]> {
  const data = await scryfallFetch<{ data: ScryfallSet[] }>("/sets");
  // Filter to only expansion, core, and masters sets
  return data.data.filter(
    (s) =>
      ["expansion", "core", "masters", "draft_innovation"].includes(s.set_type) &&
      s.card_count > 0
  );
}
