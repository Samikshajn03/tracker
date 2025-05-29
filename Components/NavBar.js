'use client';

import Link from 'next/link';
import { useState } from 'react';
import '../styles/Components/Navbar.scss'; 


export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (


    <nav className="navbar">
       <button onClick={() => setIsOpen(!isOpen)} className="nav-toggle">
          ☰
        </button>
      <div className="nav-container">
        <div className="nav-logo">
          <img src="/logo.png" className="logo"/>
          <p className='nav-logo'>Lets's Travel</p>
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
         <div>
        <img src= "/airplane.png" className='plane'/>
      </div>
      </div>
     
    </nav>
  );
}
