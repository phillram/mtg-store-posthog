"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { getCardPrice, formatPrice } from "@/lib/types";
import posthog from "posthog-js";

interface CheckoutProps {
  onBack: () => void;
}

export default function Checkout({ onBack }: CheckoutProps) {
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<"form" | "confirmed">("form");
  const [confirmedTotal, setConfirmedTotal] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const anonymousId = posthog.get_distinct_id();

    posthog.identify(form.email, {
      name: form.name,
      email: form.email,
      city: form.city,
      state: form.state,
      zip: form.zip,
    });

    if (anonymousId && anonymousId !== form.email) {
      posthog.alias(anonymousId, form.email);
    }

    posthog.capture("order_completed", {
      total_price: totalPrice,
      total_items: items.reduce((sum, item) => sum + item.quantity, 0),
      items: items.map((item) => ({
        card_id: item.card.id,
        card_name: item.card.name,
        card_set: item.card.set_name,
        card_rarity: item.card.rarity,
        card_price: getCardPrice(item.card),
        quantity: item.quantity,
        line_total: getCardPrice(item.card) * item.quantity,
      })),
      shipping_city: form.city,
      shipping_state: form.state,
      shipping_zip: form.zip,
    });

    setConfirmedTotal(totalPrice);
    setStep("confirmed");
    clearCart();
  };

  if (step === "confirmed") {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-4">
        <div className="bg-card-bg rounded-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
          <p className="text-gray-400 mb-2">
            Thank you for your purchase, {form.name}!
          </p>
          <p className="text-gray-400 mb-6">
            A confirmation email will be sent to {form.email}.
          </p>
          <p className="text-green-400 font-bold text-xl mb-6">
            Total: {formatPrice(confirmedTotal)}
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white mb-4 flex items-center gap-1 cursor-pointer"
        >
          ← Back to Store
        </button>

        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <div className="bg-card-bg rounded-xl p-4 mb-6">
          <h3 className="font-semibold mb-3">Order Summary</h3>
          {items.map((item) => (
            <div key={item.card.id} className="flex justify-between text-sm py-1">
              <span>
                {item.card.name} x{item.quantity}
              </span>
              <span className="text-green-400">
                {formatPrice(getCardPrice(item.card) * item.quantity)}
              </span>
            </div>
          ))}
          <div className="border-t border-gray-700 mt-2 pt-2 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-green-400">{formatPrice(totalPrice)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="font-semibold text-lg">Shipping Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              required
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-surface rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-surface rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <input
            required
            placeholder="Street Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="bg-surface rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <div className="grid grid-cols-3 gap-4">
            <input
              required
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="bg-surface rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <input
              required
              placeholder="State"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="bg-surface rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <input
              required
              placeholder="ZIP"
              value={form.zip}
              onChange={(e) => setForm({ ...form, zip: e.target.value })}
              className="bg-surface rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <h3 className="font-semibold text-lg pt-4">Payment Information</h3>
          <input
            required
            placeholder="Card Number"
            value={form.cardNumber}
            onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
            className="bg-surface rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              required
              placeholder="MM/YY"
              value={form.expiry}
              onChange={(e) => setForm({ ...form, expiry: e.target.value })}
              className="bg-surface rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <input
              required
              placeholder="CVV"
              value={form.cvv}
              onChange={(e) => setForm({ ...form, cvv: e.target.value })}
              className="bg-surface rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-accent hover:bg-accent-hover text-white rounded-lg font-bold text-lg transition-colors mt-6 cursor-pointer"
          >
            Place Order — {formatPrice(totalPrice)}
          </button>
        </form>
      </div>
    </div>
  );
}
