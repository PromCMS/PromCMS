export function capitalizeFirstLetter(
  string: string,
  lowerRest: boolean = true
) {
  return (
    string.charAt(0).toUpperCase() +
    (lowerRest ? string.slice(1).toLowerCase() : string.slice(1))
  );
}

export const removeDiacritics = (input: string) =>
  input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
