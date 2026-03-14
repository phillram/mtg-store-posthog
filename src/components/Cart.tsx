"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { getCardImage, getCardPrice, formatPrice } from "@/lib/types";
import Checkout from "./Checkout";

export default function Cart() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, isCartOpen, setIsCartOpen } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  if (showCheckout) {
    return <Checkout onBack={() => setShowCheckout(false)} />;
  }

  return (
    <>
      {/* Cart toggle button */}
      <button
        onClick={() => setIsCartOpen(!isCartOpen)}
        className="fixed top-4 right-4 z-40 bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-full font-semibold shadow-lg transition-colors cursor-pointer"
      >
        🛒 Cart ({totalItems})
      </button>

      {/* Cart sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsCartOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-card-bg shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold">Shopping Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-white text-2xl leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <p className="text-gray-400 text-center mt-8">Your cart is empty</p>
              ) : (
                items.map((item) => {
                  const price = getCardPrice(item.card);
                  return (
                    <div key={item.card.id} className="flex gap-3 bg-surface/50 rounded-lg p-3">
                      <div className="relative w-16 h-22 flex-shrink-0">
                        <Image
                          src={getCardImage(item.card, "small")}
                          alt={item.card.name}
                          fill
                          className="rounded object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{item.card.name}</p>
                        <p className="text-green-400 text-sm">{formatPrice(price)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => updateQuantity(item.card.id, item.quantity - 1)}
                            className="w-6 h-6 bg-surface rounded text-sm hover:bg-gray-600 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-sm w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.card.id, item.quantity + 1)}
                            className="w-6 h-6 bg-surface rounded text-sm hover:bg-gray-600 cursor-pointer"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeItem(item.card.id)}
                            className="ml-auto text-red-400 hover:text-red-300 text-xs cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {items.length > 0 && (
              <div className="p-4 border-t border-gray-700">
                <div className="flex justify-between mb-3">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-green-400 text-lg">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setShowCheckout(true);
                  }}
                  className="w-full py-3 bg-accent hover:bg-accent-hover text-white rounded-lg font-bold transition-colors cursor-pointer"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
