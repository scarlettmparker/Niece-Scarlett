export interface CommandIntent {
  /**
   * The intent name.
   */
  name: string;
  /**
   * The command the intent triggers.
   */
  command: string;
  /**
   * The trigger words that map to this intent.
   */
  words: string[];
}

const STOP_WORDS = new Set([
  "a", "an", "the", "to", "for", "of", "and", "or", "in", "on", "at", "by",
  "give", "me", "my", "your", "please", "what", "whats", "is", "are", "was",
  "how", "do", "does", "did", "i", "you", "we", "they", "can", "could",
  "would", "show", "list", "get", "want", "need", "some", "like", "just", "with",
]);

/**
 * Tokenizes text into lowercase words, dropping punctuation and stop words.
 *
 * @param text the utterance
 * @return the remaining words
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length > 0 && !STOP_WORDS.has(word));
}

/**
 * Resolves an utterance to the intent with the most matching words.
 *
 * @param text the utterance
 * @param intents the intent word clouds
 * @return the best intent, or null when nothing matches
 */
export function resolveIntent(
  text: string,
  intents: CommandIntent[]
): CommandIntent | null {
  const tokens = tokenize(text);
  if (tokens.length === 0) {
    return null;
  }

  let best: CommandIntent | null = null;
  let bestScore = 0;
  for (const intent of intents) {
    const score = intent.words.filter((word) => tokens.includes(word)).length;
    if (score > bestScore) {
      best = intent;
      bestScore = score;
    }
  }
  return bestScore > 0 ? best : null;
}
