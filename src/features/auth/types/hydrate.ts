// FILE: src/features/auth/types/hydrate.ts
// PURPOSE: Re-exports HydrateResponseDTO to local feature namespace for clarity and decoupling from shared types.
// NOTES: Serves as alias layer so auth feature code references its own path instead of global types directly.

import type { HydrateResponseDTO } from '../../../types/auth';

export type { HydrateResponseDTO };
