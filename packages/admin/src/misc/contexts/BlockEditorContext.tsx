import {
  createContext,
  FC,
  MutableRefObject,
  PropsWithChildren,
  useContext,
  useMemo,
  useRef,
} from 'react';

import type EditorJS from '@editorjs/editorjs';

export type BlockEditorContext = {
  refs: MutableRefObject<Record<string, EditorJS> | undefined>;
  add(key: string, value: any): void;
  remove(key: string): void;
};

export const blockEditorRefsContext = createContext<BlockEditorContext>({
  refs: { current: {} },

  add() {},
  remove() {},
});

export const useBlockEditorRefs = () => useContext(blockEditorRefsContext);

export const BlockEditorRefsProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const refs = useRef<Record<string, EditorJS>>();

  const contextValue = useMemo(
    (): BlockEditorContext => ({
      refs,
      add(key, value) {
        if (!refs.current) {
          refs.current = {};
        }

        refs.current[key] = value;
      },
      remove(key) {
        if (refs.current && refs.current[key]) {
          delete refs.current[key];
        }
      },
    }),
    [refs]
  );

  return (
    <blockEditorRefsContext.Provider value={contextValue}>
      {children}
    </blockEditorRefsContext.Provider>
  );
};
