import type { IBlock } from '@/hooks/useEditor';

export interface Memo {
  id?: number;
  createdAt: Date;
  updatedAt: Date;
  content: IBlock[];
  contentText: string;
  tags?: string[];
  deleted: 0 | 1;
}
