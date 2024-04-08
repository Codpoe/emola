import 'shadcn-react/style.css';
import './layout.css';
import { Helmet, Outlet } from 'servite/client';
import { Toaster } from 'shadcn-react';

export default function Layout() {
  return (
    <>
      <Helmet>
        <title>Emola</title>
      </Helmet>
      <Toaster />
      <Outlet />
    </>
  );
}
