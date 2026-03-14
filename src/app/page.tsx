import { getRandomCards, getSets } from "@/lib/scryfall";
import StorePage from "@/components/StorePage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [cards, sets] = await Promise.all([getRandomCards(10), getSets()]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">
          ⚔️ MTG Card Shop
        </h1>
        <p className="text-gray-400">
          Browse and buy Magic: The Gathering cards from every set
        </p>
      </header>

      <StorePage initialCards={cards} sets={sets} />
    </main>
  );
}
