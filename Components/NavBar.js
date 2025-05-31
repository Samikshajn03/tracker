'use client';

import Link from 'next/link';
import { useState } from 'react';
import '../styles/Components/Navbar.scss'; 

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Overlay for blur effect */}
      {isOpen && <div className="nav-overlay" onClick={() => setIsOpen(false)}></div>}

      <nav className="navbar">
        <button onClick={() => setIsOpen(!isOpen)} className="nav-toggle">
          ☰
        </button>

        <div className="nav-container">
          <div className="nav-logo">
            <img src="/logo.png" className="logo" />
            <p className="nav-logo">Let's Travel</p>
          </div>

          <div className={`nav-menu ${isOpen ? 'open' : ''}`}>
            <Link href="/Dashboard" className="nav-link">
              Home
            </Link>
            <Link href="/ProfilePage" className="nav-link">
              Profile
            </Link>
            <Link href="/Map" className="nav-link">
              Map
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
