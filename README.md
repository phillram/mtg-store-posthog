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

## PostHog Analytics

The app includes [PostHog](https://posthog.com) for product analytics, user identification, and error tracking.

### Tracked Events

| Event | Trigger | Properties |
|---|---|---|
| `card_viewed` | User opens a card's detail modal | `card_id`, `card_name`, `card_set`, `card_rarity`, `card_price`, `card_type` |
| `card_added_to_cart` | User adds a card to their cart (from grid or modal) | `card_id`, `card_name`, `card_set`, `card_rarity`, `card_price` |
| `order_completed` | User completes checkout | `total_price`, `total_items`, `items` (array with full card details and quantities), `shipping_city`, `shipping_state`, `shipping_zip` |

### User Identification

- Users browse anonymously until checkout
- At checkout, the user is identified by their email via `posthog.identify()`
- The anonymous session is merged with the identified user via `posthog.alias()`, so all pre-checkout activity (card views, add-to-cart events) is linked to the identified user

### Error Tracking

Unhandled JavaScript errors and promise rejections are automatically captured and sent to PostHog via the `capture_exceptions` option.

### Auto-Captured Events

PostHog also automatically captures:
- **Pageviews** — every page navigation
- **Pageleaves** — when a user leaves the page

## Tech Stack

- [Next.js](https://nextjs.org) (App Router)
- TypeScript
- Tailwind CSS
- [PostHog](https://posthog.com) (analytics, user identification, error tracking)
- [Scryfall API](https://scryfall.com/docs/api) (free, no API key required)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure PostHog

Copy the example environment file and add your PostHog project API key:

```bash
cp .env.local.example .env.local
```

Then open `.env.local` and replace the placeholder with your key:

```
NEXT_PUBLIC_POSTHOG_KEY=phc_your_actual_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

You can find your project API key in PostHog under **Settings > Project API Key**. If your PostHog instance is EU-hosted, change the host to `https://eu.i.posthog.com`.

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  app/
    page.tsx              # Main store page (server component)
    layout.tsx            # Root layout with CartProvider and PostHogProvider
    api/cards/route.ts    # API route for fetching cards client-side
  components/
    StorePage.tsx         # Store UI with set filter and card grid
    CardItem.tsx          # Individual card display with analytics
    CardModal.tsx         # Card detail popup with flip support and view tracking
    Cart.tsx              # Shopping cart sidebar
    Checkout.tsx          # Checkout with user identification and purchase tracking
    PostHogProvider.tsx   # Client component that initializes PostHog
  context/
    CartContext.tsx        # Cart state management
  lib/
    posthog.ts            # PostHog initialization and configuration
    scryfall.ts           # Scryfall API client
    types.ts              # TypeScript types and utility functions
```
