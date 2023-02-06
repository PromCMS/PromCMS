export const stringifyJSONRecursive = (obj: object) => {
  const cache = new Set();
  return JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) {
          // Circular reference found, discard key
          return;
        }
        // Store value in our collection
        cache.add(value);
      }
      return value;
    },
    4
  );
};
