import { useEffect, useRef, useState } from 'react';
import { Button, Input, Label, Popover } from 'shadcn-react';
import { CheckIcon, HashIcon, SendHorizontalIcon } from 'shadcn-react/icons';
import { Editor } from '../Editor';
import { db } from '@/models/db';
import { IEditor, IPartialBlock } from '@/hooks/useEditor';
import { trimDoc, trimDocText } from '@/utils';
import './index.css';

export interface MemoEditorProps {
  memoId?: number;
  initialContent?: IPartialBlock[];
  autoFocus?: boolean;
  showCancelBtn?: boolean;
  onCancel?: () => void;
  onSend?: () => void;
}

export function MemoEditor(props: MemoEditorProps) {
  const { memoId, initialContent, autoFocus, showCancelBtn, onCancel, onSend } =
    props;

  const editorRef = useRef<IEditor>();
  const insertTagBtnRef = useRef<HTMLButtonElement>(null);
  const [hasContent, setHasContent] = useState(false);
  const [tagName, setTagName] = useState<string>('');

  const handleInsertTag = () => {
    if (!editorRef.current || !tagName) {
      return;
    }

    // 插入标签到编辑器文档中
    editorRef.current.insertInlineContent([
      {
        type: 'tag',
        props: {
          name: tagName,
        },
      },
    ]);

    // 清楚 tagName state
    setTagName('');
    // 模拟点击，以关闭 Popover
    insertTagBtnRef.current?.click();
  };

  const handleSend = async () => {
    if (editorRef.current) {
      const content = trimDoc(editorRef.current.document);

      if (content.length) {
        await db.putMemo({
          id: memoId,
          content,
          contentText: trimDocText(editorRef.current.domElement.innerText),
          deleted: 0,
        });

        editorRef.current?.removeBlocks(editorRef.current.document);
        onSend?.();
      }
    }
  };

  useEffect(() => {
    setHasContent(Boolean(trimDoc(editorRef.current?.document).length));
  }, []);

  return (
    <Editor
      className="memo-editor pb-11 border border-input shadow-sm rounded-md"
      ssr
      ssrClassName="h-[118px] px-[18px] py-[9px] border border-input shadow-sm rounded-md"
      sideMenu={false}
      autoFocus={autoFocus}
      initialContent={initialContent}
      getEditor={editor => {
        editorRef.current = editor;
      }}
      onChange={() => {
        setHasContent(Boolean(trimDoc(editorRef.current?.document).length));
      }}
    >
      <div className="absolute h-11 bottom-0 left-0 right-0 px-1.5 z-[1] flex items-center">
        <Popover
          className="px-3 py-2 w-48"
          content={
            <div>
              <Label>插入标签</Label>
              <Input
                className="mt-2"
                placeholder="标签名"
                value={tagName}
                onChange={e => setTagName(e.currentTarget.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleInsertTag();
                  }
                }}
              />
              <Button
                className="w-8 h-8 absolute right-4 bottom-[11px]"
                size="icon"
                variant="ghost"
                icon={<CheckIcon />}
                onClick={handleInsertTag}
              />
            </div>
          }
        >
          <Button
            ref={insertTagBtnRef}
            className="w-8 h-8"
            size="icon"
            variant="ghost"
            icon={<HashIcon className="max-w-3.5 max-h-3.5" />}
          />
        </Popover>
        <div className="ml-auto flex items-center space-x-1.5">
          {showCancelBtn && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              取消
            </Button>
          )}
          <Button disabled={!hasContent} size="sm" onClick={handleSend}>
            <SendHorizontalIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Editor>
  );
}
