export function capitalizeFirstLetter(
  string: string,
  lowerRest: boolean = true
) {
  return (
    string.charAt(0).toUpperCase() +
    (lowerRest ? string.slice(1).toLowerCase() : string.slice(1))
  );
}
