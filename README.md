# HTIS

Real-Time High-Traffic Inventory System

Prerequisites

- Node.js (20+)
- pnpm

Quick start

- Install deps: `pnpm install`
- Run server: `cd server && pnpm install && pnpm run dev`
- Run client: `cd client && pnpm install && pnpm run dev`
- Run DB: `docker compose up -d`

Notes

- API request samples are in the `Request/` folder.
- Server config and env are under `server/config`.
- Auth is not implemented. You can use Request(users.rest to generate simple User)
- .env file is committed since it doesn't contain any sensitive info

60s expiration logic:

- Backend -->>> "Stock Recovery" Worker: I've used a setInterval on the server that runs every 10 seconds. It queries the Reservations table for any records created more than 60 seconds ago with a status of reserved. It then atomistically marks them as expired and increments the availableStock back into the Drops table.
- Frontend -->>> Effect: Localstorage + expiry. A timeout is spawned when reservation is created. After a minutes passes it puts things back to previous state.

Concurrency:

- Row-Level Locking: When a user clicks "Reserve," I execute a Sequelize transaction using Lock: Transaction.LOCK.UPDATE. This locks the specific "Drop" row in PostgreSQL, forcing any other simultaneous requests for that same item to wait until the first transaction finishes.
- Atomic Decrement: Within that same transaction, we perform a check: if (drop.availableStock > 0). If true, I decrement the stock and create the reservation in a single atomic step.
- No "Double-Dipping": Because the stock is deducted at the Reservation phase rather than the Purchase phase, I ensure that the number of items "held" never exceeds the physical stock, even if 10,000 users click the button at the exact same millisecond.
