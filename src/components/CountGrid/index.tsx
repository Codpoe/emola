import { Tooltip } from 'shadcn-react';
import { subDays, endOfWeek } from 'date-fns';
import { useLiveQuery } from 'dexie-react-hooks';
import { Link } from 'servite/client';
import { db } from '@/models/db';
import { cn, formatDate } from '@/utils';

const DAYS_COUNT = 7 * 12;

const today = formatDate(new Date());
const lastDay = endOfWeek(today, { weekStartsOn: 1 });

const days = Array.from({ length: DAYS_COUNT })
  .map((_, index) => subDays(lastDay, index))
  .map(x => formatDate(x))
  .reverse();

export function CountGrid() {
  const memosCountByDay = useLiveQuery(async () => {
    const memos = await db.memos
      .where('createdAt')
      .above(new Date(days[0]))
      .filter(x => x.deleted !== 1)
      .toArray();

    const memosCountByDay = memos.reduce(
      (acc, memo) => {
        const str = formatDate(memo.createdAt);

        if (!acc[str]) {
          acc[str] = 1;
        } else {
          acc[str]++;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    return memosCountByDay;
  }, []);

  return (
    <div className="px-7 grid grid-rows-7 grid-cols-12 grid-flow-col justify-between gap-[3px]">
      {days.map(day => {
        const count = memosCountByDay?.[day] || 0;

        return (
          <Tooltip
            key={day}
            content={`${count} memo on ${day} `}
            delayDuration={300}
          >
            <Link
              className={cn(
                `w-3.5 h-3.5 rounded-[2px] bg-secondary cursor-pointer`,
                day === today && 'border border-primary/30',
                {
                  'bg-primary/20': count > 0 && count < 3,
                  'bg-primary/35': count >= 3 && count < 5,
                  'bg-primary/50': count >= 5,
                }
              )}
              to={`/day/${day}`}
            />
          </Tooltip>
        );
      })}
    </div>
  );
}
