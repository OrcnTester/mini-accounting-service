let _idCounter = 1;

export function nextId(prefix: string = "id"): string {
  return `${prefix}_${_idCounter++}`;
}
