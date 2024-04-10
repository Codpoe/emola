import 'shadcn-react/style.css';
import './layout.css';
import { Helmet, Outlet } from 'servite/client';
import { Toaster } from 'shadcn-react';
import { ThemeProvider } from '@/components/ThemeProvider';

export default function Layout() {
  return (
    <>
      <Helmet>
        <title>Emola</title>
      </Helmet>
      <ThemeProvider>
        <Toaster />
        <Outlet />
      </ThemeProvider>
    </>
  );
}
