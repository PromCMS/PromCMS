import { FilePickerProps } from '@components/form/FilePicker';
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { FC, useContext } from 'react';
import { createContext } from 'react';

import { ItemID } from '@prom-cms/api-client';

import { GalleryToolData } from '../GalleryTool';

type ContextData = GalleryToolData & {
  removeFile: (id: ItemID) => void;
  changeMetadata: (
    type: 'title' | 'description',
    id: ItemID,
    value: string
  ) => void;
  readOnly: boolean;
  setFiles: FilePickerProps['onChange'];
  changeLabel: (value: string) => void;
};

const GalleryToolViewContext = createContext<ContextData>({
  fileIds: [],
  label: '',
  changeMetadata: () => {},
  removeFile: () => {},
  setFiles: () => {},
  changeLabel: () => {},
  readOnly: false,
});

export const useGalleryToolViewContext = () =>
  useContext(GalleryToolViewContext);

const reducer = (
  prevState: GalleryToolData,
  change:
    | Partial<GalleryToolData>
    | ((data: GalleryToolData) => Partial<GalleryToolData>)
) => ({
  ...prevState,
  ...(typeof change === 'function' ? change(prevState) : change),
});

export const GalleryToolViewContextProvider: FC<
  PropsWithChildren<{
    initialData: GalleryToolData;
    onDataChange: (data: Partial<GalleryToolData>) => void;
    readOnly: boolean;
  }>
> = ({ children, initialData, onDataChange, readOnly }) => {
  const [state, setState] = useReducer(reducer, { ...initialData });

  useEffect(() => {
    setState({ ...initialData });
  }, [initialData, readOnly]);
  useEffect(() => {
    onDataChange(state);
  }, [state, onDataChange]);

  const setFiles = useCallback<ContextData['setFiles']>(
    (itemIds) =>
      setState(({ fileIds = [], ...restState }) => {
        const newFiles: typeof fileIds = [];

        if (itemIds) {
          for (const itemId of itemIds) {
            const existingItem = fileIds.find(
              ({ id }) => itemId === String(id)
            );

            newFiles.push(
              existingItem || {
                id: itemId,
              }
            );
          }
        }

        return {
          ...restState,
          fileIds: newFiles,
        };
      }),
    []
  );

  const removeFile = useCallback(
    (imageIdToRemove: ItemID) =>
      setState(({ fileIds = [], ...restState }) => ({
        ...restState,
        fileIds: fileIds.filter(({ id }) => imageIdToRemove !== id),
      })),
    []
  );

  const onTextInput = useCallback(
    (value) => setState((prevState) => ({ ...prevState, label: value })),
    []
  );

  const changeMetadata = useCallback(
    (type: 'title' | 'description', id: ItemID, value: string) =>
      setState(({ fileIds = [], ...restState }) => {
        // we surely know that files does have some values
        fileIds[fileIds.findIndex(({ id: currentId }) => id === currentId)][
          type
        ] = value;

        return { fileIds, ...restState };
      }),
    []
  );

  return (
    <GalleryToolViewContext.Provider
      value={useMemo(
        () => ({
          ...state,
          readOnly,
          changeMetadata,
          removeFile,
          setFiles,
          changeLabel: onTextInput,
        }),
        [state, readOnly, changeMetadata, removeFile, onTextInput, setFiles]
      )}
    >
      {children}
    </GalleryToolViewContext.Provider>
  );
};
