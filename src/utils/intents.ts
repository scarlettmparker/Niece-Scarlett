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
 * Computes the Levenshtein edit distance between two strings.
 *
 * @param a the first string
 * @param b the second string
 * @return the minimum number of single-character edits
 */
export function levenshtein(a: string, b: string): number {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const above = prev[j];
      prev[j] = a[i - 1] === b[j - 1] ? diag : Math.min(diag, prev[j - 1], prev[j]) + 1;
      diag = above;
    }
  }
  return prev[b.length];
}

/**
 * Computes the Dice coefficient over the character bigrams of two strings.
 *
 * @param a the first string
 * @param b the second string
 * @return a similarity in [0, 1]
 */
export function bigramSimilarity(a: string, b: string): number {
  if (a.length < 2 || b.length < 2) {
    return 0;
  }
  const bigrams = (value: string) => {
    const set = new Set<string>();
    for (let i = 0; i < value.length - 1; i++) {
      set.add(value.slice(i, i + 2));
    }
    return set;
  };
  const aSet = bigrams(a);
  const bSet = bigrams(b);
  let overlap = 0;
  for (const bigram of aSet) {
    if (bSet.has(bigram)) {
      overlap++;
    }
  }
  return (2 * overlap) / (aSet.size + bSet.size);
}

/**
 * Whether a token plausibly denotes a trigger word, allowing small typos.
 *
 * @param token the utterance token
 * @param word the intent trigger word
 * @return true when the token matches exactly or within the typo threshold
 */
export function wordsMatch(token: string, word: string): boolean {
  if (token === word) {
    return true;
  }
  const threshold = word.length <= 4 ? 1 : 2;
  if (levenshtein(token, word) <= threshold) {
    return true;
  }
  return bigramSimilarity(token, word) >= 0.65;
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
    let score = 0;
    for (const word of intent.words) {
      for (const token of tokens) {
        if (token === word) {
          score += 2;
        } else if (wordsMatch(token, word)) {
          score += 1;
        }
      }
    }
    if (score > bestScore) {
      best = intent;
      bestScore = score;
    }
  }
  return bestScore > 0 ? best : null;
}
