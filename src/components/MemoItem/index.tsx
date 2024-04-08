import { Button, Dropdown, toast } from 'shadcn-react';
import {
  DownloadIcon,
  EllipsisVerticalIcon,
  PencilLineIcon,
  TrashIcon,
  UndoIcon,
} from 'shadcn-react/icons';
import { BlockNoteEditor } from '@blocknote/core';
import { Editor } from '../Editor';
import { Memo } from '@/models/Memo';
import { db } from '@/models/db';
import { downloadStringAsFile, formatDate } from '@/utils';
import { IEditor, schema } from '@/hooks/useEditor';
import './index.css';

export interface MemoItemProps {
  memo: Memo;
  recycle?: boolean;
}

let editor: IEditor;

function ensureEditor() {
  return (editor ??= BlockNoteEditor.create({ schema }));
}

export function MemoItem(props: MemoItemProps) {
  const { memo, recycle } = props;

  const handleDelete = async () => {
    await db.deleteMemo(memo.id!);
    toast.success('已放入回收站');
  };

  const handleRecycle = async () => {
    await db.recycleMemo(memo.id!);
    toast.success('已移出回收站');
  };

  const handleExportToMarkdown = async () => {
    const markdown = await ensureEditor().blocksToMarkdownLossy(memo.content);
    downloadStringAsFile(markdown, 'text/plain', `${memo.id!}.md`);
  };

  const handleExportToHtml = async () => {
    const html = await ensureEditor().blocksToHTMLLossy(memo.content);
    downloadStringAsFile(html, 'text/html', `${memo.id!}.html`);
  };

  return (
    <div className="memo-item pb-5 mb-5 border-b border-border">
      <div className="flex items-center">
        <div className="text-sm text-muted-foreground">
          {recycle
            ? `删除于 ${formatDate(memo.updatedAt, true)}`
            : formatDate(memo.createdAt, true)}
        </div>
        <Dropdown
          align="end"
          content={
            recycle ? (
              <Dropdown.Item icon={<UndoIcon />} onClick={handleRecycle}>
                恢复
              </Dropdown.Item>
            ) : (
              <>
                <Dropdown.Item icon={<PencilLineIcon />}>编辑</Dropdown.Item>
                <Dropdown.Sub
                  icon={<DownloadIcon />}
                  content={
                    <>
                      <Dropdown.Item disabled onClick={handleExportToMarkdown}>
                        Markdown（暂不可用）
                      </Dropdown.Item>
                      <Dropdown.Item disabled onClick={handleExportToHtml}>
                        HTML（暂不可用）
                      </Dropdown.Item>
                    </>
                  }
                >
                  导出为
                </Dropdown.Sub>
                <Dropdown.Separator />
                <Dropdown.Item
                  icon={<TrashIcon />}
                  className="text-destructive focus:text-destructive hover:text-destructive"
                  onClick={handleDelete}
                >
                  放入回收站
                </Dropdown.Item>
              </>
            )
          }
        >
          <Button
            className="ml-auto -mr-3 focus-visible:ring-0"
            variant="ghost"
            size="icon"
            icon={<EllipsisVerticalIcon />}
          />
        </Dropdown>
      </div>
      <Editor editable={false} initialContent={memo.content} />
    </div>
  );
}
