# Architecture

Route files compose feature modules; they do not own reusable business logic. Feature actions validate inputs and authenticate requests before querying user data. Shared server helpers live in `src/server` and cannot be imported into client components.

## Ownership

A task belongs to a column, which belongs to a project, which belongs to a user. Task reads and writes constrain that full chain. Reordering also validates every destination column against the selected project. Supplying an owned project ID never authorizes access to unrelated task IDs.

Timer operations resolve the owned task first and derive its project from the database. Remaining time is calculated from server timestamps, not trusted client input. Completion claims the timer using its prior update timestamp inside a transaction before writing session history, preventing duplicate completion requests from creating duplicate reports. Break selection uses the user's configured round count.

Projects have names unique per owner. Deleting a task preserves its historical focus sessions by setting the optional task relation to null.

## Free application and legacy databases

Billing endpoints, SDKs, upgrade dialogs, and paywalls have been removed. Historical migrations are immutable. Legacy billing tables and columns remain in the Prisma schema with `@ignore` / `@@ignore` so existing data is preserved and future migrations do not accidentally drop it. The application has no generated client API for those records. The new migration only scopes project-name uniqueness per owner and preserves history when tasks are deleted.

Apply migrations to a development database before deploying. No production migration is run by the build command.

## Verification scope

The regression suite checks cross-project task boundaries, invalid reorder destinations, configurable timer rules, and settings validation. OAuth, Neon connectivity, and real browser interactions require a configured development environment. Bundled fonts and media retain their existing provenance; confirm redistribution rights before publishing source.
