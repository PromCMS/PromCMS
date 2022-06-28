export type WhereQueryParam = Record<
  string,
  | {
      value: string | number
      manipulator: 'LIKE' | '>' | '<' | '=' | string
    }
  | {
      value: (string | number)[]
      manipulator: 'IN'
    }
>
