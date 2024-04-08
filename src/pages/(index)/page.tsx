import { Input } from 'shadcn-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/models/db';
import { MemoEditor } from '@/components/MemoEditor';
import { MemoList } from '@/components/MemoList';

export default function Page() {
  const memos = useLiveQuery(
    () => db.memos.where('deleted').notEqual(1).reverse().toArray(),
    []
  );

  return (
    <div className="">
      <MemoEditor />
      <div className="h-16 mt-1.5 flex items-center">
        <h2 className="flex items-center text-base text-muted-foreground font-bold">
          MEMO
        </h2>
        <Input className="w-64 ml-auto" placeholder="搜索 MEMO" />
      </div>
      <MemoList memos={memos} />
    </div>
  );
}
