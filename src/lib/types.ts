export interface ScryfallCard {
  id: string;
  name: string;
  set_name: string;
  set: string;
  collector_number: string;
  rarity: string;
  type_line: string;
  oracle_text?: string;
  mana_cost?: string;
  prices: {
    usd: string | null;
    usd_foil: string | null;
  };
  image_uris?: {
    small: string;
    normal: string;
    large: string;
    png: string;
  };
  card_faces?: Array<{
    name: string;
    mana_cost?: string;
    type_line?: string;
    oracle_text?: string;
    image_uris?: {
      small: string;
      normal: string;
      large: string;
      png: string;
    };
  }>;
  layout: string;
}

export interface ScryfallSet {
  code: string;
  name: string;
  set_type: string;
  card_count: number;
  released_at?: string;
  icon_svg_uri: string;
}

export interface CartItem {
  card: ScryfallCard;
  quantity: number;
}

export function getCardImage(card: ScryfallCard, size: "small" | "normal" | "large" | "png" = "normal"): string {
  if (card.image_uris) {
    return card.image_uris[size];
  }
  if (card.card_faces?.[0]?.image_uris) {
    return card.card_faces[0].image_uris[size];
  }
  return "";
}

export function getCardBackImage(card: ScryfallCard, size: "small" | "normal" | "large" | "png" = "normal"): string | null {
  if (card.card_faces?.[1]?.image_uris) {
    return card.card_faces[1].image_uris[size];
  }
  return null;
}

export function isDoubleFaced(card: ScryfallCard): boolean {
  return !!(card.card_faces && card.card_faces.length > 1 && card.card_faces[1]?.image_uris);
}

export function getCardPrice(card: ScryfallCard): number {
  const price = card.prices.usd || card.prices.usd_foil;
  return price ? parseFloat(price) : 0;
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}
