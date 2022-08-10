import { SmallFileListProps } from '@components/FilePickerModal/SmallFileList';
import { ItemID } from '@prom-cms/shared';
import { PropsWithChildren, useCallback, useEffect, useReducer } from 'react';
import { FC, useContext } from 'react';
import { createContext } from 'react';
import { GalleryToolData } from '../GalleryTool';

type ContextData = GalleryToolData & {
  removeFile: (id: ItemID) => void;
  changeMetadata: (
    type: 'title' | 'description',
    id: ItemID,
    value: string
  ) => void;
  readOnly: boolean;
  addFile: SmallFileListProps['onChange'];
  changeLabel: (value: string) => void;
};

const GalleryToolViewContext = createContext<ContextData>({
  fileIds: [],
  label: '',
  changeMetadata: () => {},
  removeFile: () => {},
  addFile: () => {},
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

  useEffect(() => setState({ ...initialData }), [initialData, readOnly]);
  useEffect(() => onDataChange(state), [state, onDataChange]);

  const addFile = useCallback<SmallFileListProps['onChange']>(
    (itemIds) =>
      setState(({ fileIds = [], ...restState }) => {
        const stateFileIds = fileIds.map(({ id }) => id);

        fileIds = fileIds.filter(({ id }) => itemIds.includes(id));

        // If they are already selected then there is no point in adding them again
        const newItemIds = itemIds.filter(
          (currentId) => !stateFileIds.includes(currentId)
        );
        fileIds.push(...newItemIds.map((id) => ({ id })));

        return { ...restState, fileIds };
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
      value={{
        ...state,
        readOnly,
        changeMetadata,
        removeFile,
        addFile,
        changeLabel: onTextInput,
      }}
    >
      {children}
    </GalleryToolViewContext.Provider>
  );
};
