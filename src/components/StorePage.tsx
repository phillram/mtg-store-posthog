"use client";

import { useState, useEffect, useCallback } from "react";
import { ScryfallCard, ScryfallSet } from "@/lib/types";
import CardItem from "./CardItem";

interface StorePageProps {
  initialCards: ScryfallCard[];
  sets: ScryfallSet[];
}

export default function StorePage({ initialCards, sets }: StorePageProps) {
  const [cards, setCards] = useState<ScryfallCard[]>(initialCards);
  const [selectedSet, setSelectedSet] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSets = sets.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchCards = useCallback(async (setCode?: string) => {
    setLoading(true);
    try {
      const url = setCode
        ? `/api/cards?set=${encodeURIComponent(setCode)}`
        : "/api/cards";
      const res = await fetch(url);
      const data = await res.json();
      setCards(data.cards);
    } catch (error) {
      console.error("Failed to fetch cards:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSetChange = (setCode: string) => {
    setSelectedSet(setCode);
    setSearchTerm("");
    fetchCards(setCode || undefined);
  };

  const handleRefresh = () => {
    fetchCards(selectedSet || undefined);
  };

  return (
    <div>
      {/* Filters bar */}
      <div className="bg-card-bg rounded-xl p-4 mb-8 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm text-gray-400 mb-1">Filter by Set</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search sets..."
              value={selectedSet ? sets.find(s => s.code === selectedSet)?.name || searchTerm : searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (selectedSet) {
                  setSelectedSet("");
                }
              }}
              onFocus={() => {
                if (selectedSet) {
                  setSearchTerm(sets.find(s => s.code === selectedSet)?.name || "");
                  setSelectedSet("");
                }
              }}
              className="bg-surface rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
            {searchTerm && !selectedSet && (
              <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-surface rounded-lg shadow-xl max-h-60 overflow-y-auto">
                <button
                  onClick={() => handleSetChange("")}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-card-bg transition-colors cursor-pointer"
                >
                  All Sets (Random)
                </button>
                {filteredSets.slice(0, 50).map((set) => (
                  <button
                    key={set.code}
                    onClick={() => handleSetChange(set.code)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-card-bg transition-colors cursor-pointer"
                  >
                    {set.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-5 py-2 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white rounded-lg font-medium transition-colors mt-5 cursor-pointer"
        >
          {loading ? "Loading..." : "🔄 Refresh Cards"}
        </button>

        {selectedSet && (
          <button
            onClick={() => handleSetChange("")}
            className="px-4 py-2 bg-surface hover:bg-surface/80 rounded-lg text-sm mt-5 cursor-pointer"
          >
            ✕ Clear Filter
          </button>
        )}
      </div>

      {/* Cards grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {cards.map((card) => (
            <CardItem key={card.id} card={card} />
          ))}
        </div>
      )}

      {!loading && cards.length === 0 && (
        <p className="text-center text-gray-400 py-12">
          No cards found. Try a different set or refresh.
        </p>
      )}
    </div>
  );
}
