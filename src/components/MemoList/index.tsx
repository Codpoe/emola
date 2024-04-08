import { MemoItem } from '@/components/MemoItem';
import { Memo } from '@/models/Memo';

export interface MemoListProps {
  memos?: Memo[];
  recycle?: boolean;
}

export function MemoList(props: MemoListProps) {
  const { memos, recycle } = props;

  if (memos?.length === 0) {
    return (
      <div className="flex flex-col items-center mt-6">
        <span className="text-4xl">🫥</span>
        <h3 className="mt-2 text-sm text-primary font-semibold">No memos</h3>
      </div>
    );
  }

  return (
    <div className="">
      {memos?.map(memo => (
        <MemoItem key={memo.id!} memo={memo} recycle={recycle} />
      ))}
    </div>
  );
}
