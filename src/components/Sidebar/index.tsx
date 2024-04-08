import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo } from 'react';
import { matchPath, useLocation, useNavigate } from 'servite/client';
import {
  Sidebar as LibSidebar,
  SidebarProps,
  isSidebarGroup,
} from 'shadcn-react';
import { HashIcon, LayoutGridIcon, TrashIcon } from 'shadcn-react/icons';
import { CountGrid } from '../CountGrid';
import { db } from '@/models/db';

export function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const memosCount = useLiveQuery(
    () => db.memos.where('deleted').notEqual(1).count(),
    []
  );

  const deletedCount = useLiveQuery(
    () => db.memos.where('deleted').equals(1).count(),
    []
  );

  const tags = useLiveQuery(
    () => db.tags.where('memoCount').above(0).sortBy('createdAt'),
    []
  );

  const sidebarItems = useMemo<SidebarProps['items']>(
    () => [
      {
        value: '/',
        title: 'MEMO',
        icon: <LayoutGridIcon />,
        badge: memosCount || '',
      },
      {
        value: '/recycle',
        title: '回收站',
        icon: <TrashIcon />,
        badge: deletedCount || '',
      },
      ...(tags?.length
        ? [
            {
              title: (
                <span className="text-xs text-muted-foreground">全部标签</span>
              ),
              children: tags.map(tag => ({
                value: `/tag/${encodeURIComponent(tag.id)}`,
                title: tag.id,
                icon: <HashIcon />,
                badge: tag.memoCount || '',
              })),
            },
          ]
        : []),
    ],
    [memosCount, deletedCount, tags]
  );

  const sidebarValue = useMemo(() => {
    function matchSidebar(items: SidebarProps['items']): string | undefined {
      for (const item of items) {
        if (isSidebarGroup(item)) {
          return matchSidebar(item.children);
        }

        if (matchPath(item.value, pathname)) {
          return item.value;
        }

        if (item.value === '/' && pathname.startsWith('/day/')) {
          return item.value;
        }
      }

      return undefined;
    }

    return matchSidebar(sidebarItems);
  }, [pathname, sidebarItems]);

  const handleSidebarValueChange = (value: string) => {
    // value is pathname
    navigate(value);
  };

  return (
    <div className="w-[276px] flex-shrink-0 sticky top-[65px] z-30">
      <CountGrid />
      <LibSidebar
        className="mt-2"
        width="100%"
        items={sidebarItems}
        value={sidebarValue}
        onChange={handleSidebarValueChange}
      />
    </div>
  );
}
