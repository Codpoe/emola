import { Input } from 'shadcn-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useDeferredValue, useState } from 'react';
import { db } from '@/models/db';
import { MemoEditor } from '@/components/MemoEditor';
import { MemoList } from '@/components/MemoList';

export default function Page() {
  const [searchValue, setSearchValue] = useState('');
  const deferredSearchValue = useDeferredValue(searchValue);

  const memos = useLiveQuery(() => {
    if (deferredSearchValue) {
      return db.memos
        .where('deleted')
        .notEqual(1)
        .filter(x => x.contentText.includes(deferredSearchValue.toLowerCase()))
        .reverse()
        .toArray();
    }

    return db.memos.where('deleted').notEqual(1).reverse().toArray();
  }, [deferredSearchValue]);

  return (
    <div className="">
      <MemoEditor />
      <div className="h-16 mt-1.5 flex items-center">
        <h2 className="flex items-center text-base text-muted-foreground font-bold">
          MEMO
        </h2>
        <Input
          className="w-64 ml-auto"
          placeholder="搜索 MEMO"
          value={searchValue}
          onChange={e => setSearchValue(e.currentTarget.value)}
        />
      </div>
      <MemoList memos={memos} />
    </div>
  );
}
