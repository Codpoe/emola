import { Breadcrumb, Input } from 'shadcn-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Link, useParams } from 'servite/client';
import { db } from '@/models/db';
import { MemoEditor } from '@/components/MemoEditor';
import { formatDate } from '@/utils';
import { MemoList } from '@/components/MemoList';

export default function Page() {
  const { day = '' } = useParams();

  const memos = useLiveQuery(
    () =>
      db.memos
        .where('deleted')
        .notEqual(1)
        .filter(x => formatDate(x.createdAt) === day)
        .reverse()
        .limit(1)
        .toArray(),
    [day]
  );

  return (
    <div className="">
      <MemoEditor />
      <div className="h-16 mt-1.5 flex items-center">
        <Breadcrumb>
          <Breadcrumb.Item variant="link">
            <Link className="text-base text-muted-foreground font-bold" to="/">
              MEMO
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item variant="page">
            <span className="text-base text-muted-foreground">{day}</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <Input className="w-64 ml-auto" placeholder={`搜索 MEMO on ${day}`} />
      </div>
      <MemoList memos={memos} />
    </div>
  );
}
