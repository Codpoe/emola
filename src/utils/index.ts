import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { IBlock } from '@/hooks/useEditor';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | number | Date, withSecond = false) {
  return format(date, withSecond ? 'yyyy-MM-dd hh:mm:ss' : 'yyyy-MM-dd');
}

export function downloadStringAsFile(
  content: string,
  contentType: string,
  fileName: string
) {
  const blob = new Blob([content], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');

  downloadLink.href = url;
  downloadLink.download = fileName;

  // 下载
  document.body.appendChild(downloadLink);
  downloadLink.click();

  // 清理
  document.body.removeChild(downloadLink);
  window.URL.revokeObjectURL(url);
}

export function trimDoc(doc?: IBlock[]): IBlock[] {
  if (!doc?.length) {
    return [];
  }

  let i = doc.length - 1;

  while (i >= 0) {
    if (
      doc[i].type === 'paragraph' &&
      !doc[i].children.length &&
      !(doc[i].content as any)?.length
    ) {
      i--;
    } else {
      break;
    }
  }

  return doc.slice(0, i + 1);
}

export function trimDocText(docText: string): string {
  return docText.replace(/\s/g, '').toLowerCase();
}
