import { Input } from 'shadcn-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useParams } from 'servite/client';
import { useDeferredValue, useState } from 'react';
import { db } from '@/models/db';
import { MemoEditor } from '@/components/MemoEditor';
import { MemoList } from '@/components/MemoList';

export default function Page() {
  const { id } = useParams();
  const [searchValue, setSearchValue] = useState('');
  const deferredSearchValue = useDeferredValue(searchValue);

  const memos = useLiveQuery(() => {
    if (id) {
      if (deferredSearchValue) {
        return db.memos
          .where('deleted')
          .notEqual(1)
          .filter(
            x =>
              (x.tags || []).includes(id) &&
              x.contentText.includes(deferredSearchValue.toLowerCase())
          )
          .reverse()
          .toArray();
      }

      return db.memos
        .where('deleted')
        .notEqual(1)
        .filter(x => (x.tags || []).includes(id))
        .reverse()
        .toArray();
    }
    return [];
  }, [id, deferredSearchValue]);

  return (
    <div key={id} className="">
      <MemoEditor
        initialContent={
          typeof id !== 'undefined'
            ? [
                {
                  type: 'paragraph',
                  content: [{ type: 'tag', props: { name: id } }],
                },
              ]
            : undefined
        }
      />
      <div className="h-16 mt-1.5 flex items-center">
        <h2 className="flex items-center text-base text-muted-foreground font-bold">
          #{id}
        </h2>
        <Input
          className="w-64 ml-auto"
          placeholder={`搜索 #${id}`}
          value={searchValue}
          onChange={e => setSearchValue(e.currentTarget.value)}
        />
      </div>
      <MemoList memos={memos} />
    </div>
  );
}
