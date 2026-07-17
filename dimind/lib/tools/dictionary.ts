function normalizeQuery(raw: unknown): string {
  let query = "";
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    for (const key of ["word", "term", "query", "text"]) {
      const value = obj[key];
      if (typeof value === "string" && value.trim()) {
        query = value;
        break;
      }
    }
  } else if (typeof raw === "string") {
    query = raw;
  }

  return query
    .toLowerCase()
    .replace(/define/g, "")
    .replace(/meaning of/g, "")
    .replace(/what is/g, "")
    .replace(/what's/g, "")
    .trim();
}

export async function lookupDictionary(rawQuery: unknown): Promise<string> {
  const word = normalizeQuery(rawQuery);
  if (!word) return "Dictionary error: missing word";

  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
    );
    if (!res.ok) return `Sorry, I couldn't find the meaning of '${word}'.`;

    const data = await res.json();
    const entry = Array.isArray(data) ? data[0] : null;
    if (!entry) return `Sorry, I couldn't find the meaning of '${word}'.`;

    let result = `Meaning of '${word}':\n\n`;
    for (const meaning of entry.meanings ?? []) {
      if (meaning.partOfSpeech) result += `${meaning.partOfSpeech}:\n`;
      const definitions = (meaning.definitions ?? []).slice(0, 3);
      definitions.forEach((def: any, i: number) => {
        result += `${i + 1}. ${def.definition ?? "No definition available"}\n`;
      });
      result += "\n";
    }
    return result.trim();
  } catch {
    return `Sorry, I couldn't find the meaning of '${word}'.`;
  }
}
