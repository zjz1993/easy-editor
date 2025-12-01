export function deepMerge<T>(target: T, source: Partial<T>): T {
  const output = { ...target };

  for (const key in source) {
    const srcVal = source[key];
    const tgtVal = target[key];

    if (
      srcVal &&
      typeof srcVal === 'object' &&
      !Array.isArray(srcVal) &&
      typeof tgtVal === 'object'
    ) {
      // 递归 merge
      output[key] = deepMerge(tgtVal as any, srcVal as any) as any;
    } else if (srcVal !== undefined) {
      output[key] = srcVal as any;
    }
  }

  return output;
}
