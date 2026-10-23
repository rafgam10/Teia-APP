let sequence = 0;

// Identifiers only; these are not security tokens.
export function createId(prefix: string) {
  sequence += 1;
  return `${prefix}-${Date.now().toString(36)}-${sequence.toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
