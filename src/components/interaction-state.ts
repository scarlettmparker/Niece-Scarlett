const TTL_MS = 15 * 60 * 1000;

interface StateEntry<T> {
  value: T;
  timer: ReturnType<typeof setTimeout>;
}

const state = new Map<string, StateEntry<unknown>>();

/**
 * Stores per-interaction state for the TTL and returns its token.
 *
 * @param value the state to store
 * @return the token embedded in component custom ids
 */
export function setState<T>(value: T): string {
  const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const entry: StateEntry<T> = {
    value,
    timer: setTimeout(() => state.delete(token), TTL_MS),
  };
  state.set(token, entry);
  return token;
}

/**
 * Reads stored state, or undefined when expired or unknown.
 *
 * @param token the state token
 */
export function getState<T>(token: string): T | undefined {
  return state.get(token)?.value as T | undefined;
}

/**
 * Merges a patch into stored state.
 *
 * @param token the state token
 * @param patch the fields to overwrite
 */
export function updateState<T>(token: string, patch: Partial<T>): void {
  const entry = state.get(token);
  if (entry) {
    entry.value = { ...(entry.value as T), ...patch };
  }
}

/**
 * Removes stored state and stops its expiry timer.
 *
 * @param token the state token
 */
export function deleteState(token: string): void {
  const entry = state.get(token);
  if (entry) {
    clearTimeout(entry.timer);
  }
  state.delete(token);
}
