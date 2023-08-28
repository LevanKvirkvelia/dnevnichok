export function errorToString(
  error: any,
  defaultMessage = 'Произошла ошибка',
): string {
  return (
    (typeof error === 'string' && error) ||
    error?.message ||
    error?.error ||
    defaultMessage
  );
}
