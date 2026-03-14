"use client";

import { useState } from "react";
import Image from "next/image";
import { ScryfallCard, getCardImage, getCardPrice, formatPrice, isDoubleFaced } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import CardModal from "./CardModal";

interface CardItemProps {
  card: ScryfallCard;
}

export default function CardItem({ card }: CardItemProps) {
  const [showModal, setShowModal] = useState(false);
  const { addItem } = useCart();
  const price = getCardPrice(card);
  const imageUrl = getCardImage(card, "normal");
  const doubleFaced = isDoubleFaced(card);

  return (
    <>
      <div className="bg-card-bg rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-[1.02] flex flex-col">
        <button
          onClick={() => setShowModal(true)}
          className="relative w-full aspect-[488/680] cursor-pointer group"
        >
          <Image
            src={imageUrl}
            alt={card.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 text-white font-semibold bg-black/60 px-3 py-1 rounded-lg transition-opacity text-sm">
              View Details
            </span>
          </div>
          {doubleFaced && (
            <span className="absolute top-2 right-2 bg-surface/90 text-xs px-2 py-1 rounded-full">
              Double-faced
            </span>
          )}
        </button>

        <div className="p-3 flex flex-col flex-1">
          <h3 className="font-semibold text-sm truncate" title={card.name}>
            {card.name}
          </h3>
          <p className="text-gray-400 text-xs truncate">{card.set_name}</p>

          <div className="flex items-center justify-between mt-auto pt-2">
            <span className="text-green-400 font-bold">
              {price > 0 ? formatPrice(price) : "N/A"}
            </span>
            {price > 0 && (
              <button
                onClick={() => addItem(card)}
                className="px-3 py-1 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>

      {showModal && <CardModal card={card} onClose={() => setShowModal(false)} />}
    </>
  );
}
