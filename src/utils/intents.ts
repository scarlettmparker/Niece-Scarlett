import { tokenize, wordsMatch } from "@sun/utils/nlp";
import { resolvePageData } from "~/utils/page-data.js";
import type { QuerySchema } from "~/types/query.js";

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
  /**
   * The natural-language query schema for the command, when queryable.
   */
  query?: QuerySchema;
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

/**
 * Locates a command's intent, including its query schema when queryable.
 *
 * @param command the command name
 */
export async function getIntent(command: string): Promise<CommandIntent | undefined> {
  const intent = await resolvePageData<CommandIntent>("intent", "command-intent/:name", {
    name: command,
  });
  return intent.command === command ? intent : undefined;
}
