export type WhereQueryParameter = Record<
  string,
  | {
      value: string | number;
      manipulator:
        | 'LIKE'
        | 'NOTLIKE'
        | 'IN'
        | 'NOT IN'
        | '>'
        | '<'
        | '='
        | string;
    }
  | {
      value: (string | number)[];
      manipulator: 'IN';
    }
>;
