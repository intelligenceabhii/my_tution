// SQLite serializes UTC timestamps without a timezone suffix.
export function serverDate(value) {
  return new Date(value && !/(Z|[+-]\d{2}:?\d{2})$/i.test(value) ? `${value}Z` : value)
}
