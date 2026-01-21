function isPlainObject(val: any): val is Record<string, any> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

export function deepMerge<T extends Record<string, any>>(
  base: T,
  override?: Partial<T>,
): T {
  if (!override) return { ...base };

  const result: any = { ...base };

  for (const key in override) {
    const oVal = override[key];
    const bVal = base[key];

    if (isPlainObject(bVal) && isPlainObject(oVal)) {
      result[key] = deepMerge(bVal, oVal);
    } else if (oVal !== undefined) {
      result[key] = oVal;
    }
  }

  return result;
}
