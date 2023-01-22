import { FileItem } from '@prom-cms/api-client';
import { ItemID } from '@prom-cms/shared';
import { createContext, useContext, useReducer } from 'react';

type ContextReadonlyKeys = Omit<ISmallFileListContext, 'updateValues'>;

export interface ISmallFileListContext {
  files: FileItem[];
  isLoading: boolean;
  searchValue: string;
  selectedFiles: ItemID[];
  isUploading: boolean;
  multiple: boolean;
  updateValue: <T extends keyof ContextReadonlyKeys>(config: {
    name: T;
    value: ISmallFileListContext[T];
  }) => void;
}

function reducer<T extends keyof ISmallFileListContext>(
  state: ContextReadonlyKeys,
  {
    name,
    value,
  }: {
    name: T;
    value: ISmallFileListContext[T];
  }
) {
  return { ...state, [name]: value };
}

const initialValues: ISmallFileListContext = {
  searchValue: '',
  multiple: false,
  files: [],
  isUploading: false,
  isLoading: true,
  selectedFiles: [],
  updateValue: () => {},
};

export const useSmallFileListContextReducer = (
  bonusInitialValues: Partial<ISmallFileListContext> = {}
) => useReducer(reducer, { ...initialValues, ...bonusInitialValues });

export const SmallFileListContext =
  createContext<ISmallFileListContext>(initialValues);

export const useSmallFileList = () => useContext(SmallFileListContext);
