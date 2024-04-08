import { DependencyList } from 'react';
import {
  BlockNoteSchema,
  defaultInlineContentSpecs,
  defaultBlockSpecs,
  defaultStyleSpecs,
  BlockNoteEditorOptions,
  Block,
  PartialBlock,
} from '@blocknote/core';
import { useCreateBlockNote } from '@blocknote/react';
import { TagSpec } from '@/components/EditorTagSpec';

const PLACEHOLDER = '输入“/”使用命令';

export const schema = BlockNoteSchema.create({
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    tag: TagSpec,
  },
  blockSpecs: defaultBlockSpecs,
  styleSpecs: defaultStyleSpecs,
});

export type IEditor = ReturnType<typeof useEditor>;
export type IBlock = Block<
  typeof schema.blockSchema,
  typeof schema.inlineContentSchema,
  typeof schema.styleSchema
>;
export type IPartialBlock = PartialBlock<
  typeof schema.blockSchema,
  typeof schema.inlineContentSchema,
  typeof schema.styleSchema
>;

export function useEditor(
  options?: Partial<
    BlockNoteEditorOptions<
      typeof schema.blockSchema,
      typeof schema.inlineContentSchema,
      typeof schema.styleSchema
    >
  >,
  deps?: DependencyList
) {
  const editor = useCreateBlockNote(
    {
      schema,
      placeholders: {
        default: PLACEHOLDER,
      },
      ...options,
    },
    deps
  );

  return editor;
}
