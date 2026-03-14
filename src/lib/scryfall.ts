import { ScryfallCard, ScryfallSet } from "./types";

const BASE_URL = "https://api.scryfall.com";

async function scryfallFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Scryfall API error: ${res.status}`);
  }
  return res.json();
}

export async function getRandomCards(count: number = 10, setCode?: string): Promise<ScryfallCard[]> {
  const query = setCode ? `q=set%3A${encodeURIComponent(setCode)}` : "";
  const cards: ScryfallCard[] = [];
  const promises = Array.from({ length: count }, (_, i) => {
    const sep = query ? "&" : "?";
    const base = `/cards/random${query ? `?${query}` : ""}`;
    return scryfallFetch<ScryfallCard>(`${base}${sep}_=${Date.now()}-${i}`);
  });
  const results = await Promise.all(promises);
  cards.push(...results);
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
