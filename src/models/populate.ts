import { db } from './db';

export async function populate() {
  await db.putMemo({
    createdAt: new Date(),
    content: [
      {
        id: 'aca8a907-501e-40fe-a194-1da447deeab5',
        type: 'paragraph',
        props: {
          textColor: 'default',
          backgroundColor: 'default',
          textAlignment: 'left',
        },
        content: [
          {
            type: 'tag',
            props: {
              name: '碎碎念',
            },
            content: undefined,
          },
        ],
        children: [],
      },
      {
        id: '059553e8-0bb8-4201-a168-8a1a38ea8c4e',
        type: 'paragraph',
        props: {
          textColor: 'default',
          backgroundColor: 'default',
          textAlignment: 'left',
        },
        content: [
          {
            type: 'text',
            text: `👋，我亲爱的朋友\n\n`,
            styles: {},
          },
          {
            type: 'text',
            text: 'emola',
            styles: {
              code: true,
            },
          },
          {
            type: 'text',
            text: ' 是仿 ',
            styles: {},
          },
          {
            type: 'text',
            text: 'flomo',
            styles: {
              code: true,
            },
          },
          {
            type: 'text',
            text: ` 的极简备忘录，帮你快速记录一些想法、灵感、emo 时刻，帮助你更好地管理自己的时间和记忆。

应用的数据完全存储在你的浏览器本地，不会上传到任何服务器上，也不会与任何第三方共享你的数据。
            
快去试试吧~ 如有问题，欢迎在 `,
            styles: {},
          },
          {
            type: 'link',
            href: 'https://github.com/codpoe/emola',
            content: [
              {
                type: 'text',
                text: 'GitHub',
                styles: {
                  backgroundColor: 'blue',
                  textColor: 'blue',
                },
              },
            ],
          },
          {
            type: 'text',
            text: ` 上联系我。`,
            styles: {},
          },
        ],
        children: [],
      },
    ],
    deleted: 0,
  });
}
