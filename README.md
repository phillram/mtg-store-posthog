# MTG Card Shop

An ecommerce store for browsing and purchasing Magic: The Gathering cards, powered by the [Scryfall API](https://scryfall.com/docs/api).

## Features

- **Random Cards** — Displays 10 random MTG cards on each page load, with a refresh button to load new ones
- **Set Filter** — Searchable dropdown to filter cards by any MTG set (expansions, core sets, masters, etc.). When a set is selected, all 10 cards come from that set
- **Live Pricing** — Each card displays its current USD market price from Scryfall
- **Card Details Popup** — Click any card to view a larger image with full details (name, set, type line, oracle text, rarity, mana cost)
- **Double-Faced Cards** — Detected and labeled with a badge. The detail popup includes a flip button to view both sides
- **Shopping Cart** — Slide-out cart sidebar with quantity controls, item removal, and running total
- **Checkout** — Full checkout flow with shipping and payment forms, order summary, and confirmation screen

## Tech Stack

- [Next.js](https://nextjs.org) (App Router)
- TypeScript
- Tailwind CSS
- [Scryfall API](https://scryfall.com/docs/api) (free, no API key required)

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  app/
    page.tsx            # Main store page (server component)
    layout.tsx          # Root layout with CartProvider
    api/cards/route.ts  # API route for fetching cards client-side
  components/
    StorePage.tsx       # Store UI with set filter and card grid
    CardItem.tsx        # Individual card display
    CardModal.tsx       # Card detail popup with flip support
    Cart.tsx            # Shopping cart sidebar
    Checkout.tsx        # Checkout form and confirmation
  context/
    CartContext.tsx      # Cart state management
  lib/
    scryfall.ts         # Scryfall API client
    types.ts            # TypeScript types and utility functions
```
