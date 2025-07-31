/**
 * Utility function to conditionally join CSS class names together
 * 
 * @param classes - CSS class names to be joined
 * @returns A string of CSS class names
 */
export function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
