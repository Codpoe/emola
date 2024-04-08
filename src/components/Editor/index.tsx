import { useEffect, useRef, useState } from 'react';
import { BlockNoteView } from '@blocknote/react';
import { cn } from '../../utils';
import { useEditor, IEditor, IPartialBlock } from '@/hooks/useEditor';
import '@blocknote/react/style.css';
import './index.css';

interface ClientEditorProps {
  editable?: boolean;
  initialContent?: IPartialBlock[];
  sideMenu?: boolean;
  getEditor?: (editor: IEditor) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const PLACEHOLDER = '输入“/”使用命令';

function ClientEditor(props: ClientEditorProps) {
  const {
    editable = true,
    initialContent,
    className,
    children,
    getEditor,
    ...restProps
  } = props;

  const getEditorRef = useRef(getEditor);
  getEditorRef.current = getEditor;

  const editor = useEditor({ initialContent });

  useEffect(() => {
    getEditorRef.current?.(editor);
  }, [editor]);

  return (
    <BlockNoteView
      {...restProps}
      className={cn(
        'relative focus-within:ring-1 focus-within:ring-ring',
        className
      )}
      editable={editable}
      editor={editor}
    >
      {children}
    </BlockNoteView>
  );
}

export interface EditorProps extends ClientEditorProps {
  /**
   * @default false
   */
  ssr?: boolean;
  ssrClassName?: string;
  ssrStyle?: React.CSSProperties;
}

let _mounted = false;

export function Editor(props: EditorProps) {
  const { ssr = false, ssrClassName, ssrStyle, ...restProps } = props;
  const [mounted, setMounted] = useState(_mounted);

  useEffect(() => {
    _mounted = true;
    setMounted(true);
  }, []);

  return mounted ? (
    <ClientEditor {...restProps} />
  ) : (
    ssr && (
      <div className={cn('ssr-editor', ssrClassName)} style={ssrStyle}>
        <div className="text-base text-muted-foreground">{PLACEHOLDER}</div>
      </div>
    )
  );
}
