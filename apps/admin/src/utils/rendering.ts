/**
 * Creates iterative array which is full of numbers which are representative indexes of each entry.
 * Created mainly as a helper to create for loop and repeat some components.
 * @param length length of a resulted array
 * @returns returns array full of numbers which are resulting from 0 to your provided (length - 1)
 * @example
 *
 * ### Generating an array
 * ```ts
 * import { createIterativeArray } from "@shared/utils"
 * const iterativeArray = createIterativeArray(4);
 * ```
 *
 * ### Using that array in a component
 *
 * ```ts
 *  const Component: VFC = () => <ul>{iterativeArray.map( index => <ul>{index}</ul> )}</ul>
 * ```
 */
export const createIterativeArray = (length: number) =>
  Array.from({ length }).map((val, index) => index);
