type DataType = string | number | Record<string, any>;

export type Settings = {
  name: string,
  label: string,
  content: {
    type: string,
    data: DataType | DataType[]
  }
}