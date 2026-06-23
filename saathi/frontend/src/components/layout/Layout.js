import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ComfortRoom from '../wellness/ComfortRoom';
import { useSelector } from 'react-redux';

export default function Layout() {
  const { comfortRoomOpen } = useSelector(s => s.ui);
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--warm-white)' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: '32px', overflowY: 'auto', minHeight: '100vh' }}>
        <div className="page-enter">
          <Outlet />
        </div>
      </main>
      {comfortRoomOpen && <ComfortRoom />}
    </div>
  );
}
