"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ScryfallCard, getCardImage, getCardBackImage, isDoubleFaced, getCardPrice, formatPrice } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import posthog from "posthog-js";

interface CardModalProps {
  card: ScryfallCard;
  onClose: () => void;
}

export default function CardModal({ card, onClose }: CardModalProps) {
  const [showBack, setShowBack] = useState(false);
  const { addItem } = useCart();
  const doubleFaced = isDoubleFaced(card);
  const price = getCardPrice(card);

  const currentImage = showBack
    ? getCardBackImage(card, "large")!
    : getCardImage(card, "large");

  useEffect(() => {
    posthog.capture("card_viewed", {
      card_id: card.id,
      card_name: card.name,
      card_set: card.set_name,
      card_rarity: card.rarity,
      card_price: price,
      card_type: card.type_line,
    });
  }, [card, price]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-card-bg rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl leading-none"
        >
          &times;
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="relative w-[300px] h-[418px]">
              <Image
                src={currentImage}
                alt={card.name}
                fill
                className="rounded-xl object-contain"
                sizes="300px"
              />
            </div>
            {doubleFaced && (
              <button
                onClick={() => setShowBack(!showBack)}
                className="mt-3 px-4 py-2 bg-surface rounded-lg text-sm hover:bg-surface/80 transition-colors cursor-pointer"
              >
                🔄 Flip Card ({showBack ? "Back" : "Front"})
              </button>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold mb-1">{card.name}</h2>
            <p className="text-gray-400 text-sm mb-2">
              {card.set_name} &middot; #{card.collector_number}
            </p>
            <p className="text-gray-300 text-sm mb-1">{card.type_line}</p>
            {card.mana_cost && (
              <p className="text-gray-400 text-sm mb-3">Mana: {card.mana_cost}</p>
            )}
            {card.oracle_text && (
              <p className="text-gray-300 text-sm mb-4 whitespace-pre-line border-t border-gray-700 pt-3">
                {card.oracle_text}
              </p>
            )}
            {!card.oracle_text && card.card_faces && (
              <div className="border-t border-gray-700 pt-3 mb-4">
                {card.card_faces.map((face, i) => (
                  <div key={i} className="mb-3">
                    <p className="font-semibold text-sm">{face.name}</p>
                    {face.oracle_text && (
                      <p className="text-gray-300 text-sm whitespace-pre-line mt-1">
                        {face.oracle_text}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-700">
              <span className="text-2xl font-bold text-green-400">
                {price > 0 ? formatPrice(price) : "Price N/A"}
              </span>
              {price > 0 && (
                <button
                  onClick={() => {
                    addItem(card);
                    posthog.capture("card_added_to_cart", {
                      card_id: card.id,
                      card_name: card.name,
                      card_set: card.set_name,
                      card_rarity: card.rarity,
                      card_price: price,
                    });
                    onClose();
                  }}
                  className="px-5 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Add to Cart
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2 capitalize">
              Rarity: {card.rarity}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
