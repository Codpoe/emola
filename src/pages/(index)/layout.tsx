import { Outlet } from 'servite/client';
import { Button } from 'shadcn-react';
import { GithubIcon } from 'shadcn-react/icons';
import { Sidebar } from '@/components/Sidebar';

export default function Layout() {
  return (
    <div>
      <header className="w-screen h-16 sticky top-0 bg-background/80 backdrop-blur z-20">
        <div className="max-w-5xl h-full mx-auto px-6 flex items-center">
          <h1 className="px-7 text-lg text-primary font-semibold">Emola</h1>
          <a
            className="ml-auto"
            href="https://flomoapp.com/"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="link">flomo</Button>
          </a>
          <a
            href="https://github.com/codpoe/emola"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="ghost" size="icon" icon={<GithubIcon />} />
          </a>
        </div>
      </header>
      <main className="max-w-5xl mx-auto mt-px px-6 flex gap-6 items-start">
        <Sidebar />
        <div className="flex-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
