import Dexie, { Table } from 'dexie';
import { populate } from './populate';
import { Memo } from './Memo';
import { Tag } from './Tag';

export class MemoDB extends Dexie {
  memos!: Table<Memo, number>;
  tags!: Table<Tag, string>;

  constructor() {
    super('MemoDB');
    this.version(1).stores({
      memos: '++id, createdAt, updatedAt, content, tags, deleted',
      tags: 'id, createdAt, updatedAt, memoCount',
    });
  }

  async putMemo(memo: Omit<Memo, 'updatedAt'> & { updatedAt?: Date }) {
    // 从 memo 中解析 tags
    const tags = this.extractTags(memo.content || []);

    // 更新 memos
    await this.memos.put({
      ...memo,
      updatedAt: new Date(),
      tags,
    });

    // 更新 tags
    await Promise.all(
      tags.map(async tag => {
        const existing = await this.tags.get(tag);

        if (existing) {
          await this.tags.update(tag, {
            updatedAt: new Date(),
            memoCount: existing.memoCount + 1,
          });
        } else {
          await this.tags.add({
            id: tag,
            createdAt: new Date(),
            updatedAt: new Date(),
            memoCount: 1,
          });
        }
      })
    );
  }

  async deleteMemo(id: number) {
    const existing = await this.memos.get(id);

    if (!existing) {
      return;
    }

    // 删除 memo
    // @ts-ignore
    await this.memos.update(id, {
      updatedAt: new Date(),
      deleted: 1,
    });

    // 更新 tag 的 memoCount
    await Promise.all(
      (existing.tags || []).map(async tag => {
        const existingTag = await this.tags.get(tag);

        if (existingTag) {
          await this.tags.update(tag, {
            updatedAt: new Date(),
            memoCount: existingTag.memoCount - 1,
          });
        }
      })
    );
  }

  async recycleMemo(id: number) {
    const existing = await this.memos.get(id);

    if (!existing) {
      return;
    }

    // 恢复 memo
    await this.memos.update(id, {
      updatedAt: new Date(),
      deleted: 0,
    });

    // 更新 tag 的 memoCount
    await Promise.all(
      (existing.tags || []).map(async tag => {
        const existingTag = await this.tags.get(tag);

        if (existingTag) {
          await this.tags.update(tag, {
            updatedAt: new Date(),
            memoCount: existingTag.memoCount + 1,
          });
        }
      })
    );
  }

  private extractTags(content: Memo['content']): string[] {
    return content.reduce((acc, cur) => {
      if (Array.isArray(cur.content)) {
        for (const item of cur.content) {
          if (item.type === 'tag') {
            acc.push(item.props.name);
          }
        }
      }
      return acc;
    }, [] as string[]);
  }
}

export const db = new MemoDB();

db.on('populate', populate);
