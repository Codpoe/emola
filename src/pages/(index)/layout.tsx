import { Outlet, isBrowser } from 'servite/client';
import { Button, Popover } from 'shadcn-react';
import { GithubIcon, PaletteIcon } from 'shadcn-react/icons';
import { Sidebar } from '@/components/Sidebar';
import { ThemeCustomizer } from '@/components/ThemeCustomizer';

export default function Layout() {
  return (
    <div>
      <header className="w-screen h-16 sticky top-0 bg-background/80 backdrop-blur z-20">
        <div className="max-w-5xl h-full mx-auto px-6 flex items-center">
          <h1 className="px-7 text-lg text-foreground font-semibold">Emola</h1>
          <a
            className="ml-auto"
            href="https://flomoapp.com/"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="ghost">flomo</Button>
          </a>
          <a
            href="https://github.com/codpoe/emola"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="ghost" size="icon" icon={<GithubIcon />} />
          </a>
          <Popover className="w-80" content={isBrowser && <ThemeCustomizer />}>
            <Button
              variant="ghost"
              size="icon"
              icon={<PaletteIcon />}
              // Just for suppress the hydrate warning:
              // Prop `aria-controls` did not match. Server: "radix-:Rhl6:" Client: "radix-:R4d9:"
              aria-controls="radix-:Rhl6:"
            />
          </Popover>
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
