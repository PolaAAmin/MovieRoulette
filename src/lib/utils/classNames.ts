/**
 * Utility for conditionally joining class names.
 * Similar to clsx but lightweight and typed.
 */
export function cn(
  ...classes: Array<string | undefined | null | false | Record<string, boolean>>
): string {
  return classes
    .flatMap((cls) => {
      if (!cls) return [];
      if (typeof cls === 'string') return cls;
      return Object.entries(cls)
        .filter(([, value]) => value)
        .map(([key]) => key);
    })
    .join(' ');
}