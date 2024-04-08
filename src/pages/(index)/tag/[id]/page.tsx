import { Input } from 'shadcn-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useParams } from 'servite/client';
import { db } from '@/models/db';
import { MemoEditor } from '@/components/MemoEditor';
import { MemoList } from '@/components/MemoList';

export default function Page() {
  const { id } = useParams();

  const memos = useLiveQuery(() => {
    if (id) {
      return db.memos
        .where('deleted')
        .notEqual(1)
        .filter(memo => (memo.tags || []).includes(id))
        .reverse()
        .toArray();
    }
    return [];
  }, [id]);

  return (
    <div className="">
      <MemoEditor />
      <div className="h-16 mt-1.5 flex items-center">
        <h2 className="flex items-center text-base text-muted-foreground font-bold">
          #{id}
        </h2>
        <Input className="w-64 ml-auto" placeholder={`搜索 #${id}`} />
      </div>
      <MemoList memos={memos} />
    </div>
  );
}
