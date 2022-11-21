export const removeDiacritics = (input: string) =>
  input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
