export let userHasBeenLoggedOff;

if (typeof window !== 'undefined') {
  userHasBeenLoggedOff = new CustomEvent('userHasBeenLoggedOff');
}
